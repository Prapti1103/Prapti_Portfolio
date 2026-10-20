import { useEffect, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero, { Marquee } from './components/Hero';
import { About, Services, Experience, Skills } from './components/Sections';
import { CourtAI, Projects } from './components/Projects';
import Contact, { Footer } from './components/Contact';
import { Loader, Ambient, CursorGlow, ScrollProgress, BackToTop } from './components/Chrome';
import { useSpotlight } from './components/ui';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [ready, setReady] = useState(false);
  useSpotlight();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0b0709' : '#f7f5f8');
  }, [theme]);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t = setTimeout(() => setReady(true), reduce ? 0 : 1300);
    return () => clearTimeout(t);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="skip-link">Skip to content</a>
      <Loader done={ready} />
      <Ambient />
      <div className="grain" aria-hidden="true" />
      <CursorGlow />
      <ScrollProgress />
      <Navbar theme={theme} setTheme={setTheme} />
      <main id="main">
        <Hero ready={ready} />
        <Marquee />
        <About />
        <Services />
        <Experience />
        <Skills />
        <CourtAI />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </MotionConfig>
  );
}
