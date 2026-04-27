import SimpleLayout from '../knowledge/components/SimpleLayout';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePostsByPage } from '../../lib/usePosts';
import { useLanguage } from '../../lib/LanguageContext';

export default function Tenders() {
  const { t } = useLanguage();
  // Scroll animation effect
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
          el.classList.remove('visible');
          setTimeout(() => {
            el.classList.add('visible');
          }, 10);
        } else {
          el.classList.remove('visible');
        }
      });
    };

    handleScroll();
    
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', throttledScroll);
    
    return () => window.removeEventListener('scroll', throttledScroll);
  }, []);
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countries, setCountries] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllTenders, setShowAllTenders] = useState(false);

  // Hero images array
  const heroImages = [
    '/assets/tender.png',
    '/assets/tender-2.png',
    '/assets/tender-3.png',
    '/assets/tender-4.png'
  ];

  // Auto-scroll hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Set static countries list (no API call needed)
  useEffect(() => {
    const staticCountries = [
      'All',
      'India',
      'Malaysia', 
      'Singapore',
      'Sri Lanka',
      'Latvia',
      'Kenya',
      'Canada',
      'Georgia',
      'Nepal',
      'Thailand',
      'Brunei Darussalam',
      'Montenegro',
      'Mongolia',
      'Bangladesh',
      'Maldives',
      'Philippines (the)',
      'Nigeria',
      'Pakistan',
      'South Africa',
      'Argentina',
      'Mexico',
      'United States',
      'United Kingdom',
      'Australia',
      'Germany',
      'France',
      'Japan',
      'China',
      'Brazil'
    ];
    // console.log('Setting static countries:', staticCountries);
    setCountries(staticCountries);
  }, []);

  // Debug log for countries
  // console.log('Current countries state:', countries);

  // Fetch tenders from API - Get all tenders (no image filtering)
  const { posts: tenders, loading: tendersLoading, error: tendersError } = usePostsByPage('tenders', 50);

  const filteredTenders = tenders.filter(tender => {
    // Country filter
    const matchesCountry = selectedCountry === 'All' || tender.post_country === selectedCountry;
    
    // Search filter
    const matchesSearch = searchTerm === '' || 
      tender.post_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.post_company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.post_country?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCountry && matchesSearch;
  });

  // Show only 12 tenders initially, then all if "See all" is clicked
  const displayedTenders = showAllTenders ? filteredTenders : filteredTenders.slice(0, 12);

  // Reset to show only 12 when filters change
  useEffect(() => {
    setShowAllTenders(false);
  }, [searchTerm, selectedCountry]);

  // Get featured tenders for Deal Headlines (max 4)
  const featuredTenders = tenders.slice(0, 4);

  // Handle tender click
  const handleTenderClick = (tender) => {
    if (tender.post_more_link) {
      window.open(tender.post_more_link, '_blank');
    }
  };

  return (
    <SimpleLayout title={t('expandedNav.tenders')}>
      <div className="px-4 py-4 md:p-8">
        <div className="mb-4 md:mb-6">
          <button 
            onClick={() => window.history.back()}
            className="flex items-start space-x-2 md:space-x-3 text-gray-700 hover:text-[#653a96] transition-all duration-300 "
          >
            <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm md:text-lg font-medium">{t('common.goBack')}</span>
          </button>
        </div>
        <div className="max-w-7xl mx-auto w-full">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6 md:mb-8 gap-4 md:gap-0">
            {/* Left Side - Breadcrumb and Title */}
            <div className="flex flex-col w-full md:w-auto">
              {/* Breadcrumb - Hidden on Mobile */}
              <nav className="hidden md:block text-base mb-2" aria-label="Breadcrumb"
              style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '24px'
              }}>
                <div className="flex items-center space-x-2">
                  <Link 
                    href="/" 
                    className="text-gray-600 hover:text-[#653a96] transition-colors duration-200"
                  >
                    {t('common.home')}
                  </Link>
                  <span className="text-gray-400" aria-hidden="true">&gt;</span>
                  <Link 
                    href="#" 
                    className="text-gray-600 hover:text-[#653a96] transition-colors duration-200"
                  >
                    {t('expandedNav.opportunities')}
                  </Link>
                  <span className="text-gray-400" aria-hidden="true">&gt;</span>
                  <span className="text-gray-800 font-medium" aria-current="page">
                    {t('expandedNav.tenders')}
                  </span>
                </div>
              </nav>

              {/* Page Title */}
              <h1 
                className="text-2xl md:text-4xl text-gray-800"
                style={{
                  fontFamily: 'DM Serif Display, serif',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '28px',
                  lineHeight: '36px',
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  textRendering: 'optimizeLegibility'
                }}
              >
                {t('expandedNav.tenders')}
              </h1>
            </div>

            {/* Right Side - Search and Filter */}
            <div className="flex flex-col gap-3 w-full md:max-w-sm">
              {/* Search Bar */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder={`${t('knowledge.search')} ${t('opportunities.tenders') || 'tenders'}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 md:pl-10 pr-8 md:pr-10 py-2.5 md:py-3 border border-gray-500 text-gray-600 text-sm md:text-base rounded-3xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#653a96] focus:border-transparent"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-3 md:pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Country Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                  className="flex items-center justify-between w-full px-3 md:px-4 py-2.5 md:py-3 bg-white border border-gray-300 rounded-3xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#653a96] focus:border-transparent"
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  <span className="text-sm md:text-base text-gray-600">{selectedCountry === 'All' ? t('knowledge.filterByCountry') : selectedCountry}</span>
                  </div>
                  <svg className={`w-4 h-4 md:w-5 md:h-5 text-gray-400 transition-transform duration-200 ${isCountryDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isCountryDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-500 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    <div className="py-1">
                      {countries.length > 0 ? (
                        countries.map((country) => (
                        <button
                          key={country}
                          onClick={() => {
                            setSelectedCountry(country);
                            setIsCountryDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 text-gray-600"
                        >
                          <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${selectedCountry === country ? 'border-[#653a96] bg-[#653a96]' : 'border-gray-500'}`}>
                            {selectedCountry === country && (
                              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <span>{country}</span>
                        </button>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-500 text-sm">Loading countries...</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
                              
         {/* Hero Section with Auto-Scrolling Images */}
         <div className="mb-8 md:mb-12 w-full">
             <div className="grid lg:grid-cols-3 gap-4 md:gap-8 items-start w-full">
             {/* Left Side - Hero Image Carousel */}
             <div className="lg:col-span-2 relative w-full">
                 <div className="relative w-full h-[250px] md:h-[500px] rounded-2xl md:rounded-3xl overflow-hidden">
                 <Image
                     src={heroImages[currentImageIndex]}
                     alt="Tender Opportunities"
                     fill
                     className="object-cover transition-opacity duration-500"
                     priority={currentImageIndex === 0}
                     quality={95}
                 />
                 <div className="absolute inset-0 bg-black/10"></div>
                 </div>
                 
                 {/* Working Image Indicators - Hidden on Mobile */}
                 <div className="hidden md:flex justify-center mt-3 md:mt-4 space-x-1.5 md:space-x-2">
                   {heroImages.map((_, index) => (
                     <button
                       key={index}
                       onClick={() => setCurrentImageIndex(index)}
                       className={`w-4 md:w-6 h-0.5 md:h-1 rounded-full transition-all duration-300 ${
                         index === currentImageIndex ? 'bg-[#653a96]' : 'bg-gray-300'
                       }`}
                     />
                   ))}
                 </div>
             </div>

             {/* Right Side - Deal Headlines (Real Data) - Hidden on Mobile */}
             <div className="hidden lg:block lg:col-span-1">
                 {/* Featured Deals */}
                 <div className="space-y-0">
                   {featuredTenders.map((tender, index) => (
                     <div key={tender.id}>
                       <div 
                         className="py-4 cursor-pointer hover:bg-[#653a96] hover:text-white hover:rounded-xl hover:p-4 transition-all duration-200 group"
                         onClick={() => handleTenderClick(tender)}
                       >
                         <p className="text-xs font-bold text-gray-500 group-hover:text-white group-hover:opacity-90 mb-2 uppercase tracking-wide">
                           Deadline: {tender.post_date || 'Recent'}
                         </p>
                         <h3 className="text-sm font-medium text-gray-800 group-hover:text-white mb-2 line-clamp-2 leading-tight"
                         style={{
                          fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                          fontWeight: 500,
                          fontSize: '14px',
                          lineHeight: '20px'
                         }}>
                           {tender.post_title}
                         </h3>
                         <p className="text-xs text-gray-600 group-hover:text-white group-hover:opacity-90 leading-relaxed"
                         style={{
                          fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                          fontWeight: 400,
                          fontSize: '12px',
                          lineHeight: '18px'
                         }}>
                           {tender.post_company || 'Government Tender'} • {tender.post_country || 'Global'}
                         </p>
                 </div>
                 
                       {/* Divider Line - Don't show after last item */}
                       {index < featuredTenders.length - 1 && (
                 <div className="border-t border-gray-200"></div>
                       )}
                 </div>
                   ))}
                 </div>
             </div>
             </div>
         </div>


          {/* Section Header */}
          <div className="mb-4 md:mb-6">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base md:text-lg font-medium text-[#653a96]">{t('opportunities.tendersThisMonth') || 'Tenders this month'}</h2>
              {filteredTenders.length > 12 && (
                <button 
                  onClick={() => setShowAllTenders(!showAllTenders)}
                  className="text-[#653a96] text-xs md:text-sm font-medium hover:underline whitespace-nowrap"
                >
                  {showAllTenders ? t('common.showLess') : t('homepage.sections.seeAll')}
                </button>
              )}
            </div>
            <p className="text-xs md:text-sm text-gray-600">
              {showAllTenders 
                ? `${t('opportunities.showingAll') || 'Showing all'} ${filteredTenders.length} ${t('opportunities.tenders') || 'tenders'}`
                : `${t('opportunities.showing') || 'Showing'} ${displayedTenders.length} ${t('opportunities.of') || 'of'} ${filteredTenders.length} ${t('opportunities.tenders') || 'tenders'}`
              }
            </p>
          </div>

          {/* Loading State */}
          {tendersLoading && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">{t('opportunities.loadingTenders') || 'Loading tenders...'}</div>
            </div>
          )}

          {/* Error State */}
          {tendersError && (
            <div className="text-center py-12">
              <div className="text-red-500 text-lg mb-4">{t('knowledge.error')}: {tendersError}</div>
              <button 
                onClick={() => window.location.reload()}
                className="text-[#653a96] hover:underline"
              >
                {t('common.tryAgain')}
              </button>
            </div>
          )}

          {/* Tenders Grid */}
          {!tendersLoading && !tendersError && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full">
              {displayedTenders.map((tender) => (
                <div 
                  key={tender.id} 
                  className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-200 hover:shadow-md hover:border-[#653a96]/30 transition-all duration-300 group cursor-pointer animate-on-scroll p-5 md:p-6"
                  onClick={() => handleTenderClick(tender)}
                >
                  {/* Content Only - No Images */}
                  <div className="space-y-3 md:space-y-4">
                    {/* Title */}
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 group-hover:text-[#653a96] transition-colors duration-200 line-clamp-2 leading-tight">
                      {tender.post_title}
                    </h3>
                    
                    {/* Company and Date */}
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-xs md:text-sm font-medium text-gray-800 flex-1">
                          {tender.post_company || 'Government Tender'}
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                          {tender.post_date || 'Recent'}
                        </span>
                      </div>
                      
                      {/* Country */}
                      <div className="flex items-center space-x-1.5">
                        <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs md:text-sm text-gray-600">
                          {tender.post_country || 'Global'}
                        </span>
                      </div>
                    </div>
                  </div>
              </div>
            ))}
          </div>
          )}

          {/* No Results */}
          {!tendersLoading && !tendersError && displayedTenders.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">{t('opportunities.noTenders') || 'No tenders found'}</h3>
              <p className="text-gray-600">{t('knowledge.adjustSearch')}</p>
            </div>
          )}
        </div>
      </div>
    </SimpleLayout>
  );
}
