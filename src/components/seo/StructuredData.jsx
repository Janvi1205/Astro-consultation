import { useEffect } from 'react';

/**
 * StructuredData – injects JSON-LD structured data into <head>.
 * Rendered on the Home page for rich search results.
 */
const StructuredData = () => {
  useEffect(() => {
    const schemas = [
      // ── Local Business ────────────────────────────────────────────
      {
        '@context': 'https://schema.org',
        '@type': ['LocalBusiness', 'ProfessionalService'],
        name: 'Pradeep Malhotra – Astrology & Spiritual Consultation',
        description:
          'Personalized Vedic astrology consultations by Pradeep Malhotra. Expert guidance on life, career, relationships, numerology, and Vaastu for clarity and transformation.',
        url: 'https://pradeepmalhotra.com',
        telephone: '+91-9717721217',
        email: 'contact@pradeepmalhotra.com',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Delhi',
          addressRegion: 'Delhi',
          addressCountry: 'IN',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 28.6139,
          longitude: 77.209,
        },
        openingHours: 'Mo-Sa 08:00-20:00',
        priceRange: '₹₹',
        currenciesAccepted: 'INR',
        paymentAccepted: 'Cash, Credit Card, UPI',
        areaServed: ['Delhi', 'India'],
        serviceType: [
          'Life Prediction',
          'Career and Business Consultation',
          'Marriage Counselling',
          'Numerology Consultation',
          'Vaastu Consultation',
          'Legal Guidance',
        ],
        image: 'https://pradeepmalhotra.com/og-image.jpg',
        sameAs: [],
      },
      // ── Person (Astrologer) ───────────────────────────────────────
      {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Pradeep Malhotra',
        jobTitle: 'Vedic Astrologer & Spiritual Consultant',
        description:
          'Pradeep Malhotra is an experienced Vedic astrologer with over 10 years of practice, offering personalized consultations for life, career, relationships, and spiritual growth.',
        url: 'https://pradeepmalhotra.com',
        telephone: '+91-9717721217',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Delhi',
          addressCountry: 'IN',
        },
        knowsAbout: [
          'Vedic Astrology',
          'Numerology',
          'Vaastu Shastra',
          'Spiritual Guidance',
          'Horoscope Reading',
        ],
      },
      // ── WebSite ───────────────────────────────────────────────────
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Pradeep Malhotra',
        url: 'https://pradeepmalhotra.com',
        description:
          'Book premium astrology and spiritual consultations with Pradeep Malhotra online.',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://pradeepmalhotra.com/booking',
          },
          'query-input': 'required name=search_term_string',
        },
      },
      // ── FAQ ───────────────────────────────────────────────────────
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How do I book an astrology consultation with Pradeep Malhotra?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'You can book a consultation directly on our website by selecting a service, choosing a date and time slot, filling in your personal details, and completing the secure online payment.',
            },
          },
          {
            '@type': 'Question',
            name: 'What services does Pradeep Malhotra offer?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Pradeep Malhotra offers Life Prediction, Career and Business Guidance, Marriage Counselling, Numerology Consultation, Vaastu Consultation, and Legal Guidance through astrology.',
            },
          },
          {
            '@type': 'Question',
            name: 'How long is each consultation session?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Session durations vary by package — typically between 30 minutes and 90 minutes. The exact duration is shown during the booking process.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is online consultation available?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, consultations are available both in-person in Delhi and online via phone or video call.',
            },
          },
        ],
      },
    ];

    // Inject each schema as a separate <script type="application/ld+json">
    const scriptTags = schemas.map((schema) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema);
      script.setAttribute('data-schema', 'structured-data');
      document.head.appendChild(script);
      return script;
    });

    // Cleanup on unmount
    return () => {
      scriptTags.forEach((tag) => {
        if (tag.parentNode) tag.parentNode.removeChild(tag);
      });
    };
  }, []);

  return null;
};

export default StructuredData;
