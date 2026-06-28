import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const WhyChooseUs = () => {
  const features = [
    {
      title: 'Accurate Predictions',
      desc: 'Precise and reliable astrological insights.',
      svg: (
        <svg viewBox="0 0 100 100" className="w-6 h-6">
          <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="16" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="50" cy="50" r="4" fill="currentColor" />
          <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="2" />
          <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    },
    {
      title: 'Confidential & Safe',
      desc: 'Your privacy is our priority. 100% confidential.',
      svg: (
        <svg viewBox="0 0 100 100" className="w-6 h-6">
          <rect x="25" y="42" width="50" height="38" rx="6" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M36 42 V28 C36 18, 44 14, 50 14 C56 14, 64 18, 64 28 V42" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="50" cy="60" r="4" fill="currentColor" />
          <path d="M50 64 V70" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    },
    {
      title: 'Personalized Guidance',
      desc: 'Solutions tailored to your unique birth chart.',
      svg: (
        <svg viewBox="0 0 100 100" className="w-6 h-6">
          <circle cx="50" cy="30" r="18" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M20 78 C20 60, 32 54, 50 54 C68 54, 80 60, 80 78" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    },
    {
      title: 'Practical Remedies',
      desc: 'Simple and effective remedies for real-life challenges.',
      svg: (
        <svg viewBox="0 0 100 100" className="w-6 h-6">
          <path d="M50 12 L59 34 L82 34 L64 48 L71 70 L50 56 L29 70 L36 48 L18 34 L41 34 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="50" cy="40" r="3" fill="currentColor" />
        </svg>
      )
    },
    {
      title: 'Years of Experience',
      desc: 'Decades of knowledge and hands-on practice.',
      svg: (
        <svg viewBox="0 0 100 100" className="w-6 h-6">
          <circle cx="50" cy="40" r="24" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M50 16 L50 64 M32 40 L68 40" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 2" />
          <path d="M38 60 L28 86 L50 76 L72 86 L62 60" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="50,30 54,38 62,38 56,43 58,50 50,45 42,50 44,43 38,38 46,38" fill="currentColor" />
        </svg>
      )
    },
    {
      title: 'Continuous Support',
      desc: 'Guidance doesn\'t end after the session.',
      svg: (
        <svg viewBox="0 0 100 100" className="w-6 h-6">
          <path d="M22 55 V48 C22 30, 34 20, 50 20 C66 20, 78 30, 78 48 V55" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <rect x="16" y="52" width="10" height="18" rx="2" fill="currentColor" />
          <rect x="74" y="52" width="10" height="18" rx="2" fill="currentColor" />
          <path d="M20 70 C20 76, 32 78, 50 78 C68 78, 80 76, 80 70" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )
    }
  ];

  const gridRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    // Reveal header
    const headerReveal = gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );

    // Stagger reveal strip items
    const cards = gridRef.current.children;
    const cardsReveal = gsap.fromTo(
      cards,
      { opacity: 0, y: 35 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        onComplete: () => {
          // Self-drawing SVG path strokes
          Array.from(cards).forEach((card) => {
            const paths = card.querySelectorAll('svg path, svg circle, svg rect, svg line, svg polygon');
            if (paths.length > 0) {
              gsap.fromTo(
                paths,
                { strokeDasharray: 120, strokeDashoffset: 120 },
                { strokeDashoffset: 0, duration: 1.5, stagger: 0.06, ease: 'power1.out' }
              );
            }
          });
        }
      }
    );

    return () => {
      headerReveal.scrollTrigger?.kill();
      cardsReveal.scrollTrigger?.kill();
    };
  }, []);

  const CardSpotlight = ({ feature, index, total }) => {
    const cardRef = useRef(null);
    const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e) => {
      const rect = cardRef.current.getBoundingClientRect();
      setMouseCoords({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    };

    return (
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative flex flex-col items-center text-center px-6 py-10 transition-colors duration-500 overflow-hidden cursor-pointer ${
          index < total - 1 ? 'lg:border-r lg:border-accent-gold/15' : ''
        }`}
      >
        {/* Spotlight overlay effect */}
        <div
          className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(130px circle at ${mouseCoords.x}px ${mouseCoords.y}px, rgba(212, 175, 55, 0.06), transparent 75%)`
          }}
        />

        {/* Icon wrapper */}
        <div className="relative z-10 w-14 h-14 rounded-full border border-accent-gold/20 flex items-center justify-center text-accent-gold mb-6 group transition-all duration-500 hover:border-accent-gold hover:shadow-gold-glow">
          <div className="absolute inset-0 rounded-full bg-accent-gold/5 group-hover:bg-accent-gold/15 transition-all duration-500" />
          <div className="relative z-10 flex items-center justify-center">
            {feature.svg}
          </div>
        </div>

        {/* Feature Title */}
        <h3 className="relative z-10 text-base font-display font-medium tracking-wider text-cream mb-3 hover:text-light-gold transition-colors duration-300">
          {feature.title}
        </h3>

        {/* Feature description */}
        <p className="relative z-10 text-xs font-sans font-light leading-relaxed text-cream/65 max-w-[150px]">
          {feature.desc}
        </p>
      </div>
    );
  };

  return (
    <section
      id="why-choose-us"
      className="relative w-full bg-dark-purple overflow-hidden px-6 border-y border-accent-gold/10"
    >
      {/* Background drifting cosmic dust */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30 bg-grid-pattern" />

      {/* Floating particles */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-40">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-light-gold/30 blur-[0.5px] animate-[float_8s_ease-in-out_infinite]"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 80 + 10}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-[1280px] mx-auto relative z-20 py-16 md:py-24">
        {/* Section Header */}
        <div ref={headerRef} className="text-center max-w-[700px] mx-auto mb-16">
          <span className="text-xs font-bold tracking-[0.35em] text-accent-gold uppercase mb-3 block animate-[pulse_3s_infinite]">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-medium tracking-wide text-cream">
            Why Clients Trust Us
          </h2>
          <div className="w-16 h-[1.5px] bg-accent-gold mx-auto mt-4" />
        </div>

        {/* Feature Horizontal Strip Grid (6 Columns) */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 lg:gap-0 bg-primary/20 rounded-luxury border border-accent-gold/5 backdrop-blur-md"
        >
          {features.map((feature, idx) => (
            <CardSpotlight
              key={idx}
              feature={feature}
              index={idx}
              total={features.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
