import SimpleLayout from '../knowledge/components/SimpleLayout';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useLeadersByCategory } from '../../lib/useLeaders';
import { useLanguage } from '../../lib/LanguageContext';

export default function Leadership() {
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
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('Global Ambassadors');
  const [currentPage, setCurrentPage] = useState(1);
  const leadersPerPage = 9;

  // Sort helpers shared with other pages: prefer admin-defined order; fallback to designation rank
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
    if (/(president)/.test(text)) return 11; // for president categories
    return 100;
  };

  const sortLeaders = (arr = []) =>
    [...arr].sort((a, b) => {
      const ao = getAdminOrder(a);
      const bo = getAdminOrder(b);
      if (ao !== null || bo !== null) {
        if (ao === null) return 1;
        if (bo === null) return -1;
        if (ao !== bo) return ao - bo;
      }
      const ar = getDesignationRank(a);
      const br = getDesignationRank(b);
      if (ar !== br) return ar - br;
      return (a.name || '').localeCompare(b.name || '');
    });

  // Leadership categories (internal values used for API); labels are translated for UI
  const leadershipCategories = [
    'Global Ambassadors',
    'Regional & Country Presidents', 
    'State Presidents',
    'Global Secretariat'
  ];

  const globalOverlayCategories = new Set([
    'Global Ambassadors',
    'Global Secretariat',
    'Global Presidents'
  ]);

  const stateOverlayCategories = new Set([
    'Regional & Country Presidents',
    'State Presidents'
  ]);

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'Global Ambassadors':
        return t('expandedNav.globalAmbassadors');
      case 'Regional & Country Presidents':
        return t('expandedNav.regionalPresidents');
      case 'State Presidents':
        return t('expandedNav.statePresidents');
      case 'Global Secretariat':
        return t('expandedNav.globalSecretariat');
      default:
        return category;
    }
  };

  // Fetch leaders for the selected category
  const { leaders: currentLeaders, loading, error } = useLeadersByCategory(selectedCategory);

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Apply sorting before pagination
  const sortedLeaders = sortLeaders(currentLeaders);
  // Calculate pagination
  const totalPages = Math.ceil(sortedLeaders.length / leadersPerPage);
  const startIndex = (currentPage - 1) * leadersPerPage;
  const endIndex = startIndex + leadersPerPage;
  const displayedLeaders = sortedLeaders.slice(startIndex, endIndex);
  const useGlobalHover = globalOverlayCategories.has(selectedCategory);
  const useStateHover = stateOverlayCategories.has(selectedCategory);

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
    'dc': 'US',
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
      .toUpperCase()
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
    if (useGlobalHover) {
      const height = variant === 'desktop' ? 'h-[97px]' : 'h-[88px]';
      const paddingX = variant === 'desktop' ? 'px-6' : 'px-4';
      const paddingY = variant === 'desktop' ? 'py-4' : 'py-3';
      return (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
          <div className={`absolute inset-x-0 bottom-0 ${height} bg-[#653A96] border-t border-black ${paddingX} ${paddingY} flex flex-col gap-2 text-white`}>
            <p className="font-normal tracking-[-0.04em] text-[22px] leading-[26px]">
              {leader.name}
            </p>
            <p className="font-normal text-[14px] leading-[17px]">
              {leader.designation}
            </p>
          </div>
        </div>
      );
    }

    if (useStateHover) {
      const height = variant === 'desktop' ? 'h-[112px]' : 'h-[96px]';
      const paddingX = variant === 'desktop' ? 'px-6' : 'px-4';
      const paddingY = variant === 'desktop' ? 'py-4' : 'py-3';
      const gap = variant === 'desktop' ? 'gap-2.5' : 'gap-2';
      return (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
          <div className={`absolute inset-x-0 bottom-0 ${height} bg-[#653A96] border-t border-black ${paddingX} ${paddingY} flex flex-col ${gap} text-white`}>
            <p className="font-normal tracking-[-0.04em] text-[22px] leading-[26px]">
              {leader.name}
            </p>
            <p className="font-normal text-[14px] leading-[17px]">
              {leader.designation}
            </p>
            <CountryBadge label={getLeaderLocation(leader)} />
          </div>
        </div>
      );
    }

    return (
      <div className="absolute inset-0 bg-[#653a96]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-6 md:p-6 p-4 pointer-events-none z-10">
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

  const handleLeaderClick = (leader) => {
    // Use the slug from the database if available, otherwise create one
    const slug = leader.slug || leader.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
    router.push(`/leadership/${slug}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const rawLeadershipTitle = t('navbar.leadership');
  const leadershipTitle = rawLeadershipTitle
    ? rawLeadershipTitle.charAt(0).toUpperCase() + rawLeadershipTitle.slice(1).toLowerCase()
    : 'Leadership';

  return (
    <SimpleLayout title={leadershipTitle}>
      <div className="md:p-8 md:pb-20 p-0 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 md:mb-8 mb-4 md:px-0 px-4 pt-4">
            {/* Breadcrumb */}
            <div className="hidden md:flex text-base mb-6 justify-center px-0">
              <nav className="flex items-center space-x-2 md:space-x-2 space-x-1 overflow-x-auto whitespace-nowrap" aria-label="Breadcrumb">
                <Link 
                  href="/" 
                  className="text-gray-600 hover:text-[#653a96] transition-colors duration-200 text-sm md:text-base text-xs whitespace-nowrap flex-shrink-0"
                >
                  {t('common.home')}
                </Link>
                <span className="text-gray-400 md:text-gray-400 text-gray-300 flex-shrink-0" aria-hidden="true">&gt;</span>
                <span className="text-gray-800 font-medium text-sm md:text-base text-xs whitespace-nowrap flex-shrink-0" aria-current="page">
                  {leadershipTitle}
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
              {leadershipTitle}
            </h1>
          </div>

          {/* Category Tabs */}
          <div className="mb-12 md:mb-12 mb-6 overflow-x-auto md:overflow-x-visible scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="flex justify-center md:justify-center justify-start gap-3 md:gap-4 min-w-max md:min-w-0 px-4 md:px-0">
              {leadershipCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2.5 md:px-6 md:py-3 text-xs md:text-base font-medium transition-all duration-200 relative whitespace-nowrap flex-shrink-0 ${
                    selectedCategory === category
                      ? 'bg-[#fecb07] text-[#171717] border-2 border-gray-800 rounded-2xl font-medium text-sm md:text-3xl'
                      : 'bg-transparent text-[#171717] hover:bg-gray-50'
                  }`}
                  style={{
                    fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'
                  }}
                >
                  {getCategoryLabel(category)}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">{t('leaders.loading')}</div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="text-red-500 text-lg mb-4">{t('leaders.error')}: {error}</div>
              <button 
                onClick={() => window.location.reload()}
                className="text-[#653a96] hover:underline"
              >
                {t('common.tryAgain')}
              </button>
            </div>
          )}

          {/* Desktop Leaders Grid - 3x3 Layout */}
          {!loading && !error && (
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0.2 md:gap-0.2 border border-white max-w-5xl mx-auto">
              {displayedLeaders.map((leader) => (
                <div 
                  key={leader.id}
                  onClick={() => handleLeaderClick(leader)}
                  className="relative group cursor-pointer"
                >
                  {/* Leader Image */}
                  <div className="relative w-full h-[450px] md:h-[450px] overflow-hidden border border-black">
                    <Image
                      src={leader.image_url || leader.image || '/assets/placeholder-leader.png'}
                      alt={leader.name}
                      fill
                      className="object-cover object-[center_top] group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Hover Overlay */}
                    {renderHoverOverlay(leader, 'desktop')}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mobile Leaders Grid - 2x2 Layout (348px width, 174px each) */}
          {!loading && !error && (
            <div className="md:hidden flex flex-col items-center w-full">
              <div className="w-[348px] flex flex-col gap-0">
                {displayedLeaders.length > 0 && (
                  <div className="flex flex-row gap-0">
                    {displayedLeaders.slice(0, 2).map((leader) => (
                      <div 
                        key={leader.id}
                        onClick={() => handleLeaderClick(leader)}
                        className="relative group cursor-pointer w-[174px] h-[220px] border border-black overflow-hidden"
                      >
                        <Image
                          src={leader.image_url || leader.image || '/assets/placeholder-leader.png'}
                          alt={leader.name}
                          fill
                          className="object-cover object-[center_top] group-hover:scale-105 transition-transform duration-300"
                        />
                        {renderHoverOverlay(leader, 'mobile')}
                      </div>
                    ))}
                  </div>
                )}
                {displayedLeaders.length > 2 && (
                  <div className="flex flex-row gap-0">
                    {displayedLeaders.slice(2, 4).map((leader) => (
                      <div 
                        key={leader.id}
                        onClick={() => handleLeaderClick(leader)}
                        className="relative group cursor-pointer w-[174px] h-[220px] border border-black overflow-hidden"
                      >
                        <Image
                          src={leader.image_url || leader.image || '/assets/placeholder-leader.png'}
                          alt={leader.name}
                          fill
                          className="object-cover object-[center_top] group-hover:scale-105 transition-transform duration-300"
                        />
                        {renderHoverOverlay(leader, 'mobile')}
                      </div>
                    ))}
                  </div>
                )}
                {displayedLeaders.length > 4 && (
                  <div className="flex flex-row gap-0">
                    {displayedLeaders.slice(4, 6).map((leader) => (
                      <div 
                        key={leader.id}
                        onClick={() => handleLeaderClick(leader)}
                        className="relative group cursor-pointer w-[174px] h-[220px] border border-black overflow-hidden"
                      >
                        <Image
                          src={leader.image_url || leader.image || '/assets/placeholder-leader.png'}
                          alt={leader.name}
                          fill
                          className="object-cover object-[center_top] group-hover:scale-105 transition-transform duration-300"
                        />
                        {renderHoverOverlay(leader, 'mobile')}
                      </div>
                    ))}
                  </div>
                )}
                {displayedLeaders.length > 6 && (
                  <div className="flex flex-row gap-0">
                    {displayedLeaders.slice(6, 8).map((leader) => (
                      <div 
                        key={leader.id}
                        onClick={() => handleLeaderClick(leader)}
                        className="relative group cursor-pointer w-[174px] h-[220px] border border-black overflow-hidden"
                      >
                        <Image
                          src={leader.image_url || leader.image || '/assets/placeholder-leader.png'}
                          alt={leader.name}
                          fill
                          className="object-cover object-[center_top] group-hover:scale-105 transition-transform duration-300"
                        />
                        {renderHoverOverlay(leader, 'mobile')}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && currentLeaders.length > leadersPerPage && (
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

          {/* No Leaders Message */}
          {!loading && !error && currentLeaders.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">{t('leaders.none')}</h3>
              <p className="text-gray-600">{t('leaders.noneDesc')}</p>
            </div>
          )}
        </div>
      </div>
    </SimpleLayout>
  );
}
