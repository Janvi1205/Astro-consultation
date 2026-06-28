import React, { useState, useEffect, useRef } from 'react';
import { Phone, Mail, MapPin, Sparkles } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const WHATSAPP_NUMBER = '919717721217';

/* ── tiny inline WhatsApp icon ── */
const WhatsAppSvg = ({ size = 20, color = '#120428' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

/* ── reusable Field wrapper ── */
const Field = ({ label, required, children }) => (
  <label style={{ display: 'block' }}>
    <span
      style={{
        display: 'block',
        fontSize: '13px',
        fontWeight: 600,
        color: '#1A0638',
        fontFamily: 'var(--font-sans)',
        marginBottom: '8px',
      }}
    >
      {label}
      {required && (
        <span style={{ color: '#D4AF37', marginLeft: '3px' }}>*</span>
      )}
    </span>
    {children}
  </label>
);

const Contact = () => {
  const sectionRef = useRef(null);
  const [form, setForm] = useState({
    name: '',
    service: 'Love and marriage harmony',
    message: '',
  });

  const services = [
    'Love and marriage harmony',
    'Career and Business Breakthrough',
    'Life prediction',
    'Legal guidance',
    'Numerology Consultation',
    'Vaastu Consultation',
  ];

  /* ── GSAP scroll animations ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.bk-head > *',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
      gsap.fromTo(
        '.bk-info, .bk-form',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.bk-grid',
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );
      ScrollTrigger.refresh();
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  /* ── form submit → WhatsApp ── */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.message) {
      alert('Please share your name and concern.');
      return;
    }
    const text = encodeURIComponent(
      `Hello Pradeep Ji, I would like to book a consultation.\n\nName: ${form.name}\nService: ${form.service}\n\nMessage: ${form.message}`
    );
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`,
      '_blank'
    );
    setForm({ name: '', service: 'Love and marriage harmony', message: '' });
  };

  /* ── shared styles ── */
  const inputBaseStyle = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    background: '#F5F1EB',
    border: '1px solid rgba(26,6,56,0.08)',
    color: '#1A0638',
    fontSize: '14px',
    fontFamily: 'var(--font-sans)',
    outline: 'none',
    transition: 'all 0.25s ease',
    boxSizing: 'border-box',
  };

  const focusHandler = (e) => {
    e.target.style.borderColor = 'rgba(212,175,55,0.5)';
    e.target.style.background = '#FFFFFF';
    e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.1)';
  };
  const blurHandler = (e) => {
    e.target.style.borderColor = 'rgba(26,6,56,0.08)';
    e.target.style.background = '#F5F1EB';
    e.target.style.boxShadow = 'none';
  };

  /* ── contact info items ── */
  const contactItems = [
    {
      icon: Phone,
      label: 'Call',
      value: '+91 97177 21217',
      href: 'tel:+919717721217',
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'sbv3113@gmail.com',
      href: 'mailto:sbv3113@gmail.com',
    },
    {
      icon: MapPin,
      label: 'Chamber',
      value:
        'BA – 357/1, Block BA, Tagore Garden, Tagore Garden Extension, New Delhi, Delhi, 110027',
      href: null,
    },
  ];

  return (
    <section
      id="contact"
      ref={sectionRef}
      style={{
        width: '100%',
        backgroundColor: '#FAF8F4',
        padding: '96px 24px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── subtle bg accents ── */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          right: '-8%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 70%)',
          filter: 'blur(120px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '-8%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(26,6,56,0.03) 0%, transparent 70%)',
          filter: 'blur(120px)',
          pointerEvents: 'none',
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
        {/* ════════════════════  HEADER  ════════════════════ */}
        <div
          className="bk-head"
          style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 56px' }}
        >
          {/* badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              padding: '6px 18px',
              borderRadius: '999px',
              background: 'rgba(212,175,55,0.08)',
              border: '1px solid rgba(212,175,55,0.25)',
              marginBottom: '20px',
            }}
          >
            <Sparkles
              style={{ width: '14px', height: '14px', color: '#D4AF37' }}
            />
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '3px',
                textTransform: 'uppercase',
                color: '#D4AF37',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Book Consultation
            </span>
          </div>

          {/* heading */}
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '44px',
              fontWeight: 500,
              lineHeight: 1.15,
              color: '#1A0638',
              margin: '0 0 16px 0',
            }}
          >
            Book Your{' '}
            <span
              style={{
                background:
                  'linear-gradient(135deg, #D4AF37 0%, #F0D98A 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Consultation
            </span>
          </h2>

          {/* gold divider */}
          <div
            style={{
              width: '80px',
              height: '2px',
              background:
                'linear-gradient(90deg, transparent, #D4AF37 50%, transparent)',
              margin: '0 auto 18px',
            }}
          />

          {/* subtitle */}
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '14px',
              color: 'rgba(26,6,56,0.5)',
              fontWeight: 400,
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            Share your details and we'll reach out personally to schedule your
            private session.
          </p>
        </div>

        {/* ════════════════════  GRID  ════════════════════ */}
        <div
          className="bk-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 3fr',
            gap: '32px',
            alignItems: 'stretch',
          }}
        >
          {/* ─── LEFT  ·  Connect Directly card ─── */}
          <div
            className="bk-info"
            style={{
              background: 'linear-gradient(155deg, #1A0638 0%, #120428 100%)',
              borderRadius: '24px',
              padding: '40px 34px',
              border: '1px solid rgba(212,175,55,0.15)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            {/* decorative star-field dots */}
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: `${Math.random() * 2 + 1}px`,
                  height: `${Math.random() * 2 + 1}px`,
                  borderRadius: '50%',
                  background: 'rgba(212,175,55,0.25)',
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.5 + 0.15,
                  pointerEvents: 'none',
                }}
              />
            ))}

            {/* soft glow */}
            <div
              style={{
                position: 'absolute',
                bottom: '-60px',
                right: '-60px',
                width: '220px',
                height: '220px',
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 70%)',
                filter: 'blur(50px)',
                pointerEvents: 'none',
              }}
            />

            <div style={{ position: 'relative', zIndex: 2 }}>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '28px',
                  fontWeight: 500,
                  color: '#FAF7F2',
                  margin: '0 0 8px 0',
                  fontStyle: 'italic',
                }}
              >
                Connect Directly
              </h3>

              {/* mini divider */}
              <div
                style={{
                  width: '60px',
                  height: '2px',
                  background:
                    'linear-gradient(90deg, #D4AF37, rgba(212,175,55,0.2))',
                  margin: '16px 0 18px',
                }}
              />

              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  color: 'rgba(250,247,242,0.55)',
                  lineHeight: 1.7,
                  margin: '0 0 36px 0',
                  maxWidth: '300px',
                }}
              >
                Personal guidance is just a message away. Reach out via call,
                email, or visit our consultation chamber.
              </p>

              {/* contact list */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '22px',
                }}
              >
                {contactItems.map((item, idx) => {
                  const Icon = item.icon;
                  const content = item.href ? (
                    <a
                      href={item.href}
                      style={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#FAF7F2',
                        fontFamily: 'var(--font-sans)',
                        textDecoration: 'none',
                        transition: 'color 0.3s',
                        lineHeight: 1.5,
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = '#D4AF37')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = '#FAF7F2')
                      }
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: 500,
                        color: 'rgba(250,247,242,0.8)',
                        fontFamily: 'var(--font-sans)',
                        lineHeight: 1.55,
                      }}
                    >
                      {item.value}
                    </span>
                  );

                  return (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '14px',
                      }}
                    >
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '12px',
                          background: 'rgba(212,175,55,0.1)',
                          border: '1px solid rgba(212,175,55,0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Icon
                          style={{
                            width: '18px',
                            height: '18px',
                            color: '#D4AF37',
                          }}
                        />
                      </div>
                      <div>
                        <span
                          style={{
                            display: 'block',
                            fontSize: '9px',
                            fontWeight: 700,
                            letterSpacing: '2.5px',
                            textTransform: 'uppercase',
                            color: 'rgba(212,175,55,0.55)',
                            fontFamily: 'var(--font-sans)',
                            marginBottom: '4px',
                          }}
                        >
                          {item.label}
                        </span>
                        {content}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ─── RIGHT  ·  Booking Form ─── */}
          <div
            className="bk-form"
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '40px 36px',
              border: '1px solid rgba(26,6,56,0.06)',
              boxShadow: '0 8px 40px rgba(26,6,56,0.06)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <form
              onSubmit={handleSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}
            >
              {/* row: name + service */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <Field label="Your Name" required>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    placeholder="Enter your name"
                    required
                    style={inputBaseStyle}
                    onFocus={focusHandler}
                    onBlur={blurHandler}
                  />
                </Field>

                <Field label="Select Service" required>
                  <select
                    value={form.service}
                    onChange={(e) =>
                      setForm({ ...form, service: e.target.value })
                    }
                    style={{
                      ...inputBaseStyle,
                      cursor: 'pointer',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23D4AF37' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 14px center',
                      paddingRight: '40px',
                    }}
                    onFocus={focusHandler}
                    onBlur={blurHandler}
                  >
                    {services.map((s, i) => (
                      <option key={i} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              {/* message */}
              <Field label="Describe your concern or question...">
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  placeholder="Briefly share what guidance you seek..."
                  style={{
                    ...inputBaseStyle,
                    resize: 'none',
                    minHeight: '130px',
                  }}
                  onFocus={focusHandler}
                  onBlur={blurHandler}
                />
              </Field>

              {/* submit */}
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '16px 28px',
                  borderRadius: '999px',
                  border: 'none',
                  background:
                    'linear-gradient(135deg, #D4AF37 0%, #F0D98A 50%, #D4AF37 100%)',
                  backgroundSize: '200% 100%',
                  color: '#120428',
                  fontSize: '15px',
                  fontWeight: 700,
                  letterSpacing: '1px',
                  fontFamily: 'var(--font-sans)',
                  cursor: 'pointer',
                  transition: 'all 0.4s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 6px 24px rgba(212,175,55,0.3)',
                  marginTop: '6px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundPosition = '100% 0';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 10px 32px rgba(212,175,55,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundPosition = '0 0';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 6px 24px rgba(212,175,55,0.3)';
                }}
              >
                <WhatsAppSvg size={18} color="#120428" />
                Book Now
              </button>

              <p
                style={{
                  textAlign: 'center',
                  fontSize: '11px',
                  color: 'rgba(26,6,56,0.4)',
                  fontFamily: 'var(--font-sans)',
                  margin: '4px 0 0',
                  fontWeight: 400,
                }}
              >
                By submitting, you'll be redirected to WhatsApp to confirm your
                booking.
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* ── responsive breakpoint ── */}
      <style>{`
        @media (max-width: 860px) {
          .bk-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Contact;
