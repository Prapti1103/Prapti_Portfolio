import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Download, ExternalLink, Github, Linkedin, Mail, Code2, Database, Atom } from 'lucide-react';
import { profile } from '../data/profile';
import { marquee } from '../data/skills';
import { Magnetic } from './ui';

function useTyped(words, { type = 75, del = 40, hold = 1600 } = {}) {
  const [i, setI] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const word = words[i % words.length];
    let t;
    if (!deleting && text === word) t = setTimeout(() => setDeleting(true), hold);
    else if (deleting && text === '') { setDeleting(false); setI((x) => x + 1); }
    else t = setTimeout(() => setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1)), deleting ? del : type);
    return () => clearTimeout(t);
  }, [text, deleting, i, words, type, del, hold]);
  return text;
}

const ease = [0.22, 1, 0.36, 1];
const wordUp = { hidden: { y: '110%' }, show: (d) => ({ y: 0, transition: { duration: 1, ease, delay: d } }) };

export default function Hero({ ready }) {
  const typed = useTyped(profile.roles);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const yVisual = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const yText = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const base = 1.1; // wait for loader
  const anim = ready ? 'show' : 'hidden';

  return (
    <section id="top" className="hero" ref={ref} aria-label="Introduction">
      <div className="container hero-grid">
        <motion.div style={{ y: yText, opacity: fade }}>
          <motion.div className="status" initial={{ opacity: 0, y: 20 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: base, duration: 0.7 }}>
            <span className="dot" /> {profile.availability}
          </motion.div>
          <motion.span className="hello" initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ delay: base + 0.1 }}>
            {'<'}hello world{' />'} — I’m
          </motion.span>
          <h1>
            <span className="line"><motion.span className="word" variants={wordUp} initial="hidden" animate={anim} custom={base + 0.15}>{profile.firstName}</motion.span></span>
            <span className="line"><motion.span className="word grad-text" variants={wordUp} initial="hidden" animate={anim} custom={base + 0.3}>{profile.lastName}</motion.span></span>
          </h1>
          <motion.div className="role-line" initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ delay: base + 0.6 }} aria-live="off">
            <span>I’m a</span>
            <span className="typed">{typed}</span><span className="caret" aria-hidden="true" />
            <span className="sr-only">{profile.roles.join(', ')}</span>
          </motion.div>
          <motion.p className="intro" initial={{ opacity: 0, y: 20 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: base + 0.7, duration: 0.8 }}>
            {profile.intro}
          </motion.p>
          <motion.div className="hero-ctas" initial={{ opacity: 0, y: 20 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: base + 0.85, duration: 0.8 }}>
            <Magnetic><a className="btn btn-primary" href="#projects">View my work <ArrowRight size={18} /><span className="shine" /></a></Magnetic>
            <Magnetic><a className="btn btn-ghost" href={profile.resume} target="_blank" rel="noreferrer"><ExternalLink size={18} /> View résumé</a></Magnetic>
            <Magnetic><a className="btn btn-ghost" href={profile.resumeDownload} target="_blank" rel="noreferrer" download="Prapti-Mangade-Resume.pdf"><Download size={18} /> Download résumé</a></Magnetic>
          </motion.div>
          <motion.div className="hero-socials" initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ delay: base + 1 }}>
            <span className="label">Find me —</span>
            <a className="icon-btn" href={profile.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={18} /></a>
            <a className="icon-btn" href={profile.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={18} /></a>
            <a className="icon-btn" href={profile.socials.email} aria-label="Email"><Mail size={18} /></a>
          </motion.div>
        </motion.div>

        <motion.div className="hero-visual" style={{ y: yVisual }}>
          <motion.div className="avatar-wrap" initial={{ opacity: 0, scale: 0.7 }} animate={ready ? { opacity: 1, scale: 1 } : {}} transition={{ delay: base, duration: 1.2, ease }}>
            <div className="ring-glow" />
            <motion.div className="ring-dash" animate={{ rotate: -360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }} />
            <motion.div className="ring" animate={{ rotate: 360 }} transition={{ duration: 14, repeat: Infinity, ease: 'linear' }} />
            <motion.div className="avatar" whileHover={{ scale: 1.04 }} transition={{ type: 'spring', stiffness: 200 }}>
              {profile.photo ? <img src={profile.photo} alt={profile.name} /> : <span className="monogram grad-text" aria-label={profile.name}>{profile.initials}</span>}
            </motion.div>
            {[
              { cls: 'fc-1', icon: <Atom size={16} />, label: 'React · Vite', d: 0 },
              { cls: 'fc-2', icon: <Code2 size={16} />, label: 'C# · .NET', d: 0.6 },
              { cls: 'fc-3', icon: <Database size={16} />, label: 'SQL Server', d: 1.2 },
            ].map((c) => (
              <motion.div key={c.cls} className={`float-chip ${c.cls}`}
                initial={{ opacity: 0, scale: 0.6 }} animate={ready ? { opacity: 1, scale: 1, y: [0, -12, 0] } : {}}
                transition={{ opacity: { delay: base + 0.6 + c.d / 3 }, scale: { delay: base + 0.6 + c.d / 3 }, y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: c.d } }}>
                <span className="ic">{c.icon}</span>{c.label}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
      <a href="#about" className="scroll-cue" aria-label="Scroll to About"><span className="mouse" />SCROLL</a>
    </section>
  );
}

export function Marquee() {
  const items = [...marquee, ...marquee];
  return (
    <div className="marquee" aria-label="Technologies I work with">
      <div className="marquee-track">
        {items.map((m, i) => (
          <span className="marquee-item" key={i} aria-hidden={i >= marquee.length}>
            {m}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" /></svg>
          </span>
        ))}
      </div>
    </div>
  );
}
