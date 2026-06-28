import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import heroImg from '../../assets/heroimg.webp';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef(null);
  const canvasRef = useRef(null);

  const contentRef = useRef(null);
  const tagRef = useRef(null);
  const title1Ref = useRef(null);
  const title2Ref = useRef(null);
  const dividerRef = useRef(null);
  const descRef = useRef(null);
  const ctaBtnRef = useRef(null);

  const wheelLeftRef = useRef(null);
  const wheelRightRef = useRef(null);
  const horizonRef = useRef(null);
  const horizonPulseRef = useRef(null);
  const horizonBloomRef = useRef(null);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // 12 Zodiac Symbols for floating effect
  const zodiacGlyphs = [
    { char: '♈', top: '15%', left: '12%', size: 'text-2xl', delay: 0 },
    { char: '♉', top: '25%', left: '85%', size: 'text-xl', delay: 1.5 },
    { char: '♊', top: '50%', left: '78%', size: 'text-3xl', delay: 0.5 },
    { char: '♋', top: '70%', left: '15%', size: 'text-2xl', delay: 2.2 },
    { char: '♌', top: '35%', left: '22%', size: 'text-4xl', delay: 1.1 },
    { char: '♍', top: '60%', left: '88%', size: 'text-2xl', delay: 3.0 },
    { char: '♎', top: '80%', left: '72%', size: 'text-xl', delay: 0.8 },
    { char: '♏', top: '18%', left: '68%', size: 'text-3xl', delay: 2.5 },
    { char: '♐', top: '40%', left: '8%', size: 'text-2xl', delay: 1.8 },
    { char: '♑', top: '30%', left: '75%', size: 'text-xl', delay: 0.2 },
    { char: '♒', top: '65%', left: '5%', size: 'text-3xl', delay: 2.7 },
    { char: '♓', top: '82%', left: '25%', size: 'text-2xl', delay: 1.3 }
  ];

  // Mouse Move Parallax Offset (GSAP driven for smooth lag follower)
  useEffect(() => {
  
    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      const { clientWidth, clientHeight } = heroRef.current;
      const x = (e.clientX / clientWidth - 0.5) * 35;
      const y = (e.clientY / clientHeight - 0.5) * 35;

      gsap.to(contentRef.current, {
        x: x * 0.4,
        y: y * 0.4,
        duration: 0.8,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 60 FPS Canvas Twinkling Star & Constellation Particle System
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particleCount = 45;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.85,
        radius: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        alpha: Math.random(),
        alphaSpeed: Math.random() * 0.01 + 0.005,
        isTwinkle: Math.random() > 0.5
      });
    }

    const starCount = 200;
    const stars = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.85,
        radius: Math.random() * 1.2 + 0.2,
        alpha: Math.random(),
        alphaSpeed: Math.random() * 0.02 + 0.005
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw background stars
      for (let i = 0; i < starCount; i++) {
        const star = stars[i];
        star.alpha += star.alphaSpeed;
        if (star.alpha > 1 || star.alpha < 0.1) {
          star.alphaSpeed = -star.alphaSpeed;
        }
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, star.alpha)})`;
        ctx.fill();
      }

      // Draw constellation particles
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx = -p.vx;
        if (p.y < 0 || p.y > height * 0.85) p.vy = -p.vy;

        if (p.isTwinkle) {
          p.alpha += p.alphaSpeed;
          if (p.alpha > 0.95 || p.alpha < 0.15) {
            p.alphaSpeed = -p.alphaSpeed;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(244, 208, 111, ${p.isTwinkle ? p.alpha : 0.6})`;
        ctx.fill();
      }

      // Draw connections
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.08)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particleCount; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particleCount; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // GSAP Load Sequences & Scroll Parallax
  useEffect(() => {
    // 1. Entry Animation Timeline
    const tl = gsap.timeline();
    tl.fromTo(
      tagRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: 0.3 }
    )
      .fromTo(
        title1Ref.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.4'
      )
      .fromTo(
        title2Ref.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.6'
      )
      .fromTo(
        dividerRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: 'power2.inOut' },
        '-=0.4'
      )
      .fromTo(
        descRef.current,
        { opacity: 0, y: 15 },
        { opacity: 0.85, y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.4'
      )
      .fromTo(
        ctaBtnRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.7)' },
        '-=0.4'
      );

    // 2. Slow continuous rotation for wheels
    gsap.to(wheelLeftRef.current, {
      rotate: 360,
      repeat: -1,
      duration: 180,
      ease: 'none'
    });
    gsap.to(wheelRightRef.current, {
      rotate: -360,
      repeat: -1,
      duration: 200,
      ease: 'none'
    });

    // 3. Sunrise Glow continuous pulses
    gsap.fromTo(
      horizonPulseRef.current,
      { opacity: 0.65, scale: 1 },
      { opacity: 0.9, scale: 1.08, repeat: -1, yoyo: true, duration: 4.5, ease: 'sine.inOut' }
    );
    gsap.fromTo(
      horizonBloomRef.current,
      { opacity: 0.7 },
      { opacity: 0.95, repeat: -1, yoyo: true, duration: 3.5, ease: 'sine.inOut', delay: 0.5 }
    );

    // 4. Parallax Scroll Trigger
    const scrollParallax = ScrollTrigger.create({
      trigger: heroRef.current,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress; // 0 to 1

        // Custom speeds for parallax depth
        gsap.set(wheelLeftRef.current, { rotate: `+=${progress * 40}`, overwrite: 'auto' });
        gsap.set(wheelRightRef.current, { rotate: `-=${progress * 40}`, overwrite: 'auto' });

        gsap.to(horizonRef.current, {
          scale: 1 + progress * 0.15,
          y: progress * 40,
          overwrite: 'auto',
          duration: 0.1
        });
      }
    });

    return () => {
      scrollParallax.kill();
    };
  }, []);

  const ZodiacWheel = ({ svgRef, clockwise }) => (
    <div
      ref={svgRef}
      className="relative pointer-events-none select-none"
    >
      <svg
        viewBox="0 0 200 200"
        className="w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[480px] md:h-[480px] lg:w-[650px] lg:h-[650px] opacity-[0.09] text-accent-gold"
      >
        <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="0.75" />
        <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="0.25" />
        <circle cx="100" cy="100" r="78" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
        <circle cx="100" cy="100" r="62" fill="none" stroke="currentColor" strokeWidth="0.75" />
        <circle cx="100" cy="100" r="35" fill="none" stroke="currentColor" strokeWidth="0.25" />

        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x1 = 100 + Math.cos(angle) * 35;
          const y1 = 100 + Math.sin(angle) * 35;
          const x2 = 100 + Math.cos(angle) * 96;
          const y2 = 100 + Math.sin(angle) * 96;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth="0.4"
            />
          );
        })}
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i * 15 * Math.PI) / 180;
          const x = 100 + Math.cos(angle) * 70;
          const y = 100 + Math.sin(angle) * 70;
          return <circle key={i} cx={x} cy={y} r="0.8" fill="currentColor" />;
        })}
      </svg>
    </div>
  );

  return (
    <section
      id="hero"
      ref={heroRef}
      aria-label="Hero – Pradeep Malhotra Astrology & Spiritual Consultation"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-primary px-6"
      style={{
        backgroundImage: `url(${heroImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* 60 FPS Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none select-none"
      />

      {/* Grid Pattern mask overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none z-0" />

      {/* Floating Golden Zodiac Glyphs (animated dynamically via CSS keyframes or raw float values) */}
      <div className="absolute inset-0 z-10 pointer-events-none hidden md:block select-none overflow-hidden">
        {zodiacGlyphs.map((glyph, idx) => (
          <div
            key={idx}
            className="absolute font-sans font-light text-accent-gold/45 animate-[float_8s_ease-in-out_infinite] text-2xl"
            style={{
              top: glyph.top,
              left: glyph.left,
              animationDelay: `${glyph.delay}s`,
              filter: 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.2))'
            }}
          >
            {glyph.char}
          </div>
        ))}
      </div>

      {/* Double Rotating Zodiac Wheels (Left and Right) */}
      <div className="absolute top-[10%] -left-[140px] sm:-left-[180px] md:-left-[240px] lg:-left-[300px] z-10 pointer-events-none">
        <ZodiacWheel svgRef={wheelLeftRef} clockwise={true} />
      </div>
      <div className="absolute bottom-[10%] -right-[140px] sm:-right-[180px] md:-right-[240px] lg:-right-[300px] z-10 pointer-events-none">
        <ZodiacWheel svgRef={wheelRightRef} clockwise={false} />
      </div>

      {/* Main Content Area */}
      <div
        ref={contentRef}
        className="relative z-20 max-w-[950px] mx-auto text-center flex flex-col items-center justify-center pt-24 pb-32"
      >
        <div className="flex flex-col items-center justify-center w-full">
          {/* Top Tagline */}
          <div
            ref={tagRef}
            className="flex items-center gap-2 mb-6"
          >
            <Compass className="w-4 h-4 text-accent-gold animate-[spin_10s_linear_infinite]" />
            <span className="text-xs font-semibold tracking-[0.45em] text-light-gold uppercase font-sans">
              Guidance • Clarity • Transformation
            </span>
          </div>

          {/* Elegant Luxury Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-medium tracking-wide leading-[1.12] mb-8 text-cream">
            <span ref={title1Ref} className="block">
              Discover Clarity,
            </span>
            <span ref={title2Ref} className="block text-gold-gradient-pure mt-2">
              Embrace Your Path.
            </span>
          </h1>

          {/* Elegant Diamond Divider */}
          <div
            ref={dividerRef}
            className="divider-diamond max-w-[280px] mb-8"
          >
            <span className="divider-diamond-symbol" />
          </div>

          {/* Subtext description */}
          <p
            ref={descRef}
            className="text-base sm:text-lg text-cream/70 font-sans font-light tracking-wide max-w-[660px] mb-12 leading-relaxed"
          >
            Personalized astrology consultations by Pradeep Malhotra, crafted to reveal your true path and unlock powerful opportunities in your life.          </p>

          {/* Premium CTA Button & Trust Indicators */}
          <div ref={ctaBtnRef} className="flex flex-col items-center gap-5">
            <Link to="/booking">
              <button
                className="px-9 py-4.5 rounded-[30px] bg-gradient-to-r from-accent-gold via-light-gold to-accent-gold text-primary font-bold tracking-widest text-xs uppercase shadow-luxury shadow-gold-glow/20 transition-all duration-300 cursor-pointer shine-sweep-btn border border-accent-gold/20 hover:scale-105"
              >
                Book Consultation
              </button>
            </Link>
            
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm font-sans tracking-wide text-cream/90 mt-2">
              <div className="flex items-center gap-2">
                <div className="flex text-accent-gold text-sm sm:text-base leading-none select-none">
                  ★★★★★
                </div>
                <span>
                  <strong className="text-accent-gold font-semibold">5/5</strong> Rated
                </span>
              </div>
              <span className="text-accent-gold/30 hidden sm:inline">|</span>
              <div>
                <span>
                  <strong className="text-accent-gold font-semibold">1,000+</strong> Lives Transformed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Planetary Horizon Sunrise Glow Effect */}
      <div
        ref={horizonRef}
        className="absolute bottom-0 left-0 w-full h-[180px] md:h-[280px] overflow-hidden pointer-events-none select-none z-30"
      >
        {/* Pulsing sunrise glow */}
        <div
          ref={horizonPulseRef}
          className="absolute left-1/2 -translate-x-1/2 bottom-[-15px] w-[550px] h-[160px] md:w-[800px] md:h-[240px] rounded-t-full bg-radial from-light-gold/30 via-royal-purple/40 to-transparent blur-[45px]"
        />

        {/* Atmospheric highlight bloom */}
        <div
          ref={horizonBloomRef}
          className="absolute left-1/2 -translate-x-1/2 bottom-[-45px] w-[280px] h-[120px] md:w-[420px] md:h-[150px] rounded-t-full bg-radial from-white/35 via-light-gold/35 to-transparent blur-[16px]"
        />
      </div>
    </section>
  );
};

export default Hero;
