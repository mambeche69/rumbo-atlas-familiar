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
const TEST_ADMIN_CODE = 'ADMIN_TEST';
const env = {BUCKET:bucket, ADMIN_CODE:TEST_ADMIN_CODE};
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
const pending = await call('/api/contributions?status=all', {headers:{'x-rumbo-code':TEST_ADMIN_CODE}});
assert.equal((await pending.json()).contributions.length, 1);

const reviewed = await call(`/api/contributions/${record.id}`, {method:'PATCH', headers:{'content-type':'application/json','x-rumbo-code':TEST_ADMIN_CODE}, body:JSON.stringify({status:'accepted'})});
assert.equal(reviewed.status, 200);
const accepted = await call('/api/contributions?status=accepted');
assert.equal((await accepted.json()).contributions[0].status, 'accepted');
assert.equal((await call(`/api/media/${record.id}`)).status, 200);
const removed = await call(`/api/contributions/${record.id}`, {method:'DELETE', headers:{'x-rumbo-code':TEST_ADMIN_CODE}});
assert.equal(removed.status, 204);
assert.equal((await call('/api/contributions?status=accepted').then(response=>response.json())).contributions.length, 0);

console.log('Worker flow passed: upload, protected review, acceptance, public memory and media.');
