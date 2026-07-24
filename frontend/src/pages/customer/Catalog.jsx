import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../services/api';
import { setMetaTags, setSchemaMarkup, getOrganizationSchema, getBreadcrumbSchema } from '../../utils/seo';

const Catalog = () => {
  const { category: categoryParam } = useParams();
  const navigate = useNavigate();

  // Core Data States
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  // Fetch categories on load
  useEffect(() => {
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

  // Update selected category when parameter changes or categories load
  useEffect(() => {
    if (categories.length === 0) return;

    let targetCategory = null;
    if (categoryParam) {
      // Find category by parsing parameter (e.g., "School-Essentials" -> "School Essentials")
      const parsedParamName = categoryParam.replace(/-/g, ' ').toLowerCase();
      targetCategory = categories.find(
        (c) => c.name.toLowerCase() === parsedParamName || c.name.toLowerCase().replace(/\s+/g, '-') === categoryParam
      );
    }

    // Default to first category if none matched or provided
    if (!targetCategory) {
      targetCategory = categories[0];
    }

    setSelectedCategory(targetCategory);
    
    // Set dynamic metadata SEO tags
    setMetaTags(
      `${targetCategory.name} Catalog — One Vendor Solutions`,
      `Explore premium B2B ${targetCategory.name} products and professional installation services. Bulk procurement made simple by One Vendor Solutions — PAN India delivery.`,
      '/og-image.jpg',
      'website',
      {
        keywords: `${targetCategory.name} bulk procurement, ${targetCategory.name} wholesale India, One Vendor Solutions ${targetCategory.name}, B2B ${targetCategory.name} supplier`,
      }
    );
    setSchemaMarkup(
      {
        '@context': 'https://schema.org',
        '@graph': [
          getBreadcrumbSchema([
            { name: 'Home',    path: '/' },
            { name: 'Catalog', path: '/catalog' },
            { name: targetCategory.name, path: `/catalog/${targetCategory.name.replace(/\s+/g, '-')}` },
          ]),
          {
            '@type': 'CollectionPage',
            name: `${targetCategory.name} — One Vendor Solutions`,
            description: `Browse ${targetCategory.name} bulk procurement products from One Vendor Solutions.`,
            url: `https://www.onevendorsolutions.com/catalog/${targetCategory.name.replace(/\s+/g, '-')}`,
            provider: { '@id': 'https://www.onevendorsolutions.com/#organization' },
          },
        ],
      },
      'ld-json-catalog'
    );
  }, [categoryParam, categories]);

  // Fetch services when selected category changes
  useEffect(() => {
    if (!selectedCategory) return;

    const fetchServices = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/services?categoryId=${selectedCategory.id}`);
        setServices(res.data);
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [selectedCategory]);


  // Filter logic
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Unique service names to mock tag filters
  const mockTags = ['Premium Tier', 'Standard Quality', 'Turnkey Work', 'AMC Cover'];

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface">
      <Navbar />

      <main className="max-w-container-max mx-auto px-4 sm:px-gutter pt-24 pb-xl">
        {/* Breadcrumb & Header */}
        <div className="mb-6 pt-4">
          <nav className="flex items-center gap-2 text-on-surface-variant font-label-md mb-4">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="text-primary font-semibold">Catalog</span>
            {selectedCategory && (
              <>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                <span className="text-gold-accent font-semibold">{selectedCategory.name}</span>
              </>
            )}
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-poppins font-extrabold text-primary leading-tight">
                {selectedCategory?.name || 'Loading Catalog...'}
              </h1>
              <p className="text-on-surface-variant mt-2 max-w-2xl text-sm">
                {selectedCategory?.description || 'Consolidated procurement and direct bulk supply for corporate workspaces and institutions.'}
              </p>
            </div>
            
            <Link 
              to="/book-slot" 
              className="bg-gold-accent hover:bg-[#c5a02e] text-primary font-bold px-6 py-3 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 text-xs shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
              Book Consultation Slot
            </Link>
          </div>
        </div>

        {/* Main Two-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          {/* Sidebar Navigation & Filters — mobile: horizontal scroll, desktop: sticky */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            {/* Mobile: horizontal category pill scroller */}
            <div className="lg:hidden flex overflow-x-auto gap-2 pb-2 -mx-1 px-1 no-scrollbar">
              {categories.map((cat) => {
                const isActive = selectedCategory?.id === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => navigate(`/catalog/${cat.name.replace(/\s+/g, '-')}`)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                      isActive
                        ? 'bg-primary text-gold-accent border-primary shadow-sm'
                        : 'bg-white text-on-surface-variant border-outline-variant hover:border-primary hover:text-primary'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>

            {/* Desktop: full sidebar */}
            <div className="hidden lg:block bg-white p-6 rounded-xl border border-outline-variant/35 shadow-sm space-y-8 sticky top-24">
              <div>
                <h3 className="font-poppins font-bold text-lg text-primary mb-1">Search &amp; Filter</h3>
                <p className="text-xs text-on-surface-variant mb-4">Find items in this catalog</p>
                
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Search catalog items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border-outline-variant focus:border-gold-accent focus:ring-1 focus:ring-gold-accent pl-10 pr-4 py-2.5 text-body-md"
                  />
                  <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant text-[18px]">search</span>
                </div>
              </div>

              {/* Verticals Quick Selector */}
              <div className="space-y-3">
                <h4 className="font-label-md text-primary font-bold uppercase tracking-wider text-xs border-b pb-2">Catalog Verticals</h4>
                <div className="flex flex-col gap-2">
                  {categories.map((cat) => {
                    const isActive = selectedCategory?.id === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => navigate(`/catalog/${cat.name.replace(/\s+/g, '-')}`)}
                        className={`text-left px-4 py-3 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${
                          isActive 
                            ? 'bg-primary text-gold-accent border-l-4 border-gold-accent shadow-sm' 
                            : 'bg-surface hover:bg-surface-container-low text-on-surface-variant hover:text-primary'
                        }`}
                      >
                        <span>{cat.name}</span>
                        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Sourcing Contact Info */}
              <div className="bg-[#000d22]/5 p-4 rounded-xl border border-gold-accent/15 space-y-2 text-center">
                <h5 className="font-bold text-primary text-xs">Need Bulk Custom Quotes?</h5>
                <p className="text-[10px] text-on-surface-variant leading-relaxed">Submit a custom booking details or call us directly for bulk pricing negotiations.</p>
                <Link 
                  to="/contact" 
                  className="inline-block w-full bg-primary hover:bg-primary-container text-white py-2 rounded-lg font-bold text-xs shadow transition-all"
                >
                  Submit Custom RFQ
                </Link>
              </div>
            </div>

            {/* Mobile search bar below the pills */}
            <div className="lg:hidden mt-3 relative">
              <input 
                type="text"
                placeholder="Search catalog items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-outline-variant focus:border-gold-accent focus:ring-1 focus:ring-gold-accent pl-10 pr-4 py-2.5 text-sm"
              />
              <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant text-[18px]">search</span>
            </div>
          </aside>

          {/* Catalog Services Display */}
          <section className="flex-grow w-full">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <span className="material-symbols-outlined animate-spin text-4xl text-gold-accent">sync</span>
                <span className="text-xs text-on-surface-variant font-bold">Fetching high-quality catalog items...</span>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div 
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {filteredServices.map((service, idx) => (
                    <motion.div 
                      key={service.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                      className="bg-white rounded-xl overflow-hidden shadow-card border border-outline-variant/20 hover:border-gold-accent transition-all duration-300 hover:-translate-y-1 hover:shadow-hover flex flex-col h-full"
                    >
                      <div className="h-48 relative overflow-hidden group">
                        <img 
                          src={service.imageUrl || "https://images.unsplash.com/photo-1548345680-f5475ea5df84?w=500"} 
                          alt={service.name} 
                          title={service.name} 
                          width="500" 
                          height="300" 
                          loading="lazy" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      </div>
                      
                      <div className="p-6 flex flex-col flex-grow space-y-3">
                        <div className="flex items-center gap-1.5 text-gold-accent">
                          <span className="w-1.5 h-1.5 rounded-full bg-gold-accent"></span>
                          <span className="text-[10px] font-bold uppercase tracking-widest">{mockTags[idx % mockTags.length]}</span>
                        </div>
                        <h3 className="font-title-lg text-primary font-bold leading-tight">{service.name}</h3>
                        <p className="text-on-surface-variant text-xs leading-relaxed flex-grow line-clamp-3">{service.description}</p>
                        
                        <Link 
                          to="/book-slot" 
                          state={{ initialCategoryId: selectedCategory?.id, initialServiceId: service.id }}
                          className="w-full py-3 bg-primary-container text-white hover:bg-primary font-bold rounded-lg text-xs transition-all flex items-center justify-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                          Book Installation Slot
                        </Link>
                      </div>
                    </motion.div>
                  ))}

                  {filteredServices.length === 0 && (
                    <div className="col-span-full py-20 text-center space-y-4">
                      <span className="material-symbols-outlined text-6xl text-outline-variant">search_off</span>
                      <h3 className="font-poppins font-bold text-xl text-primary">No Catalog Items Found</h3>
                      <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
                        No service matching "{searchQuery}" is active in the {selectedCategory?.name} category. Check another category or try resetting filters.
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Catalog;
