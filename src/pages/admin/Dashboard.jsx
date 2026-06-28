import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/dashboard/AdminLayout';
import BookingDetailsDrawer from '../../components/dashboard/BookingDetailsDrawer';
import { supabase } from '../../lib/supabase';
import useSEO from '../../hooks/useSEO';
import { 
  Users, 
  CalendarCheck, 
  Clock, 
  TrendingUp, 
  Eye, 
  Phone, 
  AlertTriangle,
  FolderHeart,
  CalendarDays,
  PlusCircle,
  ExternalLink,
  Search,
  MessageCircle,
  CalendarClock
} from 'lucide-react';

const Dashboard = () => {
  useSEO({
    title: 'Dashboard – Admin | Pradeep Malhotra',
    description: 'Admin dashboard for managing bookings and consultations.',
    canonical: '/admin/dashboard',
    noIndex: true,
  });

  const [stats, setStats] = useState({ totalBookings: 0, todayBookings: 0, upcomingBookings: 0, totalClients: 0 });
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Reschedule dialog state
  const [rescheduleBooking, setRescheduleBooking] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newSlot, setNewSlot] = useState('Morning (8 AM - 12 PM)');

  useEffect(() => {
    loadData();

    // Subscribe to realtime changes on bookings and payments
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        () => { loadData(); }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'payments' },
        () => { loadData(); }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadData = async () => {
    try {
      // 1. Load Stats via RPC
      const { data: statsData } = await supabase.rpc('get_admin_dashboard_stats');
      if (statsData) {
        setStats({
          totalBookings: statsData.total_bookings,
          todayBookings: statsData.today_bookings,
          upcomingBookings: statsData.upcoming_bookings,
          totalClients: statsData.total_clients
        });
      }

      // 2. Load Top 5 Upcoming Bookings
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('*, services(*), service_packages(*), booking_details(*), payments(*)')
        .is('deleted_at', null)
        .not('booking_status', 'in', '("Cancelled","Completed")')
        .order('consultation_date', { ascending: true })
        .limit(5);

      if (bookingsData) {
        const mapped = bookingsData.map(b => {
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
              title: b.service_packages?.name || b.services?.title,
              price: b.service_packages?.price || 0,
              duration: b.service_packages?.duration || '30 Mins'
            }
          };
        });
        setUpcomingBookings(mapped);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    }
  };

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
          loadData();
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
        loadData();
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

  const statCards = [
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      desc: 'All-time scheduled consultations',
      trend: '+12% from last month',
      icon: CalendarCheck,
      color: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-700'
    },
    {
      title: "Today's Bookings",
      value: stats.todayBookings,
      desc: 'Active consultations for today',
      trend: '3 slots completed today',
      icon: Clock,
      color: 'bg-amber-500/10 border-amber-500/20 text-amber-700'
    },
    {
      title: 'Upcoming Bookings',
      value: stats.upcomingBookings,
      desc: 'Confirmed consultations pending',
      trend: 'Next appointment tomorrow',
      icon: CalendarClock,
      color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700'
    },
    {
      title: 'Total Clients',
      value: stats.totalClients,
      desc: 'Unique clients consulting you',
      trend: '4 new clients this week',
      icon: Users,
      color: 'bg-purple-500/10 border-purple-500/20 text-[#1A0638]'
    }
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8 w-full max-w-full min-w-0">
        
        {/* ── Top Stat Cards Grid ── */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {statCards.map((card, idx) => {
            const CardIcon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -4, shadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                className="bg-white border border-[#2B124C]/5 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col justify-between transition-all duration-300 relative overflow-hidden text-left"
              >
                {/* Background soft glow circle */}
                <div className="absolute right-[-10%] top-[-10%] w-16 h-16 rounded-full bg-[#2B124C]/3 blur-lg pointer-events-none" />

                {/* Desktop Card Layout */}
                <div className="hidden sm:flex flex-col h-full justify-between gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#2B124C]/55 uppercase tracking-wider">
                      {card.title}
                    </span>
                    <div className={`w-8.5 h-8.5 rounded-xl border flex items-center justify-center ${card.color}`}>
                      <CardIcon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-display text-3xl font-bold text-[#2B124C]">{card.value}</h3>
                    <span className="text-[10px] text-[#2B124C]/60 leading-tight">{card.desc}</span>
                  </div>
                  <div className="pt-3 border-t border-[#2B124C]/5 flex items-center gap-1 text-[9px] font-semibold text-[#D4AF37]">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{card.trend}</span>
                  </div>
                </div>

                {/* Mobile Card Layout */}
                <div className="flex sm:hidden flex-col gap-2 h-full">
                  <div className="w-9 h-9 rounded-full bg-[#2B124C] border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shadow-sm">
                    <CardIcon className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-[9px] font-bold text-[#2B124C]/60 uppercase tracking-wider">
                    {card.title}
                  </span>
                  <div className="flex flex-col gap-0.5 mt-auto">
                    <h3 className="font-display text-2xl font-bold text-[#2B124C] leading-none">{card.value}</h3>
                    <span className={`text-[8px] font-semibold flex items-center gap-0.5 mt-1 ${
                      card.trend.includes('-') ? 'text-rose-500' : 'text-emerald-600'
                    }`}>
                      {card.trend.includes('%') ? (card.trend.includes('+') ? '↑' : '↓') : ''} {card.trend.replace('+','').replace('-','')}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </section>

        {/* ── Dashboard Content Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left Block (2 Cols): Upcoming Consultations */}
          <div className="lg:col-span-2 flex flex-col gap-4 bg-white border border-[#2B124C]/5 rounded-3xl p-5 shadow-xs text-left">
            <div className="flex justify-between items-center pb-2 border-b border-[#2B124C]/5">
              <div className="flex flex-col gap-0.5">
                <h3 className="font-display font-bold text-base sm:text-lg text-[#2B124C]">Upcoming Bookings</h3>
                <p className="hidden sm:block text-[11px] text-[#2B124C]/55">Your next few scheduled astrology sessions.</p>
              </div>
              <Link
                to="/admin/bookings"
                className="text-[10px] font-bold text-[#D4AF37] hover:text-[#FCFAF6] hover:bg-[#D4AF37] border border-[#D4AF37] px-3.5 py-1.5 rounded-full transition-all duration-300 uppercase tracking-wider"
              >
                <span className="hidden sm:inline">View All Bookings</span>
                <span className="inline sm:hidden">View All</span>
              </Link>
            </div>

            {upcomingBookings.length > 0 ? (
              <>
                {/* Desktop Table View */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#2B124C]/5 text-[#2B124C]/50 uppercase tracking-widest text-[9px] font-bold">
                        <th className="py-3 px-2">Client Details</th>
                        <th className="py-3 px-2">Consultation</th>
                        <th className="py-3 px-2">Schedule</th>
                        <th className="py-3 px-2">Status</th>
                        <th className="py-3 px-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2B124C]/5 font-sans">
                      {upcomingBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-[#2B124C]/2 transition-colors">
                          {/* Client details */}
                          <td className="py-3.5 px-2">
                            <div className="flex flex-col gap-0.5">
                              <span className="font-bold text-[#2B124C]">{b.clientName}</span>
                              <span className="text-[10px] text-[#2B124C]/70 font-semibold">{b.phone}</span>
                            </div>
                          </td>
                          {/* Service description */}
                          <td className="py-3.5 px-2">
                            <div className="flex flex-col gap-0.5 max-w-[150px]">
                              <span className="font-semibold text-[#2B124C] truncate">{b.service?.title}</span>
                              <span className="text-[10px] text-[#D4AF37] font-semibold">₹{b.service?.price.toLocaleString()}</span>
                            </div>
                          </td>
                          {/* Date & Time */}
                          <td className="py-3.5 px-2">
                            <div className="flex flex-col gap-0.5">
                              <span className="font-semibold text-[#2B124C]">{b.date}</span>
                              <span className="text-[10px] text-[#2B124C]/60">
                                {b.time.substring(b.time.indexOf('(') + 1, b.time.indexOf(')'))}
                              </span>
                            </div>
                          </td>
                          {/* Status */}
                          <td className="py-3.5 px-2">
                            {getStatusBadge(b.bookingStatus)}
                          </td>
                          {/* Actions */}
                          <td className="py-3.5 px-2 text-right">
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenDrawer(b)}
                                title="View Coordinates Detail"
                                className="p-1.5 rounded-lg border border-[#2B124C]/10 text-[#2B124C]/70 hover:border-[#D4AF37]/50 hover:bg-[#2B124C]/5 cursor-pointer transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <a
                                href={`tel:${b.phone.replace(/[^0-9+]/g, '')}`}
                                title="Call Client"
                                className="p-1.5 rounded-lg border border-[#2B124C]/10 text-[#2B124C]/70 hover:border-[#D4AF37]/50 hover:bg-[#2B124C]/5 cursor-pointer transition-colors"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                              <button
                                onClick={() => setRescheduleBooking(b)}
                                title="Reschedule Slot"
                                className="p-1.5 rounded-lg border border-[#2B124C]/10 text-amber-600 hover:border-amber-400 hover:bg-amber-50 cursor-pointer transition-colors"
                              >
                                <CalendarClock className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleCancelBooking(b.id)}
                                title="Cancel Session"
                                className="p-1.5 rounded-lg border border-[#2B124C]/10 text-rose-600 hover:border-rose-300 hover:bg-rose-50 cursor-pointer transition-colors"
                              >
                                <AlertTriangle className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card List View */}
                <div className="flex sm:hidden flex-col gap-3">
                  {upcomingBookings.map((b) => (
                    <div key={b.id} className="bg-white border border-[#2B124C]/5 rounded-2xl p-4 flex items-center justify-between shadow-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100/70 border border-purple-200 text-[#2B124C] font-semibold text-xs flex items-center justify-center">
                          {b.clientName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="font-bold text-xs text-[#2B124C]">{b.clientName}</span>
                          <span className="text-[10px] text-slate-500 font-semibold">{b.service?.title}</span>
                          <span className="text-[9px] text-slate-400 font-semibold mt-1">
                            {b.date} • {b.time.substring(b.time.indexOf('(') + 1, b.time.indexOf(')'))}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(b.bookingStatus)}
                        <a
                          href={`tel:${b.phone.replace(/[^0-9+]/g, '')}`}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-10 text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl">
                No upcoming consultations found. Good time to block off schedules!
              </div>
            )}
          </div>

          {/* Right Block (1 Col): Quick Action shortcuts */}
          <div className="hidden sm:flex flex-col gap-5">
            
            {/* Quick Actions Shortcuts Card */}
            <div className="bg-[#FCFAF6] border border-[#1A0638]/10 rounded-3xl p-5 shadow-xs relative overflow-hidden text-left">
              <h3 className="font-display font-bold text-base text-[#1A0638] border-b border-[#1A0638]/10 pb-2 mb-4">
                Astrologer Quick Actions
              </h3>
              <div className="flex flex-col gap-2.5 relative z-10">
                <Link
                  to="/admin/slots"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-[#FCFAF6] border border-[#1A0638]/10 hover:border-[#D4AF37]/50 text-[#1A0638] hover:bg-[#1A0638]/5 transition-all text-xs font-semibold cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4 text-[#D4AF37]" />
                  <span>Configure Calendar Slots</span>
                </Link>
                <Link
                  to="/admin/bookings"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-[#FCFAF6] border border-[#1A0638]/10 hover:border-[#D4AF37]/50 text-[#1A0638] hover:bg-[#1A0638]/5 transition-all text-xs font-semibold cursor-pointer"
                >
                  <Users className="w-4 h-4 text-[#D4AF37]" />
                  <span>View Full Bookings File</span>
                </Link>
                <a
                  href="/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-[#FCFAF6] border border-[#1A0638]/10 hover:border-[#D4AF37]/50 text-[#1A0638] hover:bg-[#1A0638]/5 transition-all text-xs font-semibold cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 text-[#D4AF37]" />
                  <span className="flex items-center gap-1">
                    Open Astrologer Website <ExternalLink className="w-3 h-3 text-[#1A0638]/40" />
                  </span>
                </a>
              </div>
            </div>


          </div>

        </div>

      </div>

      {/* ── Booking Details Drawer Overlay ── */}
      <BookingDetailsDrawer
        booking={selectedBooking}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedBooking(null);
        }}
        onStatusChange={() => {
          loadData();
          setIsDrawerOpen(false);
        }}
      />

      {/* ── Reschedule Dialog Modal ── */}
      {rescheduleBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-[420px] bg-[#FCFAF6] border border-[#1A0638]/10 shadow-2xl rounded-3xl p-5 sm:p-6 text-left">
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

export default Dashboard;
