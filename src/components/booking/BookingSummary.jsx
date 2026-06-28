import React from 'react';
import { Calendar, Clock, MapPin, User, Mail, Compass, ShieldCheck, ChevronLeft, ArrowRight } from 'lucide-react';

const BookingSummary = ({ selectedService, selectedDate, selectedTime, details, onConfirm, onBack, isSubmitting }) => {
  return (
    <div className="flex flex-col gap-6 text-left animate-fade-in">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Summary Cards */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Selected Consultation Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-100/40 via-[#1A0638]/5 to-purple-100/20 border border-purple-300/80 shadow-xs flex flex-col gap-4 relative overflow-hidden backdrop-blur-xs">
            {/* Subtle background glow circle */}
            <div className="absolute right-[-10%] top-[-10%] w-24 h-24 rounded-full bg-purple-100/20 blur-xl pointer-events-none" />
            
            <h3 className="text-xs font-bold tracking-wider text-[#1A0638] uppercase flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white border border-purple-100/50 flex items-center justify-center text-[#1A0638] shadow-2xs">
                <Compass className="w-4 h-4" />
              </div>
              Selected Consultation
            </h3>

            <div className="flex flex-col gap-3">
              <h4 className="text-lg font-display font-bold text-[#1A0638] flex items-center gap-1.5">
                {selectedService?.title}
              </h4>
              <p className="text-xs font-light text-[#1A0638]/70 leading-relaxed max-w-[500px]">
                {selectedService?.description}
              </p>

              {/* Price & Duration badges */}
              <div className="flex flex-wrap items-center gap-2.5 mt-2">
                <div className="py-1.5 px-4 rounded-full text-xs font-semibold text-white bg-[#1A0638] border border-[#1A0638] flex items-center shadow-xs">
                  Fees: {selectedService?.currencySymbol || '$'}{selectedService?.price.toLocaleString()}
                </div>
                <div className="py-1.5 px-4 rounded-full text-xs font-medium text-slate-600 bg-white border border-purple-100/50 flex items-center gap-1.5 shadow-2xs">
                  <Clock className="w-3.5 h-3.5 text-[#1A0638]/60" />
                  <span>{selectedService?.duration}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scheduled Slot Card */}
          <div className="p-6 rounded-3xl bg-[#1A0638] border border-[#1A0638] shadow-md flex flex-col gap-4 relative overflow-hidden text-white">
            <div className="absolute right-[-10%] top-[-10%] w-24 h-24 rounded-full bg-white/5 blur-xl pointer-events-none" />
            
            <h3 className="text-xs font-bold tracking-wider text-accent-gold uppercase flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-accent-gold shadow-2xs">
                <Calendar className="w-4 h-4 text-accent-gold" />
              </div>
              Scheduled Slot
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/10 border border-white/10 flex items-center gap-3.5 shadow-2xs hover:shadow-xs transition-all duration-300 backdrop-blur-xs text-white">
                <div className="w-9 h-9 rounded-full bg-white text-[#1A0638] flex items-center justify-center flex-shrink-0 shadow-2xs">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/60 uppercase tracking-wider font-semibold">Date</span>
                  <span className="text-sm text-white font-bold mt-0.5">
                    {selectedDate?.fullString}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 border border-white/10 flex items-center gap-3.5 shadow-2xs hover:shadow-xs transition-all duration-300 backdrop-blur-xs text-white">
                <div className="w-9 h-9 rounded-full bg-white text-[#1A0638] flex items-center justify-center flex-shrink-0 shadow-2xs">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/60 uppercase tracking-wider font-semibold">Time Interval</span>
                  <span className="text-sm text-white font-bold mt-0.5">
                    {selectedTime}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Personal Coordinates Summary */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-gradient-to-br from-purple-100/40 via-[#1A0638]/5 to-purple-100/20 border border-purple-300/80 shadow-xs flex flex-col gap-5 relative overflow-hidden backdrop-blur-xs">
          <div className="absolute right-[-10%] top-[-10%] w-24 h-24 rounded-full bg-purple-100/20 blur-xl pointer-events-none" />
          
          <h3 className="text-xs font-bold tracking-wider text-[#1A0638] uppercase flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white border border-purple-100/50 flex items-center justify-center text-[#1A0638] shadow-2xs">
              <User className="w-4 h-4" />
            </div>
            Birth Coordinates
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-100/35 via-[#1A0638]/5 to-purple-100/15 border border-purple-200/85 flex items-start gap-3 shadow-2xs hover:shadow-xs transition-all duration-300 backdrop-blur-xs">
              <div className="w-8 h-8 rounded-full bg-white border border-purple-100/50 text-[#1A0638] flex items-center justify-center flex-shrink-0 shadow-2xs mt-0.5">
                <User className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <span className="block text-[9px] text-[#1A0638]/60 uppercase tracking-wider font-semibold">Client Name</span>
                <span className="text-[#1A0638] font-bold text-xs mt-0.5 block truncate">{details.name}</span>
              </div>
            </div>

            {/* Birth Date */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-100/35 via-[#1A0638]/5 to-purple-100/15 border border-purple-200/85 flex items-start gap-3 shadow-2xs hover:shadow-xs transition-all duration-300 backdrop-blur-xs">
              <div className="w-8 h-8 rounded-full bg-white border border-purple-100/50 text-[#1A0638] flex items-center justify-center flex-shrink-0 shadow-2xs mt-0.5">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <span className="block text-[9px] text-[#1A0638]/60 uppercase tracking-wider font-semibold">Birth Date</span>
                <span className="text-[#1A0638] font-bold text-xs mt-0.5 block truncate">{details.birthDate}</span>
              </div>
            </div>

            {/* Birth Time */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-100/35 via-[#1A0638]/5 to-purple-100/15 border border-purple-200/85 flex items-start gap-3 shadow-2xs hover:shadow-xs transition-all duration-300 backdrop-blur-xs">
              <div className="w-8 h-8 rounded-full bg-white border border-purple-100/50 text-[#1A0638] flex items-center justify-center flex-shrink-0 shadow-2xs mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <span className="block text-[9px] text-[#1A0638]/60 uppercase tracking-wider font-semibold">Birth Time</span>
                <span className="text-[#1A0638] font-bold text-xs mt-0.5 block truncate">{details.birthTime}</span>
              </div>
            </div>

            {/* Birth Place */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-100/35 via-[#1A0638]/5 to-purple-100/15 border border-purple-200/85 flex items-start gap-3 shadow-2xs hover:shadow-xs transition-all duration-300 backdrop-blur-xs">
              <div className="w-8 h-8 rounded-full bg-white border border-purple-100/50 text-[#1A0638] flex items-center justify-center flex-shrink-0 shadow-2xs mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <span className="block text-[9px] text-[#1A0638]/60 uppercase tracking-wider font-semibold">Birth Place</span>
                <span className="text-[#1A0638] font-bold text-xs mt-0.5 block truncate">{details.birthPlace}</span>
              </div>
            </div>

            {/* Email - Full Width */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-100/35 via-[#1A0638]/5 to-purple-100/15 border border-purple-200/85 flex items-start gap-3 shadow-2xs hover:shadow-xs transition-all duration-300 sm:col-span-2 backdrop-blur-xs">
              <div className="w-8 h-8 rounded-full bg-white border border-purple-100/50 text-[#1A0638] flex items-center justify-center flex-shrink-0 shadow-2xs mt-0.5">
                <Mail className="w-4 h-4" />
              </div>
              <div className="overflow-hidden w-full">
                <span className="block text-[9px] text-[#1A0638]/60 uppercase tracking-wider font-semibold">Email Address</span>
                <span className="text-[#1A0638] font-bold text-xs mt-0.5 block truncate w-full">{details.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation terms notice */}
      <div className="flex gap-3 bg-amber-50/60 border border-amber-200/50 p-4.5 rounded-2xl items-start text-xs text-slate-600 mt-4 shadow-2xs">
        <ShieldCheck className="w-4.5 h-4.5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          There is a strict no-refund policy after payment.
        </p>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between mt-6 border-t border-slate-100 pt-6 gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 py-3 px-2 text-slate-800 text-xs tracking-widest uppercase font-bold transition-all duration-300 cursor-pointer bg-transparent border-0"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          <span>BACK</span>
        </button>
        <button
          onClick={onConfirm}
          disabled={isSubmitting}
          className="w-[62%] md:w-auto py-2.5 md:py-3.5 px-4 md:px-8 rounded-2xl md:rounded-xl bg-gradient-to-r from-accent-gold to-light-gold text-primary font-bold text-[10px] md:text-xs tracking-widest uppercase shadow-md disabled:opacity-40 hover:scale-[1.01] hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer leading-tight"
        >
          <span>{isSubmitting ? 'Proceeding...' : 'Proceed to Payment'}</span>
          {!isSubmitting && <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />}
        </button>
      </div>
    </div>
  );
};

export default BookingSummary;
