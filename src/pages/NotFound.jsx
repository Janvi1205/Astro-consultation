import React from 'react';
import { Link } from 'react-router-dom';

/**
 * NotFound – branded 404 page.
 * Rendered for any unmatched route via AppRoutes wildcard.
 */
const NotFound = () => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ backgroundColor: '#120428', color: '#FAF7F2' }}
    >
      {/* Decorative glowing number */}
      <div className="relative mb-6 select-none">
        <span
          className="text-[120px] md:text-[160px] font-display font-medium leading-none"
          style={{
            color: 'transparent',
            WebkitTextStroke: '1px rgba(212,175,55,0.35)',
            textShadow: '0 0 60px rgba(212,175,55,0.12)',
          }}
        >
          404
        </span>
        {/* Gold glow overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.08) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-6 w-full max-w-xs">
        <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.4))' }} />
        <span style={{ color: '#D4AF37', fontSize: '8px', transform: 'rotate(45deg)', display: 'block', width: '6px', height: '6px', backgroundColor: '#D4AF37' }} />
        <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, rgba(212,175,55,0.4), transparent)' }} />
      </div>

      <h1
        className="text-2xl md:text-3xl font-display font-medium mb-3"
        style={{ color: '#F4D06F' }}
      >
        Page Not Found
      </h1>

      <p
        className="text-sm md:text-base font-sans max-w-sm mb-10 leading-relaxed"
        style={{ color: 'rgba(250,247,242,0.6)' }}
      >
        The page you're looking for doesn't exist or may have moved. Let the stars guide you back home.
      </p>

      <Link to="/">
        <button
          className="px-8 py-3.5 rounded-full text-xs font-semibold tracking-widest uppercase cursor-pointer transition-all duration-300 hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #D4AF37, #F4D06F)',
            color: '#120428',
            boxShadow: '0 0 30px rgba(212,175,55,0.25)',
          }}
        >
          Return Home
        </button>
      </Link>

      {/* Floating zodiac glyphs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20 select-none">
        {['♈', '♊', '♌', '♎', '♐', '♒'].map((g, i) => (
          <span
            key={i}
            className="absolute text-2xl"
            style={{
              color: '#D4AF37',
              top: `${15 + i * 14}%`,
              left: i % 2 === 0 ? `${5 + i * 3}%` : `${80 - i * 3}%`,
              animation: `float ${6 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          >
            {g}
          </span>
        ))}
      </div>
    </div>
  );
};

export default NotFound;
