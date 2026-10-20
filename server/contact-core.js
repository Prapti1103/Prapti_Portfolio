// Shared, platform-agnostic contact handler.
// Used by: api/contact.js (Vercel), netlify/functions/contact.mjs (Netlify)
// and the Vite dev-server middleware (vite.config.js).
//
// Secrets are read ONLY from server-side environment variables:
//   RESEND_API_KEY      – Resend API key (https://resend.com/api-keys)
//   CONTACT_TO_EMAIL    – where enquiries are delivered (default praptimangade@gmail.com)
//   CONTACT_FROM_EMAIL  – optional verified sender, e.g. "Portfolio <hello@yourdomain.com>"
//                         defaults to Resend's test sender, which only delivers to
//                         the email address registered to your Resend account.

export const LIMITS = {
  name: 80,
  email: 254,
  company: 120,
  interest: 60,
  subject: 140,
  messageMin: 20,
  message: 4000,
};

export const INTERESTS = [
  'Full-time role',
  'Freelance project',
  'Collaboration',
  'Just saying hello',
];

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;

export function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const clean = (v) =>
  typeof v === 'string' ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim() : '';
const oneLine = (v) => clean(v).replace(/[\r\n]+/g, ' ');

export function validate(input = {}) {
  const data = {
    name: oneLine(input.name),
    email: oneLine(input.email).toLowerCase(),
    company: oneLine(input.company),
    interest: oneLine(input.interest),
    subject: oneLine(input.subject),
    message: clean(input.message),
    consent: input.consent === true || input.consent === 'true' || input.consent === 'on',
  };
  const errors = {};
  if (data.name.length < 2) errors.name = 'Please enter your name.';
  else if (data.name.length > LIMITS.name) errors.name = `Name must be under ${LIMITS.name} characters.`;

  if (!EMAIL_RE.test(data.email) || data.email.length > LIMITS.email) errors.email = 'Please enter a valid email address.';

  if (data.company.length > LIMITS.company) errors.company = `Keep this under ${LIMITS.company} characters.`;
  if (data.interest && !INTERESTS.includes(data.interest)) errors.interest = 'Please choose an option from the list.';

  if (data.subject.length < 3) errors.subject = 'Please add a short subject.';
  else if (data.subject.length > LIMITS.subject) errors.subject = `Subject must be under ${LIMITS.subject} characters.`;

  if (data.message.length < LIMITS.messageMin) errors.message = `Please write at least ${LIMITS.messageMin} characters.`;
  else if (data.message.length > LIMITS.message) errors.message = `Message must be under ${LIMITS.message} characters.`;

  if (!data.consent) errors.consent = 'Please confirm so I can reply to you.';
  return { data, errors, ok: Object.keys(errors).length === 0 };
}

// Best-effort in-memory rate limit (per server instance).
// For strict limits across instances, swap for Upstash Redis / Vercel KV.
const hits = new Map();
export function rateLimited(key, { max = 5, windowMs = 10 * 60 * 1000, now = Date.now() } = {}) {
  const list = (hits.get(key) || []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(key, list);
  if (hits.size > 5000) hits.clear();
  return list.length > max;
}
export const _resetRateLimit = () => hits.clear();

export function buildEmail(d, { source, timestamp }) {
  const row = (label, value) =>
    value
      ? `<tr><td style="padding:10px 14px;color:#9a8f99;font-size:13px;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:10px 14px;color:#1b1418;font-size:14px">${value}</td></tr>`
      : '';
  const html = `<!doctype html><html><body style="margin:0;background:#f5f1f4;font-family:Segoe UI,Arial,sans-serif">
<div style="max-width:600px;margin:0 auto;padding:24px 14px">
  <div style="background:#0d0a0c;border-radius:14px 14px 0 0;padding:22px 24px">
    <div style="color:#ff2e88;font-size:12px;letter-spacing:2px;text-transform:uppercase">Portfolio enquiry</div>
    <div style="color:#fff;font-size:20px;font-weight:700;margin-top:6px">${escapeHtml(d.subject)}</div>
  </div>
  <div style="background:#fff;border-radius:0 0 14px 14px;padding:8px 10px 20px">
    <table role="presentation" style="width:100%;border-collapse:collapse">
      ${row('Name', escapeHtml(d.name))}
      ${row('Email', `<a href="mailto:${escapeHtml(d.email)}" style="color:#d6246e">${escapeHtml(d.email)}</a>`)}
      ${row('Company', escapeHtml(d.company))}
      ${row('Interest', escapeHtml(d.interest))}
      ${row('Received', escapeHtml(timestamp))}
      ${row('Source', escapeHtml(source))}
    </table>
    <div style="margin:14px 14px 0;padding:16px;border-left:3px solid #ff2e88;background:#fbf6f9;border-radius:8px;color:#1b1418;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(d.message)}</div>
    <p style="margin:18px 14px 0;color:#9a8f99;font-size:12px">Reply directly to this email to respond to ${escapeHtml(d.name)}.</p>
  </div>
</div></body></html>`;
  const text = [
    `New portfolio enquiry — ${d.subject}`,
    '',
    `Name: ${d.name}`,
    `Email: ${d.email}`,
    d.company && `Company: ${d.company}`,
    d.interest && `Interest: ${d.interest}`,
    `Received: ${timestamp}`,
    source && `Source: ${source}`,
    '',
    d.message,
  ]
    .filter((l) => l !== false && l !== undefined && l !== '')
    .join('\n');
  return { html, text };
}

/**
 * @returns {Promise<{status:number, body:object}>}
 */
export async function handleContact({ method, body, ip = 'unknown', origin = '', env = process.env, fetchImpl = fetch }) {
  if (method !== 'POST') return { status: 405, body: { ok: false, error: 'Method not allowed.' } };

  let input = body;
  if (typeof input === 'string') {
    try { input = JSON.parse(input); } catch { return { status: 400, body: { ok: false, error: 'Invalid request.' } }; }
  }
  if (!input || typeof input !== 'object') return { status: 400, body: { ok: false, error: 'Invalid request.' } };

  // Honeypot: real people never see or fill this field. Pretend success.
  if (clean(input.website)) return { status: 200, body: { ok: true } };
  // Too-fast submissions (< 3s after the form rendered) are almost always bots.
  const started = Number(input.startedAt);
  if (started && Date.now() - started < 3000) return { status: 200, body: { ok: true } };

  if (rateLimited(ip)) {
    return { status: 429, body: { ok: false, error: 'Too many messages in a short time. Please try again in a few minutes.' } };
  }

  const { data, errors, ok } = validate(input);
  if (!ok) return { status: 422, body: { ok: false, error: 'Please fix the highlighted fields.', fields: errors } };

  const apiKey = env.RESEND_API_KEY;
  const to = env.CONTACT_TO_EMAIL || 'praptimangade@gmail.com';
  const from = env.CONTACT_FROM_EMAIL || 'Prapti Mangade <onboarding@resend.dev>';

  if (env.CONTACT_DEV_MOCK === '1') return { status: 200, body: { ok: true, mock: true } };
  if (!apiKey) {
    return { status: 503, body: { ok: false, error: 'The contact form is not configured yet.' } };
  }

  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }) + ' IST';
  const { html, text } = buildEmail(data, { source: origin, timestamp });

  try {
    const res = await fetchImpl('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: data.email,
        subject: `New Portfolio Enquiry — ${data.subject}`,
        html,
        text,
      }),
    });
    if (!res.ok) {
      // Log status only — never the visitor's message or the API key.
      console.error('[contact] email provider responded with status', res.status);
      return { status: 502, body: { ok: false, error: 'Your message could not be sent right now.' } };
    }
    return { status: 200, body: { ok: true } };
  } catch {
    console.error('[contact] email provider unreachable');
    return { status: 502, body: { ok: false, error: 'Your message could not be sent right now.' } };
  }
}
