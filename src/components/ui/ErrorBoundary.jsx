import React from 'react';

/**
 * ErrorBoundary – catches unhandled render errors in the component tree.
 * Shows a branded recovery screen instead of a blank white page.
 * Must be a class component (React requirement for error boundaries).
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Keep console.error for meaningful runtime error tracking
    console.error('[ErrorBoundary] Uncaught render error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="fixed inset-0 flex flex-col items-center justify-center px-6 text-center"
          style={{ backgroundColor: '#120428', color: '#FAF7F2' }}
        >
          {/* Gold star icon */}
          <div
            className="text-5xl mb-6 select-none"
            style={{ filter: 'drop-shadow(0 0 18px rgba(212,175,55,0.6))' }}
          >
            ✦
          </div>

          <h1
            className="text-2xl md:text-3xl font-display font-medium mb-3"
            style={{ color: '#D4AF37' }}
          >
            Something went wrong
          </h1>

          <p
            className="text-sm md:text-base font-sans max-w-sm mb-8 leading-relaxed"
            style={{ color: 'rgba(250,247,242,0.65)' }}
          >
            An unexpected error occurred. Please reload the page to continue your journey.
          </p>

          <button
            onClick={this.handleReload}
            className="px-7 py-3 rounded-full text-xs font-semibold tracking-widest uppercase cursor-pointer transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #D4AF37, #F4D06F)',
              color: '#120428',
              boxShadow: '0 0 25px rgba(212,175,55,0.3)',
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
