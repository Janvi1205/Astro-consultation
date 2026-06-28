import React, { useEffect, useRef } from 'react';
import { Sparkles, Phone, Mail, MapPin } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    // Staggered slide up of columns on scroll
    const columns = footerRef.current.querySelectorAll('.footer-col');
    const reveal = gsap.fromTo(
      columns,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      }
    );

    return () => {
      reveal.scrollTrigger?.kill();
    };
  }, []);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const quickLinks = [
    { name: 'Home', id: 'hero' },
    { name: 'About', id: 'about' },
    { name: 'Services', id: 'services' },
    { name: 'Why Us', id: 'about' }, // maps to about as Why Choose Us is merged/removed
    { name: 'Testimonials', id: 'testimonials' },
    { name: 'Contact', id: 'contact' },
  ];

  const services = [
    'Love Solutions',
    'Marriage Astrology',
    'Career Guidance',
    'Kundli Reading',
    'Vaastu',
    'Gemstone Advice',
  ];

  return (
    <footer
      ref={footerRef}
      style={{
        position: 'relative',
        backgroundColor: '#120428', // Website's theme cosmic dark color
        color: '#FAF7F2', // Cream color
        padding: '80px 24px 32px',
        overflow: 'hidden',
        borderTop: '1px solid rgba(212,175,55,0.15)',
      }}
    >
      {/* ── star background overlay ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.25,
          pointerEvents: 'none',
        }}
      >
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              borderRadius: '50%',
              background: '#D4AF37', // Gold color
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.6 + 0.2,
            }}
          />
        ))}
      </div>

      {/* ── top horizon glow line ── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
          height: '1px',
          background:
            'linear-gradient(90deg, transparent, rgba(212,175,55,0.5) 50%, transparent)',
        }}
      />

      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* ── grid layout ── */}
        <div
          className="footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '40px',
          }}
        >
          {/* Column 1: Brand */}
          <div className="footer-col" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #D4AF37 0%, #F0D98A 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 15px rgba(212,175,55,0.3)',
                }}
              >
                <Sparkles style={{ width: '20px', height: '20px', color: '#120428' }} />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '20px',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    background: 'linear-gradient(135deg, #FFFFFF 0%, #F4D06F 50%, #D4AF37 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Pradeep Malhotra
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '10px',
                    letterSpacing: '2.5px',
                    color: '#F0D98A',
                    textTransform: 'uppercase',
                    fontWeight: 500,
                    marginTop: '2px',
                  }}
                >
                  Vedic Astrologer
                </div>
              </div>
            </div>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                color: 'rgba(250,247,242,0.7)',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Ancient wisdom for modern lives. Personalized guidance crafted with
              sincerity, tradition, and trust.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col">
            <h4
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '18px',
                color: '#FAF7F2',
                marginBottom: '20px',
                fontWeight: 500,
              }}
            >
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => handleNavClick(e, link.id)}
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '13px',
                      color: 'rgba(250,247,242,0.7)',
                      textDecoration: 'none',
                      transition: 'color 0.25s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#D4AF37')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(250,247,242,0.7)')}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="footer-col">
            <h4
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '18px',
                color: '#FAF7F2',
                marginBottom: '20px',
                fontWeight: 500,
              }}
            >
              Services
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {services.map((service) => (
                <li key={service}>
                  <a
                    href="#services"
                    onClick={(e) => handleNavClick(e, 'services')}
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '13px',
                      color: 'rgba(250,247,242,0.7)',
                      textDecoration: 'none',
                      transition: 'color 0.25s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#D4AF37')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(250,247,242,0.7)')}
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Get in Touch */}
          <div className="footer-col">
            <h4
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '18px',
                color: '#FAF7F2',
                marginBottom: '20px',
                fontWeight: 500,
              }}
            >
              Get in Touch
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone style={{ width: '14px', height: '14px', color: '#D4AF37' }} />
                <a
                  href="tel:+919717721217"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '13px',
                    color: 'rgba(250,247,242,0.7)',
                    textDecoration: 'none',
                    transition: 'color 0.25s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#D4AF37')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(250,247,242,0.7)')}
                >
                  +91 97177 21217
                </a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail style={{ width: '14px', height: '14px', color: '#D4AF37' }} />
                <a
                  href="mailto:sbv3113@gmail.com"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '13px',
                    color: 'rgba(250,247,242,0.7)',
                    textDecoration: 'none',
                    transition: 'color 0.25s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#D4AF37')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(250,247,242,0.7)')}
                >
                  sbv3113@gmail.com
                </a>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin style={{ width: '14px', height: '14px', color: '#D4AF37', marginTop: '3px', flexShrink: 0 }} />
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '13px',
                    color: 'rgba(250,247,242,0.7)',
                    lineHeight: 1.5,
                  }}
                >
                  BA - 357/1, Block BA, Tagore Garden, Tagore Garden Extension, New
                  Delhi, Delhi, 110027
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* ── gold-divider line ── */}
        <div
          style={{
            width: '100%',
            height: '1px',
            background:
              'linear-gradient(90deg, transparent, rgba(212,175,55,0.3) 50%, transparent)',
            margin: '56px 0 24px',
          }}
        />

        {/* ── bottom bar ── */}
        <div
          className="footer-bottom"
          style={{
            display: 'flex',
            justifyContent: 'between',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '12px',
              color: 'rgba(250,247,242,0.4)',
              margin: 0,
              flexGrow: 1,
            }}
          >
            &copy; {new Date().getFullYear()} Pradeep Malhotra. All rights reserved.
          </p>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '12px',
              color: 'rgba(250,247,242,0.4)',
              margin: 0,
            }}
          >
            Crafted with sacred intention ✨
          </p>
        </div>
      </div>

      {/* ── responsive adjustments ── */}
      <style>{`
        @media (max-width: 576px) {
          .footer-bottom {
            flex-direction: column;
            text-align: center;
            gap: 8px;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
