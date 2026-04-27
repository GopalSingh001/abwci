import SimpleLayout from '../knowledge/components/SimpleLayout';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useLeader } from '../../lib/useLeaders';
import { useLanguage } from '../../lib/LanguageContext';

// Function to get country code from country/region name
const getCountryCode = (countryName) => {
  if (!countryName) return null;
  
  const name = countryName.toLowerCase().trim();
  
  // Only exclude "Global" - show flags for all regions and countries
  if (name === 'global') return null;
  
  // Region to representative country code mapping
  const regionMap = {
    'asia': 'in', // as representative
    'europe': 'de', // Germany as representative
    'africa': 'ng', // Nigeria as representative
    'north america': 'us', // United States as representative
    'south america': 'br', // Brazil as representative
    'oceania': 'au', // Australia as representative
    'americas': 'us', // United States as representative
    'middle east': 'ae', // UAE as representative
  };
  
  // Check if it's a region first
  if (regionMap[name]) {
    return regionMap[name];
  }
  
  // Country name to ISO code mapping
  const countryMap = {
    // Asian countries
    'india': 'in',
    'china': 'cn',
    'japan': 'jp',
    'singapore': 'sg',
    'south korea': 'kr',
    'korea': 'kr',
    'thailand': 'th',
    'malaysia': 'my',
    'indonesia': 'id',
    'bangladesh': 'bd',
    'nepal': 'np',
    'sri lanka': 'lk',
    'pakistan': 'pk',
    'philippines': 'ph',
    'vietnam': 'vn',
    'myanmar': 'mm',
    'brunei': 'bn',
    
    // European countries
    'united kingdom': 'gb',
    'uk': 'gb',
    'germany': 'de',
    'france': 'fr',
    'italy': 'it',
    'spain': 'es',
    'netherlands': 'nl',
    'sweden': 'se',
    'switzerland': 'ch',
    'poland': 'pl',
    'norway': 'no',
    'ukraine': 'ua',
    'russia': 'ru',
    'latvia': 'lv',
    'montenegro': 'me',
    'armenia': 'am',
    'georgia': 'ge',
    'israel': 'il',
    
    // African countries
    'nigeria': 'ng',
    'kenya': 'ke',
    'south africa': 'za',
    'tanzania': 'tz',
    'ghana': 'gh',
    'ethiopia': 'et',
    'egypt': 'eg',
    'morocco': 'ma',
    'algeria': 'dz',
    'cameroon': 'cm',
    'zimbabwe': 'zw',
    
    // North American countries
    'united states': 'us',
    'usa': 'us',
    'us': 'us',
    'canada': 'ca',
    'mexico': 'mx',
    'panama': 'pa',
    'costa rica': 'cr',
    'guatemala': 'gt',
    'honduras': 'hn',
    'belize': 'bz',
    'dominican republic': 'do',
    'ecuador': 'ec',
    
    // South American countries
    'argentina': 'ar',
    'chile': 'cl',
    'peru': 'pe',
    'colombia': 'co',
    'venezuela': 've',
    'uruguay': 'uy',
    'brazil': 'br',
    
    // Oceania countries
    'australia': 'au',
    'new zealand': 'nz',
    'fiji': 'fj',
    'papua new guinea': 'pg',
    'samoa': 'ws',
    'tonga': 'to',
    'vanuatu': 'vu',
    'solomon islands': 'sb',
  };
  
  // Check for exact match
  if (countryMap[name]) {
    return countryMap[name];
  }
  
  // Check for partial matches
  for (const [key, value] of Object.entries(countryMap)) {
    if (name.includes(key) || key.includes(name)) {
      return value;
    }
  }
  
  return null;
};

// Function to get flag image from API
const getFlagImage = (countryCode) => {
  if (!countryCode) return null;
  return `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`;
};

export default function LeaderProfile() {
  const { t } = useLanguage();
  const router = useRouter();
  const { name } = router.query;
  
  // Fetch leader data using the custom hook
  const { leader, loading, error } = useLeader(name, true); // true indicates it's a slug

  // Determine category from leader's designation
  const getCategoryFromDesignation = (designation) => {
    if (!designation) return null;
    const desig = designation.toLowerCase();
    
    // Check for state presidents first (more specific)
    if (desig.includes('state president')) {
      return {
        slug: 'state-presidents',
        label: t('expandedNav.statePresidents')
      };
    }
    
    // Check for global ambassadors
    if (desig.includes('global ambassador') || desig.includes('ambassador')) {
      return {
        slug: 'global-ambassadors',
        label: t('expandedNav.globalAmbassadors')
      };
    }
    
    // Check for regional/country presidents
    if (desig.includes('country president') || desig.includes('regional president') || 
        (desig.includes('president') && !desig.includes('state') && !desig.includes('global'))) {
      return {
        slug: 'regional-presidents',
        label: t('expandedNav.regionalPresidents')
      };
    }
    
    // Check for global secretariat (chief, secretary, director, coordinator, etc.)
    if (desig.includes('chief') || desig.includes('secretary') || desig.includes('director') || 
        desig.includes('coordinator') || desig.includes('manager') || desig.includes('advisor') || 
        desig.includes('consultant') || desig.includes('lead') || desig.includes('strategist') || 
        desig.includes('affairs') || (desig.includes('officer') && !desig.includes('country') && 
        !desig.includes('regional') && !desig.includes('state'))) {
      return {
        slug: 'global-secretariat',
        label: t('expandedNav.globalSecretariat')
      };
    }
    
    return null;
  };

  const category = leader ? getCategoryFromDesignation(leader.designation) : null;

  if (loading) {
    return (
      <SimpleLayout title={t('leaders.loading')}>
        <div className="p-8">
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">{t('leaders.loading')}</div>
          </div>
        </div>
      </SimpleLayout>
    );
  }

  if (error || !leader) {
    return (
      <SimpleLayout title={t('leaders.none')}>
        <div className="p-8">
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              {error || t('leaders.none')}
            </div>
            <button 
              onClick={() => router.back()}
              className="text-[#653a96] hover:underline"
            >
              {t('common.goBack')}
            </button>
          </div>
        </div>
      </SimpleLayout>
    );
  }

  return (
    <SimpleLayout title={leader.name}>
      <div className="md:p-8 p-4 pb-16 md:pb-24">
        {/* Top Row: Go Back Button (left) + Breadcrumb (centered) */}
        <div className="relative mb-8 md:mb-8 mb-4">
          {/* Go Back Button - Left */}
          <div className="absolute left-0 top-0 z-10 pr-2">
            <button 
              onClick={() => router.back()}
              className="flex items-center space-x-1 md:space-x-2 text-gray-700 hover:text-[#653a96] transition-all duration-300"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-xs md:text-base font-medium hidden sm:inline">{t('common.goBack')}</span>
            </button>
          </div>

          {/* Breadcrumb - Centered on desktop, scrollable on mobile */}
          <div className="hidden md:flex justify-center md:px-0 overflow-x-auto min-w-0">
            <nav 
              className="flex items-center space-x-0.5 md:space-x-2 whitespace-nowrap scrollbar-hide" 
              aria-label="Breadcrumb" 
              style={{ 
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                display: 'flex',
                flexWrap: 'nowrap'
              }}
            >
              <Link 
                href="/" 
                className="text-gray-600 hover:text-[#653a96] transition-colors duration-200 text-[10px] md:text-sm whitespace-nowrap flex-shrink-0"
                style={{ whiteSpace: 'nowrap' }}
              >
                {t('common.home')}
              </Link>
              <span className="text-gray-300 md:text-gray-400 flex-shrink-0 px-0.5 text-[10px] md:text-sm" aria-hidden="true" style={{ whiteSpace: 'nowrap' }}>&gt;</span>
              {category ? (
                <Link 
                  href={`/leadership/category/${category.slug}`}
                  className="text-gray-600 hover:text-[#653a96] transition-colors duration-200 text-[10px] md:text-sm whitespace-nowrap flex-shrink-0"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {category.label}
                </Link>
              ) : (
                <Link 
                  href="/leadership" 
                  className="text-gray-600 hover:text-[#653a96] transition-colors duration-200 text-[10px] md:text-sm whitespace-nowrap flex-shrink-0"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {t('navbar.leadership')}
                </Link>
              )}
              <span className="text-gray-300 md:text-gray-400 flex-shrink-0 px-0.5 text-[10px] md:text-sm" aria-hidden="true" style={{ whiteSpace: 'nowrap' }}>&gt;</span>
              <span className="text-gray-800 font-medium text-[10px] md:text-sm whitespace-nowrap flex-shrink-0" aria-current="page" style={{ whiteSpace: 'nowrap' }}>
                {leader.name}
              </span>
            </nav>
          </div>
        </div>

        {/* Main Content - Aligned with navbar max-width */}
        <div className="max-w-7xl mx-auto md:px-0 px-4">
          {/* Image and About Section - Grid Layout */}
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-2 md:gap-3 gap-4 items-start md:pt-8 pt-4">
            {/* Left Side - Image - Square */}
            <div className="relative md:block flex justify-center order-1 lg:order-1" style={{ paddingTop: '20px' }}>
              <div className="relative w-full aspect-square max-w-md md:max-w-md max-w-full rounded-3xl overflow-hidden border-2 border-black">
                <Image
                  src={leader.image_url || leader.image || ''}
                  alt={leader.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Right Side - About Section */}
            <div className="space-y-2 md:space-y-2 space-y-2 md:-mt-6 -mt-0 order-2 lg:order-2 flex flex-col">
              {/* Leader Name */}
              <div className="mb-2 md:mb-1 order-1">
                <h1 
                  className="text-gray-800"
                  style={{
                    fontFamily: 'DM Serif Display',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: 'clamp(28px, 5vw, 42px)',
                    lineHeight: 'clamp(36px, 7vw, 58px)',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textRendering: 'optimizeLegibility'
                  }}
                >
                  {leader.name}
                </h1>
              </div>

              {/* Designation and Location - Same Row */}
              <div className="flex flex-wrap items-center gap-4 md:gap-4 gap-2 mb-6 md:mb-6 mb-3 order-2">
                <h2 className="text-xl md:text-xl text-base text-[#653a96] font-medium">
                  {leader.designation}
                </h2>
                <div className="flex items-center space-x-2 text-gray-600">
                  <svg className="w-5 h-5 md:w-5 md:h-5 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-base md:text-base text-sm">{leader.region || leader.country || 'Global'}</span>
                  {(() => {
                    const location = leader.region || leader.country || 'Global';
                    const countryCode = getCountryCode(location);
                    const flagUrl = getFlagImage(countryCode);
                    
                    if (flagUrl) {
                      return (
                        <Image
                          src={flagUrl}
                          alt={`${location} flag`}
                          width={20}
                          height={15}
                          className="w-5 h-4 rounded-sm ml-2"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      );
                    }
                    return null;
                  })()}
                </div>
              </div>

              {/* Additional Information Section - Before About on mobile and desktop */}
              <div className="mb-8 md:mb-12 space-y-2 md:space-y-4 order-3 lg:order-3">
                {leader.birthday && (
                  <div className="flex items-center space-x-2 text-gray-700">
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-base md:text-base text-sm">
                      <span className="font-medium">Birthday:</span> {new Date(leader.birthday).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                )}
                {leader.affiliations && (
                  <div className="flex items-start space-x-2 text-gray-700">
                    <svg className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <div className="flex-1">
                      <span className="font-medium text-base md:text-base text-sm">Affiliation(s):</span>
                      <p className="text-base md:text-base text-sm mt-1">{leader.affiliations}</p>
                    </div>
                  </div>
                )}
                {(() => {
                  // Get email and LinkedIn values, handling null/undefined/empty strings
                  const emailValue = (leader.email_address && typeof leader.email_address === 'string') 
                    ? leader.email_address.trim() 
                    : (leader.email_address ? String(leader.email_address).trim() : '');
                  const linkedInValue = (leader.linkedin && typeof leader.linkedin === 'string') 
                    ? leader.linkedin.trim() 
                    : (leader.linkedin ? String(leader.linkedin).trim() : '');
                  
                  const hasEmail = emailValue && emailValue.length > 0;
                  const hasLinkedIn = linkedInValue && linkedInValue.length > 0;
                  
                  // Show section if either email or LinkedIn exists
                  if (!hasEmail && !hasLinkedIn) return null;
                  
                  return (
                    <div className="flex items-center space-x-2 md:space-x-4 mt-4 md:mt-6">
                      {hasEmail && (
                        <a 
                          href={`mailto:${emailValue}`}
                          className="flex items-center md:space-x-2 text-gray-700 hover:text-[#653a96] transition-colors"
                          aria-label={`Email ${leader.name}`}
                        >
                          <svg className="w-6 h-6 md:w-6 md:h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="hidden md:inline text-base text-sm text-[#653a96] hover:underline">
                            {emailValue}
                          </span>
                        </a>
                      )}
                      {hasLinkedIn && (
                        <a 
                          href={linkedInValue}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center md:space-x-2 text-gray-700 hover:text-[#653a96] transition-colors"
                          aria-label={`LinkedIn profile of ${leader.name}`}
                        >
                          <svg className="w-5 h-5 md:w-5 md:h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                          <span className="hidden md:inline text-base text-sm text-[#653a96] hover:underline">
                            LinkedIn Profile
                          </span>
                        </a>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* About Us Heading */}
              {/* <h3 className="text-2xl md:text-2xl text-xl font-semibold text-gray-800 mb-4 md:mb-4 mb-2 mt-6 md:mt-8 order-4 lg:order-4">
                About
              </h3> */}

              {/* Bio Content */}
              <div className="prose prose-lg max-w-none order-5 lg:order-5 pt-4">
                <div 
                  className="text-gray-700 leading-relaxed text-base md:text-base text-sm"
                  dangerouslySetInnerHTML={{ 
                    __html: leader.bio ? leader.bio.replace(/\n/g, '<br />') : t('leaders.noneDesc')
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SimpleLayout>
  );
}
