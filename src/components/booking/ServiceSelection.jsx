import React, { useState, useEffect } from 'react';
import { Briefcase, Heart, Hash, Home, Shield, Compass, Clock, CheckCircle2, Sparkles, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const ServiceSelection = ({ selectedService, setSelectedService, onNext }) => {
  const [detailModalService, setDetailModalService] = useState(null);
  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const serviceIcons = {
    'life-prediction': Compass,
    'career-breakthrough': Briefcase,
    'marriage-counselling': Heart,
    'numerology-consultation': Hash,
    'vaastu-consultation': Home,
    'legal-consultation': Shield
  };

  useEffect(() => {
    const fetchServicesAndPackages = async () => {
      try {
        const { data: servicesData, error: servicesErr } = await supabase
          .from('services')
          .select('id, slug, title, description, is_active, deleted_at')
          .eq('is_active', true)
          .is('deleted_at', null);

        const { data: packagesData, error: packagesErr } = await supabase
          .from('service_packages')
          .select('id, service_id, slug, name, price, duration, description, mode, is_active, deleted_at')
          .eq('is_active', true)
          .is('deleted_at', null);

        if (servicesData) {
          const list = servicesData.map(s => ({
            ...s,
            icon: serviceIcons[s.slug] || Compass
          }));
          setServices(list);
        }
        if (packagesData) {
          setPackages(packagesData);
        }
      } catch (err) {
        console.error('Error fetching services and packages from Supabase:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServicesAndPackages();
  }, []);

  const currentPackages = detailModalService
    ? packages.filter(p => p.service_id === detailModalService.id)
    : [];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-slate-500 gap-3">
        <div className="w-10 h-10 border-4 border-[#1A0638] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-sans">Aligning celestial service parameters...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => {
          const Icon = service.icon;
          const isSelected = selectedService?.service_id === service.id;
          return (
            <div
              key={service.id}
              onClick={() => setDetailModalService(service)}
              className={`group relative p-3.5 md:py-5 md:px-6 rounded-2xl md:rounded-3xl border cursor-pointer transition-all duration-300 flex flex-row md:flex-col items-center md:items-center gap-3.5 md:gap-0 ${
                isSelected
                  ? 'border-[#1A0638] bg-[#1A0638] text-white shadow-xl scale-[1.01]'
                  : 'bg-gradient-to-br from-purple-100/40 via-[#1A0638]/5 to-purple-100/20 border border-purple-300/80 hover:border-purple-400 hover:shadow-lg text-slate-800 backdrop-blur-xs'
              }`}
            >
              {/* Selected Tick Indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3 md:top-4 md:right-4 text-white animate-fade-in">
                  <CheckCircle2 className="w-5 h-5 fill-current text-[#1A0638] stroke-white" />
                </div>
              )}

              {/* Icon Circle */}
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 md:mb-3 shadow-md group-hover:scale-105 transition-transform duration-300 ${
                isSelected ? 'bg-white text-[#1A0638]' : 'bg-[#1A0638] text-accent-gold'
              }`}>
                <Icon className="w-4.5 h-4.5 md:w-5.5 md:h-5.5" />
              </div>

              {/* Card content wrapper */}
              <div className="flex flex-col flex-grow text-left md:text-center md:items-center md:w-full">
                {/* Title */}
                <h3 className={`text-sm md:text-base font-display font-semibold transition-colors duration-300 min-h-0 md:min-h-[38px] flex items-center justify-start md:justify-center ${
                  isSelected ? 'text-accent-gold' : 'text-slate-800 group-hover:text-purple-650'
                }`}>
                  {service.title}
                </h3>

                {/* Description */}
                <p className={`hidden md:block text-xs font-sans font-light leading-relaxed mb-4 flex-grow ${
                  isSelected ? 'text-cream/80' : 'text-slate-500'
                }`}>
                  {service.description}
                </p>

                {/* View Options Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDetailModalService(service);
                  }}
                  className={`w-fit md:w-full py-1.5 md:py-2.5 px-3 md:px-0 rounded-lg md:rounded-xl font-semibold text-[10px] md:text-xs tracking-wider uppercase transition-all duration-300 mt-2 md:mt-auto text-center ${
                    isSelected 
                      ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20' 
                      : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  View Options
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end mt-6 w-full md:w-auto">
        <button
          onClick={onNext}
          disabled={!selectedService}
          className="w-full md:w-auto py-3.5 px-6 md:px-8 rounded-2xl md:rounded-xl bg-gradient-to-r from-accent-gold to-light-gold text-primary font-bold text-[11px] md:text-xs tracking-widest uppercase shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer flex items-center justify-between md:justify-center gap-2"
        >
          <span className="md:hidden w-4" />
          <span>Continue</span>
          <span className="text-base font-sans leading-none">&rarr;</span>
        </button>
      </div>

      {/* Dynamic Detail Modal */}
      {detailModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-[620px] max-h-[85vh] overflow-y-auto bg-white rounded-3xl border border-slate-200 shadow-2xl p-5 md:p-6 flex flex-col gap-4 text-left animate-fade-in text-slate-800">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#1A0638]" />
                <h2 className="text-base md:text-lg font-display font-bold text-[#1A0638]">
                  Consultation Options: {detailModalService.title}
                </h2>
              </div>
              <button 
                type="button"
                onClick={() => setDetailModalService(null)} 
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <p className="text-xs md:text-sm font-sans font-light text-slate-500 leading-relaxed -mt-1">
              {detailModalService.description}
            </p>

            {/* Sub-options List */}
            <div className="flex flex-col gap-3.5 mt-2">
              {currentPackages.length > 0 ? (
                currentPackages.map((pkg) => {
                  const isPkgSelected = selectedService?.id === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${
                        isPkgSelected
                          ? 'border-[#1A0638] bg-[#1A0638]/5 shadow-xs'
                          : 'border-purple-300/50 bg-gradient-to-br from-purple-100/40 via-[#1A0638]/5 to-purple-100/20 hover:shadow-md hover:border-purple-400/90'
                      }`}
                    >
                      <div className="flex gap-3.5 items-start flex-grow text-left">
                        <div className="w-9 h-9 rounded-full bg-purple-50 border border-purple-100/50 flex items-center justify-center flex-shrink-0 text-[#1A0638] mt-0.5">
                          <Sparkles className="w-4.5 h-4.5 text-[#1A0638]" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <h3 className="text-sm font-display font-bold text-[#1A0638]">
                            {pkg.name}
                          </h3>
                          <p className="text-[11px] font-sans font-light text-slate-500 leading-relaxed max-w-[360px]">
                            {pkg.description}
                          </p>
                          {/* Badges/Pills */}
                          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                            <div className="py-1 px-2.5 rounded-full text-[10px] font-semibold text-white bg-[#1A0638] border border-[#1A0638]">
                              Fees: ₹{Number(pkg.price).toLocaleString()}
                            </div>
                            <div className="py-1 px-2.5 rounded-full text-[10px] text-slate-500 bg-slate-50 border border-slate-100 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{pkg.duration}</span>
                            </div>
                            <div className="py-1 px-2.5 rounded-full text-[10px] text-slate-500 bg-slate-50 border border-slate-100 capitalize">
                              <span>{pkg.mode}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex-shrink-0 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedService({
                              id: pkg.id,
                              slug: pkg.slug,
                              title: pkg.name,
                              price: Number(pkg.price),
                              currencySymbol: '₹',
                              duration: pkg.duration,
                              description: pkg.description,
                              service_id: pkg.service_id
                            });
                            setDetailModalService(null);
                          }}
                          className="py-2 px-5 rounded-full bg-[#1A0638] hover:bg-[#2A0A4D] text-white font-bold text-[10px] tracking-wider uppercase shadow-xs hover:shadow-md hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs italic">
                  No packages currently configured for this service.
                </div>
              )}
            </div>

            {/* Close CTA */}
            <div className="flex justify-end mt-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDetailModalService(null)}
                className="py-2 px-5 rounded-xl border border-slate-200 hover:border-slate-400 text-slate-500 hover:text-slate-800 text-[10px] tracking-wider uppercase font-semibold transition-all duration-300 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceSelection;
