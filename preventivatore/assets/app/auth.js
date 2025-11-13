(function(){
  var KEY = 'simac_session_v1';
  var CSV_CANDIDATES = [
    '/preventivatore/user.csv'
  ];
  var USERS_CACHE = null;
  try{ if(typeof window !== 'undefined' && window.AUTH_FORCE_RELOAD == null){ window.AUTH_FORCE_RELOAD = true; } }catch(_){ }
  function setSession(sess){ try{ localStorage.setItem(KEY, JSON.stringify(sess||{})); }catch(_){ } }
  function getSession(){ try{ var s = JSON.parse(localStorage.getItem(KEY)||'{}'); return s && typeof s==='object'? s : {}; }catch(_){ return {}; } }
  function clearSession(){ try{ localStorage.removeItem(KEY); }catch(_){ } }
  function isLogged(){ var s=getSession(); return !!(s && (s.email||s.agente_id)); }
  function requireAuth(){ if(!isLogged()){ try{ window.location.href = '/preventivatore/mirror/'; }catch(_){ } return false; } return true; }
  function normalizeEmail(e){ return String(e||'').trim().toLowerCase(); }
  function detectDelim(sample){
    var semi=(sample.match(/;/g)||[]).length;
    var comma=(sample.match(/,/g)||[]).length;
    var tab=(sample.match(/\t/g)||[]).length;
    if(tab>=semi && tab>=comma) return '\t';
    return semi>comma?';':',';
  }
  function splitCSVLine(line, delim){ var res=[], cur='', inq=false; for(var i=0;i<line.length;i++){ var c=line[i]; if(c==='"'){ inq=!inq; /* non append quote to cur */ } else if(c===delim && !inq){ res.push(cur); cur=''; } else { cur+=c; } } res.push(cur); return res; }
  function cleanField(v){ return String(v==null? '': v).replace(/^\uFEFF/, '').replace(/^\s+|\s+$/g,''); }
  function parseCSV(text){
    try{
      text = String(text||'').replace(/\uFEFF/g,'').replace(/\r\n/g,'\n').replace(/\r/g,'\n');
      var lines = text.split('\n').filter(function(l){ return l!=null && l!==''; });
      if(!lines.length) return [];
      var delim = detectDelim(lines[0]);
      var rows = lines.map(function(l){ return splitCSVLine(l,delim); });
      var start = 0; var hdr = rows[0].map(function(h){ return cleanField(h).toLowerCase(); });
      if(hdr.join(',').indexOf('ruolo')>-1 || hdr.join(',').indexOf('mail')>-1){ start = 1; }
      var out = [];
      for(var i=start;i<rows.length;i++){
        var r=rows[i]; if(!r || r.length<2) continue;
        var ruolo = cleanField(r[0]);
        var mail  = cleanField(r[1]);
        var pass  = cleanField(r[2]);
        var nome  = cleanField(r[3]);
        var am    = cleanField(r[4]);
        if(!mail) continue;
        out.push({ email: normalizeEmail(mail), password: pass, agente:nome, area_manager:am, ruolo:ruolo });
      }
      return out;
    }catch(e){ return []; }
  }
  var LAST_LOAD = { url:null, count:0 };
  async function loadUsers(){
    if(USERS_CACHE && !(typeof window!=='undefined' && window.AUTH_FORCE_RELOAD)) return USERS_CACHE;
    async function tryLoad(url){
      try{
        // Cache-busting: append a version param so CDN/browser always fetch latest CSV
        var fullUrl;
        try {
          var u = new URL(url, window.location.origin);
          // Use explicit version if provided, otherwise timestamp
          var v = (window.AUTH_CSV_VERSION || Date.now());
          u.searchParams.set('v', v);
          fullUrl = u.toString();
        } catch(_) {
          var sep = (url.indexOf('?')>-1?'&':'?');
          fullUrl = url + sep + 'v=' + String(Date.now());
        }
        var rc = await fetch(fullUrl, {cache:'no-cache'});
        if(!rc.ok) return [];
        var text = await rc.text();
        return parseCSV(text);
      }catch(e){ return []; }
    }
    var list = [];
    for(var idx=0; idx<CSV_CANDIDATES.length; idx++){
      var url = CSV_CANDIDATES[idx];
      list = await tryLoad(url);
      LAST_LOAD.url = url; LAST_LOAD.count = list.length;
      if(list.length) break;
    }
    if(list.length){ USERS_CACHE = list; try{ if(typeof window!=='undefined'){ window.AUTH_FORCE_RELOAD = false; } console.log('[Auth] Utenti caricati:', list.length, 'da', LAST_LOAD.url); }catch(_){ } return USERS_CACHE; }
    // No fallback: senza CSV l'elenco utenti è vuoto
    USERS_CACHE = [];
    return USERS_CACHE;
  }
  function applyAgentToDom(){ try{
    var s=getSession(); if(!s) return;
    // hidden ids
    var hid1=document.getElementById('fk_edp_hidden'); if(hid1) hid1.value = s.agente_id||s.email||'';
    var hid2=document.getElementById('fk_agente_hidden'); if(hid2) hid2.value = s.agente_id||s.email||'';

    // Area Manager: prova a trovare input-field con label che contiene "Area Manager"
    try{
      var amLabel = Array.from(document.querySelectorAll('label')).find(function(l){ return /area\s*manager/i.test(l.textContent||''); });
      if(amLabel){
        var amField = amLabel.closest('.input-field');
        if(amField){
          // Materialize: select + .select-wrapper > input.select-dropdown
          var sel = amField.querySelector('select');
          var val = s.area_manager||'';
          if(sel && val){
            var opt = Array.from(sel.options).find(function(o){ return (o.value||o.textContent||'')===val; });
            if(!opt){ opt = document.createElement('option'); opt.value=val; opt.textContent=val; sel.appendChild(opt); }
            sel.value = val;
            sel.setAttribute('value', val);
            try{ sel.dispatchEvent(new Event('change', {bubbles:true})); }catch(_){ }
            try{ if(window.M && M.FormSelect){ M.FormSelect.init(sel); } }catch(_){ }
          }
          var dd = amField.querySelector('input.select-dropdown');
          if(dd && val){ dd.value = val; dd.setAttribute('value', val); }
        }
      }
    }catch(_){ }
  // Ensure an 'Agenda' link exists in the sidebar above 'Listini'
  function ensureAgendaLink(){
    try{
      var side = document.getElementById('sidenav');
      if(!side) return;
      // Already present?
      if(side.querySelector('a[href="/preventivatore/mirror/agenda.html"]')) return;
      // Find Listini item to insert before
      var listiniA = side.querySelector('a[href="/preventivatore/mirror/listini.html"]');
      var li = document.createElement('li');
      li.className = 'agenda-link';
      li.innerHTML = '<a href="/preventivatore/mirror/agenda.html"><i class="material-icons left">event</i> Agenda</a>';
      if(listiniA && listiniA.parentNode){
        listiniA.parentNode.parentNode.insertBefore(li, listiniA.parentNode);
      } else {
        // Fallback: insert after the divider if found, else append near top
        var firstLi = side.querySelector('li');
        if(firstLi && firstLi.parentNode){ firstLi.parentNode.insertBefore(li, firstLi.nextSibling); }
        else { side.appendChild(li); }
      }
    }catch(_){ }
  }
  // Intercept click on Agenda to open inline within #wrap using an iframe
  function wireAgendaInline(){
    try{
      var side = document.getElementById('sidenav'); if(!side) return;
      side.addEventListener('click', function(e){
        var a = e.target && (e.target.closest? e.target.closest('a[href="/preventivatore/mirror/agenda.html"]') : null);
        if(!a) return;
        var wrap = document.getElementById('wrap');
        if(!wrap) return; // allow normal navigation on pages without container
        e.preventDefault();
        // Build inline view
        var v = 'inline-'+Date.now();
        var header = ''+
          '<section class="section-bg title">'+
          '  <div class="title-wrap">'+
          '    <a class="sidenav-trigger hide_please" data-target="sidenav" href="#"><i class="material-icons menu-icon">menu</i></a>'+
          '    <a class="hide_please home-link" href="#">'+
          '      <img alt="" class="page-title-logo" src="/logo.png" title="">'+
          '    </a>'+
          '    <h1 class="padding-container">Agenda</h1>'+
          '  </div>'+
          '</section>';
        var content = ''+
          '<section class="section padding-container white-bg">'+
          '  <div class="row">'+
          '    <div class="col s12">'+
          '      <iframe src="/preventivatore/mirror/agenda.html?v='+v+'" style="width:100%;height:85vh;border:0;border-radius:8px;background:#fff;"></iframe>'+
          '    </div>'+
          '  </div>'+
          '</section>';
        wrap.innerHTML = header + content;
        try{ window.scrollTo({top:0, behavior:'smooth'}); }catch(_){ }
        // Mark active
        try{
          side.querySelectorAll('a').forEach(function(n){ n.classList.remove('active'); });
          a.classList.add('active');
        }catch(_){ }
      }, true);
    }catch(_){ }
  }
    // Agente: label che contiene "Agente" e input collegato
    try{
      var agLabel = Array.from(document.querySelectorAll('label')).find(function(l){ return /agente/i.test(l.textContent||''); });
      if(agLabel){
        var agField = agLabel.closest('.input-field');
        var agInput = agField && agField.querySelector('input, select, textarea');
        if(agInput){
          var valA = s.agente||s.nome||s.email||'';
          agInput.value = valA;
          agInput.setAttribute('value', valA);
          try{ agInput.setAttribute('readonly','readonly'); }catch(_){ }
        }
      }
    }catch(_){ }
  }catch(_){ }
  }

  function cleanupSponsorSection(){ try{
    var row = document.querySelector('div.row');
    if(!row) return;
    var sponsor = row.querySelector('section.sponsor.col.s12.form-section');
    if(sponsor && sponsor.parentNode){ sponsor.parentNode.removeChild(sponsor); }
  }catch(_){ }

  function renderSidebarUser(){ try{
    var s = getSession(); if(!s) return;
    var side = document.querySelector('.sidenav .sidenav-profile-wrap');
    if(!side) return;
    var exist = side.querySelector('.auth-user-box'); if(exist) exist.remove();
    var box = document.createElement('div'); box.className='auth-user-box'; box.style.marginTop='8px';
    var ruolo = (s.ruolo||'').toString(); if(ruolo){ ruolo = ruolo.charAt(0).toUpperCase()+ruolo.slice(1); }
    var agente = (s.agente||s.email||'-');
    // two link-like lines: Agente first, then Ruolo
    box.innerHTML = '<a href="#" class="user-line" onclick="return false;">'+agente+'</a>'+
                    '<a href="#" class="user-line" onclick="return false;">'+(ruolo||'-')+'</a>';
    // add clear session action
    var clearA = document.createElement('a');
    clearA.href = '#';
    clearA.className = 'user-line';
    clearA.textContent = 'Pulisci sessione';
    clearA.style.color = '#00c853';
    clearA.addEventListener('click', function(e){ e.preventDefault(); try{ localStorage.removeItem('simac_session_v1'); }catch(_){} try{ window.location.href='/preventivatore/mirror/'; }catch(_){ window.location.reload(); } }, true);
    box.appendChild(clearA);
    side.appendChild(box);
  }catch(_){ }
  async function loginWithCredentials(email, password){
    var users = await loadUsers();
    var em = normalizeEmail(email);
    var u = users.find(function(x){ return x.email===em && x.password===String(password||'').trim(); });
    if(!u) throw new Error('Credenziali non valide');
    var sess={ email: em, agente_id: em, agente: u.agente||em, area_manager: u.area_manager||'', ruolo: (u.ruolo||'').toLowerCase() };
    setSession(sess);
    return sess;
  }
  function logout(){ clearSession(); try{ window.location.href='/preventivatore/mirror/'; }catch(_){ } }
  // expose
  async function usersInfo(){ try{ var arr=await loadUsers(); return { count: arr.length, emails: arr.slice(0,5).map(function(u){ return u.email; }), url: LAST_LOAD.url }; }catch(e){ return {count:0, emails:[], url: LAST_LOAD.url||null}; } }
  function setUsersFromCSV(text){ try{ USERS_CACHE = parseCSV(text)||[]; LAST_LOAD.url = 'inline'; LAST_LOAD.count = USERS_CACHE.length; }catch(_){ USERS_CACHE = []; } }
  async function reloadUsers(){ try{ USERS_CACHE = null; if(typeof window!=='undefined'){ window.AUTH_FORCE_RELOAD = true; } return await loadUsers(); }catch(_){ return []; } }
  window.Auth = { setSession:setSession, get:getSession, clear:clearSession, isLogged:isLogged, require:requireAuth, applyAgentToDom:applyAgentToDom, cleanupSponsorSection:cleanupSponsorSection, renderSidebarUser:renderSidebarUser, login:loginWithCredentials, logout:logout, usersInfo:usersInfo, setUsersFromCSV:setUsersFromCSV, reloadUsers:reloadUsers };

  function bindExplicitLogout(){ try{
      // anchor with /logout already handled below; also bind icon and span inside top nav
      var icon = document.querySelector('#top_nav > li.hide-mobile.esci.right-li > a > i.material-icons');
      var span = document.querySelector('#top_nav > li.hide-mobile.esci.right-li > a > span');
      var a = document.querySelector('#top_nav li.hide-mobile.esci.right-li a'); if(a){ a.setAttribute('href','#'); a.style.cursor='pointer'; a.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); logout(); }, true); }
      [icon, span].forEach(function(el){ if(el){ el.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); logout(); }, true); }});
  }catch(_){ }
  }
  // intercept top logout link if present (anchor, icon, span)
  document.addEventListener('click', function(e){
    var a=e.target.closest && e.target.closest('a[href="/logout"]');
    var a2=e.target.closest && e.target.closest('#top_nav li.hide-mobile.esci.right-li a');
    if(a||a2){ e.preventDefault(); e.stopPropagation(); logout(); }
  }, true);
  function injectClearSessionButton(){
    try{
      if(document.getElementById('auth-clear-session')) return;
      // If sidebar exists, we already added the link there; but also add a floating fallback for pages without sidebar (e.g., login)
      var btn = document.createElement('a');
      btn.id = 'auth-clear-session';
      btn.href = '#';
      btn.textContent = 'Pulisci sessione';
      btn.style.position = 'fixed';
      btn.style.bottom = '12px';
      btn.style.right = '12px';
      btn.style.zIndex = '9999';
      btn.style.background = '#00c853';
      btn.style.color = '#fff';
      btn.style.padding = '8px 10px';
      btn.style.borderRadius = '6px';
      btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
      btn.style.fontSize = '12px';
      btn.style.textDecoration = 'none';
      btn.addEventListener('click', function(ev){ ev.preventDefault(); try{ localStorage.removeItem('simac_session_v1'); }catch(_){} try{ window.location.href='/preventivatore/mirror/'; }catch(_){ window.location.reload(); } }, true);
      document.body.appendChild(btn);
    }catch(_){ }
  }
  function maybeClearViaQuery(){
    try{
      var qs = new URLSearchParams(window.location.search||'');
      if(qs.has('clearSession')){
        try{ localStorage.removeItem('simac_session_v1'); }catch(_){ }
        try{ window.location.href = '/preventivatore/mirror/'; }catch(_){ window.location.reload(); }
        return true;
      }
    }catch(_){ }
    return false;
  }
  function ensureFavicon(){ try{ var link = document.querySelector('link[rel="icon"]'); if(!link){ link = document.createElement('link'); link.rel='icon'; link.type='image/png'; link.href='/logo.png'; document.head && document.head.appendChild(link); } else { link.type='image/png'; link.href='/logo.png'; } }catch(_){ } }
  function bootUI(){ try{ ensureFavicon(); if(!maybeClearViaQuery()){ bindExplicitLogout(); renderSidebarUser(); ensureAgendaLink(); wireAgendaInline(); injectClearSessionButton(); } }catch(_){ injectClearSessionButton(); } }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', bootUI); } else { bootUI(); }
})();
