import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { useLanguage } from '../../lib/LanguageContext';

const MentorshipPage = () => {
  const { t } = useLanguage();
  const [mentorshipImage, setMentorshipImage] = useState(null);
  const [heroImage, setHeroImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);

  // Preload image function
  const preloadImage = (url) => {
    if (typeof window !== 'undefined' && url) {
      // Preload using <link rel="preload">
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = url;
      link.as = 'image';
      document.head.appendChild(link);
      
      // Also preload using Image object for broader browser support
      const img = new window.Image();
      img.src = url;
    }
  };

  // Preload fallback image on mount
  useEffect(() => {
    preloadImage("/assets/mentorship/unsplash_1ULAhyrsP2M.png");
  }, []);

  // Fetch mentorship page images (hero and middle section)
  useEffect(() => {
    const fetchMentorshipImages = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page-images`);
        if (response.ok) {
          const data = await response.json();
          // Fetch hero image
          const mentorshipHeroImage = data.data?.find(img => img.page_name === 'mentorship-hero' && img.is_active);
          if (mentorshipHeroImage?.image_url) {
            const heroImageUrl = mentorshipHeroImage.image_url;
            setHeroImage(heroImageUrl);
            preloadImage(heroImageUrl);
          }
          // Fetch middle section image
          const mentorshipPageImage = data.data?.find(img => img.page_name === 'mentorship' && img.is_active);
          if (mentorshipPageImage?.image_url) {
            const imageUrl = mentorshipPageImage.image_url;
            setMentorshipImage(imageUrl);
            preloadImage(imageUrl);
          }
        }
      } catch (error) {
        console.log('Error fetching mentorship page image:', error);
      } finally {
        setImageLoading(false);
      }
    };
    fetchMentorshipImages();
  }, []);
  return (
    <>
      <Head>
        <title>{t('expandedNav.mentorship')} - {t('homepage.hero.mentorshipHub')}</title>
        <meta name="description" content="Your AI-enabled platform for scaling businesses, building wealth and leading globally. Connect with industry leaders and get personalized mentorship." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/abwci.ico" />
      </Head>

      <Layout>
        {/* Mentorship Page Content Only (no page-specific navbar/footer) */}
        <div className="relative w-full min-h-screen bg-white pt-4 md:pt-4">
          {/* Hero Section */}
          <div className="relative w-full h-[800px] md:h-[800px] h-[550px] overflow-hidden">
            {/* Background Image */}
            {heroImage ? (
              <Image
                src={heroImage}
                alt="Mentorship Hero"
                fill
                className="object-cover"
                style={{ objectPosition: '50% 30%' }}
                priority
                loading="eager"
                quality={100}
                sizes="100vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50"></div>
            )}
            
            {/* Gradient Overlay linear-gradient(180deg, rgba(101, 58, 150, 0) 44.71%, #653A96 100%)*/}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white opacity-100" 
                 style={{ background: 'linear-gradient(180deg, rgba(101, 58, 150, 0) 44.71%, #653A96 100%)' }}></div>
            
            {/* Content Overlay */}
            <div className="relative z-10 h-full flex items-center">
              <div className="container mx-auto px-4 lg:px-8 md:px-4 px-4">
                <div className="space-y-6 md:space-y-6 space-y-4">
                  {/* Main Headline */}
                  <h1
                    className="text-white font-serif text-3xl md:text-5xl lg:text-6xl xl:text-7xl text-2xl leading-tight"
                    style={{
                      fontFamily: 'DM Serif Display, serif',
                      fontWeight: 400,
                      lineHeight: '1.1',
                      color: '#FFFFFF'
                    }}
                    dangerouslySetInnerHTML={{ __html: t('homepage.hero.mentorshipTitle').replace('\n', '<br />') }}>
                  </h1>

                  {/* Sub-headline */}
                  <p className="text-white"
                  style={{
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontWeight: 400,
                  fontSize: '20px',
                  lineHeight: '26px',
                  color: '#FFFFFF'
                  }}
                  >
                  {t('homepage.sections.yourAIEnabledPlatform')}
                  </p>

                  {/* ABWCI | Mentorship Hub */}
                  <div className="flex items-center gap-3 md:gap-3 gap-2">
                    <Image
                      src="/abwci-newlogo.svg"
                      alt="ABWCI"
                      width={140}
                      height={56}
                      className="h-10 md:h-10 h-8 w-auto"
                      style={{
                        filter: 'brightness(0) invert(1)'
                      }}
                    />
                    <span className="text-white" style={{ fontFamily: 'DM Serif Display', fontWeight: 300, fontSize: '30px', lineHeight: '51px', color: '#FFFFFF' }}>
                      |
                    </span>
                    <span className="text-white" style={{ fontFamily: 'DM Serif Display', fontWeight: 600, fontSize: '30px', lineHeight: '51px', color: '#FFFFFF' }}>
                      {t('homepage.hero.mentorshipHub')}
                    </span>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 md:gap-4 gap-2">
                    <Link
                      href="/auth/register?skipStep1=true"
                      className="inline-flex items-center justify-center px-8 py-3 md:px-8 md:py-3 px-6 py-2 bg-[#FECB07] text-[#171717] rounded-full font-medium text-base md:text-base text-sm hover:bg-[#FECB07]/90 transition-colors"
                      style={{
                        fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                        fontWeight: 500
                      }}
                    >
                      {t('opportunities.getMentor') || 'Get a mentor'}
                    </Link>
                    <Link
                      href="/auth/register?role=mentor"
                      className="inline-flex items-center justify-center px-8 py-3 md:px-8 md:py-3 px-6 py-2 text-white font-medium text-base md:text-base text-sm hover:text-[#653A96] transition-colors"
                      style={{
                        fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                        fontWeight: 500
                      }}
                    >
                      {t('opportunities.becomeMentor') || 'Become a mentor'}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Section */}
          <div className="relative w-full h-[643px] md:h-[643px] h-[400px] bg-gradient-to-r from-gray-900 to-gray-800 -mt-6 sm:-mt-18 lg:-mt-20 md:-mt-6 md:sm:-mt-18 md:lg:-mt-20 -mt-4 sm:-mt-12 lg:-mt-16">
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="relative z-10 flex items-center justify-center h-full">
              <div className="text-center">
                <h2
                  className="text-white text-4xl md:text-4xl text-2xl lg:text-4xl xl:text-5xl font-serif mb-8 md:mb-8 mb-4"
                  style={{
                    fontFamily: 'DM Serif Display',
                    fontWeight: 600,
                    lineHeight: '44px'
                  }}
                >
                  {t('opportunities.businessHelp') || 'Your go-to Business Help. Available 24x7'}
                </h2>
                <Link
                  href="/auth/register?skipStep1=true"
                  className="inline-flex items-center justify-center px-8 py-3 md:px-8 md:py-3 px-6 py-2 bg-[#FECB07] text-[#171717] rounded-full font-medium text-base md:text-base text-sm hover:bg-[#FECB07]/90 transition-colors"
                  style={{
                    fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                    fontWeight: 500
                  }}
                >
                  {t('opportunities.getMentor') || 'Get a mentor'}
                </Link>
              </div>
            </div>
            <Image
              src={mentorshipImage || "/assets/mentorship/unsplash_1ULAhyrsP2M.png"}
              alt="Business Help Background"
              fill
              className="object-cover"
              style={{ objectPosition: '50% 10%' }}
            
              priority
              loading="eager"
              quality={100}
              sizes="100vw"
            />
          </div>

          {/* Bottom Section */}
          <div className="relative w-full py-20 md:py-20 py-10 bg-white">
            <div className="container mx-auto px-4 lg:px-8 md:px-4 md:lg:px-8 px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-12 gap-8 items-center">
                {/* Left Content */}
                <div className="space-y-6 md:space-y-6 space-y-4">
                  <h2
                    className="text-black text-4xl md:text-4xl text-2xl lg:text-4xl xl:text-5xl leading-tight"
                    style={{
                      fontFamily: 'DM Serif Display, serif',
                      fontWeight: 400,
                      lineHeight: '51px',
                      fontSize: '64px'

                    }}
                  >
                    {t('opportunities.becomeMentorTitle') || 'Become a Mentor and start earning today!'}
                  </h2>

                  <p
                    className="text-black leading-relaxed md:text-black text-gray-700"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontWeight: 400,
                      fontSize: '18px',
                      lineHeight: '26px'
                    }}
                  >
                    {t('opportunities.becomeMentorDesc') || 'Mentor businesswomen of all backgrounds and create a measurable social impact around the world'}
                  </p>

                  <Link
                    href="/auth/register"
                    className="inline-flex items-center justify-center px-10 py-4 md:px-10 md:py-4 px-8 py-3 bg-[#FECB07] text-[#171717] rounded-full font-medium text-lg md:text-lg text-base hover:bg-[#FECB07]/90 transition-colors"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontWeight: 500
                    }}
                  >
                    {t('opportunities.becomeMentor') || 'Become a Mentor'}
                  </Link>
                </div>

                {/* Right Image */}
                <div className="relative lg:max-w-[520px] xl:max-w-[560px] ml-auto">
                  <Image
                    src="/assets/mentorship/Gemini_Generated_Image_5unhpy5unhpy5unh 1.png"
                    alt="Become a Mentor"
                    width={572}
                    height={492}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default MentorshipPage;
