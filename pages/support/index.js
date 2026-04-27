import Layout from '../../components/Layout';
  import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '../../lib/LanguageContext';
import { supportAPI } from '../../lib/api';
import Link from 'next/link';

export default function Support() {
  const { t } = useLanguage();
  const [activeFaq, setActiveFaq] = useState(null); // deprecated: kept for compatibility
  const [activeFaqSection, setActiveFaqSection] = useState(0); // Default "About ABWCI" open
  const [activeFaqQuestion, setActiveFaqQuestion] = useState(null); // Format: "sectionIndex-questionIndex"
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [queryText, setQueryText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null); // { type: 'success'|'error', message: string }
  const [showToast, setShowToast] = useState(false);
  const [pageImage, setPageImage] = useState('/assets/support/Rectangle 101.png'); // Default fallback
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(null); // null => all categories
  const [searchQuery, setSearchQuery] = useState('');
  const [imageLoading, setImageLoading] = useState(true);
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  
  const phoneNumber = '(+91) 11-4095-6653';
  
  const handleCopyPhoneNumber = async () => {
    try {
      // Check if Clipboard API is available
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(phoneNumber);
        setShowCopiedToast(true);
        setTimeout(() => setShowCopiedToast(false), 3000);
      } else {
        // Fallback method for browsers that don't support Clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = phoneNumber;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          const successful = document.execCommand('copy');
          if (successful) {
            setShowCopiedToast(true);
            setTimeout(() => setShowCopiedToast(false), 3000);
          } else {
            console.error('Fallback copy command failed');
          }
        } catch (fallbackErr) {
          console.error('Fallback copy failed:', fallbackErr);
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Auto-activate a category based on search when there is a single clear match
  useEffect(() => {
    const q = (searchQuery || '').trim().toLowerCase();
    if (!q) return; // do not change on empty query

    // 1) Category title match
    const titleMatches = faqSections
      .map((s, i) => ({ i, hit: s.title.toLowerCase().includes(q) }))
      .filter(x => x.hit)
      .map(x => x.i);

    if (titleMatches.length === 1) {
      setActiveCategoryIndex(titleMatches[0]);
      return;
    }

    // 2) Which categories have question matches
    const categoriesWithHits = faqSections
      .map((s, i) => ({ i, hit: s.items.some(it => (it.q || '').toLowerCase().includes(q) || s.title.toLowerCase().includes(q)) }))
      .filter(x => x.hit)
      .map(x => x.i);

    if (categoriesWithHits.length === 1) {
      setActiveCategoryIndex(categoriesWithHits[0]);
    } else {
      // Multiple or none -> show across all
      setActiveCategoryIndex(null);
    }
  }, [searchQuery]);
  
  // FAQs by section
  const faqSections = [
    {
      title: 'About ABWCI',
      items: [
        {
          q: 'What is ABWCI?',
          a: (
            <div className="space-y-3">
              <p><strong>Association of Business Women in Commerce & Industry (ABWCI)</strong> is a Virtual Global Chamber of Commerce for Women Business Owners. Its membership spans prominent women entrepreneurs, organisations, educational institutions, and companies investing in women.</p>
              <p>ABWCI aims to understand the needs of the future in women entrepreneurship, be responsive to challenges, and assist business women globally to benefit from emerging opportunities.</p>
            </div>
          )
        },
        {
          q: 'What is the objective of ABWCI?',
          a: (
            <div className="space-y-2">
              <p>Build a dynamic, inclusive platform connecting women entrepreneurs globally for growth, collaboration, knowledge sharing, market access, and mentorship.</p>
            </div>
          )
        },
        {
          q: "Who can join ABWCI?",
          a: (
            <p>Any woman entrepreneur, startup founder, professional, or mentor interested in contributing to women-led business growth can become a member.</p>
          )
        },
        {
          q: "What is the mission of ABWCI?",
          a: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Foster a global community of business women</li>
              <li>Enable access to finance, markets, capacity building, and policy dialogue</li>
              <li>Enhance access to the entrepreneurial ecosystem</li>
            </ul>
          )
        },
        {
          q: "What is the vision of ABWCI?",
          a: (
            <p>To become the most influential global, collaborative chamber for business women, driving inclusive growth and economic equity.</p>
          )
        },
        {
          q: "Is ABWCI a government organization?",
          a: (
            <p>No, ABWCI is an independent non-profit organization registered under relevant Indian laws. We collaborate closely with government bodies, financial institutions, and development agencies.</p>
          )
        },
        {
          q: "Who are ABWCI's potential partners?",
          a: (
            <>
            <p><strong>ABWCI</strong> partners with a diverse range of organizations that share our vision for women's economic empowerment, including: </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>International agencies</strong> – UN Women, IFC, Rockefeller Foundation, GIZ, and others</li>
              <li><strong>Private sector organizations</strong> – banks, accelerators, and technology companies</li>
              <li><strong>Women's chambers and business councils</strong>; universities and think tanks; government bodies</li>
              <li><strong>Government bodies</strong> - central and state departments</li>
              <li><strong>Media and creative agencies</strong> supporting inclusive storytelling</li>
            </ul>
            </>
          )
        },
        {
          q: "What will you gain from being part of ABWCI?",
          a: (
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Global visibility and growth</strong> for women-led businesses</li>
              <li><strong>Networking opportunities</strong> and potential for cross-sector collaborations</li>
              <li><strong>Access to finance and new markets</strong> through ecosystem partners</li>
              <li><strong>A strong support network </strong> and shared learning</li>
              <li><strong>Policy advocacy</strong> for a more gender-inclusive business environment</li>
            </ul>
          )
        }
      ]
    },
    {
      title: 'Membership & Registration',
      items: [
        {
          q: 'What are the types of memberships available?',
          a: (
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Entrepreneur / Mentee Membership</strong>: For women-led startups, MSMEs, and small business owners.
              </li>
              <li><strong>Ecosystem Enabler / Mentor Membership</strong>: For professionals, experts, and organizations that support women entrepreneurs.
              </li>
              <li><strong>Premium Membership (by invitation)</strong>: For senior professionals and ecosystem enablers offering mentorship and leadership.</li>
            </ul>
          )
        },
        {
          q: 'How can I register as a member?',
          a: (
            <ol className="list-decimal pl-5 space-y-1">
              <li>Visit <Link href="https://www.abwci.org" target="_blank">www.abwci.org</Link> and choose the membership category</li>
              <li>Complete the form and verify email/mobile with OTP</li>
              <li>Submit and receive a confirmation with a Unique ID</li>
            </ol>
          )
        },
        {
          q: "Is there a membership fee?",
          a: (
            <p>Basic membership is free for women entrepreneurs. Premium and institutional memberships may have a nominal annual contribution to support programs and services.</p>
          )
        },
        {
          q: "How do I verify my membership or get my Member ID?",
          a: (
            <p>Once your registration is verified by the ABWCI team, a unique Member ID will be emailed to you. You can also view it in your member dashboard after logging in.</p>
          )
        }
      ]
    },
    {
      title: 'Programs & Opportunities',
      items: [
        {
          q: 'What kind of support does ABWCI offer to entrepreneurs?',
          a: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Access to mentoring and expert sessions</li>
              <li>Funding and loan connect opportunities</li>
              <li>Learning and digital tools</li>
              <li>Market access via exhibitions, buyer-seller meets, and e-commerce integration</li>
              <li>Policy representation for women-led businesses</li>
            </ul>
          )
        },
        {
          q: "How can I apply for funding or mentorship?",
          a: (
            <p>Log in to your member dashboard and go to the <strong>"Get Funds"</strong> or <strong>"Find Mentor"</strong> sections to be guided step-by-step through the application process.</p>
          )
        },
        {
          q: "How does ABWCI help in connecting with markets?",
          a: (
            <p>Through our network of corporate partners, e-commerce linkages, and exhibitions, ABWCI helps women entrepreneurs showcase and sell their products locally and globally.</p>
          )
        },
        {
          q: "Can men participate in ABWCI programs?",
          a: (
            <p>Yes. Men can join as <strong>mentors</strong>, <strong>advisors</strong>, or <strong>ecosystem partners</strong> supporting women-led enterprises.</p>
          )
        }
      ]
    },
    {
      title: 'Partnerships',
      items: [
        {
          q: 'Can organizations partner with ABWCI?',
          a: <p>Absolutely. We welcome collaborations with corporates, NGOs, academic institutions, and development agencies that share our vision for women's economic empowerment. </p>
        },
        {
          q: "Who are ABWCI's potential partners?",
          a: (
            <>
            <p><strong>ABWCI</strong> partners with a diverse range of organizations that share our vision for women's economic empowerment, including: </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>International agencies</strong> – UN Women, IFC, Rockefeller Foundation, GIZ, and others</li>
                <li><strong>Private sector organizations</strong> – banks, accelerators, and technology companies</li>
                <li><strong>Women's chambers and business councils</strong>;</li>
                <li><strong>Universities and think tanks</strong></li>
                <li><strong>Government bodies</strong> - central and state departments</li>
                <li><strong>Media and creative agencies</strong> supporting inclusive storytelling</li>
              </ul>
            </>
          )
        }
      ]
    },
    {
      title: 'Donations & Impact',
      items: [
        {
          q: "How can I donate to support women entrepreneurs through ABWCI?",
          a: <p>You can contribute directly through our official donation partner platform — <Link href="https://enablewomen.org" target="_blank">EnableWomen.org</Link>. Your donation helps fund training programs, mentorship initiatives, digital inclusion projects, and access-to-finance opportunities for women-led businesses across India.</p>
        },
        {
          q: "Why does ABWCI use EnableWomen.org for donations?",
          a: <p><Link href="https://enablewomen.org" target="_blank">EnableWomen.org</Link> is ABWCI's verified giving partner platform that ensures transparency and accountability. Every contribution made here directly supports ABWCI's women entrepreneurship and livelihood programs, and donors receive verified impact reports.</p>
        },
        {
          q: "Are donations eligible for tax exemption?",
          a: <p>Yes. Donations made via <strong>EnableWomen.org</strong> to ABWCI programs are eligible for tax benefits as per applicable Indian laws. You will receive a digital receipt with all necessary details after your donation.</p>
        },
        {
          q: "How to cancel my donation subscription?",
          a: <p>You can cancel anytime. Just send your registered email to <strong>info@abwci.org</strong>. We'll still send you a note of gratitude for supporting our cause, and your contributions till date will continue empowering women in business.</p>
        },
        {
          q: "Can corporate or CSR donors contribute through EnableWomen.org?",
          a: <p>Absolutely. Corporates, CSR arms, and institutional donors can contribute through <strong>EnableWomen.org's CSR channel</strong>, enabling customized partnerships with measurable impact. For larger collaborations, please contact <strong>letstalk@abwci.org</strong> or <strong>info@abwci.org</strong>.</p>
        },
        {
          q: "What happens after I donate?",
          a: (
            <>
            <p>After your donation, you'll receive: </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>An acknowledgment email and tax receipt</strong></li>
              <li><strong>Periodic impact updates</strong> showing how your funds are being used</li>
              <li>An option to stay connected with women entrepreneurs you're empowering</li>
            </ul>
            </>
          )
        }
      ]
    },
    {
      title: 'Website & Tech Support',
      items: [
        {
          q: "I didn't receive my confirmation email. What should I do?",
          a: <p>Please check your spam folder or contact <strong>info@abwci.org</strong>. If the issue persists, our team will manually verify and activate your account.</p>
        },
        {
          q: "How do I reset my password?",
          a: <p>Go to the <strong>"Forgot Password"</strong> link on the login page. You'll receive a password reset email with instructions.</p>
        },
        {
          q: "Can I update my business details later?",
          a: <p>Yes. You can edit your business profile, upload documents, or update contact details anytime from your member dashboard.</p>
        },
        {
          q: "When will the Mentorship and Community features launch?",
          a: <p>We are planning to launch the Mentorship and Community features by early Dec 2025.</p>
        }
      ]
    }
  ];

  // Fetch and preload support page image - similar to index.js banner loading
  useEffect(() => {
    const fetchAndPreloadImage = async () => {
      setImageLoading(true);
      try {
        // Add timeout for API call
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page-images`, {
          signal: controller.signal,
          cache: 'no-cache'
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          const supportImage = data.data?.find(img => img.page_name === 'support' && img.is_active);
          const imageUrl = supportImage?.image_url || '/assets/support/Rectangle 101.png';
          
          // Preload the image - wait for it to fully load before showing page
          const img = new window.Image();
          
          // Promise-based loading with timeout
          const loadPromise = new Promise((resolve, reject) => {
            let resolved = false;
            
            const imageTimeout = setTimeout(() => {
              if (!resolved) {
                resolved = true;
                resolve(imageUrl); // Resolve anyway to show page
              }
            }, 5000); // 5 second max wait
            
            img.onload = () => {
              if (!resolved) {
                resolved = true;
                clearTimeout(imageTimeout);
                resolve(imageUrl);
              }
            };
            
            img.onerror = () => {
              if (!resolved) {
                resolved = true;
                clearTimeout(imageTimeout);
                resolve('/assets/support/Rectangle 101.png'); // Fallback
              }
            };
            
            img.src = imageUrl;
          });
          
          await loadPromise;
          setPageImage(imageUrl);
        } else {
          // Use fallback if API fails
          const fallbackImg = new window.Image();
          fallbackImg.onload = () => {
            setImageLoading(false);
          };
          fallbackImg.onerror = () => {
            setImageLoading(false);
          };
          fallbackImg.src = '/assets/support/Rectangle 101.png';
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('API request timeout, using fallback');
        } else {
          console.log('Error fetching page image, using fallback:', error);
        }
        // Load fallback image
        const fallbackImg = new window.Image();
        fallbackImg.onload = () => {
          setImageLoading(false);
        };
        fallbackImg.onerror = () => {
          setImageLoading(false);
        };
        fallbackImg.src = '/assets/support/Rectangle 101.png';
      } finally {
        // Ensure loading state is cleared after max 5 seconds
        setTimeout(() => {
          setImageLoading(false);
        }, 5000);
      }
    };
    fetchAndPreloadImage();
  }, []);
  
  useEffect(() => {
    if (submitResult) {
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [submitResult]);
  const countries = [
    { code: 'IN', name: 'India', flag: '🇮🇳' },
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
    { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪' },
    { code: 'FR', name: 'France', flag: '🇫🇷' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' },
    { code: 'PL', name: 'Poland', flag: '🇵🇱' },
    { code: 'IT', name: 'Italy', flag: '🇮🇹' },
    { code: 'ES', name: 'Spain', flag: '🇪🇸' },
    { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
    { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
    { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
    { code: 'AT', name: 'Austria', flag: '🇦🇹' },
    { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
    { code: 'NO', name: 'Norway', flag: '🇳🇴' },
    { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
    { code: 'FI', name: 'Finland', flag: '🇫🇮' },
    { code: 'HU', name: 'Hungary', flag: '🇭🇺' },
    { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿' },
    { code: 'SK', name: 'Slovakia', flag: '🇸🇰' },
    { code: 'RO', name: 'Romania', flag: '🇷🇴' },
    { code: 'BG', name: 'Bulgaria', flag: '🇧🇬' },
    { code: 'HR', name: 'Croatia', flag: '🇭🇷' },
    { code: 'SI', name: 'Slovenia', flag: '🇸🇮' },
    { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  ];

  // Show full-page loader until image is loaded - similar to index.js
  if (imageLoading) {
    return (
      <div 
        className="fixed inset-0 flex items-center justify-center z-[9999] bg-white"
      >
        <Image
          src="/Loader.gif"
          alt="Loading..."
          width={200}
          height={200}
          className="object-contain"
        />
      </div>
    );
  }

  return (
    <Layout title={t('support.metaTitle')} description={t('support.metaDescription')}>
      <style dangerouslySetInnerHTML={{__html: `
        .form-container:hover {
          background: #653A96 !important;
        }
        .form-container:hover .form-label {
          color: #FFFFFF !important;
        }
        .form-container:hover .form-title {
          color: #FFFFFF !important;
        }
        .form-container:hover .send-button {
          background: #FECB07 !important;
        }
        .form-container:hover .send-button .send-button-text {
          color: #171717 !important;
        }
        .send-button {
          background: #653A96 !important;
          transition: background-color 0.2s ease !important;
        }
        .form-container:focus-within .send-button,
        .support-form:focus-within .send-button {
          background: #FECB07 !important;
        }
        .form-container:focus-within .send-button .send-button-text,
        .support-form:focus-within .send-button .send-button-text {
          color: #171717 !important;
        }
        .send-button-text {
          color: #FFFFFF !important;
          transition: color 0.2s ease !important;
        }
      `}} />
      {/* Hero Section with Background Image */}
      <section className="relative lg:h-[380px] h-[420px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={pageImage}
            alt="Support Background"
            fill
            className="object-cover"
            style={{ objectPosition: '0% 70%' }}
            priority
            loading="eager"
            quality={90}
            sizes="100vw"
          />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(0deg, rgba(101, 58, 150, 0.2), rgba(101, 58, 150, 0.2))'
          }}></div>
        </div>
        
        {/* Content Overlay */}
        <div className="relative z-10 h-full">
          <div className="w-full h-full relative">
            {/* Container aligned with navbar */}
            <div className="max-w-7xl mx-auto px-4 h-full relative">
              {/* Left Section - Support Header & Search (Desktop) */}
              <div className="hidden lg:flex flex-col absolute top-[30px]" style={{ left: '1rem' }}>
                {/* Support Header */}
                <div className="flex items-start gap-5 mb-[35px]">
                  {/* Logo commented out - removed as per request */}
                  {/* <div className="w-16 h-16 rounded-full flex items-center justify-center">
                    <Image
                      src="/assets/support/fluent_person-support-24-filled.png"
                      alt="Support Icon"
                      width={32}
                      height={32}
                      className="w-14 h-14"
                    />
                  </div> */}
                  <h1 className="text-white" style={{
                    fontFamily: 'DM Serif Display, serif',
                    fontWeight: 400,
                    fontSize: '48px',
                    lineHeight: '64px',
                    color: '#FFFFFF'
                  }}>
                    {t('support.header')}
                  </h1>
                </div>
                {/* Categories section - 2 lines: 3 items in first line, 2 items in second line */}
                <div className="flex flex-col items-start">
                  <div className="grid grid-cols-3 gap-2" style={{ maxWidth: 'fit-content' }}>
                    {/* First row - 3 items */}
                    {faqSections.slice(0, 3).map((section, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveCategoryIndex(activeCategoryIndex === index ? null : index)}
                        className={`flex justify-center items-center px-4 py-2 rounded-[10px] whitespace-nowrap border ${activeCategoryIndex === index ? 'bg-white text-[#653a96] border-white' : 'text-white border-white'}`}
                        style={{
                          fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '18px',
                          color: activeCategoryIndex === index ? undefined : '#FFFFFF'
                        }}
                      >
                        {section.title}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2" style={{ maxWidth: 'fit-content' }}>
                    {/* Second row - 2 items (occupying first 2 columns) */}
                    {faqSections.slice(3, 5).map((section, index) => (
                      <button
                        key={index + 3}
                        onClick={() => setActiveCategoryIndex(activeCategoryIndex === (index + 3) ? null : (index + 3))}
                        className={`flex justify-center items-center px-4 py-2 rounded-[10px] whitespace-nowrap border ${activeCategoryIndex === (index + 3) ? 'bg-white text-[#653a96] border-white' : 'text-white border-white'}`}
                        style={{
                          fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '18px',
                          color: activeCategoryIndex === (index + 3) ? undefined : '#FFFFFF'
                        }}
                      >
                        {section.title}
                      </button>
                    ))}
                    {/* If there's a 6th item, display it in the third column */}
                    {faqSections.length > 5 && (
                      <button
                        key={5}
                        onClick={() => setActiveCategoryIndex(activeCategoryIndex === 5 ? null : 5)}
                        className={`flex justify-center items-center px-4 py-2 rounded-[10px] whitespace-nowrap border ${activeCategoryIndex === 5 ? 'bg-white text-[#653a96] border-white' : 'text-white border-white'}`}
                        style={{
                          fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '18px',
                          color: activeCategoryIndex === 5 ? undefined : '#FFFFFF'
                        }}
                      >
                        {faqSections[5].title}
                      </button>
                    )}
                  </div>
                </div>

                {/* Search Bar - positioned after categories with proper gap */}
                <div className="mt-8 mb-4 flex items-center px-[20px] py-3 bg-white border border-[#616161] rounded-[30px] shadow-lg" style={{
                  width: '300px',
                  height: '48px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}>
                  <svg className="w-5 h-5 text-[#616161] mr-[8px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder={t('support.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent text-[#616161] placeholder-[#616161] focus:outline-none"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '19px'
                    }}
                  />
                </div>
              </div>

            {/* Left Section - Mobile Header & Search */}
            <div className="block lg:hidden w-full px-4 pt-5 pb-20 space-y-6">
              <div className="flex flex-col items-start gap-6">
                <h1 className="text-white" style={{
                  fontFamily: 'DM Serif Display, serif',
                  fontWeight: 400,
                  fontSize: '42px',
                  lineHeight: '58px',
                  color: '#FFFFFF'
                }}>
                  {t('support.header')}
                </h1>
                {/* Categories - 2 rows grid (mobile) */}
                <div className="flex flex-col items-start gap-3 w-full">
                  {/* First row - 3 items */}
                  <div className="grid grid-cols-3 gap-2.5 w-full" style={{ maxWidth: '305px' }}>
                    {faqSections.slice(0, 3).map((section, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveCategoryIndex(activeCategoryIndex === index ? null : index)}
                        className={`flex justify-center items-center px-2.5 py-2.5 rounded-[10px] whitespace-normal border text-center ${activeCategoryIndex === index ? 'bg-white text-[#653a96] border-white' : 'bg-transparent text-white border-white'}`}
                        style={{
                          fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                          fontWeight: 400,
                          fontSize: '11px',
                          lineHeight: '13px',
                          color: activeCategoryIndex === index ? '#653a96' : '#FFFFFF',
                          minHeight: '33px',
                          wordBreak: 'break-word',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <span className="text-center">{section.title}</span>
                      </button>
                    ))}
                  </div>
                  {/* Second row - 2-3 items */}
                  <div className="grid grid-cols-3 gap-2.5 w-full" style={{ maxWidth: '305px' }}>
                    {faqSections.slice(3, 6).map((section, index) => (
                      <button
                        key={index + 3}
                        onClick={() => setActiveCategoryIndex(activeCategoryIndex === (index + 3) ? null : (index + 3))}
                        className={`flex justify-center items-center px-2.5 py-2.5 rounded-[10px] whitespace-normal border text-center ${activeCategoryIndex === (index + 3) ? 'bg-white text-[#653a96] border-white' : 'bg-transparent text-white border-white'}`}
                        style={{
                          fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                          fontWeight: 400,
                          fontSize: '11px',
                          lineHeight: '13px',
                          color: activeCategoryIndex === (index + 3) ? '#653a96' : '#FFFFFF',
                          minHeight: '33px',
                          wordBreak: 'break-word',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <span className="text-center">{section.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
                {/* Search under categories (mobile) */}
                <div className="flex items-center px-4 py-4 bg-white border border-[#616161] rounded-[30px] w-full mb-10" style={{ maxWidth: '280px', height: '48px' }}>
                  <svg className="w-4 h-4 text-[#616161] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder={t('support.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent text-[#616161] placeholder-[#616161] focus:outline-none"
                    style={{ 
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '17px'
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* Right Section - Contact Options (Desktop) */}
            <div className="hidden lg:flex flex-row absolute right-4 top-[120px] w-[360px] h-[88px]" style={{ gap: 0 }}>
              {/* WhatsApp */}
              <Link href="https://wa.me/9810485280" target="_blank" rel="noopener noreferrer" className="flex flex-col justify-center items-center gap-5" style={{
                width: '120px',
                height: '88px',
                textDecoration: 'none'
              }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center">
                  <Image
                    src="/assets/support/whatsapp-yellow.png"
                    alt="WhatsApp"
                    width={24}
                    height={24}
                    className="w-8 h-8"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                </div>
                <span className="text-white text-center" style={{
                  width: '120px',
                  height: '20px',
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '20px',
                  letterSpacing: '-0.02em',
                  color: '#FFFFFF'
                }}>
                  {t('support.whatsappUs')}
                </span>
              </Link>
              
              {/* Call */}
              <button 
                onClick={handleCopyPhoneNumber}
                className="flex flex-col justify-center items-center gap-5 cursor-pointer bg-transparent border-none" 
                style={{
                  width: '120px',
                  height: '88px',
                  textDecoration: 'none'
                }}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center">
                  <Image
                    src="/assets/support/call-yellow.png"
                    alt="Call"
                    width={24}
                    height={24}
                    className="w-8 h-8"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                </div>
                <span className="text-white text-center" style={{
                  width: '120px',
                  height: '20px',
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '20px',
                  letterSpacing: '-0.02em',
                  color: '#FFFFFF'
                }}>
                  {t('support.callUs')}
                </span>
              </button>
              
              {/* Mail */}
              <Link href="mailto:info@abwci.org" target="_blank" rel="noopener noreferrer" className="flex flex-col justify-center items-center gap-5" style={{
                width: '120px',
                height: '88px',
                textDecoration: 'none'
              }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center">
                  <Image
                    src="/assets/support/mail-yellow.png"
                    alt="Mail"
                    width={24}
                    height={24}
                    className="w-8 h-8"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                </div>
                <span className="text-white text-center" style={{
                  width: '120px',
                  height: '20px',
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '20px',
                  letterSpacing: '-0.02em',
                  color: '#FFFFFF'
                }}>
                  {t('support.mailUs')}
                </span>
              </Link>
            </div>

            {/* Contact Options - Mobile */}
            <div className="lg:hidden absolute bottom-12 pt-10 left-0 right-0 w-full flex flex-row justify-center items-center" style={{ 
              gap: '20px',
              flexWrap: 'nowrap',
              paddingLeft: '16px',
              paddingRight: '16px'
            }}>
              {/* WhatsApp */}
              <Link 
                href="https://wa.me/9810485280" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  width: '100px',
                  minWidth: '80px',
                  flexShrink: 0,
                  textDecoration: 'none'
                }}
              >
                <Image src="/assets/support/whatsapp-yellow.png" alt="" width={20} height={20} style={{ width: '20px', height: '20px', flexShrink: 0, filter: 'brightness(0) invert(1)' }} />
                <span className="text-white text-center" style={{ 
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontWeight: 500,
                  fontSize: '11px',
                  lineHeight: '13px',
                  letterSpacing: '-0.02em',
                  color: '#FFFFFF',
                  whiteSpace: 'nowrap'
                }}>{t('support.whatsappUs')}</span>
              </Link>
              
              {/* Call - Copy to Clipboard */}
              <button 
                onClick={handleCopyPhoneNumber}
                className="cursor-pointer bg-transparent border-none" 
                style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  width: '100px',
                  minWidth: '80px',
                  flexShrink: 0,
                  textDecoration: 'none'
                }}
              >
                <Image src="/assets/support/call-yellow.png" alt="" width={20} height={20} style={{ width: '20px', height: '20px', flexShrink: 0, filter: 'brightness(0) invert(1)' }} />
                <span className="text-white text-center" style={{ 
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontWeight: 500,
                  fontSize: '11px',
                  lineHeight: '13px',
                  letterSpacing: '-0.02em',
                  color: '#FFFFFF',
                  whiteSpace: 'nowrap'
                }}>{t('support.callUs')}</span>
              </button>
              
              {/* Mail */}
              <Link 
                href="mailto:info@abwci.org" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  width: '100px',
                  minWidth: '80px',
                  flexShrink: 0,
                  textDecoration: 'none'
                }}
              >
                <Image src="/assets/support/mail-yellow.png" alt="" width={20} height={20} style={{ width: '20px', height: '20px', flexShrink: 0, filter: 'brightness(0) invert(1)' }} />
                <span className="text-white text-center" style={{ 
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontWeight: 500,
                  fontSize: '11px',
                  lineHeight: '13px',
                  letterSpacing: '-0.02em',
                  color: '#FFFFFF',
                  whiteSpace: 'nowrap'
                }}>{t('support.mailUs')}</span>
              </Link>
            </div>
            </div>
          </div>
        </div>
      </section>


      {/* FAQ Section */}
      <section className="py-8 lg:py-16 px-4 sm:px-6 lg:px-8 bg-white gap-6 lg:gap-4 flex flex-col">
        <div className="max-w-[1400px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
            
            {/* Left Section - FAQ Items (flat list, filtered by category) */}
            <div className="lg:col-span-2 space-y-3 lg:space-y-5 lg:pl-16 lg:pr-2">
              <div className="max-w-[800px]">
              {(() => {
                const allItems = faqSections.flatMap((section, sIdx) => section.items.map((item, qIdx) => ({ ...item, key: `${sIdx}-${qIdx}`, sectionIndex: sIdx })));
                const q = (searchQuery || '').trim().toLowerCase();

                let items;
                if (q) {
                  // Search mode: always search across ALL categories
                  items = allItems.filter(it => {
                    const inQuestion = (it.q || '').toLowerCase().includes(q);
                    const sectionTitle = faqSections[it.sectionIndex]?.title || '';
                    const inCategoryTitle = sectionTitle.toLowerCase().includes(q);
                    return inQuestion || inCategoryTitle;
                  });
                } else if (activeCategoryIndex !== null) {
                  // Category-only filter when no search query
                  items = (faqSections[activeCategoryIndex]?.items || []).map((item, qIdx) => ({ ...item, key: `${activeCategoryIndex}-${qIdx}`, sectionIndex: activeCategoryIndex }));
                } else {
                  // Default: show all
                  items = allItems;
                }
 
                  return (
                    <div className="pb-3 lg:pb-4 max-h-[680px] overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {items.map((item) => (
                      <div key={`faq-${item.key}`} className="mb-0 lg:mb-8 pb-0 lg:pb-5 border-b border-black lg:border-b-2 lg:border-gray-300">
                        <button onClick={() => setActiveFaqQuestion(activeFaqQuestion === item.key ? null : item.key)} className="w-full flex justify-between items-center text-left group px-2.5 py-2.5 lg:px-0 lg:py-0" style={{ gap: '20px' }}>
                          <h3 className="text-sm lg:text-2xl text-black pr-4 lg:pr-8 leading-tight group-hover:text-[#653a96] transition-colors duration-200 flex-1" style={{ fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: '16px', lineHeight: '22px' }}>{item.q}</h3>
                          <svg className={`w-5 h-5 text-black transform transition-all duration-300 ease-in-out flex-shrink-0 group-hover:text-[#653a96]`} fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ transform: activeFaqQuestion === item.key ? 'none' : 'matrix(1, 0, 0, -1, 0, 0)' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                        </button>
                        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeFaqQuestion === item.key ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                          <div className="mt-3 lg:mt-4">
                            <div className="bg-[#fecb07] rounded-lg lg:rounded-xl p-4 lg:p-6 transform transition-all duration-300 ease-in-out hover:shadow-lg">
                              <div className="text-sm lg:text-xl text-black leading-relaxed" style={{ fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: '16px', lineHeight: '24px' }}>{item.a}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
              </div>
            </div>
            
            {/* Right Section - Form (styled as per spec) */}
            <div className="mt-6 lg:mt-0 lg:sticky lg:top-4 lg:self-start w-full">
              <div
                className="box-border w-full px-5 pt-4 pb-5 form-container"
                style={{
                  background: '#FFFFFF',
                  // border: '1px solid #000000',
                   borderRadius: '16px',
                  width: '100%'
                }}
              >
                {/* Inner column frame */}
                <div className="flex flex-col items-start gap-[30px] w-full">
                  <h3 className="text-[36px] lg:text-[48px] leading-[49px] lg:leading-[58px] w-full form-title" style={{
                    fontFamily: 'DM Serif Display',
                    fontWeight: 400,
                    color: '#000000',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    whiteSpace: 'normal'
                  }}>{t('support.reachOut')}</h3>

                  {/* Form stack */}
                  <form
                    className="flex flex-col items-start gap-[20px] lg:gap-[30px] support-form"
                    style={{ height: 'auto', minHeight: '540px', width: '100%' }}
                    onSubmit={async (e) => {
                      e.preventDefault();
                      // Only proceed if the actual submit button triggered this submit
                      const submitter = e?.nativeEvent?.submitter;
                      if (submitter && submitter.getAttribute && submitter.getAttribute('data-submit') !== 'support-send') {
                        return;
                      }
                      setSubmitResult(null);
                      setSubmitting(true);
                      try {
                        // basic client-side validation
                        const nameTrimmed = (fullName || '').trim();
                        const emailTrimmed = (email || '').trim();
                        const messageTrimmed = (queryText || '').trim();

                        if (!nameTrimmed || !emailTrimmed || !messageTrimmed) {
                          setSubmitResult({ type: 'error', message: t('common.formValidationRequired') || 'Please fill in all required fields.' });
                          setSubmitting(false);
                          return;
                        }
                        if (nameTrimmed.length < 2) {
                          setSubmitResult({ type: 'error', message: t('common.formValidationNameMin') || 'Full name must be at least 2 characters.' });
                          setSubmitting(false);
                          return;
                        }
                        if (!/\S+@\S+\.\S+/.test(emailTrimmed)) {
                          setSubmitResult({ type: 'error', message: t('common.formValidationEmail') || 'Please enter a valid email address.' });
                          setSubmitting(false);
                          return;
                        }
                        if (messageTrimmed.length < 5) {
                          setSubmitResult({ type: 'error', message: t('common.formValidationMessageMin') || 'Message must be at least 5 characters.' });
                          setSubmitting(false);
                          return;
                        }
                        const response = await supportAPI.submit({
                          full_name: nameTrimmed,
                          email: emailTrimmed,
                          country_code: selectedCountry ? selectedCountry.code : null,
                          message: messageTrimmed,
                        });
                        if (response && response.success) {
                          setSubmitResult({ type: 'success', message: t('common.formSuccess') || 'Submitted successfully.' });
                          setFullName('');
                          setEmail('');
                          setSelectedCountry(null);
                          setQueryText('');
                        } else {
                          setSubmitResult({ type: 'error', message: t('common.formError') || 'Submission failed.' });
                        }
                      } catch (err) {
                        let apiMsg = err?.message;
                        if (err?.payload) {
                          const base = err.payload.error || err.payload.message;
                          const details = Array.isArray(err.payload.details) ? `: ${err.payload.details.join(', ')}` : '';
                          apiMsg = base ? `${base}${details}` : apiMsg;
                        }
                        setSubmitResult({ type: 'error', message: apiMsg || (t('common.formError') || 'Submission failed.') });
                      } finally {
                        setSubmitting(false);
                      }
                    }}
                  >
                    {/* Inputs stack */}
                    <div className="flex flex-col items-start gap-[20px]" style={{ width: '100%', height: 'auto', minHeight: '460px' }}>
                      {/* Full Name */}
                      <div className="flex flex-col items-start gap-[8px]" style={{ width: '100%', height: '82px' }}>
                        <div className="flex flex-row justify-center items-center gap-[10px] px-[20px]" style={{ width: '106px', height: '17px' }}>
                          <span className="form-label" style={{ fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '17px', color: '#2B2D30' }}>{t('support.fullNameLabel')}</span>
                        </div>
                        <div className="flex flex-row items-start gap-[10px]" style={{ padding: '20px 10px 20px 20px', width: '100%', height: '57px', background: '#F5F5F5', borderRadius: '30px' }}>
                          <input value={fullName} onChange={(e) => setFullName(e.target.value)} type="text" placeholder={t('support.fullNamePlaceholder')} className="bg-transparent w-full focus:outline-none" style={{ fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '17px', color: 'rgba(0,0,0,0.6)' }} />
                        </div>
                      </div>

                      {/* Email address */}
                      <div className="flex flex-col items-start gap-[8px]" style={{ width: '100%', height: '82px' }}>
                        <div className="flex flex-row justify-center items-center gap-[10px] px-[20px]" style={{ width: '133px', height: '17px' }}>
                          <span className="form-label" style={{ fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '17px', color: '#2B2D30' }}>{t('support.emailLabel')}</span>
                        </div>
                        <div className="flex flex-row items-start gap-[10px]" style={{ padding: '20px 10px 20px 20px', width: '100%', height: '57px', background: '#F5F5F5', borderRadius: '30px' }}>
                          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder={t('support.emailPlaceholder')} className="bg-transparent w-full focus:outline-none" style={{ fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '17px', color: 'rgba(0,0,0,0.6)' }} />
                        </div>
                      </div>

                      {/* Country (select with flags) */}
                      <div className="flex flex-col items-start gap-[8px]" style={{ width: '100%' }}>
                        <div className="flex flex-row justify-center items-center gap-[10px] px-[20px]" style={{ height: '17px' }}>
                          <span className="form-label" style={{ fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '17px', color: '#2B2D30' }}>{t('support.countryLabel')}</span>
                        </div>
                        <div className="relative w-full">
                          <button
                            type="button"
                            onClick={() => setIsCountryOpen(!isCountryOpen)}
                            className="w-full flex items-start gap-2"
                            style={{ padding: '20px 10px 20px 20px', background: '#F5F5F5', borderRadius: '30px', height: '57px' }}
                          >
                            <span className="flex-1 text-left" style={{ fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '17px', color: 'rgba(0,0,0,0.6)' }}>
                              {selectedCountry ? `${selectedCountry.flag} ${selectedCountry.name}` : t('support.selectCountry')}
                            </span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9l6 6 6-6" stroke="#2B2D30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </button>
                          {isCountryOpen && (
                            <div className="absolute z-20 mt-2 w-full max-h-56 overflow-auto bg-white border border-gray-200 rounded-xl shadow-md">
                              {countries.map((c) => (
                                <button
                                  key={c.code}
                                  type="button"
                                  onClick={() => { setSelectedCountry(c); setIsCountryOpen(false); }}
                                  className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2"
                                  style={{ fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Arial, sans-serif', fontSize: '14px', lineHeight: '18px', color: '#2B2D30' }}
                                >
                                  <span className="text-lg">{c.flag}</span>
                                  <span>{c.name}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Query */}
                      <div className="flex flex-col items-start gap-[8px]" style={{ width: '100%', height: '140px' }}>
                        <div className="flex flex-row justify-center items-center gap-[10px] px-[20px]" style={{ width: '81px', height: '17px' }}>
                          <span className="form-label" style={{ fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '17px', color: '#2B2D30' }}>{t('support.queryLabel')}</span>
                        </div>
                        <div className="flex flex-row items-start gap-[10px]" style={{ padding: '20px 10px 20px 20px', width: '100%', height: '110px', background: '#F5F5F5', borderRadius: '30px' }}>
                          <textarea value={queryText} onChange={(e) => setQueryText(e.target.value)} placeholder={t('support.queryPlaceholder')} className="bg-transparent w-full focus:outline-none resize-none" style={{ fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '17px', color: 'rgba(0,0,0,0.6)' }} />
                        </div>
                      </div>
                    </div>

                    {/* Send button */}
                    <button type="submit" data-submit="support-send" disabled={submitting} className="flex flex-row justify-center items-center gap-[10px] disabled:opacity-60 send-button" style={{ padding: '12px 30px', width: '100%', height: '44px', borderRadius: '30px' }}>
                      <span className="send-button-text" style={{ fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 500, fontSize: '16px', lineHeight: '20px', color: '#FFFFFF' }}>{submitting ? (t('common.sending') || 'Sending...') : t('support.send')}</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Bottom-center Toast */}
      {showToast && submitResult && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4" role="status" aria-live="polite">
          <div
            className={`flex items-start gap-3 w-[360px] max-w-[90vw] shadow-lg rounded-md border px-4 py-3 ${
              submitResult.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}
            style={{ fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif' }}
          >
            <div className={`mt-0.5 ${submitResult.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {submitResult.type === 'success' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.172 7.707 8.879a1 1 0 10-1.414 1.414L9 13l4.707-4.707z" clipRule="evenodd" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10A8 8 0 11.001 10 8 8 0 0118 10zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 10-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
              )}
            </div>
            <div className="flex-1 text-sm text-black/80">
              {submitResult.message}
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={() => setShowToast(false)}
              className={`ml-2 p-1 rounded hover:bg-black/5 ${submitResult.type === 'success' ? 'text-green-700' : 'text-red-700'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </button>
          </div>
        </div>
      )}
      
      {/* Copied to Clipboard Toast */}
      {showCopiedToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4" role="status" aria-live="polite">
          <div
            className="flex items-center gap-3 w-[360px] max-w-[90vw] shadow-lg rounded-md border px-4 py-3 bg-green-50 border-green-200"
            style={{ fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif' }}
          >
            <div className="text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.172 7.707 8.879a1 1 0 10-1.414 1.414L9 13l4.707-4.707z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1 text-sm text-black/80">
              Phone number copied to clipboard: {phoneNumber}
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={() => setShowCopiedToast(false)}
              className="ml-2 p-1 rounded hover:bg-black/5 text-green-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
