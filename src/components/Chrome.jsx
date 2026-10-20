// Global chrome: loader, ambient background, cursor glow, scroll progress, back-to-top.
import { AnimatePresence, motion, useScroll, useSpring, useMotionValue } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export function Loader({ done }) {
  return (
    <AnimatePresence>
      {!done && (
        <motion.div className="loader" exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}>
          <div>
            <div className="loader-mark">
              <img className="loader-photo" src="/profile.png" alt="" />
              <svg viewBox="0 0 120 120" aria-hidden="true">
                <defs>
                  <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="var(--accent)" />
                    <stop offset="1" stopColor="var(--accent-3)" />
                  </linearGradient>
                </defs>
                <motion.circle cx="60" cy="60" r="54" fill="none" stroke="url(#lg)" strokeWidth="2.5"
                  initial={{ pathLength: 0, rotate: -90 }} animate={{ pathLength: 1 }} transition={{ duration: 1, ease: 'easeInOut' }} style={{ originX: '50%', originY: '50%' }} />
              </svg>
            </div>
            <div className="bar"><motion.span initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1.1, ease: 'easeInOut' }} /></div>
            <span className="sr-only">Loading portfolio</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Ambient() {
  return (
    <div className="ambient" aria-hidden="true">
      <div className="blob b1" />
      <div className="blob b2" />
      <motion.svg viewBox="0 0 1000 1000" animate={{ rotate: 360 }} transition={{ duration: 240, repeat: Infinity, ease: 'linear' }}>
        {[...Array(7)].map((_, i) => (
          <circle key={i} cx={500 + (i % 2 ? 140 : -120)} cy={500 + (i % 3) * 60 - 60} r={180 + i * 55}
            fill="none" stroke="var(--line)" strokeWidth={i % 3 === 0 ? 1.4 : 0.7} strokeDasharray={i % 2 ? '2 10' : '0'} />
        ))}
      </motion.svg>
    </div>
  );
}

export function CursorGlow() {
  const x = useMotionValue(-1000), y = useMotionValue(-1000);
  const sx = useSpring(x, { stiffness: 120, damping: 20 }), sy = useSpring(y, { stiffness: 120, damping: 20 });
  useEffect(() => {
    const m = (e) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener('pointermove', m, { passive: true });
    return () => window.removeEventListener('pointermove', m);
  }, [x, y]);
  return <motion.div className="cursor-glow" style={{ left: sx, top: sy }} aria-hidden="true" />;
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />;
}

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const f = () => setShow(window.scrollY > 900);
    f(); window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.button className="to-top" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          initial={{ opacity: 0, scale: 0.4, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.4, y: 20 }}
          whileHover={{ y: -4 }} whileTap={{ scale: 0.9 }}>
          <ArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
