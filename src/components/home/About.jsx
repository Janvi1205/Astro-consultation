import React, { useEffect, useRef } from 'react';
import { Star, Users, Compass, Shield } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import astrologerPerson from '../../assets/astrologer-person.webp';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const trustIndicators = [
    { title: '10+ Years of Experience', icon: Star },
    { title: 'Thousands of Happy Clients', icon: Users },
    { title: 'Accurate Predictions & Practical Remedies', icon: Compass },
    { title: 'Confidential & Personalized Guidance', icon: Shield },
  ];

  const sectionRef = useRef(null);
  const zodiacWheelRef = useRef(null);
  const particlesRef = useRef(null);
  const labelRef = useRef(null);
  const headingRef = useRef(null);
  const dividerRef = useRef(null);
  const bodyRef = useRef(null);
  const benefitsRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Zodiac wheel: 120s slow infinite rotation
      gsap.to(zodiacWheelRef.current, {
        rotate: 360,
        repeat: -1,
        duration: 120,
        ease: 'none',
      });

      // Floating golden particles
      if (particlesRef.current) {
        const particles = particlesRef.current.querySelectorAll('.about-particle');
        gsap.to(particles, {
          x: () => gsap.utils.random(-30, 30),
          y: () => gsap.utils.random(-30, 30),
          opacity: () => gsap.utils.random(0.12, 0.5),
          duration: () => gsap.utils.random(8, 14),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          stagger: { each: 0.3, from: 'random' },
        });
      }

      // Scroll-triggered reveals
      // Label
      gsap.fromTo(
        labelRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Heading
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Divider
      gsap.fromTo(
        dividerRef.current,
        { opacity: 0, scaleX: 0 },
        {
          opacity: 1,
          scaleX: 1,
          duration: 0.8,
          delay: 0.3,
          ease: 'power3.out',
          transformOrigin: 'left center',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Body text
      gsap.fromTo(
        bodyRef.current,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.4,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Benefits – staggered reveal
      if (benefitsRef.current) {
        const items = benefitsRef.current.querySelectorAll('.about-benefit-item');
        gsap.fromTo(
          items,
          { opacity: 0, x: -25 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            ease: 'power3.out',
            stagger: 0.12,
            scrollTrigger: {
              trigger: benefitsRef.current,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Image – fade + scale-in
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, scale: 0.92, y: 60 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.3,
          delay: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: imageRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="about-section relative w-full overflow-hidden"
      style={{
        backgroundColor: '#FAF8F4',
        minHeight: '600px',
      }}
    >
      {/* ── Responsive styling block ── */}
      <style>{`
        .about-section {
          --zodiac-size: 620px;
          --zodiac-svg-size: 540px;
          --orbit1-size: 580px;
          --orbit2-size: 500px;
          --orbit3-size: 660px;
          --glow-size: 500px;
          --portrait-height: 560px;
        }
        @media (max-width: 1024px) {
          .about-section {
            --zodiac-size: 480px;
            --zodiac-svg-size: 410px;
            --orbit1-size: 450px;
            --orbit2-size: 390px;
            --orbit3-size: 510px;
            --glow-size: 390px;
            --portrait-height: 440px;
          }
          .about-main-container {
            padding: 60px 40px 0 40px !important;
          }
          .about-flex-container {
            flex-direction: column !important;
            gap: 48px !important;
          }
          .about-left-col {
            width: 100% !important;
            max-width: 600px !important;
            margin: 0 auto !important;
          }
          .about-right-col {
            width: 100% !important;
            min-height: calc(var(--portrait-height) + 30px) !important;
          }
          .about-heading {
            white-space: normal !important;
            text-align: center !important;
          }
          .about-label {
            text-align: center !important;
          }
          .about-divider {
            justify-content: center !important;
          }
        }
        @media (max-width: 640px) {
          .about-section {
            --zodiac-size: 360px;
            --zodiac-svg-size: 310px;
            --orbit1-size: 340px;
            --orbit2-size: 290px;
            --orbit3-size: 385px;
            --glow-size: 290px;
            --portrait-height: 330px;
          }
          .about-main-container {
            padding: 48px 20px 0 20px !important;
          }
          .about-left-col {
            max-width: 100% !important;
          }
          .about-heading {
            font-size: 38px !important;
          }
        }
      `}</style>

      {/* ── Luxury Background Layers ── */}

      {/* Subtle radial gradients */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-15%',
          right: '-10%',
          width: '55%',
          height: '55%',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '-15%',
          left: '-8%',
          width: '45%',
          height: '45%',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(43,25,86,0.04) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />

      {/* Subtle luxury grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.18,
          backgroundSize: '50px 50px',
          backgroundImage:
            'linear-gradient(to right, rgba(212,175,55,0.015) 1px, transparent 1px), linear-gradient(to bottom, rgba(212,175,55,0.015) 1px, transparent 1px)',
        }}
      />

      {/* Celestial edge particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity: 0.35 }}>
        {Array.from({ length: 14 }).map((_, i) => {
          const positions = [
            { left: '3%', top: '8%' },
            { left: '92%', top: '5%' },
            { left: '96%', top: '22%' },
            { left: '88%', top: '45%' },
            { left: '5%', top: '85%' },
            { left: '12%', top: '92%' },
            { left: '94%', top: '78%' },
            { left: '48%', top: '3%' },
            { left: '72%', top: '95%' },
            { left: '2%', top: '50%' },
            { left: '98%', top: '60%' },
            { left: '25%', top: '97%' },
            { left: '78%', top: '2%' },
            { left: '55%', top: '98%' },
          ];
          const pos = positions[i];
          const size = i % 3 === 0 ? 3 : 2;
          return (
            <div
              key={i}
              className="absolute rounded-full animate-pulse"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: '#D4AF37',
                ...pos,
                animationDelay: `${i * 0.4}s`,
                animationDuration: `${2.5 + (i % 4) * 0.6}s`,
              }}
            />
          );
        })}
      </div>

      {/* Minimal golden corner accents */}
      <div
        className="about-corner-accent absolute pointer-events-none"
        style={{
          top: '40px',
          left: '40px',
          width: '60px',
          height: '60px',
          borderTop: '1px solid rgba(212,175,55,0.18)',
          borderLeft: '1px solid rgba(212,175,55,0.18)',
        }}
      />
      <div
        className="about-corner-accent absolute pointer-events-none"
        style={{
          top: '40px',
          right: '40px',
          width: '60px',
          height: '60px',
          borderTop: '1px solid rgba(212,175,55,0.18)',
          borderRight: '1px solid rgba(212,175,55,0.18)',
        }}
      />

      {/* ── Main Content Container ── */}
      <div
        className="about-main-container relative z-10 mx-auto w-full flex items-center"
        style={{
          maxWidth: '1200px',
          minHeight: '600px',
          padding: '48px 60px 0 60px',
          boxSizing: 'border-box',
        }}
      >
        <div className="about-flex-container flex w-full items-center" style={{ gap: '32px' }}>
          {/* ━━━ LEFT COLUMN (45%) ━━━ */}
          <div
            className="about-left-col flex flex-col justify-center"
            style={{ width: '45%', flexShrink: 0 }}
          >
            {/* Top Label */}
            <span
              ref={labelRef}
              className="about-label"
              style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '4px',
                color: '#D4AF37',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-sans)',
                marginBottom: '12px',
              }}
            >
              ABOUT THE ASTROLOGER
            </span>

            {/* Main Heading */}
            <h2
              ref={headingRef}
              className="about-heading"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '52px',
                fontWeight: 500,
                lineHeight: 1.1,
                letterSpacing: '0.5px',
                margin: 0,
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ color: '#2B1956' }}>Pradeep </span>
              <span
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #F0D98A 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Malhotra
              </span>
            </h2>

            {/* Decorative Divider */}
            <div
              ref={dividerRef}
              className="about-divider"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '14px',
                marginBottom: '20px',
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 16 16"
                fill="none"
                style={{ flexShrink: 0 }}
              >
                <path
                  d="M8 0L9.8 6.2L16 8L9.8 9.8L8 16L6.2 9.8L0 8L6.2 6.2Z"
                  fill="#D4AF37"
                />
              </svg>
              <div
                style={{
                  height: '1.5px',
                  width: '60px',
                  background:
                    'linear-gradient(90deg, #D4AF37 0%, rgba(212,175,55,0.3) 100%)',
                  borderRadius: '1px',
                }}
              />
            </div>

            {/* Body Text */}
            <div ref={bodyRef} className="about-body-text" style={{ maxWidth: '420px', width: '100%' }}>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '15px',
                  lineHeight: 1.75,
                  fontWeight: 400,
                  color: '#555555',
                  margin: 0,
                }}
              >
                With over a decade of dedicated practice in Vedic Jyotish, Pradeep Malhotra combines traditional astrological wisdom with practical, real-life guidance. From birth chart analysis to personalized remedies, every consultation is focused on providing clarity, direction, and meaningful solutions.
              </p>

              {/* Styled Quote Block */}
              <div
                style={{
                  position: 'relative',
                  backgroundColor: '#FAF5ED',
                  borderLeft: '3px solid #D4AF37',
                  padding: '20px 24px',
                  borderRadius: '0 8px 8px 0',
                  marginTop: '24px',
                }}
              >
                {/* Background quotes symbol */}
                <span
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    left: '12px',
                    fontSize: '48px',
                    fontFamily: 'var(--font-display)',
                    color: 'rgba(212, 175, 55, 0.18)',
                    lineHeight: 1,
                    pointerEvents: 'none',
                    userSelect: 'none',
                    fontWeight: 'bold',
                  }}
                >
                  “
                </span>

                {/* Quote Text */}
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '21px',
                    fontStyle: 'italic',
                    fontWeight: 500,
                    lineHeight: 1.45,
                    color: '#1A0638',
                    margin: '0 0 10px 0',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  "If I can give you light, then I am an <span style={{ color: '#D4AF37', fontStyle: 'italic' }}>Astrologer</span>"
                </p>

                {/* Author Info */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '1px',
                      backgroundColor: '#D4AF37',
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '11px',
                      fontWeight: 600,
                      letterSpacing: '1.5px',
                      color: '#D4AF37',
                      textTransform: 'uppercase',
                    }}
                  >
                    Pradeep Malhotra
                  </span>
                </div>
              </div>
            </div>

            {/* Benefits List */}
            <div
              ref={benefitsRef}
              style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '14px' }}
            >
              {trustIndicators.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={idx}
                    className="about-benefit-item group"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      cursor: 'pointer',
                      transition: 'transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(8px)';
                      const circle = e.currentTarget.querySelector('.benefit-circle');
                      if (circle) circle.style.boxShadow = '0 0 20px rgba(212,175,55,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      const circle = e.currentTarget.querySelector('.benefit-circle');
                      if (circle) circle.style.boxShadow = 'none';
                    }}
                  >
                    <div
                      className="benefit-circle"
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        border: '1.5px solid rgba(212,175,55,0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'box-shadow 0.35s ease',
                      }}
                    >
                      <IconComponent
                        style={{
                          width: '16px',
                          height: '16px',
                          color: '#D4AF37',
                          strokeWidth: 1.5,
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#2B1956',
                        fontFamily: 'var(--font-sans)',
                      }}
                    >
                      {item.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ━━━ RIGHT COLUMN (55%) ━━━ */}
          <div
            className="about-right-col relative flex justify-center items-end"
            style={{
              width: '55%',
              minHeight: 'var(--portrait-height)',
              overflow: 'visible',
            }}
          >
            {/* Zodiac Artwork Background */}
            <div
              className="absolute pointer-events-none select-none"
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -48%)',
                width: 'var(--zodiac-size)',
                height: 'var(--zodiac-size)',
              }}
            >
              {/* Golden ambient glow behind wheel */}
              <div
                className="absolute"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 'var(--glow-size)',
                  height: 'var(--glow-size)',
                  borderRadius: '50%',
                  background:
                    'radial-gradient(circle, rgba(212,175,55,0.25) 0%, rgba(212,175,55,0.08) 50%, transparent 70%)',
                  filter: 'blur(40px)',
                }}
              />

              {/* Orbit rings */}
              <div
                className="absolute"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%) rotate(15deg)',
                  width: 'var(--orbit1-size)',
                  height: 'var(--orbit1-size)',
                  borderRadius: '50%',
                  border: '1.5px solid rgba(212,175,55,0.3)',
                }}
              />
              <div
                className="absolute"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%) rotate(-30deg)',
                  width: 'var(--orbit2-size)',
                  height: 'var(--orbit2-size)',
                  borderRadius: '50%',
                  border: '1.5px dashed rgba(212,175,55,0.2)',
                }}
              />
              <div
                className="absolute"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%) rotate(45deg)',
                  width: 'var(--orbit3-size)',
                  height: 'var(--orbit3-size)',
                  borderRadius: '50%',
                  border: '1.5px solid rgba(212,175,55,0.18)',
                }}
              />

              {/* Main Zodiac Wheel SVG */}
              <div
                ref={zodiacWheelRef}
                className="absolute"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 'var(--zodiac-svg-size)',
                  height: 'var(--zodiac-svg-size)',
                  color: '#D4AF37',
                  opacity: 0.3,
                }}
              >
                <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%' }}>
                  <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="0.25" strokeDasharray="0.6 1.8" />
                  <circle cx="100" cy="100" r="93" fill="none" stroke="currentColor" strokeWidth="0.4" />
                  <circle cx="100" cy="100" r="89" fill="none" stroke="currentColor" strokeWidth="0.7" />
                  {Array.from({ length: 36 }).map((_, i) => {
                    const angle = (i * 10 * Math.PI) / 180;
                    return <line key={`tick-${i}`} x1={100 + Math.cos(angle) * 89} y1={100 + Math.sin(angle) * 89} x2={100 + Math.cos(angle) * 92.5} y2={100 + Math.sin(angle) * 92.5} stroke="currentColor" strokeWidth="0.25" />;
                  })}
                  <circle cx="100" cy="100" r="74" fill="none" stroke="currentColor" strokeWidth="0.4" />
                  <circle cx="100" cy="100" r="56" fill="none" stroke="currentColor" strokeWidth="0.3" />
                  <g stroke="currentColor" strokeWidth="0.25">
                    {Array.from({ length: 12 }).map((_, i) => {
                      const angle = (i * 30 * Math.PI) / 180;
                      return <line key={`sector-${i}`} x1={100 + Math.cos(angle) * 32} y1={100 + Math.sin(angle) * 32} x2={100 + Math.cos(angle) * 89} y2={100 + Math.sin(angle) * 89} />;
                    })}
                  </g>
                  {Array.from({ length: 12 }).map((_, i) => {
                    const angle = ((i * 30 + 15) * Math.PI) / 180;
                    return (
                      <g key={`star-${i}`} transform={`translate(${100 + Math.cos(angle) * 81.5}, ${100 + Math.sin(angle) * 81.5})`}>
                        <path d="M 0,-1.5 L 0.4,-0.4 L 1.5,0 L 0.4,0.4 L 0,1.5 L -0.4,0.4 L -1.5,0 L -0.4,-0.4 Z" fill="currentColor" />
                      </g>
                    );
                  })}
                  {['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'].map((glyph, i) => {
                    const angle = ((i * 30 + 15) * Math.PI) / 180;
                    return <text key={`glyph-${i}`} x={100 + Math.cos(angle) * 65} y={100 + Math.sin(angle) * 65} fill="currentColor" fontSize="4.5" textAnchor="middle" dominantBaseline="central" opacity="0.7">{glyph}</text>;
                  })}
                  <circle cx="100" cy="100" r="32" fill="none" stroke="currentColor" strokeWidth="0.3" />
                  <circle cx="100" cy="100" r="16" fill="none" stroke="currentColor" strokeWidth="0.3" strokeDasharray="0.8 0.8" />
                  <polygon points="100,68 128,116 72,116" fill="none" stroke="currentColor" strokeWidth="0.3" />
                  <polygon points="100,132 128,84 72,84" fill="none" stroke="currentColor" strokeWidth="0.3" />
                  <circle cx="100" cy="100" r="4" fill="currentColor" opacity="0.6" />
                </svg>
              </div>

              {/* Drifting golden particles around zodiac */}
              <div ref={particlesRef} className="absolute inset-0 pointer-events-none select-none overflow-visible">
                {Array.from({ length: 18 }).map((_, i) => (
                  <div key={i} className="about-particle absolute rounded-full" style={{ width: `${(i % 3) * 1.5 + 2}px`, height: `${(i % 3) * 1.5 + 2}px`, background: 'linear-gradient(135deg, #D4AF37, #F0D98A)', opacity: 0.5, left: `${(i * 19 + 12) % 80 + 10}%`, top: `${(i * 23 + 8) % 80 + 10}%` }} />
                ))}
              </div>
            </div>

            {/* Astrologer Portrait */}
            <img
              ref={imageRef}
              src={astrologerPerson}
              alt="Astrologer Pradeep Malhotra"
              style={{
                position: 'relative',
                zIndex: 10,
                height: 'var(--portrait-height)',
                width: 'auto',
                objectFit: 'contain',
                objectPosition: 'bottom',
                pointerEvents: 'none',
                transition: 'transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)',
                marginBottom: '-2px',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.015)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            />
          </div>
        </div>
      </div>

      {/* Bottom golden accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: '1px',
          background:
            'linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.2) 30%, rgba(212,175,55,0.2) 70%, transparent 100%)',
        }}
      />

      {/* Responsive styles */}
      <style>{`
        .about-section {
          --zodiac-size: 620px;
          --zodiac-svg-size: 540px;
          --orbit1-size: 580px;
          --orbit2-size: 500px;
          --orbit3-size: 660px;
          --glow-size: 500px;
          --portrait-height: 560px;
        }

        @media (max-width: 1024px) {
          .about-section {
            --zodiac-size: 460px;
            --zodiac-svg-size: 400px;
            --orbit1-size: 430px;
            --orbit2-size: 370px;
            --orbit3-size: 490px;
            --glow-size: 370px;
            --portrait-height: 420px;
            min-height: auto !important;
          }

          .about-main-container {
            padding: 56px 40px 0 40px !important;
            min-height: auto !important;
          }

          .about-flex-container {
            flex-direction: column !important;
            gap: 48px !important;
          }

          .about-left-col {
            width: 100% !important;
            align-items: flex-start !important;
            text-align: left !important;
            max-width: 620px !important;
            margin: 0 auto !important;
          }

          .about-body-text {
            max-width: 100% !important;
          }

          .about-right-col {
            width: 100% !important;
            min-height: calc(var(--portrait-height) + 20px) !important;
          }

          .about-heading {
            white-space: normal !important;
          }
        }

        @media (max-width: 640px) {
          .about-section {
            --zodiac-size: 340px;
            --zodiac-svg-size: 300px;
            --orbit1-size: 320px;
            --orbit2-size: 280px;
            --orbit3-size: 360px;
            --glow-size: 280px;
            --portrait-height: 320px;
          }

          .about-heading {
            font-size: 38px !important;
          }

          .about-main-container {
            padding: 48px 24px 0 24px !important;
          }

          .about-corner-accent {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default About;
