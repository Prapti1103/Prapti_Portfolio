// Netlify Function (v2) → POST /api/contact
import { handleContact } from '../../server/contact-core.js';

export default async (req, context) => {
  let body = null;
  try { body = await req.json(); } catch { body = null; }
  const { status, body: json } = await handleContact({
    method: req.method,
    body,
    ip: context?.ip || req.headers.get('x-nf-client-connection-ip') || 'unknown',
    origin: req.headers.get('origin') || req.headers.get('referer') || '',
    env: process.env,
  });
  return new Response(JSON.stringify(json), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
};

export const config = { path: '/api/contact' };
