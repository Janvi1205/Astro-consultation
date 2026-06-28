import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  CalendarDays, 
  UserCheck, 
  Compass, 
  LogOut, 
  Bell, 
  Menu, 
  X, 
  Sparkles, 
  Settings,
  HelpCircle,
  FolderHeart
} from 'lucide-react';

const AdminLayout = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const navigation = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Bookings', path: '/admin/bookings', icon: UserCheck },
    { name: 'Calendar & Slots', path: '/admin/slots', icon: CalendarDays },
  ];

  // Helper to format today's date elegantly
  const formatToday = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  // Helper to dynamically calculate time-based greeting
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good Morning';
    if (hours < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const mockNotifications = [
    { id: 1, text: 'New booking from Priya Patel for Tomorrow at 12:00 PM', time: '5m ago', read: false },
    { id: 2, text: 'Amit Verma completed payment for Career Consultation', time: '1h ago', read: false },
    { id: 3, text: 'Slot configuration updated for 28th June', time: '4h ago', read: true },
  ];

  return (
    <div className="min-h-screen bg-[#2B124C] text-[#FCFAF6] flex font-sans relative overflow-x-hidden">
      
      {/* ── Left Sidebar (Desktop fixed) ── */}
      <aside className="hidden lg:flex flex-col w-[260px] bg-[#1A0638] text-[#FCFAF6] h-screen fixed top-0 left-0 z-30 shadow-md border-r border-[#D4AF37]/15">
        
        {/* Sidebar Header Brand */}
        <div className="p-6 border-b border-[#FCFAF6]/10 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-[#2B124C] border border-[#D4AF37]/45 flex items-center justify-center text-[#D4AF37] shadow-md mb-2 animate-[pulse_4s_infinite]">
            <Compass className="w-6 h-6" />
          </div>
          <span className="font-display text-sm tracking-[0.2em] font-semibold text-[#FCFAF6] uppercase leading-none">
            Pradeep Malhotra
          </span>
          <span className="font-sans text-[8px] tracking-[0.4em] text-[#D4AF37] uppercase mt-1.5 font-semibold">
            Astrologer Dashboard
          </span>
        </div>

        {/* Sidebar Navigation Links */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link key={item.name} to={item.path} className="relative group">
                <div className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  isActive 
                    ? 'text-[#D4AF37] bg-[#D4AF37]/10 shadow-xs border-l-2 border-[#D4AF37]' 
                    : 'text-[#FCFAF6]/70 hover:text-[#FCFAF6] hover:bg-white/5'
                }`}>
                  <Icon className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${
                    isActive ? 'text-[#D4AF37]' : 'text-[#FCFAF6]/50 group-hover:text-[#FCFAF6]/80'
                  }`} />
                  <span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer Logout */}
        <div className="p-4 border-t border-[#FCFAF6]/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider text-[#FCFAF6]/60 hover:text-red-400 hover:bg-white/5 transition-all duration-300 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Portal</span>
          </button>
        </div>
      </aside>

      {/* ── Left Sidebar Mobile Drawer ── */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black z-40"
            />
            {/* Drawer sheet */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 left-0 w-[270px] bg-[#1A0638] text-[#FCFAF6] z-50 flex flex-col shadow-2xl border-r border-[#D4AF37]/15"
            >
              <div className="p-5 border-b border-[#FCFAF6]/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#2B124C] border border-[#D4AF37]/45 flex items-center justify-center text-[#D4AF37]">
                    <Compass className="w-4.5 h-4.5" />
                  </div>
                  <span className="font-display text-xs tracking-wider font-bold text-[#FCFAF6] uppercase">
                    Pradeep Ji Admin
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-1 rounded-lg text-[#FCFAF6]/60 hover:text-[#FCFAF6]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsMobileOpen(false)}
                      className="block"
                    >
                      <div className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider ${
                        isActive 
                          ? 'text-[#D4AF37] bg-[#D4AF37]/10 border-l-2 border-[#D4AF37]' 
                          : 'text-[#FCFAF6]/70 hover:text-[#FCFAF6] hover:bg-white/5'
                      }`}>
                        <Icon className="w-4.5 h-4.5" />
                        <span>{item.name}</span>
                      </div>
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-[#FCFAF6]/10">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider text-[#FCFAF6]/60 hover:text-red-400"
                >
                  <LogOut className="w-4.5 h-4.5" />
                  <span>Sign Out Portal</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Scrollable Content Area ── */}
      <div className="flex-1 flex flex-col lg:pl-[260px] min-h-screen min-w-0 w-full overflow-x-hidden">
        
        {/* Mobile Header Top Bar */}
        <header className="lg:hidden bg-[#1A0638]/85 text-[#FCFAF6] border-b border-purple-500/25 px-4 py-4 flex items-center justify-between sticky top-0 z-35 shadow-lg backdrop-blur-md">
          {/* Left: Hamburger menu toggle */}
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-1 rounded-xl text-[#FCFAF6] hover:text-[#D4AF37] transition-colors cursor-pointer"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Center: Lotus Brand Logo on Dashboard OR Page Title on others */}
          {location.pathname === '/admin/dashboard' ? (
            <div className="flex flex-col items-center">
              <svg className="w-8 h-8 text-[#D4AF37] fill-current" viewBox="0 0 100 100">
                <path d="M50,15 C55,35 55,60 50,80 C45,60 45,35 50,15 Z" />
                <path d="M50,30 C30,45 35,70 50,80 C35,65 42,45 50,30 Z" />
                <path d="M50,30 C70,45 65,70 50,80 C65,65 58,45 50,30 Z" />
                <path d="M50,45 C15,55 20,80 50,80 C23,73 28,60 50,45 Z" />
                <path d="M50,45 C85,55 80,80 50,80 C77,73 72,60 50,45 Z" />
                <path d="M35,83 C45,86 55,86 65,83 C55,80 45,80 35,83 Z" />
              </svg>
              <span className="font-display text-[8px] tracking-[0.25em] font-bold text-[#D4AF37] uppercase mt-1 leading-none">
                PRADEEP MALHOTRA
              </span>
            </div>
          ) : (
            <h1 className="font-display text-xs uppercase tracking-widest font-bold text-[#FCFAF6]">
              {location.pathname === '/admin/bookings' ? 'Bookings' : 
               location.pathname === '/admin/slots' ? 'Calendar & Slots' : 'Admin Portal'}
            </h1>
          )}

          {/* Right: Empty placeholder to balance centering */}
          <div className="w-8" />
        </header>

        {/* Desktop Header container */}
        <header className="hidden lg:block relative bg-gradient-to-r from-[#1A0638]/80 via-[#2B124C]/60 to-[#1A0638]/85 text-[#FCFAF6] px-6 py-8 border-b border-purple-500/25 backdrop-blur-lg overflow-hidden shadow-lg shadow-[#120428]/20">
          
          {/* Decorative Purple Glassmorphism Glow circles */}
          <div className="absolute top-[-50%] left-[20%] w-[40vw] h-[150px] rounded-full bg-purple-600/15 blur-[60px] pointer-events-none" />
          
          {/* Subtle Rotating Astrology Artwork Backdrop */}
          <div className="absolute right-[-60px] top-[-60px] pointer-events-none opacity-20 z-0">
            <svg viewBox="0 0 200 200" className="w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] text-[#D4AF37] animate-spin-slow">
              <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" strokeWidth="0.4" />
              <circle cx="100" cy="100" r="82" fill="none" stroke="currentColor" strokeWidth="0.2" strokeDasharray="3 3" />
              <circle cx="100" cy="100" r="65" fill="none" stroke="currentColor" strokeWidth="0.3" />
              <polygon points="100,50 135,115 65,115" fill="none" stroke="currentColor" strokeWidth="0.25" />
              <polygon points="100,150 135,85 65,85" fill="none" stroke="currentColor" strokeWidth="0.25" />
            </svg>
          </div>

          <div className="relative z-10 flex items-center justify-between">
            {/* Header Left Title */}
            <div className="flex items-center gap-4 text-left">
              {/* Mobile hamburger menu toggle */}
              <button
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden p-1.5 rounded-xl border border-[#FCFAF6]/20 text-[#FCFAF6] hover:bg-white/5 cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex flex-col gap-0.5">
                <span className="font-sans text-[10px] sm:text-xs text-[#D4AF37] uppercase tracking-[0.25em] font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  {formatToday()}
                </span>
                <h1 className="font-display text-xl sm:text-2xl font-semibold text-[#FCFAF6]">
                  {getGreeting()}, Pradeep Ji 👋
                </h1>
                <span className="font-sans text-[10px] sm:text-xs text-[#FCFAF6]/65 leading-tight">
                  Welcome to today's overview. Here is a summary of your schedules.
                </span>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-3 sm:gap-4 relative">
              {/* Profile Avatar Widget */}
              <div className="flex items-center gap-2 border-l border-[#FCFAF6]/10 pl-3 sm:pl-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-[#D4AF37]/30 flex items-center justify-center bg-[#2B124C] text-[#D4AF37] font-bold text-xs shadow-md">
                  PM
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="font-display text-xs font-semibold text-[#FCFAF6]">Pradeep Ji</span>
                  <span className="font-sans text-[9px] text-[#FCFAF6]/50 leading-none">Senior Astrologer</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ── Main Dashboard Content Body ── */}
        <main className="flex-1 p-6 md:p-8 bg-[#2B124C] z-10 pb-24 lg:pb-8 min-w-0 w-full overflow-x-hidden">
          {/* Mobile Greeting for Dashboard only */}
          {location.pathname === '/admin/dashboard' && (
            <div className="lg:hidden flex flex-col gap-1.5 text-left mb-6 text-[#FCFAF6]">
              <span className="font-sans text-xs text-[#FCFAF6]/60 leading-none">
                {getGreeting()},
              </span>
              <h1 className="font-display text-2xl font-bold text-[#FCFAF6] flex items-center gap-1.5 leading-tight">
                Pradeep Ji <span className="animate-wave origin-[70% 70%] inline-block">👋</span>
              </h1>
              <span className="font-sans text-[11px] text-[#FCFAF6]/70 leading-normal">
                Here's your overview for today.
              </span>
            </div>
          )}
          {children}
        </main>

        {/* Bottom Mobile Navigation Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#1A0638] border-t border-[#D4AF37]/15 z-40 py-2.5 px-6 flex items-center justify-around shadow-lg">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className="flex flex-col items-center gap-1 cursor-pointer transition-colors"
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#D4AF37]' : 'text-[#FCFAF6]/45'}`} />
                <span className={`text-[10px] font-semibold tracking-wider ${isActive ? 'text-[#D4AF37]' : 'text-[#FCFAF6]/45'}`}>
                  {item.name === 'Calendar & Slots' ? 'Calendar' : item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
