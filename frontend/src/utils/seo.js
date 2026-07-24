// ============================================================
// ONE VENDOR SOLUTIONS — SEO UTILITY  (seo.js)
// Full meta, Open Graph, Twitter, JSON-LD management
// Used by every customer page on mount
// ============================================================

const SITE_URL   = 'https://www.onevendorsolutions.com';
const SITE_NAME  = 'One Vendor Solutions';
const OG_IMAGE   = `${SITE_URL}/og-image.jpg`;
const LOGO_URL   = `${SITE_URL}/logo.jpeg`;
const DEFAULT_DESC =
  "One Vendor Solutions — India's trusted B2B bulk procurement partner. " +
  'Single-point sourcing for schools, offices and homes: furniture, stationery, IT, ' +
  'interiors & more. Based in Gorakhpur, serving PAN India.';

// ─── Helper: upsert a <meta> element ─────────────────────────
const upsertMeta = (selector, value) => {
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    if (selector.includes('[name='))     el.setAttribute('name',     selector.match(/name="([^"]+)"/)[1]);
    if (selector.includes('[property=')) el.setAttribute('property', selector.match(/property="([^"]+)"/)[1]);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
};

// ─── Helper: upsert a <link> element ─────────────────────────
const upsertLink = (rel, href) => {
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
};

// ─── Helper: inject / replace a JSON-LD <script> ─────────────
const upsertSchema = (id, obj) => {
  const existing = document.getElementById(id);
  if (existing) existing.remove();
  const s = document.createElement('script');
  s.id   = id;
  s.type = 'application/ld+json';
  s.text = JSON.stringify(obj, null, 0);
  document.head.appendChild(s);
};

// ============================================================
// setMetaTags — call this on every page's useEffect
//
//  title       : short page name, e.g. 'About Us'
//  description : page-specific description (150–160 chars ideal)
//  image       : absolute URL or path — defaults to og-image.jpg
//  type        : OG type — 'website' | 'article' | 'product'
//  extraMeta   : { keywords, robots } overrides
// ============================================================
export const setMetaTags = (
  title,
  description,
  image,
  type     = 'website',
  extraMeta = {}
) => {
  const pageTitle    = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} | School, Office & Home Bulk Procurement India`;
  const pageDesc     = description || DEFAULT_DESC;
  const pageImage    = image
    ? (image.startsWith('http') ? image : `${SITE_URL}${image}`)
    : OG_IMAGE;
  const canonicalUrl = `${SITE_URL}${window.location.pathname}`;

  // Title
  document.title = pageTitle;

  // Standard SEO
  upsertMeta('[name="description"]',    pageDesc);
  upsertMeta('[name="keywords"]',       extraMeta.keywords ||
    'One Vendor Solutions, B2B procurement India, bulk procurement Gorakhpur, school essentials wholesale, office supplies bulk India, Ujjwal Pandey');
  upsertMeta('[name="author"]',         'One Vendor Solutions — Ujjwal Pandey');
  upsertMeta('[name="robots"]',         extraMeta.robots ||
    'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
  upsertMeta('[name="googlebot"]',      'index, follow');
  upsertMeta('[name="bingbot"]',        'index, follow');
  upsertMeta('[name="rating"]',         'general');
  upsertMeta('[name="revisit-after"]',  '7 days');
  upsertMeta('[name="language"]',       'en-IN');
  upsertMeta('[name="geo.region"]',     'IN-UP');
  upsertMeta('[name="geo.placename"]',  'Gorakhpur, Uttar Pradesh, India');
  upsertMeta('[name="geo.position"]',   '26.7606;83.3732');
  upsertMeta('[name="ICBM"]',           '26.7606, 83.3732');

  // Canonical
  upsertLink('canonical', canonicalUrl);

  // Open Graph
  upsertMeta('[property="og:title"]',       pageTitle);
  upsertMeta('[property="og:description"]', pageDesc);
  upsertMeta('[property="og:image"]',       pageImage);
  upsertMeta('[property="og:image:width"]', '1200');
  upsertMeta('[property="og:image:height"]','630');
  upsertMeta('[property="og:image:alt"]',   pageTitle);
  upsertMeta('[property="og:url"]',         canonicalUrl);
  upsertMeta('[property="og:type"]',        type);
  upsertMeta('[property="og:site_name"]',   SITE_NAME);
  upsertMeta('[property="og:locale"]',      'en_IN');

  // Twitter / X
  upsertMeta('[name="twitter:card"]',        'summary_large_image');
  upsertMeta('[name="twitter:title"]',       pageTitle);
  upsertMeta('[name="twitter:description"]', pageDesc);
  upsertMeta('[name="twitter:image"]',       pageImage);
  upsertMeta('[name="twitter:image:alt"]',   pageTitle);
  upsertMeta('[name="twitter:site"]',        '@OneVendorSol');
  upsertMeta('[name="twitter:creator"]',     '@OneVendorSol');
};

// ============================================================
// setSchemaMarkup — inject any JSON-LD object by ID
// ============================================================
export const setSchemaMarkup = (schemaObj, id = 'ld-json-page') => {
  upsertSchema(id, schemaObj);
};

// ============================================================
// SCHEMA GENERATORS
// ============================================================

/** Organization + LocalBusiness + WebSite — inject on every page */
export const getOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['Organization', 'LocalBusiness'],
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      alternateName: 'OVS',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: LOGO_URL,
        width: 200,
        height: 200,
      },
      image: OG_IMAGE,
      description: DEFAULT_DESC,
      email: 'onevendorsolutions@gmail.com',
      telephone: '+918576084127',
      foundingDate: '2023',
      priceRange: '₹₹',
      currenciesAccepted: 'INR',
      paymentAccepted: 'Cash, Bank Transfer, UPI',
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
          opens: '09:00',
          closes: '18:00',
        },
      ],
      founder: {
        '@type': 'Person',
        name: 'Ujjwal Pandey',
        jobTitle: 'CEO & Founder',
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Near Water Sport Complex',
        addressLocality: 'Gorakhpur',
        addressRegion: 'Uttar Pradesh',
        postalCode: '273001',
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '26.7606',
        longitude: '83.3732',
      },
      hasMap: 'https://www.google.com/maps?q=26.7606,83.3732',
      areaServed: { '@type': 'Country', name: 'India' },
      knowsAbout: [
        'B2B Procurement', 'School Furniture', 'Office Supplies',
        'Bulk Stationery', 'IT Equipment', 'Interior Design', 'Home Essentials',
      ],
      sameAs: ['https://wa.me/918576084127', SITE_URL],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: DEFAULT_DESC,
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'en-IN',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE_URL}/catalog?search={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
});

/** BreadcrumbList schema */
export const getBreadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `${SITE_URL}${item.path}`,
  })),
});

/** FAQPage schema */
export const getFAQSchema = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
});

/** Service schema */
export const getServiceSchema = (service) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: service.name,
  description: service.description,
  url: `${SITE_URL}/catalog`,
  provider: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
  },
  areaServed: { '@type': 'Country', name: 'India' },
  image: service.imageUrl || OG_IMAGE,
});

/** ContactPage schema */
export const getContactPageSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: `Contact ${SITE_NAME}`,
  url: `${SITE_URL}/contact`,
  description: 'Contact One Vendor Solutions for bulk procurement enquiries, vendor partnerships, and custom quotes.',
  mainEntity: {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
  },
});

/** AboutPage schema */
export const getAboutPageSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: `About ${SITE_NAME}`,
  url: `${SITE_URL}/about`,
  description: 'Learn about One Vendor Solutions, our founder Ujjwal Pandey, and our mission to simplify B2B procurement across India.',
  mainEntity: {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
  },
});
