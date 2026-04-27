import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../lib/LanguageContext';
import ExpandedNav from './ExpandedNav';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [showExpandedNav, setShowExpandedNav] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [languageSearch, setLanguageSearch] = useState('');
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    aboutUs: true,
    leadership: false,
    opportunities: false,
    knowledgeHub: false,
  });
  const languageDropdownRef = useRef(null);
  
  const { currentLanguage, changeLanguage, t } = useLanguage();

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error parsing user data:', error);
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    checkAuth();
    
    // Listen for storage changes (e.g., login/logout in another tab)
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  // Language options
  const languages = [
    { code: 'en', name: t('languages.en'), flag: '🇺🇸' },
    { code: 'es', name: t('languages.es'), flag: '🇪🇸' },
    { code: 'fr', name: t('languages.fr'), flag: '🇫🇷' },
    { code: 'de', name: t('languages.de'), flag: '🇩🇪' },
    { code: 'it', name: t('languages.it'), flag: '🇮🇹' },
    { code: 'pt', name: t('languages.pt'), flag: '🇵🇹' },
    { code: 'ar', name: t('languages.ar'), flag: '🇸🇦' },
    { code: 'hi', name: t('languages.hi'), flag: '🇮🇳' },
    { code: 'zh', name: t('languages.zh'), flag: '🇨🇳' },
    { code: 'ja', name: t('languages.ja'), flag: '🇯🇵' },
    { code: 'ur', name: t('languages.ur') || 'Urdu', flag: '🇵🇰' },
    { code: 'bn', name: t('languages.bn') || 'বাংলা', flag: '🇧🇩' },
    { code: 'ne', name: t('languages.ne') || 'नेपाली', flag: '🇳🇵' },
    { code: 'si', name: t('languages.si') || 'සිංහල', flag: '🇱🇰' },
    { code: 'ta', name: t('languages.ta') || 'தமிழ்', flag: '🇮🇳' },
    { code: 'vi', name: t('languages.vi') || 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'th', name: t('languages.th') || 'ไทย', flag: '🇹🇭' },
    { code: 'fil', name: t('languages.fil') || 'Filipino', flag: '🇵🇭' },
    { code: 'ms', name: t('languages.ms') || 'Bahasa Melayu', flag: '🇲🇾' },
    { code: 'sw', name: t('languages.sw') || 'Kiswahili', flag: '🇰🇪' },
    { code: 'ka', name: t('languages.ka') || 'ქართული', flag: '🇬🇪' },
    { code: 'ky', name: t('languages.ky') || 'Кыргызча', flag: '🇰🇬' },
    { code: 'lv', name: t('languages.lv') || 'Latviešu', flag: '🇱🇻' },
    { code: 'hu', name: t('languages.hu') || 'Magyar', flag: '🇭🇺' },
    { code: 'pl', name: t('languages.pl') || 'Polski', flag: '🇵🇱' },
    { code: 'nb', name: t('languages.nb') || 'Norsk', flag: '🇳🇴' },
    { code: 'my', name: t('languages.my') || 'မြန်မာ', flag: '🇲🇲' }
    ,{ code: 'ha', name: t('languages.ha') || 'Hausa', flag: '🇳🇬' }
    ,{ code: 'yo', name: t('languages.yo') || 'Yorùbá', flag: '🇳🇬' }
    ,{ code: 'ig', name: t('languages.ig') || 'Igbo', flag: '🇳🇬' }
    ,{ code: 'pcm', name: t('languages.pcm') || 'Naija Pidgin', flag: '🇳🇬' }
  ];

  const filteredLanguages = languages.filter((language) => {
    const query = languageSearch.trim().toLowerCase();
    if (!query) return true;
    return (
      language.code.toLowerCase().includes(query) ||
      (language.name || '').toString().toLowerCase().includes(query)
    );
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Keep dropdown open when clicking inside language dropdown/search
      if (languageDropdownRef.current && languageDropdownRef.current.contains(event.target)) {
        return;
      }
      if (activeDropdown !== null) {
        setActiveDropdown(null);
      }
      if (isLanguageOpen) {
        setIsLanguageOpen(false);
        setLanguageSearch(''); // Clear search when closing
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [activeDropdown, isLanguageOpen]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  // Handle language change
  const handleLanguageChange = (languageCode) => {
    setIsLanguageOpen(false);
    setLanguageSearch(''); // Clear search when language is changed
    changeLanguage(languageCode);
    console.log('Language changed to:', languageCode);
  };

  // Handle hover with delay to prevent rapid toggling
  const handleMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setActiveDropdown(null);
    setShowExpandedNav(true);
  };

  const handleMouseLeave = () => {
    // Clear any existing timeout
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    // Small delay to allow moving mouse from navbar to expanded nav
    const timeout = setTimeout(() => {
      setShowExpandedNav(false);
      setHoverTimeout(null);
    }, 300); // Reduced delay for smoother experience
    setHoverTimeout(timeout);
  };

  // Toggle collapsible sections in mobile menu
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Collapsible Section Component for Mobile Menu
  const CollapsibleSection = ({ title, sectionKey, children, hasSubItems = true }) => {
    const isExpanded = expandedSections[sectionKey];
    return (
      <div className="border-b border-gray-200">
        <button
          onClick={() => hasSubItems && toggleSection(sectionKey)}
          className="w-full flex items-center justify-between py-3 px-4 text-left"
        >
          <span className="text-base font-bold text-gray-800 uppercase">{title}</span>
          {hasSubItems && (
            <svg 
              className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </button>
        {hasSubItems && isExpanded && (
          <div className="bg-gray-50">
            {children}
          </div>
        )}
      </div>
    );
  };

  // Menu Item Component for Mobile Menu
  const MenuItem = ({ href, children, onClick }) => (
    <Link 
      href={href} 
      className="block py-2 px-6 text-sm text-gray-700 hover:text-[#653a96] hover:bg-gray-100 transition-colors border-b border-gray-100"
      onClick={onClick}
    >
      {children}
    </Link>
  );

  const navItems = [
    {
      label: t('navbar.aboutUs'),
      href: '/about',
      dropdown: [
        { label: t('expandedNav.aboutUs'), href: '/about' },
        { label: t('expandedNav.globalSecretariat'), href: '/about/global-secretariat' },
        { label: t('expandedNav.partnerships'), href: '/about/partnerships' },
        { label: t('expandedNav.successStories'), href: '/about/success-stories' }
      ]
    },
    {
      label: t('navbar.knowledgeHub'),
      href: '/knowledge',
      dropdown: [
        { label: t('expandedNav.blogs'), href: '/knowledge/blog' },
        { label: t('expandedNav.resources'), href: '/knowledge/resources' }
      ]
    },
    {
      label: t('navbar.opportunities'),
      href: '/opportunities',
      dropdown: [
        { label: t('expandedNav.mentorship'), href: '/opportunities/mentorship' },
        { label: t('expandedNav.aiPlatform'), href: '/opportunities/ai-platform' },
        { label: t('expandedNav.tenders'), href: '/opportunities/tenders' }
      ]
    },
    {
      label: t('navbar.leadership'),
      href: '/leadership',
      dropdown: [
        { label: t('expandedNav.allLeaderships'), href: '/leadership' },
        { label: t('expandedNav.globalAmbassadors'), href: '/leadership/category/global-ambassadors' },
        { label: t('expandedNav.regionalPresidents'), href: '/leadership/category/regional-presidents' },
        { label: t('expandedNav.statePresidents'), href: '/leadership/category/state-presidents' },
        { label: t('expandedNav.globalSecretariat'), href: '/leadership/category/global-secretariat' }
      ]
    },
    {
      label: t('navbar.global'),
      href: '/global-presence',
      dropdown: [
        { label: t('expandedNav.africa'), href: '/global-presence?region=africa' },
        { label: t('expandedNav.asia'), href: '/global-presence?region=asia' },
        { label: t('expandedNav.europe'), href: '/global-presence?region=europe' },
        { label: t('expandedNav.northAmerica'), href: '/global-presence?region=north-america' },
        { label: t('expandedNav.southAmerica'), href: '/global-presence?region=south-america' }
      ]
    }
  ];

  return (
    <nav className="relative z-50 group">
      {/* Main Navbar - Purple by default, transforms smoothly when ExpandedNav is showing */}
      <div className={`bg-[#4f287b] text-white transition-opacity duration-300 ease-out pb-1 ${showExpandedNav ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="max-w-7xl mx-auto px-0 sm:px-1 md:px-2 lg:px-4">
        <div className="flex justify-between items-center h-12 sm:h-14 md:h-16 lg:h-16">
          {/* Mobile Layout - Hamburger Left, Logo Center, Square Icon Right */}
          <div className="flex items-center justify-between w-full md:hidden relative">
            {/* Hamburger Menu - Left */}
            <div className="flex items-center ml-2 flex-shrink-0 z-10">
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white focus:outline-none p-2.5"
              >
                <svg className="h-7 w-7 sm:h-8 sm:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

            {/* Logo - Center */}
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center z-10">
              <Link href="/" className="flex items-center">
                <div className="relative flex items-center">
                  <Image
                    src="/assets/footer-new.png"
                    alt="ABWCI Logo"
                    width={180}
                    height={108}
                    quality={100}
                    className="w-24 h-14 sm:w-28 sm:h-16"
                    priority
                    style={{
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2)) brightness(1.1)',
                    }}
                  />
                </div>
              </Link>
            </div>

            {/* Language Button - Right */}
            <div className="flex items-center mr-2 flex-shrink-0 z-10">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLanguageOpen(!isLanguageOpen);
                }}
                className="flex items-center text-white focus:outline-none px-3 py-2"
              >
                <span className="text-sm sm:text-base font-medium mr-1.5">
                  {currentLanguage.toUpperCase()}
                </span>
                <svg className="w-5 h-5 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Language Dropdown - Mobile */}
              {isLanguageOpen && (
                <div
                  ref={languageDropdownRef}
                  className="absolute top-full right-2 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
                    <input
                      type="text"
                      value={languageSearch}
                      onChange={(e) => setLanguageSearch(e.target.value)}
                      placeholder="Search language"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#653a96] focus:border-transparent text-gray-800 placeholder-gray-400"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="py-2 max-h-64 overflow-y-auto">
                    {filteredLanguages.length === 0 && (
                      <div className="px-4 py-2 text-sm text-gray-500">No results</div>
                    )}
                    {filteredLanguages.map((language) => (
                      <button
                        type="button"
                        key={language.code}
                        onClick={() => handleLanguageChange(language.code)}
                        className={`w-full px-4 py-2 text-left transition-colors duration-200 flex items-center ${
                          currentLanguage === language.code ? 'bg-[#653a96] text-white' : 'text-gray-700'
                        }`}
                        style={{
                          fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                          fontWeight: currentLanguage === language.code ? 600 : 400,
                          fontSize: '14px',
                          lineHeight: '17px'
                        }}
                      >
                        <span className="mr-3 text-lg">{language.flag}</span>
                        <span className="mr-2 font-mono text-xs">{language.code}</span>
                        <span>{language.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Layout - Logo */}
          <div className="hidden md:flex items-center ml-1 sm:ml-2 md:ml-3 lg:ml-4 flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="relative flex items-center">
                <Image
                  src="/assets/footer-new.png"
                  alt="ABWCI Logo"
                  width={100}
                  height={60}
                  quality={100}
                  className="w-12 h-8 sm:w-16 sm:h-10 md:w-20 md:h-12 lg:w-28 lg:h-17"
                    priority
                  />
              </div>
            </Link>
          </div>

            {/* Desktop Navigation - Hidden on mobile */}
            <div 
              className={`hidden md:flex items-center justify-center flex-1 px-2 lg:px-4 text-white transition-colors duration-300`}
            >
              <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 lg:space-x-4 xl:space-x-6">
                {navItems.map((item, index) => (
                  <div 
                    key={index} 
                    className="relative navbar-item group"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className={`text-white px-1 sm:px-2 lg:px-3 py-2 text-xs sm:text-sm lg:text-sm transition-colors duration-200 flex items-center whitespace-nowrap`}
                        style={{
                          fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                          fontWeight: 500,
                          fontSize: 'clamp(8px, 1vw, 14px)',
                          lineHeight: 'clamp(10px, 1.2vw, 17px)',
                          WebkitFontSmoothing: 'antialiased',
                          MozOsxFontSmoothing: 'grayscale',
                          textRendering: 'optimizeLegibility'
                        }}
                    >
                      {item.label}
                      {item.dropdown && (
                        <svg className="ml-1 h-2 w-2 sm:h-3 sm:w-3 lg:h-4 lg:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

                {/* Right Section - Login/Register or User Name and Language Button - Hidden on mobile */}
                <div className="hidden md:flex items-center">
                  {/* Login/Register or User Name */}
                  {isAuthenticated && user ? (
                    <div
                      className={`text-white px-3 py-2 text-sm transition-colors duration-200 flex items-center cursor-pointer`}
                      style={{
                        fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                        fontWeight: 500,
                        fontSize: '14px',
                        lineHeight: '17px',
                        WebkitFontSmoothing: 'antialiased',
                        MozOsxFontSmoothing: 'grayscale',
                        textRendering: 'optimizeLegibility'
                      }}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <Image src="/assets/login.png" alt="User" width={24} height={24} className='mr-2'/>
                      {user.firstName || user.username}
                    </div>
                  ) : (
                    <Link
                      href="/auth/login"
                      className={`text-white px-3 py-2 text-sm transition-colors duration-200 flex items-center`}
                      style={{
                        fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                        fontWeight: 500,
                        fontSize: '14px',
                        lineHeight: '17px',
                        WebkitFontSmoothing: 'antialiased',
                        MozOsxFontSmoothing: 'grayscale',
                        textRendering: 'optimizeLegibility'
                      }}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <Image src="/assets/login.png" alt="Login" width={24} height={24} className='mr-2'/>
                      {t('navbar.loginRegister')}
                    </Link>
                  )}

                  {/* Language Button - Fixed position with consistent spacing */}
                  <div className="ml-6">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsLanguageOpen(!isLanguageOpen);
                        }}
                        onMouseEnter={() => {
                          if (hoverTimeout) {
                            clearTimeout(hoverTimeout);
                            setHoverTimeout(null);
                          }
                          setActiveDropdown(null);
                          setShowExpandedNav(false);
                        }}
                        className="flex items-center hover:text-gray-200 transition-colors duration-200 px-3 py-2 text-white text-sm w-[60px] justify-center"
                      >
                        <span
                          className="mr-1 w-[20px] text-center font-mono"
                          style={{
                            fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                            fontWeight: 500,
                            fontSize: '14px',
                            lineHeight: '17px',
                            WebkitFontSmoothing: 'antialiased',
                            MozOsxFontSmoothing: 'grayscale',
                            textRendering: 'optimizeLegibility'
                          }}
                        >
                          {currentLanguage.toUpperCase()}
                        </span>
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Language Dropdown */}
                      {isLanguageOpen && (
                        <div
                          ref={languageDropdownRef}
                          className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
                            <input
                              type="text"
                              value={languageSearch}
                              onChange={(e) => setLanguageSearch(e.target.value)}
                              placeholder="Search language"
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#653a96] focus:border-transparent text-gray-800 placeholder-gray-400"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                          <div className="py-2 max-h-64 overflow-y-auto">
                            {filteredLanguages.length === 0 && (
                              <div className="px-4 py-2 text-sm text-gray-500">No results</div>
                            )}
                            {filteredLanguages.map((language) => (
                              <button
                                type="button"
                                key={language.code}
                                onClick={() => handleLanguageChange(language.code)}
                                className={`w-full px-4 py-2 text-left transition-colors duration-200 flex items-center ${
                                  currentLanguage === language.code ? 'bg-[#653a96] text-white' : 'text-gray-700'
                                }`}
                                style={{
                                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                                  fontWeight: currentLanguage === language.code ? 600 : 400,
                                  fontSize: '14px',
                                  lineHeight: '17px'
                                }}
                              >
                                <span className="mr-3 text-lg">{language.flag}</span>
                                <span className="mr-2 font-mono text-xs">{language.code}</span>
                                <span>{language.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        
        {/* Mobile Menu - Vertical List Layout with Collapsible Sections */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg border-t border-gray-200 fixed inset-0 z-50 overflow-y-auto">
            {/* Mobile Menu Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
              <div className="flex items-center justify-between px-4 py-3">
                {/* Close Button - Left */}
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-700 focus:outline-none p-2"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                {/* Logo - Center */}
                <div className="absolute left-1/2 transform -translate-x-1/2">
                  <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center">
                    <div className="relative flex items-center">
                      <Image
                        src="/assets/footer-new.png"
                        alt="ABWCI Logo"
                        width={180}
                        height={108}
                        quality={100}
                        className="h-12 sm:h-14 w-auto"
                        priority
                        style={{
                          objectFit: 'contain',
                          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15))',
                        }}
                      />
                    </div>
                  </Link>
                </div>

                {/* Language Button - Right */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsLanguageOpen(!isLanguageOpen);
                    }}
                    className="flex items-center text-gray-700 focus:outline-none px-2 py-1"
                  >
                    <span className="text-sm font-medium mr-1">
                      {currentLanguage.toUpperCase()}
                    </span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Language Dropdown - Mobile Menu */}
                  {isLanguageOpen && (
                    <div
                      ref={languageDropdownRef}
                      className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
                        <input
                          type="text"
                          value={languageSearch}
                          onChange={(e) => setLanguageSearch(e.target.value)}
                          placeholder="Search language"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#653a96] focus:border-transparent text-gray-800 placeholder-gray-400"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="py-2 max-h-64 overflow-y-auto">
                        {filteredLanguages.length === 0 && (
                          <div className="px-4 py-2 text-sm text-gray-500">No results</div>
                        )}
                        {filteredLanguages.map((language) => (
                          <button
                            type="button"
                            key={language.code}
                            onClick={() => handleLanguageChange(language.code)}
                            className={`w-full px-4 py-2 text-left transition-colors duration-200 flex items-center ${
                              currentLanguage === language.code ? 'bg-[#653a96] text-white' : 'text-gray-700'
                            }`}
                            style={{
                              fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                              fontWeight: currentLanguage === language.code ? 600 : 400,
                              fontSize: '14px',
                              lineHeight: '17px'
                            }}
                          >
                            <span className="mr-3 text-lg">{language.flag}</span>
                            <span className="mr-2 font-mono text-xs">{language.code}</span>
                            <span>{language.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation Menu Content */}
            <div className="bg-white">
              {/* About Us Section - Expanded by default */}
              <CollapsibleSection title={t('navbar.aboutUs')} sectionKey="aboutUs">
                <MenuItem href="/about" onClick={() => setIsMenuOpen(false)}>
                  {t('expandedNav.aboutUs')}
                </MenuItem>
                <MenuItem href="/about/success-stories" onClick={() => setIsMenuOpen(false)}>
                  {t('expandedNav.successStories')}
                </MenuItem>
                <MenuItem href="/about/partnerships" onClick={() => setIsMenuOpen(false)}>
                  {t('expandedNav.partnerships')}
                </MenuItem>
                <MenuItem href="/support" onClick={() => setIsMenuOpen(false)}>
                  FAQ
                </MenuItem>
              </CollapsibleSection>

              {/* Leadership Section - Collapsible */}
              <CollapsibleSection title={t('navbar.leadership')} sectionKey="leadership">
                <MenuItem href="/leadership" onClick={() => setIsMenuOpen(false)}>
                  {t('expandedNav.allLeaderships')}
                </MenuItem>
                <MenuItem href="/leadership/category/global-ambassadors" onClick={() => setIsMenuOpen(false)}>
                  {t('expandedNav.globalAmbassadors')}
                </MenuItem>
                <MenuItem href="/leadership/category/regional-presidents" onClick={() => setIsMenuOpen(false)}>
                  {t('expandedNav.regionalPresidents')}
                </MenuItem>
                <MenuItem href="/leadership/category/state-presidents" onClick={() => setIsMenuOpen(false)}>
                  {t('expandedNav.statePresidents')}
                </MenuItem>
                <MenuItem href="/leadership/category/global-secretariat" onClick={() => setIsMenuOpen(false)}>
                  {t('expandedNav.globalSecretariat')}
                </MenuItem>
              </CollapsibleSection>

              {/* Opportunities Section - Collapsible */}
              <CollapsibleSection title={t('navbar.opportunities')} sectionKey="opportunities">
                <MenuItem href="/opportunities/mentorship" onClick={() => setIsMenuOpen(false)}>
                  {t('expandedNav.mentorship')}
                </MenuItem>
                <MenuItem href="/opportunities/ai-platform" onClick={() => setIsMenuOpen(false)}>
                  {t('expandedNav.aiPlatform')}
                </MenuItem>
                <MenuItem href="/opportunities/tenders" onClick={() => setIsMenuOpen(false)}>
                  {t('expandedNav.tenders')}
                </MenuItem>
              </CollapsibleSection>

              {/* Knowledge Hub Section - Collapsible */}
              <CollapsibleSection title={t('navbar.knowledgeHub')} sectionKey="knowledgeHub">
                <MenuItem href="/knowledge/blog" onClick={() => setIsMenuOpen(false)}>
                  {t('expandedNav.blogs')}
                </MenuItem>
                <MenuItem href="/knowledge/resources" onClick={() => setIsMenuOpen(false)}>
                  {t('expandedNav.resources')}
                </MenuItem>
              </CollapsibleSection>

              {/* Global Presence - Direct Link */}
              <div className="border-b border-gray-200">
                <Link 
                  href="/global-presence" 
                  className="block py-3 px-4 text-base font-bold text-gray-800 uppercase hover:text-[#653a96] hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('navbar.global')}
                </Link>
              </div>

              {/* Support Section - Direct Link */}
              <div className="border-b border-gray-200">
                <Link 
                  href="/support" 
                  className="block py-3 px-4 text-base font-bold text-gray-800 uppercase hover:text-[#653a96] hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('expandedNav.support')}
                </Link>
              </div>

            </div>
          </div>
        )}
        
        {/* Expanded Navigation Section - Shows on hover/click, but not when language dropdown is open or language section is hovered */}
        <ExpandedNav 
          showExpandedNav={!isLanguageOpen && showExpandedNav} 
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      

      
    </nav>
  );
};

export default Navbar;