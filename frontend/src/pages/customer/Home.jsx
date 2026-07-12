import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../services/api';
import { setMetaTags } from '../../utils/seo';

const Home = () => {
  const navigate = useNavigate();
  
  // Data States
  const [categories, setCategories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [settings, setSettings] = useState(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Form States
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    categoryId: '',
    serviceId: '', // Default placeholder service
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch Data on Load
  useEffect(() => {
    setMetaTags(
      'Home',
      'One Vendor Solutions is the premier B2B procurement platform for School, Office, and Home bulk essentials. Streamline your supply chain with a single, trusted partner.'
    );

    const loadData = async () => {
      try {
        const [catsRes, projRes, testRes, settRes] = await Promise.all([
          api.get('/categories'),
          api.get('/projects'),
          api.get('/testimonials'),
          api.get('/settings')
        ]);
        setCategories(catsRes.data);
        setProjects(projRes.data);
        setTestimonials(testRes.data);
        setSettings(settRes.data);
      } catch (err) {
        console.error('Error fetching home data:', err);
      }
    };
    loadData();
  }, []);

  // Handle Enquiry Submit
  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.categoryId) {
      alert('Please fill out all required fields.');
      return;
    }
    
    setSubmitting(true);
    try {
      // Find the first service matching the chosen category to satisfy backend schema
      const categoryId = parseInt(formData.categoryId);
      const servicesRes = await api.get(`/services?categoryId=${categoryId}`);
      const matchingService = servicesRes.data[0];

      if (!matchingService) {
        throw new Error('No services available for this category.');
      }

      const payload = {
        fullName: formData.fullName,
        phone: formData.phone,
        email: 'quick-enquiry@ovs.com', // dummy email for quick booking
        address: 'Quick Web Enquiry Desk',
        preferredDate: new Date().toISOString().split('T')[0], // today's date
        timeSlot: 'ANYTIME',
        message: formData.message || 'Quick Enquiry submitted from homepage Hero card.',
        categoryId: categoryId,
        serviceId: matchingService.id
      };

      await api.post('/bookings', payload);
      setSubmitSuccess(true);
      setFormData({ fullName: '', phone: '', categoryId: '', serviceId: '', message: '' });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      console.error('Error submitting quick enquiry:', err);
      alert('There was a problem submitting your enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Testimonial Carousel Autoplay
  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials]);

  // Framer Motion Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const scaleUp = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  };

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } }
  };

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface">
      <Navbar transparent={true} />

      {/* Luxury Hero Section */}
      <section className="relative pt-32 pb-24 navy-gradient min-h-[90vh] flex items-center overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gold-accent blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary-container blur-[120px]"></div>
        </div>

        <div className="max-w-container-max mx-auto px-gutter relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 text-white space-y-6">
            <motion.h1 
              initial={{ opacity: 0, x: -35 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="font-display-lg text-4xl md:text-5xl lg:text-[54px] leading-tight font-extrabold"
            >
              One Vendor for <span className="text-gold-accent">School, Office &amp; Home</span> Essentials
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="font-body-lg text-body-lg text-surface-variant max-w-xl leading-relaxed"
            >
              Experience premium, unified B2B procurement tailored for modern institutions and enterprises. We consolidate your supply chain by delivering high-grade furniture, interiors, technology setups, and essential services under one reliable brand.
            </motion.p>
            

          </div>

          {/* Hero Right Quick Enquiry Form */}
          <div className="lg:col-span-5">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, type: 'spring', damping: 20 }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-md ml-auto border-t-4 border-gold-accent relative overflow-hidden"
            >
              <h3 className="font-title-lg text-title-lg text-primary font-bold mb-4">Quick Enquiry / Callback</h3>
              <p className="text-on-surface-variant text-xs mb-6">Need bulk pricing or custom setup details? Submit your contact below and our relationship manager will call you back within 2 hours.</p>
              
              {submitSuccess ? (
                <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-6 text-center space-y-3 animate-fadeIn">
                  <span className="material-symbols-outlined text-4xl text-green-600">check_circle</span>
                  <h4 className="font-bold text-body-lg">Thank You!</h4>
                  <p className="text-xs">Your enquiry has been logged successfully. Our specialist will call you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="space-y-4">
                  <div>
                    <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Full Name</label>
                    <input 
                      type="text"
                      required
                      placeholder="Enter your name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="w-full rounded-lg border-outline-variant focus:border-gold-accent focus:ring-1 focus:ring-gold-accent p-3 text-body-md"
                    />
                  </div>
                  <div>
                    <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Contact Number</label>
                    <input 
                      type="tel"
                      required
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full rounded-lg border-outline-variant focus:border-gold-accent focus:ring-1 focus:ring-gold-accent p-3 text-body-md"
                    />
                  </div>
                  <div>
                    <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Requirement Category</label>
                    <select 
                      required
                      value={formData.categoryId}
                      onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                      className="w-full rounded-lg border-outline-variant focus:border-gold-accent focus:ring-1 focus:ring-gold-accent p-3 text-body-md"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Message</label>
                    <textarea 
                      placeholder="Briefly tell us what you need..."
                      rows="2"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full rounded-lg border-outline-variant focus:border-gold-accent focus:ring-1 focus:ring-gold-accent p-3 text-body-md"
                    ></textarea>
                  </div>
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gold-accent hover:bg-[#c5a02e] text-primary font-bold py-4 rounded-lg shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">phone_in_talk</span>
                        Get a Callback
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <section className="h-[25px] bg-gold-accent overflow-hidden flex items-center">
        <div className="flex whitespace-nowrap animate-marquee">
          <span className="text-primary font-poppins font-bold text-sm px-8">School Essentials</span>
          <span className="text-primary font-poppins font-bold text-sm px-8">•</span>
          <span className="text-primary font-poppins font-bold text-sm px-8">Office Requirements</span>
          <span className="text-primary font-poppins font-bold text-sm px-8">•</span>
          <span className="text-primary font-poppins font-bold text-sm px-8">Coaching Classes</span>
          <span className="text-primary font-poppins font-bold text-sm px-8">•</span>
          <span className="text-primary font-poppins font-bold text-sm px-8">Home Services</span>
          <span className="text-primary font-poppins font-bold text-sm px-8">•</span>
          <span className="text-primary font-poppins font-bold text-sm px-8">24 Hours Available</span>
          <span className="text-primary font-poppins font-bold text-sm px-8">•</span>
          <span className="text-primary font-poppins font-bold text-sm px-8">Corporate Procurement</span>
          <span className="text-primary font-poppins font-bold text-sm px-8">•</span>
          <span className="text-primary font-poppins font-bold text-sm px-8">B2B Solutions</span>
          <span className="text-primary font-poppins font-bold text-sm px-8">•</span>
          <span className="text-primary font-poppins font-bold text-sm px-8">School Essentials</span>
          <span className="text-primary font-poppins font-bold text-sm px-8">•</span>
          <span className="text-primary font-poppins font-bold text-sm px-8">Office Requirements</span>
          <span className="text-primary font-poppins font-bold text-sm px-8">•</span>
          <span className="text-primary font-poppins font-bold text-sm px-8">Coaching Classes</span>
          <span className="text-primary font-poppins font-bold text-sm px-8">•</span>
          <span className="text-primary font-poppins font-bold text-sm px-8">Home Services</span>
          <span className="text-primary font-poppins font-bold text-sm px-8">•</span>
          <span className="text-primary font-poppins font-bold text-sm px-8">24 Hours Available</span>
          <span className="text-primary font-poppins font-bold text-sm px-8">•</span>
          <span className="text-primary font-poppins font-bold text-sm px-8">Corporate Procurement</span>
          <span className="text-primary font-poppins font-bold text-sm px-8">•</span>
          <span className="text-primary font-poppins font-bold text-sm px-8">B2B Solutions</span>
        </div>
      </section>

      {/* Company Introduction / Overview */}
      <section className="py-xl bg-surface-container-lowest">
        <div className="max-w-container-max mx-auto px-gutter flex flex-col md:flex-row items-center gap-12">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            className="md:w-1/2 space-y-6"
          >
            <span className="text-gold-accent font-semibold tracking-wider uppercase text-xs">About One Vendor Solutions</span>
            <h2 className="font-headline-lg text-3xl font-bold text-primary leading-tight">Unified Sourcing Designed for Enterprise Excellence</h2>
            <div className="w-20 h-1 bg-gold-accent"></div>
            <p className="text-on-surface-variant leading-relaxed">
              At OVS, we build trust through simplicity. We recognize that coordinating multiple suppliers for school uniforms, office furniture, interior fit-outs, and maintenance services is a heavy operational burden. 
            </p>
            <p className="text-on-surface-variant leading-relaxed">
              Our platform acts as your single point of procurement, offering pre-vetted catalogs, consolidated delivery logistics, and premium post-installation AMCs. We serve top educational chains, BPO complexes, and luxury residential societies across the country.
            </p>
            <Link to="/about" className="inline-flex items-center gap-2 text-gold-accent font-bold hover:gap-3 transition-all pt-2">
              <span>Read Our Full Story</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scaleUp}
            className="md:w-1/2 relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl border-b-4 border-gold-accent">
              <img 
                src="/all-images/Onevendorsolutions/home-page-broucher.png" 
                alt="One Vendor Solutions - Premium B2B Procurement Brochure" 
                className="w-full h-[400px] sm:h-[450px] md:h-[500px] object-cover hover:scale-105 transition-transform duration-500" 
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Specialized Categories / Services Section */}
      <section className="py-xl bg-surface relative" id="categories-section">
        <div className="max-w-container-max mx-auto px-gutter space-y-12">
          <div className="text-center space-y-4">
            <h2 className="font-headline-lg text-3xl font-bold text-primary">Explore Our Procurement Verticals</h2>
            <div className="w-24 h-1 bg-gold-accent mx-auto"></div>
            <p className="text-on-surface-variant max-w-xl mx-auto text-sm">Discover our high-end catalogs tailored for corporate workspaces, schools, academies, and residential structures.</p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {categories.map((cat, idx) => {
              // Map category names to specific images from all-images folder
              let categoryImageUrl = cat.imageUrl;
              const catName = (cat.name || '').toLowerCase();
              if (!categoryImageUrl || categoryImageUrl.includes('unsplash')) {
                if (catName.includes('school')) {
                  categoryImageUrl = '/all-images/Onevendorsolutions/school.jpg';
                } else if (catName.includes('home')) {
                  categoryImageUrl = '/all-images/Onevendorsolutions/home.jpg';
                } else if (catName.includes('office')) {
                  categoryImageUrl = '/all-images/Onevendorsolutions/office-desk.jpg';
                } else if (catName.includes('coaching')) {
                  categoryImageUrl = '/all-images/Onevendorsolutions/projectro-office-school.jpg';
                } else {
                  categoryImageUrl = '/all-images/Onevendorsolutions/projectro-office-school.jpg';
                }
              }
              
              return (
              <motion.div 
                key={cat.id} 
                variants={fadeInUp}
                className="group bg-white rounded-xl shadow-card border-t border-gold-accent/20 hover:border-gold-accent overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-hover"
              >
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src={categoryImageUrl} 
                    alt={cat.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/5 transition-colors"></div>
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2.5 text-gold-accent">
                    <span className="material-symbols-outlined">
                      {idx === 0 ? 'school' : idx === 1 ? 'home_repair_service' : idx === 2 ? 'corporate_fare' : 'import_contacts'}
                    </span>
                    <h4 className="font-title-lg text-primary font-bold">{cat.name}</h4>
                  </div>
                  <p className="text-on-surface-variant text-xs leading-relaxed line-clamp-3">{cat.description}</p>
                  <Link 
                    to={`/catalog/${cat.name.replace(/\s+/g, '-')}`}
                    className="inline-flex items-center gap-2 text-gold-accent font-bold text-xs pt-2 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Browse Services</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>
              </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-xl bg-surface-container-low">
        <div className="max-w-container-max mx-auto px-gutter grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="font-headline-lg text-3xl font-bold text-primary leading-tight">Setting the Gold Standard in Sourcing</h2>
            <p className="text-on-surface-variant text-sm leading-relaxed">We bring institutional discipline, wholesale cost benefits, and transparency to your supply pipeline.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-gold-accent space-y-2">
                <div className="w-10 h-10 bg-primary-container text-gold-accent rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
                </div>
                <h5 className="font-title-lg text-body-md text-primary font-bold">Single Point Sourcing</h5>
                <p className="text-xs text-on-surface-variant">Consolidate uniform contracts, computer setups, and interior renovations under one invoice.</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-gold-accent space-y-2">
                <div className="w-10 h-10 bg-primary-container text-gold-accent rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">percent</span>
                </div>
                <h5 className="font-title-lg text-body-md text-primary font-bold">Direct Wholesale Prices</h5>
                <p className="text-xs text-on-surface-variant">Gain immediate bulk purchasing discounts by leveraging our deep manufacturing network.</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-gold-accent space-y-2">
                <div className="w-10 h-10 bg-primary-container text-gold-accent rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                </div>
                <h5 className="font-title-lg text-body-md text-primary font-bold">Strategic Sourcing</h5>
                <p className="text-xs text-on-surface-variant">Reliable delivery logistics ensuring deadlines are always met for new school sessions or office launches.</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-gold-accent space-y-2">
                <div className="w-10 h-10 bg-primary-container text-gold-accent rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">verified</span>
                </div>
                <h5 className="font-title-lg text-body-md text-primary font-bold">Premium Quality Control</h5>
                <p className="text-xs text-on-surface-variant">All items undergo rigorous QC testing before dispatch to guarantee lifetime durability.</p>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl w-full">
              <video 
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto"
              >
                <source src="/all-images/Onevendorsolutions/The_video_will_be_displayed_in.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gold-accent/5 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      {projects.length > 0 && (
        <section className="py-xl bg-surface-container-lowest">
          <div className="max-w-container-max mx-auto px-gutter space-y-12">
            <div className="text-center space-y-4">
              <h2 className="font-headline-lg text-3xl font-bold text-primary">Featured Client Installations</h2>
              <div className="w-24 h-1 bg-gold-accent mx-auto"></div>
              <p className="text-on-surface-variant max-w-xl mx-auto text-sm">Review some of our latest turnkey school, office, and commercial design projects.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {projects.slice(0, 3).map((project) => (
                <div key={project.id} className="bg-white rounded-xl shadow-card overflow-hidden hover:-translate-y-2 transition-transform duration-300 border border-outline-variant/10">
                  <div className="h-56 overflow-hidden relative">
                    <img src={project.imageUrl} alt={project.name} className="w-full h-full object-cover" />
                    <div className="absolute top-4 right-4 bg-primary text-gold-accent px-3 py-1 rounded-full text-xs font-bold font-label-md">
                      {project.categoryName}
                    </div>
                  </div>
                  <div className="p-6 space-y-2">
                    <span className="text-gold-accent font-bold text-xs">{project.clientName}</span>
                    <h4 className="font-title-lg text-primary font-bold">{project.name}</h4>
                    <p className="text-on-surface-variant text-xs leading-relaxed line-clamp-3">{project.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center pt-4">
              <Link to="/catalog" className="bg-primary text-white font-bold px-8 py-3.5 rounded-lg hover:bg-primary-container transition-all hover:scale-105 shadow-md">
                Browse Full Catalog
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Slider */}
      {testimonials.length > 0 && (
        <section className="py-xl bg-surface relative overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-gold-accent/5 rounded-full blur-[100px]"></div>
          
          <div className="max-w-container-max mx-auto px-gutter space-y-12">
            <div className="text-center space-y-4">
              <h2 className="font-headline-lg text-3xl font-bold text-primary">What Our Partners Say</h2>
              <div className="w-24 h-1 bg-gold-accent mx-auto"></div>
            </div>

            <div className="max-w-4xl mx-auto min-h-[300px] flex items-center justify-center relative">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeTestimonial}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-outline-variant/10 flex flex-col md:flex-row gap-8 items-center relative z-10"
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 border-2 border-gold-accent shadow-md">
                    <img src={testimonials[activeTestimonial].imageUrl || "/logo.jpeg"} alt={testimonials[activeTestimonial].name} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-4 text-center md:text-left flex-grow">
                    <div className="flex justify-center md:justify-start text-gold-accent">
                      {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                        <span key={i} className="material-symbols-outlined fill-current text-[20px]">star</span>
                      ))}
                    </div>
                    <p className="italic text-primary-container text-base leading-relaxed">
                      "{testimonials[activeTestimonial].content}"
                    </p>
                    <div>
                      <h4 className="font-bold text-primary text-base">{testimonials[activeTestimonial].name}</h4>
                      <p className="text-on-surface-variant text-xs">{testimonials[activeTestimonial].position} • {testimonials[activeTestimonial].company}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Indicator Dots */}
            <div className="flex justify-center gap-2">
              {testimonials.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${idx === activeTestimonial ? 'bg-gold-accent w-6' : 'bg-outline-variant/50'}`}
                ></button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Book Service CTA Section */}
      <section className="py-xl bg-[#000d22] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-container/60 via-[#000d22] to-[#000d22] opacity-80 z-0"></div>
        <div className="max-w-container-max mx-auto px-gutter space-y-6 relative z-10">
          <h2 className="font-display-lg text-4xl font-extrabold leading-tight">Ready to Get Started?</h2>
          <p className="text-surface-variant max-w-xl mx-auto leading-relaxed text-sm">Simplify your procurement workflow today. Schedule a site inspection or book a detailed consultancy slot with our technical expert.</p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link to="/book-slot" className="bg-gold-accent hover:bg-[#c5a02e] text-primary font-bold px-8 py-3.5 rounded-lg shadow-lg hover:scale-105 transition-all">
              Book a Service Slot
            </Link>
            <Link to="/contact" className="border border-white/30 hover:border-gold-accent hover:text-gold-accent font-bold px-8 py-3.5 rounded-lg transition-all">
              Contact Support
            </Link>
          </div>
        </div>
      </section>

      {/* Google Maps / Contact details */}
      <section className="py-xl bg-surface-container-low">
        <div className="max-w-container-max mx-auto px-gutter grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-gold-accent font-semibold tracking-wider uppercase text-xs">Our Presence</span>
              <h2 className="font-headline-lg text-3xl font-bold text-primary mt-2">Visit Our Corporate Office</h2>
              <div className="w-16 h-1 bg-gold-accent mt-3"></div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-container text-gold-accent flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined">location_on</span>
                </div>
                <div>
                  <h4 className="font-bold text-primary text-sm">Office Address</h4>
                  <p className="text-on-surface-variant text-xs leading-relaxed mt-1">{settings?.address || 'Near water sport complex gorakhpur, Uttar Pradesh, India'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-container text-gold-accent flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined">call</span>
                </div>
                <div>
                  <h4 className="font-bold text-primary text-sm">Phone Number</h4>
                  <p className="text-on-surface-variant text-xs leading-relaxed mt-1">{settings?.phone || '+91 85760 84127'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-container text-gold-accent flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined">mail</span>
                </div>
                <div>
                  <h4 className="font-bold text-primary text-sm">Email Address</h4>
                  <p className="text-on-surface-variant text-xs leading-relaxed mt-1">{settings?.email || 'onevendorsolutions@gmail.com'}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-[#25D366]/10 border border-[#25D366]/20 p-4 rounded-xl flex items-center gap-3">
              <span className="material-symbols-outlined text-[32px] text-[#25D366]">chat</span>
              <div>
                <h5 className="font-bold text-[#25D366] text-xs">Sourcing via WhatsApp</h5>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">Direct message us for immediate catalogue files and quotation support.</p>
              </div>
            </div>
          </div>

          {/* Interactive Map Iframe */}
          <div className="lg:col-span-7 rounded-2xl overflow-hidden shadow-lg border border-outline-variant/20 min-h-[300px]">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14241.970221379768!2d83.37311107567083!3d26.76029881881678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39914470876bb2d3%3A0xc3cf338dc9944de3!2sGorakhpur%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0, minHeight: '350px' }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Gorakhpur Office Map Location"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Actions for Mobile */}
      <div className="fixed bottom-6 left-6 z-[95] md:hidden flex flex-col gap-2">
        {/* Telephone Call Button */}
        <a 
          href={`tel:${settings?.phone?.replace(/\s+/g, '') || '+918576084127'}`}
          className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          title="Call Us"
        >
          <span className="material-symbols-outlined text-[20px]">call</span>
        </a>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
