import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { Mail, MapPin, Linkedin, Github, Send, AlertCircle, Lock, CheckCircle2, RotateCcw, ArrowUpRight, Heart } from 'lucide-react';
import { profile } from '../data/profile';
import { Reveal, SectionHead, Magnetic } from './ui';
import { NAV } from './Navbar';

// Keep in sync with server/contact-core.js
const LIMITS = { name: 80, company: 120, subject: 140, messageMin: 20, message: 4000 };
const INTERESTS = ['Full-time role', 'Freelance project', 'Collaboration', 'Just saying hello'];
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;
const empty = { name: '', email: '', company: '', interest: '', subject: '', message: '', consent: false, website: '' };

function validate(v) {
  const e = {};
  if (v.name.trim().length < 2) e.name = 'Please enter your name.';
  if (!EMAIL_RE.test(v.email.trim())) e.email = 'Please enter a valid email address.';
  if (v.subject.trim().length < 3) e.subject = 'Please add a short subject.';
  if (v.message.trim().length < LIMITS.messageMin) e.message = `Please write at least ${LIMITS.messageMin} characters.`;
  if (!v.consent) e.consent = 'Please confirm so I can reply to you.';
  return e;
}

function Field({ id, label, required, optional, error, children }) {
  return (
    <div className={`field ${id === 'message' || id === 'subject' ? 'full' : ''}`}>
      <label htmlFor={id}>{label} {required && <span className="req" aria-hidden="true">*</span>}{optional && <span className="opt">(optional)</span>}</label>
      {children}
      <AnimatePresence>
        {error && <motion.span id={`${id}-err`} className="err" role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{error}</motion.span>}
      </AnimatePresence>
    </div>
  );
}

export default function Contact() {
  const [v, setV] = useState(empty);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [serverMsg, setServerMsg] = useState('');
  const startedAt = useRef(Date.now());

  const set = (k) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setV((s) => ({ ...s, [k]: val }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };
  const aria = (k) => ({ 'aria-invalid': !!errors[k], 'aria-describedby': errors[k] ? `${k}-err` : undefined });

  async function submit(e) {
    e.preventDefault();
    const errs = validate(v);
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.getElementById(Object.keys(errs)[0])?.focus();
      return;
    }
    setStatus('sending');
    setServerMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...v, startedAt: startedAt.current }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus('success');
        setV(empty);
      } else {
        if (data.fields) setErrors(data.fields);
        setServerMsg(data.error || 'Something went wrong.');
        setStatus('error');
      }
    } catch {
      setServerMsg('Network error — please check your connection.');
      setStatus('error');
    }
  }

  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(v.subject || 'Portfolio enquiry')}&body=${encodeURIComponent(v.message)}`;

  return (
    <section id="contact" className="section">
      <div className="container">
        <SectionHead watermark="Contact" eyebrow="Connect with me" title={<>Let’s build something <span className="grad-text">great</span></>} text="Hiring for a React, .NET or full-stack role, or have a project in mind? Send a message — it lands straight in my inbox." />
        <div className="contact-grid">
          <Reveal className="contact-info spot">
            <h3>Get in touch</h3>
            <p>I usually reply within one or two working days.</p>
            <a className="ci-row" href={profile.socials.email}><span className="ic"><Mail size={20} /></span><span><small>Email</small><strong>{profile.email}</strong></span></a>
            <a className="ci-row" href={profile.socials.linkedin} target="_blank" rel="noreferrer"><span className="ic"><Linkedin size={20} /></span><span><small>LinkedIn</small><strong>prapti-mangade1103</strong></span></a>
            <a className="ci-row" href={profile.socials.github} target="_blank" rel="noreferrer"><span className="ic"><Github size={20} /></span><span><small>GitHub</small><strong>Prapti1103</strong></span></a>
            <div className="ci-row"><span className="ic"><MapPin size={20} /></span><span><small>Based in</small><strong>{profile.location}</strong></span></div>
          </Reveal>

          <Reveal i={1} className="form spot">
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div key="ok" className="success" role="status" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                  <motion.div className="check" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 12, delay: 0.1 }}>
                    <CheckCircle2 size={44} />
                  </motion.div>
                  <h3>Message sent!</h3>
                  <p>Thank you for reaching out! Your message has been submitted successfully. I’ll get back to you as soon as possible.</p>
                  <button className="btn btn-ghost btn-sm" onClick={() => { setStatus('idle'); startedAt.current = Date.now(); }}><RotateCcw size={16} /> Send another</button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={submit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-label="Contact form">
                  <div className="form-grid">
                    <Field id="name" label="Full name" required error={errors.name}>
                      <input id="name" className="input" autoComplete="name" maxLength={LIMITS.name} value={v.name} onChange={set('name')} placeholder="Your name" required {...aria('name')} />
                    </Field>
                    <Field id="email" label="Email address" required error={errors.email}>
                      <input id="email" type="email" className="input" autoComplete="email" maxLength={254} value={v.email} onChange={set('email')} placeholder="you@company.com" required {...aria('email')} />
                    </Field>
                    <Field id="company" label="Company" optional error={errors.company}>
                      <input id="company" className="input" autoComplete="organization" maxLength={LIMITS.company} value={v.company} onChange={set('company')} placeholder="Company or organisation" {...aria('company')} />
                    </Field>
                    <Field id="interest" label="I’m interested in" optional error={errors.interest}>
                      <select id="interest" className="input" value={v.interest} onChange={set('interest')} {...aria('interest')}>
                        <option value="">Select an option</option>
                        {INTERESTS.map((o) => <option key={o}>{o}</option>)}
                      </select>
                    </Field>
                    <Field id="subject" label="Subject" required error={errors.subject}>
                      <input id="subject" className="input" maxLength={LIMITS.subject} value={v.subject} onChange={set('subject')} placeholder="What’s this about?" required {...aria('subject')} />
                    </Field>
                    <Field id="message" label="Message" required error={errors.message}>
                      <div style={{ position: 'relative' }}>
                        <textarea id="message" className="input" maxLength={LIMITS.message} value={v.message} onChange={set('message')} placeholder="Tell me about the role or project…" required {...aria('message')} />
                        <span className="counter" aria-hidden="true">{v.message.length}/{LIMITS.message}</span>
                      </div>
                    </Field>
                    {/* Honeypot — hidden from people, tempting to bots */}
                    <div className="hp" aria-hidden="true">
                      <label htmlFor="website">Website</label>
                      <input id="website" name="website" tabIndex={-1} autoComplete="off" value={v.website} onChange={set('website')} />
                    </div>
                    <div className="field full">
                      <label className="consent" htmlFor="consent">
                        <input id="consent" type="checkbox" checked={v.consent} onChange={set('consent')} {...aria('consent')} />
                        <span>I agree that Prapti may use these details to reply to my enquiry. <span className="req" aria-hidden="true">*</span></span>
                      </label>
                      {errors.consent && <span id="consent-err" className="err" role="alert">{errors.consent}</span>}
                    </div>
                  </div>
                  <AnimatePresence>
                    {status === 'error' && (
                      <motion.div className="alert error" role="alert" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                        <AlertCircle size={18} color="var(--danger)" />
                        <span>{serverMsg} Please try again, or email me directly at <a href={mailto}>{profile.email}</a>.</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="form-foot">
                    <p className="privacy"><Lock size={14} /> Used only to reply to you — never shared or added to mailing lists.</p>
                    <Magnetic strength={0.2}>
                      <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
                        {status === 'sending' ? <><span className="spinner" /> Sending…</> : <>Send message <Send size={17} /></>}
                        <span className="shine" />
                      </button>
                    </Magnetic>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <Reveal className="footer-cta">
          <h2>Have an idea? <br /><span className="grad-text">Let’s talk.</span></h2>
          <p>Open to React, .NET and full-stack opportunities.</p>
          <Magnetic><a className="btn btn-primary" href="#contact">Start a conversation <ArrowUpRight size={18} /><span className="shine" /></a></Magnetic>
        </Reveal>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {profile.name}. Made with <Heart size={13} style={{ display: 'inline', verticalAlign: -2, color: 'var(--accent)' }} aria-label="love" /> in React.</span>
          <nav aria-label="Footer">{NAV.map((n) => <a key={n.id} href={`#${n.id}`}>{n.label}</a>)}</nav>
          <div style={{ display: 'flex', gap: 10 }}>
            <a className="icon-btn" href={profile.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={18} /></a>
            <a className="icon-btn" href={profile.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={18} /></a>
            <a className="icon-btn" href={profile.socials.email} aria-label="Email"><Mail size={18} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
