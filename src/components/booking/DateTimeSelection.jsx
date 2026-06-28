import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Sun, Sunset, Moon, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const DateTimeSelection = ({ selectedDate, setSelectedDate, selectedTime, setSelectedTime, onNext, onBack }) => {
  const getSelectedDateStr = () => {
    if (!selectedDate) return '';
    try {
      const dateObj = new Date(selectedDate.fullString);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (err) {
      return '';
    }
  };

  const dateStr = getSelectedDateStr();
  const [daySlots, setDaySlots] = useState({});
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!dateStr) return;
      setLoadingSlots(true);
      try {
        const { data, error } = await supabase.rpc('get_slots_for_date', { check_date: dateStr });
        if (data) {
          const slotMap = {};
          data.forEach(item => {
            slotMap[item.slot_name] = item.status;
          });
          setDaySlots(slotMap);
        } else {
          console.error('Error fetching slots:', error);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [dateStr]);

  // Calendar states
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    // Block going before current month of current year
    const today = new Date();
    if (currentYear === today.getFullYear() && currentMonth === today.getMonth()) {
      return;
    }
    
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

  const isPastDate = (date) => {
    if (!date) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateClick = (date) => {
    if (isPastDate(date)) return;
    
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    setSelectedDate({
      dayName: days[date.getDay()],
      dateNum: date.getDate(),
      monthName: shortMonths[date.getMonth()],
      fullString: date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
    });
    setSelectedTime(''); // Reset timing on date change
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  
  // Calendar grid day objects
  const dayCells = [];
  for (let i = 0; i < firstDay; i++) {
    dayCells.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    dayCells.push(new Date(currentYear, currentMonth, i));
  }

  // Broad slot options defined in mockup request
  const timeSlots = [
    {
      id: 'morning',
      label: 'Morning',
      timeRange: '8 AM - 12 PM',
      displayTime: 'Morning (8 AM - 12 PM)',
      icon: Sun,
      colorClass: 'text-amber-500'
    },
    {
      id: 'afternoon',
      label: 'Afternoon',
      timeRange: '12 PM - 3 PM',
      displayTime: 'Afternoon (12 PM - 3 PM)',
      icon: Sunset,
      colorClass: 'text-orange-500'
    },
    {
      id: 'evening',
      label: 'Evening',
      timeRange: '3 PM - 6 PM',
      displayTime: 'Evening (3 PM - 6 PM)',
      icon: Sunset, 
      colorClass: 'text-indigo-500'
    },
    {
      id: 'night',
      label: 'Night',
      timeRange: '6 PM - 10 PM',
      displayTime: 'Night (6 PM - 10 PM)',
      icon: Moon,
      colorClass: 'text-purple-500'
    }
  ];

  // Check if prev month switching is disabled (cannot choose past months)
  const today = new Date();
  const isPrevMonthDisabled = currentYear === today.getFullYear() && currentMonth === today.getMonth();

  return (
    <div className="flex flex-col gap-6">
      
      {/* 2-Column Responsive Layout for Calendar and Slots */}
      <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
        
        {/* Left Column: Custom Premium Calendar Picker */}
        <div className="w-full lg:w-[48%] flex flex-col gap-4 text-left">
          <label className="text-xs font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-1.5">
            <CalendarIcon className="w-4 h-4 text-slate-500" />
            Select Appointment Date
          </label>
          
          <div className="w-full bg-gradient-to-br from-purple-100/40 via-[#1A0638]/5 to-purple-100/20 border border-purple-300/80 rounded-3xl p-5 shadow-xs md:shadow-sm backdrop-blur-xs">
            {/* Calendar Controls Header */}
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <button
                type="button"
                onClick={handlePrevMonth}
                disabled={isPrevMonthDisabled}
                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <h3 className="font-display font-bold text-slate-800 text-base">
                {months[currentMonth]} {currentYear}
              </h3>
              
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-800 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
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
            <div className="grid grid-cols-7 gap-1.5 text-center">
              {dayCells.map((date, idx) => {
                if (!date) {
                  return <div key={`empty-${idx}`} className="w-full aspect-square" />;
                }
                
                const isSelected = selectedDate?.dateNum === date.getDate() && 
                                   selectedDate?.monthName === date.toLocaleDateString('en-US', { month: 'short' }) &&
                                   currentYear === date.getFullYear();
                const isPast = isPastDate(date);
                const isToday = new Date().toDateString() === date.toDateString();
                
                return (
                  <button
                    key={`day-${idx}`}
                    type="button"
                    disabled={isPast}
                    onClick={() => handleDateClick(date)}
                    className={`w-full aspect-square rounded-full flex items-center justify-center text-xs font-semibold transition-all relative ${
                      isSelected
                        ? 'bg-[#1A0638] text-white shadow-md font-bold'
                        : isPast
                        ? 'text-slate-300 cursor-not-allowed pointer-events-none'
                        : isToday
                        ? 'border border-[#1A0638] text-[#1A0638] hover:bg-slate-100'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
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
        </div>

        {/* Right Column: Available Cosmic Hour Slots */}
        <div className="w-full lg:w-[52%] flex flex-col gap-4 text-left flex-grow">
          <label className="text-xs font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-500" />
            Available Alignment Slots
          </label>
          
          {selectedDate ? (
            loadingSlots ? (
              <div className="w-full flex-grow min-h-[180px] rounded-3xl border border-[#1A0638]/5 bg-[#1A0638]/2 flex flex-col items-center justify-center p-6 text-center text-slate-400 gap-2.5">
                <div className="w-8 h-8 border-4 border-[#1A0638] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-semibold text-slate-500">Checking slot alignments...</span>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-widest block -mb-1">
                  Selected: {selectedDate.fullString}
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {timeSlots.map((slot) => {
                    const SlotIcon = slot.icon;
                    const isSelected = selectedTime === slot.displayTime;
                    const status = daySlots[slot.id] || 'Available';
                    const isUnavailable = status === 'Booked' || status === 'Blocked';
                    
                    return (
                      <div
                        key={slot.id}
                        onClick={() => {
                          if (!isUnavailable) {
                            setSelectedTime(slot.displayTime);
                          }
                        }}
                        className={`group p-5 rounded-3xl border transition-all duration-300 flex flex-col items-center justify-center text-center ${
                          isUnavailable
                            ? 'bg-slate-100/50 border-slate-200 opacity-40 cursor-not-allowed pointer-events-none text-slate-400'
                            : isSelected
                            ? 'border-[#1A0638] bg-[#1A0638] text-white shadow-xl scale-[1.02] cursor-pointer'
                            : 'bg-gradient-to-br from-purple-100/35 via-[#1A0638]/5 to-purple-100/15 border border-purple-200/80 hover:border-purple-400 hover:shadow-md hover:scale-[1.01] text-slate-700 backdrop-blur-xs cursor-pointer'
                        }`}
                      >
                        {/* Round Badge Icon */}
                        <div className={`w-11 h-11 rounded-full flex items-center justify-center mb-3 transition-colors ${
                          isUnavailable
                            ? 'bg-slate-200 text-slate-400'
                            : isSelected 
                            ? 'bg-white/10 text-accent-gold' 
                            : 'bg-white border border-slate-100 shadow-sm ' + slot.colorClass
                        }`}>
                          <SlotIcon className="w-5 h-5" />
                        </div>
                        
                        {/* Name */}
                        <span className={`text-sm font-display font-semibold transition-colors ${
                          isUnavailable ? 'text-slate-400' : isSelected ? 'text-white' : 'text-slate-800'
                        }`}>
                          {slot.label} {isUnavailable && (
                            <span className="text-[10px] font-sans text-rose-550 font-bold ml-1 text-rose-600">
                              ({status === 'Blocked' ? 'Not Available' : status})
                            </span>
                          )}
                        </span>
                        
                        {/* Time Details */}
                        <span className={`text-[10px] font-sans mt-0.5 transition-colors ${
                          isUnavailable ? 'text-slate-350' : isSelected ? 'text-white/70' : 'text-slate-450'
                        }`}>
                          {slot.timeRange}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          ) : (
            <div className="w-full flex-grow min-h-[180px] rounded-3xl border border-dashed border-slate-200 bg-slate-50/30 flex flex-col items-center justify-center p-6 text-center text-slate-400 gap-2.5">
              <CalendarIcon className="w-8 h-8 opacity-45" />
              <span className="text-xs font-medium tracking-wide max-w-[280px]">
                Please select a calendar date on the left to view available cosmic slots.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Navigation Controls */}
      <div className="flex items-center justify-between mt-8 border-t border-slate-100 pt-6 gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 py-3 px-2 text-slate-800 text-xs tracking-widest uppercase font-bold transition-all duration-300 cursor-pointer bg-transparent border-0"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          <span>BACK</span>
        </button>
        <button
          onClick={onNext}
          disabled={!selectedDate || !selectedTime}
          className="flex-grow md:flex-grow-0 py-3.5 px-6 md:px-8 rounded-2xl md:rounded-xl bg-gradient-to-r from-accent-gold to-light-gold text-primary font-bold text-[11px] md:text-xs tracking-widest uppercase shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer flex items-center justify-between md:justify-center gap-2"
        >
          <span className="md:hidden w-4" />
          <span>Continue</span>
          <span className="text-base font-sans leading-none">&rarr;</span>
        </button>
      </div>
    </div>
  );
};

export default DateTimeSelection;
