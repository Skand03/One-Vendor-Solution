import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { setMetaTags, setSchemaMarkup, getOrganizationSchema, getServiceSchema, getBreadcrumbSchema } from '../../utils/seo';
import api from '../../services/api';

const ProductDetail = () => {
  const { category, productId } = useParams();
  const navigate = useNavigate();
  
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchServiceDetail = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await api.get(`/services/${productId}`);
        setService(res.data);
        
        setMetaTags(
          `${res.data.name} — One Vendor Solutions`,
          `${res.data.name}: B2B bulk procurement and professional installation service by One Vendor Solutions. Consolidated sourcing and direct wholesale pricing. Serving PAN India.`,
          res.data.imageUrl || '/og-image.jpg',
          'website',
          {
            keywords: `${res.data.name}, bulk procurement India, wholesale ${res.data.name}, One Vendor Solutions ${res.data.categoryName}`,
          }
        );
        setSchemaMarkup(
          {
            '@context': 'https://schema.org',
            '@graph': [
              getServiceSchema(res.data),
              getBreadcrumbSchema([
                { name: 'Home',             path: '/' },
                { name: 'Catalog',          path: '/catalog' },
                { name: res.data.categoryName, path: `/catalog/${category}` },
                { name: res.data.name,      path: `/catalog/${category}/${productId}` },
              ]),
            ],
          },
          'ld-json-product'
        );
      } catch (err) {
        console.error('Error fetching service details:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchServiceDetail();
  }, [productId]);

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      alert('Please fill out all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        fullName: formData.fullName,
        phone: formData.phone,
        email: 'detail-enquiry@ovs.com',
        address: 'Direct Service Detail Page Form',
        preferredDate: new Date().toISOString().split('T')[0],
        timeSlot: 'ANYTIME',
        message: formData.message || `Direct enquiry for service: ${service.name}`,
        categoryId: service.categoryId,
        serviceId: service.id
      };

      await api.post('/bookings', payload);
      setSuccess(true);
      setFormData({ fullName: '', phone: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error('Error submitting enquiry:', err);
      alert('There was a problem submitting your request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface">
      <Navbar />

      <main className="max-w-container-max mx-auto px-gutter pt-32 pb-xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <span className="material-symbols-outlined animate-spin text-4xl text-gold-accent">sync</span>
            <span className="text-xs text-on-surface-variant font-bold">Retrieving service specifications...</span>
          </div>
        ) : error || !service ? (
          <div className="text-center py-32 space-y-4">
            <span className="material-symbols-outlined text-6xl text-outline-variant">error</span>
            <h2 className="text-xl font-bold text-primary">Service Not Found</h2>
            <p className="text-xs text-on-surface-variant max-w-sm mx-auto">This service SKU does not exist in our catalog or may have been deprecated.</p>
            <Link to="/catalog" className="inline-block bg-primary text-white font-bold px-6 py-2.5 rounded-lg text-xs shadow-md">
              Back to Catalog
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-on-surface-variant font-label-md text-xs">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              <Link to="/catalog" className="hover:text-primary transition-colors">Catalog</Link>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              <Link to={`/catalog/${category}`} className="hover:text-primary transition-colors">{service.categoryName}</Link>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              <span className="text-gold-accent font-semibold">{service.name}</span>
            </nav>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Left Column: Image & Details */}
              <div className="lg:col-span-8 space-y-6">
                <div className="aspect-video rounded-2xl overflow-hidden shadow-lg border border-outline-variant/20 bg-surface-container relative">
                  <img 
                    src={service.imageUrl || "https://images.unsplash.com/photo-1548345680-f5475ea5df84?w=900"} 
                    alt={service.name} 
                    className="w-full h-full object-cover" 
                  />
                  </div>

                <div className="space-y-4">
                  <h1 className="text-3xl font-poppins font-extrabold text-primary leading-tight">{service.name}</h1>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold-accent/15 text-primary border border-gold-accent/30 font-label-md">
                    Sourcing Verticals: {service.categoryName}
                  </span>
                  
                  <div className="w-full h-px bg-outline-variant/30 my-6"></div>
                  
                  <div className="space-y-3">
                    <h3 className="font-poppins font-bold text-lg text-primary">Service Specifications</h3>
                    <p className="text-on-surface-variant text-sm leading-relaxed">{service.description}</p>
                  </div>
                </div>

                {/* Direct Action Link */}
                <div className="pt-6">
                  <button
                    onClick={() => navigate('/book-slot', { state: { initialCategoryId: service.categoryId, initialServiceId: service.id } })}
                    className="bg-primary hover:bg-primary-container text-white px-8 py-4 rounded-xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    <span className="material-symbols-outlined">calendar_month</span>
                    Book an Inspection Slot
                  </button>
                </div>
              </div>

              {/* Right Column: Callback Card */}
              <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-md space-y-4 sticky top-28">
                <div className="text-center space-y-1">
                  <h4 className="font-poppins font-bold text-base text-primary">Get a Custom Quote</h4>
                  <p className="text-xs text-on-surface-variant">Looking for bulk volume discounts? Submit your phone number and we'll call you immediately.</p>
                </div>

                {success ? (
                  <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 text-center text-xs space-y-2 animate-fadeIn">
                    <span className="material-symbols-outlined text-green-600 text-3xl">check_circle</span>
                    <h5 className="font-bold">Callback Scheduled!</h5>
                    <p>Our relationships coordinator will contact you shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleEnquirySubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="font-label-md text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block mb-1">Full Name</label>
                      <input 
                        required
                        type="text"
                        placeholder="Your name"
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        className="w-full rounded-lg border-outline-variant focus:border-gold-accent focus:ring-1 focus:ring-gold-accent p-2.5 text-body-md"
                      />
                    </div>
                    <div>
                      <label className="font-label-md text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block mb-1">Contact Phone</label>
                      <input 
                        required
                        type="tel"
                        placeholder="Phone number"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full rounded-lg border-outline-variant focus:border-gold-accent focus:ring-1 focus:ring-gold-accent p-2.5 text-body-md"
                      />
                    </div>
                    <div>
                      <label className="font-label-md text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block mb-1">Requirement Details</label>
                      <textarea 
                        rows="2"
                        placeholder="Quantity, site constraints, etc..."
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full rounded-lg border-outline-variant focus:border-gold-accent focus:ring-1 focus:ring-gold-accent p-2.5 text-body-md"
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-gold-accent hover:bg-[#c5a02e] text-primary font-bold py-3 rounded-lg shadow transition-all flex items-center justify-center gap-1 active:scale-[0.98]"
                    >
                      {submitting ? 'Scheduling...' : 'Get Callback Call'}
                    </button>
                  </form>
                )}

                <div className="w-full h-px bg-outline-variant/30 my-4"></div>

                <a 
                  href={`https://wa.me/918576084127?text=Hello%20One%20Vendor%20Solutions,%20I%20am%20interested%20in%20${encodeURIComponent(service.name)}.`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-3 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.417-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.305 1.652zm6.599-3.835c1.516.899 3.3 1.374 5.24 1.375 5.405 0 9.803-4.397 9.805-9.805.001-2.618-1.02-5.08-2.871-6.932-1.851-1.852-4.314-2.872-6.931-2.872-5.405 0-9.803 4.398-9.806 9.806 0 2.077.52 4.108 1.503 5.9l-.99 3.616 3.699-.971zm11.367-5.115c-.314-.157-1.859-.918-2.148-1.023-.288-.105-.499-.157-.709.157-.21.314-.813 1.023-.996 1.232-.183.21-.367.236-.681.079-.314-.157-1.325-.488-2.525-1.558-.933-.832-1.563-1.86-1.747-2.174-.183-.314-.02-.485.137-.642.142-.141.314-.367.471-.55.157-.184.21-.314.314-.524.105-.21.053-.393-.026-.55-.079-.157-.709-1.705-.971-2.334-.255-.612-.513-.529-.709-.538-.182-.008-.393-.01-.603-.01-.21 0-.551.079-.839.393s-1.101 1.075-1.101 2.622c0 1.547 1.127 3.044 1.284 3.254.157.21 2.217 3.386 5.371 4.748.75.324 1.335.518 1.791.663.753.239 1.438.205 1.98.124.605-.09 1.859-.76 2.121-1.496.262-.736.262-1.364.183-1.496-.079-.131-.288-.21-.603-.367z"></path>
                  </svg>
                  Instant WhatsApp Query
                </a>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
