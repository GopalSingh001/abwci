import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useLanguage } from '../../lib/LanguageContext';
import Link from 'next/link';

export default function Project() {
  const { t } = useLanguage();
  const fontFamily = 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const projects = [
    {
      id: 1,
      title: 'Grameen Heroes',
      description: 'Grameen Heroes is a flagship CSR initiative of Hero MotoCorp Ltd., implemented by ABWCI to surface, strengthen and scale rural and semi-urban women-led enterprises across India. Adapted from the Shark Tank model, the program built confidence, business leadership, and community impact among women entrepreneurs.',
      image: '',
      imagePosition: 'left'
    },
    {
      id: 2,
      title: 'Women Entrepreneurs for Women Entrepreneurs (WE4WE)',
      description: 'WE4WE unlocked the entrepreneurial power of tribal women in Koraput, Odisha by strengthening women-led Farmer Producer Organizations (FPOs) through market linkages, investment readiness, and structured mentorship. ABWCI strengthened four women-led Farmer Producer Organisations (FPOs) representing more than 3,500 farmers, enabling them to operate with greater efficiency and market confidence. The initiative secured two confirmed procurement contracts for turmeric and facilitated multiple additional buyer linkages, expanding market access for the FPOs. Alongside this, ABWCI delivered a year-long mentoring programme focused on leadership, business planning, digital visibility, and market preparedness, significantly enhancing the entrepreneurial and organisational capabilities of the women leaders.',
      image: '',
      imagePosition: 'right'
    },
    {
      id: 3,
      title: 'Hero for Humanity (Empowering Women Affected by COVID-19 Through Livelihood and Enterprise Support)',
      description: 'The COVID-19 pandemic left thousands of women widowed overnight—emotionally devastated and suddenly burdened with the responsibility of sustaining their families on their own. Many had never held paid employment and were excluded from formal financial systems. Project Hero for Humanity, supported by Hero MotoCorp and implemented by ABWCI, stood with women from Odisha and Karnataka, supporting them in their journey towards dignity, sustainable livelihoods, and renewed hope.',
      image: '',
      imagePosition: 'left'
    }
  ];

  return (
    <Layout>
      <div 
        style={{
          position: 'relative',
          width: '100%',
          minHeight: isMobile ? 'auto' : '1487px',
          background: '#FFFFFF'
        }}
      >
        {/* Hero Section */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: isMobile ? '300px' : '370px',
            background: 'linear-gradient(90deg, #653A96 35.1%, #FECB07 66.35%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'relative', width: '100%', maxWidth: '1400px', height: '100%', padding: isMobile ? '0 20px' : '0 80px', display: 'flex', alignItems: 'center', justifyContent: isMobile ? 'center' : 'space-between' }}>
            {/* Left Content */}
            <div style={{ position: 'relative', zIndex: 2, textAlign: isMobile ? 'center' : 'left', width: isMobile ? '100%' : 'auto' }}>
              {/* Back Button - Mobile */}
              {isMobile && (
                <Link
                  href="/impact"
                  style={{
                    position: 'absolute',
                    top: '-60px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    width: '36px',
                    height: '36px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.6667 17H11.3333M11.3333 17L17 22.6667M11.3333 17L17 11.3333" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              )}
              
              {/* Back Button - Desktop */}
              {!isMobile && (
                <Link
                  href="/impact"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    marginBottom: '45px'
                  }}
                >
                  <svg width="44" height="44" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.6667 17H11.3333M11.3333 17L17 22.6667M11.3333 17L17 11.3333" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              )}

              {/* Breadcrumb */}
              <div
                style={{
                  fontFamily: fontFamily,
                  fontWeight: 500,
                  fontSize: isMobile ? '12px' : '16px',
                  lineHeight: '20px',
                  color: '#FFFFFF',
                  marginBottom: isMobile ? '12px' : '16px'
                }}
              >
                Our Impact &gt; Projects
              </div>

              {/* Projects Title */}
              <h1
                style={{
                  fontFamily: 'DM Serif Display',
                  fontWeight: 400,
                  fontSize: isMobile ? '36px' : '64px',
                  lineHeight: isMobile ? '42px' : '72px',
                  color: '#FFFFFF',
                  margin: 0
                }}
              >
                Projects
              </h1>
            </div>

            {/* Hero Illustration */}
            {!isMobile && (
              <div
                style={{
                  position: 'relative',
                  width: '320px',
                  height: '320px',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'flex-end',
                  marginTop: '60px'
                }}
              >
                <img
                  src="/emancipation-of-women/bro.png"
                  alt="Women Empowerment"
                  style={{
                    width: '100%',
                    
                    objectFit: 'contain',
                    objectPosition: 'bottom'
                  }}
                  
                />
              </div>
            )}
          </div>
        </div>

        {/* Project 1 - Grameen Heroes */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingBottom: isMobile ? '0' : '20px'
          }}
        >
          <div style={{ position: 'relative', width: '100%', maxWidth: isMobile ? '100%' : '1600px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '0', alignItems: 'stretch', margin: '0 auto' }}>
            {/* Image */}
            <div
              style={{
                width: isMobile ? '100%' : '55%',
                minWidth: isMobile ? 'auto' : '650px',
                minHeight: isMobile ? '200px' : '400px',
                height: isMobile ? '200px' : 'auto',
                backgroundImage: 'url(/projects/main1.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                flexShrink: 0
              }}
            />
            {/* Content */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: isMobile ? '16px' : '30px',
                padding: isMobile ? '24px 20px' : '60px 80px',
                justifyContent: 'center'
              }}
            >
              <h2
                style={{
                  fontFamily: fontFamily,
                  fontWeight: 500,
                  fontSize: isMobile ? '20px' : '32px',
                  lineHeight: isMobile ? '26px' : '39px',
                  letterSpacing: '-0.02em',
                  color: '#653A96',
                  margin: 0
                }}
              >
                Grameen Heroes
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '12px' : '20px' }}>
                <p
                  style={{
                    fontFamily: fontFamily,
                    fontWeight: 400,
                    fontSize: isMobile ? '13px' : '15px',
                    lineHeight: isMobile ? '19px' : '22px',
                    letterSpacing: '0',
                    color: '#333333',
                    margin: 0
                  }}
                >
                 Grameen Heroes is a flagship CSR initiative of Hero MotoCorp Ltd., implemented by ABWCI to surface, strengthen and scale rural and semi-urban women-led enterprises across India. Adapted from the Shark Tank model, the program built confidence, business leadership, and community impact among women entrepreneurs. 
                 </p>
                <Link
                  href="/impact/grameen-heroes"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: 'fit-content'
                  }}
                >
                  <span
                    style={{
                      fontFamily: fontFamily,
                      fontWeight: 500,
                      fontSize: isMobile ? '14px' : '16px',
                      lineHeight: '20px',
                      letterSpacing: '-0.02em',
                      color: '#653A96',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    View Full Project
                    <svg width={isMobile ? "20" : "24"} height={isMobile ? "20" : "24"} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                      <path d="M13.5 6L20 12M20 12L13.5 18M20 12H4" stroke="#653A96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Project 2 - WE4WE */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: isMobile ? '0' : '20px 0'
          }}
        >
          <div style={{ position: 'relative', width: '100%', maxWidth: isMobile ? '100%' : '1600px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '0', alignItems: 'stretch', margin: '0 auto' }}>
            {/* Content */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: isMobile ? '16px' : '30px',
                padding: isMobile ? '24px 20px' : '60px 80px',
                justifyContent: 'center',
                order: isMobile ? 2 : 0
              }}
            >
              <h2
                style={{
                  fontFamily: fontFamily,
                  fontWeight: 500,
                  fontSize: isMobile ? '20px' : '32px',
                  lineHeight: isMobile ? '26px' : '39px',
                  letterSpacing: '-0.02em',
                  color: '#653A96',
                  margin: 0
                }}
              >
                Women Entrepreneurs for Women Entrepreneurs (WE4WE)
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '12px' : '20px' }}>
                <p
                  style={{
                    fontFamily: fontFamily,
                    fontWeight: 400,
                    fontSize: isMobile ? '13px' : '15px',
                    lineHeight: isMobile ? '19px' : '22px',
                    letterSpacing: '0',
                    color: '#333333',
                    margin: 0
                  }}
                >
                 WE4WE unlocked the entrepreneurial power of tribal women in Koraput, Odisha by strengthening women-led Farmer Producer Organizations (FPOs) through market linkages, investment readiness, and structured mentorship. 
ABWCI strengthened four women-led Farmer Producer Organisations (FPOs) representing more than 3,500  farmers, enabling them to operate with greater efficiency and market confidence. The initiative secured two confirmed procurement contracts for turmeric and facilitated multiple additional buyer linkages, expanding market access for the FPOs. Alongside this, ABWCI delivered a year-long mentoring programme focused on leadership, business planning, digital visibility, and market preparedness, significantly enhancing the entrepreneurial and organisational capabilities of the women leaders.
         </p>
                <Link
                  href="/impact/we4we"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: 'fit-content'
                  }}
                >
                  <span
                    style={{
                      fontFamily: fontFamily,
                      fontWeight: 500,
                      fontSize: isMobile ? '14px' : '16px',
                      lineHeight: '20px',
                      letterSpacing: '-0.02em',
                      color: '#653A96',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    View Full Project
                    <svg width={isMobile ? "20" : "24"} height={isMobile ? "20" : "24"} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                      <path d="M13.5 6L20 12M20 12L13.5 18M20 12H4" stroke="#653A96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
            {/* Image */}
            <div
              style={{
                width: isMobile ? '100%' : '55%',
                minWidth: isMobile ? 'auto' : '650px',
                minHeight: isMobile ? '200px' : '400px',
                height: isMobile ? '200px' : 'auto',
                backgroundImage: 'url(/projects/main3.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                flexShrink: 0,
                order: isMobile ? 1 : 0
              }}
            />
          </div>
        </div>

        {/* Project 3 - Hero for Humanity */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: isMobile ? '0 0 40px 0' : '20px 0'
          }}
        >
          <div style={{ position: 'relative', width: '100%', maxWidth: isMobile ? '100%' : '1600px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '0', alignItems: 'stretch', margin: '0 auto' }}>
            {/* Image */}
            <div
              style={{
                width: isMobile ? '100%' : '55%',
                minWidth: isMobile ? 'auto' : '650px',
                minHeight: isMobile ? '200px' : '400px',
                height: isMobile ? '200px' : 'auto',
                backgroundImage: 'url(/projects/main2.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                flexShrink: 0
              }}
            />
            {/* Content */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: isMobile ? '16px' : '30px',
                padding: isMobile ? '24px 20px' : '60px 80px',
                justifyContent: 'center'
              }}
            >
              <h2
                style={{
                  fontFamily: fontFamily,
                  fontWeight: 500,
                  fontSize: isMobile ? '20px' : '32px',
                  lineHeight: isMobile ? '26px' : '39px',
                  letterSpacing: '-0.02em',
                  color: '#653A96',
                  margin: 0
                }}
              >
                Hero for Humanity (Empowering Women Affected by COVID-19 Through Livelihood and Enterprise Support)
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '12px' : '20px' }}>
                <p
                  style={{
                    fontFamily: fontFamily,
                    fontWeight: 400,
                    fontSize: isMobile ? '13px' : '15px',
                    lineHeight: isMobile ? '19px' : '22px',
                    letterSpacing: '0',
                    color: '#333333',
                    margin: 0
                  }}
                >
                 The COVID-19 pandemic left thousands of women widowed overnight—emotionally devastated and suddenly burdened with the responsibility of sustaining their families on their own. Many had never held paid employment and were excluded from formal financial systems. Project Hero for Humanity, supported by Hero MotoCorp and implemented by ABWCI, stood with women from Odisha and Karnataka, supporting them in their journey towards dignity, sustainable livelihoods, and renewed hope.     </p>
                <Link
                  href="/impact/hero-for-humanity"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: 'fit-content'
                  }}
                >
                  <span
                    style={{
                      fontFamily: fontFamily,
                      fontWeight: 500,
                      fontSize: isMobile ? '14px' : '16px',
                      lineHeight: '20px',
                      letterSpacing: '-0.02em',
                      color: '#653A96',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    View Full Project
                    <svg width={isMobile ? "20" : "24"} height={isMobile ? "20" : "24"} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                      <path d="M13.5 6L20 12M20 12L13.5 18M20 12H4" stroke="#653A96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
