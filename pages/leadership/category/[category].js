import SimpleLayout from '../../knowledge/components/SimpleLayout';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useLeadersByCategory } from '../../../lib/useLeaders';
import { useLanguage } from '../../../lib/LanguageContext';

export default function LeadershipCategory() {
  const router = useRouter();
  const { category } = router.query;
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const leadersPerPage = 9;
  
  // Custom order for Global Secretariat members by name
  const getGlobalSecretariatOrder = (leader) => {
    const name = (leader?.name || '').trim().toLowerCase();
    
    // Define the order mapping - matching names (case-insensitive, flexible matching)
    // Order: 1. Parul Soni, 2. Graciela De Oto, 3. Ratna Prabha, 4. Gaurav Panday, 
    //        5. Savita Sethi, 6. Farah Ahmed, 7. Srishti, 8. Siddharth, 9. Kamal, 
    //        10. Amit Singh, 11. Kuhu, 12. Dhruv Manchanda
    const orderMap = [
      { pattern: /^parul\b/i, order: 1 },                    // Parul Soni (matches "Parul" at start)
      { pattern: /graciela/i, order: 2 },                     // Graciela De Oto
      { pattern: /ratna.*prabha|prabha.*ratna/i, order: 3 },  // Smt. K. Ratna Prabha IAS (Retd.)
      { pattern: /gaurav.*pand(a|e)y/i, order: 4 },            // Gaurav Panday or Pandey (handles spelling variation)
      { pattern: /savita.*sethi/i, order: 5 },                // Savita Sethi
      { pattern: /farah.*ahmed/i, order: 6 },                // Farah Ahmed
      { pattern: /^srishti\b/i, order: 7 },                  // Srishti (exact match at start)
      { pattern: /^siddharth\b/i, order: 8 },                // Siddharth Mishra (matches "Siddharth" at start)
      { pattern: /^kamal\b/i, order: 9 },                    // Kamal Sharma (matches "Kamal" at start, not "Kamala")
      { pattern: /amit.*singh/i, order: 10 },                // Amit Singh
      { pattern: /^kuhu\b/i, order: 11 },                     // Kuhu Agarwal (matches "Kuhu" at start)
      { pattern: /dhruv.*manchanda/i, order: 12 }             // Dhruv Manchanda
    ];

    // Check if name matches any pattern
    for (const { pattern, order } of orderMap) {
      if (pattern.test(name)) {
        return order;
      }
    }
    
    // If not in the custom order, return a high number to sort them after
    return 999;
  };
  
  // Sorting helpers: prefer admin order fields, then role-based ranking
  const getAdminOrder = (leader) => {
    const possible = leader?.order ?? leader?.priority ?? leader?.sort_order ?? leader?.sortOrder;
    return Number.isFinite(Number(possible)) ? Number(possible) : null;
  };

  const getDesignationRank = (leader) => {
    const name = (leader?.name || '').toLowerCase();
    const desig = (leader?.designation || '').toLowerCase();
    const text = `${name} ${desig}`;

    // Founder first (but not Co‑Founder), Co‑Founder second, then Chair
    if (/\bfounder\b/.test(text) && !/\bco[-\s]?founder\b/.test(text)) return 0;
    if (/\bco[-\s]?founder\b/.test(text)) return 1;
    if (/(^|\b)chair(man|person)?/.test(text)) return 2;
    if (/(chief|^ceo\b|^coo\b|^cfo\b|^cto\b)/.test(text)) return 3;
    if (/executive\s+director/.test(text)) return 4;
    if (/(^|\b)director/.test(text)) return 5;
    if (/(^|\b)secretary/.test(text)) return 6;
    if (/(deputy|associate|assistant)/.test(text)) return 7;
    if (/(manager)/.test(text)) return 8;
    if (/(coordinator)/.test(text)) return 9;
    if (/(advisor|consultant|strategist)/.test(text)) return 10;
    if (/(president)/.test(text)) return 11;
    return 100;
  };

  const sortLeaders = (arr = [], category = '') =>
    [...arr].sort((a, b) => {
      // Only apply Global Secretariat custom order for Global Secretariat category
      if (category === 'Global Secretariat') {
        const aOrder = getGlobalSecretariatOrder(a);
        const bOrder = getGlobalSecretariatOrder(b);
        
        // If both are in the custom order, sort by that order
        if (aOrder !== 999 || bOrder !== 999) {
          if (aOrder !== 999 && bOrder !== 999) {
            return aOrder - bOrder;
          }
          // If only one is in custom order, it comes first
          if (aOrder !== 999) return -1;
          if (bOrder !== 999) return 1;
        }
      }
      
      // Fallback to admin order if available
      const ao = getAdminOrder(a);
      const bo = getAdminOrder(b);
      if (ao !== null || bo !== null) {
        if (ao === null) return 1;
        if (bo === null) return -1;
        if (ao !== bo) return ao - bo;
      }
      
      // Fallback to designation rank
      const ar = getDesignationRank(a);
      const br = getDesignationRank(b);
      if (ar !== br) return ar - br;
      
      // Finally, alphabetical by name
      return (a.name || '').localeCompare(b.name || '');
    });
  
  // Convert URL parameter to proper category name
  const categoryMap = {
    'global-ambassadors': 'Global Ambassadors',
    'regional-presidents': 'Regional & Country Presidents',
    'state-presidents': 'State Presidents',
    'global-secretariat': 'Global Secretariat'
  };
  
  const categoryName = categoryMap[category] || 'Global Ambassadors';
  const globalOverlayCategories = new Set([
    'Global Ambassadors',
    'Global Secretariat',
    'Global Presidents'
  ]);
  const stateOverlayCategories = new Set([
    'Regional & Country Presidents',
    'State Presidents'
  ]);
  
  // Fetch leaders for the selected category using API
  const { leaders, loading, error } = useLeadersByCategory(categoryName);

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [category]);

  // Apply sorting before pagination
  const sortedLeaders = sortLeaders(leaders, categoryName);
  // Calculate pagination
  const totalPages = Math.ceil(sortedLeaders.length / leadersPerPage);
  const startIndex = (currentPage - 1) * leadersPerPage;
  const endIndex = startIndex + leadersPerPage;
  const displayedLeaders = sortedLeaders.slice(startIndex, endIndex);
  const useGlobalHover = globalOverlayCategories.has(categoryName);
  const useStateHover = stateOverlayCategories.has(categoryName);

  const COUNTRY_CODE_MAP = {
    india: 'IN',
    'northeast india': 'IN',
    'south asia': 'IN',
    goa: 'IN',
    maharashtra: 'IN',
    'delhi-ncr': 'IN',
    rajasthan: 'IN',
    'tamil nadu': 'IN',
    'tamil nadu & puducherry': 'IN',
    puducherry: 'IN',
    'uttar pradesh': 'IN',
    'bihar & jharkhand': 'IN',
    bihar: 'IN',
    jharkhand: 'IN',
    haryana: 'IN',
    'punjab & chandigarh': 'IN',
    punjab: 'IN',
    chandigarh: 'IN',
    'south india': 'IN',
    karnataka: 'IN',
    kerala: 'IN',
    gujarat: 'IN',
    telangana: 'IN',
    'andhra pradesh': 'IN',
    'west bengal': 'IN',
    odisha: 'IN',
    assam: 'IN',
    'north india': 'IN',
    'united states': 'US',
    usa: 'US',
    'washington dc': 'US',
    'district of columbia': 'US',
    dc: 'US',
    'new york': 'US',
    'california': 'US',
    texas: 'US',
    florida: 'US',
    idaho: 'US',
    washington: 'US',
    oregon: 'US',
    arizona: 'US',
    colorado: 'US',
    utah: 'US',
    nevada: 'US',
    'new mexico': 'US',
    montana: 'US',
    wyoming: 'US',
    'north dakota': 'US',
    'south dakota': 'US',
    nebraska: 'US',
    kansas: 'US',
    oklahoma: 'US',
    minnesota: 'US',
    iowa: 'US',
    missouri: 'US',
    arkansas: 'US',
    louisiana: 'US',
    wisconsin: 'US',
    illinois: 'US',
    michigan: 'US',
    indiana: 'US',
    ohio: 'US',
    kentucky: 'US',
    tennessee: 'US',
    alabama: 'US',
    georgia: 'US',
    'south carolina': 'US',
    'north carolina': 'US',
    virginia: 'US',
    'west virginia': 'US',
    maryland: 'US',
    delaware: 'US',
    pennsylvania: 'US',
    'new jersey': 'US',
    connecticut: 'US',
    'rhode island': 'US',
    massachusetts: 'US',
    vermont: 'US',
    'new hampshire': 'US',
    maine: 'US',
    'united states': 'US',
    usa: 'US',
    'united kingdom': 'GB',
    uk: 'GB',
    england: 'GB',
    scotland: 'GB',
    wales: 'GB',
    canada: 'CA',
    mexico: 'MX',
    'el salvador': 'SV',
    'costa rica': 'CR',
    honduras: 'HN',
    guatemala: 'GT',
    panama: 'PA',
    nicaragua: 'NI',
    'dominican republic': 'DO',
    colombia: 'CO',
    peru: 'PE',
    chile: 'CL',
    ecuador: 'EC',
    argentina: 'AR',
    brazil: 'BR',
    nigeria: 'NG',
    kenya: 'KE',
    tanzania: 'TZ',
    uganda: 'UG',
    'south africa': 'ZA',
    egypt: 'EG',
    'united arab emirates': 'AE',
    uae: 'AE',
    'saudi arabia': 'SA',
    singapore: 'SG',
    malaysia: 'MY',
    indonesia: 'ID',
    myanmar: 'MM',
    bangladesh: 'BD',
    nepal: 'NP',
    'sri lanka': 'LK',
    maldives: 'MV',
    china: 'CN',
    japan: 'JP',
    'south korea': 'KR',
    armenia: 'AM',
    israel: 'IL',
    georgia: 'GE',
    poland: 'PL',
    latvia: 'LV',
    montenegro: 'ME',
    italy: 'IT',
    europe: 'EU',
    spain: 'ES',
    france: 'FR',
    germany: 'DE',
    netherlands: 'NL',
    norway: 'NO',
    switzerland: 'CH',
    'brunei darussalam': 'BN',
    brunei: 'BN',
    philippines: 'PH',
    'czech republic': 'CZ',
    hungary: 'HU',
    ukraine: 'UA',
    australia: 'AU',
    'new zealand': 'NZ',
  };

  const COUNTRY_CODE_KEYS = Object.keys(COUNTRY_CODE_MAP).sort(
    (a, b) => b.length - a.length
  );

  const normalizeCountryLabel = (label = '') =>
    label
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[\u2019]/g, "'")
      .replace(/[\u{1F1E6}-\u{1F1FF}\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, ' ')
      .replace(/[^a-z\s-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const getCountryCode = (label = '') => {
    const normalized = normalizeCountryLabel(label);
    if (!normalized) return null;

    if (/^[a-z]{2}$/.test(normalized)) {
      return normalized.toUpperCase();
    }

    if (COUNTRY_CODE_MAP[normalized]) {
      return COUNTRY_CODE_MAP[normalized];
    }

    const partialMatch = COUNTRY_CODE_KEYS.find((key) =>
      normalized.includes(key)
    );

    return partialMatch ? COUNTRY_CODE_MAP[partialMatch] : null;
  };

  const codeToFlagEmoji = (code) =>
    code
      ?.toUpperCase()
      .split('')
      .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
      .join('');

  const getFlagImageUrl = (code) =>
    code ? `https://flagcdn.com/w40/${code.toLowerCase()}.png` : null;

  const CountryBadge = ({ label }) => {
    const displayLabel = label || t('common.global');
    const countryCode = getCountryCode(displayLabel);
    const fallbackEmoji = countryCode ? codeToFlagEmoji(countryCode) : '🌍';
    const flagUrl = getFlagImageUrl(countryCode);

    const handleImageError = (event) => {
      const imageEl = event.currentTarget;
      const fallbackEl = imageEl.nextElementSibling;
      imageEl.style.display = 'none';
      if (fallbackEl) {
        fallbackEl.classList.remove('hidden');
      }
    };

    return (
      <div className="flex items-center gap-2 text-white">
        {flagUrl ? (
          <span className="flex items-center">
            <Image
              src={flagUrl}
              alt={`${displayLabel} flag`}
              width={24}
              height={18}
              className="w-6 h-4 rounded-sm border border-white/30 object-cover"
              onError={handleImageError}
            />
            <span className="hidden text-lg leading-none">{fallbackEmoji}</span>
          </span>
        ) : (
          <span className="text-lg leading-none">{fallbackEmoji}</span>
        )}
        <span className="text-sm leading-none">
          {displayLabel}
        </span>
      </div>
    );
  };

  const getLeaderLocation = (leader) => leader?.country || leader?.region || t('common.global');

  const renderHoverOverlay = (leader, variant = 'desktop') => {
    const isDesktop = variant === 'desktop';
    const overlayWrapper =
      'absolute inset-0 opacity-100 pointer-events-none z-10 flex';

    if (useGlobalHover) {
      const height = variant === 'desktop' ? 'h-[97px]' : 'h-[88px]';
      const paddingX = variant === 'desktop' ? 'px-6' : 'px-3';
      const paddingY = variant === 'desktop' ? 'py-4' : 'py-2';
      const nameSize = variant === 'desktop' ? 'text-[22px] leading-[26px]' : 'text-[14px] leading-[18px]';
      const designationSize = variant === 'desktop' ? 'text-[14px] leading-[17px]' : 'text-[11px] leading-[14px]';
      return (
        <div className={`${overlayWrapper} ${isDesktop ? 'items-end' : ''}`}>
          <div className={`absolute inset-x-0 bottom-0 ${height} bg-[#653A96] border-t border-black ${paddingX} ${paddingY} flex flex-col gap-1.5 text-white`}>
            <p className={`font-normal tracking-[-0.04em] ${nameSize}`}>
              {leader.name}
            </p>
            <p className={`font-normal ${designationSize}`}>
              {leader.designation}
            </p>
          </div>
        </div>
      );
    }

    if (useStateHover) {
      const height = variant === 'desktop' ? 'h-[112px]' : 'h-[105px]';
      const paddingX = variant === 'desktop' ? 'px-6' : 'px-3';
      const paddingY = variant === 'desktop' ? 'py-4' : 'py-2';
      const gap = variant === 'desktop' ? 'gap-2.5' : 'gap-1';
      const nameSize = variant === 'desktop' ? 'text-[22px] leading-[26px]' : 'text-[14px] leading-[18px]';
      const designationSize = variant === 'desktop' ? 'text-[14px] leading-[17px]' : 'text-[11px] leading-[14px]';
      return (
        <div className={`${overlayWrapper} ${isDesktop ? 'items-end' : ''}`}>
          <div className={`absolute inset-x-0 bottom-0 ${height} bg-[#653A96] border-t border-black ${paddingX} ${paddingY} flex flex-col ${gap} text-white`}>
            <p className={`font-normal tracking-[-0.04em] ${nameSize}`}>
              {leader.name}
            </p>
            <p className={`font-normal ${designationSize}`}>
              {leader.designation}
            </p>
            <CountryBadge label={getLeaderLocation(leader)} />
          </div>
        </div>
      );
    }

    return (
      <div className={`${overlayWrapper} items-end justify-between p-6 md:p-6 p-4 bg-[#653a96]/70`}>
        <div className="text-white">
          <h3 className="text-lg md:text-lg text-base font-medium mb-1">{leader.name}</h3>
          <p className="text-sm md:text-sm text-xs opacity-90 mb-2">{leader.designation}</p>
          <span className="text-xs md:text-xs text-xs opacity-75">{getLeaderLocation(leader)}</span>
        </div>
        <div className="flex items-end">
          <svg className="w-6 h-6 md:w-6 md:h-6 w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    );
  };

  const renderMobileLeaderCard = (leader) => (
    <div 
      key={leader.id}
      onClick={() => handleLeaderClick(leader)}
      className="relative group cursor-pointer w-[174px] h-[280px] border border-black overflow-hidden"
    >
      <Image
        src={leader.image_url || leader.image || '/assets/placeholder-leader.png'}
        alt={leader.name}
        fill
        className="object-cover object-[center_top] group-hover:scale-105 transition-transform duration-300"
        quality={90}
        sizes="174px"
        priority={false}
      />
      {renderHoverOverlay(leader, 'mobile')}
    </div>
  );
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLeaderClick = (leader) => {
    // Use the slug from the database if available, otherwise create one
    const slug = leader.slug || leader.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
    router.push(`/leadership/${slug}`);
  };

  const handleCategoryChange = (newCategory) => {
    const categoryMap = {
      'Global Ambassadors': 'global-ambassadors',
      'Regional & Country Presidents': 'regional-presidents',
      'State Presidents': 'state-presidents',
      'Global Secretariat': 'global-secretariat'
    };
    
    const categorySlug = categoryMap[newCategory];
    if (categorySlug) {
      router.push(`/leadership/category/${categorySlug}`);
    }
  };

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

  if (error) {
    return (
      <SimpleLayout title={t('leaders.error')}>
        <div className="p-8">
          <div className="text-center py-12">
            <div className="text-red-500 text-lg mb-4">{t('leaders.error')}: {error}</div>
            <button 
              onClick={() => window.location.reload()}
              className="text-[#653a96] hover:underline"
            >
              {t('common.tryAgain')}
            </button>
          </div>
        </div>
      </SimpleLayout>
    );
  }

  if (leaders.length === 0) {
    return (
      <SimpleLayout title={t('leaders.none')}>
        <div className="p-8">
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">{t('leaders.none')}</div>
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

  const categoryTitle = category === 'global-ambassadors' ? 'Global Ambassadors' :
                       category === 'regional-presidents' ? 'Regional & Country Presidents' :
                       category === 'state-presidents' ? 'State Presidents' :
                       category === 'global-secretariat' ? 'Global Secretariat' :
                       'Leadership';

  const translatedCategoryTitle =
    categoryTitle === 'Global Ambassadors' ? t('expandedNav.globalAmbassadors') :
    categoryTitle === 'Regional & Country Presidents' ? t('expandedNav.regionalPresidents') :
    categoryTitle === 'State Presidents' ? t('expandedNav.statePresidents') :
    categoryTitle === 'Global Secretariat' ? t('expandedNav.globalSecretariat') :
    t('navbar.leadership');

  const rawLeadershipTitle = t('navbar.leadership');
  const leadershipTitle = rawLeadershipTitle
    ? rawLeadershipTitle.charAt(0).toUpperCase() + rawLeadershipTitle.slice(1).toLowerCase()
    : 'Leadership';

  return (
    <SimpleLayout title={translatedCategoryTitle}>
      <div className="md:p-8 md:pb-20 p-0 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 md:mb-8 mb-4 md:px-0 px-4 pt-4">
            {/* Breadcrumb */}
            <div className="hidden md:flex text-base mb-6 justify-center px-0">
              <nav className="flex items-center justify-center md:justify-center justify-start space-x-2 md:space-x-2 space-x-1 overflow-x-auto whitespace-nowrap" aria-label="Breadcrumb">
                <Link 
                  href="/" 
                  className="text-gray-600 hover:text-[#653a96] transition-colors duration-200 text-sm md:text-base text-xs whitespace-nowrap flex-shrink-0"
                >
                  {t('common.home')}
                </Link>
                <span className="text-gray-400 md:text-gray-400 text-gray-300 flex-shrink-0" aria-hidden="true">&gt;</span>
                <Link 
                  href="/leadership" 
                  className="text-gray-600 hover:text-[#653a96] transition-colors duration-200 text-sm md:text-base text-xs whitespace-nowrap flex-shrink-0"
                >
                  {leadershipTitle}
                </Link>
                <span className="text-gray-400 md:text-gray-400 text-gray-300 flex-shrink-0" aria-hidden="true">&gt;</span>
                <span className="text-gray-800 font-medium text-sm md:text-base text-xs whitespace-nowrap truncate max-w-[150px] md:max-w-none flex-shrink-0" aria-current="page">
                  {translatedCategoryTitle}
                </span>
              </nav>
            </div>

            {/* Page Title */}
            <h1 
              className="text-4xl md:text-4xl text-2xl text-gray-800"
              style={{
                fontFamily: 'DM Serif Display, serif',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '42px',
                lineHeight: '58px',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility'
              }}
            >
              {translatedCategoryTitle}
            </h1>
          </div>

          {/* Category Tabs */}
          <div className="mb-12 md:mb-12 mb-6 overflow-x-auto md:overflow-x-visible scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="flex justify-center md:justify-center justify-start gap-3 md:gap-4 min-w-max md:min-w-0 px-4 md:px-0">
              {['Global Ambassadors', 'Regional & Country Presidents', 'State Presidents', 'Global Secretariat'].map((cat, index) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-2.5 md:px-6 md:py-3 text-xs md:text-base font-medium transition-all duration-200 relative whitespace-nowrap flex-shrink-0 ${
                    categoryTitle === cat
                      ? 'bg-[#fecb07] text-[#171717] border-2 border-gray-800 rounded-2xl font-medium text-sm md:text-3xl'
                      : 'bg-transparent text-[#171717] hover:bg-gray-50'
                  }`}
                  style={{
                    fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'
                  }}
                >
                  {cat === 'Global Ambassadors' ? t('expandedNav.globalAmbassadors') :
                   cat === 'Regional & Country Presidents' ? t('expandedNav.regionalPresidents') :
                   cat === 'State Presidents' ? t('expandedNav.statePresidents') :
                   t('expandedNav.globalSecretariat')}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Leaders Grid - 3x3 Layout */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0.2 md:gap-0.2 border border-white max-w-5xl mx-auto">
            {displayedLeaders.map((leader) => (
              <div 
                key={leader.id}
                onClick={() => handleLeaderClick(leader)}
                className="relative group cursor-pointer"
              >
                {/* Leader Image */}
                <div className="relative w-full h-[450px] md:h-[450px] overflow-hidden border border-black bg-gray-100">
                  <Image
                    src={leader.image_url || leader.image || '/assets/placeholder-leader.png'}
                    alt={leader.name}
                    fill
                    className="object-cover object-[center_top] group-hover:scale-105 transition-transform duration-300"
                    quality={90}
                    sizes="(max-width: 768px) 200px, 400px"
                    priority={false}
                  />
                  
                  {/* Hover Overlay */}
                  {renderHoverOverlay(leader, 'desktop')}
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Leaders Grid - 2x2 Layout (348px width, 174px each) */}
          <div className="md:hidden flex flex-col items-center w-full">
            <div className="w-[348px] flex flex-col gap-0">
              {displayedLeaders.length > 0 && (
                <div className="flex flex-row gap-0">
                  {displayedLeaders.slice(0, 2).map(renderMobileLeaderCard)}
                </div>
              )}
              {displayedLeaders.length > 2 && (
                <div className="flex flex-row gap-0">
                  {displayedLeaders.slice(2, 4).map(renderMobileLeaderCard)}
                </div>
              )}
              {displayedLeaders.length > 4 && (
                <div className="flex flex-row gap-0">
                  {displayedLeaders.slice(4, 6).map(renderMobileLeaderCard)}
                </div>
              )}
              {displayedLeaders.length > 6 && (
                <div className="flex flex-row gap-0">
                  {displayedLeaders.slice(6, 8).map(renderMobileLeaderCard)}
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
          {!loading && !error && leaders.length > leadersPerPage && (
            <div className="flex justify-center mt-12">
              <div className="flex items-center space-x-4">
                {/* Previous Button */}
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200 ${
                    currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-200 ${
                        currentPage === page
                          ? 'bg-[#653a96] text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                {/* Next Button */}
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200 ${
                    currentPage === totalPages 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </SimpleLayout>
  );
}
