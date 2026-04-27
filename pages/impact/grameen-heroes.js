import Layout from '../../components/Layout';
import { useLanguage } from '../../lib/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function GrameenHeroes() {
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
        {/* Rectangle 209 - Hero Section */}
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
          {/* Background Image with better quality */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: 'linear-gradient(180deg, rgba(101, 58, 150, 0) 58.65%, #653A96 82.69%), url(/project-1/Rectangle%20210.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'scroll',
              willChange: 'transform',
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden',
              transform: 'translate3d(0, 0, 0)',
              WebkitTransform: 'translate3d(0, 0, 0)',
              msTransform: 'translate3d(0, 0, 0)'
            }}
          />
          
          {/* Content Section - Breadcrumb, Title, Social Icons - All Top Aligned */}
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
              Our Impact &gt; Projects &gt; Grameen Heroes
            </p>

            {/* Title */}
            <h1 style={{ 
              fontFamily: 'DM Serif Display', 
              fontWeight: 400, 
              fontSize: isMobile ? '32px' : '64px', 
              lineHeight: isMobile ? '40px' : '72px', 
              letterSpacing: '-0.02em', 
              color: '#FFFFFF', 
              margin: 0,
              verticalAlign: 'top',
              textAlign: isMobile ? 'center' : 'left'
            }}>
              Grameen Heroes
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

          {/* Download Button - Frame 5722 */}
          {!isMobile && (
            <a
              href={encodeURI("/project-1/Grand Finale Report-Grameen Heroes.pdf")}
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

        {/* Content Container - Aligned with Title */}
        <div style={{ maxWidth: isMobile ? '100%' : '1280px', margin: '0 auto', padding: isMobile ? '0 20px' : '0 80px', position: 'relative', paddingTop: isMobile ? '24px' : '60px' }}>
          {/* Mobile Download Button */}
          {isMobile && (
            <a
              href={encodeURI("/project-1/Grand Finale Report-Grameen Heroes.pdf")}
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

          {/* Subtitle Quote */}
          <p
            style={{
              marginTop: '0px',
              marginBottom: isMobile ? '16px' : '20px',
              fontFamily: 'DM Serif Display',
              fontWeight: 400,
              fontSize: isMobile ? '20px' : '32px',
              lineHeight: isMobile ? '28px' : '40px',
              color: '#653A96',
              textAlign: isMobile ? 'center' : 'left'
            }}
          >
          " Adaptation of Shark Tank in rural settings for empowering women to lead India's economic future "
          </p>

          {/* Main Description */}
          <p
            style={{
              marginTop: '0px',
              marginBottom: '0px',
              fontFamily: fontFamily,
              fontWeight: 400,
              fontSize: isMobile ? '13px' : '16px',
              lineHeight: isMobile ? '19px' : '22px',
              color: '#171717',
              textAlign: isMobile ? 'left' : 'left'
            }}
          >
            Grameen Heroes was a flagship CSR initiative of Hero MotoCorp Ltd., implemented by ABWCI to strengthen and scale rural and semi-urban women-led enterprises across India. Adapted from the Shark Tank model, the program built confidence, business leadership, and community impact among women entrepreneurs. It reached more than 1,500 women through extensive grassroots mobilisation, screened 964 applications to identify high-potential rural entrepreneurs, and provided 197 women with structured training, mentorship and business-readiness support through dedicated workshops. From these, 35 outstanding entrepreneurs were selected as national finalists and collectively received seed grants to scale enterprises across sectors such as food processing, eco-products, logistics, textiles, agriculture, and digital services.
          </p>

          {/* Two Column Section - Reach & Map with Inclusive Section Above */}
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '24px' : '60px', marginTop: isMobile ? '24px' : '60px', alignItems: 'flex-start', position: 'relative' }}>
            {/* Left Column - Text Content */}
            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '0px', width: isMobile ? '100%' : 'auto' }}>
              {/* Frame 7968 - Our Reach and Selection Journey */}
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
                  Our Reach and Selection Journey
                </h3>
                <div style={{ fontFamily: fontFamily, fontWeight: 400, fontSize: isMobile ? '13px' : '16px', lineHeight: isMobile ? '17px' : '19px', color: '#000000' }}>
                  <p style={{ margin: '0 0 8px 0' }}>• 1,500+ rural women engaged through village outreach & mobilisation</p>
                  <p style={{ margin: '0 0 8px 0' }}>• 964 screened applications</p>
                  <p style={{ margin: '0 0 8px 0' }}>• 197 entrepreneurs received structured training, mentorship and business-readiness support</p>
                  <p style={{ margin: '0 0 8px 0' }}>• 5 State-level pitch events across Uttarakhand, Rajasthan, Gujarat, Haryana & Andhra Pradesh</p>
                  <p style={{ margin: 0 }}>• 35 National Finalists showcased their business innovations in New Delhi</p>
                </div>
              </div>

              {/* Frame 7970 - Inclusive & Diverse Entrepreneurial Cohort */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '0px',
                  gap: isMobile ? '12px' : '18px',
                  marginTop: isMobile ? '24px' : '35px'
                }}
              >
            <h3 style={{ fontFamily: fontFamily, fontWeight: 700, fontSize: isMobile ? '14px' : '16px', lineHeight: '20px', letterSpacing: '-0.02em', color: '#653A96', margin: 0 }}>
              Inclusive & Diverse Entrepreneurial Cohort
            </h3>
                <p style={{ fontFamily: fontFamily, fontWeight: 400, fontSize: isMobile ? '13px' : '16px', lineHeight: isMobile ? '17px' : '19px', color: '#000000', margin: 0 }}>
                  Women leading across high-impact sectors
                </p>
              </div>

              {/* Sectors Labels */}
              <div style={{ display: 'flex', justifyContent: 'space-between', width: isMobile ? '100%' : '366px', marginTop: '10px' }}>
                <p style={{ fontFamily: fontFamily, fontStyle: 'italic', fontWeight: 400, fontSize: isMobile ? '11px' : '12px', lineHeight: '14px', color: '#000000', margin: 0 }}>
                  sectors
                </p>
                <p style={{ fontFamily: fontFamily, fontStyle: 'italic', fontWeight: 400, fontSize: isMobile ? '11px' : '12px', lineHeight: '14px', color: '#000000', margin: 0 }}>
                  of total entrepreneurs
                </p>
              </div>

              {/* Frame 7977 - Sectors List */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '0px',
                  gap: '8px',
                  width: isMobile ? '100%' : '366px',
                  marginTop: '10px'
                }}
              >
          {/* Sector Items */}
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            <span style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: isMobile ? '12px' : '14px', lineHeight: '17px', color: '#653A96' }}>Food Products & Processing</span>
            <span style={{ fontFamily: fontFamily, fontWeight: 400, fontSize: isMobile ? '12px' : '14px', lineHeight: '17px', color: '#000000' }}>22.7%</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            <span style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: isMobile ? '12px' : '14px', lineHeight: '17px', color: '#653A96' }}>Handicrafts & Artisanal Goods</span>
            <span style={{ fontFamily: fontFamily, fontWeight: 400, fontSize: isMobile ? '12px' : '14px', lineHeight: '17px', color: '#000000' }}>20.5%</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            <span style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: isMobile ? '12px' : '14px', lineHeight: '17px', color: '#653A96' }}>Tech, Agri-and Service Access</span>
            <span style={{ fontFamily: fontFamily, fontWeight: 400, fontSize: isMobile ? '12px' : '14px', lineHeight: '17px', color: '#000000' }}>18.2%</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            <span style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: isMobile ? '12px' : '14px', lineHeight: '17px', color: '#653A96' }}>Hygiene, Wellness & Eco-Products</span>
            <span style={{ fontFamily: fontFamily, fontWeight: 400, fontSize: isMobile ? '12px' : '14px', lineHeight: '17px', color: '#000000' }}>13.6%</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            <span style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: isMobile ? '12px' : '14px', lineHeight: '17px', color: '#653A96' }}>Tailoring & Apparel</span>
            <span style={{ fontFamily: fontFamily, fontWeight: 400, fontSize: isMobile ? '12px' : '14px', lineHeight: '17px', color: '#000000' }}>13.6%</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            <span style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: isMobile ? '12px' : '14px', lineHeight: '17px', color: '#653A96' }}>Organic & Herbal Products</span>
            <span style={{ fontFamily: fontFamily, fontWeight: 400, fontSize: isMobile ? '12px' : '14px', lineHeight: '17px', color: '#000000' }}>11.4%</span>
          </div>
              </div>

              {/* Frame 7981 - Inclusion Highlights */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  alignItems: 'flex-start',
                  padding: '0px',
                  gap: isMobile ? '12px' : '30px',
                  marginTop: isMobile ? '20px' : '30px',
                  flexWrap: 'wrap'
                }}
              >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width={isMobile ? "20" : "24"} height={isMobile ? "20" : "24"} viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FECB07"/>
            </svg>
            <span style={{ fontFamily: fontFamily, fontWeight: 400, fontSize: isMobile ? '12px' : '13px', lineHeight: '16px', color: '#000000' }}>Transgender entrepreneurs</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width={isMobile ? "20" : "24"} height={isMobile ? "20" : "24"} viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FECB07"/>
            </svg>
            <span style={{ fontFamily: fontFamily, fontWeight: 400, fontSize: isMobile ? '12px' : '13px', lineHeight: '16px', color: '#000000' }}>Women with disabilities</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width={isMobile ? "18" : "22"} height={isMobile ? "17" : "21"} viewBox="0 0 22 21" fill="none">
              <path d="M11 0L13.09 6.26L20 7.27L15 12.14L16.18 18.02L11 15.77L5.82 18.02L7 12.14L2 7.27L8.91 6.26L11 0Z" fill="#FECB07"/>
            </svg>
                <span style={{ fontFamily: fontFamily, fontWeight: 400, fontSize: isMobile ? '12px' : '13px', lineHeight: '16px', color: '#000000' }}>First-generation & first-time travelers beyond their village</span>
              </div>
            </div>
            </div>

            {/* Group 16 - Map - Positioned More to the Right */}
            <div
              style={{
                width: isMobile ? '100%' : '463.87px',
                height: isMobile ? 'auto' : '522px',
                flexShrink: 0,
                marginLeft: isMobile ? '0' : '40px',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <Image
                src="/project-1/Group 16.png"
                alt="India Map showing project reach"
                width={464}
                height={522}
                style={{ width: isMobile ? '100%' : '100%', height: 'auto', objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>

        {/* Frame 7985 - Stats Banner - Full Width */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: isMobile ? '30px 20px' : '40px 80px',
            gap: '10px',
            width: '100%',
            marginTop: isMobile ? '24px' : '30px',
            minHeight: isMobile ? 'auto' : '183px',
            overflow: 'hidden',
            background: isMobile ? '#653A96' : 'transparent'
          }}
        >
          {!isMobile && (
            <Image
              src="/project-1/Frame 7985.png"
              alt="Stats Banner"
              fill
              style={{ objectFit: 'cover', zIndex: 0 }}
            />
          )}
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'center' : 'flex-start',
              justifyContent: 'center',
              padding: isMobile ? '0' : '10px 40px',
              gap: isMobile ? '24px' : '69px',
              width: isMobile ? '100%' : '851px',
              maxWidth: '100%',
              minHeight: isMobile ? 'auto' : '123px',
              background: isMobile ? 'transparent' : 'rgba(255, 255, 255, 0.3)',
              borderRadius: '0'
            }}
          >
            {/* Stat 1 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: isMobile ? '100%' : '211px', textAlign: 'center' }}>
              <h3 style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: isMobile ? '36px' : '48px', lineHeight: isMobile ? '44px' : '59px', letterSpacing: '-0.02em', color: '#FFFFFF', margin: 0 }}>35</h3>
              <p style={{ fontFamily: fontFamily, fontWeight: 400, fontSize: isMobile ? '13px' : '14px', lineHeight: '17px', letterSpacing: '-0.02em', color: '#FFFFFF', margin: 0 }}>Rural founders received seed grants and continued mentorship</p>
            </div>
            {/* Stat 2 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: isMobile ? '100%' : '211px', textAlign: 'center' }}>
              <h3 style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: isMobile ? '36px' : '48px', lineHeight: isMobile ? '44px' : '59px', letterSpacing: '-0.02em', color: '#FFFFFF', margin: 0 }}>₹1,00,000</h3>
              <p style={{ fontFamily: fontFamily, fontWeight: 400, fontSize: isMobile ? '13px' : '14px', lineHeight: '17px', letterSpacing: '-0.02em', color: '#FFFFFF', margin: 0 }}>Each to top 20</p>
            </div>
            {/* Stat 3 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: isMobile ? '100%' : '211px', textAlign: 'center' }}>
              <h3 style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: isMobile ? '36px' : '48px', lineHeight: isMobile ? '44px' : '59px', letterSpacing: '-0.02em', color: '#FFFFFF', margin: 0 }}>₹25,000</h3>
              <p style={{ fontFamily: fontFamily, fontWeight: 400, fontSize: isMobile ? '13px' : '14px', lineHeight: '17px', letterSpacing: '-0.02em', color: '#FFFFFF', margin: 0 }}>Each to the remaining 15</p>
            </div>
          </div>
        </div>

        {/* Content Container Continued */}
        <div style={{ maxWidth: isMobile ? '100%' : '1280px', margin: '0 auto', padding: isMobile ? '0 20px' : '0 80px', position: 'relative' }}>
          {/* Frame 7986 - Transformation Outcomes */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '0px',
              gap: isMobile ? '12px' : '18px',
              marginTop: isMobile ? '24px' : '60px'
            }}
          >
            <h3 style={{ fontFamily: fontFamily, fontWeight: 700, fontSize: isMobile ? '14px' : '16px', lineHeight: '20px', letterSpacing: '-0.02em', color: '#653A96', margin: 0 }}>
              Transformation Outcomes
            </h3>
            <div style={{ fontFamily: fontFamily, fontWeight: 400, fontSize: isMobile ? '13px' : '16px', lineHeight: isMobile ? '17px' : '19px', color: '#000000' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span style={{ marginRight: '8px', flexShrink: 0 }}>•</span>
                <span>Business confidence replacing self-doubt</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span style={{ marginRight: '8px', flexShrink: 0 }}>•</span>
                <span>Women negotiating pricing, margins & expansion plans</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span style={{ marginRight: '8px', flexShrink: 0 }}>•</span>
                <span>Formation of a pan-India collaboration network (WhatsApp groups, partnerships)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ marginRight: '8px', flexShrink: 0 }}>•</span>
                <span>Expansion beyond traditional roles to digital logistics, eco-innovation & value chains</span>
              </div>
            </div>
          </div>

          {/* Grand Finale Highlights Title */}
          <h3
            style={{
              marginTop: isMobile ? '24px' : '60px',
              fontFamily: fontFamily,
              fontWeight: 700,
              fontSize: isMobile ? '14px' : '16px',
              lineHeight: '20px',
              letterSpacing: '-0.02em',
              color: '#653A96'
            }}
          >
            Grand Finale Highlights
          </h3>

          {/* Full Width Image */}
          <div style={{ marginTop: isMobile ? '16px' : '20px', width: '100%' }}>
            <img 
              src="/project-1/4.png"
              alt="Event" 
              style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: isMobile ? '8px' : '10px' }}
            />
          </div>
          {/* Event Images Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gridTemplateRows: isMobile ? 'auto' : '1fr 1fr', gap: '10px', marginTop: '20px', height: isMobile ? 'auto' : '800px' }} className=''>
            <div style={{ gridRow: isMobile ? 'auto' : 'span 2', height: isMobile ? 'auto' : '100%' }}>
              <img 
                src="/project-1/1.png"
                alt="Event" 
                style={{ width: '100%', height: isMobile ? 'auto' : '100%', objectFit: 'cover', borderRadius: '10px' }}
              />
            </div>
            <div style={{ height: isMobile ? 'auto' : '100%' }}>
              <img 
                src="/project-1/2.png"
                alt="Event" 
                style={{ width: '100%', height: isMobile ? 'auto' : '100%', objectFit: 'cover', borderRadius: isMobile ? '10px' : '0' }}
              />
            </div>
            <div style={{ height: isMobile ? 'auto' : '100%' }} className='mt-0'>
              <img 
                src="/project-1/3.png"
                alt="Event" 
                style={{ width: '100%', height: isMobile ? 'auto' : '100%', objectFit: 'cover', borderRadius: isMobile ? '10px' : '0' }}
              />
            </div>
          </div>


          {/* Frame 7990 - Partners Section */}
          <div
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'center' : 'flex-start',
              justifyContent: 'center',
              padding: '0px',
              gap: isMobile ? '40px' : '80px',
              marginTop: isMobile ? '40px' : '80px',
              marginBottom: isMobile ? '40px' : '80px'
            }}
          >
          {/* Supported by */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: isMobile ? '200px' : '247px' }}>
            <h4 style={{ fontFamily: fontFamily, fontWeight: 700, fontSize: '16px', lineHeight: '20px', letterSpacing: '-0.02em', color: '#653A96', margin: '0 0 18px 0' }}>
              Supported by
            </h4>
            <div style={{ width: isMobile ? '200px' : '247px', height: isMobile ? '166px' : '206px' }}>
              <Image src="/project-1/hero-wecare2 2.png" alt="Hero MotoCorp" width={247} height={206} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
          </div>

          {/* Implemented by */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: isMobile ? '160px' : '247px' }}>
            <h4 style={{ fontFamily: fontFamily, fontWeight: 700, fontSize: isMobile ? '14px' : '16px', lineHeight: '20px', letterSpacing: '-0.02em', color: '#653A96', margin: '0 0 18px 0' }}>
              Implemented by
            </h4>
            <div style={{ width: isMobile ? '160px' : '255px', height: isMobile ? '60px' : '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Image
                src="/abwci-newlogo.svg"
                alt="ABWCI Logo"
                width={255}
                height={100}
                style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
              />
            </div>
          </div>
          </div>
        </div>

        {/* Rectangle 212 - Bottom CTA Section */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            minHeight: isMobile ? '350px' : '567px',
            backgroundImage: 'linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(/project-1/footer.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: isMobile ? '40px 20px' : '120px 80px',
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? '20px' : '30px',
            alignItems: isMobile ? 'center' : 'flex-start',
            justifyContent: 'center'
          }}
        >
          {/* CTA Title */}
          <h2
            style={{
              maxWidth: isMobile ? '100%' : '600px',
              fontFamily: 'DM Serif Display',
              fontWeight: 400,
              fontSize: isMobile ? '26px' : '42px',
              lineHeight: isMobile ? '34px' : '58px',
              letterSpacing: '-0.02em',
              color: '#FFFFFF',
              margin: 0,
              textAlign: isMobile ? 'center' : 'left'
            }}
          >
            Join us in scaling opportunities for rural women entrepreneurs
          </h2>

          {/* Buttons Container */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: isMobile ? '100%' : 'fit-content', maxWidth: isMobile ? '100%' : 'none', alignItems: isMobile ? 'center' : 'flex-start' }}>
            {/* Become a Partner Button */}
            <Link
              href="/auth/login"
              style={{
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: isMobile ? '12px 24px' : '10px 30px',
                gap: '12px',
                width: isMobile ? '100%' : '293px',
                maxWidth: '293px',
                background: '#FECB07',
                border: '1px solid #171717',
                borderRadius: '30px',
                textDecoration: 'none'
              }}
            >
              <span style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: '14px', lineHeight: '17px', color: '#171717' }}>
                Become a Partner
              </span>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" style={{ transform: 'matrix(-1, 0, 0, 1, 0, 0)' }}>
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="#171717"/>
              </svg>
            </Link>

            {/* Download Report Button */}
            <a
              href={encodeURI("/project-1/Grand Finale Report-Grameen Heroes.pdf")}
              download
              style={{
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: isMobile ? '12px 24px' : '10px 30px',
                gap: '12px',
                width: isMobile ? '100%' : '293px',
                maxWidth: '293px',
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
                <span style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: '14px', lineHeight: '17px', color: '#171717' }}>
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

