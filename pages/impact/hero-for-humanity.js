import Layout from '../../components/Layout';
import { useLanguage } from '../../lib/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function HeroForHumanity() {
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
          minHeight: isMobile ? 'auto' : '3406px',
          background: '#FFFFFF'
        }}
      >
        {/* Hero Section */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: isMobile ? '450px' : '582px',
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
              zIndex: 0
            }}
          >
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <Image
                src="/project-3/Rectangle 212.png"
                alt="Hero for Humanity Background"
                fill
                priority
                quality={90}
                sizes="100vw"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center center',
                  willChange: 'transform',
                  WebkitBackfaceVisibility: 'hidden',
                  backfaceVisibility: 'hidden',
                  transform: 'translate3d(0, 0, 0)',
                  WebkitTransform: 'translate3d(0, 0, 0)',
                  msTransform: 'translate3d(0, 0, 0)'
                }}
              />
            </div>
            {/* Gradient Overlay */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(180deg, rgba(101, 58, 150, 0) 36.54%, #653A96 78.37%)',
                zIndex: 1
              }}
            />
          </div>
          
          {/* Mobile Back Button */}
          {isMobile && (
            <Link
              href="/impact/project"
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                zIndex: 20,
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="#FFFFFF"/>
              </svg>
            </Link>
          )}
          
          {/* Content Section - Breadcrumb, Title, Social Icons */}
          <div
            style={{
              position: 'absolute',
              display: 'flex',
              flexDirection: 'column',
              alignItems: isMobile ? 'center' : 'flex-start',
              gap: '9px',
              left: isMobile ? '0' : '135px',
              right: isMobile ? '0' : 'auto',
              bottom: isMobile ? '30px' : '60px',
              zIndex: 10,
              padding: isMobile ? '0 20px' : '0',
              paddingRight: isMobile ? '20px' : '200px',
              textAlign: isMobile ? 'center' : 'left'
            }}
          >
            {/* Breadcrumb */}
            <p style={{ 
              fontFamily: fontFamily, 
              fontWeight: 400, 
              fontSize: isMobile ? '12px' : '14px', 
              lineHeight: '17px', 
              color: '#FFFFFF', 
              margin: 0
            }}>
              Our Impact &gt; Projects &gt; Hero for Humanity
            </p>

            {/* Title */}
            <h1 style={{ 
              fontFamily: 'DM Serif Display', 
              fontWeight: 400, 
              fontSize: isMobile ? '28px' : '48px', 
              lineHeight: isMobile ? '36px' : '66px', 
              letterSpacing: '-0.02em', 
              color: '#FFFFFF', 
              margin: 0
            }}>
              Hero for Humanity
            </h1>

            {/* Subtitle */}
            <p style={{ 
              fontFamily: fontFamily, 
              fontWeight: 400, 
              fontSize: isMobile ? '13px' : '16px', 
              lineHeight: isMobile ? '17px' : '19px', 
              letterSpacing: '-0.02em',
              color: '#FFFFFF', 
              margin: 0
            }}>
              {isMobile ? '(Empowering COVID-Affected Women)' : '(Empowering Women Affected by COVID-19 Through Livelihood and Enterprise Support)'}
            </p>

            {/* Social Icons */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'row', 
              alignItems: 'center', 
              gap: isMobile ? '16px' : '20px',
              marginTop: isMobile ? '12px' : '20px'
            }}>
              {/* Instagram */}
              <a href="#" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width={isMobile ? "16" : "18"} height={isMobile ? "16" : "18"} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="#FFFFFF"/>
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="#" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width={isMobile ? "16" : "18"} height={isMobile ? "16" : "18"} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="#FFFFFF"/>
                </svg>
              </a>
              {/* Twitter/X */}
              <a href="#" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width={isMobile ? "16" : "18"} height={isMobile ? "16" : "18"} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="#FFFFFF"/>
                </svg>
              </a>
              {/* Facebook */}
              <a href="#" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width={isMobile ? "16" : "18"} height={isMobile ? "16" : "18"} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#FFFFFF"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Download Buttons - Desktop Only */}
          {!isMobile && (
            <div
              style={{
                position: 'absolute',
                display: 'flex',
                flexDirection: 'column',
                gap: '9px',
                right: '80px',
                bottom: '60px',
                zIndex: 10
              }}
            >
              {/* Download Phase-I Report Button */}
              <a
                href={encodeURI("/project-3/HfH_Phase 1_ABWCI_Completion Report.pdf")}
                download
                style={{
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '10px 30px',
                  gap: '12px',
                  width: '260px',
                  height: '38px',
                  background: '#FECB07',
                  border: '1px solid #171717',
                  borderRadius: '30px',
                  textDecoration: 'none'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 12L5 8H7.5V3H10.5V8H13L9 12Z" fill="#000000"/>
                  <path d="M15 15H3V10H1.5V15C1.5 15.825 2.175 16.5 3 16.5H15C15.825 16.5 16.5 15.825 16.5 15V10H15V15Z" fill="#000000"/>
                </svg>
                <span style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: '14px', lineHeight: '17px', color: '#171717' }}>
                  Download Phase-I Report
                </span>
              </a>

              {/* Download Phase-II Report Button */}
              <a
                href={encodeURI("/project-3/HfH_Phase 2_ABWCI_Report_Mar2023.pdf")}
                download
                style={{
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '10px 30px',
                  gap: '12px',
                  width: '260px',
                  height: '38px',
                  background: '#FECB07',
                  borderRadius: '30px',
                  textDecoration: 'none'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 12L5 8H7.5V3H10.5V8H13L9 12Z" fill="#000000"/>
                  <path d="M15 15H3V10H1.5V15C1.5 15.825 2.175 16.5 3 16.5H15C15.825 16.5 16.5 15.825 16.5 15V10H15V15Z" fill="#000000"/>
                </svg>
                <span style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: '14px', lineHeight: '17px', color: '#171717' }}>
                  Download Phase-II Report
                </span>
              </a>
            </div>
          )}
        </div>

        {/* Content Container */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: isMobile ? '0 20px' : '0 80px', position: 'relative', paddingTop: isMobile ? '30px' : '60px' }}>
          {/* Mobile Download Buttons */}
          {isMobile && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              <a
                href={encodeURI("/project-3/HfH_Phase 1_ABWCI_Completion Report.pdf")}
                download
                style={{
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '12px 20px',
                  gap: '10px',
                  width: '100%',
                  background: '#FECB07',
                  border: '1px solid #171717',
                  borderRadius: '30px',
                  textDecoration: 'none'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                  <path d="M9 12L5 8H7.5V3H10.5V8H13L9 12Z" fill="#000000"/>
                  <path d="M15 15H3V10H1.5V15C1.5 15.825 2.175 16.5 3 16.5H15C15.825 16.5 16.5 15.825 16.5 15V10H15V15Z" fill="#000000"/>
                </svg>
                <span style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: '13px', lineHeight: '17px', color: '#171717' }}>
                  Download Phase-I Report
                </span>
              </a>
              <a
                href={encodeURI("/project-3/HfH_Phase 2_ABWCI_Report_Mar2023.pdf")}
                download
                style={{
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '12px 20px',
                  gap: '10px',
                  width: '100%',
                  background: '#FECB07',
                  borderRadius: '30px',
                  textDecoration: 'none'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                  <path d="M9 12L5 8H7.5V3H10.5V8H13L9 12Z" fill="#000000"/>
                  <path d="M15 15H3V10H1.5V15C1.5 15.825 2.175 16.5 3 16.5H15C15.825 16.5 16.5 15.825 16.5 15V10H15V15Z" fill="#000000"/>
                </svg>
                <span style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: '13px', lineHeight: '17px', color: '#171717' }}>
                  Download Phase-II Report
                </span>
              </a>
            </div>
          )}

          {/* Subtitle Quote - At the Top */}
          <p
            style={{
              marginTop: '0px',
              marginBottom: isMobile ? '16px' : '20px',
              fontFamily: fontFamily,
              fontWeight: 500,
              fontSize: isMobile ? '18px' : '24px',
              lineHeight: isMobile ? '24px' : '29px',
              color: '#653A96',
              textAlign: isMobile ? 'center' : 'left'
            }}
          >
            " Supporting women who lost their husbands to COVID-19 "
          </p>

          {/* Main Description */}
          <p
            style={{
              marginTop: '0px',
              marginBottom: isMobile ? '16px' : '20px',
              fontFamily: fontFamily,
              fontWeight: 400,
              fontSize: isMobile ? '13px' : '16px',
              lineHeight: isMobile ? '18px' : '19px',
              color: '#171717'
            }}
          >
            The COVID-19 pandemic left thousands of women widowed overnight — emotionally shattered and suddenly responsible for sustaining their families alone. Many had never held paid jobs and were excluded from financial systems. Hero for Humanity stood with these women in their fight for dignity, livelihood and hope.
          </p>

          {/* Our Impact in glance Section - Two Column Layout */}
          <div
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? '30px' : '60px',
              alignItems: 'flex-start',
              marginTop: isMobile ? '30px' : '60px'
            }}
          >
            {/* Left Column - Our Impact in glance */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0px',
                gap: isMobile ? '12px' : '18px'
              }}
            >
              <h3 style={{ fontFamily: fontFamily, fontWeight: 700, fontSize: isMobile ? '14px' : '16px', lineHeight: '20px', letterSpacing: '-0.02em', color: '#653A96', margin: 0 }}>
                Our Impact in glance
              </h3>
              <div style={{ fontFamily: fontFamily, fontWeight: 400, fontSize: isMobile ? '13px' : '16px', lineHeight: isMobile ? '18px' : '19px', color: '#000000' }}>
                <p style={{ margin: '0 0 8px 0' }}>300 COVID-widowed women supported across Odisha & Karnataka</p>
                <p style={{ margin: '0 0 8px 0' }}>6 months of assured sustenance: food ration kits every month</p>
                <p style={{ margin: '0 0 8px 0' }}>Education support for children of 289 women</p>
                <p style={{ margin: '0 0 8px 0' }}>250+ women trained, guided & prepared for entrepreneurship (Phase-2)</p>
                <p style={{ margin: 0 }}>215+ women already running small enterprises — tailoring units, grocery shops, beauty services, weaving, food businesses & more</p>
              </div>
            </div>

            {/* Right Column - Supported by */}
            <div
              style={{
                width: isMobile ? '100%' : '164px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: isMobile ? 'center' : 'center',
                gap: isMobile ? '12px' : '18px',
                flexShrink: 0
              }}
            >
              <h3 style={{ fontFamily: fontFamily, fontWeight: 700, fontSize: isMobile ? '14px' : '16px', lineHeight: '20px', letterSpacing: '-0.02em', color: '#653A96', margin: 0, alignSelf: isMobile ? 'center' : 'flex-start' }}>
                Supported by
              </h3>
              <div style={{ width: isMobile ? '120px' : '164px', height: isMobile ? '100px' : '136.67px' }}>
                <Image
                  src={encodeURI("/project-1/hero-wecare2 2.png")}
                  alt="Hero WeCare Logo"
                  width={164}
                  height={137}
                  style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                />
              </div>
            </div>
          </div>

          {/* Phase I & Phase II Support - Two Column Layout */}
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '30px' : '40px', marginTop: isMobile ? '30px' : '60px', alignItems: 'flex-start' }}>
            {/* Phase I Support */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0px',
                gap: isMobile ? '12px' : '18px'
              }}
            >
              <h3 style={{ fontFamily: fontFamily, fontWeight: 700, fontSize: isMobile ? '14px' : '16px', lineHeight: '20px', letterSpacing: '-0.02em', color: '#653A96', margin: 0 }}>
                Phase I Support
              </h3>
              <div style={{ fontFamily: fontFamily, fontWeight: 400, fontSize: isMobile ? '13px' : '16px', lineHeight: isMobile ? '18px' : '19px', color: '#000000' }}>
                <p style={{ margin: '0 0 8px 0' }}>July 2022 – January 2023</p>
                <p style={{ margin: '0 0 8px 0', fontWeight: 500 }}>What we delivered:</p>
                <p style={{ margin: '0 0 8px 0' }}>Monthly grocery kits worth ₹3,000 (branded essentials)</p>
                <p style={{ margin: '0 0 8px 0' }}>Direct bank transfers of ₹2,000/month for children's education</p>
                <p style={{ margin: '0 0 18px 0' }}>Regular home visits + counselling for livelihood planning</p>
                <p style={{ margin: '0 0 8px 0', fontWeight: 500, color: '#653A96' }}>Where:</p>
                <p style={{ margin: '0 0 8px 0' }}>1. Odisha: Khordha, Puri, Cuttack, Bargarh</p>
                <p style={{ margin: '0 0 18px 0' }}>2. Karnataka: Kalaburagi (majority), Bengaluru, Mysuru, Tumkur, Chamarajanagar</p>
                <p style={{ margin: '0 0 8px 0', fontWeight: 500, color: '#653A96' }}>Who we supported:</p>
                <p style={{ margin: '0 0 8px 0' }}>Most widows in the 30–40 age group</p>
                <p style={{ margin: 0 }}>Majority raising two children alone</p>
              </div>
            </div>

            {/* Phase II Support */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0px',
                gap: isMobile ? '12px' : '18px'
              }}
            >
              <h3 style={{ fontFamily: fontFamily, fontWeight: 700, fontSize: isMobile ? '14px' : '16px', lineHeight: '20px', letterSpacing: '-0.02em', color: '#653A96', margin: 0 }}>
                Phase II Support
              </h3>
              <div style={{ fontFamily: fontFamily, fontWeight: 400, fontSize: isMobile ? '13px' : '16px', lineHeight: isMobile ? '18px' : '19px', color: '#000000' }}>
                <p style={{ margin: '0 0 8px 0' }}>Jan 2023 – March 2023</p>
                <p style={{ margin: '0 0 8px 0', fontWeight: 500 }}>Goal: Ensure sustained income for every beneficiary</p>
                <p style={{ margin: '0 0 8px 0', fontWeight: 500 }}>What we enabled:</p>
                <p style={{ margin: '0 0 8px 0' }}>Skill mapping & business mentoring</p>
                <p style={{ margin: '0 0 8px 0' }}>Business setup support (equipment + materials)</p>
                <p style={{ margin: '0 0 8px 0' }}>Market-linked livelihood choices</p>
                <p style={{ margin: '0 0 8px 0', fontWeight: 500 }}>New Women-led Entreprises:</p>
              </div>

              {/* New Women-led Enterprises - Sector Breakdown - Inside Right Column */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '0px',
                  gap: '10px',
                  width: '100%',
                  marginTop: '0px'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '4px' }}>
                  <span style={{ fontFamily: fontFamily, fontStyle: 'italic', fontWeight: 400, fontSize: isMobile ? '11px' : '12px', lineHeight: '14px', color: '#000000' }}>sectors</span>
                  <span style={{ fontFamily: fontFamily, fontStyle: 'italic', fontWeight: 400, fontSize: isMobile ? '11px' : '12px', lineHeight: '14px', color: '#000000' }}>outcome</span>
                </div>

                {/* Sector List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                  {/* 100+ Tailoring Units */}
                  <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', width: '100%', gap: isMobile ? '2px' : '0' }}>
                    <span style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: isMobile ? '12px' : '14px', lineHeight: '17px', color: '#653A96' }}>100+ Tailoring Units</span>
                    <span style={{ fontFamily: fontFamily, fontWeight: 400, fontSize: isMobile ? '11px' : '13px', lineHeight: '16px', color: '#000000' }}>Women earning from home</span>
                  </div>

                  {/* 20+ Grocery/Kirana Stores */}
                  <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', width: '100%', gap: isMobile ? '2px' : '0' }}>
                    <span style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: isMobile ? '12px' : '14px', lineHeight: '17px', color: '#653A96' }}>20+ Grocery/Kirana Stores</span>
                    <span style={{ fontFamily: fontFamily, fontWeight: 400, fontSize: isMobile ? '11px' : '13px', lineHeight: '16px', color: '#000000' }}>Stable everyday income</span>
                  </div>

                  {/* Weaving Units */}
                  <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', width: '100%', gap: isMobile ? '2px' : '0' }}>
                    <span style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: isMobile ? '12px' : '14px', lineHeight: '17px', color: '#653A96' }}>Weaving Units</span>
                    <span style={{ fontFamily: fontFamily, fontWeight: 400, fontSize: isMobile ? '11px' : '13px', lineHeight: '16px', color: '#000000' }}>Revival of rural craft</span>
                  </div>

                  {/* Beauty & Salon Services */}
                  <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', width: '100%', gap: isMobile ? '2px' : '0' }}>
                    <span style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: isMobile ? '12px' : '14px', lineHeight: '17px', color: '#653A96' }}>Beauty & Salon Services</span>
                    <span style={{ fontFamily: fontFamily, fontWeight: 400, fontSize: isMobile ? '11px' : '13px', lineHeight: '16px', color: '#000000' }}>Women becoming micro-entrepreneurs</span>
                  </div>

                  {/* 15+ Food Businesses (Tiffin/Hotel) */}
                  <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', width: '100%', gap: isMobile ? '2px' : '0' }}>
                    <span style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: isMobile ? '12px' : '14px', lineHeight: '17px', color: '#653A96' }}>15+ Food Businesses (Tiffin/Hotel)</span>
                    <span style={{ fontFamily: fontFamily, fontWeight: 400, fontSize: isMobile ? '11px' : '13px', lineHeight: '16px', color: '#000000' }}>Cater daily demand</span>
                  </div>

                  {/* 5+ Paper-Plate Making */}
                  <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', width: '100%', gap: isMobile ? '2px' : '0' }}>
                    <span style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: isMobile ? '12px' : '14px', lineHeight: '17px', color: '#653A96' }}>5+ Paper-Plate Making</span>
                    <span style={{ fontFamily: fontFamily, fontWeight: 400, fontSize: isMobile ? '11px' : '13px', lineHeight: '16px', color: '#000000' }}>Low cost, scalable</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Phase I Photos & Phase II Photos - Two Column Layout */}
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '30px' : '20px', marginTop: isMobile ? '40px' : '80px', alignItems: 'flex-start' }}>
            {/* Phase I Photos */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: isMobile ? '12px' : '18px' }}>
              <h3 style={{ fontFamily: fontFamily, fontWeight: 700, fontSize: isMobile ? '14px' : '16px', lineHeight: '20px', letterSpacing: '-0.02em', color: '#653A96', margin: 0 }}>
                Phase I Photos
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '40px' }}>
                <div style={{ width: '100%', height: isMobile ? '200px' : '350px', overflow: 'hidden' }}>
                  <img src="/project-3/2.png" alt="Phase I Photo 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ width: '100%', height: isMobile ? '200px' : '350px', overflow: 'hidden' }}>
                  <img src="/project-3/1.png" alt="Phase I Photo 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </div>
            </div>

            {/* Phase II Photos */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: isMobile ? '12px' : '18px' }}>
              <h3 style={{ fontFamily: fontFamily, fontWeight: 700, fontSize: isMobile ? '14px' : '16px', lineHeight: '20px', letterSpacing: '-0.02em', color: '#653A96', margin: 0 }}>
                Phase II Photos
              </h3>
              <img 
                src="/project-3/phase2.png" 
                alt="Phase II Photos" 
                style={{ width: '100%', height: 'auto', objectFit: 'cover' }} 
              />
            </div>
          </div>

          {/* Partners Section - Supported by & Implemented by */}
          <div style={{ marginTop: isMobile ? '40px' : '80px', marginBottom: isMobile ? '40px' : '80px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'center' : 'flex-start', gap: isMobile ? '30px' : '33px', justifyContent: 'center' }}>
            {/* Supported by */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: isMobile ? '12px' : '18px', width: isMobile ? '100%' : '247px' }}>
              <h3 style={{ fontFamily: fontFamily, fontWeight: 700, fontSize: isMobile ? '14px' : '16px', lineHeight: '20px', letterSpacing: '-0.02em', color: '#653A96', margin: 0 }}>
                Supported by
              </h3>
              <div style={{ width: isMobile ? '150px' : '247px', height: isMobile ? '125px' : '206px' }}>
                <Image
                  src={encodeURI("/project-1/hero-wecare2 2.png")}
                  alt="Hero WeCare Logo"
                  width={247}
                  height={206}
                  style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                />
              </div>
            </div>

            {/* Implemented by */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: isMobile ? '20px' : '40px', width: isMobile ? '100%' : '247px' }}>
              <h3 style={{ fontFamily: fontFamily, fontWeight: 700, fontSize: isMobile ? '14px' : '16px', lineHeight: '20px', letterSpacing: '-0.02em', color: '#653A96', margin: 0 }}>
                Implemented by
              </h3>
              <div style={{ width: isMobile ? '180px' : '255px', height: isMobile ? '70px' : '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

        {/* Bottom CTA Section */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            minHeight: '567px',
            backgroundImage: isMobile ? 'none' : `linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${encodeURI("/project-3/Rectangle 211.png")})`,
            backgroundColor: isMobile ? '#653A96' : 'transparent',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: isMobile ? '40px 20px' : '120px 80px',
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? '16px' : '30px',
            alignItems: isMobile ? 'center' : 'flex-start'
          }}
        >
          {/* CTA Title */}
          <h2
            style={{
              maxWidth: isMobile ? '100%' : '668px',
              fontFamily: 'DM Serif Display',
              fontWeight: 400,
              fontSize: isMobile ? '24px' : '42px',
              lineHeight: isMobile ? '32px' : '58px',
              letterSpacing: '-0.02em',
              color: '#FFFFFF',
              margin: 0,
              marginTop: isMobile ? '84px' : '0px',
              textAlign: isMobile ? 'center' : 'left'
            }}
          >
            Connecting women to markets, digital access & government schemes
          </h2>

          {/* Buttons Container */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '12px' : '20px', width: isMobile ? '100%' : 'auto' }}>
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
                width: isMobile ? '100%' : '601px',
                background: '#FECB07',
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

            {/* Download Phase-I Report Button */}
            <a
              href={encodeURI("/project-3/HfH_Phase 1_ABWCI_Completion Report.pdf")}
              download
              style={{
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: isMobile ? '12px 20px' : '10px 30px',
                gap: '12px',
                width: isMobile ? '100%' : '296px',
                background: '#FECB07',
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
                  Download Phase-I Report
                </span>
              </div>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" style={{ transform: 'matrix(-1, 0, 0, 1, 0, 0)' }}>
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="#171717"/>
              </svg>
            </a>

            {/* Download Phase-II Report Button */}
            <a
              href={encodeURI("/project-3/HfH_Phase 2_ABWCI_Report_Mar2023.pdf")}
              download
              style={{
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: isMobile ? '12px 20px' : '10px 30px',
                gap: '12px',
                width: isMobile ? '100%' : '296px',
                background: '#FECB07',
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
                  Download Phase-II Report
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

