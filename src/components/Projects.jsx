import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, Check, Github, Scale, Info, X, ExternalLink, ShieldCheck, Eye } from 'lucide-react';
import { courtAI, projects, categories } from '../data/projects';
import { Reveal, SectionHead, Tilt } from './ui';

const host = (u) => { try { return new URL(u).host + new URL(u).pathname.replace(/\/$/, ''); } catch { return u; } };

export function CourtAI() {
  const [tab, setTab] = useState(0);
  const app = courtAI.apps[tab];
  return (
    <section id="court-ai" className="section" style={{ paddingTop: 40 }}>
      <div className="container">
        <Reveal className="court">
          <div className="court-head">
            <div>
              <div className="tag"><Scale size={14} /> Featured case study</div>
              <h3>{courtAI.title.split(' ')[0]} <span className="grad-text">{courtAI.title.split(' ')[1]}</span></h3>
              <p>{courtAI.subtitle}</p>
            </div>
            <div className="tabs" role="tablist" aria-label="Court AI applications">
              {courtAI.apps.map((a, i) => (
                <button key={a.name} role="tab" aria-selected={tab === i} className={`tab ${tab === i ? 'active' : ''}`} onClick={() => setTab(i)}>
                  {tab === i && <motion.span layoutId="court-tab" className="tab-pill" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                  {a.name}
                </button>
              ))}
            </div>
          </div>

          <div className="court-body">
            <Tilt max={6}>
              <div className="browser">
                <div className="browser-bar"><i /><i /><i /><span className="url">{host(app.live)}</span></div>
                <AnimatePresence mode="wait">
                  <motion.img key={app.image} src={app.image} alt={`${app.name} live screenshot`} loading="lazy"
                    initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} />
                </AnimatePresence>
              </div>
            </Tilt>
            <div>
              <p style={{ color: 'var(--muted)', marginBottom: 20 }}>{courtAI.overview}</p>
              <AnimatePresence mode="wait">
                <motion.ul key={app.name} className="feat-list" initial="hidden" animate="show" exit={{ opacity: 0 }}
                  variants={{ show: { transition: { staggerChildren: 0.06 } } }}>
                  {app.features.map((f) => (
                    <motion.li key={f} variants={{ hidden: { opacity: 0, x: 20 }, show: { opacity: 1, x: 0 } }}><Check size={18} />{f}</motion.li>
                  ))}
                </motion.ul>
              </AnimatePresence>
              <div className="court-links">
                <a className="btn btn-primary btn-sm" href={app.live} target="_blank" rel="noreferrer">View project <ArrowUpRight size={16} /><span className="shine" /></a>
                <a className="btn btn-ghost btn-sm" href={app.repo} target="_blank" rel="noreferrer"><Github size={16} /> Source code</a>
              </div>
            </div>
          </div>

          <div className="court-meta">
            <div className="meta-box"><h4>The problem</h4><p>{courtAI.problem}</p></div>
            <div className="meta-box"><h4>My contribution</h4><p>{courtAI.contribution}</p></div>
            <div className="meta-box"><h4>Stack</h4><div className="chips">{courtAI.stack.map((s) => <span key={s} className="chip">{s}</span>)}</div></div>
          </div>
          <p className="disclaimer"><Info size={15} />{courtAI.note}</p>
        </Reveal>
      </div>
    </section>
  );
}

const ProjectCard = forwardRef(function ProjectCard({ p, onOpen }, ref) {
  return (
    <motion.div ref={ref} layout initial={{ opacity: 0, scale: 0.92, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
      <article className="p-card spot" onClick={() => onOpen(p)} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onOpen(p))}
        tabIndex={0} role="button" aria-label={`Open details for ${p.title}`}>
        <div className="p-thumb">
          <img src={p.image} alt={`${p.title} screenshot`} loading="lazy" width="1440" height="900" />
          {p.categories.includes('Featured') && <span className="p-badge">★ Featured</span>}
          <div className="overlay"><span className="view"><Eye size={16} /> Case study</span><ArrowUpRight color="#fff" /></div>
        </div>
        <div className="p-body">
          <span className="tagline">{p.tagline}</span>
          <h3>{p.title}</h3>
          <p>{p.summary}</p>
          <div className="chips">{p.stack.slice(0, 4).map((s) => <span key={s} className="chip">{s}</span>)}</div>
          <div className="p-links" onClick={(e) => e.stopPropagation()}>
            {p.live && <a href={p.live} target="_blank" rel="noreferrer"><ExternalLink size={14} /> Live</a>}
            {p.repo && <a href={p.repo} target="_blank" rel="noreferrer"><Github size={14} /> Code</a>}
            {p.admin && <a href={p.admin} target="_blank" rel="noreferrer"><ShieldCheck size={14} /> Admin</a>}
          </div>
        </div>
      </article>
    </motion.div>
  );
});

function ProjectModal({ p, onClose }) {
  const [img, setImg] = useState(p.image);
  const closeRef = useRef(null);
  useEffect(() => {
    const prev = document.activeElement;
    closeRef.current?.focus();
    document.body.style.overflow = 'hidden';
    const k = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', k); prev?.focus?.(); };
  }, [onClose]);
  const cs = p.caseStudy;
  return (
    <motion.div className="modal-backdrop" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(e) => e.stopPropagation()}
        initial={{ y: 60, scale: 0.94, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: 40, scale: 0.96, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}>
        <div className="modal-bar"><button ref={closeRef} className="icon-btn modal-close" onClick={onClose} aria-label="Close dialog"><X size={18} /></button></div>
        <div className="modal-hero">
          <AnimatePresence mode="wait">
            <motion.img key={img} src={img} alt={`${p.title} screenshot`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          </AnimatePresence>
        </div>
        {p.gallery && (
          <div className="modal-gallery">
            {p.gallery.map((g) => (
              <button key={g} className={g === img ? 'on' : ''} onClick={() => setImg(g)} aria-label="Show screenshot"><img src={g} alt="" /></button>
            ))}
          </div>
        )}
        <div className="modal-content">
          <span className="eyebrow" style={{ marginBottom: 0 }}>{p.categories.filter((c) => c !== 'Featured').join(' · ')}</span>
          <h3 id="modal-title">{p.title}</h3>
          <p>{p.summary}</p>
          {cs && (
            <div className="cs-grid">
              <div className="meta-box"><h4>Problem</h4><p>{cs.problem}</p></div>
              <div className="meta-box"><h4>Approach</h4><p>{cs.approach}</p></div>
              <div className="meta-box"><h4>Result</h4><p>{cs.result}</p></div>
            </div>
          )}
          <div className="chips" style={{ margin: '18px 0 24px' }}>{p.stack.map((s) => <span key={s} className="chip chip-accent">{s}</span>)}</div>
          <div className="court-links">
            {p.live && <a className="btn btn-primary btn-sm" href={p.live} target="_blank" rel="noreferrer">Visit live site <ArrowUpRight size={16} /></a>}
            {p.repo && <a className="btn btn-ghost btn-sm" href={p.repo} target="_blank" rel="noreferrer"><Github size={16} /> Source code</a>}
            {p.admin && <a className="btn btn-ghost btn-sm" href={p.admin} target="_blank" rel="noreferrer"><ShieldCheck size={16} /> Admin panel</a>}
          </div>
          {p.professional && <p className="note-pro"><Info size={15} style={{ flex: 'none', marginTop: 2 }} />Professional client project. Source code and data are private; only the public site is linked.</p>}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Projects() {
  const [filter, setFilter] = useState('All');
  const [open, setOpen] = useState(null);
  const counts = useMemo(() => Object.fromEntries(categories.map((c) => [c, c === 'All' ? projects.length : projects.filter((p) => p.categories.includes(c)).length])), []);
  const visibleCats = categories.filter((c) => counts[c] > 0);
  const list = filter === 'All' ? projects : projects.filter((p) => p.categories.includes(filter));

  return (
    <section id="projects" className="section">
      <div className="container">
        <SectionHead watermark="Work" eyebrow="Portfolio" title="Selected projects" text="Real products, live on the web. Tap any card for the full case study." />
        <Reveal className="filters" role="toolbar" aria-label="Filter projects">
          <LayoutGroup id="filters">
            {visibleCats.map((c) => (
              <button key={c} className={`filter ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)} aria-pressed={filter === c}>
                {filter === c && <motion.span layoutId="filter-pill" className="f-pill" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                {c}<span className="count">{counts[c]}</span>
              </button>
            ))}
          </LayoutGroup>
        </Reveal>
        <motion.div layout className="grid-projects">
          <AnimatePresence mode="popLayout">
            {list.map((p) => <ProjectCard key={p.id} p={p} onOpen={setOpen} />)}
          </AnimatePresence>
        </motion.div>
      </div>
      <AnimatePresence>{open && <ProjectModal p={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  );
}
