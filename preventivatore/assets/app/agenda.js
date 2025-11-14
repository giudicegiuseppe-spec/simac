(function(){
  var API = '/.netlify/functions/agenda';

  function sess(){ try{ if(window.Auth&&Auth.get) return Auth.get(); }catch(_){ } try{ return JSON.parse(localStorage.getItem('simac_session_v1')||'{}'); }catch(_){ return {}; } }
  function canonRole(r){ r=String(r||'').trim().toLowerCase();
    if(r==='direzione'||r==='direzione  '||r==='dir' || r==='d.commerciale') return 'direzione commerciale';
    if(r==='area manager'||r==='area-manager'||r==='area_manager') return 'area manager';
    if(r==='areamanager') return 'areamanager';
    if(r==='azienda') return 'azienda';
    if(r==='agente') return 'agente';
    return r; }
  function headers(){ var s=sess()||{}; return { 'Content-Type':'application/json', 'x-simac-email': (s.agente_id||s.email||''), 'x-simac-role': canonRole(s.ruolo||''), 'x-simac-agente': (s.agente||''), 'x-simac-areamanager': (s.area_manager||'') }; }
  function isElevated(){ var r=String((sess().ruolo||'')).toLowerCase(); return r==='azienda'||r==='direzione commerciale'||r==='direzione commerciale '||r==='area manager'||r==='areamanager'; }

  async function fetchJSON(url, opts){
    var res = await fetch(url, opts||{});
    var text = await res.text();
    if(!res.ok){
      try{ var j=JSON.parse(text||'{}'); throw new Error(j.error || ('HTTP '+res.status)); }catch(_){ throw new Error(text || ('HTTP '+res.status)); }
    }
    try{ return JSON.parse(text||'{}'); }catch(_){ return {}; }
  }

  function fmtDT(dt){ try{ return new Date(dt).toLocaleString(); }catch(_){ return dt||''; } }
  function gmapsLink(q){ if(!q) return ''; return 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q); }

  async function loadAgents(){
    try{
      var url = '/preventivatore/user.csv';
      var v = (window.AUTH_CSV_VERSION || Date.now());
      var res = await fetch(url + '?v=' + v, {cache:'no-store'});
      if(!res.ok) return [];
      var txt = await res.text();
      txt = txt.replace(/\uFEFF/g,'').replace(/\r\n/g,'\n').replace(/\r/g,'\n');
      var lines = txt.split('\n').filter(Boolean);
      var out = [];
      for(var i=0;i<lines.length;i++){
        var parts = lines[i].split(';');
        if(parts.length<3) continue;
        var ruolo = (parts[0]||'').trim();
        var email = (parts[1]||'').trim().toLowerCase();
        var pass = (parts[2]||'').trim();
        var agente = (parts[3]||'').trim();
        var area_manager = (parts[4]||'').trim();
        // includo SOLO agenti e area manager nella tendina
        var r = ruolo.toLowerCase();
        if((r==='agente' || r==='area manager' || r==='areamanager') && email){
          out.push({ruolo:ruolo, email:email, label: (agente||email), area_manager:area_manager});
        }
      }
      return out;
    }catch(_){ return []; }
  }

  function fillAgentSelect(list){
    var sel = document.getElementById('ag_agente'); if(!sel) return;
    sel.innerHTML = '<option value=""></option>' + list.map(function(a){ return '<option value="'+a.email+'" data-name="'+(a.label||'')+'">'+(a.label||a.email)+'</option>'; }).join('');
    try{ if(window.M && M.FormSelect){ var inst=M.FormSelect.getInstance(sel); if(inst&&inst.destroy) inst.destroy(); M.FormSelect.init(sel); } }catch(_){ }
  }

  function getAgentNameByEmail(list, email){ email = (email||'').toLowerCase(); var f = list.find(function(a){ return a.email===email; }); return f? (f.label||email) : email; }

  async function createAppointment(){
    try{
      var cli = document.getElementById('ag_cli').value.trim();
      var start = document.getElementById('ag_start').value.trim();
      var agentEmail = document.getElementById('ag_agente').value.trim().toLowerCase();
      var luogo = document.getElementById('ag_luogo').value.trim();
      var stato = document.getElementById('ag_stato').value.trim() || 'Nuovo';
      if(!cli || !start || !agentEmail){ try{ if(window.M&&M.toast){ M.toast({html:'Compila Cliente, Data/Ora e Agente'}); } }catch(_){ } return; }
      var list = await loadAgents();
      var payload = { cliente: cli, start_at: start, agente_id: agentEmail, agente_name: getAgentNameByEmail(list, agentEmail), luogo: luogo, stato: stato };
      await fetchJSON(API, { method:'POST', headers: headers(), body: JSON.stringify(payload) });
      await mountList();
      try{ if(window.M&&M.toast){ M.toast({html:'Appuntamento creato'}); } }catch(_){ }
      // reset minimo
      try{ document.getElementById('ag_cli').value=''; document.getElementById('ag_luogo').value=''; if(window.M&&M.updateTextFields) M.updateTextFields(); }catch(_){ }
    }catch(e){
      console.error('Errore creazione', e);
      try{ if(window.M&&M.toast){ M.toast({html:'Errore creazione: '+(e&&e.message?e.message:e), displayLength:2500}); } }catch(_){ }
    }
  }

  async function listAll(){ return await fetchJSON(API, { headers: headers() }); }

  function renderRow(rec){
    var tr = document.createElement('tr');
    var tdCliente = document.createElement('td'); tdCliente.textContent = rec.cliente||'-';
    var tdDT = document.createElement('td'); tdDT.textContent = fmtDT(rec.start_at);
    var tdAg = document.createElement('td'); tdAg.textContent = rec.agente_name||rec.agente_id||'-';
    var tdLuogo = document.createElement('td'); var a=document.createElement('a'); a.href=gmapsLink(rec.luogo); a.target='_blank'; a.rel='noopener'; a.textContent=rec.luogo||'-'; tdLuogo.appendChild(a);
    var tdStato = document.createElement('td'); var chip=document.createElement('div'); chip.className='chip status '+String(rec.stato||'').toLowerCase(); chip.textContent=rec.stato||'Nuovo'; tdStato.appendChild(chip);
    var tdFeed = document.createElement('td'); tdFeed.textContent = rec.feedback||'';
    var tdAct = document.createElement('td'); tdAct.className='agenda-actions';

    var s = sess(); var myEmail = (s.agente_id||s.email||'').toLowerCase(); var elevated = isElevated();
    // Azioni per agente proprietario
    if(myEmail && myEmail===String(rec.agente_id||'').toLowerCase()){
      var btnEsita = document.createElement('button'); btnEsita.className='btn'; btnEsita.textContent='Esita'; btnEsita.addEventListener('click', function(){ openEsita(rec); }); tdAct.appendChild(btnEsita);
    }
    // Azioni per elevati
    if(elevated){
      var btnMod = document.createElement('button'); btnMod.className='btn'; btnMod.textContent='Modifica'; btnMod.addEventListener('click', function(){ openModifica(rec); }); tdAct.appendChild(btnMod);
      var btnDel = document.createElement('button'); btnDel.className='btn red'; btnDel.style.marginLeft='6px'; btnDel.textContent='Elimina'; btnDel.addEventListener('click', async function(){ if(confirm('Eliminare appuntamento?')){ await fetchJSON(API+'?id='+encodeURIComponent(rec.id), { method:'DELETE', headers: headers() }); mountList(); } }); tdAct.appendChild(btnDel);
    }

    tr.appendChild(tdCliente); tr.appendChild(tdDT); tr.appendChild(tdAg); tr.appendChild(tdLuogo); tr.appendChild(tdStato); tr.appendChild(tdFeed); tr.appendChild(tdAct);
    return tr;
  }

  function openEsita(rec){
    var stato = prompt('Stato (Nuovo, Annullato, Spostato, Trattativa, Ko, Chiuso):', rec.stato||'Nuovo'); if(stato==null) return;
    var feedback = prompt('Feedback:', rec.feedback||''); if(feedback==null) return;
    // Spostato richiede nuova data
    var start_at = rec.start_at;
    if(/^spostato$/i.test(stato)){
      var nd = prompt('Nuova data/ora (YYYY-MM-DDTHH:mm):', rec.start_at||''); if(nd==null) return; start_at = nd;
      // Crea un nuovo appuntamento con stessi dati, nuova data, stato 'Nuovo'
      (async function(){
        try{
          var payload = { cliente: rec.cliente, start_at: start_at, agente_id: rec.agente_id, agente_name: rec.agente_name, luogo: rec.luogo, stato: 'Nuovo' };
          await fetchJSON('/.netlify/functions/agenda', { method:'POST', headers: headers(), body: JSON.stringify(payload) });
        }catch(_){ }
        // Marca l'attuale come Spostato con feedback
        await updateAppointment(rec.id, { stato: 'Spostato', feedback: feedback });
      })();
      return;
    }
    updateAppointment(rec.id, { stato: stato, feedback: feedback, start_at: start_at });
  }

  function openModifica(rec){
    var start = prompt('Data/Ora (YYYY-MM-DDTHH:mm):', rec.start_at||''); if(start==null) return;
    updateAppointment(rec.id, { start_at: start });
  }

  async function updateAppointment(id, patch){
    await fetchJSON(API+'?id='+encodeURIComponent(id), { method:'PATCH', headers: headers(), body: JSON.stringify(patch||{}) });
    await mountList();
    try{ if(window.M&&M.toast){ M.toast({html:'Aggiornato'}); } }catch(_){ }
  }

  async function mountList(){
    var tbody = document.querySelector('#agenda_table tbody'); var empty=document.getElementById('agenda_empty');
    tbody.innerHTML=''; empty.textContent='Caricamento…';
    var flt = document.getElementById('flt_stato').value.trim();
    var res = await listAll(); var rows = res.items||[];
    if(flt){ rows = rows.filter(function(r){ return String(r.stato||'').toLowerCase()===flt.toLowerCase(); }); }
    rows.sort(function(a,b){ return String(a.start_at||'').localeCompare(String(b.start_at||'')); });
    rows.forEach(function(r){ tbody.appendChild(renderRow(r)); });
    empty.style.display = tbody.children.length? 'none':'block';
  }

  async function init(){
    try{ if(!sess()||!sess().ruolo) return; }catch(_){ }
    // Form visibile solo a ruoli elevati
    var wrap = document.getElementById('agenda-form-wrap'); if(wrap) wrap.style.display = isElevated()? 'block':'none';
    // Carica tendina agenti
    try{ var list = await loadAgents(); fillAgentSelect(list); }catch(_){ }
    // Wire
    document.getElementById('ag_save').addEventListener('click', createAppointment);
    document.getElementById('flt_stato').addEventListener('change', mountList);
    await mountList();
  }

  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();
