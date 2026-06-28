import React from 'react';

/**
 * PageLoader – branded full-screen loading state.
 * Used as the Suspense fallback for lazy-loaded routes,
 * and as the ProtectedRoute auth-check loading state.
 */
const PageLoader = () => {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-50"
      style={{ backgroundColor: '#120428' }}
      aria-label="Loading page"
      role="status"
    >
      {/* Gold constellation spinner */}
      <div className="relative w-16 h-16 mb-6">
        {/* Outer rotating ring */}
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent"
          style={{
            borderTopColor: '#D4AF37',
            borderRightColor: 'rgba(212,175,55,0.3)',
            animation: 'spin 1.2s linear infinite',
          }}
        />
        {/* Inner pulsing dot */}
        <div
          className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full -translate-x-1/2 -translate-y-1/2"
          style={{
            backgroundColor: '#D4AF37',
            boxShadow: '0 0 18px rgba(212,175,55,0.8)',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
        {/* Decorative orbit dots */}
        <div
          className="absolute inset-0 rounded-full"
          style={{ animation: 'spin 2.4s linear infinite reverse' }}
        >
          <div
            className="absolute top-0 left-1/2 w-1.5 h-1.5 rounded-full -translate-x-1/2 -translate-y-0.5"
            style={{ backgroundColor: 'rgba(244,208,111,0.7)' }}
          />
        </div>
      </div>

      {/* Brand name */}
      <p
        className="text-xs tracking-[0.4em] uppercase font-sans"
        style={{ color: 'rgba(244,208,111,0.7)' }}
      >
        Pradeep Malhotra
      </p>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: translate(-50%,-50%) scale(0.85); }
          50% { opacity: 1; transform: translate(-50%,-50%) scale(1.15); }
        }
      `}</style>
    </div>
  );
};

export default PageLoader;
