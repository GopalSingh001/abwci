// import SimpleLayout from '../knowledge/components/SimpleLayout';
import Layout from '../../components/Layout';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useLanguage } from '../../lib/LanguageContext';

export default function AIPlatform() {
  const { t } = useLanguage();
  const [activeKeyFeature, setActiveKeyFeature] = useState(null);
  const [keyFeaturesLoading, setKeyFeaturesLoading] = useState(true);
  const [dynamicKeyFeatures, setDynamicKeyFeatures] = useState([]);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSubmitting, setWaitlistSubmitting] = useState(false);
  const [waitlistResult, setWaitlistResult] = useState(null);

  useEffect(() => {
    fetchKeyFeatures();
  }, []);
  
  const fetchKeyFeatures = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/key-features`);
      if (response.ok) {
        const data = await response.json();
        setDynamicKeyFeatures(data.data || []);
      } else {
        console.log('Using fallback key feature images');
        setDynamicKeyFeatures([]);
      }
    } catch (error) {
      console.log('Error fetching key features, using fallback:', error);
      setDynamicKeyFeatures([]);
    } finally {
      setKeyFeaturesLoading(false);
    }
  };
  const getFeatureImage = (featureKey) => {
    const fallbackImages = {
      capacity: '/assets/key-feature/capacity-bg.png',
      mentorship: '/assets/key-feature/mentorship-bg.png',
      finance: '/assets/key-feature/finance-bg.png',
      visibility: '/assets/key-feature/visibility-bg.png',
      technology: '/assets/key-feature/technology-bg.png',
      crossborder: '/assets/key-feature/crossborder-bg.png'
    };

    if (keyFeaturesLoading) {
      return fallbackImages[featureKey] || fallbackImages.capacity;
    }
    
    if (dynamicKeyFeatures.length > 0) {
      const feature = dynamicKeyFeatures.find(f => f.feature_key === featureKey && f.is_active);
      return feature?.image_url || fallbackImages[featureKey] || fallbackImages.capacity;
    }
    
    return fallbackImages[featureKey] || fallbackImages.capacity;
  };
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
    <Layout title={t('expandedNav.aiPlatform')}>
      <div className="min-h-screen bg-gradient-to-b from-white via-white to-[#653a96]">
        {/* Go Back Button - Smaller on Mobile */}
        <div className="mt-10 ml-10 md:mt-10 md:ml-10 mt-6 ml-4">
          <div className="mb-6 md:mb-6 mb-4">
            <button 
              onClick={() => window.history.back()}
              className="flex items-center space-x-2 md:space-x-3 text-gray-700 hover:text-[#653a96] transition-all duration-300"
            >
              <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm md:text-lg font-medium">{t('common.goBack')}</span>
            </button>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 md:px-0">
          {/* Hero Section with Mac Image */}
          <section className="py-15 md:py-15 py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Version */}
          <div className="hidden md:block">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
              {/* Text Content - Left Side */}
              <div className="order-2 lg:order-1 lg:pr-8">
                <h2 className="text-4xl lg:text-5xl font-serif text-black mb-6 animate-on-scroll">
                  <div style={{fontFamily: 'DM Serif Display, serif', fontWeight: 400}}>{t('homepage.sections.onePlatform')}</div>
                  <div className="text-[#653a96] font-bold" style={{fontFamily: 'DM Serif Display, serif', fontWeight: 400}}>{t('homepage.sections.allBusinesswomen')}</div>
                </h2>
                <p className="text-lg text-gray-800 mb-8 text-3xl animate-on-scroll"
                style={{
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontWeight: 400,
                  fontSize: '18px',
                  lineHeight: '24px'
                }}
                >
                  {t('homepage.sections.yourAIEnabledPlatform')}
                  <br /> {t('homepage.sections.scalingBusinesses')}
                </p>
              
              {/* Features List */}
              <div className="space-y-6 mb-8">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-[#653a96] rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <Image
                      src="/assets/mdi_plant.png"
                      alt="Growth"
                      width={20}
                      height={20}
                      className="filter brightness-0 invert"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-3xl text-black mb-2 animate-on-scroll"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontWeight: 500,
                      fontSize: '20px',
                      lineHeight: '24px'
                    }}
                    >{t('homepage.sections.entrepreneurialGrowth')}</h3>
                    <p className="text-sm text-gray-800 text-4xl"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '24px'
                    }}
                    >
                      {t('homepage.sections.accessToMentorship')}
                      <br /> {t('homepage.sections.funding')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-[#653a96] rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <Image
                      src="/assets/material-symbols_digital-wellbeing.png"
                      alt="Wellbeing"
                      width={20}
                      height={20}
                      className="filter brightness-0 invert"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-3xl text-black mb-2 animate-on-scroll"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontWeight: 500,
                      fontSize: '20px',
                      lineHeight: '24px'
                    }}
                    >{t('homepage.sections.wealthWellBeing')}</h3>
                    <p className="text-sm text-gray-800 text-4xl"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '24px'
                    }}
                    >
                      {t('homepage.sections.accessPremiumRewards')}
                      <br /> {t('homepage.sections.smartInvestment')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-[#653a96] rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <Image
                      src="/assets/fluent_people-community-20-filled.png"
                      alt="Community"
                      width={20}
                      height={20}
                      className="filter brightness-0 invert"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-3xl text-black mb-2 animate-on-scroll"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontWeight: 500,
                      fontSize: '20px',
                      lineHeight: '24px'
                    }}
                    >{t('homepage.sections.communityGlobalInfluence')}</h3>
                    <p className="text-sm text-gray-800 text-4xl"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '24px'
                    }}
                    >
                      {t('homepage.sections.globalNetwork')}
                      <br /> {t('homepage.sections.forums')}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 animate-on-scroll">
                <input
                  type="email"
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-5 py-3 bg-white border border-gray-300 rounded-full text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#653a96] focus:border-transparent"
                  style={{
                    fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '20px'
                  }}
                />
                <button
                  onClick={async () => {
                    const emailTrimmed = waitlistEmail.trim();
                    if (!emailTrimmed) {
                      setWaitlistResult({ type: 'error', message: 'Please enter your email address.' });
                      return;
                    }
                    if (!/\S+@\S+\.\S+/.test(emailTrimmed)) {
                      setWaitlistResult({ type: 'error', message: 'Please enter a valid email address.' });
                      return;
                    }
                    
                    setWaitlistSubmitting(true);
                    setWaitlistResult(null);
                    
                    try {
                      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/waitlist`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email: emailTrimmed }),
                      });
                      
                      const data = await response.json();
                      
                      if (response.ok && data.success) {
                        setWaitlistResult({ type: 'success', message: 'Successfully joined the waitlist!' });
                        setWaitlistEmail('');
                      } else {
                        setWaitlistResult({ type: 'error', message: data.message || 'Failed to join waitlist. Please try again.' });
                      }
                    } catch (error) {
                      console.error('Waitlist submission error:', error);
                      setWaitlistResult({ type: 'error', message: 'Failed to join waitlist. Please try again.' });
                    } finally {
                      setWaitlistSubmitting(false);
                    }
                  }}
                  disabled={waitlistSubmitting}
                  className="bg-[#fecb07] text-center text-sm font-bold text-3xl text-black px-8 py-3 rounded-full hover:bg-yellow-400 transition-colors duration-200 inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                    fontWeight: 600,
                    fontSize: '16px',
                    lineHeight: '24px'
                  }}
                >
                  {waitlistSubmitting ? 'Joining...' : t('homepage.sections.joinWaitlist')}
                  {!waitlistSubmitting && (
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
              </div>
              {waitlistResult && (
                <div className={`mt-3 px-4 py-2 rounded-lg text-sm ${
                  waitlistResult.type === 'success' 
                    ? 'bg-green-100 text-green-800 border border-green-300' 
                    : 'bg-red-100 text-red-800 border border-red-300'
                }`}
                style={{
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '18px'
                }}>
                  {waitlistResult.message}
                </div>
              )}
            </div>
            
            {/* Laptop Image - Right Side */}
            <div className="order-1 lg:order-2 lg:-mr-32 lg:pr-0">
              <div className="relative animate-on-scroll">
                <Image
                  src="/assets/demo-mac.png"
                  alt="Platform Demo"
                  width={1400}
                  height={1050}
                  className="w-full h-auto max-w-none"
                />
              </div>
            </div>
            </div>
          </div>

          {/* Mobile Version */}
          <div className="md:hidden px-4">
            <div className="text-center mb-8">
              <h2 className="text-black mb-4 animate-on-scroll">
                <div style={{
                  fontFamily: 'DM Serif Display, serif',
                  fontWeight: 400,
                  fontSize: '28px',
                  lineHeight: '32px'
                }}>
                  {t('homepage.sections.onePlatform')}
                </div>
                <div className="text-[#653a96] font-bold" style={{
                  fontFamily: 'DM Serif Display, serif',
                  fontWeight: 400,
                  fontSize: '24px',
                  lineHeight: '28px'
                }}>
                  {t('homepage.sections.allBusinesswomen')}
                </div>
              </h2>
              <p className="text-gray-800 mb-6 animate-on-scroll"
              style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '20px'
              }}
              >
                {t('homepage.sections.yourAIEnabledPlatform')}
                <br /> {t('homepage.sections.scalingBusinesses')}
              </p>
            </div>

            {/* Mobile Features List */}
            <div className="space-y-4 mb-6 animate-on-scroll">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-[#653a96] rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  <Image
                    src="/assets/mdi_plant.png"
                    alt="Growth"
                    width={16}
                    height={16}
                    className="filter brightness-0 invert"
                  />
                </div>
                <div>
                  <h3 className="text-black mb-1 animate-on-scroll"
                  style={{
                    fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                    fontWeight: 500,
                    fontSize: '16px',
                    lineHeight: '20px'
                  }}
                  >{t('homepage.sections.entrepreneurialGrowth')}</h3>
                  <p className="text-gray-800 text-sm"
                  style={{
                    fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '18px'
                  }}
                  >
                    {t('homepage.sections.accessToMentorship')}
                    <br /> {t('homepage.sections.funding')}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-6 h-6 bg-[#653a96] rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  <Image
                    src="/assets/material-symbols_digital-wellbeing.png"
                    alt="Wellbeing"
                    width={16}
                    height={16}
                    className="filter brightness-0 invert"
                  />
                </div>
                <div>
                  <h3 className="text-black mb-1 animate-on-scroll"
                  style={{
                    fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                    fontWeight: 500,
                    fontSize: '16px',
                    lineHeight: '20px'
                  }}
                  >{t('homepage.sections.wealthWellBeing')}</h3>
                  <p className="text-gray-800 text-sm"
                  style={{
                    fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '18px'
                  }}
                  >
                    {t('homepage.sections.accessPremiumRewards')}
                    <br /> {t('homepage.sections.smartInvestment')}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-6 h-6 bg-[#653a96] rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  <Image
                    src="/assets/fluent_people-community-20-filled.png"
                    alt="Community"
                    width={16}
                    height={16}
                    className="filter brightness-0 invert"
                  />
                </div>
                <div>
                  <h3 className="text-black mb-1 animate-on-scroll"
                  style={{
                    fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                    fontWeight: 500,
                    fontSize: '16px',
                    lineHeight: '20px'
                  }}
                  >{t('homepage.sections.communityGlobalInfluence')}</h3>
                  <p className="text-gray-800 text-sm"
                  style={{
                    fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '18px'
                  }}
                  >
                    {t('homepage.sections.globalNetwork')}
                    <br /> {t('homepage.sections.forums')}
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Email and Button */}
            <div className="flex flex-col gap-3 animate-on-scroll">
              <input
                type="email"
                value={waitlistEmail}
                onChange={(e) => setWaitlistEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#653a96] focus:border-transparent"
                style={{
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '18px'
                }}
              />
              <button
                onClick={async () => {
                  const emailTrimmed = waitlistEmail.trim();
                  if (!emailTrimmed) {
                    setWaitlistResult({ type: 'error', message: 'Please enter your email address.' });
                    return;
                  }
                  if (!/\S+@\S+\.\S+/.test(emailTrimmed)) {
                    setWaitlistResult({ type: 'error', message: 'Please enter a valid email address.' });
                    return;
                  }
                  
                  setWaitlistSubmitting(true);
                  setWaitlistResult(null);
                  
                  try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/waitlist`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ email: emailTrimmed }),
                    });
                    
                    const data = await response.json();
                    
                    if (response.ok && data.success) {
                      setWaitlistResult({ type: 'success', message: 'Successfully joined the waitlist!' });
                      setWaitlistEmail('');
                    } else {
                      setWaitlistResult({ type: 'error', message: data.message || 'Failed to join waitlist. Please try again.' });
                    }
                  } catch (error) {
                    console.error('Waitlist submission error:', error);
                    setWaitlistResult({ type: 'error', message: 'Failed to join waitlist. Please try again.' });
                  } finally {
                    setWaitlistSubmitting(false);
                  }
                }}
                disabled={waitlistSubmitting}
                className="bg-[#fecb07] text-center text-xs font-bold text-black px-4 py-2 rounded-full hover:bg-yellow-400 transition-colors duration-200 inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontWeight: 600,
                  fontSize: '12px',
                  lineHeight: '16px'
                }}
              >
                {waitlistSubmitting ? 'Joining...' : t('homepage.sections.joinWaitlist')}
                {!waitlistSubmitting && (
                  <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>
              {waitlistResult && (
                <div className={`px-3 py-2 rounded-lg text-xs ${
                  waitlistResult.type === 'success' 
                    ? 'bg-green-100 text-green-800 border border-green-300' 
                    : 'bg-red-100 text-red-800 border border-red-300'
                }`}
                style={{
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontWeight: 400,
                  fontSize: '12px',
                  lineHeight: '16px'
                }}>
                  {waitlistResult.message}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 md:py-16 py-8 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Version */}
          <div className="hidden md:block">
            <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl text-[#653a96] mb-6 animate-on-scroll" style={{fontFamily: 'DM Serif Display, serif', fontWeight: 400,
              fontSize: '42px',
              lineHeight: '45px'
            }}>
                {t('homepage.sections.keyFeatures')}
              </h2>
            </div>

            {/* Key Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            {/* Row 1 */}
            <div 
              className="relative rounded-2xl overflow-hidden h-72 group cursor-pointer animate-on-scroll"
              onClick={() => setActiveKeyFeature(activeKeyFeature === 'capacity' ? null : 'capacity')}
            >
              <Image
                src={getFeatureImage('capacity')}
                alt="Capacity Building"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-end p-8 mb-4">
              <div>
                  <Image
                    src="/assets/key-feature/hat.png"
                    alt="Education"
                    width={56}
                    height={56}
                    className="mb-5"
                  />
                  <h3 className="text-2xl font-medium">{t('homepage.features.capacity')}</h3>
                </div>
              </div>
            </div>
            
            <div 
              className="relative rounded-2xl overflow-hidden h-72 group cursor-pointer animate-on-scroll"
              onClick={() => setActiveKeyFeature(activeKeyFeature === 'mentorship' ? null : 'mentorship')}
            >
              <Image
                src={getFeatureImage('mentorship')}
                alt="Mentorship"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-end p-8">
                 <div>
                  <Image
                    src="/assets/key-feature/laptop.png"
                    alt="Mentor"
                    width={56}
                    height={56}
                    className="mb-5"
                  />
                  <h3 className="text-2xl font-medium">{t('homepage.features.mentorship')}</h3>
                </div> 
              </div>
            </div>
            
            <div 
              className="relative rounded-2xl overflow-hidden h-72 group cursor-pointer animate-on-scroll"
              onClick={() => setActiveKeyFeature(activeKeyFeature === 'finance' ? null : 'finance')}
            >
              <Image
                src={getFeatureImage('finance')}
                alt="Access to Finance"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0  flex items-end p-8">
                 <div>
                  <Image
                    src="/assets/key-feature/growth.png"
                    alt="Finance"
                    width={56}
                    height={56}
                    className="mb-5"
                  />
                  <h3 className="text-2xl font-medium">{t('homepage.features.finance')}</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Row 2 */}
            <div 
              className="relative rounded-2xl overflow-hidden h-72 group cursor-pointer animate-on-scroll"
              onClick={() => setActiveKeyFeature(activeKeyFeature === 'visibility' ? null : 'visibility')}
            >
              <Image
                src={getFeatureImage('visibility')}
                alt="Visibility"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0  flex items-end p-8">
                <div>
                  <Image
                    src="/assets/key-feature/gis--story-map.png"
                    alt="Story"
                    width={56}
                    height={56}
                    className="mb-5"
                  />
                  <h3 className="text-2xl font-medium">{t('homepage.features.visibility')}</h3>
                </div>
              </div>
            </div>
            
            <div 
              className="relative rounded-2xl overflow-hidden h-72 group cursor-pointer animate-on-scroll"
              onClick={() => setActiveKeyFeature(activeKeyFeature === 'technology' ? null : 'technology')}
            >
              <Image
                src={getFeatureImage('technology')}
                alt="Technology"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0  flex items-end p-8 mb-6">
                <div>
                  <Image
                    src="/assets/key-feature/streamline-plump--deepfake-technology-1-solid.png"
                    alt="Technology"
                    width={56}
                    height={56} 
                    className="mb-5"
                  />
                  <h3 className="text-2xl font-medium">{t('homepage.features.technology')}</h3>
                </div>
              </div>
            </div>
            
            <div 
              className="relative rounded-2xl overflow-hidden h-72 group cursor-pointer animate-on-scroll"
              onClick={() => setActiveKeyFeature(activeKeyFeature === 'crossborder' ? null : 'crossborder')}
            >
              <Image
                src={getFeatureImage('crossborder')}
                alt="Cross Border"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0  flex items-end p-8">
                <div>
                  <Image
                    src="/assets/key-feature/solar--atom-bold.png"
                    alt="Collaboration"
                    width={56}
                    height={56}
                    className="mb-5"
                  />
                  <h3 className="text-2xl font-medium">{t('homepage.features.crossborder')}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Flowing Card */}
          {activeKeyFeature && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <div 
                className="absolute inset-0 bg-black bg-opacity-30"
                onClick={() => setActiveKeyFeature(null)}
              ></div>
              
              {/* Flowing Card */}
              <div className="relative w-full max-w-3xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
                <div 
                  className="relative rounded-[30px] overflow-hidden shadow-2xl transform transition-all duration-500 ease-out border-2 border-white"
                  style={{
                    width: '817px',
                    height: '398px',
                    background: `linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${getFeatureImage(activeKeyFeature)}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                >
                  {/* Large Icon */}
                  <div className="absolute left-[20px] top-[120px] w-[120px] h-[120px]">
                    {activeKeyFeature === 'capacity' && (
                      <Image
                        src="/assets/key-feature/hat.png"
                        alt="Education"
                        width={110}
                        height={110}
                        className="ml-4 mt-4"
                      />
                    )}
                    {activeKeyFeature === 'mentorship' && (
                      <Image
                      src="/assets/key-feature/laptop.png"
                      alt="Mentor"
                      width={110}
                      height={110}
                      className="ml-4 mt-4"
                      />
                    )}
                    {activeKeyFeature === 'finance' && (
                      <Image
                      src="/assets/key-feature/growth.png"
                        alt="Finance"
                        width={110}
                        height={110}
                        className="ml-4 mt-4"
                      />
                    )}
                    {activeKeyFeature === 'visibility' && (
                      <Image
                        src="/assets/key-feature/gis--story-map.png"
                        alt="Story"
                        width={110}
                        height={110}
                        className="ml-4 mt-4"
                      />
                    )}
                    {activeKeyFeature === 'technology' && (
                      <Image
                        src="/assets/key-feature/streamline-plump--deepfake-technology-1-solid.png"
                        alt="Technology"
                        width={110}
                        height={110}
                        className="ml-4 mt-4"
                      />
                    )}
                    {activeKeyFeature === 'crossborder' && (
                      <Image
                        src="/assets/key-feature/solar--atom-bold.png"
                        alt="Collaboration"
                        width={110}
                        height={110}
                        className="ml-4 mt-4"
                      />
                    )}
                  </div>

                  {/* Title */}
                  <div className="absolute left-[160px] top-[100px] w-[400px] h-[34px]">
                    <h3 
                      className="text-white font-medium"
                      style={{
                        fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                        fontSize: '28px',
                        lineHeight: '34px',
                        letterSpacing: '-0.02em'
                      }}
                    >
                      {activeKeyFeature === 'capacity' && t('homepage.features.capacity')}
                      {activeKeyFeature === 'mentorship' && t('homepage.features.mentorship')}
                      {activeKeyFeature === 'finance' && t('homepage.features.finance')}
                      {activeKeyFeature === 'visibility' && t('homepage.features.visibility')}
                      {activeKeyFeature === 'technology' && t('homepage.features.technology')}
                      {activeKeyFeature === 'crossborder' && t('homepage.features.crossborder')}
                    </h3>
                  </div>

                  {/* Description */}
                  <div className="absolute left-[160px] top-[150px] w-[600px] h-[220px]">
                    <div 
                      className="text-white"
                      style={{
                        fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                        fontSize: '20px',
                        lineHeight: '24px',
                        letterSpacing: '-0.02em'
                      }}
                    >
                      {activeKeyFeature === 'capacity' && (
                        <ul className="space-y-3">
                          <li className="flex items-start">
                            <span className="text-white mr-2">•</span>
                            <span>{t('homepage.features.capacityDesc1')}</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-white mr-2">•</span>
                            <span>{t('homepage.features.capacityDesc2')}</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-white mr-2">•</span>
                            <span>{t('homepage.features.capacityDesc3')}</span>
                          </li>
                        </ul>
                      )}
                      {activeKeyFeature === 'mentorship' && (
                        <ul className="space-y-3">
                          <li className="flex items-start">
                            <span className="text-white mr-2">•</span>
                            <span>{t('homepage.features.mentorshipDesc1')}</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-white mr-2">•</span>
                            <span>{t('homepage.features.mentorshipDesc2')}</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-white mr-2">•</span>
                            <span>{t('homepage.features.mentorshipDesc3')}</span>
                          </li>
                        </ul>
                      )}
                      {activeKeyFeature === 'finance' && (
                        <ul className="space-y-3">
                          <li className="flex items-start">
                            <span className="text-white mr-2">•</span>
                            <span>{t('homepage.features.financeDesc1')}</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-white mr-2">•</span>
                            <span>{t('homepage.features.financeDesc2')}</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-white mr-2">•</span>
                            <span>{t('homepage.features.financeDesc3')}</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-white mr-2">•</span>
                            <span>{t('homepage.features.financeDesc4')}</span>
                          </li>
                        </ul>
                      )}
                      {activeKeyFeature === 'visibility' && (
                        <ul className="space-y-3">
                          <li className="flex items-start">
                            <span className="text-white mr-2">•</span>
                            <span>{t('homepage.features.visibilityDesc1')}</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-white mr-2">•</span>
                            <span>{t('homepage.features.visibilityDesc2')}</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-white mr-2">•</span>
                            <span>{t('homepage.features.visibilityDesc3')}</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-white mr-2">•</span>
                            <span>{t('homepage.features.visibilityDesc4')}</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-white mr-2">•</span>
                            <span>{t('homepage.features.visibilityDesc5')}</span>
                          </li>
                        </ul>
                      )}
                      {activeKeyFeature === 'technology' && (
                        <ul className="space-y-3">
                          <li className="flex items-start">
                            <span className="text-white mr-2">•</span>
                            <span>{t('homepage.features.technologyDesc1')}</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-white mr-2">•</span>
                            <span>{t('homepage.features.technologyDesc2')}</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-white mr-2">•</span>
                            <span>{t('homepage.features.technologyDesc3')}</span>
                          </li>
                        </ul>
                      )}
                      {activeKeyFeature === 'crossborder' && (
                        <ul className="space-y-3">
                          <li className="flex items-start">
                            <span className="text-white mr-2">•</span>
                            <span>{t('homepage.features.crossborderDesc1')}</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-white mr-2">•</span>
                            <span>{t('homepage.features.crossborderDesc2')}</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-white mr-2">•</span>
                            <span>{t('homepage.features.crossborderDesc3')}</span>
                          </li>
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          </div>

          {/* Mobile Version */}
          <div className="md:hidden px-4">
            <div className="text-center mb-8">
              <h2 className="text-[#653a96] mb-4 animate-on-scroll" style={{
                fontFamily: 'DM Serif Display, serif',
                fontWeight: 400,
                fontSize: '28px',
                lineHeight: '32px'
              }}>
                {t('homepage.sections.keyFeatures')}
              </h2>
            </div>

            {/* Mobile Key Features Grid - Single Column */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              {/* Mobile Feature Cards */}
              {[
                { key: 'capacity', icon: '/assets/key-feature/hat.png', title: t('homepage.features.capacity') },
                { key: 'mentorship', icon: '/assets/key-feature/laptop.png', title: t('homepage.features.mentorship') },
                { key: 'finance', icon: '/assets/key-feature/growth.png', title: t('homepage.features.finance') },
                { key: 'visibility', icon: '/assets/key-feature/gis--story-map.png', title: t('homepage.features.visibility') },
                { key: 'technology', icon: '/assets/key-feature/streamline-plump--deepfake-technology-1-solid.png', title: t('homepage.features.technology') },
                { key: 'crossborder', icon: '/assets/key-feature/solar--atom-bold.png', title: t('homepage.features.crossborder') }
              ].map((feature) => (
                <div
                  key={feature.key}
                  className="relative rounded-xl overflow-hidden h-32 cursor-pointer animate-on-scroll"
                  style={{
                    background: `linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${getFeatureImage(feature.key)}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                  onClick={() => setActiveKeyFeature(activeKeyFeature === feature.key ? null : feature.key)}
                >
                  <div className="absolute inset-0 flex items-center p-4">
                    <Image
                      src={feature.icon}
                      alt={feature.title}
                      width={32}
                      height={32}
                      className="mr-3 flex-shrink-0"
                    />
                    <h3 className="text-sm font-medium text-white">{feature.title}</h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Modal Card */}
            {activeKeyFeature && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                  className="absolute inset-0 bg-black bg-opacity-50"
                  onClick={() => setActiveKeyFeature(null)}
                ></div>

                <div className="relative w-full max-w-sm mx-auto bg-white rounded-2xl overflow-hidden shadow-2xl max-h-[80vh] overflow-y-auto">
                  <div
                    className="relative min-h-[300px]"
                    style={{
                      background: `linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${getFeatureImage(activeKeyFeature)}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>

                    {/* Close Button */}
                    <button
                      onClick={() => setActiveKeyFeature(null)}
                      className="absolute top-4 right-4 z-10 w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    {/* Icon */}
                    <div className="absolute top-4 left-4 w-16 h-16">
                      {activeKeyFeature === 'capacity' && (
                        <Image src="/assets/key-feature/hat.png" alt="Education" width={64} height={64} />
                      )}
                      {activeKeyFeature === 'mentorship' && (
                        <Image src="/assets/key-feature/laptop.png" alt="Mentor" width={64} height={64} />
                      )}
                      {activeKeyFeature === 'finance' && (
                        <Image src="/assets/key-feature/growth.png" alt="Finance" width={64} height={64} />
                      )}
                      {activeKeyFeature === 'visibility' && (
                        <Image src="/assets/key-feature/gis--story-map.png" alt="Story" width={64} height={64} />
                      )}
                      {activeKeyFeature === 'technology' && (
                        <Image src="/assets/key-feature/streamline-plump--deepfake-technology-1-solid.png" alt="Technology" width={64} height={64} />
                      )}
                      {activeKeyFeature === 'crossborder' && (
                        <Image src="/assets/key-feature/solar--atom-bold.png" alt="Collaboration" width={64} height={64} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-white font-bold text-xl mb-3">
                        {activeKeyFeature === 'capacity' && t('homepage.features.capacity')}
                        {activeKeyFeature === 'mentorship' && t('homepage.features.mentorship')}
                        {activeKeyFeature === 'finance' && t('homepage.features.finance')}
                        {activeKeyFeature === 'visibility' && t('homepage.features.visibility')}
                        {activeKeyFeature === 'technology' && t('homepage.features.technology')}
                        {activeKeyFeature === 'crossborder' && t('homepage.features.crossborder')}
                      </h3>
                      <div className="text-white text-sm leading-relaxed">
                        {activeKeyFeature === 'capacity' && (
                          <ul className="space-y-2">
                            <li>• {t('homepage.features.capacityDesc1')}</li>
                            <li>• {t('homepage.features.capacityDesc2')}</li>
                            <li>• {t('homepage.features.capacityDesc3')}</li>
                          </ul>
                        )}
                        {activeKeyFeature === 'mentorship' && (
                          <ul className="space-y-2">
                            <li>• {t('homepage.features.mentorshipDesc1')}</li>
                            <li>• {t('homepage.features.mentorshipDesc2')}</li>
                            <li>• {t('homepage.features.mentorshipDesc3')}</li>
                          </ul>
                        )}
                        {activeKeyFeature === 'finance' && (
                          <ul className="space-y-2">
                            <li>• {t('homepage.features.financeDesc1')}</li>
                            <li>• {t('homepage.features.financeDesc2')}</li>
                            <li>• {t('homepage.features.financeDesc3')}</li>
                          </ul>
                        )}
                        {activeKeyFeature === 'visibility' && (
                          <ul className="space-y-2">
                            <li>• {t('homepage.features.visibilityDesc1')}</li>
                            <li>• {t('homepage.features.visibilityDesc2')}</li>
                            <li>• {t('homepage.features.visibilityDesc3')}</li>
                          </ul>
                        )}
                        {activeKeyFeature === 'technology' && (
                          <ul className="space-y-2">
                            <li>• {t('homepage.features.technologyDesc1')}</li>
                            <li>• {t('homepage.features.technologyDesc2')}</li>
                            <li>• {t('homepage.features.technologyDesc3')}</li>
                          </ul>
                        )}
                        {activeKeyFeature === 'crossborder' && (
                          <ul className="space-y-2">
                            <li>• {t('homepage.features.crossborderDesc1')}</li>
                            <li>• {t('homepage.features.crossborderDesc2')}</li>
                            <li>• {t('homepage.features.crossborderDesc3')}</li>
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
        </div>
      </section>

          {/* Bottom CTA Section */}
          <div className="text-white py-16 md:py-16 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center flex-col lg:flex-row pl-20 md:pl-20 pl-8 justify-center lg:space-x-12 space-y-8 lg:space-y-0">
                {/* Left Side - Start. Grow. Scale. */}
                <div className="text-center md:text-center text-center">
                  <h2 
                    className="text-6xl md:text-6xl text-4xl mb-2 md:mb-2 mb-1"
                  >
                    <div   style={{
                      fontFamily: 'DM Serif Display, serif',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '78px',
                      lineHeight: '77px',
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale',
                      textRendering: 'optimizeLegibility'
                    }} className="animate-on-scroll md:text-[78px] md:leading-[77px] text-[48px] leading-[48px]">{t('opportunities.ctaStart') || 'Start.'}</div>
                    <div   style={{
                      fontFamily: 'DM Serif Display, serif',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '78px',
                      lineHeight: '77px',
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale',
                      textRendering: 'optimizeLegibility'
                    }} className="animate-on-scroll md:text-[78px] md:leading-[77px] text-[48px] leading-[48px]">{t('opportunities.ctaGrow') || 'Grow.'}</div>
                    <div  style={{
                      fontFamily: 'DM Serif Display, serif',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '78px',
                      lineHeight: '77px',
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale',
                      textRendering: 'optimizeLegibility'
                    }} className="animate-on-scroll md:text-[78px] md:leading-[77px] text-[48px] leading-[48px]">{t('opportunities.ctaScale') || 'Scale.'}</div>
                  </h2>
                </div>
                
                {/* Right Side - Descriptive Text */}
                <div className="flex-1 pt-16 md:pt-16 pt-8">
                  <p 
                    className="text-3xl md:text-3xl text-xl font-medium animate-on-scroll"
                  >
                    {t('opportunities.ctaLine') || 'with Tools that make your'}<br />{t('opportunities.ctaLineCont') || 'entrepreneurial life easy'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
