const PAGE = __RUMBO_HTML__;
const STYLES = __RUMBO_CSS__;
const SCRIPT = '(function(){\n' + __RUMBO_JS__ + '\n})();';

const json = (data, status=200) => new Response(JSON.stringify(data), {
  status,
  headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}
});

const clean = (value, max) => String(value || '').trim().replace(/[<>]/g, '').slice(0, max);
const allowedTrips = new Set(['barcelona','quebec','costa-rica','kyoto']);
const allowedTypes = new Set(['image/jpeg','image/png','image/webp']);

function authorized(request, env) {
  const supplied = request.headers.get('x-rumbo-code')?.trim();
  return Boolean(env.ADMIN_CODE) && supplied === env.ADMIN_CODE;
}

function sameOrigin(request) {
  const origin = request.headers.get('origin');
  return !origin || origin === new URL(request.url).origin;
}

async function readContribution(bucket, id) {
  const object = await bucket.get(`contributions/${id}.json`);
  if (!object) return null;
  try { return JSON.parse(await object.text()); } catch { return null; }
}

async function listContributions(bucket, requestedStatus) {
  const result = await bucket.list({prefix:'contributions/', limit:100});
  const items = await Promise.all(result.objects.map(async object => {
    const stored = await bucket.get(object.key);
    if (!stored) return null;
    try { return JSON.parse(await stored.text()); } catch { return null; }
  }));
  return items.filter(item => item && (requestedStatus === 'all' || item.status === requestedStatus))
    .sort((a,b) => String(b.createdAt).localeCompare(String(a.createdAt)))
    .map(item => ({...item, imageUrl:`/api/media/${item.id}`}));
}

async function handleApi(request, env, url) {
  if (!env.BUCKET) return json({error:'Storage is not configured.'}, 503);
  if (url.pathname === '/api/health') return json({ok:true, storage:true, adminSecret:Boolean(env.ADMIN_CODE)});

  if (url.pathname === '/api/contributions' && request.method === 'GET') {
    const requested = url.searchParams.get('status') || 'accepted';
    if (!['accepted','all'].includes(requested)) return json({error:'Invalid status.'}, 400);
    if (requested === 'all' && !authorized(request, env)) return json({error:'Unauthorized.'}, 401);
    return json({contributions:await listContributions(env.BUCKET, requested)});
  }

  if (url.pathname === '/api/contributions' && request.method === 'POST') {
    if (!sameOrigin(request)) return json({error:'Invalid origin.'}, 403);
    let form;
    try { form = await request.formData(); } catch { return json({error:'Invalid form.'}, 400); }
    const author = clean(form.get('author'), 60);
    const tripId = clean(form.get('tripId'), 30);
    const caption = clean(form.get('caption'), 160);
    const photo = form.get('photo');
    const consent = form.get('consent');
    if (!author || !caption || !allowedTrips.has(tripId) || !consent) return json({error:'Missing fields.'}, 400);
    if (!(photo instanceof File) || !allowedTypes.has(photo.type) || photo.size < 1 || photo.size > 5 * 1024 * 1024) return json({error:'Invalid photo.'}, 400);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const record = {id, author, tripId, caption, status:'pending', createdAt};
    await env.BUCKET.put(`images/${id}`, photo.stream(), {httpMetadata:{contentType:photo.type}, customMetadata:{originalName:clean(photo.name, 100)}});
    await env.BUCKET.put(`contributions/${id}.json`, JSON.stringify(record), {httpMetadata:{contentType:'application/json'}});
    return json({...record, imageUrl:`/api/media/${id}`}, 201);
  }

  const contributionMatch = url.pathname.match(/^\/api\/contributions\/([a-f0-9-]+)$/i);
  if (contributionMatch && request.method === 'PATCH') {
    if (!sameOrigin(request) || !authorized(request, env)) return json({error:'Unauthorized.'}, 401);
    const record = await readContribution(env.BUCKET, contributionMatch[1]);
    if (!record) return json({error:'Not found.'}, 404);
    let body;
    try { body = await request.json(); } catch { return json({error:'Invalid body.'}, 400); }
    if (!['accepted','dismissed'].includes(body.status)) return json({error:'Invalid status.'}, 400);
    record.status = body.status;
    record.reviewedAt = new Date().toISOString();
    await env.BUCKET.put(`contributions/${record.id}.json`, JSON.stringify(record), {httpMetadata:{contentType:'application/json'}});
    return json({...record, imageUrl:`/api/media/${record.id}`});
  }

  if (contributionMatch && request.method === 'DELETE') {
    if (!sameOrigin(request) || !authorized(request, env)) return json({error:'Unauthorized.'}, 401);
    const record = await readContribution(env.BUCKET, contributionMatch[1]);
    if (!record) return json({error:'Not found.'}, 404);
    await Promise.all([
      env.BUCKET.delete(`contributions/${record.id}.json`),
      env.BUCKET.delete(`images/${record.id}`)
    ]);
    return new Response(null, {status:204});
  }

  const mediaMatch = url.pathname.match(/^\/api\/media\/([a-f0-9-]+)$/i);
  if (mediaMatch && request.method === 'GET') {
    const object = await env.BUCKET.get(`images/${mediaMatch[1]}`);
    if (!object) return new Response('Not found', {status:404});
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('cache-control','public, max-age=31536000, immutable');
    headers.set('x-content-type-options','nosniff');
    return new Response(object.body, {headers});
  }

  return json({error:'Not found.'}, 404);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) return handleApi(request, env, url);
    if (request.method !== 'GET' && request.method !== 'HEAD') return new Response('Method not allowed', {status:405});
    if (url.pathname === '/' || url.pathname === '/index.html') return new Response(PAGE, {headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-cache'}});
    if (url.pathname === '/styles.css') return new Response(STYLES, {headers:{'content-type':'text/css; charset=utf-8','cache-control':'no-cache'}});
    if (url.pathname === '/app.js') return new Response(SCRIPT, {headers:{'content-type':'text/javascript; charset=utf-8','cache-control':'no-cache'}});
    if (url.pathname.startsWith('/assets/')) {
      const name = url.pathname.slice('/assets/'.length);
      if (!/^[a-z0-9-]+\.jpg$/i.test(name)) return new Response('Not found', {status:404});
      return Response.redirect(`https://raw.githubusercontent.com/mambeche69/rumbo-atlas-familiar/main/dist/assets/${name}`, 302);
    }
    if (url.pathname === '/robots.txt') return new Response('User-agent: *\nDisallow: /\n', {headers:{'content-type':'text/plain; charset=utf-8'}});
    return new Response('Not found', {status:404});
  }
};
