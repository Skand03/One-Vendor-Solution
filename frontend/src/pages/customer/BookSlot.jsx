import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { setMetaTags, setSchemaMarkup, getOrganizationSchema, getBreadcrumbSchema } from '../../utils/seo';
import api from '../../services/api';

const BookSlot = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Dynamic Route States
  const initialCategoryId = location.state?.initialCategoryId || '';
  const initialServiceId = location.state?.initialServiceId || '';

  // Core Data States
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    preferredDate: '',
    timeSlot: 'MORNING_10_TO_12', // Matches TimeSlot enum in backend
    message: '',
    categoryId: initialCategoryId,
    serviceId: initialServiceId
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMetaTags(
      'Book a Service Slot — One Vendor Solutions',
      'Schedule a personalized B2B sourcing consultation or site inspection with One Vendor Solutions. Choose category, service, date and time — serving PAN India.',
      '/og-image.jpg',
      'website',
      {
        keywords: 'book procurement slot, site inspection booking, B2B consultation India, One Vendor Solutions booking',
      }
    );
    setSchemaMarkup(
      {
        '@context': 'https://schema.org',
        '@graph': [
          getBreadcrumbSchema([
            { name: 'Home',       path: '/' },
            { name: 'Book Slot',  path: '/book-slot' },
          ]),
          {
            '@type': 'ReservationPackage',
            name: 'Book a Procurement Service Slot',
            description: 'Schedule a site inspection or B2B sourcing consultation with One Vendor Solutions.',
            provider: { '@id': 'https://www.onevendorsolutions.com/#organization' },
            url: 'https://www.onevendorsolutions.com/book-slot',
          },
        ],
      },
      'ld-json-bookslot'
    );

    // Fetch categories on load
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch services when category changes
  useEffect(() => {
    if (!formData.categoryId) {
      setServices([]);
      return;
    }
    
    const fetchServices = async () => {
      setLoadingServices(true);
      try {
        const res = await api.get(`/services?categoryId=${formData.categoryId}`);
        setServices(res.data);
        // Clear or set default service if previous selection is invalid
        if (!res.data.find(s => s.id === parseInt(formData.serviceId))) {
          setFormData(prev => ({ ...prev, serviceId: res.data[0]?.id || '' }));
        }
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, [formData.categoryId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.categoryId || !formData.serviceId) {
      alert('Please select both a Category and Service.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        categoryId: parseInt(formData.categoryId),
        serviceId: parseInt(formData.serviceId)
      };

      const res = await api.post('/bookings', payload);
      // Retrieve names to pass to confirmation page
      const categoryName = categories.find(c => c.id === payload.categoryId)?.name || '';
      const serviceName = services.find(s => s.id === payload.serviceId)?.name || '';

      navigate('/confirmation', { 
        state: { 
          booking: res.data, 
          categoryName, 
          serviceName 
        } 
      });
    } catch (err) {
      console.error('Error creating booking:', err);
      alert('There was a problem confirming your booking. Please check the details and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Time slot options matching Backend TimeSlot enum
  const timeSlots = [
    { value: 'MORNING_10_TO_12', label: 'Morning (10:00 AM - 12:00 PM)' },
    { value: 'AFTERNOON_12_TO_3', label: 'Early Afternoon (12:00 PM - 03:00 PM)' },
    { value: 'AFTERNOON_3_TO_6', label: 'Late Afternoon (03:00 PM - 06:00 PM)' },
    { value: 'EVENING_6_TO_8', label: 'Evening (06:00 PM - 08:00 PM)' }
  ];

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface">
      <Navbar />

      <main className="max-w-container-max mx-auto px-gutter pt-32 pb-xl">
        <div className="mb-lg text-center md:text-left space-y-3">
          <h1 className="text-4xl font-poppins font-extrabold text-primary">Book a Service Slot</h1>
          <p className="text-body-lg text-on-surface-variant max-w-2xl text-sm">
            Schedule a certified sourcing site inspection, product design meeting, or B2B consultancy session.
          </p>
          <div className="w-24 h-1 bg-gold-accent mt-3 rounded-full mx-auto md:mx-0"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Booking Form */}
          <div className="lg:col-span-8 bg-white p-8 rounded-2xl shadow-xl border border-outline-variant/20 relative">
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="font-poppins font-bold text-lg text-primary border-b pb-2">1. Booking Particulars</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Select Category</label>
                  <select 
                    name="categoryId"
                    required
                    value={formData.categoryId}
                    onChange={handleChange}
                    className="w-full rounded-lg border-outline-variant focus:border-gold-accent focus:ring-1 focus:ring-gold-accent p-3 text-body-md"
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Select Service</label>
                  <select 
                    name="serviceId"
                    required
                    disabled={!formData.categoryId || loadingServices}
                    value={formData.serviceId}
                    onChange={handleChange}
                    className="w-full rounded-lg border-outline-variant focus:border-gold-accent focus:ring-1 focus:ring-gold-accent p-3 text-body-md bg-white disabled:opacity-50"
                  >
                    <option value="">{loadingServices ? 'Loading services...' : 'Select Service'}</option>
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Preferred Date</label>
                  <input 
                    type="date"
                    name="preferredDate"
                    required
                    min={new Date().toISOString().split('T')[0]} // Can't book past dates
                    value={formData.preferredDate}
                    onChange={handleChange}
                    className="w-full rounded-lg border-outline-variant focus:border-gold-accent focus:ring-1 focus:ring-gold-accent p-3 text-body-md"
                  />
                </div>
                
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Preferred Time Slot</label>
                  <select 
                    name="timeSlot"
                    required
                    value={formData.timeSlot}
                    onChange={handleChange}
                    className="w-full rounded-lg border-outline-variant focus:border-gold-accent focus:ring-1 focus:ring-gold-accent p-3 text-body-md"
                  >
                    {timeSlots.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <h3 className="font-poppins font-bold text-lg text-primary border-b pb-2 pt-4">2. Contact &amp; Site Address</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Full Name</label>
                  <input 
                    type="text"
                    name="fullName"
                    required
                    placeholder="Enter your name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full rounded-lg border-outline-variant focus:border-gold-accent focus:ring-1 focus:ring-gold-accent p-3 text-body-md"
                  />
                </div>
                
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Phone Number</label>
                  <input 
                    type="tel"
                    name="phone"
                    required
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-lg border-outline-variant focus:border-gold-accent focus:ring-1 focus:ring-gold-accent p-3 text-body-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Email Address</label>
                  <input 
                    type="email"
                    name="email"
                    required
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-lg border-outline-variant focus:border-gold-accent focus:ring-1 focus:ring-gold-accent p-3 text-body-md"
                  />
                </div>
                
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Site Delivery Address</label>
                  <input 
                    type="text"
                    name="address"
                    required
                    placeholder="Street, City, Pin Code"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full rounded-lg border-outline-variant focus:border-gold-accent focus:ring-1 focus:ring-gold-accent p-3 text-body-md"
                  />
                </div>

                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Custom Notes / Sourcing Requirements</label>
                  <textarea 
                    name="message"
                    rows="3"
                    placeholder="Specify dimensions, colors, quantity requirements, etc."
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full rounded-lg border-outline-variant focus:border-gold-accent focus:ring-1 focus:ring-gold-accent p-3 text-body-md"
                  ></textarea>
                </div>
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className="w-full bg-gold-accent hover:bg-[#c5a02e] text-primary font-bold py-4 rounded-lg shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                    Confirming Booking...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">event_available</span>
                    Confirm and Book Slot
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Sourcing Info Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-primary text-white rounded-2xl p-6 shadow-lg border-b-4 border-gold-accent relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <span className="material-symbols-outlined text-[120px]">verified_user</span>
              </div>
              <h4 className="font-poppins font-bold text-lg mb-4 text-gold-accent">The OVS Guarantee</h4>
              <ul className="space-y-4 text-xs leading-relaxed text-surface-variant">
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-gold-accent text-[16px]">check_circle</span>
                  <span><strong>Turnkey Delivery:</strong> Consolidated sourcing means one team handles site audit, installation, and cleanup.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-gold-accent text-[16px]">check_circle</span>
                  <span><strong>Direct Cost Benefit:</strong> Consolidated billing allows up to 15% wholesale discount margins.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-gold-accent text-[16px]">check_circle</span>
                  <span><strong>Pre-Vetted Supply Chain:</strong> All raw timber, tiles, paint, and lab kits meet stringent IS/ISO quality guidelines.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-outline-variant/30 text-center space-y-4">
              <div className="w-12 h-12 bg-primary-container text-gold-accent rounded-full flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined">headset_mic</span>
              </div>
              <h5 className="font-poppins font-bold text-primary text-sm">Need Direct Sourcing?</h5>
              <p className="text-xs text-on-surface-variant leading-relaxed">Rather speak directly to our founder? Tap below to start a WhatsApp dialogue immediately.</p>
              <a 
                href="https://wa.me/918576084127?text=Hello%20Ujjwal" 
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-lg font-bold text-xs hover:bg-[#20ba5a] transition-all shadow"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.417-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.305 1.652zm6.599-3.835c1.516.899 3.3 1.374 5.24 1.375 5.405 0 9.803-4.397 9.805-9.805.001-2.618-1.02-5.08-2.871-6.932-1.851-1.852-4.314-2.872-6.931-2.872-5.405 0-9.803 4.398-9.806 9.806 0 2.077.52 4.108 1.503 5.9l-.99 3.616 3.699-.971zm11.367-5.115c-.314-.157-1.859-.918-2.148-1.023-.288-.105-.499-.157-.709.157-.21.314-.813 1.023-.996 1.232-.183.21-.367.236-.681.079-.314-.157-1.325-.488-2.525-1.558-.933-.832-1.563-1.86-1.747-2.174-.183-.314-.02-.485.137-.642.142-.141.314-.367.471-.55.157-.184.21-.314.314-.524.105-.21.053-.393-.026-.55-.079-.157-.709-1.705-.971-2.334-.255-.612-.513-.529-.709-.538-.182-.008-.393-.01-.603-.01-.21 0-.551.079-.839.393s-1.101 1.075-1.101 2.622c0 1.547 1.127 3.044 1.284 3.254.157.21 2.217 3.386 5.371 4.748.75.324 1.335.518 1.791.663.753.239 1.438.205 1.98.124.605-.09 1.859-.76 2.121-1.496.262-.736.262-1.364.183-1.496-.079-.131-.288-.21-.603-.367z"></path>
                </svg>
                WhatsApp Direct Chat
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookSlot;
