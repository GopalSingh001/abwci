import SimpleLayout from '../components/SimpleLayout';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { usePostsByPage, usePostsByCategory } from '../../../lib/usePosts';
import { countries } from '../../../data/resources-data';
import { useLanguage } from '../../../lib/LanguageContext';

export default function Resources() {
  const { t } = useLanguage();
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [displayedCount, setDisplayedCount] = useState(6); // Initial number of resources to show
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [resourcesImage, setResourcesImage] = useState(null);
  
  // Fetch resources page image
  useEffect(() => {
    const fetchResourcesImage = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page-images`);
        if (response.ok) {
          const data = await response.json();
          const resourcesPageImage = data.data?.find(img => img.page_name === 'resources' && img.is_active);
          if (resourcesPageImage?.image_url) {
            setResourcesImage(resourcesPageImage.image_url);
          }
        }
      } catch (error) {
        console.log('Error fetching resources page image:', error);
      }
    };
    fetchResourcesImage();
  }, []);

  // Resource categories
  const resourceCategories = [
    'All',
    'Financial Tools',
    'Legal Documents',
    'Business Templates',
    'Educational Materials',
    'Compliance Guides'
  ];

  // Function to get country code for flag API
  const getCountryCode = (countryName) => {
    const countryCodeMap = {
      'India': 'IN',
      'Malaysia': 'MY',
      'Singapore': 'SG',
      'Sri Lanka': 'LK',
      'Latvia': 'LV',
      'Kenya': 'KE',
      'Canada': 'CA',
      'Georgia': 'GE',
      'Nepal': 'NP',
      'Thailand': 'TH',
      'Brunei Darussalam': 'BN',
      'Montenegro': 'ME',
      'Mongolia': 'MN',
      'Bangladesh': 'BD',
      'Maldives': 'MV',
      'Philippines (the)': 'PH',
      'Philippines': 'PH',
      'Nigeria': 'NG',
      'Pakistan': 'PK',
      'South Africa': 'ZA',
      'Argentina': 'AR',
      'Mexico': 'MX'
    };
    return countryCodeMap[countryName] || 'US'; // Default to US if not found
  };

  // Array of random mountain/landscape images from Unsplash
  const randomMountainImages = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1464822759844-d150ad90c29d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1464822759844-d150ad90c29d?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop&q=80'
  ];

  // Function to get a random mountain image based on resource ID for consistency
  const getRandomMountainImage = (resourceId) => {
    const index = resourceId % randomMountainImages.length;
    return randomMountainImages[index];
  };

  // Fetch all resources (no image filtering needed since we have country images)
  const { posts: rawResources, loading: resourcesLoading, error: resourcesError } = usePostsByPage('resources', 200);
  
  // Use all resources (no filtering by images)
  const resources = rawResources;

  // Filter resources based on selected filters
  const filteredResources = resources.filter(resource => {
    const matchesCountry = selectedCountry === 'All' || resource.post_country === selectedCountry;
    const matchesSearch = searchTerm === '' || 
      (resource.post_title && resource.post_title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (resource.post_desc && resource.post_desc.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCountry && matchesSearch;
  });

  // Sort resources: prioritize those with ABWCI images (post_thumbnail_url or post_banner_url)
  const sortedResources = [...filteredResources].sort((a, b) => {
    const aHasImage = (a.post_thumbnail_url && a.post_thumbnail_url.trim() !== '') || 
                      (a.post_banner_url && a.post_banner_url.trim() !== '');
    const bHasImage = (b.post_thumbnail_url && b.post_thumbnail_url.trim() !== '') || 
                      (b.post_banner_url && b.post_banner_url.trim() !== '');
    
    // Resources with images come first
    if (aHasImage && !bHasImage) return -1;
    if (!aHasImage && bHasImage) return 1;
    return 0; // Keep original order for resources with same image status
  });

  // Get displayed resources based on pagination
  const displayedResources = sortedResources.slice(0, displayedCount);
  const hasMore = displayedCount < sortedResources.length;

  // Reset displayed count when filters change
  useEffect(() => {
    setDisplayedCount(6);
  }, [selectedCountry, searchTerm]);

  // Infinite scroll handler and scroll animation
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Scroll animation for elements
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

          // Infinite scroll pagination
          if (!isLoadingMore && hasMore) {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            // Load more when user is 200px from bottom
            if (scrollTop + windowHeight >= documentHeight - 200) {
              setIsLoadingMore(true);
              // Simulate loading delay for better UX
              setTimeout(() => {
                setDisplayedCount(prev => Math.min(prev + 6, sortedResources.length));
                setIsLoadingMore(false);
              }, 300);
            }
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    // Initial scroll animation
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoadingMore, hasMore, sortedResources.length]);

  const handleResourceClick = (resource) => {
    // If resource has a more link, redirect to it
    if (resource.post_more_link && resource.post_more_link.trim() !== '') {
      window.open(resource.post_more_link, '_blank');
      return;
    }
    
    // Fallback: navigate to detail page if no more link
    router.push(`/knowledge/resources/${resource.id}`);
  };

  return (
    <SimpleLayout title={t('expandedNav.resources')}>
      <div className="relative">
        {/* Hero Banner Section */}
        <div className="relative w-full h-[480px] md:h-[500px] lg:h-[580px]" style={{ overflow: 'visible' }}>
          {/* Background Image */}
          {resourcesImage ? (
            <Image
              src={resourcesImage}
              alt="Resources Hero"
              fill
              className="object-cover"
              style={{ objectPosition: '50% 40%' }}
              priority
              loading="eager"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#FECB07] to-yellow-600"></div>
          )}
          
          {/* Yellow Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FECB07] opacity-100" 
               style={{ background: 'linear-gradient(180deg, rgba(254, 203, 7, 0) 51.44%, #FECB07 100%)' }}></div>
          
          {/* Content Overlay */}
          <div className="relative z-10 h-full flex flex-col justify-end">
            {/* Bottom Section - All Content */}
            <div className="px-4 md:pl-12 lg:pl-48 pb-8 md:pb-12">
              {/* Breadcrumb */}
              <div className="mb-3 md:mb-4">
                {/* Mobile Breadcrumb - Simple inline text like roundups */}
                <div className="md:hidden">
                  <span
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontWeight: 500,
                      fontSize: '14px',
                      lineHeight: '20px',
                      color: '#FFFFFF'
                    }}
                  >
                    {t('expandedNav.knowledgeHub')} &gt; {t('expandedNav.resources')}
                  </span>
                </div>
                {/* Desktop Breadcrumb - Original with links */}
                <nav className="hidden md:flex items-center gap-2" aria-label="Breadcrumb">
                  <Link 
                    href="/" 
                    className="text-white/90 hover:text-white transition-colors duration-200 text-base shrink-0"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontWeight: 500,
                      fontSize: '18px',
                      lineHeight: '22px'
                    }}
                  >
                    {t('common.home')}
                  </Link>
                  <span className="text-white/70 text-base shrink-0" aria-hidden="true">&gt;</span>
                  <Link 
                    href="/knowledge" 
                    className="text-white/90 hover:text-white transition-colors duration-200 text-base shrink-0"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontWeight: 400,
                      lineHeight: '22px'
                    }}
                  >
                    {t('expandedNav.knowledgeHub')}
                  </Link>
                  <span className="text-white/70 text-base shrink-0" aria-hidden="true">&gt;</span>
                  <span className="text-white font-medium text-base shrink-0" aria-current="page"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontWeight: 400,
                      lineHeight: '22px'
                    }}
                  >
                    {t('expandedNav.resources')}
                  </span>
                </nav>
              </div>

              {/* Page Title */}
              <div className="flex flex-col gap-2 mb-4 md:mb-6">
                <h1 
                  className="text-white text-3xl md:text-5xl lg:text-[56px]"
                  style={{
                    fontFamily: 'DM Serif Display',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '1.2',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textRendering: 'optimizeLegibility'
                  }}
                >
                  {t('expandedNav.resources')}
                </h1>
              </div>

              {/* Search and Filter Section */}
              <div className="flex flex-col md:flex-row gap-3 pr-5 md:pr-8 lg:pr-12">
                {/* Search Bar */}
                <div className="relative w-full md:flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg width="18" height="18" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-700">
                      <path d="M9.375 8.25H8.7825L8.5725 8.0475C9.33291 7.16552 9.75083 6.03952 9.75 4.875C9.75 3.91082 9.46409 2.96829 8.92842 2.1666C8.39274 1.36491 7.63137 0.740067 6.74058 0.371089C5.84979 0.00211224 4.86959 -0.094429 3.92394 0.093674C2.97828 0.281777 2.10964 0.746076 1.42786 1.42786C0.746076 2.10964 0.281777 2.97828 0.093674 3.92394C-0.094429 4.86959 0.00211224 5.84979 0.371089 6.74058C0.740067 7.63137 1.36491 8.39274 2.1666 8.92842C2.96829 9.46409 3.91082 9.75 4.875 9.75C6.0825 9.75 7.1925 9.3075 8.0475 8.5725L8.25 8.7825V9.375L12 13.1175L13.1175 12L9.375 8.25ZM4.875 8.25C3.0075 8.25 1.5 6.7425 1.5 4.875C1.5 3.0075 3.0075 1.5 4.875 1.5C6.7425 1.5 8.25 3.0075 8.25 4.875C8.25 6.7425 6.7425 8.25 4.875 8.25Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder={t('knowledge.search') || 'Search'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border-none rounded-full text-sm md:text-base text-gray-700 placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-white h-11"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontWeight: 400,
                      lineHeight: '20px'
                    }}
                  />
                </div>

                {/* Country Dropdown */}
                <div className="relative w-full md:flex-1 country-dropdown-container" style={{ zIndex: 100 }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsCountryDropdownOpen(!isCountryDropdownOpen);
                    }}
                    className="flex items-center justify-between w-full px-4 py-3 bg-white border-none rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white h-11"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontWeight: 400,
                      lineHeight: '20px'
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <Image src="/fluent-mdl2_world.svg" alt="Globe icon" width={18} height={18} />
                      <span className="text-sm md:text-base text-gray-700"
                        style={{
                          fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                          fontWeight: 400,
                          lineHeight: '20px'
                        }}
                      >
                        {t('knowledge.filterByCountry') || 'Filter by Country'}
                      </span>
                    </div>
                    <svg className={`w-5 h-5 text-[#2B2D30] transition-transform duration-200 ${isCountryDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isCountryDropdownOpen && (
                    <div 
                      className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-[400px] overflow-y-auto"
                      style={{ zIndex: 1000 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="py-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCountry('All');
                            setIsCountryDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 text-gray-700"
                        >
                          <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${selectedCountry === 'All' ? 'border-[#653a96] bg-[#653a96]' : 'border-gray-300'}`}>
                            {selectedCountry === 'All' && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <span>{t('knowledge.allCountries') || 'All Countries'}</span>
                        </button>
                        {countries && countries.length > 0 ? countries.map((country) => (
                          <button
                            key={country.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCountry(country.name);
                              setIsCountryDropdownOpen(false);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 text-gray-700"
                          >
                            <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${selectedCountry === country.name ? 'border-[#653a96] bg-[#653a96]' : 'border-gray-300'}`}>
                              {selectedCountry === country.name && (
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <img 
                              src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
                              alt={`${country.name} flag`}
                              className="w-6 h-4 object-cover rounded-sm"
                              style={{
                                imageRendering: 'crisp-edges',
                                border: '0.5px solid rgba(0, 0, 0, 0.1)'
                              }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                            <span>{country.name}</span>
                          </button>
                        )) : (
                          <div className="px-4 py-2 text-gray-500 text-sm">No countries available</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 md:px-6 lg:px-8 pt-6 md:pt-8 pb-6 md:pb-8">
          <div className="max-w-7xl mx-auto">

          {/* Loading State */}
          {resourcesLoading && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">{t('knowledge.loadingResources')}</div>
            </div>
          )}

          {/* Error State */}
          {resourcesError && (
            <div className="text-center py-12">
              <div className="text-red-500 text-lg mb-4">{t('knowledge.error')}: {resourcesError}</div>
              <button 
                onClick={() => window.location.reload()}
                className="text-[#653a96] hover:underline"
              >
                {t('common.tryAgain')}
              </button>
            </div>
          )}

          {/* Resources Grid */}
          {!resourcesLoading && !resourcesError && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 justify-items-center">
              {displayedResources.map((resource) => (
                <div 
                  key={resource.id} 
                  onClick={() => handleResourceClick(resource)}
                  className="bg-[#F5F5F5] rounded-2xl md:rounded-3xl p-4 md:p-5 hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col w-full"
                  style={{ maxWidth: '420px', height: 'auto', minHeight: '420px' }}
                >
                  {/* Image */}
                  <div className="relative w-full rounded-xl md:rounded-2xl overflow-hidden mb-4 md:mb-7 flex-shrink-0 border border-[#171717]"
                       style={{ width: '100%', height: '260px' }}>
                    {(resource.post_thumbnail_url && resource.post_thumbnail_url.trim() !== '') || (resource.post_banner_url && resource.post_banner_url.trim() !== '') ? (
                      <img
                        src={resource.post_thumbnail_url || resource.post_banner_url}
                        alt={resource.post_title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = resource.country_image_url || getRandomMountainImage(resource.id);
                        }}
                      />
                    ) : (
                      <img
                        src={resource.country_image_url || getRandomMountainImage(resource.id)}
                        alt={resource.post_title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = getRandomMountainImage(resource.id);
                        }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex-1">
                      {/* Category Badge */}
                      {/* <div className="inline-block mb-3">
                        <span className="px-2.5 py-1.5 bg-white rounded-lg text-sm font-medium text-[#171717]"
                              style={{
                                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                                fontWeight: 400,
                                fontSize: '14px',
                                lineHeight: '17px'
                              }}>
                          {resource.post_category}
                        </span>
                      </div> */}

                      {/* Title */}
                      <h3 className="text-base md:text-lg lg:text-xl font-normal text-[#171717] leading-tight group-hover:text-[#653a96] transition-colors duration-200 line-clamp-2 md:line-clamp-3 mb-2 md:mb-3"
                          style={{
                            fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                            fontWeight: 400,
                            lineHeight: '1.3'
                          }}>
                        {resource.post_title}
                      </h3>

                      {/* Country Label */}
                      {resource.post_country && (
                        <div className="mb-3 md:mb-4 flex items-center gap-2">
                          <span className="text-xs md:text-sm text-[#653a96] font-medium"
                                style={{
                                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                                  fontWeight: 500,
                                  lineHeight: '17px'
                                }}>
                            {resource.post_country}
                          </span>
                          <img 
                            src={`https://flagcdn.com/w40/${getCountryCode(resource.post_country).toLowerCase()}.png`}
                            alt={`${resource.post_country} flag`}
                            className="w-5 h-3 md:w-6 md:h-4 object-cover rounded-sm"
                            style={{
                              imageRendering: 'crisp-edges',
                              border: '0.5px solid rgba(0, 0, 0, 0.1)'
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Arrow Icon */}
                    <div className="flex justify-end">
                      <svg className="w-6 h-6 md:w-8 md:h-8 text-[#171717] group-hover:text-[#653a96] transition-colors duration-200" 
                           viewBox="0 0 34 34" 
                           fill="none" 
                           xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.66634 15.5827H22.9072L14.988 7.66352L16.9997 5.66602L28.333 16.9993L16.9997 28.3327L15.0022 26.3352L22.9072 18.416H5.66634V15.5827Z" fill="currentColor"/>
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Loading More Indicator */}
          {isLoadingMore && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#653a96]"></div>
              <p className="mt-2 text-gray-600 text-sm">Loading more resources...</p>
            </div>
          )}

          {/* No Results */}
          {!resourcesLoading && !resourcesError && sortedResources.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">{t('knowledge.noResources')}</h3>
              <p className="text-gray-600">{t('knowledge.adjustSearch')}</p>
              </div>
          )}
          </div>
        </div>
      </div>
    </SimpleLayout>
  );
}
