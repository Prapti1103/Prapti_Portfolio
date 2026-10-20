// Vercel Serverless Function → POST /api/contact
import { handleContact } from '../server/contact-core.js';

export default async function handler(req, res) {
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
  const { status, body } = await handleContact({
    method: req.method,
    body: req.body,
    ip,
    origin: req.headers.origin || req.headers.referer || '',
  });
  res.setHeader('Cache-Control', 'no-store');
  res.status(status).json(body);
}
