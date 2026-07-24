import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { setMetaTags, setSchemaMarkup, getOrganizationSchema, getBreadcrumbSchema } from '../../utils/seo';
import api from '../../services/api';

const EnquiryForm = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    organization: '',
    contactNumber: '',
    email: '',
    categoryId: '',
    detailedRequirement: '',
    preferredSlot: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    setMetaTags(
      'Request a Quote — One Vendor Solutions',
      'Request a custom wholesale price quote for School, Office, or Home bulk supplies from One Vendor Solutions. Bulk pricing, single-point sourcing — response within 24 hours.',
      '/og-image.jpg',
      'website',
      {
        keywords: 'bulk procurement quote India, RFQ One Vendor Solutions, wholesale price request, B2B quote school office home',
      }
    );
    setSchemaMarkup(
      {
        '@context': 'https://schema.org',
        '@graph': [
          getBreadcrumbSchema([
            { name: 'Home',            path: '/' },
            { name: 'Request a Quote', path: '/enquiry' },
          ]),
          {
            '@type': 'WebPage',
            name: 'Request a Quote — One Vendor Solutions',
            description: 'Submit a bulk procurement quotation request for school, office or home essentials.',
            url: 'https://www.onevendorsolutions.com/enquiry',
            provider: { '@id': 'https://www.onevendorsolutions.com/#organization' },
          },
        ],
      },
      'ld-json-enquiry'
    );

    const loadCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data);
        if (res.data.length > 0) {
          setFormData(prev => ({ ...prev, categoryId: res.data[0].id.toString() }));
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    loadCategories();
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
      const selectedCatId = parseInt(formData.categoryId);
      const preferredDateVal = formData.preferredSlot 
        ? formData.preferredSlot.split('T')[0] 
        : new Date().toISOString().split('T')[0];

      // Submit quote request as a booking entry
      const payload = {
        fullName: formData.fullName,
        phone: formData.contactNumber,
        email: formData.email,
        address: formData.organization || 'Individual Procurement Lead',
        preferredDate: preferredDateVal,
        timeSlot: 'ANYTIME',
        message: `Detailed requirements: ${formData.detailedRequirement}`,
        categoryId: selectedCatId,
        serviceId: null // General consultation request
      };

      await api.post('/bookings', payload);
      setStatus('success');
      setFormData({
        fullName: '',
        organization: '',
        contactNumber: '',
        email: '',
        categoryId: categories[0]?.id.toString() || '',
        detailedRequirement: '',
        preferredSlot: ''
      });
    } catch (err) {
      console.error('Error saving quote enquiry:', err);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface">
      <Navbar />
      
      <main className="max-w-container-max mx-auto px-gutter pt-32 pb-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4">
              <span className="text-gold-accent font-label-md text-xs tracking-widest uppercase block font-bold">Premium Sourcing</span>
              <h1 className="font-poppins font-extrabold text-3xl text-primary leading-tight">Get Your Custom Procurement Plan</h1>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Simplify your supply chain with a dedicated vendor. We provide bespoke sourcing solutions for institutions, offices, and large-scale residential needs.
              </p>
            </div>
            
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow border-l-4 border-gold-accent">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0 text-gold-accent">
                  <span className="material-symbols-outlined" style={{fontSize: "24px"}}>payments</span>
                </div>
                <div>
                  <h3 className="font-bold text-xs text-primary">Bulk Pricing Models</h3>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">Unlock wholesale rates tailored to your volume requirements.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow border-l-4 border-gold-accent">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0 text-gold-accent">
                  <span className="material-symbols-outlined" style={{fontSize: "24px"}}>inventory_2</span>
                </div>
                <div>
                  <h3 className="font-bold text-xs text-primary">Single Vendor for All Needs</h3>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">One invoice, one point of contact, thousands of products.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow border-l-4 border-gold-accent">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0 text-gold-accent">
                  <span className="material-symbols-outlined" style={{fontSize: "24px"}}>speed</span>
                </div>
                <div>
                  <h3 className="font-bold text-xs text-primary">Fast Turnaround Times</h3>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">Priority logistics for all corporate accounts.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow border border-outline-variant/30">
              <h2 className="font-poppins font-extrabold text-xl text-primary mb-6">Request a Quotation</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-label-md text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block mb-1">Full Name</label>
                    <input 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full rounded-lg border-outline-variant focus:border-gold-accent focus:ring-1 focus:ring-gold-accent p-2.5 text-body-md" 
                      placeholder="John Doe" 
                      required 
                      type="text"
                    />
                  </div>

                  <div>
                    <label className="font-label-md text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block mb-1">Company / Organization</label>
                    <input 
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      className="w-full rounded-lg border-outline-variant focus:border-gold-accent focus:ring-1 focus:ring-gold-accent p-2.5 text-body-md" 
                      placeholder="Global Tech Corp" 
                      required 
                      type="text"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-label-md text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block mb-1">Contact Number</label>
                    <input 
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      className="w-full rounded-lg border-outline-variant focus:border-gold-accent focus:ring-1 focus:ring-gold-accent p-2.5 text-body-md" 
                      placeholder="+91 85760 84127" 
                      required 
                      type="tel"
                    />
                  </div>

                  <div>
                    <label className="font-label-md text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block mb-1">Email Address</label>
                    <input 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-lg border-outline-variant focus:border-gold-accent focus:ring-1 focus:ring-gold-accent p-2.5 text-body-md" 
                      placeholder="john@company.com" 
                      required 
                      type="email"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-label-md text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block mb-1">Requirement Category</label>
                  <select 
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    className="w-full rounded-lg border-outline-variant focus:border-gold-accent focus:ring-1 focus:ring-gold-accent p-2.5 text-body-md bg-white cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-label-md text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block mb-1">Detailed Requirement Description</label>
                  <textarea 
                    name="detailedRequirement"
                    value={formData.detailedRequirement}
                    onChange={handleChange}
                    className="w-full rounded-lg border-outline-variant focus:border-gold-accent focus:ring-1 focus:ring-gold-accent p-2.5 text-body-md" 
                    placeholder="Describe your procurement specifications in detail..." 
                    rows="4"
                    required
                  ></textarea>
                </div>

                <div>
                  <label className="font-label-md text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block mb-1">Preferred Consultation Date</label>
                  <input 
                    name="preferredSlot"
                    value={formData.preferredSlot}
                    onChange={handleChange}
                    className="w-full rounded-lg border-outline-variant focus:border-gold-accent focus:ring-1 focus:ring-gold-accent p-2.5 text-body-md" 
                    type="date"
                  />
                </div>

                {status === 'success' && (
                  <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg font-bold">
                    Quotation request submitted! We will contact you on WhatsApp/Call within 24 hours.
                  </div>
                )}

                {status === 'error' && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg font-bold">
                    Failed to submit request. Please check connections and try again.
                  </div>
                )}

                <div className="pt-2">
                  <button 
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary-container text-white py-4 rounded-lg font-bold text-xs shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-1.5" 
                    type="submit"
                  >
                    {loading ? (
                      <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                    ) : (
                      <>
                        Submit RFQ Quote Request
                        <span className="material-symbols-outlined text-[18px]">send</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EnquiryForm;
