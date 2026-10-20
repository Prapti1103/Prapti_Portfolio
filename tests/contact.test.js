import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { handleContact, validate, escapeHtml, buildEmail, _resetRateLimit } from '../server/contact-core.js';

const good = {
  name: 'Asha Patil', email: 'asha@example.com', subject: 'React role',
  message: 'Hello Prapti, we would love to talk about a React role.', consent: true,
};
const env = { RESEND_API_KEY: 're_test', CONTACT_FROM_EMAIL: 'Portfolio <hi@example.dev>', CONTACT_TO_EMAIL: 'praptimangade@gmail.com' };
const okFetch = async () => ({ ok: true, status: 200 });
const call = (body, extra = {}) => handleContact({ method: 'POST', body, ip: extra.ip || '1.1.1.1', env: extra.env || env, fetchImpl: extra.fetchImpl || okFetch });

beforeEach(() => _resetRateLimit());

test('rejects non-POST', async () => {
  const r = await handleContact({ method: 'GET', body: {}, env });
  assert.equal(r.status, 405);
});
test('rejects invalid JSON', async () => assert.equal((await call('{bad')).status, 400));
test('valid submission is sent with correct payload', async () => {
  let sent;
  const r = await call(good, { fetchImpl: async (url, opts) => { sent = { url, ...JSON.parse(opts.body), auth: opts.headers.Authorization }; return { ok: true }; } });
  assert.equal(r.status, 200);
  assert.equal(sent.url, 'https://api.resend.com/emails');
  assert.deepEqual(sent.to, ['praptimangade@gmail.com']);
  assert.equal(sent.reply_to, 'asha@example.com');
  assert.equal(sent.from, env.CONTACT_FROM_EMAIL);
  assert.equal(sent.subject, 'New Portfolio Enquiry — React role');
  assert.equal(sent.auth, 'Bearer re_test');
});
test('missing fields → 422 with field errors', async () => {
  const r = await call({ name: 'A', email: 'nope', subject: '', message: 'short' });
  assert.equal(r.status, 422);
  assert.deepEqual(Object.keys(r.body.fields).sort(), ['consent', 'email', 'message', 'name', 'subject']);
});
test('consent is required', async () => assert.equal((await call({ ...good, consent: false })).status, 422));
test('message length limit', async () => assert.equal((await call({ ...good, message: 'x'.repeat(4001) })).status, 422));
test('unknown interest rejected', async () => assert.equal((await call({ ...good, interest: '<script>' })).status, 422));
test('honeypot silently accepted but not sent', async () => {
  let called = false;
  const r = await call({ ...good, website: 'spam.com' }, { fetchImpl: async () => { called = true; return { ok: true }; } });
  assert.equal(r.status, 200); assert.equal(called, false);
});
test('too-fast submissions ignored', async () => {
  let called = false;
  await call({ ...good, startedAt: Date.now() }, { fetchImpl: async () => { called = true; return { ok: true }; } });
  assert.equal(called, false);
});
test('rate limit after 5 per IP', async () => {
  for (let i = 0; i < 5; i++) assert.equal((await call(good, { ip: '9.9.9.9' })).status, 200);
  assert.equal((await call(good, { ip: '9.9.9.9' })).status, 429);
  assert.equal((await call(good, { ip: '8.8.8.8' })).status, 200);
});
test('unconfigured → 503, never false success', async () => {
  const r = await call(good, { env: {} });
  assert.equal(r.status, 503); assert.equal(r.body.ok, false);
});
test('provider failure → 502 without leaking details', async () => {
  const r = await call(good, { fetchImpl: async () => ({ ok: false, status: 401 }) });
  assert.equal(r.status, 502); assert.doesNotMatch(JSON.stringify(r.body), /re_test|401/);
});
test('network failure → 502', async () => {
  const r = await call(good, { fetchImpl: async () => { throw new Error('down'); } });
  assert.equal(r.status, 502);
});
test('header injection stripped from subject', () => {
  const { data } = validate({ ...good, subject: 'Hi\r\nBcc: evil@x.com' });
  assert.doesNotMatch(data.subject, /[\r\n]/);
});
test('HTML is escaped in email body', () => {
  assert.equal(escapeHtml('<img src=x onerror=alert(1)>'), '&lt;img src=x onerror=alert(1)&gt;');
  const { html } = buildEmail({ ...good, name: '<b>x</b>', message: '<script>alert(1)</script>' }, { source: '', timestamp: 'now' });
  assert.doesNotMatch(html, /<script>/); assert.doesNotMatch(html, /<b>x<\/b>/);
});
