import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useLanguage } from '../../lib/LanguageContext';
import Image from 'next/image';
import Link from 'next/link';
import { impactStories } from '../../data/impact-stories';

export default function Impact() {
  const { t } = useLanguage();
  const [heroImage, setHeroImage] = useState('');
  const [heroBottomImage, setHeroBottomImage] = useState('');
  const [ctaImage, setCtaImage] = useState('');
  const [partners, setPartners] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  
  // Font stack for consistent typography
  const fontFamily = 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch page images from API (only 3 images: hero, hero-bottom, cta)
  useEffect(() => {
    const fetchPageImages = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page-images`);
        if (response.ok) {
          const data = await response.json();
          const images = data.data || [];
          
          // Hero image (top)
          const heroImg = images.find(img => img.page_name === 'impact-hero' && img.is_active);
          if (heroImg?.image_url) {
            setHeroImage(heroImg.image_url);
          }
          
          // Hero bottom image (near footer)
          const heroBottomImg = images.find(img => img.page_name === 'impact-hero-bottom' && img.is_active);
          if (heroBottomImg?.image_url) {
            setHeroBottomImage(heroBottomImg.image_url);
          }
          
          // CTA section image (women in field)
          const ctaImg = images.find(img => img.page_name === 'impact-cta' && img.is_active);
          if (ctaImg?.image_url) {
            setCtaImage(ctaImg.image_url);
          }
        }
      } catch (error) {
        console.log('Error fetching page images:', error);
      }
    };
    fetchPageImages();
  }, []);

  // Fetch partners from API using posts endpoint
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts?post_page=partners&limit=1000`);
        if (response.ok) {
          const data = await response.json();
          console.log('Partners API response:', data); // Debug log
          // Filter to only include partners with valid images
          const partnersWithImages = (data.data || []).filter(partner => {
            const hasThumbnail = partner.post_thumbnail_url && partner.post_thumbnail_url.trim() !== '';
            const hasBanner = partner.post_banner_url && partner.post_banner_url.trim() !== '';
            return hasThumbnail || hasBanner;
          });
          console.log('Filtered partners with images:', partnersWithImages); // Debug log
          setPartners(partnersWithImages);
        }
      } catch (error) {
        console.log('Error fetching partners:', error);
      }
    };
    fetchPartners();
  }, []);

  // Flagship Projects Data (static images from public/projects)
  const flagshipProjects = [
    {
      id: 1,
      title: 'Grameen Heroes',
      description: 'Grameen Heroes is a flagship CSR initiative of Hero MotoCorp Ltd., implemented by ABWCI to surface, strengthen and scale rural and semi-urban women-led enterprises across India. Adapted from the Shark Tank model, the program builds confidence, business leadership, and community impact among women entrepreneurs.',
      image: '/projects/main1.png',
      link: '/impact/grameen-heroes'
    },
    {
      id: 2,
      title: 'Women Entrepreneur for Women Entrepreneur (WE4WE)',
      description: 'WE4WE unlocked the entrepreneurial power of tribal women in Koraput, Odisha by strengthening women-led Farmer Producer Organizations (FPOs) through market linkages, investment readiness, and structured mentorship. ABWCI strengthened four women-led FPOs representing more than 3,500 farmers, securing turmeric procurement contracts, new buyer linkages and a year-long mentoring programme on leadership, business planning, digital visibility and market preparedness.',
      image: '/projects/main2.png',
      link: '/impact/we4we'
    },
    {
      id: 3,
      title: 'Hero for Humanity',
      description: 'The COVID-19 pandemic left thousands of women widowed overnight—emotionally devastated and suddenly responsible for sustaining their families alone, many without prior paid work or access to formal finance. Project Hero for Humanity, supported by Hero MotoCorp and implemented by ABWCI, stood with women from Odisha and Karnataka, helping them rebuild dignified, sustainable livelihoods and renewed hope.',
      image: '/projects/main3.png',
      link: '/impact/hero-for-humanity'
    }
  ];

  // Stories of Change Data - using data from impact-stories.js
  const storiesOfChange = impactStories;

  
  return (
    <Layout
      title="Our Impact - ABWCI | Empowering Women. Transforming Economies."
      description="Discover ABWCI's impact: 50+ outreach events, 14+ states representation, 1000s of women touched. Explore our flagship projects, success stories, and partnerships that empower women entrepreneurs globally."
      keywords="ABWCI impact, women empowerment, women entrepreneurs, business women, outreach events, flagship projects, success stories, women in commerce"
      url="/impact"
    >
      {/* Desktop Version - Keep exactly as is */}
      {!isMobile && (
      <div 
        className="relative bg-white w-full overflow-hidden"
        style={{ 
          minHeight: '4068px'
        }}
      >
        {/* Hero Section 1 - Rectangle 204 */}
        <div 
          className="absolute w-full"
          style={{
            // Show hero image only in the top area (like original design)
            height: '750px',
            left: '0',
            top: '0',
            zIndex: 1,
            backgroundImage: heroImage 
              ? `linear-gradient(180deg, rgba(101, 58, 150, 0) 42.79%,rgb(131, 93, 173) 90.62%), url('${heroImage}')`
              : 'linear-gradient(180deg, rgba(101, 58, 150, 0) 42.79%,rgb(131, 93, 173) 90.62%)',
            // Match homepage hero behaviour: like next/image fill + object-cover + objectPosition '50% 40%'
            backgroundSize: 'cover',
            backgroundPosition: '50% 40%',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'scroll',
            backgroundColor: '#653A96'
          }}
        >
          {/* Frame 7944 - Text Content */}
          <div 
            className="absolute flex flex-col"
            style={{
              width: '100%',
              maxWidth: '1200px',
              left: '129px',
              top: '360px',
              gap: '20px',
              zIndex: 2
            }}
          >
            <h2 
              style={{ 
                fontFamily: fontFamily,
                fontWeight: 700,
                fontSize: '24px',
                lineHeight: '28px',
                color: '#FECB07'
              }}
            >
              Our Impact
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h1 
                style={{ 
                  fontFamily: 'DM Serif Display, serif',
                  fontWeight: 400,
                  fontSize: '48px',
                  lineHeight: '56px',
                  color: '#FFFFFF',
                  whiteSpace: 'nowrap'
                }}
              >
                Empowering Women. Transforming Economies.
              </h1>
              <p 
                style={{ 
                  fontFamily: fontFamily,
                  fontWeight: 400,
                  fontSize: '22px',
                  lineHeight: '28px',
                  color: '#FFFFFF',
                  whiteSpace: 'nowrap'
                }}
              >
                50+ outreach events | 14+ states representation | 1000s of women touched
              </p>
            </div>
          </div>

          {/* Frame 7945 - Explore our projects link */}
          <div 
            className="absolute"
            style={{
              left: '129px',
              top: '560px',
              zIndex: 2
            }}
          >
            <Link 
              href="#projects"
              className="hover:opacity-80 transition-opacity"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <span 
                style={{ 
                  fontFamily: fontFamily,
                  fontWeight: 500,
                  fontSize: '20px',
                  lineHeight: '24px',
                  letterSpacing: '-0.02em',
                  color: '#FECB07',
                  whiteSpace: 'nowrap'
                }}
              >
                Explore our projects
              </span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, verticalAlign: 'middle' }} className="mt-1">
                <path d="M13.5 6L20 12M20 12L13.5 18M20 12H4" stroke="#FECB07" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>

        {/* Frame 7950 - Stats Section (overlapping Hero Section 1) */}
        <div 
          className="absolute flex items-start justify-center"
          style={{
            // Keep comfortable gap from left/right edges on desktop
            width: 'calc(100% - 160px)',
            maxWidth: '1400px',
            left: '50%',
            transform: 'translateX(-50%)',
            // Center stats vertically within the second hero image
            top: '880px',
            padding: '24px 60px',
            gap: '60px',
            // Stronger, softer background so numbers read clearly over photo
            background: 'rgba(0, 0, 0, 0.45)',
            borderRadius: '16px',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            zIndex: 3
          }}
        >
          {/* Frame 7946 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: '1', minWidth: '200px' }}>
            <h3 
              style={{ 
                fontFamily: fontFamily,
                fontWeight: 500,
                fontSize: '48px',
                lineHeight: '59px',
                letterSpacing: '-0.02em',
                color: '#FFFFFF'
              }}
            >
              1,500+
            </h3>
            <p 
              style={{ 
                fontFamily: fontFamily,
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '20px',
                letterSpacing: '-0.02em',
                color: '#FFFFFF'
              }}
            >
              grassroots touchpoints through outreach under Grameen Heroes
            </p>
          </div>
          {/* Frame 7947 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: '1', minWidth: '200px' }}>
            <h3 
              style={{ 
                fontFamily: fontFamily,
                fontWeight: 500,
                fontSize: '48px',
                lineHeight: '59px',
                letterSpacing: '-0.02em',
                color: '#FFFFFF'
              }}
            >
              35
            </h3>
            <p 
              style={{ 
                fontFamily: fontFamily,
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '20px',
                letterSpacing: '-0.02em',
                color: '#FFFFFF'
              }}
            >
              National Winners who pitched their ideas before experts and were supported with seed grants to scale up their businesses
            </p>
          </div>
          {/* Frame 7948 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: '1', minWidth: '200px' }}>
            <h3 
              style={{ 
                fontFamily: fontFamily,
                fontWeight: 500,
                fontSize: '48px',
                lineHeight: '59px',
                letterSpacing: '-0.02em',
                color: '#FFFFFF'
              }}
            >
              300+
            </h3>
            <p 
              style={{ 
                fontFamily: fontFamily,
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '20px',
                letterSpacing: '-0.02em',
                color: '#FFFFFF'
              }}
            >
              households of widows who lost their spouses to the COVID-19 pandemic were supported with sustenance and education, and trained into setting up their enterprises
            </p>
          </div>
          {/* Frame 7949 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: '1', minWidth: '200px' }}>
            <h3 
              style={{ 
                fontFamily: fontFamily,
                fontWeight: 500,
                fontSize: '48px',
                lineHeight: '59px',
                letterSpacing: '-0.02em',
                color: '#FFFFFF'
              }}
            >
              300++
            </h3>
            <p 
              style={{ 
                fontFamily: fontFamily,
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '20px',
                letterSpacing: '-0.02em',
                color: '#FFFFFF'
              }}
            >
              women supported with mentoring, capacity building and seed grants to start enterprises
            </p>
          </div>
        </div>

        {/* Hero Section 2 - Rectangle 207 (touching Hero 1) */}
        <div 
          className="absolute w-full"
          style={{
            height: '500px',
            left: '0',
            // Start second image just below the first hero (750px tall)
            top: '750px',
            zIndex: 2,
            backgroundColor: '#D9D9D9',
            backgroundImage: heroBottomImage ? `url('${heroBottomImage}')` : 'none',
            // Use cover to avoid stretching the bottom hero image
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'scroll'
          }}
        />

        {/* Frame 7954 - Flagship Projects Section */}
        <div 
          id="projects"
          className="absolute flex flex-col"
          style={{
            width: '100%',
            left: '0',
            right: '0',
            top: '1380px',
            gap: '38px',
            padding: '0 80px'
          }}
        >
            <h2 
              style={{ 
                fontFamily: fontFamily,
                fontWeight: 700,
                fontSize: '28px',
                lineHeight: '38px',
                color: '#000000'
              }}
            >
              Our Flagship Projects
            </h2>
            {/* Frame 7953 */}
            <div style={{ display: 'flex', flexDirection: 'row', gap: '30px', width: '100%', justifyContent: 'space-between', flexWrap: 'nowrap' }}>
              {flagshipProjects.map((project, index) => (
                <Link
                  key={project.id}
                  href={project.link}
                  className="hover:opacity-90 transition-opacity"
                  style={{ display: 'flex', flexDirection: 'column', gap: '30px', flex: '1', minWidth: '0', cursor: 'pointer' }}
                >
                  <div 
                    style={{
                      width: '100%',
                      height: '200px',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      backgroundColor: '#D9D9D9'
                    }}
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                     
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <h3 
                      style={{ 
                        fontFamily: fontFamily,
                        fontWeight: 500,
                        fontSize: '18px',
                        lineHeight: '22px',
                        letterSpacing: '-0.02em',
                        color: '#653A96'
                      }}
                    >
                      {project.title}
                    </h3>
                    <p 
                      style={{ 
                        fontFamily: fontFamily,
                        fontWeight: 400,
                        fontSize: '15px',
                        lineHeight: '22px',
                        letterSpacing: '-0.02em',
                        color: '#000000',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxHeight: '66px' // 3 lines * 22px line-height
                      }}
                    >
                      {project.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
        </div>

        {/* Frame 7955 - Stories of Change Section */}
        <div 
          className="absolute flex flex-col"
          style={{
            width: '100%',
            left: '0',
            right: '0',
            top: '1890px',
            gap: '38px',
            padding: '0 80px'
          }}
        >
            {/* Frame 7956 */}
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <Link
                href="/about/success-stories"
                className="hover:opacity-80 transition-opacity"
                style={{ cursor: 'pointer' }}
              >
                <h2 
                  style={{ 
                    fontFamily: fontFamily,
                    fontWeight: 700,
                    fontSize: '28px',
                    lineHeight: '38px',
                    color: '#000000'
                  }}
                >
                  Stories of Change
                </h2>
              </Link>
              <Link
                href="/about/success-stories"
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: '10px 30px',
                  gap: '12px',
                  background: '#FECB07',
                  borderRadius: '30px'
                }}
                className="hover:opacity-90 transition-opacity"
              >
                <span 
                  style={{ 
                    fontFamily: fontFamily,
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '17px',
                    color: '#171717',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  Read more success stories
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                    <path d="M13.5 6L20 12M20 12L13.5 18M20 12H4" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </Link>
            </div>
            {/* Frame 7953 */}
            <div style={{ display: 'flex', flexDirection: 'row', gap: '30px', width: '100%', justifyContent: 'space-between', flexWrap: 'nowrap' }}>
              {storiesOfChange.map((story) => (
                <Link
                  key={story.id}
                  href={`/impact/stories/${story.slug}`}
                  className="hover:opacity-90 transition-opacity"
                  style={{ display: 'flex', flexDirection: 'column', gap: '30px', flex: '1', minWidth: '0', cursor: 'pointer' }}
                >
                  <div 
                    style={{
                      width: '100%',
                      height: '200px',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      backgroundColor: '#D9D9D9'
                    }}
                  >
                    <img
                      src={story.image}
                      alt={story.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = '/assets/impact/placeholder.jpg';
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <h3 
                      style={{ 
                        fontFamily: fontFamily,
                        fontWeight: 500,
                        fontSize: '18px',
                        lineHeight: '22px',
                        letterSpacing: '-0.02em',
                        color: '#653A96'
                      }}
                    >
                      {story.title}
                    </h3>
                    <p 
                      style={{ 
                        fontFamily: fontFamily,
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '17px',
                        letterSpacing: '-0.02em',
                        color: '#000000'
                      }}
                    >
                      {story.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
        </div>

        {/* Partners in Impact - Title */}
        <h2 
          className="absolute"
          style={{
            width: 'auto',
            height: '38px',
            left: '50%',
            transform: 'translateX(-50%)',
            top: '2375px',
            fontFamily: 'Helvetica Neue',
            fontWeight: 700,
            fontSize: '28px',
            lineHeight: '38px',
            color: '#000000',
            textAlign: 'center',
            whiteSpace: 'nowrap'
          }}
        >
          Partners in Impact
        </h2>

        {/* Frame 7957 - Partner Logos */}
        <div 
          className="absolute flex items-center justify-center"
          style={{
            width: '100%',
            left: '0',
            top: '2431px',
            gap: '80px',
            padding: '0 20px'
          }}
        >
          {partners.length > 0 ? (
            partners.slice(1, 4).map((partner) => (
              <div 
                key={partner.id} 
                style={{
                  width: '250px',
                  height: '150px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px'
                }}
              >
                <img
                  src={partner.post_thumbnail_url || partner.post_banner_url}
                  alt={partner.post_title}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  onError={(e) => {
                    console.error('Partner logo failed to load:', partner.post_title);
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            ))
          ) : (
            <p style={{ fontFamily: fontFamily, color: '#999' }}>Loading partners...</p>
          )}
        </div>

        {/* Frame 5722 - Partner with us button */}
        <Link
          href="/support"
          className="absolute flex items-center justify-between hover:opacity-90 transition-opacity"
          style={{
            width: '200px',
            height: '39px',
            left: '50%',
            transform: 'translateX(-50%)',
            top: '2608px',
            padding: '10px 20px',
            background: '#FECB07',
            borderRadius: '30px',
            whiteSpace: 'nowrap'
          }}
        >
          <span 
            style={{ 
              fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '17px',
              color: '#171717',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            Partner with us
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
              <path d="M13.5 6L20 12M20 12L13.5 18M20 12H4" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </Link>

        {/* Rectangle 208 - CTA Section with Image */}
        <div 
          className="absolute w-full"
          style={{
            height: '900px',
            left: '0',
            top: '2718px',
            backgroundImage: ctaImage 
              ? `linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url('${ctaImage}')`
              : 'linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1))',
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'scroll'
          }}
        >
          {/* CTA Title Text */}
          <div 
            className="absolute"
            style={{ 
              left: '142px',
              top: '400px',
              maxWidth: '1000px',
              zIndex: 2
            }}
          >
            <h2 
              style={{ 
                fontFamily: 'DM Serif Display',
                fontWeight: 400,
                fontSize: '72px',
                lineHeight: '80px',
                color: '#FFFFFF',
                marginBottom: '10px'
              }}
            >
              Join the Movement in
            </h2>
            <h2 
              style={{ 
                fontFamily: 'DM Serif Display',
                fontWeight: 400,
                fontSize: '72px',
                lineHeight: '80px',
                color: '#FECB07'
              }}
            >
              Creating Wealth for Women
            </h2>
          </div>

          {/* Frame 7959 - Buttons positioned at specific location */}
          <div 
            className="absolute flex flex-col"
            style={{
              width: '214px',
              height: '88px',
              left: '142px',
              top: '630px',
              gap: '10px'
            }}
          >
            {/* Frame 5722 - Become a Member */}
            <Link
              href="/auth/register"
              className="flex items-center justify-between hover:opacity-90 transition-opacity"
              style={{
                padding: '10px 30px',
                gap: '12px',
                background: '#653A96',
                borderRadius: '30px'
              }}
            >
              <span 
                style={{ 
                  fontFamily: fontFamily,
                  fontWeight: 500,
                  fontSize: '14px',
                  lineHeight: '17px',
                  color: '#FFFFFF',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                Become a Member
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                  <path d="M13.5 6L20 12M20 12L13.5 18M20 12H4" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </Link>
            {/* Frame 7958 - Sponsor a Project */}
            <Link
              href="/support"
              className="flex items-center justify-between hover:opacity-90 transition-opacity"
              style={{
                padding: '10px 30px',
                gap: '12px',
                background: '#FECB07',
                borderRadius: '30px'
              }}
            >
              <span 
                style={{ 
                  fontFamily: fontFamily,
                  fontWeight: 500,
                  fontSize: '14px',
                  lineHeight: '17px',
                  color: '#171717',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                Sponsor a Project
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                  <path d="M13.5 6L20 12M20 12L13.5 18M20 12H4" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </div>
      )}

      {/* Mobile Version - Separate optimized section */}
      {isMobile && (
        <div 
          className="relative bg-white w-full overflow-hidden"
          style={{ 
            minHeight: 'auto'
          }}
        >
          {/* Hero Section 1 - Mobile Centered */}
          <div 
            className="w-full relative flex flex-col items-center justify-center"
            style={{
              minHeight: '735px',
              padding: '100px 20px 60px 20px',
              backgroundImage: heroImage 
                ? `linear-gradient(180deg, rgba(101, 58, 150, 0.3) 0%, rgba(101, 58, 150, 0.85) 100%), url('${heroImage}')`
                : 'linear-gradient(180deg, rgba(101, 58, 150, 0.3) 0%, rgba(101, 58, 150, 0.85) 100%)',
              backgroundSize: 'cover',
              backgroundPosition: '50% 30%',
              backgroundRepeat: 'no-repeat',
              backgroundColor: '#653A96'
            }}
          >
            {/* Text Content - Mobile Centered */}
            <div 
              className="flex flex-col items-center"
              style={{
                width: '100%',
                maxWidth: '340px',
                gap: '20px',
                marginTop: '84px',
                textAlign: 'center'
              }}
            >
              <h2 style={{ fontFamily: fontFamily, fontWeight: 700, fontSize: '18px', lineHeight: '22px', color: '#FECB07', textAlign: 'center', width: '100%', margin: 0 }}>Our Impact</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', alignItems: 'center' }}>
                <h1 style={{ fontFamily: 'DM Serif Display, serif', fontWeight: 400, fontSize: '32px', lineHeight: '38px', color: '#FFFFFF', whiteSpace: 'normal', textAlign: 'center', width: '100%', margin: 0 }}>Empowering Women.<br/>Transforming<br/>Economies.</h1>
                <p style={{ fontFamily: fontFamily, fontWeight: 400, fontSize: '14px', lineHeight: '20px', color: 'rgba(255,255,255,0.95)', whiteSpace: 'normal', textAlign: 'center', width: '100%', margin: 0 }}>50+ outreach events |<br/>40+ countries representation |<br/>1000s of women touched</p>
              </div>
              
              {/* Explore our projects link */}
              <Link href="#projects" className="hover:opacity-80 transition-opacity" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginTop: '8px' }}>
                <span style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: '16px', lineHeight: '20px', letterSpacing: '-0.02em', color: '#FECB07', whiteSpace: 'nowrap' }}>Explore our projects</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                  <path d="M13.5 6L20 12M20 12L13.5 18M20 12H4" stroke="#FECB07" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Hero Section 2 with Stats Overlay - Mobile */}
          <div 
            className="w-full relative flex items-center justify-center" 
            style={{ 
              minHeight: '600px', 
              padding: '40px 20px',
              backgroundColor: '#D9D9D9', 
              backgroundImage: heroBottomImage ? `url('${heroBottomImage}')` : 'none', 
              backgroundSize: 'cover', 
              backgroundPosition: 'center center', 
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* Stats Section - Mobile Centered - Inside Hero 2 */}
            <div 
              className="flex flex-col items-center justify-center" 
              style={{ 
                width: '100%', 
                maxWidth: '320px', 
                padding: '28px 24px', 
                gap: '20px', 
                background: 'rgba(0, 0, 0, 0.55)', 
                borderRadius: '16px', 
                backdropFilter: 'blur(8px)', 
                WebkitBackdropFilter: 'blur(8px)'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', alignItems: 'center' }}>
                <h3 style={{ fontFamily: fontFamily, fontWeight: 600, fontSize: '40px', lineHeight: '48px', letterSpacing: '-0.02em', color: '#FFFFFF', textAlign: 'center', width: '100%', margin: 0 }}>1,500+</h3>
                <p style={{ fontFamily: fontFamily, fontWeight: 400, fontSize: '13px', lineHeight: '17px', letterSpacing: '-0.02em', color: 'rgba(255,255,255,0.9)', textAlign: 'center', width: '100%', margin: 0 }}>grassroots touchpoints through<br/>outreach under Grameen Heroes</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', alignItems: 'center' }}>
                <h3 style={{ fontFamily: fontFamily, fontWeight: 600, fontSize: '40px', lineHeight: '48px', letterSpacing: '-0.02em', color: '#FFFFFF', textAlign: 'center', width: '100%', margin: 0 }}>34+</h3>
                <p style={{ fontFamily: fontFamily, fontWeight: 400, fontSize: '13px', lineHeight: '17px', letterSpacing: '-0.02em', color: 'rgba(255,255,255,0.9)', textAlign: 'center', width: '100%', margin: 0 }}>national rural women finalists<br/>supported with grants</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', alignItems: 'center' }}>
                <h3 style={{ fontFamily: fontFamily, fontWeight: 600, fontSize: '40px', lineHeight: '48px', letterSpacing: '-0.02em', color: '#FFFFFF', textAlign: 'center', width: '100%', margin: 0 }}>300+</h3>
                <p style={{ fontFamily: fontFamily, fontWeight: 400, fontSize: '13px', lineHeight: '17px', letterSpacing: '-0.02em', color: 'rgba(255,255,255,0.9)', textAlign: 'center', width: '100%', margin: 0 }}>Covid-widow households<br/>supported with sustenance &<br/>education</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', alignItems: 'center' }}>
                <h3 style={{ fontFamily: fontFamily, fontWeight: 600, fontSize: '40px', lineHeight: '48px', letterSpacing: '-0.02em', color: '#FFFFFF', textAlign: 'center', width: '100%', margin: 0 }}>200+</h3>
                <p style={{ fontFamily: fontFamily, fontWeight: 400, fontSize: '13px', lineHeight: '17px', letterSpacing: '-0.02em', color: 'rgba(255,255,255,0.9)', textAlign: 'center', width: '100%', margin: 0 }}>women supported with livelihood<br/>assets to start enterprises</p>
              </div>
            </div>
          </div>

          {/* Flagship Projects Section - Mobile */}
          <div id="projects" className="flex flex-col items-center px-5" style={{ width: '100%', marginTop: '40px', gap: '24px' }}>
            <h2 style={{ fontFamily: fontFamily, fontWeight: 700, fontSize: '24px', lineHeight: '32px', color: '#000000', textAlign: 'left', width: '100%' }}>Our Flagship Projects</h2>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', width: '100%', overflowX: 'auto', scrollSnapType: 'x mandatory', paddingBottom: '16px', WebkitOverflowScrolling: 'touch' }} className="hide-scrollbar">
              {flagshipProjects.map((project) => (
                <Link key={project.id} href={project.link} className="hover:opacity-90 transition-opacity" style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: '0 0 280px', minWidth: '280px', cursor: 'pointer', scrollSnapAlign: 'start' }}>
                  <div style={{ width: '100%', height: '160px', borderRadius: '16px', overflow: 'hidden', backgroundColor: '#D9D9D9' }}>
                    <img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                    <h3 style={{ fontFamily: fontFamily, fontWeight: 600, fontSize: '16px', lineHeight: '22px', letterSpacing: '-0.02em', color: '#653A96' }}>{project.title}</h3>
                    <p style={{ fontFamily: fontFamily, fontWeight: 400, fontSize: '13px', lineHeight: '18px', letterSpacing: '-0.02em', color: '#333333', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>{project.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Stories of Change Section - Mobile */}
          <div className="flex flex-col items-center px-5" style={{ width: '100%', marginTop: '48px', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <Link href="/about/success-stories" className="hover:opacity-80 transition-opacity" style={{ cursor: 'pointer' }}>
                <h2 style={{ fontFamily: fontFamily, fontWeight: 700, fontSize: '24px', lineHeight: '32px', color: '#000000', textAlign: 'left' }}>Stories of Change</h2>
              </Link>
              <Link href="/about/success-stories" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '8px 16px', gap: '6px', background: '#FECB07', borderRadius: '20px' }} className="hover:opacity-90 transition-opacity">
                <span style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: '12px', lineHeight: '15px', color: '#171717', whiteSpace: 'nowrap' }}>View all</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                  <path d="M13.5 6L20 12M20 12L13.5 18M20 12H4" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', width: '100%', overflowX: 'auto', scrollSnapType: 'x mandatory', paddingBottom: '16px', WebkitOverflowScrolling: 'touch' }} className="hide-scrollbar">
              {storiesOfChange.map((story) => (
                <Link key={story.id} href={`/impact/stories/${story.slug}`} className="hover:opacity-90 transition-opacity" style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: '0 0 260px', minWidth: '260px', cursor: 'pointer', scrollSnapAlign: 'start' }}>
                  <div style={{ width: '100%', height: '150px', borderRadius: '16px', overflow: 'hidden', backgroundColor: '#D9D9D9' }}>
                    <img src={story.image} alt={story.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.src = '/assets/impact/placeholder.jpg'; }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                    <h3 style={{ fontFamily: fontFamily, fontWeight: 600, fontSize: '15px', lineHeight: '20px', letterSpacing: '-0.02em', color: '#653A96' }}>{story.title}</h3>
                    <p style={{ fontFamily: fontFamily, fontWeight: 400, fontSize: '13px', lineHeight: '18px', letterSpacing: '-0.02em', color: '#333333', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{story.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Partners in Impact - Mobile */}
          <div className="flex flex-col items-center px-5" style={{ width: '100%', marginTop: '48px', gap: '24px' }}>
            <h2 style={{ fontFamily: fontFamily, fontWeight: 700, fontSize: '24px', lineHeight: '32px', color: '#000000', textAlign: 'center' }}>Partners in Impact</h2>

            {/* Partner Logos - Mobile - Horizontal scroll */}
            <div style={{ display: 'flex', flexDirection: 'row', gap: '24px', width: '100%', overflowX: 'auto', justifyContent: partners.length <= 3 ? 'center' : 'flex-start', paddingBottom: '8px', WebkitOverflowScrolling: 'touch' }} className="hide-scrollbar">
              {partners.length > 0 ? (
                partners.slice(1, 4).map((partner) => (
                  <div key={partner.id} style={{ flex: '0 0 auto', width: '120px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    <img src={partner.post_thumbnail_url || partner.post_banner_url} alt={partner.post_title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} onError={(e) => { console.error('Partner logo failed to load:', partner.post_title); e.target.style.display = 'none'; }} />
                  </div>
                ))
              ) : (
                <p style={{ fontFamily: fontFamily, color: '#999', fontSize: '14px' }}>Loading partners...</p>
              )}
            </div>

            {/* Partner with us button - Mobile */}
            <Link href="/support" className="flex items-center justify-center hover:opacity-90 transition-opacity" style={{ padding: '12px 24px', background: '#FECB07', borderRadius: '25px' }}>
              <span style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: '14px', lineHeight: '17px', color: '#171717', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                Partner with us
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                  <path d="M13.5 6L20 12M20 12L13.5 18M20 12H4" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </Link>
          </div>

          {/* CTA Section - Mobile Centered */}
          <div className="relative w-full flex flex-col items-center justify-center" style={{ minHeight: '667px', marginTop: '48px', padding: '60px 20px', backgroundImage: ctaImage ? `linear-gradient(0deg, rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url('${ctaImage}')` : 'linear-gradient(0deg, rgba(101, 58, 150, 0.9), rgba(101, 58, 150, 0.9))', backgroundSize: 'cover', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat' }}>
            <div className="flex flex-col items-center" style={{ width: '100%', maxWidth: '320px', gap: '32px' }}>
              <h2 style={{ fontFamily: 'DM Serif Display', fontWeight: 400, fontSize: '28px', lineHeight: '36px', color: '#FFFFFF', textAlign: 'center', width: '100%' }}>
                Join the Movement in<br />
                <span style={{ color: '#FECB07' }}>Creating Wealth for Women</span>
              </h2>
              <div className="flex flex-col items-center" style={{ width: '100%', gap: '12px' }}>
                <Link href="/auth/register" className="flex items-center justify-center hover:opacity-90 transition-opacity" style={{ padding: '14px 28px', background: '#653A96', borderRadius: '30px', width: '100%', maxWidth: '220px' }}>
                  <span style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: '14px', lineHeight: '17px', color: '#FFFFFF', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    Become a Member
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                      <path d="M13.5 6L20 12M20 12L13.5 18M20 12H4" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </Link>
                <Link href="/support" className="flex items-center justify-center hover:opacity-90 transition-opacity" style={{ padding: '14px 28px', background: '#FECB07', borderRadius: '30px', width: '100%', maxWidth: '220px' }}>
                  <span style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: '14px', lineHeight: '17px', color: '#171717', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    Sponsor a Project
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                      <path d="M13.5 6L20 12M20 12L13.5 18M20 12H4" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
