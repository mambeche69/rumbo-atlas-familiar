import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
import worker from '../worker/index.js';

class MemoryBucket {
  constructor() { this.items = new Map(); }

  async put(key, value, options = {}) {
    const bytes = value instanceof ReadableStream
      ? new Uint8Array(await new Response(value).arrayBuffer())
      : new TextEncoder().encode(String(value));
    this.items.set(key, { bytes, options });
  }

  async get(key) {
    const item = this.items.get(key);
    if (!item) return null;
    return {
      body: item.bytes,
      httpEtag: '"preview"',
      text: async () => new TextDecoder().decode(item.bytes),
      writeHttpMetadata(headers) {
        const type = item.options.httpMetadata?.contentType;
        if (type) headers.set('content-type', type);
      }
    };
  }

  async list({ prefix }) {
    return {
      objects: [...this.items.keys()]
        .filter(key => key.startsWith(prefix))
        .map(key => ({ key }))
    };
  }

  async delete(key) { this.items.delete(key); }
}

const projectRoot = resolve(import.meta.dirname, '..');
const port = Number(process.env.PORT || 4174);
const host = process.env.HOST || '0.0.0.0';
const adminCode = process.env.RUMBO_PREVIEW_ADMIN_CODE;
if (!adminCode) {
  console.error('Set RUMBO_PREVIEW_ADMIN_CODE before starting the local preview.');
  process.exit(1);
}
const env = { BUCKET: new MemoryBucket(), ADMIN_CODE: adminCode };
const contentTypes = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp'
};

function requestBody(req) {
  return new Promise((resolveBody, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolveBody(chunks.length ? Buffer.concat(chunks) : undefined));
    req.on('error', reject);
  });
}

const server = createServer(async (req, res) => {
  try {
    const origin = `http://${req.headers.host || `127.0.0.1:${port}`}`;
    const url = new URL(req.url || '/', origin);

    if (url.pathname.startsWith('/assets/')) {
      const fileName = url.pathname.slice('/assets/'.length);
      if (!/^[a-z0-9-]+\.(?:jpe?g|png|webp)$/i.test(fileName)) {
        res.writeHead(404).end('Not found');
        return;
      }
      const bytes = await readFile(resolve(projectRoot, 'site/assets', fileName));
      res.writeHead(200, { 'content-type': contentTypes[extname(fileName).toLowerCase()] || 'application/octet-stream' });
      res.end(bytes);
      return;
    }

    const body = ['GET', 'HEAD'].includes(req.method || 'GET') ? undefined : await requestBody(req);
    const request = new Request(url, {
      method: req.method,
      headers: req.headers,
      body
    });
    const response = await worker.fetch(request, env);
    const headers = Object.fromEntries(response.headers);
    res.writeHead(response.status, headers);
    if (req.method === 'HEAD' || !response.body) res.end();
    else res.end(Buffer.from(await response.arrayBuffer()));
  } catch (error) {
    console.error(error);
    res.writeHead(error?.code === 'ENOENT' ? 404 : 500, { 'content-type': 'text/plain; charset=utf-8' });
    res.end(error?.code === 'ENOENT' ? 'Not found' : 'Preview error');
  }
});

server.listen(port, host, () => {
  console.log(`Rumbo preview with API: http://127.0.0.1:${port}`);
  console.log('Temporary uploads are cleared when this preview stops.');
});
