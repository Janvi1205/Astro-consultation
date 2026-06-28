import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/dashboard/AdminLayout';
import { supabase } from '../../lib/supabase';
import useSEO from '../../hooks/useSEO';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Lock, 
  Unlock, 
  Ban, 
  CheckCircle,
  HelpCircle,
  Sparkles,
  RefreshCw,
  Sun,
  Sunset,
  Moon
} from 'lucide-react';

const Slots = () => {
  useSEO({
    title: 'Slot Management – Admin | Pradeep Malhotra',
    description: 'Manage available consultation time slots.',
    canonical: '/admin/slots',
    noIndex: true,
  });

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateStr, setSelectedDateStr] = useState('');
  const [slots, setSlots] = useState({ morning: 'Available', afternoon: 'Available', evening: 'Available', night: 'Available' });

  // Supabase states
  const [dbBookings, setDbBookings] = useState([]);
  const [dbBlockedSlots, setDbBlockedSlots] = useState([]);
  const [dbSlots, setDbSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  // Calendar month/year navigation state
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isPrevMonthDisabled = currentYear === today.getFullYear() && currentMonth === today.getMonth();

  const isPastDate = (date) => {
    if (!date) return true;
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return date < t;
  };

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const formatLocalDate = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getMonthDateRange = (month, year) => {
    const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month + 1, 0).getDate();
    const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
    return { startDate, endDate };
  };

  const getSlotsForDate = (dateStr, bookingsList, blockedList, slotsList) => {
    const defaults = {
      morning: 'Available',
      afternoon: 'Available',
      evening: 'Available',
      night: 'Available'
    };

    if (!slotsList || slotsList.length === 0) return defaults;

    // 1. Overlay bookings
    bookingsList.forEach(b => {
      if (b.consultation_date === dateStr && b.booking_status !== 'Cancelled') {
        const slotKey = b.slot_type;
        if (defaults[slotKey] !== undefined) {
          defaults[slotKey] = 'Booked';
        }
      }
    });

    // 2. Overlay blocked slots
    blockedList.forEach(bs => {
      if (bs.blocked_date === dateStr) {
        if (bs.slot_id === null) {
          // Entire day blocked
          Object.keys(defaults).forEach(k => {
            if (defaults[k] !== 'Booked') {
              defaults[k] = 'Blocked';
            }
          });
        } else {
          const slot = slotsList.find(s => s.id === bs.slot_id);
          if (slot && defaults[slot.name] !== 'Booked') {
            defaults[slot.name] = 'Blocked';
          }
        }
      }
    });

    return defaults;
  };

  useEffect(() => {
    const fetchSlotsList = async () => {
      const { data } = await supabase.from('slots').select('id, name, label');
      if (data) {
        setDbSlots(data);
      }
    };
    fetchSlotsList();

    const today = new Date();
    setSelectedDate(today);
    const dateStr = formatLocalDate(today);
    setSelectedDateStr(dateStr);
  }, []);

  const loadMonthData = async () => {
    setLoading(true);
    const { startDate, endDate } = getMonthDateRange(currentMonth, currentYear);
    try {
      const [bookingsRes, blockedRes] = await Promise.all([
        supabase
          .from('bookings')
          .select('id, consultation_date, slot_type, booking_status')
          .neq('booking_status', 'Cancelled')
          .gte('consultation_date', startDate)
          .lte('consultation_date', endDate),
        supabase
          .from('blocked_slots')
          .select('id, blocked_date, slot_id, reason')
          .gte('blocked_date', startDate)
          .lte('blocked_date', endDate)
      ]);

      if (bookingsRes.data) setDbBookings(bookingsRes.data);
      if (blockedRes.data) setDbBlockedSlots(blockedRes.data);
    } catch (err) {
      console.error("Error loading month data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMonthData();
  }, [currentMonth, currentYear]);

  useEffect(() => {
    if (selectedDateStr) {
      const computed = getSlotsForDate(selectedDateStr, dbBookings, dbBlockedSlots, dbSlots);
      setSlots(computed);
    }
  }, [selectedDateStr, dbBookings, dbBlockedSlots, dbSlots]);

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    if (isPrevMonthDisabled) return;
    setCurrentMonth((prev) => {
      if (prev === 0) {
        setCurrentYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 11) {
        setCurrentYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const dateStr = formatLocalDate(date);
    setSelectedDateStr(dateStr);
  };

  const handleToggleSlot = async (slotType, currentStatus) => {
    if (currentStatus === 'Booked') {
      alert('This slot is already booked by a client and cannot be blocked directly. You must cancel or reschedule the booking first.');
      return;
    }

    const slot = dbSlots.find(s => s.name === slotType);
    if (!slot) {
      alert('Error: Slot type not found.');
      return;
    }

    try {
      if (currentStatus === 'Blocked') {
        // Unblock it
        const entireDayBlocked = dbBlockedSlots.find(bs => bs.blocked_date === selectedDateStr && bs.slot_id === null);
        
        if (entireDayBlocked) {
          // If entire day is blocked, delete that block row and insert blocked rows for the other 3 slots
          await supabase
            .from('blocked_slots')
            .delete()
            .eq('id', entireDayBlocked.id);

          const otherSlots = dbSlots.filter(s => s.name !== slotType);
          const newBlocks = otherSlots.map(s => ({
            blocked_date: selectedDateStr,
            slot_id: s.id,
            status: 'Blocked',
            reason: 'Individual slot blocked'
          }));

          if (newBlocks.length > 0) {
            await supabase
              .from('blocked_slots')
              .insert(newBlocks);
          }
        } else {
          // Just delete the specific blocked slot row
          await supabase
            .from('blocked_slots')
            .delete()
            .eq('blocked_date', selectedDateStr)
            .eq('slot_id', slot.id);
        }
      } else {
        // Block it
        await supabase
          .from('blocked_slots')
          .insert([{
            blocked_date: selectedDateStr,
            slot_id: slot.id,
            status: 'Blocked',
            reason: 'Blocked via admin panel'
          }]);
      }
      await loadMonthData();
    } catch (err) {
      console.error("Error toggling slot:", err);
      alert("Failed to toggle slot. Please try again.");
    }
  };

  const handleBlockEntireDay = async () => {
    try {
      await supabase
        .from('blocked_slots')
        .delete()
        .eq('blocked_date', selectedDateStr);

      await supabase
        .from('blocked_slots')
        .insert([{
          blocked_date: selectedDateStr,
          slot_id: null,
          status: 'Blocked',
          reason: 'Entire day blocked'
        }]);

      await loadMonthData();
    } catch (err) {
      console.error("Error blocking entire day:", err);
      alert("Failed to block entire day.");
    }
  };

  const handleUnblockEntireDay = async () => {
    try {
      await supabase
        .from('blocked_slots')
        .delete()
        .eq('blocked_date', selectedDateStr);

      await loadMonthData();
    } catch (err) {
      console.error("Error unblocking entire day:", err);
      alert("Failed to unblock entire day.");
    }
  };

  const handleBlockPeriod = async (period) => {
    const slot = dbSlots.find(s => s.name === period);
    if (!slot) return;

    try {
      const isAlreadyBlocked = dbBlockedSlots.some(
        bs => bs.blocked_date === selectedDateStr && (bs.slot_id === slot.id || bs.slot_id === null)
      );

      if (!isAlreadyBlocked) {
        await supabase
          .from('blocked_slots')
          .insert([{
            blocked_date: selectedDateStr,
            slot_id: slot.id,
            status: 'Blocked',
            reason: `Blocked ${period} period`
          }]);
        await loadMonthData();
      }
    } catch (err) {
      console.error(`Error blocking ${period}:`, err);
    }
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  const dayCells = [];
  for (let i = 0; i < firstDay; i++) {
    dayCells.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    dayCells.push(new Date(currentYear, currentMonth, i));
  }

  const getDayStatusSummary = (dateStr) => {
    const list = getSlotsForDate(dateStr, dbBookings, dbBlockedSlots, dbSlots);
    const statuses = Object.values(list);

    const isAllBlocked = statuses.every(s => s === 'Blocked');
    const hasBookings = statuses.some(s => s === 'Booked');
    const hasBlocked = statuses.some(s => s === 'Blocked');

    return { isAllBlocked, hasBookings, hasBlocked };
  };

  const slotItems = [
    { id: 'morning', label: 'Morning Slot', time: '8 AM - 12 PM', icon: Sun, colorClass: 'text-amber-500 bg-amber-500/10' },
    { id: 'afternoon', label: 'Afternoon Slot', time: '12 PM - 3 PM', icon: Sunset, colorClass: 'text-orange-500 bg-orange-500/10' },
    { id: 'evening', label: 'Evening Slot', time: '3 PM - 6 PM', icon: Sunset, colorClass: 'text-indigo-500 bg-indigo-500/10' },
    { id: 'night', label: 'Night Slot', time: '6 PM - 10 PM', icon: Moon, colorClass: 'text-purple-500 bg-purple-500/10' }
  ];


  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 text-left w-full max-w-full min-w-0">
        


        {/* 2-Column grid calendar / Slot settings */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Block (6 columns): Calendar */}
          <div className="lg:col-span-6 w-full h-full bg-[#FCFAF6] border border-[#1A0638]/10 rounded-3xl p-5 shadow-xs flex flex-col gap-4 relative overflow-hidden">
            
            {/* Calendar Controls Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.2em] flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4" /> Selected Month
              </span>
              
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  disabled={isPrevMonthDisabled}
                  className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <h3 className="font-display font-bold text-slate-800 text-base">
                  {months[currentMonth]} {currentYear}
                </h3>
                
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days of Week Headers */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {daysOfWeek.map((day) => (
                <span key={day} className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-1">
                  {day.substring(0, 2)}
                </span>
              ))}
            </div>

            {/* Days of Month Grid */}
            <div className="grid grid-cols-7 auto-rows-fr gap-1.5 text-center flex-1 items-center">
              {dayCells.map((date, idx) => {
                if (!date) {
                  return <div key={`empty-${idx}`} className="w-9 h-9 sm:w-10 sm:h-10 mx-auto" />;
                }
                
                const dateStr = formatLocalDate(date);
                const isSelected = selectedDateStr === dateStr;
                const isPast = isPastDate(date);
                const isToday = new Date().toDateString() === date.toDateString();
                
                return (
                  <button
                    key={`day-${idx}`}
                    type="button"
                    disabled={isPast}
                    onClick={() => handleDateClick(date)}
                    className={`w-9 h-9 sm:w-10 sm:h-10 mx-auto rounded-full flex items-center justify-center text-xs font-semibold transition-all relative ${
                      isSelected
                        ? 'bg-[#1A0638] text-white shadow-md font-bold cursor-pointer'
                        : isPast
                        ? 'text-slate-300 cursor-not-allowed pointer-events-none'
                        : isToday
                        ? 'border border-[#1A0638] text-[#1A0638] hover:bg-slate-100 cursor-pointer'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 cursor-pointer'
                    }`}
                  >
                    {date.getDate()}
                    {isToday && !isSelected && (
                      <span className="absolute bottom-1 w-1 h-1 bg-[#1A0638] rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

          </div>

          {/* Right Block (6 columns): Slots list & Block actions */}
          <div className="lg:col-span-6 flex flex-col gap-5 h-full">
            
            {/* Slot Details Card */}
            <div className="bg-[#FCFAF6] border border-[#1A0638]/10 rounded-3xl p-5 shadow-xs text-left relative overflow-hidden h-full flex flex-col">
              <div className="border-b border-[#1A0638]/10 pb-2.5 mb-4 flex justify-between items-center z-10 relative">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] text-[#D4AF37] font-bold uppercase tracking-wider">Selected Date Schedules</span>
                  <h3 className="font-display font-bold text-sm text-[#1A0638]">{selectedDate?.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}</h3>
                </div>
              </div>

              {/* Slot Toggles list */}
              <div className="flex flex-col gap-3 flex-1">
                {slotItems.map((item) => {
                  const status = slots[item.id] || 'Available';
                  const SlotIcon = item.icon;

                  let badgeColor = '';
                  let actionText = '';
                  let actionIcon = null;

                  if (status === 'Booked') {
                    badgeColor = 'bg-purple-500 text-white font-bold border border-purple-500';
                    actionText = 'Booked';
                  } else if (status === 'Blocked') {
                    badgeColor = 'bg-rose-50 text-rose-500 border border-rose-200';
                    actionText = 'Blocked';
                    actionIcon = <Unlock className="w-3.5 h-3.5 text-rose-500" />;
                  } else {
                    badgeColor = 'bg-emerald-50 text-emerald-600 border border-emerald-200';
                    actionText = 'Available';
                    actionIcon = <Lock className="w-3.5 h-3.5 text-emerald-600" />;
                  }

                  return (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl border border-[#2B124C]/5 bg-white shadow-xs flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center ${item.colorClass}`}>
                          <SlotIcon className="w-4.5 h-4.5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-[#1A0638]">{item.label}</span>
                          <span className="text-[10px] text-slate-500">{item.time}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Status Label badge */}
                        <span className={`text-[9px] uppercase font-bold tracking-wider py-1 px-2.5 rounded-full ${badgeColor}`}>
                          {actionText}
                        </span>

                        {/* Lock/Unlock Toggle trigger */}
                        {status !== 'Booked' && (
                          <button
                            onClick={() => handleToggleSlot(item.id, status)}
                            title={status === 'Blocked' ? 'Unblock this slot' : 'Block this slot'}
                            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 transition-colors cursor-pointer text-[#1A0638]"
                          >
                            {actionIcon}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Day Quick Controls Panel */}
              <div className="mt-6 pt-5 border-t border-[#1A0638]/10 flex flex-col gap-2.5 z-10 relative">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Global Day Operations
                </span>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleBlockEntireDay}
                    className="py-2.5 px-3 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100/50 text-rose-600 font-bold text-[10px] tracking-wider uppercase transition-colors cursor-pointer text-center"
                  >
                    Block Entire Day
                  </button>
                  <button
                    onClick={handleUnblockEntireDay}
                    className="py-2.5 px-3 rounded-xl border border-[#1A0638]/10 bg-white hover:bg-[#1A0638]/5 text-[#1A0638] font-bold text-[10px] tracking-wider uppercase transition-colors cursor-pointer text-center"
                  >
                    Unblock Entire Day
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mt-1">
                  <button
                    onClick={() => handleBlockPeriod('morning')}
                    className="py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[9px] font-bold uppercase tracking-wider text-[#1A0638] cursor-pointer text-center"
                  >
                    Block Mornings
                  </button>
                  <button
                    onClick={() => handleBlockPeriod('afternoon')}
                    className="py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[9px] font-bold uppercase tracking-wider text-[#1A0638] cursor-pointer text-center"
                  >
                    Block Afternoons
                  </button>
                  <button
                    onClick={() => handleBlockPeriod('evening')}
                    className="py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[9px] font-bold uppercase tracking-wider text-[#1A0638] cursor-pointer text-center"
                  >
                    Block Evenings
                  </button>
                  <button
                    onClick={() => handleBlockPeriod('night')}
                    className="py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[9px] font-bold uppercase tracking-wider text-[#1A0638] cursor-pointer text-center"
                  >
                    Block Nights
                  </button>
                </div>
              </div>

            </div>



          </div>

        </div>

      </div>
    </AdminLayout>
  );
};

export default Slots;
