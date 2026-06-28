import React from 'react';
import Header from '../components/layout/Header';
import Hero from '../components/home/Hero';
import About from '../components/home/About';
import Services from '../components/home/Services';
import Testimonials from '../components/home/Testimonials';
import Contact from '../components/home/Contact';
import Footer from '../components/home/Footer';
import useSEO from '../hooks/useSEO';
import StructuredData from '../components/seo/StructuredData';

const Home = () => {
  useSEO({
    title: 'Pradeep Malhotra • Premium Astrology & Spiritual Consultation',
    description:
      'Personalized Vedic astrology consultations by Pradeep Malhotra. Expert guidance on life, career, relationships, numerology, and Vaastu. Book your session online.',
    canonical: '/',
    ogImage: 'https://pradeepmalhotra.com/og-image.jpg',
  });

  return (
    <div className="relative min-h-screen bg-cosmic-dark text-cream overflow-x-hidden">
      {/* Structured Data for rich Google results */}
      <StructuredData />

      {/* Sticky Header Navigation */}
      <Header />

      {/* Main Sections */}
      <main id="main-content">
        <Hero />
        <About />
        <Services />
        <Testimonials />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
