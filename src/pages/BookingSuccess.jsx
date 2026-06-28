import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Clock, MapPin, Check, ArrowLeft } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/home/Footer';
import useSEO from '../hooks/useSEO';

const BookingSuccess = () => {
  useSEO({
    title: 'Booking Confirmed – Pradeep Malhotra',
    description: 'Your consultation with Pradeep Malhotra has been successfully booked.',
    canonical: '/booking-success',
    noIndex: true,
  });

  const [booking, setBooking] = useState(null);

  useEffect(() => {
    // Retrieve booking details from localStorage
    const savedBooking = localStorage.getItem('lastBooking');
    if (savedBooking) {
      try {
        setBooking(JSON.parse(savedBooking));
      } catch (err) {
        console.error('Error parsing booking history', err);
      }
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-cosmic-dark text-cream overflow-x-hidden flex flex-col justify-between">
      {/* Navigation Header */}
      <Header />

      {/* Background gradients and particles */}
      <div className="absolute inset-0 bg-primary bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute top-[30%] left-[20%] w-[400px] h-[400px] rounded-full bg-radial from-secondary/30 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[350px] h-[350px] rounded-full bg-radial from-accent-gold/5 to-transparent blur-[90px] pointer-events-none" />

      {/* Main Success Area */}
      <main className="relative z-10 max-w-[650px] w-full mx-auto px-6 pt-32 pb-24 flex-grow flex flex-col items-center justify-center text-center">
        {/* Animated Sacred Geometry Backdrop */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 90, ease: 'linear' }}
          className="absolute w-[280px] h-[280px] opacity-[0.06] text-accent-gold pointer-events-none -translate-y-24"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <polygon points="50,95 95,75 95,25 50,5 5,25 5,75" fill="none" stroke="currentColor" strokeWidth="0.5" transform="rotate(30, 50, 50)" />
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.3" />
          </svg>
        </motion.div>

        {/* 1. Animated Success Check Circle */}
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 12, delay: 0.1 }}
          className="relative z-10 w-20 h-20 rounded-full bg-accent-gold/15 text-light-gold flex items-center justify-center mb-8 border border-accent-gold/45 shadow-gold-glow"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <Check className="w-9 h-9 stroke-[2.5]" />
          </motion.div>
        </motion.div>

        {/* 2. Success Text */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-display font-medium tracking-wide text-cream mb-3">
            Consultation Confirmed!
          </h1>
          <p className="text-sm font-sans font-light text-cream/70 max-w-[460px] mx-auto leading-relaxed">
            Your appointment has been registered. An invitation card with video consultation credentials and calendar sync details has been dispatched to your email address.
          </p>
        </motion.div>

        {/* 3. Detailed Receipt Card */}
        {booking && (
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-full glass-panel p-6 md:p-8 rounded-luxury text-left shadow-luxury mb-10 border border-accent-gold/20"
          >
            {/* Header info */}
            <div className="flex justify-between items-center border-b border-cream/5 pb-4 mb-5">
              <span className="text-xs font-semibold tracking-wider text-light-gold uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Pradeep Malhotra Receipt
              </span>
              <span className="text-[10px] text-cream/45 tracking-widest uppercase">
                ID: {Math.floor(100000 + Math.random() * 900000)}
              </span>
            </div>

            {/* Content summary */}
            <div className="flex flex-col gap-4">
              {/* Service */}
              <div className="flex justify-between items-start">
                <span className="text-sm text-cream font-medium">
                  {booking.service?.title}
                </span>
                <span className="text-sm font-semibold text-accent-gold">
                  {booking.service?.currencySymbol || '$'}{booking.service?.price}
                </span>
              </div>

              {/* Timing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-secondary/15 py-3 px-4 rounded-luxury border border-cream/5 mt-1 text-xs">
                <div className="flex items-center gap-2 text-cream/80">
                  <Calendar className="w-4 h-4 text-accent-gold" />
                  <span>{booking.date?.fullString}</span>
                </div>
                <div className="flex items-center gap-2 text-cream/80">
                  <Clock className="w-4 h-4 text-accent-gold" />
                  <span>{booking.time} ({booking.service?.duration})</span>
                </div>
              </div>

              {/* Coordinates */}
              <div className="flex flex-col gap-2 mt-2 pt-3 border-t border-cream/5">
                <span className="text-[10px] font-semibold text-cream/45 uppercase tracking-wider">
                  Calculated Birth Coordinates
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-cream/70">
                  <div>Name: <span className="text-cream font-medium">{booking.details?.name}</span></div>
                  <div>Place: <span className="text-cream font-medium">{booking.details?.birthPlace}</span></div>
                  <div>Date: <span className="text-cream font-medium">{booking.details?.birthDate}</span></div>
                  <div>Time: <span className="text-cream font-medium">{booking.details?.birthTime}</span></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 4. Action CTA Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 w-full justify-center"
        >
          <Link to="/" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 py-3.5 px-8 rounded-luxury border border-cream/10 hover:border-cream/35 text-cream/80 hover:text-cream text-xs tracking-widest uppercase font-semibold transition-all duration-300 cursor-pointer bg-secondary/10">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return Home</span>
            </button>
          </Link>
          <a
            href={`https://wa.me/919717721217?text=${encodeURIComponent("Hello Pradeep Ji, I have booked a consultation.")}`}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto"
          >
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 py-3.5 px-8 rounded-luxury bg-linear-to-r from-accent-gold via-light-gold to-accent-gold text-primary font-bold text-xs tracking-widest uppercase shadow-gold-glow transition-all duration-300 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-4 h-4 fill-current"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>WhatsApp Astrologer</span>
            </button>
          </a>
        </motion.div>
      </main>

      {/* Footer Navigation */}
      <Footer />
    </div>
  );
};

export default BookingSuccess;
