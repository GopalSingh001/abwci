import Layout from '../../components/Layout';
import { useLanguage } from '../../lib/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function We4We() {
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
          minHeight: isMobile ? 'auto' : '4230px',
          background: '#FFFFFF'
        }}
      >
        {/* Hero Section */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: isMobile ? '450px' : '650px',
            left: '0px',
            top: '0px',
            overflow: 'hidden'
          }}
        >
          {/* Background Image */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `linear-gradient(180deg, rgba(101, 58, 150, 0) 41.35%, #653A96 84.62%), url(${encodeURI("/project-2/Rectangle 213.png")})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
              willChange: 'transform',
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden',
              transform: 'translate3d(0, 0, 0)',
              WebkitTransform: 'translate3d(0, 0, 0)',
              msTransform: 'translate3d(0, 0, 0)'
            }}
          />
          
          {/* Content Section - Breadcrumb, Title, Social Icons */}
          <div
            style={{
              position: 'absolute',
              display: 'flex',
              flexDirection: 'column',
              alignItems: isMobile ? 'center' : 'flex-start',
              gap: isMobile ? '8px' : '10px',
              left: isMobile ? '50%' : '180px',
              transform: isMobile ? 'translateX(-50%)' : 'none',
              bottom: isMobile ? '20px' : '60px',
              zIndex: 10,
              paddingRight: isMobile ? '0' : '200px',
              width: isMobile ? '90%' : 'auto'
            }}
          >
            {/* Breadcrumb */}
            <p style={{ 
              fontFamily: fontFamily, 
              fontWeight: 400, 
              fontSize: isMobile ? '12px' : '16px', 
              lineHeight: '20px', 
              color: '#FFFFFF', 
              margin: 0,
              verticalAlign: 'top',
              marginLeft: isMobile ? '0' : '2px',
              textAlign: isMobile ? 'center' : 'left'
            }}>
              Our Impact &gt; Projects &gt; We4We
            </p>

            {/* Title */}
            <h1 style={{ 
              fontFamily: 'DM Serif Display', 
              fontWeight: 400, 
              fontSize: isMobile ? '28px' : '48px', 
              lineHeight: isMobile ? '36px' : '60px', 
              letterSpacing: '-0.02em', 
              color: '#FFFFFF', 
              margin: 0,
              verticalAlign: 'top',
              textAlign: isMobile ? 'center' : 'left'
            }}>
              {isMobile ? 'Women Entrepreneurs for Women Entrepreneurs - We4We' : (
                <>
                  Women Entrepreneurs for Women 
                  <br />
                  Entrepreneurs - We4We
                </>
              )}
            </h1>

            {/* Social Icons */}
            <div style={{ 
              display: isMobile ? 'none' : 'flex', 
              flexDirection: 'row', 
              alignItems: 'center', 
              gap: '20px',
              verticalAlign: 'top',
              marginTop: '20px',
              marginLeft: '2px'
            }}>
              {/* Instagram */}
              <a href="#" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="#FFFFFF"/>
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="#" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="#FFFFFF"/>
                </svg>
              </a>
              {/* Twitter/X */}
              <a href="#" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="#FFFFFF"/>
                </svg>
              </a>
              {/* Facebook */}
              <a href="#" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#FFFFFF"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Download Button */}
          {!isMobile && (
            <a
              href={encodeURI("/project-2/WE4WE Consolidated Report.pdf")}
              download
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: '10px 30px',
                gap: '12px',
                position: 'absolute',
                width: '231px',
                height: '38px',
                right: '80px',
                bottom: '60px',
                background: '#FECB07',
                borderRadius: '30px',
                textDecoration: 'none',
                zIndex: 10
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 12L5 8H7.5V3H10.5V8H13L9 12Z" fill="#000000"/>
                <path d="M15 15H3V10H1.5V15C1.5 15.825 2.175 16.5 3 16.5H15C15.825 16.5 16.5 15.825 16.5 15V10H15V15Z" fill="#000000"/>
              </svg>
              <span style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: '14px', lineHeight: '17px', color: '#171717' }}>
                Download Full Report
              </span>
            </a>
          )}
        </div>

        {/* Content Container */}
        <div style={{ maxWidth: isMobile ? '100%' : '1280px', margin: '0 auto', padding: isMobile ? '0 20px' : '0 80px', position: 'relative', paddingTop: isMobile ? '24px' : '60px' }}>
          {/* Mobile Download Button */}
          {isMobile && (
            <a
              href={encodeURI("/project-2/WE4WE Consolidated Report.pdf")}
              download
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 24px',
                gap: '10px',
                width: '100%',
                background: '#FECB07',
                borderRadius: '30px',
                textDecoration: 'none',
                marginBottom: '24px'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 12L5 8H7.5V3H10.5V8H13L9 12Z" fill="#000000"/>
                <path d="M15 15H3V10H1.5V15C1.5 15.825 2.175 16.5 3 16.5H15C15.825 16.5 16.5 15.825 16.5 15V10H15V15Z" fill="#000000"/>
              </svg>
              <span style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: '14px', lineHeight: '17px', color: '#171717' }}>
                Download Full Report
              </span>
            </a>
          )}

          {/* Subtitle Quote - At the Top */}
          <p
            style={{
              marginTop: '0px',
              marginBottom: isMobile ? '16px' : '20px',
              fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
              fontWeight: 400,
              fontSize: isMobile ? '20px' : '32px',
              lineHeight: isMobile ? '28px' : '40px',
              color: '#653A96',
              textAlign: isMobile ? 'center' : 'left'
            }}
          >
            " Strengthening women-led FPOs for sustainable agribusiness growth "
          </p>

          {/* Main Description */}
          <div
            style={{
              marginTop: '0px',
              marginBottom: isMobile ? '16px' : '20px',
              fontFamily: fontFamily,
              fontWeight: 400,
              fontSize: isMobile ? '13px' : '16px',
              lineHeight: isMobile ? '19px' : '19px',
              color: '#171717'
            }}
          >
            <p style={{ margin: '0 0 10px 0' }}>
              Women Entrepreneurs for Women Entrepreneurs (WE4WE) unlocked the entrepreneurial power of tribal women in Koraput, Odisha by strengthening women-led Farmer Producer Organizations (FPOs) through:
            </p>
            <ul style={{ margin: '10px 0 0 0', paddingLeft: '20px', listStyleType: 'disc' }}>
              <li style={{ marginBottom: '6px' }}>Market linkages</li>
              <li style={{ marginBottom: '6px' }}>Investment readiness</li>
              <li style={{ marginBottom: '0px' }}>Structured mentorship</li>
            </ul>
          </div>

          {/* Two Column Section - Where we worked & Map */}
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '24px' : '60px', marginTop: isMobile ? '24px' : '40px', alignItems: 'flex-start', position: 'relative' }}>
            {/* Left Column - Text Content */}
            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '0px' }}>
              {/* Where we worked */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '0px',
                  gap: isMobile ? '12px' : '18px'
                }}
              >
                <h3 style={{ fontFamily: fontFamily, fontWeight: 700, fontSize: isMobile ? '14px' : '16px', lineHeight: '20px', letterSpacing: '-0.02em', color: '#653A96', margin: 0 }}>
                  Where we worked
                </h3>
                <div style={{ fontFamily: fontFamily, fontWeight: 400, fontSize: isMobile ? '13px' : '16px', lineHeight: isMobile ? '17px' : '19px', color: '#000000' }}>
                  <p style={{ margin: '0 0 8px 0' }}>📍 8 women-led FPOs assessed</p>
                  <p style={{ margin: 0 }}>📍 4 high-potential women-led FPOs selected</p>
                </div>
              </div>

              {/* What we achieved */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '0px',
                  gap: isMobile ? '12px' : '18px',
                  marginTop: isMobile ? '20px' : '35px'
                }}
              >
                <h3 style={{ fontFamily: fontFamily, fontWeight: 700, fontSize: isMobile ? '14px' : '16px', lineHeight: '20px', letterSpacing: '-0.02em', color: '#653A96', margin: 0 }}>
                  What we achieved
                </h3>
                <p style={{ fontFamily: fontFamily, fontWeight: 400, fontSize: isMobile ? '13px' : '16px', lineHeight: isMobile ? '17px' : '19px', color: '#000000', margin: 0 }}>
                  Even as a pilot, WE4WE built a powerful foundation for long-term enterprise success:
                </p>
              </div>
            </div>

            {/* Odisha Map */}
            <div
              style={{
                width: isMobile ? '100%' : '650px',
                height: isMobile ? 'auto' : '408px',
                flexShrink: 0,
                marginLeft: isMobile ? '0' : '40px',
                marginTop: isMobile ? '0' : '-20px'
              }}
            >
              <Image
                src={encodeURI("/project-2/Odisha Map Chart 1.svg")}
                alt="Odisha Map showing project reach"
                width={650}
                height={408}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
          </div>

          {/* Achievement Boxes - 2x2 Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '20px' : '30px', marginTop: isMobile ? '30px' : '60px' }}>
            {/* Strengthening Business Systems */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '15px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "28" : "36"} height={isMobile ? "28" : "36"} viewBox="0 0 16 16" style={{ flexShrink: 0 }}>
                  <path fill="#e6b00d" d="M12 6V2L8 0L4 2v4L0 8v5l4 2l4-2l4 2l4-2V8zM8.09 1.12L11 2.56l-2.6 1.3l-2.91-1.44zM5 2.78l3 1.5v3.6l-3-1.5zm-1 11.1l-3-1.5v-3.6l3 1.5zm.28-4L1.4 8.42L4 7.12l2.88 1.44zm7.72 4l-3-1.5v-3.6l3 1.5zm.28-4L9.4 8.42l2.6-1.3l2.88 1.44z"/>
                </svg>
                <h4 style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: isMobile ? '14px' : '16px', lineHeight: '20px', color: '#171717', margin: 0 }}>
                  Strengthening Business Systems
                </h4>
              </div>
              <p style={{ fontFamily: fontFamily, fontWeight: 400, fontSize: isMobile ? '13px' : '16px', lineHeight: isMobile ? '17px' : '19px', color: '#000000', margin: 0 }}>
                Custom investment models developed for each FPO. Improved documentation and market understanding.
              </p>
            </div>

            {/* High-Impact Mentoring */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '15px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "28" : "36"} height={isMobile ? "28" : "36"} viewBox="0 0 24 24">
	<path fill="#ffda03" d="M8.487 14.887c.39 0 .706.314.706.7a.703.703 0 0 1-.706.7H5.632a.703.703 0 0 1-.707-.7c0-.386.317-.7.707-.7zm.69-2.593c.39 0 .706.315.706.7a.703.703 0 0 1-.707.7H5.648a.703.703 0 0 1-.706-.7c0-.386.316-.7.706-.7zm3.864-3.46a2.11 2.11 0 0 1 2.118-2.099a2.11 2.11 0 0 1 2.118 2.1a2.115 2.115 0 0 1-2.118 2.103a2.116 2.116 0 0 1-2.118-2.104m6.259 6.559c.1.619-.378 1.18-1.005 1.178h-6.272a1.016 1.016 0 0 1-1.005-1.178c.315-1.942 1.391-3.509 2.796-4.13a2.77 2.77 0 0 0 2.69 0c1.405.621 2.482 2.19 2.796 4.13m-8.712-4.29c-8.38 0-.147-.002-4.941-.002a.703.703 0 0 1-.707-.7c0-.386.317-.7.707-.7l4.941.001c.39 0 .707.314.706.701a.7.7 0 0 1-.706.7m-4.94-2.594a.7.7 0 0 1-.707-.7c0-.386.317-.7.707-.7h4.94c.389 0 .705.313.705.7a.703.703 0 0 1-.706.699zm7.809 10.117a.66.66 0 0 0 .66-.654h7.06v-12.6H2.824v12.599h7.059c0 .361.295.654.66.654zM24 17.972v.957c0 .605-.496 1.096-1.106 1.096H1.106c-.61 0-1.106-.49-1.106-1.096v-.957h1.413V5.357c0-.763.623-1.382 1.394-1.382h18.387c.77 0 1.394.619 1.394 1.382v12.615Z" />
</svg>
                <h4 style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: isMobile ? '14px' : '16px', lineHeight: '20px', color: '#171717', margin: 0 }}>
                  High-Impact Mentoring
                </h4>
              </div>
              <p style={{ fontFamily: fontFamily, fontWeight: 400, fontSize: isMobile ? '13px' : '16px', lineHeight: isMobile ? '17px' : '19px', color: '#000000', margin: 0 }}>
                6+ sessions with successful women entrepreneurs and sector experts, ranging from motivational sessions to export readiness and digital marketing.
              </p>
            </div>

            {/* First Market Linkages Created */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '15px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "28" : "36"} height={isMobile ? "28" : "36"} viewBox="0 0 24 24"><path fill="none" stroke="#fde000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 0 0-5.656 0l-4 4a4 4 0 1 0 5.656 5.656l1.102-1.101m-.758-4.899a4 4 0 0 0 5.656 0l4-4a4 4 0 0 0-5.656-5.656l-1.1 1.1"/></svg>
                <h4 style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: isMobile ? '14px' : '16px', lineHeight: '20px', color: '#171717', margin: 0 }}>
                  First Market Linkages Created
                </h4>
              </div>
              <p style={{ fontFamily: fontFamily, fontWeight: 400, fontSize: isMobile ? '13px' : '16px', lineHeight: isMobile ? '17px' : '19px', color: '#000000', margin: 0 }}>
                Procurement contracts signed for turmeric supply with buyers. Discussions initiated with digital platforms and aggregators like Kissansay.com.
              </p>
            </div>

            {/* Women Taking Leadership Roles */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '15px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "28" : "36"} height={isMobile ? "28" : "36"} viewBox="0 0 24 24"><path fill="#f2c90c" d="M11.94 3A3.993 3.993 0 0 0 8 7c-.06 1.64-.19 3.47-.97 4.59C9.71 13.22 12 13 12 13s2.29.22 4.97-1.41C16.12 10.22 15.94 8.54 16 7c0-2.21-1.79-4-4-4zM8.86 13.32C6 13.93 4 15.35 4 17v4h8l-3-4H6.5m5.5 4l1.78-7.19S13 14 12 14s-1.78-.19-1.78-.19M12 21h8v-4c0-1.65-2-3.07-4.86-3.68L17.5 17H15Z"/></svg>
                <h4 style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: isMobile ? '14px' : '16px', lineHeight: '20px', color: '#171717', margin: 0 }}>
                  Women Taking Leadership Roles
                </h4>
              </div>
              <p style={{ fontFamily: fontFamily, fontWeight: 400, fontSize: isMobile ? '13px' : '16px', lineHeight: isMobile ? '17px' : '19px', color: '#000000', margin: 0 }}>
                Board members across FPOs now actively negotiating with buyers, with enhanced confidence, visibility and decision-making.
              </p>
            </div>
          </div>

          {/* The 4 Pilot FPOs Section */}
          <div style={{ marginTop: isMobile ? '40px' : '80px' }}>
            <h3 style={{ fontFamily: fontFamily, fontWeight: 700, fontSize: isMobile ? '16px' : '20px', lineHeight: '24px', letterSpacing: '-0.02em', color: '#653A96', margin: '0 0 24px 0' }}>
              The 4 Pilot FPOs
            </h3>

            {/* FPO Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? '12px' : '20px', marginBottom: isMobile ? '24px' : '40px' }}>
              {/* FPO Images */}
              <div style={{ width: '100%', height: isMobile ? '140px' : '232px', background: '#D9D9D9', borderRadius: '10px' }}>
                <img src="/project-2/fpo1.png" alt="Dhartani FPO" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
              </div>
              <div style={{ width: '100%', height: isMobile ? '140px' : '232px', background: '#D9D9D9', borderRadius: '10px' }}>
                <img src="/project-2/fpo2.png" alt="Dakrighati Mahila Agro" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
              </div>
              <div style={{ width: '100%', height: isMobile ? '140px' : '232px', background: '#D9D9D9', borderRadius: '10px' }}>
                <img src="/project-2/fpo3.png" alt="Alekha Mahima" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
              </div>
              <div style={{ width: '100%', height: isMobile ? '140px' : '232px', background: '#D9D9D9', borderRadius: '10px' }}>
                <img src="/project-2/fpo4.png" alt="Laxmipur" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
              </div>
            </div>

            {/* FPO Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? '16px' : '20px' }}>
              {/* Dhartani FPO */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '10px' : '16px' }}>
                <h4 style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: isMobile ? '14px' : '18px', lineHeight: isMobile ? '18px' : '22px', letterSpacing: '-0.02em', color: '#000000', margin: 0 }}>
                  Dhartani FPO
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <p style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: isMobile ? '12px' : '16px', lineHeight: isMobile ? '16px' : '20px', letterSpacing: '-0.02em', color: '#653A96', margin: 0 }}>
                    Commodity Focus
                  </p>
                  <p style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: isMobile ? '13px' : '18px', lineHeight: isMobile ? '17px' : '22px', letterSpacing: '-0.02em', color: '#000000', margin: 0 }}>
                    Ginger, turmeric, millet
                  </p>
                </div>
                <p style={{ fontFamily: fontFamily, fontStyle: 'italic', fontWeight: 500, fontSize: isMobile ? '12px' : '17px', lineHeight: isMobile ? '16px' : '21px', letterSpacing: '-0.02em', color: '#653A96', margin: 0 }}>
                  Strong women-led decision-making & marketing confidence
                </p>
              </div>

              {/* Dakrighati Mahila Agro */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '10px' : '16px' }}>
                <h4 style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: isMobile ? '14px' : '18px', lineHeight: isMobile ? '18px' : '22px', letterSpacing: '-0.02em', color: '#000000', margin: 0 }}>
                  Dakrighati Mahila Agro
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <p style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: isMobile ? '12px' : '16px', lineHeight: isMobile ? '16px' : '20px', letterSpacing: '-0.02em', color: '#653A96', margin: 0 }}>
                    Commodity Focus
                  </p>
                  <p style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: isMobile ? '13px' : '18px', lineHeight: isMobile ? '17px' : '22px', letterSpacing: '-0.02em', color: '#000000', margin: 0 }}>
                    Sweet potato, ginger, turmeric
                  </p>
                </div>
                <p style={{ fontFamily: fontFamily, fontStyle: 'italic', fontWeight: 500, fontSize: isMobile ? '12px' : '17px', lineHeight: isMobile ? '16px' : '21px', letterSpacing: '-0.02em', color: '#653A96', margin: 0 }}>
                  Ready infrastructure for scale
                </p>
              </div>

              {/* Alekha Mahima */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '10px' : '16px' }}>
                <h4 style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: isMobile ? '14px' : '18px', lineHeight: isMobile ? '18px' : '22px', letterSpacing: '-0.02em', color: '#000000', margin: 0 }}>
                  Alekha Mahima
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <p style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: isMobile ? '12px' : '16px', lineHeight: isMobile ? '16px' : '20px', letterSpacing: '-0.02em', color: '#653A96', margin: 0 }}>
                    Commodity Focus
                  </p>
                  <p style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: isMobile ? '13px' : '18px', lineHeight: isMobile ? '17px' : '22px', letterSpacing: '-0.02em', color: '#000000', margin: 0 }}>
                    Coffee, spices
                  </p>
                </div>
                <p style={{ fontFamily: fontFamily, fontStyle: 'italic', fontWeight: 500, fontSize: isMobile ? '12px' : '17px', lineHeight: isMobile ? '16px' : '21px', letterSpacing: '-0.02em', color: '#653A96', margin: 0 }}>
                  ₹1 crore revenue projection & credit-worthy operations
                </p>
              </div>

              {/* Laxmipur */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '10px' : '16px' }}>
                <h4 style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: isMobile ? '14px' : '18px', lineHeight: isMobile ? '18px' : '22px', letterSpacing: '-0.02em', color: '#000000', margin: 0 }}>
                  Laxmipur
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <p style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: isMobile ? '12px' : '16px', lineHeight: isMobile ? '16px' : '20px', letterSpacing: '-0.02em', color: '#653A96', margin: 0 }}>
                    Commodity Focus
                  </p>
                  <p style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: isMobile ? '13px' : '18px', lineHeight: isMobile ? '17px' : '22px', letterSpacing: '-0.02em', color: '#000000', margin: 0 }}>
                    Spices, oils, millets
                  </p>
                </div>
                <p style={{ fontFamily: fontFamily, fontStyle: 'italic', fontWeight: 500, fontSize: isMobile ? '12px' : '17px', lineHeight: isMobile ? '16px' : '21px', letterSpacing: '-0.02em', color: '#653A96', margin: 0 }}>
                  All-women FPO with products showcased under govt brand "KOLAB"
                </p>
              </div>
            </div>
          </div>

          {/* FPO group photos Section */}
          <div style={{ marginTop: isMobile ? '40px' : '80px' }}>
            <h3 style={{ fontFamily: fontFamily, fontWeight: 700, fontSize: isMobile ? '14px' : '16px', lineHeight: '20px', letterSpacing: '-0.02em', color: '#653A96', margin: isMobile ? '0 0 20px 0' : '0 0 30px 0' }}>
              FPO group photos
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '16px' : '20px' }}>
              <div style={{ width: '100%', height: isMobile ? '200px' : '300px', overflow: 'hidden' }}>
                <img src="/project-2/1.png" alt="FPO Group Photo 1" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div style={{ width: '100%', height: isMobile ? '200px' : '300px', overflow: 'hidden' }}>
                <img src="/project-2/4.png" alt="FPO Group Photo 4" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div style={{ width: '100%', height: isMobile ? '200px' : '300px', overflow: 'hidden' }}>
                <img src="/project-2/2.png" alt="FPO Group Photo 2" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div style={{ width: '100%', height: isMobile ? '200px' : '300px', overflow: 'hidden' }}>
                <img src="/project-2/5.png" alt="FPO Group Photo 5" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div style={{ width: '100%', height: isMobile ? '200px' : '300px', overflow: 'hidden' }}>
                <img src="/project-2/3.png" alt="FPO Group Photo 3" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div style={{ width: '100%', height: isMobile ? '200px' : '300px', overflow: 'hidden' }}>
                <img src="/project-2/6.png" alt="FPO Group Photo 6" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
            </div>
          </div>

          {/* Mentoring Sessions Section */}
          <div style={{ marginTop: isMobile ? '40px' : '80px' }}>
            <h3 style={{ fontFamily: fontFamily, fontWeight: 700, fontSize: isMobile ? '14px' : '16px', lineHeight: '20px', letterSpacing: '-0.02em', color: '#653A96', margin: isMobile ? '0 0 20px 0' : '0 0 30px 0' }}>
              Mentoring Sessions
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '16px' : '20px' }}>
              <img src="/project-2/mentoring1.png" alt="Mentoring Session 1" style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
              <img src="/project-2/mentoring2.png" alt="Mentoring Session 2" style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
            </div>
          </div>

          {/* Partners Section - A Joint Initiative by */}
          <div style={{ marginTop: isMobile ? '40px' : '80px', marginBottom: isMobile ? '40px' : '80px', textAlign: 'center' }}>
            <h3 style={{ fontFamily: fontFamily, fontWeight: 700, fontSize: isMobile ? '14px' : '16px', lineHeight: '20px', letterSpacing: '-0.02em', color: '#653A96', margin: isMobile ? '0 0 20px 0' : '0 0 30px 0' }}>
              A Joint Initiative by
            </h3>
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', gap: isMobile ? '24px' : '40px' }}>
              <div style={{ width: isMobile ? '180px' : '255px', height: isMobile ? '70px' : '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Image
                  src="/abwci-newlogo.svg"
                  alt="ABWCI Logo"
                  width={255}
                  height={100}
                  style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                />
              </div>
              <div style={{ width: isMobile ? '170px' : '240px', height: isMobile ? '93px' : '131px' }}>
                <Image
                  src={encodeURI("/project-2/passing_gifts_private_limited_logo 1.png")}
                  alt="Passing Gifts Private Limited Logo"
                  width={240}
                  height={131}
                  style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            minHeight: '567px',
            backgroundImage: isMobile ? 'none' : `url(${encodeURI("/project-2/Rectangle 211@2x.png")})`,
            backgroundColor: isMobile ? '#653A96' : 'transparent',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: isMobile ? '40px 20px' : '120px 80px',
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? '20px' : '30px',
            alignItems: isMobile ? 'center' : 'flex-start'
          }}
        >
          {/* CTA Title */}
          <h2
            style={{
              maxWidth: isMobile ? '100%' : '600px',
              fontFamily: 'DM Serif Display',
              fontWeight: 400,
              fontSize: isMobile ? '28px' : '42px',
              lineHeight: isMobile ? '36px' : '58px',
              letterSpacing: '-0.02em',
              color: '#FFFFFF',
              margin: 0,
              marginTop: isMobile ? '84px' : '0',
              textAlign: isMobile ? 'center' : 'left'
            }}
          >
            Support Tribal Women
          </h2>

          {/* Buttons Container */}
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '12px' : '20px', width: isMobile ? '100%' : 'auto' , flexWrap: 'wrap' }}>
            {/* Join as a Mentor Button */}
            <Link
              href="/auth/register?role=mentor"
              style={{
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: isMobile ? '12px 20px' : '10px 30px',
                gap: '12px',
                width: isMobile ? '100%' : '271px',
                background: '#FECB07',
                border: '1px solid #171717',
                borderRadius: '30px',
                textDecoration: 'none'
              }}
            >
              <span style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: isMobile ? '13px' : '14px', lineHeight: '17px', color: '#171717' }}>
                Join as a Mentor
              </span>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" style={{ transform: 'matrix(-1, 0, 0, 1, 0, 0)' }}>
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="#171717"/>
              </svg>
            </Link>

            {/* Become a Partner Button */}
            <Link
              href="/auth/login"
              style={{
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: isMobile ? '12px 20px' : '10px 30px',
                gap: '12px',
                width: isMobile ? '100%' : '271px',
                background: '#FECB07',
                border: '1px solid #171717',
                borderRadius: '30px',
                textDecoration: 'none'
              }}
            >
              <span style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: isMobile ? '13px' : '14px', lineHeight: '17px', color: '#171717' }}>
                Become a Partner
              </span>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" style={{ transform: 'matrix(-1, 0, 0, 1, 0, 0)' }}>
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="#171717"/>
              </svg>
            </Link>

            {/* Download Report Button */}
            <a
              href={encodeURI("/project-2/WE4WE Consolidated Report.pdf")}
              download
              style={{
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: isMobile ? '12px 20px' : '10px 30px',
                gap: '12px',
                width: isMobile ? '100%' : '548px',
                background: '#FECB07',
                border: '1px solid #171717',
                borderRadius: '30px',
                textDecoration: 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 12L5 8H7.5V3H10.5V8H13L9 12Z" fill="#000000"/>
                  <path d="M15 15H3V10H1.5V15C1.5 15.825 2.175 16.5 3 16.5H15C15.825 16.5 16.5 15.825 16.5 15V10H15V15Z" fill="#000000"/>
                </svg>
                <span style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: isMobile ? '13px' : '14px', lineHeight: '17px', color: '#171717' }}>
                  Download Full Report
                </span>
              </div>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" style={{ transform: 'matrix(-1, 0, 0, 1, 0, 0)' }}>
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="#171717"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
