import Navbar from '../../../components/NavbarAlt';
import SEO from '../../../components/SEO';
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';
import Footer from '../../../components/Footer';
import AboutNavBar from './AboutNavBar';
import { useLanguage } from '../../../lib/LanguageContext';
import Link from 'next/link';

const PageLayout = ({
  children,
  title,
  showSidebar = true,
  showHeaderButton = true,
  buttonText,
  buttonOnClick,
  buttonLink,
  description,
  keywords,
  image,
  url,
}) => {
  const { t } = useLanguage();
  
  // Determine button text and link based on page title
  const getButtonConfig = () => {
    const titleLower = (title || '').toLowerCase();
    
    if (titleLower.includes('success stor')) {
      return {
        text: 'Submit a Success Story',
        link: '/auth/login'
      };
    } else if (titleLower.includes('partnership')) {
      return {
        text: 'Partner With Us',
        link: '/auth/login'
      };
    } else {
      return {
        text: t('common.contactUs'),
        link: '/support'
      };
    }
  };
  
  const buttonConfig = getButtonConfig();
  const computedButtonText = buttonText || buttonConfig.text;
  const computedButtonLink = buttonLink || buttonConfig.link;
  
  return (
    <>
    <AboutNavBar />
    <div className="min-h-screen bg-white gap-5 md:pt-0 pt-8">
      <SEO 
        title={title || 'ABWCI'}
        description={description || `ABWCI - ${title || 'Association of Business Women in Commerce & Industry'}`}
        keywords={keywords}
        image={image}
        url={url}
      />
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <div className="flex flex-col md:flex-row mb-40 md:mb-40 mb-20">
        {showSidebar && (
          <>
            {/* Desktop Sidebar - Show on tablet and desktop (md and up) */}
            <div className="hidden md:block">
              <Sidebar />
            </div>
            {/* Mobile Sidebar - Removed */}
          </>
        )}
        <main className="flex-1 md:ml-0 ml-0">
          {/* Page Header - Only in main content area */}
          <div className="bg-white hidden md:block">
            <div className="px-4 sm:px-6 lg:px-8 md:px-4 md:px-6 md:px-8 px-4 py-6 md:py-6 py-4">
              <nav className="text-sm md:text-base text-xs" aria-label="Breadcrumb"
                style={{
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '24px'
                }}>
                <div className="flex items-center space-x-2 whitespace-nowrap overflow-hidden">
                  <Link 
                    href="/" 
                    className="text-gray-600 hover:text-[#653a96] transition-colors duration-200 flex-shrink-0"
                  >
                    {t('common.home')}
                  </Link>
                  <span className="text-gray-400 flex-shrink-0" aria-hidden="true">&gt;</span>
                  <span className="text-gray-800 font-medium truncate" aria-current="page" title={title || 'Page'}>
                    {title || 'Page'}
                  </span>
                </div>
              </nav>
              
              <div className="mt-4 md:mt-4 mt-4 flex flex-row items-start justify-between gap-4">
                <h1 
                  className="text-6xl md:text-6xl text-2xl font-serif text-black mb-4 md:mb-4 mb-2" style={{fontFamily: 'DM Serif Display, serif', fontWeight: 400,
                    fontSize: '46px',
                    lineHeight: '46px'
                  }} >
                
                  {title || 'Page'}
                </h1>
                {showHeaderButton && (
                  buttonOnClick ? (
                    <button
                      type="button"
                      onClick={buttonOnClick}
                      className="bg-[#fecb07] mr-4 mt-0 self-start text-gray-900 px-4 py-2 md:px-6 md:py-2 px-3 py-1.5 rounded-full font-medium hover:bg-[#e6b800] transition-colors duration-200 flex items-center space-x-1 md:space-x-2 border border-gray-800"
                    >
                      <span className="text-xs md:text-sm">{computedButtonText}</span>
                      <svg width="16" height="16" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'scaleX(-1)' }} className="md:w-5 md:h-5 w-4 h-4">
                        <path d="M28.3346 15.5827H11.0938L19.013 7.66352L17.0013 5.66602L5.66797 16.9993L17.0013 28.3327L18.9988 26.3352L11.0938 18.416H28.3346V15.5827Z" fill="#000000"/>
                      </svg>
                    </button>
                  ) : (
                    <Link href={computedButtonLink}>
                      <button className="bg-[#fecb07] mr-4 mt-0 self-start text-gray-900 px-4 py-2 md:px-6 md:py-2 px-3 py-1.5 rounded-full font-medium hover:bg-[#e6b800] transition-colors duration-200 flex items-center space-x-1 md:space-x-2 border border-gray-800">
                        <span className="text-xs md:text-sm">{computedButtonText}</span>
                        <svg width="16" height="16" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'scaleX(-1)' }} className="md:w-5 md:h-5 w-4 h-4">
                          <path d="M28.3346 15.5827H11.0938L19.013 7.66352L17.0013 5.66602L5.66797 16.9993L17.0013 28.3327L18.9988 26.3352L11.0938 18.416H28.3346V15.5827Z" fill="#000000"/>
                        </svg>
                      </button>
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>
          
          {/* Page Content */}
          {children}
        </main>
      </div>

      {/* Footer */}
      <Footer />

      <a
          href={`https://wa.me/9810485280?text=${encodeURIComponent(t('common.whatsappHelp'))}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="fixed bottom-4 right-4 z-50 group px-2"
        >
          <div className="flex items-center justify-center gap-2 bg-[#009A49] text-white rounded-[22px] shadow-lg px-5 py-2 hover:shadow-xl transition-all duration-500 ease-in-out whatsapp-button">
            <span className="text-sm font-medium transition-all duration-500 ease-in-out whatsapp-text" style={{fontFamily:'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight:500, fontSize:'15px', lineHeight:'18px'}}>
            {t('common.whatsappHelp')}
            </span>
            {/* WhatsApp SVG Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 256 258"
              className="flex-shrink-0 whatsapp-icon"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="wappG1" x1="50%" x2="50%" y1="100%" y2="0%">
                  <stop offset="0%" stopColor="#1faf38"/>
                  <stop offset="100%" stopColor="#60d669"/>
                </linearGradient>
                <linearGradient id="wappG2" x1="50%" x2="50%" y1="100%" y2="0%">
                  <stop offset="0%" stopColor="#f9f9f9"/>
                  <stop offset="100%" stopColor="#ffffff"/>
                </linearGradient>
              </defs>
              <path fill="url(#wappG1)" d="M5.463 127.456c-.006 21.677 5.658 42.843 16.428 61.499L4.433 252.697l65.232-17.104a123 123 0 0 0 58.8 14.97h.054c67.815 0 123.018-55.183 123.047-123.01c.013-32.867-12.775-63.773-36.009-87.025c-23.23-23.25-54.125-36.061-87.043-36.076c-67.823 0-123.022 55.18-123.05 123.004"/>
              <path fill="url(#wappG2)" d="M1.07 127.416c-.007 22.457 5.86 44.38 17.014 63.704L0 257.147l67.571-17.717c18.618 10.151 39.58 15.503 60.91 15.511h.055c70.248 0 127.434-57.168 127.464-127.423c.012-34.048-13.236-66.065-37.3-90.15C194.633 13.286 162.633.014 128.536 0C58.276 0 1.099 57.16 1.071 127.416m40.24 60.376l-2.523-4.005c-10.606-16.864-16.204-36.352-16.196-56.363C22.614 69.029 70.138 21.52 128.576 21.52c28.3.012 54.896 11.044 74.9 31.06c20.003 20.018 31.01 46.628 31.003 74.93c-.026 58.395-47.551 105.91-105.943 105.91h-.042c-19.013-.01-37.66-5.116-53.922-14.765l-3.87-2.295l-40.098 10.513z"/>
              <path fill="#fff" d="M96.678 74.148c-2.386-5.303-4.897-5.41-7.166-5.503c-1.858-.08-3.982-.074-6.104-.074c-2.124 0-5.575.799-8.492 3.984c-2.92 3.188-11.148 10.892-11.148 26.561s11.413 30.813 13.004 32.94c1.593 2.123 22.033 35.307 54.405 48.073c26.904 10.609 32.379 8.499 38.218 7.967c5.84-.53 18.844-7.702 21.497-15.139c2.655-7.436 2.655-13.81 1.859-15.142c-.796-1.327-2.92-2.124-6.105-3.716s-18.844-9.298-21.763-10.361c-2.92-1.062-5.043-1.592-7.167 1.597c-2.124 3.184-8.223 10.356-10.082 12.48c-1.857 2.129-3.716 2.394-6.9.801c-3.187-1.598-13.444-4.957-25.613-15.806c-9.468-8.442-15.86-18.867-17.718-22.056c-1.858-3.184-.199-4.91 1.398-6.497c1.431-1.427 3.186-3.719 4.78-5.578c1.588-1.86 2.118-3.187 3.18-5.311c1.063-2.126.531-3.986-.264-5.579c-.798-1.593-6.987-17.343-9.819-23.64"/>
            </svg>
          </div>
        </a>
    </div>
    </>
  );
};

export default PageLayout;
