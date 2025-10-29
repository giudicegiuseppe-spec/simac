#!/usr/bin/env python3
import os, re, sys, time, urllib.parse, pathlib, mimetypes
import requests
from http.cookiejar import MozillaCookieJar
from bs4 import BeautifulSoup

START_URL = 'https://share.unionenergia.it/fv/contratto-fotovoltaico'
BASE_DOMAIN = 'share.unionenergia.it'
ALLOW_PREFIX = '/fv/'
OUT_DIR = 'mirror'
MAX_DEPTH = 5

def load_session(cookies_path):
    s = requests.Session()
    cj = MozillaCookieJar()
    cj.load(cookies_path, ignore_discard=True, ignore_expires=True)
    s.cookies = cj
    s.headers.update({
        'User-Agent': 'Mozilla/5.0 (Macintosh) CascadeMirror/1.0',
        'Accept': '*/*',
    })
    return s

def norm_path_from_url(url):
    p = urllib.parse.urlparse(url)
    path = p.path or '/index.html'
    if path.endswith('/'):
        path += 'index.html'
    # If no file extension, treat it as an HTML page
    _, ext = os.path.splitext(path)
    if not ext:
        path += '.html'
    return (p.netloc + path).lstrip('/')

def ensure_dir(path):
    pathlib.Path(path).parent.mkdir(parents=True, exist_ok=True)

def is_same_scope(u):
    p = urllib.parse.urlparse(u)
    if p.netloc != BASE_DOMAIN: return False
    return (p.path or '/').startswith(ALLOW_PREFIX)

def should_fetch(u):
    # Avoid data:, mailto:, javascript:
    if not u:
        return False
    lu = u.strip()
    if lu.startswith('data:') or lu.startswith('mailto:') or lu.startswith('javascript:'):
        return False
    return lu.startswith('http://') or lu.startswith('https://')

def local_href_from_url(u):
    # Build an absolute path rooted at the local web server document root
    # so links work regardless of the current HTML nesting level.
    rel = norm_path_from_url(u)  # e.g. 'share.unionenergia.it/css/b.css'
    # Our server serves the project root; mirror output lives under '/mirror'.
    return f"/mirror/{rel}"

def rewrite_links(html, page_url):
    soup = BeautifulSoup(html, 'html.parser')
    attrs = [('a','href'),('link','href'),('script','src'),('img','src'),('source','src'),('video','poster')]
    for tag, attr in attrs:
        for el in soup.find_all(tag):
            val = el.get(attr)
            if not val: continue
            # Resolve relative to page_url
            absu = urllib.parse.urljoin(page_url, val)
            if not should_fetch(absu):
                continue
            if tag == 'a':
                # Only rewrite navigational links if same scope (/fv on BASE_DOMAIN)
                if is_same_scope(absu):
                    el[attr] = local_href_from_url(absu)
            else:
                # Always rewrite asset references to local mirror
                el[attr] = local_href_from_url(absu)
    return str(soup)

def guess_filename_from_headers(resp, url):
    cd = resp.headers.get('content-disposition','')
    m = re.search(r'filename="?([^\";]+)"?', cd, re.I)
    if m:
        return m.group(1)
    path = norm_path_from_url(url)
    return path

CSS_URL_RE = re.compile(r'url\(\s*[\'\"]?(.*?)[\'\"]?\s*\)', re.IGNORECASE)

def _rewrite_css_and_collect(css_text, css_base_url):
    refs = []
    def repl(m):
        raw = m.group(1)
        absu = urllib.parse.urljoin(css_base_url, raw)
        if should_fetch(absu):
            refs.append(absu)
            return f"url({local_href_from_url(absu)})"
        return m.group(0)
    new_css = CSS_URL_RE.sub(repl, css_text)
    return new_css, refs

def fetch_asset(s, url, out_root):
    try:
        r = s.get(url, timeout=30, allow_redirects=True)
        if r.status_code != 200:
            return None
        rel = guess_filename_from_headers(r, url)
        out_path = os.path.join(out_root, rel)
        ensure_dir(out_path)
        ctype = r.headers.get('content-type','').lower()
        if 'text/css' in ctype or rel.lower().endswith('.css'):
            text = r.text
            rewritten, refs = _rewrite_css_and_collect(text, r.url)
            with open(out_path, 'w', encoding='utf-8') as f:
                f.write(rewritten)
            # Fetch nested CSS assets (fonts/images)
            for ref in refs[:1000]:
                fetch_asset(s, ref, out_root)
        else:
            with open(out_path, 'wb') as f:
                f.write(r.content)
        return out_path
    except Exception as e:
        return None

def extract_links(html, page_url):
    soup = BeautifulSoup(html, 'html.parser')
    links = set()
    assets = set()
    def add(u):
        if not should_fetch(u):
            return
        if is_same_scope(u):
            links.add(u)
    for a in soup.find_all('a', href=True):
        add(urllib.parse.urljoin(page_url, a['href']))
    for el, attr in [('link','href'),('script','src'),('img','src'),('source','src'),('video','poster')]:
        for x in soup.find_all(el):
            v = x.get(attr)
            if not v: continue
            absu = urllib.parse.urljoin(page_url, v)
            # For assets, include any absolute http(s) URL (cross-domain OK)
            if should_fetch(absu):
                assets.add(absu)
    return links, assets

def crawl(s, start_url, out_root, max_depth):
    seen_pages = set()
    q = [(start_url, 0)]
    while q:
        url, d = q.pop(0)
        if url in seen_pages or d > max_depth: continue
        seen_pages.add(url)
        try:
            resp = s.get(url, timeout=30, allow_redirects=True)
            if resp.status_code != 200:
                continue
            html = resp.text
            # First download assets referenced on this page
            links, assets = extract_links(html, resp.url)
            for a in list(assets)[:1000]:
                fetch_asset(s, a, out_root)
            # Rewrite links to local
            html_local = rewrite_links(html, resp.url)
            # Save page
            rel = norm_path_from_url(resp.url)
            out_path = os.path.join(out_root, rel)
            ensure_dir(out_path)
            with open(out_path, 'w', encoding='utf-8') as f:
                f.write(html_local)
            # Enqueue child pages
            for l in links:
                if l not in seen_pages:
                    q.append((l, d+1))
        except Exception:
            pass

def main():
    cookies_path = 'cookies.txt'
    out_root = OUT_DIR
    os.makedirs(out_root, exist_ok=True)
    s = load_session(cookies_path)
    crawl(s, START_URL, out_root, MAX_DEPTH)
    # Create local index redirect
    idx = os.path.join(out_root, 'index.html')
    target_full = norm_path_from_url(START_URL)
    target = target_full.split(BASE_DOMAIN + '/')[1] if ('/' in target_full) else target_full
    with open(idx, 'w', encoding='utf-8') as f:
        f.write(f'<meta http-equiv="refresh" content="0; url=./{target}">')
    # Create a shorter path copy: mirror/fv/* -> mirror/share.unionenergia.it/fv/*
    short_src = os.path.join(out_root, 'share.unionenergia.it', 'fv')
    short_dst_root = os.path.join(out_root, 'fv')
    if os.path.isdir(short_src):
        for root, dirs, files in os.walk(short_src):
            rel_root = os.path.relpath(root, short_src)
            dst_dir = os.path.join(short_dst_root, rel_root)
            os.makedirs(dst_dir, exist_ok=True)
            for name in files:
                src_file = os.path.join(root, name)
                dst_file = os.path.join(dst_dir, name)
                try:
                    # Copy file bytes
                    with open(src_file, 'rb') as sf, open(dst_file, 'wb') as df:
                        df.write(sf.read())
                except Exception:
                    pass
if __name__ == '__main__':
    main()
