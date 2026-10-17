import assert from 'node:assert/strict';
import worker from '../worker/index.js';

class MemoryBucket {
  constructor() { this.items = new Map(); }
  async put(key, value, options={}) {
    const bytes = value instanceof ReadableStream ? new Uint8Array(await new Response(value).arrayBuffer()) : new TextEncoder().encode(String(value));
    this.items.set(key, {bytes, options});
  }
  async get(key) {
    const item = this.items.get(key);
    if (!item) return null;
    return {
      body:item.bytes,
      httpEtag:'"test"',
      text:async()=>new TextDecoder().decode(item.bytes),
      writeHttpMetadata(headers) { if (item.options.httpMetadata?.contentType) headers.set('content-type', item.options.httpMetadata.contentType); }
    };
  }
  async list({prefix}) {
    return {objects:[...this.items.keys()].filter(key=>key.startsWith(prefix)).map(key=>({key}))};
  }
  async delete(key) { this.items.delete(key); }
}

const bucket = new MemoryBucket();
const testAdminCode = 'TEST-ORGANIZER-CODE';
const env = {BUCKET:bucket, ADMIN_CODE:testAdminCode};
const call = (path, init={}) => worker.fetch(new Request(`https://rumbo.test${path}`, init), env);

const page = await call('/');
assert.equal(page.status, 200);
assert.match(await page.text(), /contribution-form/);
const browserScript = await call('/app.js');
assert.equal(browserScript.status, 200);
new Function(await browserScript.text());

const form = new FormData();
form.set('author', 'Familia Demo');
form.set('tripId', 'barcelona');
form.set('caption', 'Una imagen ficticia para probar el flujo.');
form.set('consent', 'on');
form.set('photo', new File([new Uint8Array([255,216,255,217])], 'demo.jpg', {type:'image/jpeg'}));
const created = await call('/api/contributions', {method:'POST', body:form});
assert.equal(created.status, 201);
const record = await created.json();

assert.equal((await call('/api/contributions?status=all')).status, 401);
const pending = await call('/api/contributions?status=all', {headers:{'x-rumbo-code':testAdminCode}});
assert.equal((await pending.json()).contributions.length, 1);

const reviewed = await call(`/api/contributions/${record.id}`, {method:'PATCH', headers:{'content-type':'application/json','x-rumbo-code':testAdminCode}, body:JSON.stringify({status:'accepted'})});
assert.equal(reviewed.status, 200);
const accepted = await call('/api/contributions?status=accepted');
assert.equal((await accepted.json()).contributions[0].status, 'accepted');
assert.equal((await call(`/api/media/${record.id}`)).status, 200);
const removed = await call(`/api/contributions/${record.id}`, {method:'DELETE', headers:{'x-rumbo-code':testAdminCode}});
assert.equal(removed.status, 204);
assert.equal((await call('/api/contributions?status=accepted').then(response=>response.json())).contributions.length, 0);

const heifForm = new FormData();
heifForm.set('author', 'Viajera Demo');
heifForm.set('tripId', 'kyoto');
heifForm.set('caption', 'Una imagen HEIF para comprobar el formato.');
heifForm.set('consent', 'on');
heifForm.set('photo', new File([new Uint8Array([0,0,0,24,102,116,121,112])], 'demo.heif', {type:'image/heif'}));
const heifCreated = await call('/api/contributions', {method:'POST', body:heifForm});
assert.equal(heifCreated.status, 201);
const heifRecord = await heifCreated.json();
assert.equal((await call(`/api/media/${heifRecord.id}`)).headers.get('content-type'), 'image/heif');
assert.equal((await call(`/api/contributions/${heifRecord.id}`, {method:'DELETE', headers:{'x-rumbo-code':testAdminCode}})).status, 204);

console.log('Worker flow passed: JPG and HEIF upload, protected review, acceptance, public memory and media.');
