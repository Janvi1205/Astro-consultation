import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/home/Footer';
import ServiceSelection from '../components/booking/ServiceSelection';
import DateTimeSelection from '../components/booking/DateTimeSelection';
import PersonalDetails from '../components/booking/PersonalDetails';
import BookingSummary from '../components/booking/BookingSummary';
import { supabase } from '../lib/supabase';
import useSEO from '../hooks/useSEO';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Booking = () => {
  useSEO({
    title: 'Book a Consultation – Pradeep Malhotra',
    description:
      'Book your personalized astrology consultation with Pradeep Malhotra. Choose a service, pick a time slot, and complete your secure online booking in minutes.',
    canonical: '/booking',
  });

  const navigate = useNavigate();
  
  // Multi-step states (4-step wizard)
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [details, setDetails] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [error, setError] = useState(null);

  // Scroll to top when changing steps
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setError(null);
  }, [currentStep]);

  const steps = [
    { number: 1, label: 'Service' },
    { number: 2, label: 'Date & Time' },
    { number: 3, label: 'Details' },
    { number: 4, label: 'Summary' },
  ];

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBackStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    
    // Format selected date
    let formattedDate = '';
    try {
      const dateObj = new Date(selectedDate.fullString);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      formattedDate = `${year}-${month}-${day}`;
    } catch (err) {
      const todayObj = new Date();
      const year = todayObj.getFullYear();
      const month = String(todayObj.getMonth() + 1).padStart(2, '0');
      const day = String(todayObj.getDate()).padStart(2, '0');
      formattedDate = `${year}-${month}-${day}`;
    }

    try {
      // 1. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError('Failed to load Razorpay script. Please check your internet connection.');
        setIsSubmitting(false);
        return;
      }

      // 2. Call Supabase Edge Function to create Razorpay Order
      const { data: orderData, error: orderErr } = await supabase.functions.invoke('create-order', {
        body: {
          amount: Number(selectedService.price),
          currency: 'INR',
          receipt: 'receipt_' + Math.random().toString(36).substring(2, 11)
        }
      });

      if (orderErr || !orderData || !orderData.order_id) {
        console.error('Edge function order creation failed:', orderErr || 'No order data returned');
        setError('Unable to initiate payment checkout. Please try again or contact support.');
        setIsSubmitting(false);
        return;
      }

      // 3. Initialize Razorpay Checkout
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_defaultKey';
      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.order_id,
        name: 'Pradeep Malhotra',
        description: selectedService.title,
        handler: async function (response) {
          try {
            const slotName = selectedTime.split(' ')[0].toLowerCase();
            
            // Invoke the verify-payment Edge Function
            const { data: verifyData, error: verifyErr } = await supabase.functions.invoke('verify-payment', {
              body: {
                booking_data: {
                  client_name: details.name,
                  client_email: details.email,
                  client_phone: details.phone,
                  service_id: selectedService.service_id,
                  service_package_id: selectedService.id,
                  consultation_date: formattedDate,
                  slot_type: slotName,
                  time_label: selectedTime,
                  birth_date: details.birthDate,
                  birth_time: details.birthTime,
                  birth_place: details.birthPlace,
                  gender: 'Male', // Default placeholder
                  notes: 'Online booking request submitted via main website.',
                  amount: Number(selectedService.price),
                  currency: 'INR'
                },
                payment_data: {
                  razorpay_order_id: response.razorpay_order_id || orderData.order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature || ''
                }
              }
            });

            if (verifyErr || !verifyData || !verifyData.success) {
              console.error('Payment verification failed:', verifyErr || verifyData?.error);
              throw new Error(verifyErr?.message || verifyData?.error || 'Payment verification failed.');
            }

            // Store session data in localStorage to read on Success page
            localStorage.setItem('lastBooking', JSON.stringify({
              service: selectedService,
              date: selectedDate,
              time: selectedTime,
              details: details,
              bookingNumber: verifyData.booking_number
            }));

            setIsSubmitting(false);
            navigate('/booking-success');
          } catch (err) {
            console.error('Error confirming booking payment:', err);
            setError('Your payment was successful, but we encountered an issue verifying the payment transaction. Please contact us with payment ID: ' + response.razorpay_payment_id);
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: details.name,
          email: details.email,
          contact: details.phone
        },
        theme: {
          color: '#1A0638'
        },
        modal: {
          ondismiss: function () {
            setError('Payment checkout cancelled. You can try booking again.');
            setIsSubmitting(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error('Booking creation error:', err);
      setError('Error: ' + err.message);
      setIsSubmitting(false);
    }
  };

  const slideVariants = {
    initial: (dir) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.35,
        ease: 'easeOut',
      },
    },
    exit: (dir) => ({
      x: dir > 0 ? -50 : 50,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: 'easeIn',
      },
    }),
  };

  const progressPercent = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="relative min-h-screen bg-[#FAF7F2] text-slate-800 overflow-x-hidden flex flex-col justify-between">
      {/* Navigation Header - Desktop Only */}
      <div className="hidden md:block">
        <Header />
      </div>

      {/* Top Space Hero Section Header Block */}
      <div className="relative w-full bg-[#1A0638] text-cream pt-6 pb-28 md:pt-32 md:pb-44 px-6 text-center flex flex-col items-center justify-center overflow-hidden z-0">
        
        {/* Mobile menu top bar */}
        <div className="md:hidden absolute top-0 left-0 right-0 h-16 flex items-center px-6 z-25">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-cream hover:text-accent-gold transition-colors p-1 cursor-pointer animate-fade-in"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Lotus Logo & Brand Name for Mobile */}
        <div className="md:hidden flex flex-col items-center mb-6 mt-4 z-10 animate-fade-in">
          <svg viewBox="0 0 100 100" className="w-14 h-14 text-accent-gold mb-2" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            {/* Center Flame / Bud */}
            <path d="M50,30 C46,38 46,46 50,54 C54,46 54,38 50,30 Z" fill="currentColor" className="text-accent-gold" opacity="0.8" />
            <path d="M50,35 C48,40 48,44 50,49 C52,44 52,40 50,35 Z" fill="#1A0638" />

            {/* Inner Petals */}
            <path d="M50,54 C42,46 38,36 41,27 C44,37 48,46 50,54 Z" />
            <path d="M50,54 C58,46 62,36 59,27 C56,37 52,46 50,54 Z" />

            {/* Middle Petals */}
            <path d="M50,54 C34,48 28,38 33,29 C37,39 45,48 50,54 Z" />
            <path d="M50,54 C66,48 72,38 67,29 C63,39 55,48 50,54 Z" />

            {/* Outer Petals */}
            <path d="M50,54 C26,50 20,41 25,32 C30,41 42,49 50,54 Z" />
            <path d="M50,54 C74,50 80,41 75,32 C70,41 58,49 50,54 Z" />

            {/* Side Spreading Petals */}
            <path d="M50,54 C18,52 14,45 18,36 C24,44 38,50 50,54 Z" />
            <path d="M50,54 C82,52 86,45 82,36 C76,44 62,50 50,54 Z" />

            {/* Bottom Base Petals */}
            <path d="M50,54 C40,62 26,62 20,54 C30,56 42,56 50,54 Z" fill="currentColor" opacity="0.2" />
            <path d="M50,54 C60,62 74,62 80,54 C70,56 58,56 50,54 Z" fill="currentColor" opacity="0.2" />
            
            <path d="M50,54 C45,66 32,68 25,60 C34,61 44,59 50,54 Z" />
            <path d="M50,54 C55,66 68,68 75,60 C66,61 56,59 50,54 Z" />
            
            <path d="M50,54 C48,70 38,72 32,64 C40,66 46,62 50,54 Z" />
            <path d="M50,54 C52,70 62,72 68,64 C60,66 54,62 50,54 Z" />
          </svg>
          <span className="font-display text-sm tracking-[0.18em] font-semibold text-accent-gold uppercase leading-tight">
            Pradeep Malhotra
          </span>
        </div>

        {/* Constellations background (Grid overlay) */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

        {/* Subtle background glow */}
        <div className="absolute top-[20%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-radial from-secondary/35 to-transparent blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[20%] left-[-10%] w-[30vw] h-[30vw] rounded-full bg-radial from-accent-gold/10 to-transparent blur-[100px] pointer-events-none" />
        
        {/* Rotating Zodiac Wheel on the right side */}
        <div className="absolute top-[10%] -right-[120px] md:-right-[180px] lg:-right-[240px] z-10 pointer-events-none opacity-20">
          <svg
            viewBox="0 0 200 200"
            className="w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] text-accent-gold animate-spin-slow"
            style={{ animationDuration: '240s' }}
          >
            <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="0.2" />
            <circle cx="100" cy="100" r="78" fill="none" stroke="currentColor" strokeWidth="0.3" strokeDasharray="3 3" />
            <circle cx="100" cy="100" r="62" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="35" fill="none" stroke="currentColor" strokeWidth="0.2" />
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const x1 = 100 + Math.cos(angle) * 35;
              const y1 = 100 + Math.sin(angle) * 35;
              const x2 = 100 + Math.cos(angle) * 96;
              const y2 = 100 + Math.sin(angle) * 96;
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="currentColor"
                  strokeWidth="0.3"
                />
              );
            })}
          </svg>
        </div>

        {/* Central Titles */}
        <div className="relative z-10 max-w-[800px] mx-auto flex flex-col items-center">
          <span className="hidden md:block text-[11px] font-semibold tracking-[0.35em] text-accent-gold uppercase mb-3 animate-pulse">
            Step {currentStep} of 4
          </span>
          <h1 className="text-2xl md:text-5xl font-display font-medium tracking-wide text-white mb-3">
            {currentStep === 1 ? (
              <>
                <span className="hidden md:inline">Select Your Service</span>
                <span className="md:hidden font-semibold">Begin Your Guided Journey</span>
              </>
            ) : currentStep === 2 ? (
              'Choose Date & Time'
            ) : currentStep === 3 ? (
              'Enter Details'
            ) : (
              'Review Summary'
            )}
          </h1>
          <p className="text-xs md:text-sm font-sans font-light text-cream/80 tracking-wide max-w-[520px] leading-relaxed">
            {currentStep === 1 && 'Select the type of consultation you would like to book.'}
            {currentStep === 2 && 'Select a date and time slot for your personalized alignment session.'}
            {currentStep === 3 && 'Provide your birth coordinates for accurate chart calculations.'}
            {currentStep === 4 && 'Confirm your consultation details before finalizing your booking.'}
          </p>
          
          {/* Progress Pills / Multistep Indicator for Mobile */}
          <div className="md:hidden flex items-center justify-center gap-2 mt-5 z-10">
            {Array.from({ length: 4 }).map((_, idx) => {
              const stepNum = idx + 1;
              const isActive = currentStep === stepNum;
              return (
                <div
                  key={stepNum}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    isActive 
                      ? 'w-8 bg-gradient-to-r from-accent-gold to-light-gold shadow-[0_0_8px_rgba(212,175,55,0.6)]' 
                      : 'w-6 bg-white/20'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Wizard Area overlapping the header */}
      <main className="relative z-10 max-w-[1200px] w-full md:w-[92%] mx-auto -mt-16 md:-mt-20 pb-24 flex-grow flex flex-col justify-center animate-fade-in">
        
        {/* Mockup Premium White Layout Wizard Container */}
        <div className="w-full bg-white rounded-t-[2.5rem] rounded-b-none md:rounded-3xl border-0 md:border md:border-slate-200/80 shadow-none md:shadow-2xl flex flex-col min-h-[580px] text-slate-800 relative overflow-hidden">
          
          {/* Wizard Content Section */}
          <div className="w-full p-5 sm:p-8 md:p-12 flex flex-col md:flex-row gap-8 md:gap-12 flex-grow min-h-[480px]">
            
            {/* Left Step Navigation Sidebar - Vertically centered on desktop, hidden on mobile */}
            <div className="hidden md:flex flex-col justify-center w-full md:w-56 flex-shrink-0 border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-6">
              
              {/* Stepper progress layout with connection lines */}
              <div className="relative flex flex-row md:flex-col justify-between md:justify-center gap-4 md:gap-14 w-full py-2 overflow-x-auto scrollbar-none">
                
                {/* Horizontal progress line for mobile */}
                <div className="absolute left-[16px] right-[16px] top-[15px] h-[2px] block md:hidden z-0">
                  <div className="w-full h-full bg-slate-100" />
                  <div 
                    className="absolute top-0 left-0 h-full bg-[#1A0638] transition-all duration-500 ease-in-out" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Vertical progress line for desktop */}
                <div className="absolute left-[15px] top-[16px] bottom-[16px] w-[2px] hidden md:block z-0">
                  <div className="w-full h-full bg-slate-100" />
                  <div 
                    className="absolute top-0 left-0 w-full bg-[#1A0638] transition-all duration-500 ease-in-out" 
                    style={{ height: `${progressPercent}%` }}
                  />
                </div>

                {steps.map((step) => {
                  const isActive = currentStep === step.number;
                  const isCompleted = currentStep > step.number;

                  // Check step accessibility
                  const isAccessible = step.number === 1 || 
                    (step.number === 2 && selectedService) || 
                    (step.number === 3 && selectedService && selectedDate && selectedTime) ||
                    (step.number === 4 && selectedService && selectedDate && selectedTime && details.name && details.email && details.phone && details.birthDate && details.birthTime && details.birthPlace);

                  return (
                    <button
                      key={step.number}
                      disabled={!isAccessible}
                      onClick={() => setCurrentStep(step.number)}
                      className="flex items-center gap-3.5 text-left group cursor-pointer disabled:cursor-not-allowed transition-all duration-300 flex-shrink-0 relative z-10"
                    >
                      {/* Circular Badge - solid bg covers the progress line behind it */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all duration-300 relative z-10 ${
                          isActive
                            ? 'border-[#1A0638] bg-[#1A0638] text-white shadow-md'
                            : isCompleted
                            ? 'border-indigo-650 bg-indigo-50 text-indigo-750'
                            : 'border-slate-200 bg-white text-slate-400 group-hover:border-slate-350'
                        }`}
                      >
                        {step.number}
                      </div>
                      
                      {/* Label */}
                      <div className="flex flex-col relative z-10">
                        <span
                          className={`text-xs uppercase tracking-wider font-semibold transition-colors duration-300 ${
                            isActive
                              ? 'text-[#1A0638] font-bold'
                              : isCompleted
                              ? 'text-indigo-900/80 font-medium'
                              : 'text-slate-400 group-hover:text-slate-500'
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Content Panel */}
            <div className="flex-grow flex flex-col justify-between min-h-[440px] pl-0 md:pl-4 gap-4">
              {error && (
                <div className="flex gap-3 bg-rose-50 border border-rose-200/80 p-4.5 rounded-2xl items-start text-xs text-rose-800 shadow-2xs relative animate-fade-in mb-2">
                  <div className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="font-bold text-rose-700 text-xs">!</span>
                  </div>
                  <div className="flex-1 pr-6">
                    <p className="font-semibold mb-0.5">Booking Action Failed</p>
                    <p className="leading-relaxed font-light">{error}</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setError(null)}
                    className="text-rose-400 hover:text-rose-700 cursor-pointer absolute right-3 top-3 text-lg p-1 leading-none font-bold"
                  >
                    &times;
                  </button>
                </div>
              )}
              <AnimatePresence mode="wait" initial={false}>
                {currentStep === 1 && (
                  <motion.div
                    key="step-1"
                    custom={currentStep}
                    variants={slideVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="w-full flex-grow flex flex-col justify-between"
                  >
                    <ServiceSelection
                      selectedService={selectedService}
                      setSelectedService={setSelectedService}
                      onNext={handleNextStep}
                    />
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step-2"
                    custom={currentStep}
                    variants={slideVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="w-full flex-grow flex flex-col justify-between"
                  >
                    <DateTimeSelection
                      selectedDate={selectedDate}
                      setSelectedDate={setSelectedDate}
                      selectedTime={selectedTime}
                      setSelectedTime={setSelectedTime}
                      onNext={handleNextStep}
                      onBack={handleBackStep}
                    />
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step-3"
                    custom={currentStep}
                    variants={slideVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="w-full flex-grow flex flex-col justify-between"
                  >
                    <PersonalDetails
                      details={details}
                      setDetails={setDetails}
                      onNext={handleNextStep}
                      onBack={handleBackStep}
                    />
                  </motion.div>
                )}

                {currentStep === 4 && (
                  <motion.div
                    key="step-4"
                    custom={currentStep}
                    variants={slideVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="w-full flex-grow flex flex-col justify-between"
                  >
                    <BookingSummary
                      selectedService={selectedService}
                      selectedDate={selectedDate}
                      selectedTime={selectedTime}
                      details={details}
                      onConfirm={handleConfirmBooking}
                      onBack={handleBackStep}
                      isSubmitting={isSubmitting}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>
      </main>

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
            className="fixed top-16 left-1/2 -translate-x-1/2 w-[92%] max-w-[400px] z-50 rounded-2xl border border-accent-gold/20 bg-[#1A0638]/95 backdrop-blur-xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.55),_0_0_30px_rgba(212,175,55,0.12)] flex flex-col gap-6 md:hidden text-white"
          >
            <div className="flex flex-col gap-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'About', path: '/#about' },
                { name: 'Services', path: '/#services' },
                { name: 'Testimonials', path: '/#testimonials' },
                { name: 'Contact', path: '/#contact' },
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm tracking-[0.2em] uppercase font-semibold py-3 px-4 rounded-xl hover:text-light-gold hover:bg-white/5 transition-all duration-300"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Footer Navigation */}
      <Footer />
    </div>
  );
};

export default Booking;
