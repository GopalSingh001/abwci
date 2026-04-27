import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../lib/LanguageContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const ExpandedNav = ({ showExpandedNav = false, onMouseEnter, onMouseLeave }) => {
  const { t } = useLanguage();
  const router = useRouter();
  const [user, setUser] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    if (authToken && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    // Force a full page reload to update all components
    window.location.href = '/';
  };
  
  const handleClick = (e) => {
    // Prevent the click from bubbling up and closing the ExpandedNav
    e.stopPropagation();
  };
  
  return (
    <div 
      className={`absolute top-full left-0 right-0 bg-white shadow-lg z-40 rounded-b-xl border-b-4 border-[#653a96] pb-1 ${
        showExpandedNav 
          ? 'opacity-100 translate-y-0 pointer-events-auto' 
          : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}
      style={{
        transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'opacity, transform',
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={handleClick}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2 sm:py-4">
        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-4 lg:space-y-0 lg:space-x-8 xl:space-x-16">
          {/* Logo Section */}
          <div className="flex flex-col items-center w-full lg:w-auto">
            <Link href="/">
            <div className="mb-2 sm:mb-4 flex flex-col items-center">
              <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 flex items-center justify-center mb-2 sm:mb-4">
                <Image
                  src="/assets/whoweare.png"
                  alt="ABWCI Logo"
                  width={160}
                  height={160}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div className="text-center max-w-xs">
              <div className="text-gray-800 leading-tight font-medium"
              >
                <div className="mb-1"
                style={{
                  fontFamily: 'DM Serif Display',
                  fontWeight: 700,
                  fontSize: 'clamp(12px, 2.5vw, 16px)',
                  lineHeight: 'clamp(12px, 2.5vw, 16px)',
                }}
                >Association of</div>
                <div className="mb-1"
                style={{
                  fontFamily: 'DM Serif Display',
                  fontWeight: 700,
                  fontSize: 'clamp(12px, 2.5vw, 16px)',
                  lineHeight: 'clamp(12px, 2.5vw, 16px)',
                }}
                >Business Women in</div>
                <div
                style={{
                  fontFamily: 'DM Serif Display',
                  fontWeight: 700,
                  fontSize: 'clamp(12px, 2.5vw, 16px)',
                  lineHeight: 'clamp(12px, 2.5vw, 16px)',
                }}
                >Commerce & Industry</div>
              </div>
            </div>
            </Link>
          </div>

          {/* Navigation Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8 flex-1 w-full">
          {/* About Us */}
          <div className="space-y-2 sm:space-y-4">
            <h3 
              className="text-[#653a96] font-bold"
              style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(14px, 2vw, 16px)',
                lineHeight: 'clamp(18px, 2.5vw, 22px)'
              }}
            >
              {t('expandedNav.aboutUs')}
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <Link href="/about" className="block text-gray-700 hover:text-[#653a96] text-xs sm:text-sm transition-colors duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: 'clamp(12px, 1.8vw, 14px)', lineHeight: 'clamp(16px, 2.2vw, 18px)'}}>{t('expandedNav.aboutUs')}</Link>
              <Link href="/about/global-secretariat" className="block text-gray-700 hover:text-[#653a96] text-xs sm:text-sm transition-colors duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: 'clamp(12px, 1.8vw, 14px)', lineHeight: 'clamp(16px, 2.2vw, 18px)'}}>{t('expandedNav.globalSecretariat')}</Link>
              <Link href="/about/partnerships" className="block text-gray-700 hover:text-[#653a96] text-xs sm:text-sm transition-colors duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: 'clamp(12px, 1.8vw, 14px)', lineHeight: 'clamp(16px, 2.2vw, 18px)'}}>{t('expandedNav.partnerships')}</Link>
              <Link href="/about/success-stories" className="block text-gray-700 hover:text-[#653a96] text-xs sm:text-sm transition-colors duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: 'clamp(12px, 1.8vw, 14px)', lineHeight: 'clamp(16px, 2.2vw, 18px)'}}>{t('expandedNav.successStories')}</Link>
            </div>
          </div>
          

          {/* Knowledge Hub */}
          <div className="space-y-2 sm:space-y-4">
            <h3 
              className="text-[#653a96] font-bold"
              style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(14px, 2vw, 16px)',
                lineHeight: 'clamp(18px, 2.5vw, 22px)'
              }}
            >
              {t('expandedNav.knowledgeHub')}
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <Link href="/knowledge/blog" className="block text-gray-700 hover:text-[#653a96] text-xs sm:text-sm transition-colors duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: 'clamp(12px, 1.8vw, 14px)', lineHeight: 'clamp(16px, 2.2vw, 18px)'}}>{t('expandedNav.blogs')}</Link>
              <Link href="/knowledge/resources" className="block text-gray-700 hover:text-[#653a96] text-xs sm:text-sm transition-colors duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: 'clamp(12px, 1.8vw, 14px)', lineHeight: 'clamp(16px, 2.2vw, 18px)'}}>{t('expandedNav.resources')}</Link>
            </div>
          </div>

          {/* Opportunities */}
          <div className="space-y-2 sm:space-y-4">
            <h3 
              className="text-[#653a96] font-bold"
              style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(14px, 2vw, 16px)',
                lineHeight: 'clamp(18px, 2.5vw, 22px)'
              }}
            >
              {t('expandedNav.opportunities')}
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <Link href="/opportunities/mentorship" className="block text-gray-700 hover:text-[#653a96] text-xs sm:text-sm transition-colors duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: 'clamp(12px, 1.8vw, 14px)', lineHeight: 'clamp(16px, 2.2vw, 18px)'}}>{t('expandedNav.mentorship')}</Link>
              {/* <Link href="/opportunities/membership" className="block text-gray-700 hover:text-[#653a96] text-xs sm:text-sm transition-colors duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: 'clamp(12px, 1.8vw, 14px)', lineHeight: 'clamp(16px, 2.2vw, 18px)'}}>Membership</Link> */}
              <Link href="/opportunities/ai-platform" className="block text-gray-700 hover:text-[#653a96] text-xs sm:text-sm transition-colors duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: 'clamp(12px, 1.8vw, 14px)', lineHeight: 'clamp(16px, 2.2vw, 18px)'}}>{t('expandedNav.aiPlatform')}</Link>
              <Link href="/opportunities/tenders" className="block text-gray-700 hover:text-[#653a96] text-xs sm:text-sm transition-colors duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: 'clamp(12px, 1.8vw, 14px)', lineHeight: 'clamp(16px, 2.2vw, 18px)'}}>{t('expandedNav.tenders')}</Link>
            </div>
          </div>

          {/* Leadership */}
          <div className="space-y-2 sm:space-y-4">
            <h3 
              className="text-[#653a96] font-bold"
              style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(14px, 2vw, 16px)',
                lineHeight: 'clamp(18px, 2.5vw, 22px)'
              }}
            >
              {t('expandedNav.leadership')}
            </h3>
            <div className="space-y-1 sm:space-y-2">
              <Link href="/leadership" className="block text-gray-700 hover:text-[#653a96] text-xs sm:text-sm transition-colors duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: 'clamp(12px, 1.8vw, 14px)', lineHeight: 'clamp(16px, 2.2vw, 18px)'}}>{t('expandedNav.allLeaderships')}</Link>
              <Link href="/leadership/category/global-ambassadors" className="block text-gray-700 hover:text-[#653a96] text-xs sm:text-sm transition-colors duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: 'clamp(12px, 1.8vw, 14px)', lineHeight: 'clamp(16px, 2.2vw, 18px)'}}>{t('expandedNav.globalAmbassadors')}</Link>
              <Link href="/leadership/category/regional-presidents" className="block text-gray-700 hover:text-[#653a96] text-xs sm:text-sm transition-colors duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: 'clamp(12px, 1.8vw, 14px)', lineHeight: 'clamp(16px, 2.2vw, 18px)'}}>{t('expandedNav.regionalPresidents')}</Link>
              <Link href="/leadership/category/state-presidents" className="block text-gray-700 hover:text-[#653a96] text-xs sm:text-sm transition-colors duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: 'clamp(12px, 1.8vw, 14px)', lineHeight: 'clamp(16px, 2.2vw, 18px)'}}>{t('expandedNav.statePresidents')}</Link>
              <Link href="/leadership/category/global-secretariat" className="block text-gray-700 hover:text-[#653a96] text-xs sm:text-sm transition-colors duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: 'clamp(12px, 1.8vw, 14px)', lineHeight: 'clamp(16px, 2.2vw, 18px)'}}>{t('expandedNav.globalSecretariat')}</Link>
            </div>
          </div>

          {/* Global */}
          <div className="space-y-2 sm:space-y-4">
            <h3 
              className="text-[#653a96] font-bold"
              style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(14px, 2vw, 16px)',
                lineHeight: 'clamp(18px, 2.5vw, 22px)'
              }}
            >
              {t('expandedNav.global')}
            </h3>
            <div className="space-y-1">
            {/* <Link href="/global-presence" className="block text-gray-700 hover:text-[#653a96] text-xs transition-colors duration-200 font-medium">Global Presence</Link> */}
              <Link href="/global-presence?region=africa" className="block text-gray-700 hover:text-[#653a96] text-xs sm:text-sm transition-colors duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: 'clamp(12px, 1.8vw, 14px)', lineHeight: 'clamp(16px, 2.2vw, 18px)'}}>{t('expandedNav.africa')}</Link>
              <Link href="/global-presence?region=asia" className="block text-gray-700 hover:text-[#653a96] text-xs sm:text-sm transition-colors duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: 'clamp(12px, 1.8vw, 14px)', lineHeight: 'clamp(16px, 2.2vw, 18px)'}}>{t('expandedNav.asia')}</Link>
              <Link href="/global-presence?region=europe" className="block text-gray-700 hover:text-[#653a96] text-xs sm:text-sm transition-colors duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: 'clamp(12px, 1.8vw, 14px)', lineHeight: 'clamp(16px, 2.2vw, 18px)'}}>{t('expandedNav.europe')}</Link>
              <Link href="/global-presence?region=north-america" className="block text-gray-700 hover:text-[#653a96] text-xs sm:text-sm transition-colors duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: 'clamp(12px, 1.8vw, 14px)', lineHeight: 'clamp(16px, 2.2vw, 18px)'}}>{t('expandedNav.northAmerica')}</Link>
              <Link href="/global-presence?region=south-america" className="block text-gray-700 hover:text-[#653a96] text-xs sm:text-sm transition-colors duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: 'clamp(12px, 1.8vw, 14px)', lineHeight: 'clamp(16px, 2.2vw, 18px)'}}>{t('expandedNav.southAmerica')}</Link>
            </div>
          </div>

          {/* Login/Register or User Account */}
          <div className="space-y-2 sm:space-y-4">
            <h3 
              className="text-[#653a96] font-bold"
              style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(14px, 2vw, 16px)',
                lineHeight: 'clamp(18px, 2.5vw, 22px)'
              }}
            >
              {user ? `${user.first_name || user.username}` : t('navbar.loginRegister')}
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {user ? (
                <>
                  <Link 
                    href="/admin" 
                    className="block text-gray-700 hover:text-[#653a96] text-xs sm:text-sm transition-colors duration-200 font-medium" 
                    style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: 'clamp(12px, 1.8vw, 14px)', lineHeight: 'clamp(16px, 2.2vw, 18px)'}}
                  >
                    Admin Dashboard
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="block text-left text-gray-700 hover:text-[#653a96] text-xs sm:text-sm transition-colors duration-200 font-medium w-full" 
                    style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: 'clamp(12px, 1.8vw, 14px)', lineHeight: 'clamp(16px, 2.2vw, 18px)'}}
                  >
                    Logout
                  </button>
                  <Link href="/become-mentor" className="block text-gray-700 hover:text-[#653a96] text-xs sm:text-sm transition-colors duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: 'clamp(12px, 1.8vw, 14px)', lineHeight: 'clamp(16px, 2.2vw, 18px)'}}>{t('expandedNav.becomeMentor')}</Link>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="block text-gray-700 hover:text-[#653a96] text-xs sm:text-sm transition-colors duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: 'clamp(12px, 1.8vw, 14px)', lineHeight: 'clamp(16px, 2.2vw, 18px)'}}>{t('expandedNav.memberLogin')}</Link>
                  <Link href="/auth/register" className="block text-gray-700 hover:text-[#653a96] text-xs sm:text-sm transition-colors duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: 'clamp(12px, 1.8vw, 14px)', lineHeight: 'clamp(16px, 2.2vw, 18px)'}}>{t('expandedNav.becomeMember')}</Link>
                  <Link href="/become-mentor" className="block text-gray-700 hover:text-[#653a96] text-xs sm:text-sm transition-colors duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: 'clamp(12px, 1.8vw, 14px)', lineHeight: 'clamp(16px, 2.2vw, 18px)'}}>{t('expandedNav.becomeMentor')}</Link>
                </>
              )}
            </div>
          </div>
          {/* Support */}
          <div className="space-y-2 sm:space-y-4">
            <h3 
              className="text-[#653a96] font-bold"
              style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(14px, 2vw, 16px)',
                lineHeight: 'clamp(18px, 2.5vw, 22px)'
              }}
            >
              {t('expandedNav.support')}
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <Link href="/support" className="block text-gray-700 hover:text-[#653a96] text-xs sm:text-sm transition-colors duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: 'clamp(12px, 1.8vw, 14px)', lineHeight: 'clamp(16px, 2.2vw, 18px)'}}>{t('expandedNav.contactUs')}</Link>
              <Link href="/support" className="block text-gray-700 hover:text-[#653a96] text-xs sm:text-sm transition-colors duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: 'clamp(12px, 1.8vw, 14px)', lineHeight: 'clamp(16px, 2.2vw, 18px)'}}>{t('expandedNav.faqs')}</Link>
            </div>
          </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ExpandedNav;