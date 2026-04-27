import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useLanguage } from '../lib/LanguageContext';
import legalTermsData from '../data/legal-terms.json';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [selectedLegalContent, setSelectedLegalContent] = useState(null);
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

  const handleLegalClick = (type) => {
    setSelectedLegalContent(legalTermsData[type]);
    setIsLegalModalOpen(true);
  };

  const closeLegalModal = () => {
    setIsLegalModalOpen(false);
    setSelectedLegalContent(null);
  };

  const knowledgeHubLinks = [
    { label: t('footer.blogs'), href: '/knowledge/blog' },
    { label: t('footer.resources'), href: 'knowledge/resources' }
  ];

  const companyLinks = [
    { label: t('footer.aboutUs'), href: '/about' },
    { label: t('expandedNav.globalSecretariat'), href: '/about/global-secretariat' },
    { label: t('expandedNav.partnerships'), href: '/about/partnerships' },
    { label: "Leadership", href: '/leadership' },
    { label: t('expandedNav.successStories'), href: '/about/success-stories' },
    { label: t('footer.contactUs'), href: '/support' },
    { label: "FAQs", href: '/support' },
    { label: "Global", href: '/global-presence' }
  ];

  const opportunitiesLinks = [
    { label: t('expandedNav.mentorship'), href: '/opportunities/mentorship' },
    { label: t('expandedNav.aiPlatform'), href: '/opportunities/ai-platform' },
    { label: t('expandedNav.tenders'), href: '/opportunities/tenders' }
  ];

  const socialLinks = [
    { 
      name: 'Instagram', 
      href: 'https://www.instagram.com/abwci.global/',
      svg: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="#653a96"/>
        </svg>
      )
    },
    { 
      name: 'LinkedIn', 
      href: 'https://www.linkedin.com/company/association-of-business-women-in-commerce-and-industry/about/',
      svg: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="#653a96"/>
        </svg>
      )
    },
    { 
      name: 'Twitter/X', 
      href: 'https://twitter.com/abwci_global',
      svg: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="#653a96"/>
        </svg>
      )
    },
    { 
      name: 'Facebook', 
      href: 'https://www.facebook.com/profile.php?id=100089334037113',
      svg: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#653a96"/>
        </svg>
      )
    }
  ];

  return (
    <footer className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Desktop Version */}
        <div className="hidden lg:block">
          <div className="flex flex-col space-y-8">
            {/* Top Section: Logo + 4 Columns */}
            <div className="flex flex-row items-start justify-between">
              {/* Logo Section with Address and Social Icons below */}
              <div className="flex flex-col items-start h-full justify-between gap-5">
                <div className="mb-3">
                  <Image
                    src="/abwci-newlogo.svg"
                    alt="ABWCI Footer Logo"
                    width={640}
                    height={224}
                    className="w-80 h-28 object-contain"
                    quality={100}
                    priority
                  />
                </div>

                {/* Address Section */}
                <div className="flex items-start space-x-2 ml-3 mb-3 text-[#653a96]"
                  style={{
                    fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '20px'
                  }}
                >
                  {/* <Image
                    src="/fluent-mdl2_world.svg"
                    alt="World Icon"
                    width={20}
                    height={20}
                    className="flex-shrink-0 mt-0.5"
                  /> */}

<svg width="28" height="28" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" className='mt-4'>
<path d="M13 0C5.85 0 0 5.85 0 13C0 20.15 5.85 26 13 26C20.15 26 26 20.15 26 13C26 5.85 20.15 0 13 0ZM21.45 8.6125C22.1 8.6125 22.5875 9.1 23.2375 9.1C22.75 9.75 20.6375 9.75 19.9875 8.9375C20.475 8.775 20.8 8.6125 21.45 8.6125ZM1.625 13C1.625 12.35 1.625 11.7 1.7875 10.8875C1.95 10.8875 2.1125 11.05 2.275 11.05C2.275 11.05 2.4375 11.2125 2.4375 11.375C2.4375 11.8625 2.925 12.1875 3.25 12.1875C4.55 12.35 5.0375 13.4875 6.175 13.8125C6.5 13.975 6.3375 14.3 6.175 14.625C5.2 15.925 6.0125 16.9 6.825 17.7125C7.6375 18.3625 7.6375 19.0125 7.8 19.9875C7.8 21.125 7.9625 22.425 8.45 23.5625C4.3875 21.6125 1.625 17.7125 1.625 13ZM13 24.375C11.8625 24.375 10.5625 24.2125 9.5875 23.8875C9.425 23.5625 9.425 23.2375 9.5875 22.9125C10.2375 21.6125 10.8875 20.475 11.7 19.3375C12.025 19.0125 12.35 18.6875 12.35 18.2C12.35 17.875 12.5125 17.3875 12.675 17.0625C13.1625 16.25 13 15.7625 12.35 15.6C11.05 15.275 10.4 14.1375 9.425 13.65C8.45 13.1625 7.475 12.8375 6.6625 13.325C6.3375 13.4875 5.85 13.65 5.85 13.1625C5.85 12.5125 5.0375 12.025 5.2 11.375C5.0375 11.375 4.875 11.375 4.7125 11.5375C4.55 11.7 4.3875 11.8625 4.0625 11.7C3.7375 11.375 3.9 11.05 3.9 10.725C4.0625 10.4 4.225 10.2375 4.55 10.075C5.2 9.9125 5.85 9.9125 6.175 10.725C6.6625 9.2625 7.6375 8.45 8.6125 7.8C8.6125 7.8 9.9125 6.6625 10.075 6.6625C10.2375 6.6625 10.4 6.9875 10.725 7.15C11.05 7.15 11.2125 7.15 11.2125 6.825C11.375 6.0125 10.8875 5.0375 10.2375 4.875C10.2375 4.7125 10.4 4.7125 10.4 4.7125C10.8875 4.55 11.5375 4.225 11.375 3.7375C11.375 3.0875 10.725 2.7625 10.075 2.7625C9.75 2.7625 9.425 2.7625 9.1 2.925C8.45 3.25 7.6375 3.575 6.6625 3.575C8.45 2.275 10.725 1.625 13 1.625H14.3C13.325 1.7875 12.35 2.1125 11.7 2.4375C12.675 2.6 12.8375 3.0875 12.5125 3.9C12.35 4.225 12.5125 4.55 12.8375 4.7125C13.1625 4.875 13.4875 4.875 13.65 4.55C13.975 4.0625 14.625 3.9 15.1125 3.7375C15.7625 3.575 16.25 3.25 16.7375 2.6C16.7375 2.4375 16.9 2.4375 17.0625 2.275C18.0375 2.6 19.0125 3.25 19.9875 3.9C19.825 3.9 19.825 4.0625 19.6625 4.0625C19.3375 4.3875 18.85 4.55 19.3375 5.2C19.5 5.525 19.3375 5.6875 19.175 5.85C18.85 6.0125 18.6875 5.85 18.525 5.6875C18.3625 5.525 18.3625 5.2 17.875 5.2C17.7125 5.525 17.225 5.6875 17.225 6.175C18.0375 6.175 17.875 6.825 18.0375 7.3125C17.0625 7.475 16.7375 7.9625 17.225 8.775C17.3875 9.1 17.0625 9.2625 16.9 9.425C16.25 10.4 15.6 11.05 15.6 12.1875C15.6 13.325 16.4125 14.4625 17.7125 14.3C19.175 14.1375 19.175 14.1375 19.6625 15.4375C19.6625 15.6 19.825 15.7625 19.825 15.925C19.9875 16.25 20.15 16.575 19.9875 16.9C19.5 18.2 20.15 19.175 20.6375 20.15C20.8 20.475 20.9625 20.6375 21.125 20.8C19.0125 23.075 16.25 24.375 13 24.375Z" fill="#653A96"/>
</svg>

                  <div className="flex flex-col">
                    <span className="font-medium ml-1">Global Secretariat</span>
                    <span className=" font-medium ml-1">Building No. 30, Third Floor, Basant Lok Community Centre,</span>
                    <span className=" font-medium ml-1">Vasant Vihar, New Delhi, India - 110057</span>
                  </div>
                </div>

                {/* Social Media Icons */}
                <div className="flex space-x-4 ml-3">
                  {socialLinks.map((social, index) => (
                    <Link
                      key={index}
                      href={social.href}
                      className="text-[#653a96] hover:text-[#4a2470] transition-colors duration-200"
                      aria-label={social.name}
                    >
                      {social.svg}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Right Side - Knowledge Hub + Opportunities (stacked), Company, Contact */}
              <div className="flex space-x-12 items-start">
                {/* Knowledge Hub and Opportunities Column (stacked) */}
                <div className="flex flex-col space-y-8">
                  {/* Knowledge Hub Section */}
                  <div className="flex flex-col space-y-4">
                    <h3 className="text-lg font-bold text-[#653a96] normal-case">Knowledge Hub</h3>
                    <div className="space-y-2">
                      {knowledgeHubLinks.map((link, linkIndex) => (
                        <Link
                          key={linkIndex}
                          href={link.href}
                          className="block text-[#653a96] hover:text-[#4a2470] transition-colors duration-200 text-sm"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Opportunities Section */}
                  <div className="flex flex-col space-y-4">
                    <h3 className="text-lg font-bold text-[#653a96] normal-case">Opportunities</h3>
                    <div className="space-y-2">
                      {opportunitiesLinks.map((link, linkIndex) => (
                        <Link
                          key={linkIndex}
                          href={link.href}
                          className="block text-[#653a96] hover:text-[#4a2470] transition-colors duration-200 text-sm"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Company Section */}
                <div className="flex flex-col space-y-4">
                  <h3 className="text-lg font-bold text-[#653a96] normal-case">{t('footer.company')}</h3>
                  <div className="space-y-2">
                    {companyLinks.map((link, linkIndex) => (
                      <Link
                        key={linkIndex}
                        href={link.href}
                        className="block text-[#653a96] hover:text-[#4a2470] transition-colors duration-200 text-sm"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Contact Section */}
                <div className="flex flex-col space-y-4">
                  <div className="space-y-2">
                    <div>
                      <div className="flex items-center text-[#653a96] font-medium">
                        <Image
                          src="/assets/ic_baseline-whatsapp.png"
                          alt="WhatsApp"
                          width={24}
                          height={24}
                          className="mr-2"
                        />
                        <Link href="https://wa.me/9810485280" target="_blank" rel="noopener noreferrer" className="hover:underline">{t('footer.whatsappUs')}</Link>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center text-[#653a96] font-medium">
                        <Image
                          src="/assets/material-symbols_call.svg"
                          alt="Call"
                          width={24}
                          height={24}
                          className="mr-2"
                        />
                        <button onClick={handleCopyPhoneNumber} className="hover:underline cursor-pointer bg-transparent border-none p-0 text-[#653a96] font-medium">{t('footer.callUs')}</button>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center text-[#653a96] font-medium">
                        <Image
                          src="/assets/material-symbols_mail.svg"
                          alt="Mail"
                          width={24}
                          height={24}
                          className="mr-2"
                        />
                        <Link href="mailto:info@abwci.org" target="_blank" rel="noopener noreferrer" className="hover:underline">{t('footer.mailUs')}</Link>
                      </div>
                    </div>

                    {/* Donate Now Button */}
                    <div className="pt-3">
                      <Link
                        href="https://www.enablewomen.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-full hover:opacity-90 transition-opacity duration-200"
                        style={{
                          background: '#653a96',
                          borderRadius: '30px',
                          width: '216px',
                          height: '40px',
                          fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                          fontWeight: 500,
                          fontSize: '16px',
                          lineHeight: '20px',
                          color: '#FFFFFF',
                          padding: '10px 30px',
                          textDecoration: 'none'
                        }}
                      >
                        Donate Now
                      </Link>
                    </div>

                    {/* Tax Benefits Section */}
                    <div className="flex flex-row items-start gap-3 pt-3">
                      <div className="relative flex-shrink-0" style={{ width: '32px', height: '40px' }}>
                        <svg width="32" height="40" viewBox="0 0 27 34" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                          <path d="M0.75 17.8765H4.30619C4.4033 17.8732 4.50001 17.8904 4.59 17.9271C4.67998 17.9638 4.76121 18.019 4.82835 18.0893C4.8955 18.1595 4.94705 18.2431 4.97963 18.3347C5.01222 18.4262 5.02509 18.5236 5.01743 18.6205V32.0059C5.02534 32.1028 5.01263 32.2002 4.98012 32.2918C4.9476 32.3834 4.89604 32.467 4.82882 32.5372C4.7616 32.6074 4.68026 32.6625 4.59017 32.6989C4.50008 32.7353 4.40329 32.7522 4.30619 32.7485H0.75" stroke="#653a96" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M10.9223 14.7386L8.18827 18.1426C8.00871 18.3664 7.78293 18.5487 7.52636 18.6771C7.2698 18.8055 6.98853 18.8769 6.70179 18.8866H5.01758M5.01758 28.8866C8.06736 31.1981 10.8497 32.75 12.6463 32.75H21.5695C22.6506 32.75 23.3305 32.6732 23.7999 31.2635C24.5169 27.6647 25.0133 24.026 25.2878 20.3674C25.2878 19.6248 24.5439 18.8809 23.0574 18.8809H14.6193M11.2523 17.0445L9.05029 1.6362C9.03461 1.52613 9.04275 1.41397 9.07415 1.30732C9.10555 1.20066 9.15949 1.10199 9.23231 1.01797C9.30514 0.933953 9.39515 0.866552 9.49627 0.820322C9.59738 0.774092 9.70725 0.750111 9.81843 0.75H20.5638" stroke="#653a96" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M15.9261 18.8865L14.6231 5.85809C14.6125 5.75856 14.6231 5.6579 14.654 5.56271C14.685 5.46752 14.7357 5.37993 14.8028 5.30568C14.8699 5.23143 14.952 5.17219 15.0436 5.13183C15.1352 5.09147 15.2343 5.0709 15.3344 5.07146H25.1495C25.2528 5.07023 25.3552 5.09154 25.4495 5.13393C25.5438 5.17631 25.6278 5.23874 25.6955 5.31687C25.7632 5.395 25.813 5.48695 25.8416 5.58632C25.8701 5.68569 25.8766 5.79008 25.8607 5.89223L23.8977 18.979" stroke="#653a96" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M19.9905 13.0117C19.849 13.0117 19.7133 12.9555 19.6133 12.8554C19.5132 12.7554 19.457 12.6197 19.457 12.4783C19.457 12.3368 19.5132 12.2011 19.6133 12.1011C19.7133 12.001 19.849 11.9448 19.9905 11.9448M19.9905 13.0117C20.1319 13.0117 20.2676 12.9555 20.3677 12.8554C20.4677 12.7554 20.5239 12.6197 20.5239 12.4783C20.5239 12.3368 20.4677 12.2011 20.3677 12.1011C20.2676 12.001 20.1319 11.9448 19.9905 11.9448" stroke="#653a96" strokeWidth="1.5"/>
                        </svg>
                      </div>
                      <span className="text-[#653a96]" style={{
                        fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '17px',
                        display: 'block',
                        textAlign: 'left'
                      }}
                      dangerouslySetInnerHTML={{ __html: 'Avail Tax Benefits <br /> u/s 80G with your donations' }}
                      >
                      </span>
                    </div>

                    {/* FCRA Section */}
                    <div className="flex flex-row items-start gap-3 pt-1">
                      <div className="relative flex-shrink-0" style={{ width: '36px', height: '36px' }}>
                        <svg width="36" height="36" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                          <path d="M13.5526 32.7499H31.6789M15.6851 22.0873V32.7499M19.9501 22.0873V32.7499M25.2814 22.0873V32.7499M29.5464 22.0873V32.7499M32.7452 22.0873H12.4863L21.8338 15.9457C22.0606 15.7794 22.3345 15.6897 22.6158 15.6897C22.897 15.6897 23.1709 15.7794 23.3977 15.9457L32.7452 22.0873Z" stroke="#653a96" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M7.84856 30.0446C5.58965 28.5322 3.75333 26.4693 2.51287 24.0504C1.27241 21.6315 0.668727 18.9364 0.758784 16.2195C0.84884 13.5026 1.62967 10.8534 3.02758 8.52195C4.4255 6.19051 6.3944 4.25369 8.74849 2.89427C11.1026 1.53484 13.7642 0.797642 16.4823 0.752233C19.2003 0.706824 21.8851 1.3547 24.2833 2.63473C26.6815 3.91476 28.714 5.78473 30.189 8.06817C31.664 10.3516 32.5329 12.9732 32.7136 15.6856" stroke="#653a96" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M9.42307 18.8787C9.2148 16.066 9.32545 13.2388 9.7529 10.451C10.1365 7.18961 11.2089 4.047 12.8991 1.23145M0.794922 15.6899H9.28943M3.22172 8.22609H30.2847M2.09007 23.1537H8.22317M20.6074 1.23145C22.455 4.35462 23.5782 7.85256 23.8943 11.4675" stroke="#653a96" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="text-[#653a96]" style={{
                        fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '17px',
                        display: 'block',
                        textAlign: 'left'
                      }}
                      dangerouslySetInnerHTML={{ __html: 'Open to FCRA-Approved <br /> International Donations' }}
                      >
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section: Copyright (left) + Legal Links (right) */}
            <div className="flex flex-row items-center justify-between pt-3">
              {/* Left Side: Copyright */}
              <div className="flex items-center space-x-2 text-sm ml-3 text-[#653a96]"
                style={{
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '19.36px'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.03 7C9.25 7 7 9.25 7 12.03C7 14.81 9.25 17.06 12.03 17.06C13.58 17.06 14.97 16.35 15.92 15.22L14.36 13.98C13.83 14.62 12.99 15.03 12.03 15.03C10.42 15.03 9.16 13.77 9.16 12.16C9.16 10.55 10.42 9.29 12.03 9.29C12.98 9.29 13.82 9.72 14.35 10.35L15.91 9.12C14.96 7.98 13.58 7.27 12.03 7Z" fill="#653a96"/>
                </svg>
                <span>ABWCI {currentYear} . All Rights Reserved</span>
              </div>

              {/* Right Side: Legal Links */}
              <div className="flex space-x-6 gap-11 mr-20">
                <button 
                  onClick={() => handleLegalClick('termsAndConditions')}
                  className="text-[#653a96] hover:text-[#4a2470] transition-colors duration-200 text-sm cursor-pointer"
                  style={{
                    fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                    fontWeight: 600,
                    fontSize: '14px',
                    lineHeight: '17px'
                  }}
                >
                  {t('footer.terms')}
                </button>
                <button 
                  onClick={() => handleLegalClick('privacyPolicy')}
                  className="text-[#653a96] hover:text-[#4a2470] transition-colors duration-200 text-sm cursor-pointer"
                  style={{
                    fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                    fontWeight: 600,
                    fontSize: '14px',
                    lineHeight: '17px'
                  }}
                >
                  {t('footer.privacy')}
                </button>
                <button 
                  onClick={() => handleLegalClick('compliancePolicy')}
                  className="text-[#653a96] hover:text-[#4a2470] transition-colors duration-200 text-sm cursor-pointer"
                  style={{
                    fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                    fontWeight: 600,
                    fontSize: '14px',
                    lineHeight: '17px'
                  }}
                >
                  {t('footer.compliance')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Version */}
        <div className="lg:hidden px-4 py-6">
          {/* Logo Section - Top Center */}
          <div className="flex justify-center mb-10">
            <Image
              src="/abwci-newlogo.svg"
              alt="ABWCI Footer Logo"
              width={320}
              height={121}
              className="w-44 h-22 object-contain"
              quality={100}
              priority
            />
          </div>

          {/* Navigation Links - Two Columns */}
          <div className="flex flex-row justify-between gap-8 mb-6">
            {/* Left Column: Knowledge Hub + Opportunities */}
            <div className="flex flex-col gap-4">
              {/* Knowledge Hub Section */}
              <div className="flex flex-col">
                <h3 className="text-base font-bold text-[#653a96] normal-case mb-1">
                  Knowledge Hub
                </h3>
                <div className="flex flex-col">
                  {knowledgeHubLinks.map((link, linkIndex) => (
                    <Link
                      key={linkIndex}
                      href={link.href}
                      className="text-[#653a96] hover:text-[#4a2470] transition-colors duration-200 text-sm leading-6"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Opportunities Section */}
              <div className="flex flex-col">
                <h3 className="text-base font-bold text-[#653a96] normal-case mb-1">
                  Opportunities
                </h3>
                <div className="flex flex-col">
                  {opportunitiesLinks.map((link, linkIndex) => (
                    <Link
                      key={linkIndex}
                      href={link.href}
                      className="text-[#653a96] hover:text-[#4a2470] transition-colors duration-200 text-sm leading-6"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Company */}
            <div className="flex flex-col">
              <h3 className="text-base font-bold text-[#653a96] normal-case mb-1">
                {t('footer.company')}
              </h3>
              <div className="flex flex-col">
                {companyLinks.map((link, linkIndex) => (
                  <Link
                    key={linkIndex}
                    href={link.href}
                    className="text-[#653a96] hover:text-[#4a2470] transition-colors duration-200 text-sm leading-6"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Section - Horizontal Row */}
          <div className="flex flex-row justify-center items-center gap-6 mb-6">
            <Link href="https://wa.me/9810485280" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <Image
                src="/assets/ic_baseline-whatsapp.png"
                alt="WhatsApp"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <span className="text-[#653a96] font-medium text-sm">
                {t('footer.whatsappUs')}
              </span>
            </Link>
            <button onClick={handleCopyPhoneNumber} className="flex items-center gap-2 bg-transparent border-none p-0 cursor-pointer">
              <Image
                src="/assets/material-symbols_call.svg"
                alt="Call"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <span className="text-[#653a96] font-medium text-sm">
                {t('footer.callUs')}
              </span>
            </button>
            <Link href="mailto:info@abwci.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <Image
                src="/assets/material-symbols_mail.svg"
                alt="Mail"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <span className="text-[#653a96] font-medium text-sm">
                {t('footer.mailUs')}
              </span>
            </Link>
          </div>

          {/* Address with Globe Icon */}
          <div className="flex flex-row items-start justify-center gap-3 mb-10 mt-4">
            <svg width="24" height="24" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mt-4">
              <path d="M13 0C5.85 0 0 5.85 0 13C0 20.15 5.85 26 13 26C20.15 26 26 20.15 26 13C26 5.85 20.15 0 13 0ZM21.45 8.6125C22.1 8.6125 22.5875 9.1 23.2375 9.1C22.75 9.75 20.6375 9.75 19.9875 8.9375C20.475 8.775 20.8 8.6125 21.45 8.6125ZM1.625 13C1.625 12.35 1.625 11.7 1.7875 10.8875C1.95 10.8875 2.1125 11.05 2.275 11.05C2.275 11.05 2.4375 11.2125 2.4375 11.375C2.4375 11.8625 2.925 12.1875 3.25 12.1875C4.55 12.35 5.0375 13.4875 6.175 13.8125C6.5 13.975 6.3375 14.3 6.175 14.625C5.2 15.925 6.0125 16.9 6.825 17.7125C7.6375 18.3625 7.6375 19.0125 7.8 19.9875C7.8 21.125 7.9625 22.425 8.45 23.5625C4.3875 21.6125 1.625 17.7125 1.625 13ZM13 24.375C11.8625 24.375 10.5625 24.2125 9.5875 23.8875C9.425 23.5625 9.425 23.2375 9.5875 22.9125C10.2375 21.6125 10.8875 20.475 11.7 19.3375C12.025 19.0125 12.35 18.6875 12.35 18.2C12.35 17.875 12.5125 17.3875 12.675 17.0625C13.1625 16.25 13 15.7625 12.35 15.6C11.05 15.275 10.4 14.1375 9.425 13.65C8.45 13.1625 7.475 12.8375 6.6625 13.325C6.3375 13.4875 5.85 13.65 5.85 13.1625C5.85 12.5125 5.0375 12.025 5.2 11.375C5.0375 11.375 4.875 11.375 4.7125 11.5375C4.55 11.7 4.3875 11.8625 4.0625 11.7C3.7375 11.375 3.9 11.05 3.9 10.725C4.0625 10.4 4.225 10.2375 4.55 10.075C5.2 9.9125 5.85 9.9125 6.175 10.725C6.6625 9.2625 7.6375 8.45 8.6125 7.8C8.6125 7.8 9.9125 6.6625 10.075 6.6625C10.2375 6.6625 10.4 6.9875 10.725 7.15C11.05 7.15 11.2125 7.15 11.2125 6.825C11.375 6.0125 10.8875 5.0375 10.2375 4.875C10.2375 4.7125 10.4 4.7125 10.4 4.7125C10.8875 4.55 11.5375 4.225 11.375 3.7375C11.375 3.0875 10.725 2.7625 10.075 2.7625C9.75 2.7625 9.425 2.7625 9.1 2.925C8.45 3.25 7.6375 3.575 6.6625 3.575C8.45 2.275 10.725 1.625 13 1.625H14.3C13.325 1.7875 12.35 2.1125 11.7 2.4375C12.675 2.6 12.8375 3.0875 12.5125 3.9C12.35 4.225 12.5125 4.55 12.8375 4.7125C13.1625 4.875 13.4875 4.875 13.65 4.55C13.975 4.0625 14.625 3.9 15.1125 3.7375C15.7625 3.575 16.25 3.25 16.7375 2.6C16.7375 2.4375 16.9 2.4375 17.0625 2.275C18.0375 2.6 19.0125 3.25 19.9875 3.9C19.825 3.9 19.825 4.0625 19.6625 4.0625C19.3375 4.3875 18.85 4.55 19.3375 5.2C19.5 5.525 19.3375 5.6875 19.175 5.85C18.85 6.0125 18.6875 5.85 18.525 5.6875C18.3625 5.525 18.3625 5.2 17.875 5.2C17.7125 5.525 17.225 5.6875 17.225 6.175C18.0375 6.175 17.875 6.825 18.0375 7.3125C17.0625 7.475 16.7375 7.9625 17.225 8.775C17.3875 9.1 17.0625 9.2625 16.9 9.425C16.25 10.4 15.6 11.05 15.6 12.1875C15.6 13.325 16.4125 14.4625 17.7125 14.3C19.175 14.1375 19.175 14.1375 19.6625 15.4375C19.6625 15.6 19.825 15.7625 19.825 15.925C19.9875 16.25 20.15 16.575 19.9875 16.9C19.5 18.2 20.15 19.175 20.6375 20.15C20.8 20.475 20.9625 20.6375 21.125 20.8C19.0125 23.075 16.25 24.375 13 24.375Z" fill="#653A96"/>
            </svg>
            <div className="text-[#653a96] text-sm font-medium">
              <span className="font-semibold">Global Secretariat,</span><br/>
              Building No. 30, Vasant Vihar,<br/>
              New Delhi, India - 110057
            </div>
          </div>

          {/* Social Media Icons */}
          <div className="flex flex-row justify-center items-center gap-6 mb-6">
            {socialLinks.map((social, index) => (
              <Link
                key={index}
                href={social.href}
                className="text-[#653a96] hover:text-[#4a2470] transition-colors duration-200"
                aria-label={social.name}
              >
                <div style={{ width: '26px', height: '26px' }}>
                  {social.svg}
                </div>
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <div className="flex flex-row justify-center items-center gap-2 mb-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.03 7C9.25 7 7 9.25 7 12.03C7 14.81 9.25 17.06 12.03 17.06C13.58 17.06 14.97 16.35 15.92 15.22L14.36 13.98C13.83 14.62 12.99 15.03 12.03 15.03C10.42 15.03 9.16 13.77 9.16 12.16C9.16 10.55 10.42 9.29 12.03 9.29C12.98 9.29 13.82 9.72 14.35 10.35L15.91 9.12C14.96 7.98 13.58 7.27 12.03 7Z" fill="#653a96"/>
            </svg>
            <span className="text-[#653a96] text-sm font-medium">
              ABWCI {currentYear} . All Rights Reserved
            </span>
          </div>

          {/* Terms Links - Bottom */}
          <div className="flex flex-row justify-center items-center gap-4">
            <button 
              onClick={() => handleLegalClick('termsAndConditions')}
              className="text-[#653a96] underline hover:text-[#4a2470] transition-colors duration-200 cursor-pointer text-sm font-medium"
              style={
                {
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '17px'
                }
              }
            >
              {t('footer.terms')}
            </button>
            <button 
              onClick={() => handleLegalClick('privacyPolicy')}
              className="text-[#653a96] underline hover:text-[#4a2470] transition-colors duration-200 cursor-pointer text-sm font-medium"
              style={
                {fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '17px'}
              }
            >
              {t('footer.privacy')}
            </button>
            <button 
              onClick={() => handleLegalClick('compliancePolicy')}
              className="text-[#653a96] underline hover:text-[#4a2470] transition-colors duration-200 cursor-pointer text-sm font-medium"
              style={
                {fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '17px'}
              }
            >
              {t('footer.compliance')}
            </button>
          </div>
        </div>
      </div>

      {/* Legal Terms Modal */}
      {isLegalModalOpen && selectedLegalContent && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center px-4"
          onClick={closeLegalModal}
        >
          <div 
            className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeLegalModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-900 hover:bg-red-100 hover:text-red-600 transition-all duration-200 shadow-lg"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-8 md:p-12" style={{
              scrollbarWidth: 'none', /* Firefox */
              msOverflowStyle: 'none'  /* IE and Edge */
            }}>
              {/* Title */}
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6" style={{
                fontFamily: 'DM Serif Display, serif',
                fontWeight: 500
              }}>
                {selectedLegalContent.title}
              </h2>

              {/* Content */}
              <div className="space-y-6">
                <style jsx>{`
                  div::-webkit-scrollbar {
                    display: none; /* Chrome, Safari and Opera */
                  }
                `}</style>
                {selectedLegalContent.content.map((section, index) => (
                  <div key={index}>
                    {section.heading && (
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6" style={{
                        fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                        fontWeight: 600
                      }}>
                        {section.heading}
                      </h3>
                    )}
                    
                    {section.text && (
                      <p 
                        className="text-gray-700 leading-relaxed mb-3" 
                        style={{
                          fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                          fontSize: '16px',
                          lineHeight: '24px'
                        }}
                        dangerouslySetInnerHTML={{ __html: section.text }}
                      />
                    )}
                    
                    {section.points && (
                      <ul className="space-y-2 ml-4 mb-4">
                        {section.points.map((point, pointIndex) => (
                          <li key={pointIndex} className="text-gray-700 leading-relaxed flex" style={{
                            fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                            fontSize: '15px',
                            lineHeight: '22px'
                          }}>
                            <span className="text-[#653a96] mr-3">•</span>
                            <span dangerouslySetInnerHTML={{ __html: point }} />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
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
    </footer>
  );
};

export default Footer;