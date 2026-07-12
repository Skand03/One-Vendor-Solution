import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { setMetaTags } from '../../utils/seo';

const AboutUs = () => {
  useEffect(() => {
    setMetaTags(
      'About Us',
      'Learn about One Vendor Solutions, our founder Ujjwal Pandey, and how we are redefining B2B procurement and supply chains for modern corporate and education sectors.'
    );
  }, []);

  // Animation variants
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
      
      <main>
        {/* Hero Section */}
        <section className="relative h-[550px] min-h-[500px] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div 
              className="w-full h-full bg-cover bg-center" 
              style={{backgroundImage: "url('/all-images/Onevendorsolutions/school-office-coahing.jpg')"}}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/45"></div>
          </div>
          <div className="relative z-10 max-w-container-max mx-auto px-gutter w-full">
            <div className="max-w-2xl text-white space-y-4">
              <motion.span 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-gold-accent font-poppins font-bold tracking-widest uppercase text-sm block"
              >
                About Us
              </motion.span>
              <motion.h1 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="font-poppins font-extrabold text-white text-4xl md:text-5xl lg:text-6xl leading-tight"
              >
                Our Story: Redefining <span className="text-gold-accent">B2B Procurement</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-white/80 font-body-lg text-lg max-w-lg"
              >
                Bridging the gap between complex industrial supply chains and modern corporate efficiency with a single, unified B2B platform.
              </motion.p>
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

        {/* Mission & Vision Bento Grid */}
        <section className="py-xl bg-surface-container-lowest">
          <div className="max-w-container-max mx-auto px-gutter">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Mission Card */}
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={fadeInUp}
                className="bg-white p-10 rounded-xl shadow-card border-t-2 border-gold-accent relative group overflow-hidden transition-all duration-300 hover:shadow-hover"
              >
                <div className="mb-6 bg-surface-container w-16 h-16 rounded-full flex items-center justify-center text-gold-accent">
                  <span className="material-symbols-outlined text-[32px]">rocket_launch</span>
                </div>
                <h3 className="font-poppins font-bold text-2xl text-primary mb-4">Our Mission</h3>
                <p className="font-body-lg text-on-surface-variant leading-relaxed text-sm">
                  To provide seamless, high-quality procurement solutions for educational and corporate sectors, eliminating operational friction through technology-driven logistics, robust vendor audits, and cost efficiency.
                </p>
                <div className="absolute top-0 right-0 p-8 opacity-5 text-primary scale-[3.5] pointer-events-none">
                  <span className="material-symbols-outlined text-[120px]">rocket_launch</span>
                </div>
              </motion.div>

              {/* Vision Card */}
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={fadeInUp}
                className="bg-white p-10 rounded-xl shadow-card border-t-2 border-gold-accent relative group overflow-hidden transition-all duration-300 hover:shadow-hover"
              >
                <div className="mb-6 bg-surface-container w-16 h-16 rounded-full flex items-center justify-center text-gold-accent">
                  <span className="material-symbols-outlined text-[32px]">visibility</span>
                </div>
                <h3 className="font-poppins font-bold text-2xl text-primary mb-4">Our Vision</h3>
                <p className="font-body-lg text-on-surface-variant leading-relaxed text-sm">
                  To be the global leader in unified B2B vendor management, setting the gold standard for trust, transparency, and transactional ease in B2B marketplaces.
                </p>
                <div className="absolute top-0 right-0 p-8 opacity-5 text-primary scale-[3.5] pointer-events-none">
                  <span className="material-symbols-outlined text-[120px]">visibility</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Founder Section */}
        <section className="py-xl bg-surface">
          <div className="max-w-container-max mx-auto px-gutter">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              {/* Photo Side */}
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={scaleUp}
                className="w-full lg:w-1/2 relative"
              >
                <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl border-b-4 border-gold-accent max-w-md mx-auto">
                  <img 
                    className="w-full h-full object-contain" 
                    alt="Ujjwal Pandey, CEO & Founder of One Vendor Solutions" 
                    src="/all-images/Onevendorsolutions/CEO.jpeg" 
                  />
                </div>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-8 bg-primary p-4 rounded-xl text-white shadow-2xl border-l-4 border-gold-accent hidden md:block">
                  <div className="font-poppins font-bold text-lg">Ujjwal Pandey</div>
                  <div className="text-gold-accent font-label-md text-xs">CEO &amp; Founder</div>
                </div>
              </motion.div>

              {/* Quote Side */}
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                variants={fadeInUp}
                className="w-full lg:w-1/2 space-y-6"
              >
                <div className="text-gold-accent">
                  <span className="material-symbols-outlined text-[64px]" style={{fontVariationSettings: "'FILL' 1"}}>format_quote</span>
                </div>
                <blockquote className="italic font-poppins text-2xl md:text-3xl text-primary font-semibold leading-snug">
                  "Our goal is to simplify complex supply chains through trust, quality, and a single-point solution for every corporate and educational requirement."
                </blockquote>
                <div className="pt-6 border-t border-outline-variant/30">
                  <h4 className="font-poppins font-bold text-lg text-primary">Ujjwal Pandey</h4>
                  <p className="text-on-surface-variant text-xs">Leading One Vendor Solutions since inception</p>
                  
                  <div className="mt-8 flex gap-4">
                    <a 
                      href="/One-Vendor-Solutions-Manifesto.pptx" 
                      download="One-Vendor-Solutions-Manifesto.pptx"
                      className="bg-primary hover:bg-primary-container text-white p-3 rounded-lg flex items-center gap-2 text-xs font-bold border border-transparent shadow transition-all active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[16px]">description</span>
                      Download Manifesto
                    </a>
                    <a 
                      href="mailto:onevendorsolutions@gmail.com" 
                      className="bg-white hover:bg-surface-container-low text-primary p-3 rounded-lg flex items-center gap-2 text-xs font-bold border border-outline-variant/30 shadow transition-all active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[16px]">mail</span>
                      Get in Touch
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-xl bg-surface-container-low">
          <div className="max-w-container-max mx-auto px-gutter">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 className="font-poppins font-bold text-3xl text-primary">Our Core Values</h2>
              <div className="w-16 h-1 bg-gold-accent mx-auto"></div>
              <p className="text-on-surface-variant text-sm">The values that guide every transaction, audit, and client relationship at One Vendor Solutions.</p>
            </div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <motion.div 
                variants={fadeInUp}
                className="p-8 bg-white border border-outline-variant/30 rounded-xl hover:shadow-md transition-all group"
              >
                <span className="material-symbols-outlined text-gold-accent text-3xl mb-4 group-hover:scale-110 transition-transform block">verified_user</span>
                <h4 className="font-title-lg text-primary font-bold text-base mb-2">Unyielding Trust</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">Building long-term corporate partnerships through strict transaction transparency, pre-audited supplier networks, and complete accountability.</p>
              </motion.div>

              <motion.div 
                variants={fadeInUp}
                className="p-8 bg-white border border-outline-variant/30 rounded-xl hover:shadow-md transition-all group"
              >
                <span className="material-symbols-outlined text-gold-accent text-3xl mb-4 group-hover:scale-110 transition-transform block">diamond</span>
                <h4 className="font-title-lg text-primary font-bold text-base mb-2">Premium Quality</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">Selecting only top-tier materials that satisfy national board guidelines for schools and high-performance codes for corporate complexes.</p>
              </motion.div>

              <motion.div 
                variants={fadeInUp}
                className="p-8 bg-white border border-outline-variant/30 rounded-xl hover:shadow-md transition-all group"
              >
                <span className="material-symbols-outlined text-gold-accent text-3xl mb-4 group-hover:scale-110 transition-transform block">bolt</span>
                <h4 className="font-title-lg text-primary font-bold text-base mb-2">Operational Velocity</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">Optimizing supply chain timelines via smart inventory buffers and dedicated delivery fleets, guaranteeing seamless turnaround times.</p>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
