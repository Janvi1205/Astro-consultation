import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import { gsap } from 'gsap';

function App() {
  const cursorRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.1,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }
    };

    const handleMouseOver = (e) => {
      if (!e.target || !cursorRef.current) return;
      const target = e.target;
      const interactive =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList?.contains('cursor-pointer');

      if (interactive) {
        gsap.to(cursorRef.current, {
          scale: 1.4,
          duration: 0.2
        });
      } else {
        gsap.to(cursorRef.current, {
          scale: 1,
          duration: 0.2
        });
      }
    };

    const handleScroll = () => {
      if (progressBarRef.current) {
        const scrolled = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? scrolled / maxScroll : 0;
        gsap.to(progressBarRef.current, {
          scaleX: progress,
          duration: 0.05,
          ease: 'none',
          overwrite: 'auto'
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Router>
      <AuthProvider>
        {/* Scroll Progress Bar */}
        <div
          ref={progressBarRef}
          className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-accent-gold via-light-gold to-accent-gold origin-[0%] z-[9999]"
          style={{ transform: 'scaleX(0)' }}
        />

        {/* Custom Cursor Follower */}
        <div
          ref={cursorRef}
          className="cursor-glow-circle hidden md:block"
        />

        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
