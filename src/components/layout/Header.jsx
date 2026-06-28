import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { gsap } from 'gsap';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const location = useLocation();
  const navigate = useNavigate();

  const headerRef = useRef(null);
  const linksRef = useRef([]);
  const ctaRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const menuItems = [
    { name: 'Home', id: 'hero', path: '/' },
    { name: 'About', id: 'about', path: '/#about' },
    { name: 'Services', id: 'services', path: '/#services' },
    { name: 'Testimonials', id: 'testimonials', path: '/#testimonials' },
    { name: 'Contact', id: 'contact', path: '/#contact' },
  ];

  // Scroll detection and ScrollSpy logic
  useEffect(() => {
    const handleScroll = () => {
      // 1. Update scrolled state
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // 2. ScrollSpy logic (homepage only)
      if (location.pathname === '/') {
        const scrollPosition = window.scrollY + 160; // offset for floating navbar + buffer
        let currentSection = 'hero';

        for (const item of menuItems) {
          const element = document.getElementById(item.id);
          if (element) {
            const top = element.offsetTop;
            const height = element.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
              currentSection = item.id;
            }
          }
        }
        setActiveSection(currentSection);
      } else {
        setActiveSection('');
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once initially
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Handle hash scrolling when arriving from another page
  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      const targetId = location.hash.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        // Delay scroll slightly to ensure DOM is fully rendered
        const timeoutId = setTimeout(() => {
          const offset = 100;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }, 150);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [location.pathname, location.hash]);

  // GSAP Load Animations
  useEffect(() => {
    // Slide down header
    gsap.fromTo(
      headerRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out' }
    );

    // Stagger links
    if (linksRef.current.length > 0) {
      gsap.fromTo(
        linksRef.current.filter(Boolean),
        { opacity: 0, y: -15 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.06,
          duration: 0.6,
          ease: 'power2.out',
          delay: 0.3,
        }
      );
    }

    // CTA pulsing glow
    if (ctaRef.current) {
      gsap.fromTo(
        ctaRef.current,
        { boxShadow: '0 0 10px rgba(212, 175, 55, 0.1)' },
        {
          boxShadow: '0 0 20px rgba(212, 175, 55, 0.4)',
          repeat: -1,
          yoyo: true,
          duration: 2.0,
          ease: 'sine.inOut',
        }
      );
    }
  }, []);

  // Animate Mobile Menu on toggle
  useEffect(() => {
    if (isMobileMenuOpen && mobileMenuRef.current) {
      gsap.fromTo(
        mobileMenuRef.current,
        { opacity: 0, y: -15, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [isMobileMenuOpen]);

  const handleNavClick = (e, item) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (location.pathname === '/') {
      const element = document.getElementById(item.id);
      if (element) {
        const offset = 100; // height of floating navbar + spacing
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    } else {
      navigate(item.path);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 flex justify-center pointer-events-none py-4 sm:py-6 transition-all duration-500">
        <div
          ref={headerRef}
          className={`pointer-events-auto flex items-center justify-between transition-all duration-500 ease-out ${
            isScrolled
              ? 'w-[92%] max-w-[1200px] rounded-full border border-accent-gold/15 bg-primary/80 backdrop-blur-lg py-3 px-6 sm:px-8 shadow-[0_12px_40px_rgba(18,4,40,0.55),_0_2px_12px_rgba(212,175,55,0.15)]'
              : 'w-full max-w-[1280px] mx-auto px-6 py-2 border-b border-transparent bg-transparent'
          }`}
        >
          {/* Logo with crest */}
          <Link to="/" className="flex items-center gap-3 group pointer-events-auto">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-light-gold via-accent-gold to-accent-gold flex items-center justify-center shadow-[0_0_12px_rgba(212,175,55,0.25)] group-hover:shadow-[0_0_20px_rgba(212,175,55,0.45)] transition-all duration-500 group-hover:scale-105">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                {/* Concave 4-point star */}
                <path d="M12 3.5 Q12 12 20.5 12 Q12 12 12 20.5 Q12 12 3.5 12 Q12 12 12 3.5 Z" />
                {/* Plus symbol */}
                <path d="M17 6 h3 M18.5 4.5 v3" strokeWidth="1.8" />
                {/* Dot */}
                <circle cx="6.5" cy="17.5" r="0.8" fill="currentColor" stroke="none" />
              </svg>
            </div>

            <div className="flex flex-col">
              <span className="font-display text-base sm:text-[19px] tracking-[0.12em] font-semibold text-light-gold group-hover:text-white transition-colors duration-300 leading-tight">
                Pradeep Malhotra
              </span>
              <span className="font-sans text-[9px] tracking-[0.26em] font-semibold text-cream/75 uppercase mt-0.5 leading-none group-hover:text-light-gold transition-colors duration-300">
                Vedic Astrologer
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav role="navigation" aria-label="Main navigation" className="hidden md:flex items-center gap-6 lg:gap-8">
            {menuItems.map((item, idx) => (
              <a
                ref={(el) => (linksRef.current[idx] = el)}
                key={item.name}
                href={item.path}
                onClick={(e) => handleNavClick(e, item)}
                className={`relative text-[13px] tracking-[0.18em] uppercase font-semibold transition-all duration-300 py-2 group ${
                  activeSection === item.id 
                    ? 'text-light-gold font-bold' 
                    : 'text-cream/70 hover:text-light-gold'
                }`}
              >
                {item.name}
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[1.5px] bg-accent-gold transition-all duration-300 ${
                  activeSection === item.id ? 'w-1/2' : 'w-0 group-hover:w-1/2'
                }`} />
              </a>
            ))}
          </nav>

          {/* CTA Book Button */}
          <div className="hidden md:block">
            <Link to="/booking">
              <button
                ref={ctaRef}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-accent-gold to-light-gold text-primary font-bold text-xs tracking-wider uppercase border border-accent-gold/25 cursor-pointer shine-sweep-btn transition-transform duration-300 hover:scale-105"
              >
                Book Consultation
              </button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
            className="md:hidden text-cream hover:text-accent-gold transition-colors p-1 cursor-pointer pointer-events-auto"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Glass Drawer Overlay Card */}
      {isMobileMenuOpen && (
        <>
          {/* Subtle Backdrop Blur */}
          <div 
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Floating Dropdown Card */}
          <div
            ref={mobileMenuRef}
            role="navigation"
            aria-label="Mobile navigation"
            className="fixed top-24 left-1/2 -translate-x-1/2 w-[92%] max-w-[400px] z-50 rounded-2xl border border-accent-gold/20 bg-primary/95 backdrop-blur-xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.55),_0_0_30px_rgba(212,175,55,0.12)] flex flex-col gap-6 md:hidden"
          >
            <div className="flex flex-col gap-3">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.path}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`text-sm tracking-[0.2em] uppercase font-semibold py-3 px-4 rounded-xl border border-transparent transition-all duration-300 ${
                    activeSection === item.id 
                      ? 'text-light-gold bg-accent-gold/10 border-accent-gold/10 font-bold' 
                      : 'text-cream/80 hover:text-light-gold hover:bg-white/5'
                  }`}
                >
                  {item.name}
                </a>
              ))}
            </div>

            <div className="border-t border-white/5 pt-4">
              <Link to="/booking" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-accent-gold to-light-gold text-primary font-bold tracking-widest text-xs uppercase shadow-luxury-gold shine-sweep-btn cursor-pointer">
                  Book Consultation
                </button>
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;
