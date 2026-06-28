// Mock data utility to manage state using localStorage for the Astrology Booking System
// This ensures that the Admin Dashboard is fully dynamic and changes persist across refreshes.

const DEFAULT_SERVICES = [
  {
    id: 'life-prediction',
    title: 'Life Prediction',
    price: 190,
    duration: '60 Mins',
    description: 'Unveil your future path with accurate horoscope analysis, helping you prepare for opportunities and challenges ahead.',
  },
  {
    id: 'career-breakthrough',
    title: 'Career & Business Breakthrough',
    price: 250,
    duration: '90 Mins',
    description: 'Unlock professional success, overcome financial hurdles, and achieve massive breakthroughs in your business journey.',
  },
  {
    id: 'marriage-counselling',
    title: 'Marriage Counselling',
    price: 180,
    duration: '60 Mins',
    description: 'Comprehensive support for marital harmony and resolving deep-rooted relationship conflicts.',
  },
  {
    id: 'numerology-consultation',
    title: 'Numerology Consultation',
    price: 120,
    duration: '45 Mins',
    description: 'Suggesting powerful and auspicious names for your child based on the unique vibrations of their birth chart.',
  },
  {
    id: 'vaastu-consultation',
    title: 'Vaastu Consultation',
    price: 220,
    duration: '90 Mins',
    description: 'Vedic Vaastu analysis to attract prosperity and peace. Specialized services for Delhi-based clients.',
  },
  {
    id: 'legal-consultation',
    title: 'Legal Consultation',
    price: 200,
    duration: '60 Mins',
    description: 'Spiritual and astrological guidance for complex legal matters. Includes 1-personal or Zoom meetings.',
  }
];

const DEFAULT_BOOKINGS = [
  {
    id: 'BK-7890',
    clientName: 'Rahul Sharma',
    phone: '+91 98765 43210',
    email: 'rahul.sharma@example.com',
    service: { id: 'life-prediction-general-online', title: 'Life Prediction - General (Online)', price: 5100 },
    date: '2026-06-26',
    time: 'Morning (8 AM - 12 PM)',
    birthDate: '1992-08-14',
    birthTime: '08:45 AM',
    birthPlace: 'Delhi, India',
    gender: 'Male',
    paymentStatus: 'Paid',
    bookingStatus: 'Confirmed',
    paymentId: 'pay_Nj8s9d7Hds82h',
    bookingDate: '2026-06-24',
    notes: 'Concerned about upcoming Saturn transit and job transition opportunities.'
  },
  {
    id: 'BK-7891',
    clientName: 'Priya Patel',
    phone: '+91 91234 56789',
    email: 'priya.patel@example.com',
    service: { id: 'marriage-counselling-package', title: 'Marriage Counselling Package', price: 100000 },
    date: '2026-06-26',
    time: 'Afternoon (12 PM - 3 PM)',
    birthDate: '1995-11-23',
    birthTime: '04:15 PM',
    birthPlace: 'Mumbai, India',
    gender: 'Female',
    paymentStatus: 'Paid',
    bookingStatus: 'Pending',
    paymentId: 'pay_Kj7s2h8Gds39f',
    bookingDate: '2026-06-25',
    notes: 'Matching kundlis for marriage proposals. Seeking insights on compatibility.'
  },
  {
    id: 'BK-7892',
    clientName: 'Amit Verma',
    phone: '+91 88888 77777',
    email: 'amit.verma@example.com',
    service: { id: 'career-breakthrough-detailed', title: 'Career & Business Breakthrough - Detailed', price: 21000 },
    date: '2026-06-27',
    time: 'Evening (3 PM - 6 PM)',
    birthDate: '1988-04-05',
    birthTime: '11:30 PM',
    birthPlace: 'Bangalore, India',
    gender: 'Male',
    paymentStatus: 'Paid',
    bookingStatus: 'Confirmed',
    paymentId: 'pay_Hs8d2k8Djs72a',
    bookingDate: '2026-06-25',
    notes: 'Astrological analysis for business expansion and timing of partnership launching.'
  },
  {
    id: 'BK-7893',
    clientName: 'Anjali Gupta',
    phone: '+91 99999 88888',
    email: 'anjali.g@example.com',
    service: { id: 'numerology-consultation-child-name', title: 'Child Name Numerology', price: 31000 },
    date: '2026-06-25',
    time: 'Night (6 PM - 10 PM)',
    birthDate: '2026-06-10',
    birthTime: '02:08 AM',
    birthPlace: 'Pune, India',
    gender: 'Female',
    paymentStatus: 'Paid',
    bookingStatus: 'Completed',
    paymentId: 'pay_Ms9d2j8Dhs92h',
    bookingDate: '2026-06-12',
    notes: 'Newborn name consultation. Letters starting with R or S.'
  },
  {
    id: 'BK-7894',
    clientName: 'Sanjay Dutt',
    phone: '+91 77777 66666',
    email: 'sanjay.dutt@example.com',
    service: { id: 'vaastu-consultation-vedic-vaastu', title: 'Vedic Vaastu Consultation', price: 51000 },
    date: '2026-06-28',
    time: 'Afternoon (12 PM - 3 PM)',
    birthDate: '1976-12-12',
    birthTime: '06:00 AM',
    birthPlace: 'Jaipur, India',
    gender: 'Male',
    paymentStatus: 'Pending',
    bookingStatus: 'Pending',
    paymentId: 'N/A',
    bookingDate: '2026-06-25',
    notes: 'Commercial shop layout planning as per Vaastu principles.'
  },
  {
    id: 'BK-7895',
    clientName: 'Karan Johar',
    phone: '+91 95555 44444',
    email: 'karan.j@example.com',
    service: { id: 'legal-consultation-astrological-guidance', title: 'Legal Astrological Guidance', price: 51000 },
    date: '2026-06-20',
    time: 'Morning (8 AM - 12 PM)',
    birthDate: '1982-05-25',
    birthTime: '09:00 AM',
    birthPlace: 'Kolkata, India',
    gender: 'Male',
    paymentStatus: 'Paid',
    bookingStatus: 'Completed',
    paymentId: 'pay_Ls8a7d2Jds93f',
    bookingDate: '2026-06-15',
    notes: 'Property dispute guidance. Seeking timing of judicial relief.'
  },
  {
    id: 'BK-7896',
    clientName: 'Meera Sen',
    phone: '+91 94444 33333',
    email: 'meera.sen@example.com',
    service: { id: 'life-prediction-urgent-online', title: 'Life Prediction - Urgent (Online)', price: 11000 },
    date: '2026-06-29',
    time: 'Night (6 PM - 10 PM)',
    birthDate: '1990-01-08',
    birthTime: '12:45 PM',
    birthPlace: 'Chennai, India',
    gender: 'Female',
    paymentStatus: 'Paid',
    bookingStatus: 'Confirmed',
    paymentId: 'pay_Ps7d8k9Fjd82e',
    bookingDate: '2026-06-25',
    notes: 'Urgent family health issues consultation.'
  }
];

// Initialize localStorage if empty
const initStorage = () => {
  if (!localStorage.getItem('astro_services')) {
    localStorage.setItem('astro_services', JSON.stringify(DEFAULT_SERVICES));
  }
  if (!localStorage.getItem('astro_bookings')) {
    localStorage.setItem('astro_bookings', JSON.stringify(DEFAULT_BOOKINGS));
  }
  if (!localStorage.getItem('astro_slots_config')) {
    // Seed some blocked slots on dates: 2026-06-26 morning, 2026-06-27 night, 2026-06-28 entire day
    const initialSlots = {
      '2026-06-26': {
        morning: 'Blocked',
        afternoon: 'Booked', // Matches Rahul and Priya bookings on this day
        evening: 'Available',
        night: 'Available'
      },
      '2026-06-27': {
        morning: 'Available',
        afternoon: 'Available',
        evening: 'Booked', // Matches Amit Verma booking
        night: 'Blocked'
      },
      '2026-06-28': {
        morning: 'Blocked',
        afternoon: 'Blocked',
        evening: 'Blocked',
        night: 'Blocked'
      }
    };
    localStorage.setItem('astro_slots_config', JSON.stringify(initialSlots));
  }
};

// Execute initialization
initStorage();

export const mockData = {
  formatLocalDate: (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },
  // Services
  getServices: () => {
    return JSON.parse(localStorage.getItem('astro_services')) || DEFAULT_SERVICES;
  },
  saveService: (service) => {
    const services = mockData.getServices();
    if (service.id) {
      const idx = services.findIndex(s => s.id === service.id);
      if (idx !== -1) {
        services[idx] = service;
      } else {
        services.push(service);
      }
    } else {
      service.id = 'service-' + Date.now();
      services.push(service);
    }
    localStorage.setItem('astro_services', JSON.stringify(services));
    return service;
  },
  deleteService: (id) => {
    const services = mockData.getServices();
    const filtered = services.filter(s => s.id !== id);
    localStorage.setItem('astro_services', JSON.stringify(filtered));
  },

  // Bookings
  getBookings: () => {
    return JSON.parse(localStorage.getItem('astro_bookings')) || DEFAULT_BOOKINGS;
  },
  saveBooking: (booking) => {
    const bookings = mockData.getBookings();
    if (booking.id) {
      const idx = bookings.findIndex(b => b.id === booking.id);
      if (idx !== -1) {
        bookings[idx] = { ...bookings[idx], ...booking };
      } else {
        bookings.push(booking);
      }
    } else {
      booking.id = 'BK-' + Math.floor(1000 + Math.random() * 9000);
      booking.bookingDate = mockData.formatLocalDate(new Date());
      bookings.push(booking);
    }
    localStorage.setItem('astro_bookings', JSON.stringify(bookings));

    // Also update slot configuration if slot was booked
    if (booking.date && booking.time && booking.bookingStatus === 'Confirmed') {
      const slotType = booking.time.split(' ')[0].toLowerCase(); // morning, afternoon, etc.
      mockData.setSlotStatus(booking.date, slotType, 'Booked');
    }

    return booking;
  },
  updateBookingStatus: (id, status) => {
    const bookings = mockData.getBookings();
    const idx = bookings.findIndex(b => b.id === id);
    if (idx !== -1) {
      bookings[idx].bookingStatus = status;
      localStorage.setItem('astro_bookings', JSON.stringify(bookings));
      
      // Update slots config as well
      const b = bookings[idx];
      const slotType = b.time.split(' ')[0].toLowerCase();
      if (status === 'Cancelled') {
        // Free the slot
        mockData.setSlotStatus(b.date, slotType, 'Available');
      } else if (status === 'Confirmed') {
        mockData.setSlotStatus(b.date, slotType, 'Booked');
      }
      return bookings[idx];
    }
    return null;
  },
  deleteBooking: (id) => {
    const bookings = mockData.getBookings();
    const filtered = bookings.filter(b => b.id !== id);
    localStorage.setItem('astro_bookings', JSON.stringify(filtered));
  },

  // Slots & Calendar
  getSlotsConfig: () => {
    return JSON.parse(localStorage.getItem('astro_slots_config')) || {};
  },
  getSlotsForDate: (dateStr) => {
    const configs = mockData.getSlotsConfig();
    const defaults = {
      morning: 'Available',
      afternoon: 'Available',
      evening: 'Available',
      night: 'Available'
    };

    // Overlay active bookings on this date to mark them as Booked dynamically
    const bookings = mockData.getBookings();
    bookings.forEach(b => {
      if (b.date === dateStr && b.bookingStatus !== 'Cancelled') {
        const slotKey = b.time.split(' ')[0].toLowerCase();
        if (defaults[slotKey]) {
          defaults[slotKey] = 'Booked';
        }
      }
    });

    // Merge with any manual blocks/settings saved in slots config
    if (configs[dateStr]) {
      Object.keys(configs[dateStr]).forEach(key => {
        // Manual Blocks override available slots, but Booked slots take top priority
        if (configs[dateStr][key] === 'Blocked' && defaults[key] !== 'Booked') {
          defaults[key] = 'Blocked';
        } else if (configs[dateStr][key] === 'Blocked' && defaults[key] === 'Booked') {
          // Keep as booked
        } else if (configs[dateStr][key] === 'Available' && defaults[key] !== 'Booked') {
          defaults[key] = 'Available';
        }
      });
    }

    return defaults;
  },
  setSlotStatus: (dateStr, slotType, status) => {
    const configs = mockData.getSlotsConfig();
    if (!configs[dateStr]) {
      configs[dateStr] = {};
    }
    configs[dateStr][slotType] = status;
    localStorage.setItem('astro_slots_config', JSON.stringify(configs));
  },
  blockEntireDay: (dateStr) => {
    const configs = mockData.getSlotsConfig();
    configs[dateStr] = {
      morning: 'Blocked',
      afternoon: 'Blocked',
      evening: 'Blocked',
      night: 'Blocked'
    };
    localStorage.setItem('astro_slots_config', JSON.stringify(configs));
  },
  unblockEntireDay: (dateStr) => {
    const configs = mockData.getSlotsConfig();
    configs[dateStr] = {
      morning: 'Available',
      afternoon: 'Available',
      evening: 'Available',
      night: 'Available'
    };
    localStorage.setItem('astro_slots_config', JSON.stringify(configs));
  },

  // Dashboard Stats calculation
  getStats: () => {
    const bookings = mockData.getBookings();
    const todayStr = mockData.formatLocalDate(new Date());

    const totalBookings = bookings.length;
    const todayBookings = bookings.filter(b => b.date === todayStr || b.bookingDate === todayStr).length;
    const upcomingBookings = bookings.filter(b => b.date >= todayStr && b.bookingStatus === 'Confirmed').length;
    
    // Total Unique Clients (by phone number)
    const uniqueClients = new Set(bookings.map(b => b.phone)).size;

    return {
      totalBookings,
      todayBookings,
      upcomingBookings,
      totalClients: uniqueClients
    };
  }
};
