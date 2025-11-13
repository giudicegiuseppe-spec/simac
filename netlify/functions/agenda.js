// Netlify Function: Agenda CRUD using Netlify Blobs
// Endpoints:
// - GET /.netlify/functions/agenda -> list appointments (headers carry user info)
// - POST /.netlify/functions/agenda -> create
// - PATCH /.netlify/functions/agenda?id=<id> -> update
// - DELETE /.netlify/functions/agenda?id=<id> -> delete
// Auth/permessi lato server: controllo di base su role via headers
// Headers attesi dal client:
//   x-simac-email, x-simac-role, x-simac-areamanager, x-simac-agente (nome)

const { blobs } = require('@netlify/blobs');

const STORE_NAME = 'agenda';
const KEY = 'appointments.json';

function json(statusCode, body){
  return { statusCode, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS' }, body: JSON.stringify(body) };
}

function parseUser(headers){
  const h = (k) => (headers[k] || headers[k.toLowerCase()] || headers[k.toUpperCase()]);
  const role = String(h('x-simac-role') || '').trim();
  const email = String(h('x-simac-email') || '').trim().toLowerCase();
  const agente = String(h('x-simac-agente') || '').trim();
  const area_manager = String(h('x-simac-areamanager') || '').trim();
  const elevated = ['azienda', 'direzione commerciale', 'area manager', 'areamanager'].includes(role.toLowerCase());
  return { role, email, agente, area_manager, elevated };
}

async function readAll(){
  const store = blobs({ name: STORE_NAME });
  const text = await store.getText(KEY);
  if(!text) return [];
  try{ return JSON.parse(text); }catch(_){ return []; }
}
async function writeAll(arr){
  const store = blobs({ name: STORE_NAME });
  await store.setJSON(KEY, arr || []);
}

function genId(){ return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,8); }

function filterForUser(all, user){
  if(!user || user.elevated) return all;
  const me = user.email;
  return (all||[]).filter(r => String(r.agente_id||'').toLowerCase() === me);
}

exports.handler = async function(event, context){
  try{
    if(event.httpMethod === 'OPTIONS'){
      return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS' } };
    }
    const user = parseUser(event.headers||{});
    if(event.httpMethod === 'GET'){
      const all = await readAll();
      const out = filterForUser(all, user);
      return json(200, { ok:true, items: out });
    }
    if(event.httpMethod === 'POST'){
      if(!user.elevated){ return json(403, { ok:false, error:'Permesso negato' }); }
      let data = {};
      try{ data = JSON.parse(event.body||'{}'); }catch(_){ }
      const now = new Date().toISOString();
      const rec = {
        id: genId(),
        cliente: (data.cliente||'').trim(),
        start_at: (data.start_at||'').trim(),
        agente_id: String(data.agente_id||'').trim().toLowerCase(),
        agente_name: String(data.agente_name||'').trim(),
        luogo: (data.luogo||'').trim(),
        stato: (data.stato||'Nuovo').trim(),
        feedback: String(data.feedback||'').trim(),
        creato_da: user.email || user.agente || 'system',
        created_at: now,
        updated_at: now
      };
      if(!rec.cliente || !rec.start_at || !rec.agente_id){ return json(400, { ok:false, error:'Dati mancanti' }); }
      const all = await readAll();
      all.push(rec);
      await writeAll(all);
      return json(200, { ok:true, item: rec });
    }
    if(event.httpMethod === 'PATCH'){
      const id = (event.queryStringParameters||{}).id || '';
      if(!id) return json(400, { ok:false, error:'ID mancante' });
      let patch = {};
      try{ patch = JSON.parse(event.body||'{}'); }catch(_){ }
      const all = await readAll();
      const idx = all.findIndex(x => x.id === id);
      if(idx<0) return json(404, { ok:false, error:'Non trovato' });
      const rec = all[idx];
      // permessi: agente può modificare solo il proprio, elevati qualsiasi
      const isOwner = String(rec.agente_id||'').toLowerCase() === (user.email||'').toLowerCase();
      if(!(user.elevated || isOwner)) return json(403, { ok:false, error:'Permesso negato' });
      // campi ammessi in patch
      const allowed = ['stato','feedback','start_at'];
      allowed.forEach(k => { if(k in patch){ rec[k] = String(patch[k]||'').trim(); } });
      rec.updated_at = new Date().toISOString();
      all[idx] = rec;
      await writeAll(all);
      return json(200, { ok:true, item: rec });
    }
    if(event.httpMethod === 'DELETE'){
      const id = (event.queryStringParameters||{}).id || '';
      if(!id) return json(400, { ok:false, error:'ID mancante' });
      if(!user.elevated) return json(403, { ok:false, error:'Permesso negato' });
      const all = await readAll();
      const arr = all.filter(x => x.id !== id);
      await writeAll(arr);
      return json(200, { ok:true });
    }
    return json(405, { ok:false, error:'Metodo non supportato' });
  }catch(e){
    return json(500, { ok:false, error:String(e && e.message || e) });
  }
};
