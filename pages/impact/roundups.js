import Layout from '../../components/Layout';
import { useLanguage } from '../../lib/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Roundups() {
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
  
  return (
    <Layout>
      <div 
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '100vh',
          background: '#FFFFFF'
        }}
      >
        {/* Hero Section */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: isMobile ? '250px' : '370px',
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
              {/* Back Button */}
              <Link
                href="/impact"
                style={{
                  display: isMobile ? 'none' : 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  marginBottom: '45px'
                }}
              >
                <svg width="44" height="44" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.6667 17H11.3333M11.3333 17L17 22.6667M11.3333 17L17 11.3333" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>

              {/* Breadcrumb */}
              <div
                style={{
                  fontFamily: fontFamily,
                  fontWeight: 500,
                  fontSize: isMobile ? '14px' : '16px',
                  lineHeight: '20px',
                  color: '#FFFFFF',
                  marginBottom: '16px'
                }}
              >
                Our Impact &gt; Roundups
              </div>

              {/* Roundups Title */}
              <h1
                style={{
                  fontFamily: 'DM Serif Display',
                  fontWeight: 400,
                  fontSize: isMobile ? '42px' : '64px',
                  lineHeight: isMobile ? '48px' : '72px',
                  color: '#FFFFFF',
                  margin: 0
                }}
              >
                Roundups
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
                <Image
                  src="/conversation/bro.png"
                  alt="Women Empowerment"
                  width={320}
                  height={320}
                  quality={100}
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'contain',
                    objectPosition: 'bottom'
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Frame 7962 - Roundups List */}
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: isMobile ? '30px 20px' : '60px 80px',
            width: '100%',
            maxWidth: '1400px',
            margin: '0 auto',
            gap: '8px'
          }}
        >
          {/* 2024-25 Edition */}
          <div
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'flex-start' : 'center',
              justifyContent: 'flex-start',
              padding: isMobile ? '15px 0px' : '20px 0px',
              width: '100%',
              borderBottom: '1px solid #9D9D9D',
              gap: isMobile ? '10px' : '0'
            }}
          >
            <span
              style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: isMobile ? '16px' : '20px',
                lineHeight: '24px',
                letterSpacing: '-0.02em',
                color: '#000000',
                minWidth: isMobile ? 'auto' : '400px',
                flexShrink: 0
              }}
            >
              2024-25 Edition
            </span>
            <a
              href="/downloads/roundups/ABWCI Roundup 2024-25.pdf"
              download
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '17px',
                letterSpacing: '-0.02em',
                color: '#653A96',
                textDecoration: 'none',
                whiteSpace: 'nowrap'
              }}
            >
              Download
            </a>
          </div>

          {/* October 2024 Edition */}
          <div
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'flex-start' : 'center',
              justifyContent: 'flex-start',
              padding: isMobile ? '15px 0px' : '20px 0px',
              width: '100%',
              borderBottom: '1px solid #9D9D9D',
              gap: isMobile ? '10px' : '0'
            }}
          >
            <span
              style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: isMobile ? '16px' : '20px',
                lineHeight: '24px',
                letterSpacing: '-0.02em',
                color: '#000000',
                minWidth: isMobile ? 'auto' : '400px',
                flexShrink: 0
              }}
            >
              October 2024 Edition
            </span>
            <a
              href="/downloads/roundups/ABWCI_s Roundup - October 2024 edition.pdf"
              download
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '17px',
                letterSpacing: '-0.02em',
                color: '#653A96',
                textDecoration: 'none',
                whiteSpace: 'nowrap'
              }}
            >
              Download
            </a>
          </div>

          {/* December 2023 Edition */}
          <div
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'flex-start' : 'center',
              justifyContent: 'flex-start',
              padding: isMobile ? '15px 0px' : '20px 0px',
              width: '100%',
              borderBottom: '1px solid #9D9D9D',
              gap: isMobile ? '10px' : '0'
            }}
          >
            <span
              style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: isMobile ? '16px' : '20px',
                lineHeight: '24px',
                letterSpacing: '-0.02em',
                color: '#000000',
                minWidth: isMobile ? 'auto' : '400px',
                flexShrink: 0
              }}
            >
              December 2023 Edition
            </span>
            <a
              href="/downloads/roundups/ABWCI_s Roundup (December 2023 Edition).pdf"
              download
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '17px',
                letterSpacing: '-0.02em',
                color: '#653A96',
                textDecoration: 'none',
                whiteSpace: 'nowrap'
              }}
            >
              Download
            </a>
          </div>

          {/* May 2024 Edition */}
          <div
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'flex-start' : 'center',
              justifyContent: 'flex-start',
              padding: isMobile ? '15px 0px' : '20px 0px',
              width: '100%',
              borderBottom: '1px solid #9D9D9D',
              gap: isMobile ? '10px' : '0'
            }}
          >
            <span
              style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: isMobile ? '16px' : '20px',
                lineHeight: '24px',
                letterSpacing: '-0.02em',
                color: '#000000',
                minWidth: isMobile ? 'auto' : '400px',
                flexShrink: 0
              }}
            >
              May 2024 Edition
            </span>
            <a
              href="/downloads/roundups/ABWCI Roundup (May 2024 Edition).pdf"
              download
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '17px',
                letterSpacing: '-0.02em',
                color: '#653A96',
                textDecoration: 'none',
                whiteSpace: 'nowrap'
              }}
            >
              Download
            </a>
          </div>

          {/* September 2023 Edition */}
          <div
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'flex-start' : 'center',
              justifyContent: 'flex-start',
              padding: isMobile ? '15px 0px' : '20px 0px',
              width: '100%',
              borderBottom: '1px solid #9D9D9D',
              gap: isMobile ? '10px' : '0'
            }}
          >
            <span
              style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: isMobile ? '16px' : '20px',
                lineHeight: '24px',
                letterSpacing: '-0.02em',
                color: '#000000',
                minWidth: isMobile ? 'auto' : '400px',
                flexShrink: 0
              }}
            >
              September 2023 Edition
            </span>
            <a
              href="/downloads/roundups/ABWCI_s Roundup (September 2023 Edition).pdf"
              download
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '17px',
                letterSpacing: '-0.02em',
                color: '#653A96',
                textDecoration: 'none',
                whiteSpace: 'nowrap'
              }}
            >
              Download
            </a>
          </div>

          {/* April 2023 Edition */}
          <div
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'flex-start' : 'center',
              justifyContent: 'flex-start',
              padding: isMobile ? '15px 0px' : '20px 0px',
              width: '100%',
              borderBottom: '1px solid #9D9D9D',
              gap: isMobile ? '10px' : '0'
            }}
          >
            <span
              style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: isMobile ? '16px' : '20px',
                lineHeight: '24px',
                letterSpacing: '-0.02em',
                color: '#000000',
                minWidth: isMobile ? 'auto' : '400px',
                flexShrink: 0
              }}
            >
              April 2023 Edition
            </span>
            <a
              href="/downloads/roundups/ABWCI_s Roundup (April 2023 Edition).pdf"
              download
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '17px',
                letterSpacing: '-0.02em',
                color: '#653A96',
                textDecoration: 'none',
                whiteSpace: 'nowrap'
              }}
            >
              Download
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}

