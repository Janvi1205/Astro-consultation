import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  FileText, 
  CreditCard, 
  CheckCircle, 
  AlertTriangle,
  BadgeAlert,
  ArrowRight
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const BookingDetailsDrawer = ({ booking, isOpen, onClose, onStatusChange }) => {
  if (!booking) return null;

  const handleUpdateStatus = async (status) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ booking_status: status })
        .eq('id', booking.id);

      if (error) {
        alert('Error updating status: ' + error.message);
      } else {
        if (onStatusChange) {
          onStatusChange();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-emerald-500/10 border-emerald-500/25 text-emerald-600';
      case 'Pending': return 'bg-amber-500/10 border-amber-500/25 text-amber-600';
      case 'Completed': return 'bg-purple-500/10 border-purple-500/25 text-[#1A0638]';
      case 'Cancelled': return 'bg-rose-500/10 border-rose-500/25 text-rose-600';
      default: return 'bg-slate-500/10 border-slate-500/25 text-slate-600';
    }
  };

  // Clean numbers for phone/whatsapp links
  const formattedPhone = booking.phone.replace(/[^0-9+]/g, '');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.45 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#120428]/40 backdrop-blur-xs z-40 cursor-pointer"
          />

          {/* Sliding Drawer Container */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-[#FCFAF6] border-l border-[#D4AF37]/10 shadow-2xl z-50 flex flex-col h-full text-left"
          >
            {/* Drawer Header */}
            {/* Desktop Header */}
            <div className="hidden sm:flex p-5 border-b border-[#2B124C]/10 items-center justify-between bg-[#2B124C] text-[#FCFAF6]">
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold text-[#D4AF37] tracking-[0.25em] uppercase">Booking Consultation Details</span>
                <h3 className="font-display font-bold text-base tracking-wide flex items-center gap-2">
                  <span>ID: {booking.id}</span>
                  <span className={`text-[10px] py-0.5 px-2 rounded-full border ${getStatusColor(booking.bookingStatus)}`}>
                    {booking.bookingStatus}
                  </span>
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Header */}
            <div className="flex sm:hidden p-5 border-b border-[#2B124C]/10 items-center justify-between bg-[#2B124C] text-[#FCFAF6]">
              <button
                onClick={onClose}
                className="p-1 rounded-xl hover:bg-white/10 text-white transition-colors cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
              </button>
              <h3 className="font-display font-bold text-base tracking-wide flex-1 text-center -ml-8">
                Booking Details
              </h3>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              
              {/* Service Selected Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#2B124C]/5 via-transparent to-[#D4AF37]/5 border border-[#2B124C]/10">
                <span className="text-[9px] font-semibold text-[#2B124C]/50 uppercase tracking-widest block">Selected Consultation Service</span>
                <h4 className="font-display text-base font-bold text-[#2B124C] mt-1.5">{booking.service?.title}</h4>
                
                {/* Badges details */}
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#2B124C]/10">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-[#2B124C]/50 uppercase">Fees Paid</span>
                    <span className="text-sm font-bold text-[#D4AF37]">₹{booking.service?.price.toLocaleString()}</span>
                  </div>
                  <div className="h-6 w-[1px] bg-[#2B124C]/10" />
                  <div className="flex flex-col">
                    <span className="text-[9px] text-[#2B124C]/50 uppercase">Duration</span>
                    <span className="text-xs font-semibold text-[#2B124C]/80 mt-0.5">{booking.time.split(' ')[0]} Slot</span>
                  </div>
                  <div className="h-6 w-[1px] bg-[#2B124C]/10" />
                  <div className="flex flex-col">
                    <span className="text-[9px] text-[#2B124C]/50 uppercase">Payment Status</span>
                    <span className="text-[10px] font-bold text-[#2B124C] mt-0.5 flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5 text-[#2B124C]/60" />
                      {booking.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Consultation Coordinates */}
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-bold text-[#2B124C]/50 uppercase tracking-wider">Consultation Coordinates</h4>
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="p-3 bg-white border border-[#2B124C]/5 rounded-xl shadow-2xs">
                    <span className="block text-[9px] text-[#2B124C]/50 uppercase font-semibold">Consultation Date</span>
                    <span className="text-xs text-[#2B124C] font-semibold mt-1 block flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                      {booking.date}
                    </span>
                  </div>
                  <div className="p-3 bg-white border border-[#2B124C]/5 rounded-xl shadow-2xs">
                    <span className="block text-[9px] text-[#2B124C]/50 uppercase font-semibold">Consultation Time</span>
                    <span className="text-xs text-[#2B124C] font-semibold mt-1 block flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                      {booking.time.substring(booking.time.indexOf('(') + 1, booking.time.indexOf(')'))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Client Contact Info */}
              <div className="flex flex-col gap-3.5">
                <h4 className="text-xs font-bold text-[#2B124C]/50 uppercase tracking-wider">Client Information</h4>
                <div className="flex flex-col gap-2 bg-white border border-[#2B124C]/5 rounded-xl p-4 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#2B124C]/5 text-[#2B124C] flex items-center justify-center font-bold">
                      {booking.clientName.substring(0,2).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#2B124C]">{booking.clientName}</span>
                      <span className="text-[10px] text-[#2B124C]/60">Client Profile</span>
                    </div>
                  </div>
                  <div className="h-[1px] bg-[#2B124C]/5 my-2" />
                  
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-3 text-xs text-[#2B124C]/75">
                      <Phone className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                      <a href={`tel:${formattedPhone}`} className="hover:underline font-semibold text-[#2B124C]">{booking.phone}</a>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#2B124C]/75">
                      <Mail className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                      <a href={`mailto:${booking.email}`} className="hover:underline">{booking.email}</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Astrological Birth Coordinates */}
              <div className="flex flex-col gap-3.5">
                <h4 className="text-xs font-bold text-[#2B124C]/50 uppercase tracking-wider">Birth Coordinates (Kundli Parameters)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 bg-white border border-[#2B124C]/5 rounded-xl p-4 shadow-2xs">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#D4AF37] mt-0.5" />
                    <div className="flex flex-col">
                      <span className="text-[9px] text-[#2B124C]/50 uppercase font-semibold">Birth Place</span>
                      <span className="text-xs font-semibold text-[#2B124C] mt-0.5 block truncate max-w-[150px]">{booking.birthPlace || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Calendar className="w-4 h-4 text-[#D4AF37] mt-0.5" />
                    <div className="flex flex-col">
                      <span className="text-[9px] text-[#2B124C]/50 uppercase font-semibold">Date of Birth</span>
                      <span className="text-xs font-semibold text-[#2B124C] mt-0.5">{booking.birthDate || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-[#D4AF37] mt-0.5" />
                    <div className="flex flex-col">
                      <span className="text-[9px] text-[#2B124C]/50 uppercase font-semibold">Time of Birth</span>
                      <span className="text-xs font-semibold text-[#2B124C] mt-0.5">{booking.birthTime || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Consultation Notes */}
              <div className="flex flex-col gap-3.5">
                <h4 className="text-xs font-bold text-[#2B124C]/50 uppercase tracking-wider">Client Consultation Notes</h4>
                <div className="p-4 bg-[#2B124C]/5 rounded-xl border border-[#2B124C]/10 text-xs italic text-[#2B124C]/80 leading-relaxed">
                  {booking.notes ? `"${booking.notes}"` : '"No specific query notes provided by client."'}
                </div>
              </div>

              {/* Payment Details ID */}
              <div className="flex items-center justify-between text-xs py-3 px-4 bg-white border border-[#2B124C]/5 rounded-xl shadow-2xs text-[#2B124C]/75">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#D4AF37]" />
                  <span className="font-semibold text-[#2B124C]/50">Payment Transaction ID:</span>
                </div>
                <code className="font-mono text-[10px] font-bold text-[#2B124C]">{booking.paymentId}</code>
              </div>
            </div>

            {/* Action Bar Footer */}
            <div className="p-5 border-t border-[#2B124C]/10 bg-white flex flex-col gap-3">
              
              {/* Contact actions */}
              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={`tel:${formattedPhone}`}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl border border-[#2B124C]/10 hover:border-[#D4AF37]/50 hover:bg-[#2B124C]/5 text-[#2B124C] font-semibold text-xs transition-colors duration-300"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>
                <a
                  href={`https://wa.me/${formattedPhone.replace('+', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-3 rounded-xl border border-emerald-200 hover:bg-emerald-50 text-emerald-600 font-semibold text-xs transition-colors duration-300"
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.725 1.451 5.437 0 9.862-4.386 9.866-9.778.002-2.613-1.008-5.07-2.846-6.912-1.837-1.84-4.284-2.853-6.901-2.854-5.438 0-9.862 4.386-9.866 9.778-.001 2.081.547 4.11 1.585 5.906l-.999 3.648 3.756-.983zm10.026-6.69c-.272-.136-1.613-.796-1.863-.888-.252-.092-.435-.136-.617.136-.182.271-.703.888-.862 1.07-.159.182-.317.205-.59.069-.272-.136-1.15-.424-2.19-1.353-.809-.721-1.355-1.612-1.513-1.884-.159-.272-.017-.418.119-.554.123-.122.272-.317.408-.475.136-.159.182-.271.272-.453.09-.182.046-.34-.023-.476-.069-.136-.617-1.485-.845-2.03-.22-.531-.44-.458-.617-.467-.16-.008-.344-.01-.528-.01-.182 0-.476.069-.726.34-.25.272-.953.933-.953 2.277s.977 2.632 1.113 2.813c.136.182 1.922 2.934 4.656 4.114.65.28 1.157.447 1.55.573.654.208 1.25.178 1.72.108.524-.078 1.613-.659 1.84-1.294.227-.635.227-1.18.158-1.294-.069-.113-.252-.182-.524-.317z" />
                  </svg>
                  <span>WhatsApp</span>
                </a>
              </div>

              {/* Status workflow triggers */}
              {booking.bookingStatus !== 'Completed' && booking.bookingStatus !== 'Cancelled' && (
                <div className="flex flex-col gap-2.5 w-full">
                  <button
                    onClick={() => handleUpdateStatus('Completed')}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F4D06F] text-[#120428] font-bold text-xs uppercase tracking-widest shadow-sm cursor-pointer hover:scale-[1.01] transition-transform duration-200"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Mark as Completed</span>
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('Cancelled')}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-rose-200 bg-rose-50/30 hover:bg-rose-50 text-rose-600 font-bold text-xs uppercase tracking-wider transition-colors duration-200 cursor-pointer"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Cancel Booking</span>
                  </button>
                </div>
              )}

              {booking.bookingStatus === 'Cancelled' && (
                <button
                  onClick={() => handleUpdateStatus('Confirmed')}
                  className="w-full flex items-center justify-center gap-1.5 py-3.5 rounded-xl bg-[#2B124C] text-[#FCFAF6] font-bold text-xs uppercase tracking-wider shadow-md cursor-pointer"
                >
                  <span>Re-confirm Booking Appointment</span>
                </button>
              )}

              {booking.bookingStatus === 'Completed' && (
                <div className="w-full text-center text-xs font-semibold text-[#2B124C]/60 py-2.5 border border-dashed border-[#2B124C]/10 rounded-xl bg-slate-50">
                  ✓ This consultation is marked as completed.
                </div>
              )}
            </div>

          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default BookingDetailsDrawer;
