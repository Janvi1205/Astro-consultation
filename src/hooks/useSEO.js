import { useEffect } from 'react';

const BASE_URL = 'https://pradeepmalhotra.com'; // Update with production domain before go-live

/**
 * useSEO – sets all SEO-relevant document head tags dynamically.
 *
 * @param {object} options
 * @param {string}  options.title        – Full page <title>
 * @param {string}  options.description  – Meta description
 * @param {string}  [options.canonical]  – Canonical URL path (e.g. '/booking')
 * @param {string}  [options.ogImage]    – Full URL to OG image (1200x630)
 * @param {boolean} [options.noIndex]    – If true, adds noindex meta
 */
const useSEO = ({
  title,
  description,
  canonical = '/',
  ogImage = `${BASE_URL}/og-image.jpg`,
  noIndex = false,
}) => {
  useEffect(() => {
    // ── Title ──────────────────────────────────────────────────────
    document.title = title;

    // ── Helper: upsert a <meta> tag by attribute ───────────────────
    const setMeta = (attr, attrValue, content) => {
      let el = document.querySelector(`meta[${attr}="${attrValue}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // ── Helper: upsert a <link> tag by rel ────────────────────────
    const setLink = (rel, href) => {
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    const canonicalUrl = `${BASE_URL}${canonical}`;

    // ── Core meta ──────────────────────────────────────────────────
    setMeta('name', 'description', description);
    setMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    // ── Canonical ──────────────────────────────────────────────────
    setLink('canonical', canonicalUrl);

    // ── Open Graph ────────────────────────────────────────────────
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:image', ogImage);
    setMeta('property', 'og:image:width', '1200');
    setMeta('property', 'og:image:height', '630');
    setMeta('property', 'og:site_name', 'Pradeep Malhotra');
    setMeta('property', 'og:locale', 'en_IN');

    // ── Twitter Card ──────────────────────────────────────────────
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', ogImage);

    // Cleanup: restore title if component unmounts (navigation)
    return () => {
      document.title = 'Pradeep Malhotra • Premium Astrology & Spiritual Consultation';
    };
  }, [title, description, canonical, ogImage, noIndex]);
};

export default useSEO;
