import SimpleLayout from '../knowledge/components/SimpleLayout';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { useLanguage } from '../../lib/LanguageContext';

export default function Membership() {
  const { t } = useLanguage();
  // Scroll animation effect
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
          el.classList.remove('visible');
          setTimeout(() => {
            el.classList.add('visible');
          }, 10);
        } else {
          el.classList.remove('visible');
        }
      });
    };

    handleScroll();
    
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', throttledScroll);
    
    return () => window.removeEventListener('scroll', throttledScroll);
  }, []);
  return (
    <SimpleLayout title="Membership">
      <div className="p-8 md:p-8 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex items-start gap-24 md:gap-24 gap-8 mb-8 md:mb-8 mb-4">
            {/* Right Side - Go Back Button - Smaller on Mobile */}
            <div className="flex justify-end">
              <button 
                onClick={() => window.history.back()}
                className="flex items-center space-x-2 md:space-x-3 text-gray-700 hover:text-[#653a96] transition-all duration-300"
              >
                <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-sm md:text-lg font-medium">Go back</span>
              </button>
            </div>
            {/* Left Side - Breadcrumb and Title */}
            <div className="flex flex-col">
              {/* Breadcrumb - Hidden on Mobile */}
              <nav className="hidden md:block text-base mb-2" aria-label="Breadcrumb">
                <div className="flex items-center space-x-2">
                  <Link 
                    href="/" 
                    className="text-gray-600 hover:text-[#653a96] transition-colors duration-200"
                  >
                    {t('common.home')}
                  </Link>
                  <span className="text-gray-400" aria-hidden="true">&gt;</span>
                  <Link 
                    href="#" 
                    className="text-gray-600 hover:text-[#653a96] transition-colors duration-200"
                  >
                    {t('expandedNav.opportunities')}
                  </Link>
                  <span className="text-gray-400" aria-hidden="true">&gt;</span>
                  <span className="text-gray-800 font-medium" aria-current="page">
                    {t('expandedNav.membership') || 'Membership'}
                  </span>
                </div>
              </nav>

              {/* Page Title */}
              <h1 
                className="text-4xl md:text-4xl text-2xl text-gray-800"
                style={{
                  fontFamily: 'DM Serif Display',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '42px',
                  lineHeight: '58px',
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  textRendering: 'optimizeLegibility'
                }}
              >
                Membership
              </h1>
            </div>

          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-on-scroll">
            <h2 
              className="text-5xl text-gray-800 mb-6 animate-on-scroll"
              style={{
                fontFamily: 'DM Serif Display',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '48px',
                lineHeight: '65px',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility'
              }}
            >
              Join Our Global Community
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto animate-on-scroll">
              Become a member of ABWCI and connect with thousands of businesswomen worldwide. 
              Access exclusive resources, mentorship opportunities, and networking events.
            </p>
          </div>

          {/* Membership Benefits */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-[#653a96] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Global Network</h3>
              <p className="text-gray-600">
                Connect with businesswomen from around the world and expand your professional network.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-[#653a96] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Learning Resources</h3>
              <p className="text-gray-600">
                Access exclusive webinars, workshops, and educational materials to grow your business.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-[#653a96] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Mentorship</h3>
              <p className="text-gray-600">
                Get paired with experienced mentors who can guide you through your entrepreneurial journey.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-[#653a96] to-[#4f287b] rounded-3xl p-8 text-center text-white">
            <h3 
              className="text-3xl mb-4"
              style={{
                fontFamily: 'DM Serif Display',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '32px',
                lineHeight: '44px',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility'
              }}
            >
              Ready to Join?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Start your journey with ABWCI today and unlock endless opportunities for growth.
            </p>
            <button className="bg-[#fecb07] text-gray-800 px-8 py-3 rounded-full font-medium hover:bg-[#e6b800] transition-colors duration-200">
              Become a Member
            </button>
          </div>
          </div>
        </div>
      </div>
    </SimpleLayout>
  );
}
