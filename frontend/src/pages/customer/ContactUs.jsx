import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { setMetaTags, setSchemaMarkup, getOrganizationSchema, getContactPageSchema, getBreadcrumbSchema } from '../../utils/seo';
import api from '../../services/api';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    setMetaTags(
      'Contact Us — One Vendor Solutions',
      'Contact One Vendor Solutions for bulk procurement quotes, vendor partnerships, and custom supply chain solutions. Call +91 85760 84127 or email onevendorsolutions@gmail.com.',
      '/og-image.jpg',
      'website',
      {
        keywords: 'contact One Vendor Solutions, bulk procurement enquiry India, One Vendor Solutions phone number, B2B vendor contact Gorakhpur',
      }
    );
    setSchemaMarkup(
      {
        '@context': 'https://schema.org',
        '@graph': [
          getContactPageSchema(),
          getBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Contact Us', path: '/contact' },
          ]),
        ],
      },
      'ld-json-contact'
    );
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      // POST directly to Spring Boot REST API
      await api.post('/contact', formData);
      setStatus('success');
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      console.error('Error saving contact message:', err);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 35 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface">
      <Navbar />

      <main className="flex-grow pt-32 pb-xl px-gutter max-w-container-max mx-auto">
        {/* Header */}
        <div className="mb-xl text-center md:text-left space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-poppins font-extrabold text-4xl text-primary"
          >
            Get in Touch
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl"
          >
            Our procurement specialists are ready to assist your organization with tailored inventory and design solutions. Reach out via the form or contact details below.
          </motion.p>
          <div className="w-24 h-1 bg-gold-accent mt-md rounded-full mx-auto md:mx-0"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Info Side */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="lg:col-span-5 space-y-8"
          >
            <div className="space-y-6">
              <h2 className="font-poppins font-bold text-xl text-primary">Contact Information</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-gold-accent transition-colors">
                    <span className="material-symbols-outlined text-[20px]">location_on</span>
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-gold-accent uppercase tracking-wider text-[11px] font-bold">Address</p>
                    <p className="text-on-surface text-xs mt-0.5">Near water sport complex gorakhpur, Uttar Pradesh, India</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-gold-accent transition-colors">
                    <span className="material-symbols-outlined text-[20px]">call</span>
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-gold-accent uppercase tracking-wider text-[11px] font-bold">Phone</p>
                    <p className="text-on-surface text-xs mt-0.5">+91 85760 84127</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-gold-accent transition-colors">
                    <span className="material-symbols-outlined text-[20px]">mail</span>
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-gold-accent uppercase tracking-wider text-[11px] font-bold">Email</p>
                    <p className="text-on-surface text-xs mt-0.5">onevendorsolutions@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-gold-accent transition-colors">
                    <span className="material-symbols-outlined text-[20px]">schedule</span>
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-gold-accent uppercase tracking-wider text-[11px] font-bold">Business Hours</p>
                    <p className="text-on-surface text-xs mt-0.5">Mon-Sat: 9 AM - 6 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-lg border border-outline-variant/20 h-[300px]">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14241.970221379768!2d83.37311107567083!3d26.76029881881678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39914470876bb2d3%3A0xc3cf338dc9944de3!2sGorakhpur%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                title="Office Location Map"
              ></iframe>
            </div>
          </motion.div>

          {/* Right Form Side */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="lg:col-span-7"
          >
            <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-gold-accent relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                <span className="material-symbols-outlined text-[120px] text-primary">contact_support</span>
              </div>
              
              <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Full Name</label>
                    <input 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full rounded-lg border-outline-variant focus:border-gold-accent focus:ring-1 focus:ring-gold-accent p-3 text-body-md" 
                      placeholder="John Doe" 
                      required 
                      type="text"
                    />
                  </div>
                  <div>
                    <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Email Address</label>
                    <input 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-lg border-outline-variant focus:border-gold-accent focus:ring-1 focus:ring-gold-accent p-3 text-body-md" 
                      placeholder="john@company.com" 
                      required 
                      type="email"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Phone Number</label>
                    <input 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-lg border-outline-variant focus:border-gold-accent focus:ring-1 focus:ring-gold-accent p-3 text-body-md" 
                      placeholder="+91 85760 84127" 
                      type="tel"
                    />
                  </div>
                  <div>
                    <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Subject</label>
                    <select 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full rounded-lg border-outline-variant focus:border-gold-accent focus:ring-1 focus:ring-gold-accent p-3 text-body-md" 
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="quote">Request a Quote</option>
                      <option value="partnership">B2B Partnership</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing Inquiry</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Message</label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full rounded-lg border-outline-variant focus:border-gold-accent focus:ring-1 focus:ring-gold-accent p-3 text-body-md" 
                    placeholder="How can we help your organization today?" 
                    required 
                    rows="4"
                  ></textarea>
                </div>

                {status === 'success' && (
                  <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs font-semibold animate-fadeIn">
                    Your message has been sent successfully! Our team will contact you soon.
                  </div>
                )}

                {status === 'error' && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold animate-fadeIn">
                    Error sending message. Please try again.
                  </div>
                )}
                
                <button 
                  disabled={loading}
                  className="w-full bg-gold-accent hover:bg-[#c5a02e] text-primary font-bold py-4 rounded-lg shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2" 
                  type="submit"
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">send</span>
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactUs;
