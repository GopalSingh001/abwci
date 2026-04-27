import PageLayout from './components/PageLayout';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useLanguage } from '../../lib/LanguageContext';

export default function About() {
  const { t } = useLanguage();
  const [pageImage, setPageImage] = useState(''); // Default fallback
  
  // Fetch about-us page image
  useEffect(() => {
    const fetchPageImage = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page-images`);
        if (response.ok) {
          const data = await response.json();
          const aboutUsImage = data.data?.find(img => img.page_name === 'about-us' && img.is_active);
          if (aboutUsImage?.image_url) {
            setPageImage(aboutUsImage.image_url);
          }
        }
      } catch (error) {
        console.log('Error fetching page image, using fallback:', error);
      }
    };
    fetchPageImage();
  }, []);
  
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
    <PageLayout title={t('expandedNav.aboutUs')}>
      <div className="bg-white md:p-8 pt-2">
        {/* Decorative Image - Desktop Only */}
        <div className="relative hidden md:block">
          <div className="absolute right-0 top-12 w-1/3 h-64 flex items-start justify-end z-10">
            <img
              src="/assets/Frame 7857 (1).png"
              alt="About Us Background"
              className="max-w-full max-h-full object-contain opacity-100"
              style={{ maxWidth: '250px', maxHeight: '250px' }}
              onError={(e) => {
                console.log('Image failed to load:', e.target.src);
                e.target.style.display = 'none';
              }}
              onLoad={() => {
                // console.log('Image loaded successfully');
              }}
            />
          </div>
        </div>

        {/* Hero Image - 2px gap after AboutNavBar */}
        <div className="mb-8 md:mb-8 mb-0">
          {/* Desktop Hero Image */}
          <div className="relative w-full h-64 rounded-2xl overflow-hidden md:block hidden">
            <Image
              src={pageImage}
              width={1000}
              height={1000}
              alt={t('expandedNav.aboutUs')}
              className="object-cover w-full"
            />
          </div>
          
          {/* Mobile Hero Image */}
          <div className="relative w-full h-[162px] overflow-hidden md:hidden block" style={{ marginTop: '1px' }}>
            <Image
              src={pageImage}
              width={390}
              height={162}
              alt={t('expandedNav.aboutUs')}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Content Sections */}
        <div className="md:space-y-8 md:pb-8">
          {/* Mobile Container */}
          <div className="md:hidden flex flex-col items-center w-full pt-0">
            <div className="w-[319px] flex flex-col gap-[40px]">
              {/* Who we are section */}
              <div className="bg-white animate-on-scroll pb-[30px] border-b border-[#616161]">
                <div className="flex flex-col items-start gap-[35px]">
                  <h2 
                    className="text-[#653a96] font-bold animate-on-scroll"
                    style={{
                      fontFamily: 'DM Serif Display, serif',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '38px',
                      lineHeight: '30px',
                      letterSpacing: '-0.04em',
                      width: '200px',
                      height: '30px',
                    }}
                  >
                    {t('about.whoWeAreTitle')}
                  </h2>
                  <div 
                    className="text-[#2B2D30]"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '22px',
                      letterSpacing: '0.01em',
                      width: '319px',
                    }}
                    dangerouslySetInnerHTML={{ __html: t('about.whoWeAreDesc') }}
                  >
                  </div>
                </div>
              </div>

              {/* Our Vision section */}
              <div className="bg-white animate-on-scroll pb-[30px]">
                <div className="flex flex-col items-start gap-[35px]">
                  <h2 
                    className="text-[#653a96] font-bold animate-on-scroll"
                    style={{
                      fontFamily: 'DM Serif Display, serif',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '38px',
                      lineHeight: '30px',
                      letterSpacing: '-0.04em',
                      width: '200px',
                      height: '30px',
                    }}
                  >
                    {t('about.ourVisionTitle')}
                  </h2>
                  <p 
                    className="text-[#2B2D30]"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '22px',
                      letterSpacing: '0.01em',
                      width: '319px',
                    }}
                  >
                    <span dangerouslySetInnerHTML={{ __html: t('about.ourVisionDesc') }}></span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Content Sections */}
          <div className="hidden md:block space-y-8">
            {/* Who we are section */}
            <div className="bg-white rounded-2xl p-8 animate-on-scroll pb-[30px]">
              <div className="flex flex-col items-start gap-[43px]">
                <div className="flex flex-col items-start gap-[35px]">
                  <h2 
                    className="text-[#653a96] font-bold animate-on-scroll"
                    style={{
                      fontFamily: 'DM Serif Display, serif',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '38px',
                      lineHeight: '30px',
                      letterSpacing: '-0.04em',
                      width: '200px',
                      height: '30px',
                    }}
                  >
                    {t('about.whoWeAreTitle')}
                  </h2>
                  <div 
                    className="text-[#2B2D30]"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '19px',
                      lineHeight: '30px',
                      letterSpacing: '0.01em',
                      width: '100%',
                      maxWidth: '100%',
                    }}
                    dangerouslySetInnerHTML={{ __html: t('about.whoWeAreDesc') }}
                  >
                  </div>
                </div>
              </div>
            </div>

            {/* Separator Line - Desktop Only */}
            <hr className="border-t border-gray-400 my-8 animate-on-scroll" style={{ borderWidth: '0.5px' }} />

            {/* Our Vision section */}
            <div className="bg-white rounded-2xl p-8 animate-on-scroll pb-[30px]">
              <div className="flex flex-col items-start gap-[43px]">
                <div className="flex flex-col items-start gap-[35px]">
                  <h2 
                    className="text-[#653a96] font-bold animate-on-scroll"
                    style={{
                      fontFamily: 'DM Serif Display, serif',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '38px',
                      lineHeight: '30px',
                      letterSpacing: '-0.04em',
                      width: '200px',
                      height: '30px',
                    }}
                  >
                    {t('about.ourVisionTitle')}
                  </h2>
                  <p 
                    className="text-[#2B2D30]"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '19px',
                      lineHeight: '30px',
                      letterSpacing: '0.01em',
                      width: '100%',
                      maxWidth: '100%',
                    }}
                    dangerouslySetInnerHTML={{ __html: t('about.ourVisionDesc') }}
                  >
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Separator Line 
          <hr className="border-t-2 border-gray-400 my-8 animate-on-scroll" />

          {/* Our Mission section 
          <div className="bg-white rounded-2xl p-8 animate-on-scroll">
            <h2 
              className="text-4xl text-[#653a96] mb-6 font-bold animate-on-scroll"
              style={{
                fontFamily: 'DM Serif Display',
                fontStyle: 'normal',
                fontWeight: 700,
                fontSize: '36px',
                lineHeight: '36px',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility'
              }}
            >
              {t('about.ourMissionTitle')}
            </h2>
            <p className="text-gray-800 text-lg leading-relaxed animate-on-scroll">
              {t('about.ourMissionDesc')}
            </p>
          </div> */}
        </div>
      </div>
    </PageLayout>
  );
}
