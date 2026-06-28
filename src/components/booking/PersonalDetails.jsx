import React, { useState } from 'react';
import { ChevronLeft, Info } from 'lucide-react';

const PersonalDetails = ({ details, setDetails, onNext, onBack }) => {
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!details.name || !details.name.trim()) {
      newErrors.name = 'Full name is required.';
    } else if (details.name.trim().length < 2) {
      newErrors.name = 'Full name must be at least 2 characters.';
    }

    if (!details.email || !details.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(details.email.trim())) {
        newErrors.email = 'Please enter a valid email address.';
      }
    }

    if (!details.phone || !details.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else {
      const phoneClean = details.phone.replace(/[^0-9+]/g, '');
      const phoneRegex = /^\+?[1-9]\d{9,14}$/;
      if (!phoneRegex.test(phoneClean)) {
        newErrors.phone = 'Please enter a valid phone number (minimum 10 digits).';
      }
    }

    if (!details.birthDate) {
      newErrors.birthDate = 'Date of birth is required.';
    } else {
      const birthDateObj = new Date(details.birthDate);
      const today = new Date();
      if (isNaN(birthDateObj.getTime())) {
        newErrors.birthDate = 'Please enter a valid date of birth.';
      } else if (birthDateObj > today) {
        newErrors.birthDate = 'Date of birth cannot be in the future.';
      }
    }

    if (!details.birthTime) {
      newErrors.birthTime = 'Exact time of birth is required.';
    }

    if (!details.birthPlace || !details.birthPlace.trim()) {
      newErrors.birthPlace = 'Place of birth is required.';
    } else if (details.birthPlace.trim().length < 2) {
      newErrors.birthPlace = 'Birth place must be at least 2 characters.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to first error field
      const firstErrorField = Object.keys(newErrors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    onNext();
  };

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col gap-6" noValidate>

      {/* Info notice about chart calculations */}
      <div className="flex gap-3 bg-indigo-50 border border-indigo-100 p-4 rounded-2xl text-left items-start">
        <Info className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs font-sans font-light text-slate-700 leading-relaxed">
          Your exact <strong>Birth Time</strong> and <strong>Birth Place</strong> are essential to calculate your Ascendant (Lagna) and Moon sign. If you don't know the exact minute, check your birth certificate or provide an approximate window in your details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
        {/* Name */}
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={details.name || ''}
            onChange={handleChange}
            placeholder="Aarav Sharma"
            className={`w-full bg-slate-50 border rounded-2xl py-3 px-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:shadow-md transition-all duration-300 ${
              errors.name 
                ? 'border-rose-500 focus:border-rose-500 bg-rose-50/10' 
                : 'border-slate-200 focus:border-indigo-600'
            }`}
          />
          {errors.name && (
            <span className="text-[10px] text-rose-600 font-medium mt-0.5 px-1">{errors.name}</span>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={details.email || ''}
            onChange={handleChange}
            placeholder="aarav.sharma@gmail.com"
            className={`w-full bg-slate-50 border rounded-2xl py-3 px-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:shadow-md transition-all duration-300 ${
              errors.email 
                ? 'border-rose-500 focus:border-rose-500 bg-rose-50/10' 
                : 'border-slate-200 focus:border-indigo-600'
            }`}
          />
          {errors.email && (
            <span className="text-[10px] text-rose-600 font-medium mt-0.5 px-1">{errors.email}</span>
          )}
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-2">
          <label htmlFor="phone" className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={details.phone || ''}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            className={`w-full bg-slate-50 border rounded-2xl py-3 px-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:shadow-md transition-all duration-300 ${
              errors.phone 
                ? 'border-rose-500 focus:border-rose-500 bg-rose-50/10' 
                : 'border-slate-200 focus:border-indigo-600'
            }`}
          />
          {errors.phone && (
            <span className="text-[10px] text-rose-600 font-medium mt-0.5 px-1">{errors.phone}</span>
          )}
        </div>

        {/* Birth Date */}
        <div className="flex flex-col gap-2">
          <label htmlFor="birthDate" className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            Date of Birth *
          </label>
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            required
            value={details.birthDate || ''}
            onChange={handleChange}
            className={`w-full bg-slate-50 border rounded-2xl py-3 px-4 text-sm text-slate-800 focus:outline-none focus:bg-white focus:shadow-md transition-all duration-300 cursor-pointer ${
              errors.birthDate 
                ? 'border-rose-500 focus:border-rose-500 bg-rose-50/10' 
                : 'border-slate-200 focus:border-indigo-600'
            }`}
          />
          {errors.birthDate && (
            <span className="text-[10px] text-rose-600 font-medium mt-0.5 px-1">{errors.birthDate}</span>
          )}
        </div>

        {/* Birth Time */}
        <div className="flex flex-col gap-2">
          <label htmlFor="birthTime" className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            Exact Time of Birth *
          </label>
          <input
            type="time"
            id="birthTime"
            name="birthTime"
            required
            value={details.birthTime || ''}
            onChange={handleChange}
            className={`w-full bg-slate-50 border rounded-2xl py-3 px-4 text-sm text-slate-800 focus:outline-none focus:bg-white focus:shadow-md transition-all duration-300 cursor-pointer ${
              errors.birthTime 
                ? 'border-rose-500 focus:border-rose-500 bg-rose-50/10' 
                : 'border-slate-200 focus:border-indigo-600'
            }`}
          />
          {errors.birthTime && (
            <span className="text-[10px] text-rose-600 font-medium mt-0.5 px-1">{errors.birthTime}</span>
          )}
        </div>

        {/* Birth Place */}
        <div className="flex flex-col gap-2">
          <label htmlFor="birthPlace" className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            Place of Birth *
          </label>
          <input
            type="text"
            id="birthPlace"
            name="birthPlace"
            required
            value={details.birthPlace || ''}
            onChange={handleChange}
            placeholder="e.g. New Delhi, Delhi, India"
            className={`w-full bg-slate-50 border rounded-2xl py-3 px-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:shadow-md transition-all duration-300 ${
              errors.birthPlace 
                ? 'border-rose-500 focus:border-rose-500 bg-rose-50/10' 
                : 'border-slate-200 focus:border-indigo-600'
            }`}
          />
          {errors.birthPlace && (
            <span className="text-[10px] text-rose-600 font-medium mt-0.5 px-1">{errors.birthPlace}</span>
          )}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between mt-6 border-t border-slate-100 pt-6 gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 py-3 px-2 text-slate-800 text-xs tracking-widest uppercase font-bold transition-all duration-300 cursor-pointer bg-transparent border-0"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          <span>BACK</span>
        </button>
        <button
          type="submit"
          className="flex-grow md:flex-grow-0 py-3.5 px-6 md:px-8 rounded-2xl md:rounded-xl bg-gradient-to-r from-accent-gold to-light-gold text-primary font-bold text-[11px] md:text-xs tracking-widest uppercase shadow-md transition-all duration-300 cursor-pointer flex items-center justify-between md:justify-center gap-2"
        >
          <span className="md:hidden w-4" />
          <span>Continue</span>
          <span className="text-base font-sans leading-none">&rarr;</span>
        </button>
      </div>
    </form>
  );
};

export default PersonalDetails;
