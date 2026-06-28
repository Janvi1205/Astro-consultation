import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Mail, Lock, Compass, Eye, EyeOff } from 'lucide-react';
import useSEO from '../../hooks/useSEO';

const Login = () => {
  useSEO({
    title: 'Admin Login – Pradeep Malhotra',
    description: 'Secure administrator login for Pradeep Malhotra consultation management.',
    canonical: '/admin/login',
    noIndex: true,
  });

  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/admin/dashboard');
      } else {
        setError(res.error || 'Invalid email or password.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#120428] px-4 overflow-hidden text-[#FCFAF6]">
      
      {/* Background Star System */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none z-0" />
      <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-radial from-[#1A0638]/40 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-radial from-[#D4AF37]/10 to-transparent blur-[100px] pointer-events-none" />

      {/* Floating zodiac backdrop circle */}
      <div className="absolute pointer-events-none opacity-10 z-0 animate-spin-slow">
        <svg viewBox="0 0 200 200" className="w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] text-[#D4AF37]">
          <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" strokeWidth="0.4" />
          <circle cx="100" cy="100" r="75" fill="none" stroke="currentColor" strokeWidth="0.3" strokeDasharray="2 2" />
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            return (
              <line
                key={i}
                x1={100}
                y1={100}
                x2={100 + Math.cos(angle) * 95}
                y2={100 + Math.sin(angle) * 95}
                stroke="currentColor"
                strokeWidth="0.2"
              />
            );
          })}
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-[440px] z-10"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          {/* Logo Lotus */}
          <div className="w-16 h-16 rounded-full bg-[#1A0638] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shadow-lg mb-3">
            <Compass className="w-8 h-8 animate-[spin_20s_linear_infinite]" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-[0.18em] text-[#FCFAF6] uppercase text-center leading-none">
            PRADEEP MALHOTRA
          </h1>
          <span className="font-sans text-[10px] tracking-[0.45em] text-[#D4AF37] uppercase mt-2">
            ADMINISTRATOR PORTAL
          </span>
        </div>

        {/* Login Card */}
        <div className="bg-gradient-to-br from-[#1A0638]/80 via-[#1A0638]/90 to-[#1A0638]/60 border border-purple-300/20 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl text-left">
          
          <div className="mb-6">
            <h2 className="font-display text-xl font-bold text-[#FCFAF6]">Welcome Back, Pradeep Ji</h2>
            <p className="font-sans text-xs text-[#FCFAF6]/60 mt-1">Please authorize your credentials to manage appointments.</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-red-500/10 border border-red-500/35 p-3.5 rounded-xl text-red-300 text-xs mb-5 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold tracking-widest text-[#FCFAF6]/70">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#FCFAF6]/40">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#120428]/50 border border-purple-300/10 hover:border-purple-300/30 focus:border-[#D4AF37]/50 focus:outline-none rounded-xl py-3 pl-10 pr-4 text-[#FCFAF6] placeholder-[#FCFAF6]/30 text-sm transition-all duration-300"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold tracking-widest text-[#FCFAF6]/70">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#FCFAF6]/40">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#120428]/50 border border-purple-300/10 hover:border-purple-300/30 focus:border-[#D4AF37]/50 focus:outline-none rounded-xl py-3 pl-10 pr-10 text-[#FCFAF6] placeholder-[#FCFAF6]/30 text-sm transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#FCFAF6]/40 hover:text-[#FCFAF6]/80 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F4D06F] text-[#120428] font-bold text-xs uppercase tracking-widest shadow-md hover:scale-[1.01] hover:shadow-lg disabled:opacity-50 disabled:scale-100 transition-all duration-300 cursor-pointer text-center select-none"
            >
              {isSubmitting ? 'Verifying...' : 'Sign In Now'}
            </button>
          </form>


        </div>
      </motion.div>
    </div>
  );
};

export default Login;
