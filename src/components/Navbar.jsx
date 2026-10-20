import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Menu, X, Moon, Sun, ExternalLink, Download, Github, Linkedin } from 'lucide-react';
import { profile } from '../data/profile';

export const NAV = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

function useActiveSection(ids) {
  const [active, setActive] = useState('');
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    ids.forEach((id) => { const el = document.getElementById(id); el && obs.observe(el); });
    return () => obs.disconnect();
  }, [ids]);
  return active;
}

export function ThemeToggle({ theme, setTheme }) {
  const next = theme === 'dark' ? 'light' : 'dark';
  const toggle = (e) => {
    const apply = () => setTheme(next);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!document.startViewTransition || reduce) return apply();
    const x = e.clientX || window.innerWidth - 40, y = e.clientY || 36;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const t = document.startViewTransition(apply);
    t.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 650, easing: 'cubic-bezier(.22,1,.36,1)', pseudoElement: '::view-transition-new(root)' }
      );
    }).catch(() => {});
  };
  return (
    <button className="icon-btn theme-toggle" onClick={toggle} aria-label={`Switch to ${next} theme`} title={`Switch to ${next} theme`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={theme} initial={{ y: -20, rotate: -90, opacity: 0 }} animate={{ y: 0, rotate: 0, opacity: 1 }} exit={{ y: 20, rotate: 90, opacity: 0 }} transition={{ duration: 0.3 }} style={{ display: 'grid' }}>
          {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

export default function Navbar({ theme, setTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(NAV.map((n) => n.id));

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 20);
    f(); window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open]);

  return (
    <>
      <motion.header className={`nav ${scrolled ? 'scrolled' : ''}`} initial={{ y: -90 }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}>
        <div className="container">
          <a href="#top" className="logo" aria-label={`${profile.name} — home`}>
            <span className="logo-mark"><img src={profile.photo} alt="" /></span>
            <span className="logo-text">{profile.firstName}<em>.</em></span>
          </a>
          <nav aria-label="Primary">
            <ul className="nav-links">
              {NAV.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} className={active === n.id ? 'active' : ''} aria-current={active === n.id ? 'true' : undefined}>
                    {active === n.id && <motion.span layoutId="nav-pill" className="pill" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="nav-actions">
            <ThemeToggle theme={theme} setTheme={setTheme} />
            <a className="btn btn-primary btn-sm btn-resume" href={profile.resume} target="_blank" rel="noreferrer"><ExternalLink size={16} /> View résumé<span className="shine" /></a>
            <button className="icon-btn menu-btn" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)}>
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div id="mobile-menu" className="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu"
            initial={{ clipPath: 'circle(0% at 92% 4%)' }} animate={{ clipPath: 'circle(150% at 92% 4%)' }} exit={{ clipPath: 'circle(0% at 92% 4%)' }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}>
            <ul>
              {NAV.map((n, i) => (
                <motion.li key={n.id} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.07 }}>
                  <a className="m-link" href={`#${n.id}`} onClick={() => setOpen(false)}><span>0{i + 1}</span>{n.label}</a>
                </motion.li>
              ))}
            </ul>
            <motion.div className="m-foot" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <a className="btn btn-primary" href={profile.resume} target="_blank" rel="noreferrer"><ExternalLink size={16} /> View résumé</a>
              <a className="btn btn-ghost" href={profile.resumeDownload} target="_blank" rel="noreferrer" download="Prapti-Mangade-Resume.pdf"><Download size={16} /> Download résumé</a>
              <a className="icon-btn" href={profile.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={18} /></a>
              <a className="icon-btn" href={profile.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={18} /></a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
