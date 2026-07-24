import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { setMetaTags, setSchemaMarkup, getBreadcrumbSchema } from '../../utils/seo';

const TermsPrivacy = () => {
  useEffect(() => {
    setMetaTags(
      'Terms of Service & Privacy Policy — One Vendor Solutions',
      'Read the Terms of Service and Privacy Policy for One Vendor Solutions. Understand our data handling, B2B sourcing terms, and booking conditions.',
      '/og-image.jpg',
      'website',
      { robots: 'index, follow' }
    );
    setSchemaMarkup(
      {
        '@context': 'https://schema.org',
        '@graph': [
          getBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Terms & Privacy', path: '/terms-privacy' },
          ]),
        ],
      },
      'ld-json-terms'
    );
  }, []);

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface">
      <Navbar />

      <main className="max-w-3xl mx-auto px-gutter pt-32 pb-xl space-y-8">
        <div>
          <h1 className="font-poppins font-extrabold text-3xl text-primary">Terms of Service &amp; Privacy Policy</h1>
          <p className="text-xs text-on-surface-variant mt-1">Effective Date: October 2024</p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-outline-variant/30 shadow-sm space-y-6 text-xs leading-relaxed text-on-surface-variant">
          <section className="space-y-2">
            <h2 className="font-poppins font-bold text-sm text-primary">1. Agreement to Terms</h2>
            <p>
              By accessing our procurement catalogue or requesting callback consultation slots from One Vendor Solutions (OVS), you agree to be bound by these Service Terms. We connect commercial and educational entities to verified supply chains.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-poppins font-bold text-sm text-primary">2. B2B Sourcing &amp; Site Inspections</h2>
            <p>
              Requested slots for site inspection consultations are subject to scheduling and calendar approval by our logistics teams. Booking slots do not constitute binding contracts for final supply delivery until formal RFQ sheets are negotiated and signed.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-poppins font-bold text-sm text-primary">3. Information Collection &amp; Privacy</h2>
            <p>
              We collect organizational names, work email addresses, contact details, and detailed specification requirements to provide quotes. We do not sell or lease your business data to external marketers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-poppins font-bold text-sm text-primary">4. Contacts &amp; Disclaimers</h2>
            <p>
              For further inquiries, contact our sourcing managers directly at <strong>onevendorsolutions@gmail.com</strong> or our dedicated WhatsApp contact channel.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsPrivacy;
