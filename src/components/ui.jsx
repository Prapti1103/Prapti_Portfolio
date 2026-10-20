import { motion, useInView, animate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import {
  Code2, Server, LayoutDashboard, Palette, MonitorSmartphone, Cpu, Coffee, Database, Wrench, Boxes, Sparkles,
} from 'lucide-react';

// Icons referenced by name from the data files.
const Icons = { Code2, Server, LayoutDashboard, Palette, MonitorSmartphone, Cpu, Coffee, Database, Wrench, Boxes, Sparkles };

export const Icon = ({ name, ...p }) => {
  const C = Icons[name] || Sparkles;
  return <C aria-hidden="true" {...p} />;
};

export const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 } }),
};

export function Reveal({ children, i = 0, as = 'div', className, variants = fadeUp, amount = 0.2, ...rest }) {
  const M = motion[as];
  return (
    <M className={className} variants={variants} initial="hidden" whileInView="show" viewport={{ once: true, amount }} custom={i} {...rest}>
      {children}
    </M>
  );
}

export function SectionHead({ watermark, eyebrow, title, text }) {
  return (
    <div className="sec-head">
      <motion.span
        className="watermark"
        aria-hidden="true"
        initial={{ opacity: 0, letterSpacing: '0.3em' }}
        whileInView={{ opacity: 1, letterSpacing: '0.04em' }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {watermark}
      </motion.span>
      <Reveal><span className="eyebrow">{eyebrow}</span></Reveal>
      <Reveal i={1} as="h2">{title}</Reveal>
      {text && <Reveal i={2} as="p">{text}</Reveal>}
    </div>
  );
}

export function Counter({ to, suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.8, ease: [0.22, 1, 0.36, 1], onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{v}{suffix}</span>;
}

// Magnetic hover for buttons (desktop pointers only).
export function Magnetic({ children, strength = 0.3 }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const fine = typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;
  const move = (e) => {
    if (!fine) return;
    const r = ref.current.getBoundingClientRect();
    setPos({ x: (e.clientX - r.left - r.width / 2) * strength, y: (e.clientY - r.top - r.height / 2) * strength });
  };
  return (
    <motion.div
      ref={ref}
      style={{ display: 'inline-flex' }}
      onMouseMove={move}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={pos}
      transition={{ type: 'spring', stiffness: 220, damping: 15, mass: 0.4 }}
    >
      {children}
    </motion.div>
  );
}

// Spotlight effect: sets --mx/--my on any .spot card under the cursor.
export function useSpotlight() {
  useEffect(() => {
    const h = (e) => {
      const el = e.target.closest?.('.spot');
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    document.addEventListener('pointermove', h, { passive: true });
    return () => document.removeEventListener('pointermove', h);
  }, []);
}

// 3D tilt on hover.
export function Tilt({ children, className, max = 8 }) {
  const ref = useRef(null);
  const [t, setT] = useState({ rx: 0, ry: 0 });
  const onMove = (e) => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setT({ rx: -py * max, ry: px * max });
  };
  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={() => setT({ rx: 0, ry: 0 })}
      animate={{ rotateX: t.rx, rotateY: t.ry }}
      transition={{ type: 'spring', stiffness: 150, damping: 18 }}
      style={{ transformPerspective: 1000 }}
    >
      {children}
    </motion.div>
  );
}
