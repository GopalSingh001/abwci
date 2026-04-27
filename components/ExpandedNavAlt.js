import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../lib/LanguageContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const ExpandedNavAlt = ({ showExpandedNav = false, onMouseEnter, onMouseLeave }) => {
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
      className={`absolute top-full left-0 right-0 shadow-lg z-50 rounded-b-[20px] border-b-[6px] border-[#653a96] transition-all duration-500 ease-out ${
        showExpandedNav 
          ? 'opacity-100 translate-y-0 pointer-events-auto' 
          : 'opacity-0 -translate-y-full pointer-events-none'
      }`}
      style={{
        background: 'linear-gradient(180deg, #653A96 23.08%, #201330 100%)',
        boxSizing: 'border-box',
        transformOrigin: 'top',
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={handleClick}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2 sm:py-4" onMouseEnter={onMouseEnter}>
        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-2 lg:space-y-0 lg:space-x-4 xl:space-x-6">
          {/* Logo Section */}
          <div className="flex flex-col items-center w-full lg:w-auto" onMouseEnter={onMouseEnter}>
            <Link href="/" onClick={(e) => { e.stopPropagation(); }}>
            <div className="mb-2 sm:mb-4 flex flex-col items-center">
              <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 flex items-center justify-center mb-2 sm:mb-4">
                <Image
                  src="/w-new.png"
                  alt="ABWCI Logo"
                  width={160}
                  height={160}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div className="text-center max-w-xs">
              <div className="text-white leading-tight font-medium"
              >
                <div className="mb-1"
                style={{
                  fontFamily: 'DM Serif Display, serif',
                  fontWeight: 600,
                  fontSize: 'clamp(12px, 2.5vw, 16px)',
                  lineHeight: 'clamp(12px, 2.5vw, 16px)',
                }}
                >Association of</div>
                <div className="mb-1"
                style={{
                  fontFamily: 'DM Serif Display, serif',
                  fontWeight: 600,
                  fontSize: 'clamp(12px, 2.5vw, 16px)',
                  lineHeight: 'clamp(12px, 2.5vw, 16px)',
                }}
                >Business Women in</div>
                <div
                style={{
                  fontFamily: 'DM Serif Display, serif',
                  fontWeight: 600,
                  fontSize: 'clamp(12px, 2.5vw, 16px)',
                  lineHeight: 'clamp(12px, 2.5vw, 16px)',
                }}
                >Commerce & Industry</div>
              </div>
            </div>
            </Link>
          </div>

          {/* Navigation Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4 flex-1 w-full" onMouseEnter={onMouseEnter}>
          {/* About Us */}
          <div className="space-y-1 sm:space-y-2" onMouseEnter={onMouseEnter}>
            <h3 
              className="font-bold text-center"
              style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontWeight: 700,
                fontSize: '16px',
                lineHeight: '20px',
                color: '#FECB07',
              }}
            >
              {t('expandedNav.aboutUs')}
            </h3>
            <div className="space-y-0 sm:space-y-1">
              <Link href="/about" className="block text-white hover:opacity-80 text-center transition-opacity duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '17px', padding: '8px 10px'}} onClick={(e) => { e.stopPropagation(); }}>{t('expandedNav.aboutUs')}</Link>
              <Link href="/about/global-secretariat" className="block text-white hover:opacity-80 text-center transition-opacity duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '17px', padding: '8px 10px'}} onClick={(e) => { e.stopPropagation(); }}>{t('expandedNav.globalSecretariat')}</Link>
              <Link href="/about/partnerships" className="block text-white hover:opacity-80 text-center transition-opacity duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '17px', padding: '8px 10px'}} onClick={(e) => { e.stopPropagation(); }}>{t('expandedNav.partnerships')}</Link>
              <Link href="/about/success-stories" className="block text-white hover:opacity-80 text-center transition-opacity duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '17px', padding: '8px 10px'}} onClick={(e) => { e.stopPropagation(); }}>{t('expandedNav.successStories')}</Link>
            </div>
          </div>
          

          {/* Knowledge Hub */}
          <div className="space-y-1 sm:space-y-2" onMouseEnter={onMouseEnter}>
            <h3 
              className="font-bold text-center"
              style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontWeight: 700,
                fontSize: '16px',
                lineHeight: '20px',
                color: '#FECB07',
              }}
            >
              {t('expandedNav.knowledgeHub')}
            </h3>
            <div className="space-y-0 sm:space-y-1">
              <Link href="/knowledge/blog" className="block text-white hover:opacity-80 text-center transition-opacity duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '17px', padding: '8px 10px'}} onClick={(e) => { e.stopPropagation(); }}>{t('expandedNav.blogs')}</Link>
              <Link href="/knowledge/resources" className="block text-white hover:opacity-80 text-center transition-opacity duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '17px', padding: '8px 10px'}} onClick={(e) => { e.stopPropagation(); }}>{t('expandedNav.resources')}</Link>
            </div>
          </div>

          {/* Opportunities */}
          <div className="space-y-1 sm:space-y-2" onMouseEnter={onMouseEnter}>
            <h3 
              className="font-bold text-center"
              style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontWeight: 700,
                fontSize: '16px',
                lineHeight: '20px',
                color: '#FECB07',
              }}
            >
              {t('expandedNav.opportunities')}
            </h3>
            <div className="space-y-0 sm:space-y-1">
              <Link href="/opportunities/mentorship" className="block text-white hover:opacity-80 text-center transition-opacity duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '17px', padding: '8px 10px'}} onClick={(e) => { e.stopPropagation(); }}>{t('expandedNav.mentorship')}</Link>
              <Link href="/opportunities/ai-platform" className="block text-white hover:opacity-80 text-center transition-opacity duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '17px', padding: '8px 10px'}} onClick={(e) => { e.stopPropagation(); }}>{t('expandedNav.aiPlatform')}</Link>
              <Link href="/opportunities/tenders" className="block text-white hover:opacity-80 text-center transition-opacity duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '17px', padding: '8px 10px'}} onClick={(e) => { e.stopPropagation(); }}>{t('expandedNav.tenders')}</Link>
            </div>
          </div>

          {/* Leadership */}
          <div className="space-y-1 sm:space-y-2" onMouseEnter={onMouseEnter}>
            <h3 
              className="font-bold text-center"
              style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontWeight: 700,
                fontSize: '16px',
                lineHeight: '20px',
                color: '#FECB07',
              }}
            >
              {t('expandedNav.leadership')}
            </h3>
            <div className="space-y-0 sm:space-y-1">
              <Link href="/leadership/category/global-ambassadors" className="block text-white hover:opacity-80 text-center transition-opacity duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '17px', padding: '8px 10px'}} onClick={(e) => { e.stopPropagation(); }}>{t('expandedNav.globalAmbassadors')}</Link>
              <Link href="/leadership/category/regional-presidents" className="block text-white hover:opacity-80 text-center transition-opacity duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '17px', padding: '8px 10px'}} onClick={(e) => { e.stopPropagation(); }}>{t('expandedNav.regionalPresidents')}</Link>
              <Link href="/leadership/category/state-presidents" className="block text-white hover:opacity-80 text-center transition-opacity duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '17px', padding: '8px 10px'}} onClick={(e) => { e.stopPropagation(); }}>{t('expandedNav.statePresidents')}</Link>
              <Link href="/leadership/category/global-secretariat" className="block text-white hover:opacity-80 text-center transition-opacity duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '17px', padding: '8px 10px'}} onClick={(e) => { e.stopPropagation(); }}>{t('expandedNav.globalSecretariat')}</Link>
            </div>
          </div>

          {/* Global */}
          <div className="space-y-1 sm:space-y-2" onMouseEnter={onMouseEnter}>
            <h3 
              className="font-bold text-center"
              style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontWeight: 700,
                fontSize: '16px',
                lineHeight: '20px',
                color: '#FECB07',
              }}
            >
              {t('expandedNav.global')}
            </h3>
            <div className="space-y-0 sm:space-y-1">
              <Link href="/global-presence?region=africa" className="block text-white hover:opacity-80 text-center transition-opacity duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '17px', padding: '8px 10px'}} onClick={(e) => { e.stopPropagation(); }}>{t('expandedNav.africa')}</Link>
              <Link href="/global-presence?region=asia" className="block text-white hover:opacity-80 text-center transition-opacity duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '17px', padding: '8px 10px'}} onClick={(e) => { e.stopPropagation(); }}>{t('expandedNav.asia')}</Link>
              <Link href="/global-presence?region=europe" className="block text-white hover:opacity-80 text-center transition-opacity duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '17px', padding: '8px 10px'}} onClick={(e) => { e.stopPropagation(); }}>{t('expandedNav.europe')}</Link>
              <Link href="/global-presence?region=north-america" className="block text-white hover:opacity-80 text-center transition-opacity duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '17px', padding: '8px 10px'}} onClick={(e) => { e.stopPropagation(); }}>{t('expandedNav.northAmerica')}</Link>
              <Link href="/global-presence?region=south-america" className="block text-white hover:opacity-80 text-center transition-opacity duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '17px', padding: '8px 10px'}} onClick={(e) => { e.stopPropagation(); }}>{t('expandedNav.southAmerica')}</Link>
            </div>
          </div>

          {/* Login/Register or User Account */}
          <div className="space-y-1 sm:space-y-2" onMouseEnter={onMouseEnter}>
            <h3 
              className="font-bold text-center"
              style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontWeight: 700,
                fontSize: '16px',
                lineHeight: '20px',
                color: '#FECB07',
              }}
            >
              {user ? `${user.first_name || user.username}` : t('navbar.loginRegister')}
            </h3>
            <div className="space-y-0 sm:space-y-1">
              {user ? (
                <>
                  {user.email?.toLowerCase() === 'admin' && (
                    <Link 
                      href="/admin" 
                      className="block text-white hover:opacity-80 text-center transition-opacity duration-200 font-medium" 
                      style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '17px', padding: '8px 10px'}}
                      onClick={(e) => { e.stopPropagation(); }}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleLogout(); }}
                    className="block text-left text-white hover:opacity-80 text-center transition-opacity duration-200 font-medium w-full" 
                    style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '17px', padding: '8px 10px'}}
                  >
                    Logout
                  </button>
                  <Link href="/auth/register" className="block text-white hover:opacity-80 text-center transition-opacity duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '17px', padding: '8px 10px'}} onClick={(e) => { e.stopPropagation(); }}>{t('expandedNav.becomeMentor')}</Link>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="block text-white hover:opacity-80 text-center transition-opacity duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '17px', padding: '8px 10px'}} onClick={(e) => { e.stopPropagation(); }}>{t('expandedNav.memberLogin')}</Link>
                  <Link href="/auth/register" className="block text-white hover:opacity-80 text-center transition-opacity duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '17px', padding: '8px 10px'}} onClick={(e) => { e.stopPropagation(); }}>{t('expandedNav.becomeMember')}</Link>
                  <Link href="/auth/register" className="block text-white hover:opacity-80 text-center transition-opacity duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '17px', padding: '8px 10px'}} onClick={(e) => { e.stopPropagation(); }}>{t('expandedNav.becomeMentor')}</Link>
                </>
              )}
            </div>
          </div>
          {/* Support */}
          <div className="space-y-1 sm:space-y-2" onMouseEnter={onMouseEnter}>
            <h3 
              className="font-bold text-center"
              style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontWeight: 700,
                fontSize: '16px',
                lineHeight: '20px',
                color: '#FECB07',
              }}
            >
              {t('expandedNav.support')}
            </h3>
            <div className="space-y-0 sm:space-y-1">
              <Link href="/support" className="block text-white hover:opacity-80 text-center transition-opacity duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '17px', padding: '8px 10px'}} onClick={(e) => { e.stopPropagation(); }}>{t('expandedNav.contactUs')}</Link>
              <Link href="/support" className="block text-white hover:opacity-80 text-center transition-opacity duration-200 font-medium" style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '17px', padding: '8px 10px'}} onClick={(e) => { e.stopPropagation(); }}>{t('expandedNav.faqs')}</Link>
            </div>
          </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ExpandedNavAlt;

