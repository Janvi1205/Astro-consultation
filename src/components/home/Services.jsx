import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
  const services = [
    {
      title: 'Life prediction',
      description: 'Unveil your future path with accurate horoscope analysis, helping you prepare for opportunities and challenges ahead.',
      image: '/images/service_life.png',
    },
    {
      title: 'Career and Business Breakthrough',
      description: 'Unlock professional success, overcome financial hurdles, and achieve massive breakthroughs in your business journey.',
      image: '/images/service_career.png',
    },
    {
      title: 'Marriage Counselling',
      description: 'Comprehensive support for marital harmony and resolving deep-rooted relationship conflicts.',
      image: '/images/service_marriage.png',
    },
    {
      title: 'Numerology Consultation',
      description: 'Suggesting powerful and auspicious names for your child based on the unique vibrations of their birth chart.',
      image: '/images/service_numerology.png',
    },
    {
      title: 'Vaastu Consultation',
      description: 'Vedic Vaastu analysis to attract prosperity and peace. Specialized services for Delhi-based clients.',
      image: '/images/service_vaastu.png',
    },
    {
      title: 'Legal Consultation',
      description: 'Spiritual and astrological guidance for complex legal matters. Includes 1-personal or Zoom meetings.',
      image: '/images/service_legal.png',
    },
  ];

  const gridRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    // Scroll reveal header
    const headerReveal = gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );

    // Stagger cards reveal
    const cardsReveal = gsap.fromTo(
      gridRef.current.children,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );

    return () => {
      headerReveal.scrollTrigger?.kill();
      cardsReveal.scrollTrigger?.kill();
    };
  }, []);

  const handleCardMouseEnter = (e) => {
    const card = e.currentTarget;
    const img = card.querySelector('.service-card-img');
    const glow = card.querySelector('.glow-overlay');

    gsap.to(card, {
      y: -10,
      borderColor: 'rgba(212, 175, 55, 0.45)',
      boxShadow: '0 20px 45px rgba(18, 4, 40, 0.08), 0 0 20px rgba(212, 175, 55, 0.15)',
      duration: 0.35,
      ease: 'power2.out'
    });

    gsap.to(img, {
      scale: 1.05,
      duration: 0.5,
      ease: 'power2.out'
    });

    if (glow) {
      gsap.to(glow, {
        opacity: 1,
        duration: 0.3
      });
    }
  };

  const handleCardMouseLeave = (e) => {
    const card = e.currentTarget;
    const img = card.querySelector('.service-card-img');
    const glow = card.querySelector('.glow-overlay');

    gsap.to(card, {
      y: 0,
      borderColor: 'rgba(26, 6, 56, 0.05)',
      boxShadow: '0 15px 45px -10px rgba(18, 4, 40, 0.12)',
      duration: 0.35,
      ease: 'power2.out'
    });

    gsap.to(img, {
      scale: 1,
      duration: 0.5,
      ease: 'power2.out'
    });

    if (glow) {
      gsap.to(glow, {
        opacity: 0,
        duration: 0.3
      });
    }
  };

  return (
    <section
      id="services"
      className="relative w-full py-28 md:py-36 bg-cream text-dark-purple overflow-hidden px-6"
    >
      {/* Background Sacred Geometric Outlines - Low Opacity Dark */}
      <div className="absolute top-[8%] left-[4%] w-[450px] h-[450px] opacity-[0.03] text-dark-purple pointer-events-none select-none">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.3" />
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.15" strokeDasharray="3 3" />
          <polygon points="50,2 98,50 50,98 2,50" fill="none" stroke="currentColor" strokeWidth="0.2" />
        </svg>
      </div>

      <div className="max-w-[1280px] mx-auto relative z-10">
        
        {/* Section Header */}
        <div ref={headerRef} className="text-center max-w-[750px] mx-auto mb-20">
          <span className="text-xs font-bold tracking-[0.35em] text-accent-gold uppercase mb-3 block animate-[pulse_3s_infinite]">
            Services
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-medium tracking-wide text-dark-purple mb-4">
            Consultations & Guidance
          </h2>
          <div className="w-20 h-[2px] bg-accent-gold mx-auto mt-5" />
        </div>

        {/* Services Grid (2 Rows of 3 Cards) */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <div
              key={index}
              onMouseEnter={handleCardMouseEnter}
              onMouseLeave={handleCardMouseLeave}
              className="group relative flex flex-col justify-between bg-white p-6 rounded-luxury border border-dark-purple/5 shadow-luxury transition-all duration-500 overflow-hidden cursor-pointer"
            >
              {/* Background Glow Ring on Hover */}
              <div className="glow-overlay absolute -top-24 -right-24 w-48 h-48 rounded-full bg-accent-gold/5 opacity-0 blur-xl pointer-events-none transition-opacity duration-300" />

              <div>
                {/* Large Service Image Container */}
                <div className="relative w-full h-[200px] mb-6 rounded-luxury overflow-hidden border border-dark-purple/5">
                  <div className="absolute inset-0 bg-dark-purple/10 group-hover:bg-dark-purple/0 transition-all duration-500 z-10" />
                  
                  <img
                    src={service.image}
                    alt={service.title}
                    className="service-card-img w-full h-full object-cover"
                  />
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-display font-medium tracking-wide text-dark-purple mb-3 group-hover:text-accent-gold transition-colors duration-300">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-xs md:text-sm font-sans font-light leading-relaxed text-dark-purple/75 mb-8">
                  {service.description}
                </p>
              </div>

              {/* View Details Gold CTA Button */}
              <Link to="/booking">
                <button
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-[24px] bg-gradient-to-r from-accent-gold to-light-gold text-primary font-bold text-xs tracking-widest uppercase shadow-luxury hover:shadow-gold-glow/20 transition-transform duration-300 cursor-pointer shine-sweep-btn border border-accent-gold/20"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
