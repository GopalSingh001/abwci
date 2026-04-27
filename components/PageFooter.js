import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useLanguage } from '../lib/LanguageContext';
import legalTermsData from '../data/legal-terms.json';

const PageFooter = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [selectedLegalContent, setSelectedLegalContent] = useState(null);

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
    { name: 'Instagram', icon: '/assets/mdi_instagram_white.png', href: 'https://www.instagram.com/abwci.global/' },
    { name: 'LinkedIn', icon: '/assets/mdi_linkedin.png', href: 'https://www.linkedin.com/company/association-of-business-women-in-commerce-and-industry/about/' },
    { name: 'Twitter/X', icon: '/assets/mdi_twitter.png', href: 'https://twitter.com/abwci_global' },
    { name: 'Facebook', icon: '/assets/ic_baseline-facebook.png', href: 'https://www.facebook.com/profile.php?id=100089334037113' }
  ];

  return (
    <footer className="bg-gradient-to-r from-[#4f287b] via-[#653a96] to-[#391660] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Desktop Version */}
        <div className="hidden lg:block">
          <div className="flex flex-col space-y-8">
            {/* Top Section: Logo + 4 Columns */}
            <div className="flex flex-row items-start justify-between mr-12">
              {/* Logo Section */}
              <div className="flex flex-col items-start">
                <div className="mb-2">
                  <Image
                    src="/assets/footer-new.png"
                    alt="ABWCI Footer Logo"
                    width={100}
                    height={100}
                    quality={100}
                    priority
                    className="w-80 h-28 object-contain"
                  />
                </div>

                {/* Copyright */}
                <div className="flex items-center space-x-2 text-sm text-center justify-center items-center ml-3 mt-2"
                style={{
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '19.36px'
                }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.03 7C9.25 7 7 9.25 7 12.03C7 14.81 9.25 17.06 12.03 17.06C13.58 17.06 14.97 16.35 15.92 15.22L14.36 13.98C13.83 14.62 12.99 15.03 12.03 15.03C10.42 15.03 9.16 13.77 9.16 12.16C9.16 10.55 10.42 9.29 12.03 9.29C12.98 9.29 13.82 9.72 14.35 10.35L15.91 9.12C14.96 7.98 13.58 7.27 12.03 7Z" fill="white"/>
                  </svg>
                  <span>ABWCI {currentYear} . All Rights Reserved</span>
                </div>
              </div>

              {/* Right Side - Knowledge Hub + Opportunities (stacked), Company */}
              <div className="flex flex-col">
                <div className="flex space-x-16 items-start">
                  {/* Knowledge Hub and Opportunities Column (stacked) */}
                  <div className="flex flex-col space-y-8">
                    {/* Knowledge Hub Section */}
                    <div className="flex flex-col space-y-4">
                      <h3 className="text-lg font-bold text-white normal-case">Knowledge Hub</h3>
                      <div className="space-y-2">
                        {knowledgeHubLinks.map((link, linkIndex) => (
                          <Link
                            key={linkIndex}
                            href={link.href}
                            className="block text-white hover:text-gray-300 transition-colors duration-200 text-sm"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Opportunities Section */}
                    <div className="flex flex-col space-y-4">
                      <h3 className="text-lg font-bold text-white normal-case">Opportunities</h3>
                      <div className="space-y-2">
                        {opportunitiesLinks.map((link, linkIndex) => (
                          <Link
                            key={linkIndex}
                            href={link.href}
                            className="block text-white hover:text-gray-300 transition-colors duration-200 text-sm"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Company Section */}
                  <div className="flex flex-col space-y-4">
                    <h3 className="text-lg font-bold text-white normal-case">{t('footer.company')}</h3>
                    <div className="space-y-2">
                      {companyLinks.map((link, linkIndex) => (
                        <Link
                          key={linkIndex}
                          href={link.href}
                          className="block text-white hover:text-gray-300 transition-colors duration-200 text-sm"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Section: Social Media Icons and Legal Links on same row */}
            <div className="flex flex-row items-center justify-between pt-6 mt-4">
              {/* Social Media Icons - Left */}
              <div className="flex space-x-4 ml-5">
                {socialLinks.map((social, index) => (
                  <Link
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-gray-300 transition-colors duration-200"
                    aria-label={social.name}
                  >
                    <Image
                      src={social.icon}
                      alt={social.name}
                      width={32}
                      height={32}
                      className="w-8 h-8"
                    />
                  </Link>
                ))}
              </div>

              {/* Legal Links - Right */}
              <div className="flex space-x-4">
                <button onClick={() => handleLegalClick('termsAndConditions')} className="text-white underline hover:text-gray-300 transition-colors duration-200 text-sm cursor-pointer">
                  {t('footer.terms')}
                </button>
                <button onClick={() => handleLegalClick('privacyPolicy')} className="text-white underline hover:text-gray-300 transition-colors duration-200 text-sm cursor-pointer">
                  {t('footer.privacy')}
                </button>
                <button onClick={() => handleLegalClick('compliancePolicy')} className="text-white underline hover:text-gray-300 transition-colors duration-200 text-sm cursor-pointer">
                  {t('footer.compliance')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Version */}
        <div className="lg:hidden">
          {/* Mobile Logo Section */}
          <div className="text-center mb-3">
            <div className="mb-2">
              <Image
                src="/assets/footer-new.png"
                alt="ABWCI Footer Logo"
                width={100}
                height={100}
                className="w-48 h-14 object-contain mx-auto"
              />
            </div>

            {/* Copyright */}
            <div className="flex items-center justify-center space-x-2 text-sm mb-2 text-white font-medium">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.03 7C9.25 7 7 9.25 7 12.03C7 14.81 9.25 17.06 12.03 17.06C13.58 17.06 14.97 16.35 15.92 15.22L14.36 13.98C13.83 14.62 12.99 15.03 12.03 15.03C10.42 15.03 9.16 13.77 9.16 12.16C9.16 10.55 10.42 9.29 12.03 9.29C12.98 9.29 13.82 9.72 14.35 10.35L15.91 9.12C14.96 7.98 13.58 7.27 12.03 7Z" fill="white"/>
              </svg>
              <span>ABWCI {currentYear} . All Rights Reserved</span>
            </div>

            {/* Social Media Icons */}
            <div className="flex justify-center space-x-2 mb-4">
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-300 transition-colors duration-200"
                  aria-label={social.name}
                >
                  <Image
                    src={social.icon}
                    alt={social.name}
                    width={18}
                    height={18}
                    className="w-4 h-4"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Footer Sections - 2 Column Grid */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            {/* Column 1: Knowledge Hub + Opportunities + Contact (stacked) */}
            <div>
              {/* Knowledge Hub Section */}
              <div className="mb-3">
                <h3 className="text-sm font-bold text-white mb-1.5 normal-case">Knowledge Hub</h3>
                <div className="space-y-0.5">
                  {knowledgeHubLinks.map((link, linkIndex) => (
                    <Link
                      key={linkIndex}
                      href={link.href}
                      className="block text-white hover:text-gray-300 transition-colors duration-200 text-xs"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Opportunities Section */}
              <div className="mb-3">
                <h3 className="text-sm font-bold text-white mb-1.5 normal-case">Opportunities</h3>
                <div className="space-y-0.5">
                  {opportunitiesLinks.map((link, linkIndex) => (
                    <Link
                      key={linkIndex}
                      href={link.href}
                      className="block text-white hover:text-gray-300 transition-colors duration-200 text-xs"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 2: Company */}
            <div>
              {/* Company Section */}
              <div>
                <h3 className="text-sm font-bold text-white mb-1.5 normal-case">{t('footer.company')}</h3>
                <div className="space-y-0.5">
                  {companyLinks.map((link, linkIndex) => (
                    <Link
                      key={linkIndex}
                      href={link.href}
                      className="block text-white hover:text-gray-300 transition-colors duration-200 text-xs"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Terms Links */}
          <div className="text-left pt-2 pl-1 text-center">
            <div className="flex flex-wrap gap-4 justify-center items-center">
              <button onClick={() => handleLegalClick('termsAndConditions')} className="text-white underline hover:text-gray-300 transition-colors duration-200 text-xs cursor-pointer">
                {t('footer.terms')}
              </button>
              <button onClick={() => handleLegalClick('privacyPolicy')} className="text-white underline hover:text-gray-300 transition-colors duration-200 text-xs cursor-pointer">
                {t('footer.privacy')}
              </button>
              <button onClick={() => handleLegalClick('compliancePolicy')} className="text-white underline hover:text-gray-300 transition-colors duration-200 text-xs cursor-pointer">
                {t('footer.compliance')}
              </button>
            </div>
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
    </footer>
  );
};

export default PageFooter;
