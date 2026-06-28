import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/dashboard/AdminLayout';
import BookingDetailsDrawer from '../../components/dashboard/BookingDetailsDrawer';
import { supabase } from '../../lib/supabase';
import useSEO from '../../hooks/useSEO';
import { 
  Search, 
  Filter, 
  Calendar, 
  Eye, 
  Phone, 
  AlertTriangle, 
  ChevronDown, 
  Sparkles,
  CalendarClock
} from 'lucide-react';

const Bookings = () => {
  useSEO({
    title: 'All Bookings – Admin | Pradeep Malhotra',
    description: 'Manage all consultation bookings.',
    canonical: '/admin/bookings',
    noIndex: true,
  });

  const [allBookings, setAllBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterService, setFilterService] = useState('All');
  const [isMobileFilterExpanded, setIsMobileFilterExpanded] = useState(false);

  // Reschedule dialog state
  const [rescheduleBooking, setRescheduleBooking] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newSlot, setNewSlot] = useState('Morning (8 AM - 12 PM)');

  const [availableServices, setAvailableServices] = useState([]);

  useEffect(() => {
    loadBookings();
    loadServices();

    // Subscribe to realtime updates on bookings
    const channel = supabase
      .channel('bookings-list-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        () => { loadBookings(); }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, services(*), service_packages(*), booking_details(*), payments(*)')
        .is('deleted_at', null)
        .not('booking_status', 'eq', 'Cancelled')
        .order('consultation_date', { ascending: false });

      if (data) {
        const mapped = data.map(b => {
          const detailsObj = Array.isArray(b.booking_details) ? b.booking_details[0] : b.booking_details;
          const paymentObj = Array.isArray(b.payments) ? b.payments[0] : b.payments;
          
          return {
            id: b.id,
            bookingNumber: b.booking_number,
            clientName: b.client_name,
            phone: b.client_phone,
            email: b.client_email,
            date: b.consultation_date,
            time: b.time_label,
            bookingStatus: b.booking_status,
            paymentStatus: b.payment_status,
            notes: detailsObj?.notes || '',
            birthDate: detailsObj?.birth_date || '',
            birthTime: detailsObj?.birth_time || '',
            birthPlace: detailsObj?.birth_place || '',
            gender: detailsObj?.gender || 'Male',
            paymentId: paymentObj?.razorpay_payment_id || paymentObj?.transaction_reference || 'N/A',
            service: {
              id: b.service_package_id,
              service_id: b.service_id,
              title: b.service_packages?.name || b.services?.title,
              price: b.service_packages?.price || 0,
              duration: b.service_packages?.duration || '30 Mins'
            }
          };
        });
        setAllBookings(mapped);
        setFilteredBookings(mapped);
      }
    } catch (err) {
      console.error('Error loading bookings:', err);
    }
  };

  const loadServices = async () => {
    try {
      const { data } = await supabase
        .from('services')
        .select('id, title')
        .is('deleted_at', null)
        .order('title', { ascending: true });
      if (data) {
        setAvailableServices(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Run filtering logic whenever filter states change
  useEffect(() => {
    let result = [...allBookings];

    if (searchTerm) {
      result = result.filter(b => 
        b.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.phone.includes(searchTerm)
      );
    }

    if (searchPhone) {
      result = result.filter(b => b.phone.includes(searchPhone));
    }

    if (filterDate) {
      result = result.filter(b => b.date === filterDate);
    }

    if (filterStatus !== 'All') {
      result = result.filter(b => b.bookingStatus === filterStatus);
    }

    if (filterService !== 'All') {
      result = result.filter(b => b.service?.service_id === filterService);
    }

    setFilteredBookings(result);
  }, [searchTerm, searchPhone, filterDate, filterStatus, filterService, allBookings]);

  const handleOpenDrawer = (booking) => {
    setSelectedBooking(booking);
    setIsDrawerOpen(true);
  };

  const handleCancelBooking = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        const { error } = await supabase
          .from('bookings')
          .update({ booking_status: 'Cancelled' })
          .eq('id', id);

        if (error) {
          alert('Error cancelling booking: ' + error.message);
        } else {
          loadBookings();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleReschedule = async (e) => {
    e.preventDefault();
    if (!rescheduleBooking || !newDate) return;

    const slotName = newSlot.split(' ')[0].toLowerCase();
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          consultation_date: newDate,
          time_label: newSlot,
          slot_type: slotName,
          booking_status: 'Confirmed'
        })
        .eq('id', rescheduleBooking.id);

      if (error) {
        alert('Error rescheduling booking: ' + error.message);
      } else {
        setRescheduleBooking(null);
        setNewDate('');
        loadBookings();
        alert('Booking rescheduled successfully!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 uppercase">Confirmed</span>;
      case 'Pending':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 border border-amber-500/25 text-amber-600 uppercase">Pending</span>;
      case 'Completed':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/10 border border-purple-500/25 text-[#1A0638] uppercase">Completed</span>;
      case 'Cancelled':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 border border-rose-500/25 text-rose-600 uppercase">Cancelled</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-500/10 border border-slate-500/25 text-slate-600 uppercase">{status}</span>;
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 text-left w-full max-w-full min-w-0">
        

        {/* ── Search & Filter Panel ── */}
        {/* Desktop View */}
        <section className="hidden sm:flex bg-[#FCFAF6] border border-[#2B124C]/10 rounded-3xl p-5 shadow-xs flex-col gap-4 text-left relative overflow-hidden">
          <span className="text-[10px] font-bold text-[#2B124C] uppercase tracking-[0.2em] flex items-center gap-1.5 relative z-10">
            <Filter className="w-3.5 h-3.5 text-[#2B124C]" /> Search & Filter Parameters
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 relative z-10">
            
            {/* Search by name */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] uppercase font-bold text-[#2B124C]/60 tracking-wider">Search Client Name</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#2B124C]/40" />
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#FCFAF6] border border-[#2B124C]/10 rounded-xl py-2 pl-9 pr-4 text-xs text-[#2B124C] placeholder-[#2B124C]/40 focus:outline-none focus:border-[#D4AF37] transition-all"
                />
              </div>
            </div>

            {/* Search by phone */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] uppercase font-bold text-[#2B124C]/60 tracking-wider">Search Phone Number</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#2B124C]/40" />
                <input
                  type="text"
                  placeholder="e.g. 98765"
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                  className="w-full bg-[#FCFAF6] border border-[#2B124C]/10 rounded-xl py-2 pl-9 pr-4 text-xs text-[#2B124C] placeholder-[#2B124C]/40 focus:outline-none focus:border-[#D4AF37] transition-all"
                />
              </div>
            </div>

            {/* Filter by date */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] uppercase font-bold text-[#2B124C]/60 tracking-wider">Filter By Date</label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full bg-[#FCFAF6] border border-[#2B124C]/10 rounded-xl py-2 px-3 text-xs text-[#2B124C] focus:outline-none focus:border-[#D4AF37] transition-all"
              />
            </div>

            {/* Filter by status */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] uppercase font-bold text-[#2B124C]/60 tracking-wider">Filter By Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full bg-[#FCFAF6] border border-[#2B124C]/10 rounded-xl py-2 px-3 text-xs text-[#2B124C] focus:outline-none focus:border-[#D4AF37] transition-all cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Filter by service */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] uppercase font-bold text-[#2B124C]/60 tracking-wider">Filter By Service</label>
              <select
                value={filterService}
                onChange={(e) => setFilterService(e.target.value)}
                className="w-full bg-[#FCFAF6] border border-[#2B124C]/10 rounded-xl py-2 px-3 text-xs text-[#2B124C] focus:outline-none focus:border-[#D4AF37] transition-all cursor-pointer"
              >
                <option value="All">All Services</option>
                {availableServices.map(s => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </div>

          </div>
        </section>

        {/* Mobile Search & Filter View */}
        <section className="flex sm:hidden flex-col gap-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#FCFAF6]/40" />
              <input
                type="text"
                placeholder="Search by name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#2B124C]/60 border border-[#D4AF37]/25 rounded-xl py-2.5 pl-9 pr-4 text-xs text-[#FCFAF6] placeholder-[#FCFAF6]/45 focus:outline-none focus:border-[#D4AF37] transition-all"
              />
            </div>
            <button
              onClick={() => setIsMobileFilterExpanded(!isMobileFilterExpanded)}
              className={`p-2.5 rounded-xl border flex items-center justify-center transition-all ${
                isMobileFilterExpanded 
                  ? 'bg-[#D4AF37] border-[#D4AF37] text-[#120428]' 
                  : 'bg-[#2B124C]/60 border-[#D4AF37]/25 text-[#FCFAF6]'
              }`}
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>

          {/* Expanded mobile filters */}
          {isMobileFilterExpanded && (
            <div className="bg-[#2B124C]/40 border border-[#D4AF37]/15 rounded-2xl p-4 flex flex-col gap-3 text-left">
              <div className="flex flex-col gap-1">
                <label className="text-[8px] uppercase font-bold text-[#FCFAF6]/60 tracking-wider">Filter By Date</label>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-full bg-[#2B124C] border border-[#D4AF37]/25 rounded-xl py-1.5 px-3 text-xs text-[#FCFAF6] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[8px] uppercase font-bold text-[#FCFAF6]/60 tracking-wider">Filter By Service</label>
                <select
                  value={filterService}
                  onChange={(e) => setFilterService(e.target.value)}
                  className="w-full bg-[#2B124C] border border-[#D4AF37]/25 rounded-xl py-1.5 px-3 text-xs text-[#FCFAF6] focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="All">All Services</option>
                  {availableServices.map(s => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Horizontal Status Chips Scrollbar */}
          <div className="flex gap-2 overflow-x-auto pb-1 mt-1 scrollbar-none snap-x font-sans">
            {['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'].map((status) => {
              const isActive = filterStatus === status;
              return (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`snap-center flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    isActive 
                      ? 'bg-[#D4AF37] border-[#D4AF37] text-[#120428] font-bold shadow-sm' 
                      : 'bg-[#2B124C]/60 border-[#D4AF37]/15 text-[#FCFAF6] hover:bg-[#2B124C]'
                  }`}
                >
                  {status}
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Bookings Grid Table ── */}
        {/* Desktop Table View */}
        <section className="hidden sm:flex bg-[#FCFAF6] border border-[#2B124C]/10 rounded-3xl p-5 shadow-xs flex-col gap-4 text-left relative overflow-hidden">
          
          <div className="flex justify-between items-center relative z-10">
            <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.2em]">
              Showing {filteredBookings.length} Bookings
            </span>
            {/* Clear filters shortcut */}
            {(searchTerm || searchPhone || filterDate || filterStatus !== 'All' || filterService !== 'All') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSearchPhone('');
                  setFilterDate('');
                  setFilterStatus('All');
                  setFilterService('All');
                }}
                className="text-[10px] font-bold text-[#2B124C]/60 hover:text-[#2B124C] underline cursor-pointer"
              >
                Clear All Filters
              </button>
            )}
          </div>

          {filteredBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs relative z-10">
                <thead>
                  <tr className="border-b border-[#2B124C]/10 text-[#2B124C]/50 uppercase tracking-widest text-[9px] font-bold">
                    <th className="py-3 px-3">Booking ID</th>
                    <th className="py-3 px-3">Client Details</th>
                    <th className="py-3 px-3">Consultation Service</th>
                    <th className="py-3 px-3">Date & Time Slot</th>
                    <th className="py-3 px-3">Payment</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2B124C]/5 font-sans">
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-[#2B124C]/3 transition-colors">
                      {/* ID code */}
                      <td className="py-3.5 px-3 font-semibold text-slate-400 font-mono">
                        {b.id}
                      </td>
                      {/* Client */}
                      <td className="py-3.5 px-3">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-[#2B124C]">{b.clientName}</span>
                          <span className="text-[10px] text-[#2B124C]/60">{b.email}</span>
                          <span className="text-[9px] text-[#D4AF37] font-semibold">{b.phone}</span>
                        </div>
                      </td>
                      {/* Service details */}
                      <td className="py-3.5 px-3">
                        <div className="flex flex-col gap-0.5 max-w-[180px]">
                          <span className="font-semibold text-[#2B124C] truncate">{b.service?.title}</span>
                          <span className="text-[10px] text-[#2B124C]/50 truncate">DOB: {b.birthDate}</span>
                        </div>
                      </td>
                      {/* Appointment timing */}
                      <td className="py-3.5 px-3">
                        <div className="flex flex-col gap-0.5 font-medium">
                          <span className="text-[#2B124C]">{b.date}</span>
                          <span className="text-[10px] text-[#2B124C]/60">{b.time}</span>
                        </div>
                      </td>
                      {/* Payment */}
                      <td className="py-3.5 px-3 font-semibold text-[#2B124C]">
                        <div className="flex flex-col gap-0.5">
                          <span>₹{b.service?.price.toLocaleString()}</span>
                          <span className="text-[9px] text-slate-400 leading-none">{b.paymentStatus}</span>
                        </div>
                      </td>
                      {/* Status */}
                      <td className="py-3.5 px-3">
                        {getStatusBadge(b.bookingStatus)}
                      </td>
                      {/* Action buttons */}
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenDrawer(b)}
                            title="View Coordinates details"
                            className="p-1.5 rounded-lg border border-[#2B124C]/10 text-[#2B124C]/70 hover:border-[#D4AF37]/50 hover:bg-[#2B124C]/5 cursor-pointer transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <a
                            href={`tel:${b.phone.replace(/[^0-9+]/g, '')}`}
                            title="Call Phone"
                            className="p-1.5 rounded-lg border border-[#2B124C]/10 text-[#2B124C]/70 hover:border-[#D4AF37]/50 hover:bg-[#2B124C]/5 cursor-pointer transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href={`https://wa.me/${b.phone.replace(/[^0-9+]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            title="WhatsApp Client"
                            className="p-1.5 rounded-lg border border-[#2B124C]/10 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 cursor-pointer transition-colors"
                          >
                            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.725 1.451 5.437 0 9.862-4.386 9.866-9.778.002-2.613-1.008-5.07-2.846-6.912-1.837-1.84-4.284-2.853-6.901-2.854-5.438 0-9.862 4.386-9.866 9.778-.001 2.081.547 4.11 1.585 5.906l-.999 3.648 3.756-.983zm10.026-6.69c-.272-.136-1.613-.796-1.863-.888-.252-.092-.435-.136-.617.136-.182.271-.703.888-.862 1.07-.159.182-.317.205-.59.069-.272-.136-1.15-.424-2.19-1.353-.809-.721-1.355-1.612-1.513-1.884-.159-.272-.017-.418.119-.554.123-.122.272-.317.408-.475.136-.159.182-.271.272-.453.09-.182.046-.34-.023-.476-.069-.136-.617-1.485-.845-2.03-.22-.531-.44-.458-.617-.467-.16-.008-.344-.01-.528-.01-.182 0-.476.069-.726.34-.25.272-.953.933-.953 2.277s.977 2.632 1.113 2.813c.136.182 1.922 2.934 4.656 4.114.65.28 1.157.447 1.55.573.654.208 1.25.178 1.72.108.524-.078 1.613-.659 1.84-1.294.227-.635.227-1.18.158-1.294-.069-.113-.252-.182-.524-.317z" />
                            </svg>
                          </a>
                          <button
                            onClick={() => setRescheduleBooking(b)}
                            title="Reschedule Slot"
                            className="p-1.5 rounded-lg border border-[#2B124C]/10 text-amber-600 hover:border-amber-400 hover:bg-amber-50 cursor-pointer transition-colors"
                          >
                            <CalendarClock className="w-3.5 h-3.5" />
                          </button>
                          {b.bookingStatus !== 'Cancelled' && (
                            <button
                              onClick={() => handleCancelBooking(b.id)}
                              title="Cancel Session"
                              className="p-1.5 rounded-lg border border-[#2B124C]/10 text-rose-600 hover:border-rose-300 hover:bg-rose-50 cursor-pointer transition-colors"
                            >
                              <AlertTriangle className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-[#2B124C]/45 text-xs border border-dashed border-[#2B124C]/20 rounded-2xl">
              No matching bookings found. Please try refining your search or filter values.
            </div>
          )}
        </section>

        {/* Mobile Card List View */}
        <section className="flex sm:hidden flex-col gap-4 bg-[#FCFAF6] rounded-t-[32px] -mx-6 p-4 pt-6 flex-1 min-h-[500px]">
          <div className="flex justify-between items-center px-1">
            <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-[0.2em]">
              Showing {filteredBookings.length} Bookings
            </span>
            {(searchTerm || searchPhone || filterDate || filterStatus !== 'All' || filterService !== 'All') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSearchPhone('');
                  setFilterDate('');
                  setFilterStatus('All');
                  setFilterService('All');
                }}
                className="text-[10px] font-bold text-[#2B124C]/60 hover:text-[#2B124C] underline cursor-pointer"
              >
                Clear All Filters
              </button>
            )}
          </div>

          {filteredBookings.length > 0 ? (
            <div className="flex flex-col gap-3.5 pb-20">
              {filteredBookings.map((b) => (
                <div 
                  key={b.id} 
                  onClick={() => handleOpenDrawer(b)}
                  className="bg-white border border-[#2B124C]/5 rounded-2xl p-4 flex flex-col gap-3 shadow-xs text-left cursor-pointer active:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100/70 border border-purple-200 text-[#2B124C] font-semibold text-xs flex items-center justify-center">
                        {b.clientName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-xs text-[#2B124C]">{b.clientName}</span>
                        <span className="text-[10px] text-slate-500 font-semibold">{b.phone}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {getStatusBadge(b.bookingStatus)}
                      <ChevronDown className="w-4 h-4 text-slate-400 -rotate-90" />
                    </div>
                  </div>
                  
                  <div className="text-[10px] text-slate-600 font-medium pl-1">
                    {b.service?.title}
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 mt-1">
                    <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{b.date} • {b.time.substring(b.time.indexOf('(') + 1, b.time.indexOf(')'))}</span>
                    </div>

                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <a
                        href={`tel:${b.phone.replace(/[^0-9+]/g, '')}`}
                        className="p-2 rounded-xl border border-slate-100 text-slate-600 hover:bg-slate-50 flex items-center justify-center bg-white shadow-inner"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={`https://wa.me/${b.phone.replace(/[^0-9+]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl border border-slate-100 text-emerald-600 hover:bg-slate-50 flex items-center justify-center bg-white shadow-inner"
                      >
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.005 5.291 5.3 0 11.805 0c3.148.001 6.107 1.227 8.332 3.454a11.66 11.66 0 0 1 3.457 8.332c-.005 6.515-5.3 11.805-11.805 11.805-2.002-.001-3.97-.508-5.719-1.472L0 24zm6.59-4.846c1.6.95 3.197 1.451 4.792 1.453 5.4 0 9.794-4.39 9.799-9.792.002-2.617-1.017-5.078-2.871-6.932-1.854-1.854-4.316-2.872-6.93-2.875-5.4 0-9.793 4.393-9.799 9.797-.001 1.7.468 3.36 1.358 4.8l-.994 3.63 3.72-.977-.075-.011zM17.18 14.86c-.29-.15-1.74-.86-2.01-.96-.28-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.15-.17.2-.35.22-.64.07-2.18-1.1-3.62-2.22-4.57-3.87-.25-.43.25-.4.71-1.32.07-.15.03-.28-.02-.38-.05-.1-.47-1.15-.65-1.57-.17-.4-.36-.35-.5-.35m-.53.07s-.15-.02-.35-.02c-.17 0-.45.07-.68.32-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.57.12.17 1.75 2.67 4.24 3.74.6.25 1.06.4 1.42.52.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.67-1.18.2-.58.2-1.08.14-1.18-.06-.1-.23-.15-.52-.3z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-[#2B124C]/45 text-xs border border-dashed border-[#2B124C]/20 rounded-2xl">
              No matching bookings found. Please try refining your search or filter values.
            </div>
          )}
        </section>

      </div>

      {/* ── Details Drawer overlay ── */}
      <BookingDetailsDrawer
        booking={selectedBooking}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedBooking(null);
        }}
        onStatusChange={() => {
          loadBookings();
          setIsDrawerOpen(false);
        }}
      />

      {/* ── Reschedule Dialog Modal ── */}
      {rescheduleBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-[420px] bg-[#FCFAF6] border border-[#1A0638]/10 shadow-2xl rounded-3xl p-5 sm:p-6 text-left text-[#1A0638]">
            <div className="flex justify-between items-center border-b border-[#1A0638]/5 pb-3 mb-4">
              <h3 className="font-display font-bold text-base text-[#1A0638]">
                Reschedule Session
              </h3>
              <button
                onClick={() => setRescheduleBooking(null)}
                className="text-slate-400 hover:text-[#1A0638] text-2xl font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleReschedule} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Client Name</span>
                <span className="text-xs font-bold text-[#1A0638]">{rescheduleBooking.clientName}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Current Slot</span>
                <span className="text-xs text-slate-600">{rescheduleBooking.date} • {rescheduleBooking.time}</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-[#1A0638]/75">Select New Date</label>
                <input
                  type="date"
                  required
                  min={mockData.formatLocalDate(new Date())}
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-white border border-[#1A0638]/10 rounded-xl p-2.5 text-xs text-[#1A0638] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-[#1A0638]/75">Select Timing Interval</label>
                <select
                  value={newSlot}
                  onChange={(e) => setNewSlot(e.target.value)}
                  className="w-full bg-white border border-[#1A0638]/10 rounded-xl p-2.5 text-xs text-[#1A0638] focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="Morning (8 AM - 12 PM)">Morning (8 AM - 12 PM)</option>
                  <option value="Afternoon (12 PM - 3 PM)">Afternoon (12 PM - 3 PM)</option>
                  <option value="Evening (3 PM - 6 PM)">Evening (3 PM - 6 PM)</option>
                  <option value="Night (6 PM - 10 PM)">Night (6 PM - 10 PM)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 mt-2 pt-3 border-t border-[#1A0638]/5">
                <button
                  type="button"
                  onClick={() => setRescheduleBooking(null)}
                  className="py-2 px-4 rounded-xl border border-slate-200 hover:border-slate-400 text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-[#1A0638] hover:bg-[#120428] text-white font-bold text-xs uppercase tracking-wider shadow-sm cursor-pointer"
                >
                  Confirm Change
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Bookings;
