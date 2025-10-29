(function(){
  var DB_NAME = 'simac_preventivi';
  var DB_VER = 1;
  var STORE = 'items';
  var useLocal = false;

  function openDB(){
    return new Promise(function(res, rej){
      try{
        var r = indexedDB.open(DB_NAME, DB_VER);
        r.onupgradeneeded = function(ev){
          var db = ev.target.result;
          if(!db.objectStoreNames.contains(STORE)){
            var os = db.createObjectStore(STORE, { keyPath: 'id' });
            os.createIndex('by_agent', 'agente_id', { unique: false });
            os.createIndex('by_created', 'created_at', { unique: false });
          }
        };
        r.onsuccess = function(){ res(r.result); };
        r.onerror = function(){ useLocal = true; res(null); };
      }catch(e){ useLocal = true; res(null); }
    });
  }
  function tx(db, mode){ return db.transaction(STORE, mode).objectStore(STORE); }

  function lsAll(){ try{ return JSON.parse(localStorage.getItem(DB_NAME) || '[]'); }catch(_){ return []; } }
  function lsSet(arr){ try{ localStorage.setItem(DB_NAME, JSON.stringify(arr)); }catch(_){ } }

  async function savePreventivo(record){
    var db = await openDB();
    if(!record.id){ record.id = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,8); }
    record.updated_at = new Date().toISOString();
    if(!record.created_at) record.created_at = record.updated_at;
    if(useLocal || !db){
      var arr = lsAll();
      var idx = arr.findIndex(function(x){ return x.id===record.id; });
      if(idx>=0) arr[idx]=record; else arr.push(record);
      lsSet(arr);
      return record;
    }
    return await new Promise(function(res, rej){
      var req = tx(db, 'readwrite').put(record);
      req.onsuccess = function(){ res(record); };
      req.onerror = function(){ useLocal=true; var arr=lsAll(); var i=arr.findIndex(function(x){return x.id===record.id;}); if(i>=0) arr[i]=record; else arr.push(record); lsSet(arr); res(record); };
    });
  }
  async function getPreventivo(id){
    var db = await openDB();
    if(useLocal || !db){ return lsAll().find(function(x){return x.id===id;}) || null; }
    return await new Promise(function(res, rej){
      var req = tx(db, 'readonly').get(id);
      req.onsuccess = function(){ res(req.result||null); };
      req.onerror = function(){ res(lsAll().find(function(x){return x.id===id;})||null); };
    });
  }
  async function listPreventivi(filter){
    var db = await openDB();
    if(useLocal || !db){
      var all = lsAll();
      if(filter && filter.agente_id){ all = all.filter(function(v){ return v.agente_id===filter.agente_id; }); }
      return all.sort(function(a,b){ return (b.created_at||'').localeCompare(a.created_at||''); });
    }
    return await new Promise(function(res, rej){
      var out = [];
      var req = tx(db, 'readonly').openCursor();
      req.onsuccess = function(ev){
        var cursor = ev.target.result;
        if(cursor){
          var v = cursor.value;
          if(!filter || !filter.agente_id || filter.agente_id===v.agente_id){ out.push(v); }
          cursor.continue();
        } else { res(out.sort(function(a,b){ return (b.created_at||'').localeCompare(a.created_at||''); })); }
      };
      req.onerror = function(){ res(lsAll()); };
    });
  }
  async function deletePreventivo(id){
    var db = await openDB();
    if(useLocal || !db){ var arr=lsAll().filter(function(x){return x.id!==id;}); lsSet(arr); return true; }
    return await new Promise(function(res, rej){
      var req = tx(db, 'readwrite').delete(id);
      req.onsuccess = function(){ res(true); };
      req.onerror = function(){ var arr=lsAll().filter(function(x){return x.id!==id;}); lsSet(arr); res(true); };
    });
  }

  function readFormData(form){
    var data = { fields: {}, meta: {} };
    try{
      // inputs/selects/textarea by name
      (form.querySelectorAll('input, select, textarea')||[]).forEach(function(el){
        var name = el.name || el.id || '';
        if(!name) return;
        var type = (el.type||'').toLowerCase();
        var val;
        if(type==='checkbox') val = !!el.checked;
        else if(type==='radio'){ if(el.checked) val = el.value; else return; }
        else val = el.value;
        data.fields[name] = val;
      });
      // some computed outputs from DOM
      function txt(sel){ var e=document.querySelector(sel); return (e&&(e.textContent||e.value||'')).toString().trim(); }
      data.meta.ben_prezzo_netto = txt('#ben_prezzo_netto');
      data.meta.ben_investimento = txt('#ben_investimento');
      data.meta.ben_detrazione = txt('#ben_detrazione');
      data.meta.ben_rientro = txt('#ben_rientro');
      data.meta.result_kw_annuo = txt('#result_kw_annuo');
      // agente
      data.agente_id = (document.getElementById('fk_edp_hidden')||{}).value || (document.getElementById('fk_agente_hidden')||{}).value || '';
      // title for listing
      var nome = data.fields['nome'] || '';
      var cognome = data.fields['cognome'] || '';
      var azienda = data.fields['denominazione'] || '';
      var full = (azienda || (nome + ' ' + cognome)).trim();
      data.title = full || 'Preventivo';
      data.created_at = new Date().toISOString();
    }catch(e){}
    return data;
  }

  function populateForm(form, record){
    if(!record || !record.fields) return;
    Object.keys(record.fields).forEach(function(k){
      var v = record.fields[k];
      var el = form.querySelector('[name="'+CSS.escape(k)+'"]') || document.getElementById(k);
      if(!el) return;
      var type=(el.type||'').toLowerCase();
      if(type==='checkbox') el.checked = !!v;
      else if(type==='radio'){
        var r = form.querySelector('[name="'+CSS.escape(k)+'"][value="'+CSS.escape(String(v))+'"]');
        if(r) r.checked = true;
      } else { el.value = v==null? '' : String(v); el.setAttribute('value', el.value); }
    });
    // trigger change for materialize selects where possible
    try{ if(window.M && M.FormSelect){ document.querySelectorAll('select').forEach(function(s){ var inst=M.FormSelect.getInstance(s); if(inst&&inst.destroy) inst.destroy(); M.FormSelect.init(s); }); } }catch(_){ }
  }

  function getQueryParam(name){ try{ return new URLSearchParams(location.search).get(name); }catch(_){ return null; } }

  async function initContrattoPage(){
    var form = document.getElementById('contratto_fotovoltaico_form');
    if(!form) return;
    var saving = false;
    async function performSave(e){
      if(saving) return false;
      saving = true;
      try{ if(e){ try{ e.preventDefault(); e.stopPropagation(); if(e.stopImmediatePropagation) e.stopImmediatePropagation(); }catch(_){} } }catch(_){ }
      try{ form.setAttribute('data-preventivo-save','1'); }catch(_){ }
      var rec = readFormData(form);
      try{
        if(window.Auth){
          var s=Auth.get();
          if(s){
            if(s.agente_id||s.email) rec.agente_id = s.agente_id||s.email;
            if(s.agente) rec.agente = s.agente;
            if(s.area_manager) rec.area_manager = s.area_manager;
            if(s.ruolo) rec.ruolo_creatore = s.ruolo;
          }
        }
      }catch(_){ }
      var saved = await savePreventivo(rec);
      try{ sessionStorage.setItem('simac_last_saved_id', saved && saved.id ? saved.id : ''); }catch(_){ }
      try{ if(window.M && M.toast){ M.toast({html:'Preventivo salvato', displayLength:900}); } }catch(_){ }
      try{ window.location.href='/preventivatore/mirror/i-miei-preventivi.html'; }catch(_){ }
      return false;
    }
    // wire Save button (prefer specific selector if present)
    var saveBtn = document.querySelector('#contratto_fotovoltaico_form button.btn.waves-effect.waves-light:nth-of-type(1)') ||
                  Array.prototype.slice.call(document.querySelectorAll('button')).find(function(b){ return /salva/i.test(b.textContent||''); }) ||
                  document.querySelector('#contratto_fotovoltaico_form button[type="submit"]');
    if(saveBtn){
      try{ saveBtn.setAttribute('type','button'); }catch(_){ }
      // Try to remove any existing jQuery handlers on the form/save
      try{
        if(window.jQuery){
          try{ jQuery(form).off('submit'); }catch(_){ }
          try{ jQuery(saveBtn).off('click'); }catch(_){ }
        }
      }catch(_){ }
      saveBtn.addEventListener('click', performSave, true);
    }
    // new explicit save button removed
    // intercept any form submit
    form.addEventListener('submit', function(e){ performSave(e); }, true);
    // global capture fallback: intercept any submit buttons labelled Salva
    document.addEventListener('click', function(e){
      var t = e.target;
      if(!t) return;
      var btn = t.closest && t.closest('button, input[type="submit"]');
      if(!btn) return;
      var label = (btn.textContent||btn.value||'').trim();
      if(/^(salva)$/i.test(label)){
        performSave(e);
      }
    }, true);
    // load by id if present
    var pid = getQueryParam('prevId');
    if(pid){
      try{ var rec = await getPreventivo(pid); if(rec){ populateForm(form, rec); } }catch(_){ }
    }
  }

  function fmtDate(iso){ try{ var d=new Date(iso); return d.toLocaleString(); }catch(_){ return iso||''; } }

  async function mountList(){
    var table = document.getElementById('preventivi_table');
    if(!table) return;
    var sess = null; try{ if(window.Auth) sess = Auth.get(); }catch(_){ }
    var rows = await listPreventivi({});
    // Apply role-based filtering (fallback: if no ruolo, filter by agente_id)
    try{
      if(sess){
        var ruolo = String(sess.ruolo||'').toLowerCase();
        var email = (sess.agente_id||sess.email||'').toLowerCase();
        var am = String(sess.area_manager||'').trim();
        if(!ruolo){
          // Fallback: treat as agente
          rows = rows.filter(function(r){ return (r.agente_id||'').toLowerCase() === email; });
        } else if(ruolo === 'azienda' || ruolo === 'direzione commerciale' || ruolo === 'direzione commerciale '){
          // see all
        } else if(ruolo === 'area manager' || ruolo === 'areamanager'){
          rows = rows.filter(function(r){
            var rid=(r.agente_id||'').toLowerCase();
            var ram=(r.area_manager||'').trim();
            return rid===email || (am && ram===am);
          });
        } else { // agente
          rows = rows.filter(function(r){ return (r.agente_id||'').toLowerCase() === email; });
        }
      }
    }catch(_){ }
    var tbody = table.querySelector('tbody'); if(!tbody){ tbody = document.createElement('tbody'); table.appendChild(tbody); }
    tbody.innerHTML = '';
    if(!rows || !rows.length){
      var tr=document.createElement('tr'); var td=document.createElement('td'); td.colSpan=3; td.style.textAlign='center'; td.textContent='Nessun preventivo salvato'; tr.appendChild(td); tbody.appendChild(tr);
      try{ if(window.M && M.toast){ M.toast({html:'Nessun preventivo in archivio', displayLength:1200}); } }catch(_){ }
      return;
    }
    rows.forEach(function(r){
      var tr=document.createElement('tr');
      var tdTitle=document.createElement('td'); tdTitle.textContent = r.title || '-';
      var tdDate=document.createElement('td'); tdDate.textContent = fmtDate(r.created_at);
      var tdActions=document.createElement('td');
      var open=document.createElement('button'); open.className='btn'; open.textContent='Apri'; open.addEventListener('click', function(){ window.location.href='/preventivatore/mirror/fv/contratto-fotovoltaico.html?prevId='+encodeURIComponent(r.id); });
      var dup=document.createElement('button'); dup.className='btn'; dup.style.marginLeft='6px'; dup.textContent='Duplica'; dup.addEventListener('click', async function(){ var c=JSON.parse(JSON.stringify(r)); delete c.id; c.created_at=new Date().toISOString(); await savePreventivo(c); mountList(); });
      var del=document.createElement('button'); del.className='btn red'; del.style.marginLeft='6px'; del.textContent='Elimina'; del.addEventListener('click', async function(){ if(confirm('Eliminare preventivo?')){ await deletePreventivo(r.id); mountList(); }});
      tdActions.appendChild(open); tdActions.appendChild(dup); tdActions.appendChild(del);
      tr.appendChild(tdTitle); tr.appendChild(tdDate); tr.appendChild(tdActions);
      tbody.appendChild(tr);
    });
    // highlight last saved if present
    try{
      var last = sessionStorage.getItem('simac_last_saved_id') || '';
      if(last){
        if(window.M && M.toast){ M.toast({html:'Preventivi caricati: '+rows.length, displayLength:1000}); }
        // basic highlight first row (newest first)
        var first = tbody.querySelector('tr'); if(first){ first.style.background='#e8f5e9'; setTimeout(function(){ first.style.background=''; }, 1500); }
        sessionStorage.removeItem('simac_last_saved_id');
      } else {
        if(window.M && M.toast){ M.toast({html:'Preventivi caricati: '+rows.length, displayLength:900}); }
      }
    }catch(_){ }
  }

  function installListPage(){
    var listRoot = document.getElementById('i-miei-preventivi-root');
    if(!listRoot) return;
    if(!document.getElementById('preventivi_table')){
      listRoot.innerHTML = '<div id="preventivi_status" style="margin-bottom:8px; color:#2e7d32;">Lista attiva</div>'+
        '<table id="preventivi_table" class="striped responsive-table"><thead><tr><th>Titolo</th><th>Data</th><th>Azioni</th></tr></thead><tbody></tbody></table>'+
        '<div style="margin-top:12px;"><button id="export_json" class="btn">Export JSON</button> <input id="import_file" type="file" accept="application/json" style="display:none;"/> <button id="import_json" class="btn" style="margin-left:6px;">Import JSON</button></div>';
    }
    document.getElementById('export_json').addEventListener('click', async function(){
      var sess = null; try{ if(window.Auth) sess = Auth.get(); }catch(_){ }
      var arr=await listPreventivi({});
      try{
        if(sess && sess.ruolo){
          var ruolo = String(sess.ruolo||'').toLowerCase();
          var email = (sess.agente_id||sess.email||'').toLowerCase();
          var am = String(sess.area_manager||'').trim();
          if(ruolo === 'azienda' || ruolo === 'direzione commerciale' || ruolo === 'direzione commerciale '){
            // all
          } else if(ruolo === 'area manager' || ruolo === 'areamanager'){
            arr = arr.filter(function(r){
              var rid=(r.agente_id||'').toLowerCase();
              var ram=(r.area_manager||'').trim();
              return rid===email || (am && ram===am);
            });
          } else {
            arr = arr.filter(function(r){ return (r.agente_id||'').toLowerCase() === email; });
          }
        }
      }catch(_){ }
      var blob=new Blob([JSON.stringify(arr,null,2)], {type:'application/json'}); var url=URL.createObjectURL(blob); var a=document.createElement('a'); a.href=url; a.download='preventivi.json'; a.click(); setTimeout(function(){ URL.revokeObjectURL(url); }, 1000);
    });
    document.getElementById('import_json').addEventListener('click', function(){ document.getElementById('import_file').click(); });
    document.getElementById('import_file').addEventListener('change', async function(ev){ var f=ev.target.files[0]; if(!f) return; var txt=await f.text(); try{ var arr=JSON.parse(txt); if(Array.isArray(arr)){ for(var i=0;i<arr.length;i++){ var r=arr[i]; delete r.id; await savePreventivo(r); } } }catch(e){} mountList(); });
    mountList();
  }

  function init(){
    try{ initContrattoPage(); }catch(_){ }
    try{ installListPage(); }catch(_){ }
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
  window.PreventiviDB = { save: savePreventivo, list: listPreventivi, get: getPreventivo, del: deletePreventivo };
})();
