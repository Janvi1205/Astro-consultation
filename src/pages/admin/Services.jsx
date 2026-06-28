import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/dashboard/AdminLayout';
import { supabase } from '../../lib/supabase';
import useSEO from '../../hooks/useSEO';
import { 
  FolderHeart, 
  Edit3, 
  Trash2, 
  Plus, 
  Sparkles, 
  Clock, 
  DollarSign, 
  CheckCircle,
  FolderOpen
} from 'lucide-react';

const Services = () => {
  useSEO({
    title: 'Services – Admin | Pradeep Malhotra',
    description: 'Manage consultation services and packages.',
    canonical: '/admin/services',
    noIndex: true,
  });

  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  
  // Form states
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('id, title, price, duration, description, is_active, deleted_at')
        .is('deleted_at', null)
        .order('title', { ascending: true });
      if (data) {
        setServices(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setTitle(service.title);
    setPrice(service.price);
    setDuration(service.duration);
    setDescription(service.description);
  };

  const handleCreateNew = () => {
    setEditingService({ id: '' }); // empty id indicates creating new
    setTitle('');
    setPrice('');
    setDuration('');
    setDescription('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service? It will no longer show in the client booking portal.')) {
      try {
        const { error } = await supabase
          .from('services')
          .update({ deleted_at: new Date().toISOString(), is_active: false })
          .eq('id', id);
        
        if (error) {
          alert('Error deleting service: ' + error.message);
        } else {
          loadServices();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || price <= 0 || !duration) {
      alert('Please fill out all required fields.');
      return;
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const serviceData = {
      title,
      price: Number(price),
      duration,
      description,
      slug,
      is_active: true
    };

    try {
      let error;
      if (editingService.id) {
        const { error: err } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', editingService.id);
        error = err;
      } else {
        const { error: err } = await supabase
          .from('services')
          .insert([serviceData]);
        error = err;
      }

      if (error) {
        alert('Error saving service: ' + error.message);
      } else {
        setEditingService(null);
        loadServices();
        alert('Service details saved successfully!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 text-left">
        
        {/* Page Header */}
        <div className="pb-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <h2 className="font-display font-bold text-xl text-[#FCFAF6]">Consultation Services Manager</h2>
            <p className="text-xs text-[#FCFAF6]/70">Manage consultation listings, set pricing fees, and update session details.</p>
          </div>
          
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F4D06F] text-[#120428] font-bold text-xs uppercase tracking-wider shadow-sm transition-transform duration-300 hover:scale-[1.01] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Service</span>
          </button>
        </div>

        {/* Services Listings Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
              className="bg-white border border-[#1A0638]/5 rounded-3xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all duration-300 relative overflow-hidden"
            >
              {/* Top Row Title & actions */}
              <div className="flex flex-col gap-1.5 text-left">
                <div className="flex items-start justify-between gap-2.5">
                  <h3 className="font-display text-base font-bold text-[#1A0638]">{service.title}</h3>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(service)}
                      title="Edit Service Details"
                      className="p-1.5 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer text-slate-600"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      title="Delete Service"
                      className="p-1.5 rounded-lg border border-slate-100 hover:bg-rose-50 text-rose-500 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                
                <p className="text-[11px] text-slate-500 leading-relaxed min-h-[44px]">
                  {service.description}
                </p>
              </div>

              {/* Price & Duration details row */}
              <div className="mt-4 pt-4 border-t border-[#1A0638]/5 flex items-center justify-between">
                <div className="flex flex-col text-left">
                  <span className="text-[9px] uppercase font-bold text-slate-400">Consultation Fees</span>
                  <span className="text-base font-bold text-[#D4AF37]">₹{service.price.toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-[#1A0638]/65 bg-[#1A0638]/5 py-1 px-2.5 rounded-lg font-semibold">
                  <Clock className="w-3.5 h-3.5 text-[#1A0638]/50" />
                  <span>{service.duration}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Guide Notice */}
        <div className="p-4 bg-purple-550/10 bg-[#1A0638]/5 rounded-3xl flex gap-3 text-xs text-slate-600 leading-relaxed max-w-[600px]">
          <CheckCircle className="w-4.5 h-4.5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
          <p>
            Consultation services managed here will sync dynamically and update parameters inside the client booking system flow immediately.
          </p>
        </div>

      </div>

      {/* ── Edit/Add Service Dialog Modal ── */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-[480px] bg-[#FCFAF6] border border-[#1A0638]/10 shadow-2xl rounded-3xl p-5 sm:p-6 text-left text-[#1A0638]">
            <div className="flex justify-between items-center border-b border-[#1A0638]/5 pb-3 mb-4">
              <h3 className="font-display font-bold text-base text-[#1A0638] flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-[#D4AF37]" />
                {editingService.id ? 'Edit Consultation Service' : 'Add New Consultation Service'}
              </h3>
              <button
                onClick={() => setEditingService(null)}
                className="text-slate-400 hover:text-[#1A0638] text-2xl font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              {/* Title input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-[#1A0638]/75">Service Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Life Prediction"
                  className="w-full bg-white border border-[#1A0638]/10 rounded-xl p-2.5 text-xs text-[#1A0638] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Price & Duration inputs */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-[#1A0638]/75">Fees (INR) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 5100"
                    className="w-full bg-white border border-[#1A0638]/10 rounded-xl p-2.5 text-xs text-[#1A0638] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-[#1A0638]/75">Session Duration *</label>
                  <input
                    type="text"
                    required
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 60 Mins"
                    className="w-full bg-white border border-[#1A0638]/10 rounded-xl p-2.5 text-xs text-[#1A0638] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Description inputs */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-[#1A0638]/75">Service Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Unveil your future path with accurate horoscope analysis..."
                  rows="3"
                  className="w-full bg-white border border-[#1A0638]/10 rounded-xl p-2.5 text-xs text-[#1A0638] focus:outline-none focus:border-[#D4AF37] resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 mt-2 pt-3 border-t border-[#1A0638]/5">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="py-2 px-4 rounded-xl border border-slate-200 hover:border-slate-400 text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="py-2 px-6 rounded-xl bg-[#1A0638] hover:bg-[#120428] text-[#FCFAF6] font-bold text-xs uppercase tracking-wider shadow-sm cursor-pointer"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Services;
