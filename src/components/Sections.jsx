import { motion, useScroll } from 'framer-motion';
import { useRef } from 'react';
import { Layers, Rocket } from 'lucide-react';
import { about, stats, services } from '../data/profile';
import { experience } from '../data/experience';
import { skillGroups } from '../data/skills';
import { Reveal, SectionHead, Counter, Icon } from './ui';

export function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <SectionHead watermark="About" eyebrow="About me" title={<>Hi, I’m Prapti — <span className="grad-text">I build for the web</span></>} />
        <div className="about-grid">
          <Reveal className="exp-card">
            <motion.div className="smoke" animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} />
            <div>
              <div className="big grad-text"><Counter to={8} suffix="+" /></div>
              <div className="lbl">live projects shipped</div>
              <div className="sub">Courts · Schools · Academies · Stores</div>
            </div>
          </Reveal>
          <div className="about-copy">
            <Reveal as="h3">{about.title}</Reveal>
            {about.paragraphs.map((p, i) => <Reveal as="p" key={i} i={i + 1}>{p}</Reveal>)}
            <div className="hl-grid">
              {about.highlights.map((h, i) => (
                <Reveal key={h.title} i={i + 2} className="hl spot">
                  <h4><span className="ic">{i ? <Layers size={16} /> : <Rocket size={16} />}</span>{h.title}</h4>
                  <p>{h.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
        <div className="stats">
          {stats.map((s, i) => (
            <Reveal key={s.label} i={i} className="stat spot">
              <div className="n grad-text"><Counter to={s.value} suffix={s.suffix} /></div>
              <div className="l">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Services() {
  return (
    <section id="services" className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <SectionHead watermark="Services" eyebrow="What I do" title="Services" text="From pixel-perfect interfaces to the APIs and databases behind them." />
        <div className="services">
          {services.map((s, i) => (
            <Reveal key={s.title} i={i} className="service spot">
              <div className="ic"><Icon name={s.icon} size={26} /></div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Experience() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] });
  return (
    <section id="experience" className="section">
      <div className="container">
        <SectionHead watermark="Journey" eyebrow="Experience" title="My career so far" text="From Java foundations to React frontends, full-stack products and now .NET." />
        <div className="timeline" ref={ref}>
          <div className="tl-track"><motion.div className="tl-fill" style={{ scaleY: scrollYProgress }} /></div>
          {experience.map((e, i) => (
            <div className="tl-item" key={e.id}>
              <motion.span className={`tl-dot ${e.current ? 'current' : ''}`} initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true, amount: 1 }} transition={{ type: 'spring', stiffness: 300 }} />
              <motion.article className="tl-card spot"
                initial={{ opacity: 0, x: i % 2 ? 60 : -60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
                <div className="top">
                  <h3>{e.role}</h3>
                  {e.current && <span className="badge-now">● Current</span>}
                </div>
                {(e.company || e.period) && (
                  <div className="top">
                    {e.company && <span className="company">{e.company}</span>}
                    {e.period && <span className="period">{e.period}</span>}
                  </div>
                )}
                <ul>{e.points.map((p) => <li key={p}>{p}</li>)}</ul>
                <div className="chips">{e.stack.map((s) => <span className="chip" key={s}>{s}</span>)}</div>
              </motion.article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Skills() {
  return (
    <section id="skills" className="section">
      <div className="container">
        <SectionHead watermark="Skills" eyebrow="Toolbox" title="Technologies I work with" />
        <div className="skills">
          {skillGroups.map((g, i) => (
            <Reveal key={g.title} i={i % 3} className="skill-card spot">
              <h3><span className="ic"><Icon name={g.icon} size={20} /></span>{g.title}</h3>
              <motion.div className="chips" initial="hidden" whileInView="show" viewport={{ once: true }}
                variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } } }}>
                {g.items.map((s) => (
                  <motion.span className="chip" key={s} variants={{ hidden: { opacity: 0, scale: 0.6 }, show: { opacity: 1, scale: 1 } }}>{s}</motion.span>
                ))}
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
