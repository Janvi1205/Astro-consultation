import React, { useState, useEffect, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { supabase } from '../../lib/supabase';

gsap.registerPlugin(ScrollTrigger);

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef(null);
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('id, rating, text, name, role')
          .eq('is_visible', true)
          .is('deleted_at', null)
          .order('created_at', { ascending: false });
        if (data) {
          setReviews(data);
        }
      } catch (err) {
        console.error('Error fetching testimonials', err);
      }
    };
    fetchReviews();
  }, []);

  const startTimer = () => {
    if (reviews.length === 0) return;
    stopTimer();
    timerRef.current = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % reviews.length);
    }, 5500);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    if (reviews.length > 0) {
      startTimer();
    }
    return () => stopTimer();
  }, [activeIndex, reviews.length]);

  // Card transition animation
  useEffect(() => {
    if (cardRef.current && reviews.length > 0) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, x: direction * 30 },
        { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [activeIndex, reviews.length]);

  // Scroll reveal
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleNext = () => {
    if (reviews.length === 0) return;
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    if (reviews.length === 0) return;
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleBulletClick = (index) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  if (reviews.length === 0) {
    return (
      <section
        id="testimonials"
        style={{
          width: '100%',
          background: '#0D0F1A',
          padding: '80px 24px',
          textAlign: 'center',
          color: 'rgba(250,247,242,0.6)'
        }}
      >
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontStyle: 'italic' }}>
          Loading client testimonials...
        </p>
      </section>
    );
  }

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      style={{
        width: '100%',
        background: 'linear-gradient(180deg, #0D0F1A 0%, #111427 50%, #0D0F1A 100%)',
        padding: '80px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 10 }}>

        {/* Section Header */}
        <div ref={headerRef} style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span
            style={{
              display: 'inline-block',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '4px',
              color: '#D4AF37',
              textTransform: 'uppercase',
              marginBottom: '16px',
              padding: '4px 14px',
              border: '1px solid rgba(212,175,55,0.3)',
              borderRadius: '20px',
              fontFamily: 'var(--font-sans)',
            }}
          >
            ✦ Testimonials ✦
          </span>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '40px',
              fontWeight: 500,
              lineHeight: 1.2,
              margin: '0 0 16px 0',
              color: '#FAF7F2',
              letterSpacing: '0.5px',
            }}
          >
            Voices of{' '}
            <span
              style={{
                fontStyle: 'italic',
                background: 'linear-gradient(135deg, #D4AF37 0%, #F0D98A 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Transformation
            </span>
          </h2>

          <div
            style={{
              width: '50px',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
              margin: '0 auto',
            }}
          />
        </div>

        {/* Testimonial Card */}
        <div
          style={{
            position: 'relative',
            maxWidth: '580px',
            margin: '0 auto',
          }}
        >
          {/* Quote mark */}
          <div
            style={{
              position: 'absolute',
              top: '-18px',
              left: '32px',
              zIndex: 20,
              fontSize: '48px',
              fontFamily: 'Georgia, serif',
              color: '#D4AF37',
              opacity: 0.5,
              lineHeight: 1,
            }}
          >
            ❝
          </div>

          <div
            ref={cardRef}
            style={{
              background: 'linear-gradient(145deg, rgba(17,20,39,0.95) 0%, rgba(13,15,26,0.98) 100%)',
              border: '1px solid rgba(212,175,55,0.15)',
              borderRadius: '16px',
              padding: '40px 36px 32px',
              position: 'relative',
              overflow: 'hidden',
              minHeight: '200px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            {/* Subtle inner glow */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '200px',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)',
              }}
            />

            {/* Stars */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
              {Array.from({ length: reviews[activeIndex].rating }).map((_, i) => (
                <Star
                  key={i}
                  style={{
                    width: '16px',
                    height: '16px',
                    color: '#D4AF37',
                    fill: '#D4AF37',
                  }}
                />
              ))}
            </div>

            {/* Quote text */}
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '15px',
                fontWeight: 400,
                fontStyle: 'italic',
                lineHeight: 1.7,
                color: 'rgba(250,247,242,0.8)',
                margin: '0 0 24px 0',
                maxWidth: '460px',
                letterSpacing: '0.2px',
              }}
            >
              "{reviews[activeIndex].text}"
            </p>

            {/* Author */}
            <div>
              <h4
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#D4AF37',
                  margin: '0 0 4px 0',
                  letterSpacing: '1px',
                }}
              >
                {reviews[activeIndex].name}
              </h4>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '10px',
                  fontWeight: 600,
                  color: 'rgba(212,175,55,0.5)',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  margin: 0,
                }}
              >
                {reviews[activeIndex].role}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            marginTop: '32px',
          }}
        >
          {/* Prev button */}
          <button
            onClick={handlePrev}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '1px solid rgba(212,175,55,0.25)',
              background: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              color: '#D4AF37',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(212,175,55,0.6)';
              e.currentTarget.style.background = 'rgba(212,175,55,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(212,175,55,0.25)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <ChevronLeft style={{ width: '16px', height: '16px' }} />
          </button>

          {/* Dots */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => handleBulletClick(i)}
                style={{
                  width: activeIndex === i ? '24px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.4s ease',
                  background: activeIndex === i
                    ? '#D4AF37'
                    : 'rgba(250,247,242,0.2)',
                  boxShadow: activeIndex === i
                    ? '0 0 10px rgba(212,175,55,0.4)'
                    : 'none',
                }}
              />
            ))}
          </div>

          {/* Next button */}
          <button
            onClick={handleNext}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '1px solid rgba(212,175,55,0.25)',
              background: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              color: '#D4AF37',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(212,175,55,0.6)';
              e.currentTarget.style.background = 'rgba(212,175,55,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(212,175,55,0.25)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <ChevronRight style={{ width: '16px', height: '16px' }} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
