// components/AboutPage.jsx
import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';

// Import all modular components
import AboutHero from '../components/core/About/AboutHero';
import OurMission from '../components/core/About/OurMission';
import OurServices from '../components/core/About/OurServices';
import WhyChooseUs from '../components/core/About/ChooseUs';
import OurTeam from '../components/core/About/OurTeam';
import CallToAction from '../components/core/About/CallToAction';
// import Footer from '../components/common/Footer';

const AboutPage = () => {
  const pageRef = useRef(null);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen bg-white">
      {/* Background Animation Container */}
      <motion.div 
        className="fixed inset-0 pointer-events-none z-0"
        animate={{
          background: [
            'radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)'
          ]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear"
        }}
      />

      {/* Page Content */}
      <div className="relative z-10">
        <AboutHero />
        <OurMission />
        <OurServices />
        <WhyChooseUs />
        <OurTeam />
        <CallToAction />
      </div>
    </div>
  );
};

export default AboutPage;
