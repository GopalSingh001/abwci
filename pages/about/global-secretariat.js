import PageLayout from './components/PageLayout';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useLeadersByCategory } from '../../lib/useLeaders';
import { useLanguage } from '../../lib/LanguageContext';

export default function GlobalSecretariat() {
  const { t } = useLanguage();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const leadersPerPage = 9;
  const [allLeaders, setAllLeaders] = useState([]);
  const [fallbackLoading, setFallbackLoading] = useState(false);

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

  // Sort helpers: prefer admin-defined order fields; fallback to designation-based priority
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
    return 100;
  };

  const sortLeaders = (arr = []) =>
    [...arr].sort((a, b) => {
      // First, check for Global Secretariat custom order
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

  // Static fallback data when backend is not available
  const staticFallbackLeaders = [
    {
      id: 1,
      name: "Noor Jinmediah",
      designation: "Global Head",
      image: "/assets/global-leaders/global-1.png",
      image_url: "/assets/global-leaders/global-1.png",
      country: "Global"
    },
    {
      id: 2,
      name: "Dr. Sarah Johnson",
      designation: "Executive Director",
      image: "/assets/global-leaders/global-2.png",
      image_url: "/assets/global-leaders/global-2.png",
      country: "Global"
    },
    {
      id: 3,
      name: "Maria Rodriguez",
      designation: "Deputy Director",
      image: "/assets/global-leaders/global-3.png",
      image_url: "/assets/global-leaders/global-3.png",
      country: "Global"
    },
    {
      id: 4,
      name: "Dr. Aisha Patel",
      designation: "Program Director",
      image: "/assets/global-leaders/global-4.png",
      image_url: "/assets/global-leaders/global-4.png",
      country: "Global"
    },
    {
      id: 5,
      name: "Jennifer Chen",
      designation: "Operations Manager",
      image: "/assets/global-leaders/global-5.png",
      image_url: "/assets/global-leaders/global-5.png",
      country: "Global"
    },
    {
      id: 6,
      name: "Dr. Fatima Al-Zahra",
      designation: "Strategic Advisor",
      image: "/assets/global-leaders/global-6.png",
      image_url: "/assets/global-leaders/global-6.png",
      country: "Global"
    },
    {
      id: 7,
      name: "Amanda Thompson",
      designation: "Communications Lead",
      image: "/assets/global-leaders/global-1.png",
      image_url: "/assets/global-leaders/global-1.png",
      country: "Global"
    },
    {
      id: 8,
      name: "Dr. Lisa Wang",
      designation: "Regional Coordinator",
      image: "/assets/global-leaders/global-2.png",
      image_url: "/assets/global-leaders/global-2.png",
      country: "Global"
    },
    {
      id: 9,
      name: "Sophie Martinez",
      designation: "Partnership Manager",
      image: "/assets/global-leaders/global-3.png",
      image_url: "/assets/global-leaders/global-3.png",
      country: "Global"
    }
  ];

  // Fetch Global Secretariat leaders from API
  const { leaders: globalSecretariatLeaders, loading, error } = useLeadersByCategory('Global Secretariat');
  
  // Fetch all leaders as fallback when backend is available
  useEffect(() => {
    const fetchAllLeaders = async () => {
      try {
        setFallbackLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/leaders?limit=100`);
        const data = await response.json();
        if (data.success) {
          setAllLeaders(data.data);
        }
      } catch (err) {
        console.error('Error fetching all leaders:', err);
        // If API fails, use static fallback
        setAllLeaders(staticFallbackLeaders);
      } finally {
        setFallbackLoading(false);
      }
    };

    // Only fetch all leaders if no Global Secretariat leaders are found
    if (!loading && globalSecretariatLeaders.length === 0) {
      fetchAllLeaders();
    }
  }, [loading, globalSecretariatLeaders.length]);

  // Use Global Secretariat leaders if available, otherwise use all leaders or static fallback
  const leadersRaw = globalSecretariatLeaders.length > 0 ? globalSecretariatLeaders : (allLeaders.length > 0 ? allLeaders : staticFallbackLeaders);
  const leaders = sortLeaders(leadersRaw);
  const isLoading = loading || (globalSecretariatLeaders.length === 0 && fallbackLoading);

  // Calculate pagination
  const totalPages = Math.ceil(leaders.length / leadersPerPage);
  const startIndex = (currentPage - 1) * leadersPerPage;
  const endIndex = startIndex + leadersPerPage;
  const displayedLeaders = leaders.slice(startIndex, endIndex);

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

  if (isLoading) {
    return (
      <PageLayout title={t('expandedNav.globalSecretariat')} showHeaderButton={false}>
        <div className="p-8">
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">{t('leaders.loading')}</div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title={t('expandedNav.globalSecretariat')} showHeaderButton={false}>
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
      </PageLayout>
    );
  }

  return (
    <PageLayout title={t('expandedNav.globalSecretariat')} showHeaderButton={false}>
      <div className="md:p-8 md:pb-20 pt-6 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Desktop Leaders Grid - 3x3 Layout */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0.2 md:gap-0.2 border border-white md:border-0 max-w-5xl mx-auto">
            {displayedLeaders.map((leader) => (
              <div 
                key={leader.id}
                onClick={() => handleLeaderClick(leader)}
                className="relative group cursor-pointer"
              >
                {/* Leader Image */}
                <div className="relative w-full h-[450px] md:h-[450px] overflow-hidden border border-black bg-gray-100">
                <Image
                    src={leader.image_url || leader.image || ''}
                  alt={leader.name}
                  fill
                  className="object-cover object-[center_top] group-hover:scale-105 transition-transform duration-300"
                  quality={90}
                  sizes="(max-width: 768px) 200px, 400px"
                  priority={false}
                />
                
                  {/* Fixed Overlay */}
                  <div className="absolute inset-0 opacity-100">
                    <div className="absolute inset-x-0 bottom-0 h-[97px] bg-[#653A96] border-t border-black px-6 py-4 flex flex-col gap-2 text-white">
                      <p className="font-normal tracking-[-0.04em] text-[22px] leading-[26px]">
                        {leader.name}
                      </p>
                      <p className="font-normal text-[14px] leading-[17px]">
                        {leader.designation}
                      </p>
                    </div>
                  </div>
              </div>
            </div>
            ))}
        </div>

          {/* Mobile Leaders Grid - 2x2 Layout (348px width, 174px each) */}
          <div className="md:hidden flex flex-col items-center w-full">
            <div className="w-[348px] flex flex-col gap-0">
              {/* Row 1 */}
              {displayedLeaders.length > 0 && (
                <div className="flex flex-row gap-0">
                  {displayedLeaders.slice(0, 2).map((leader) => (
                    <div 
                      key={leader.id}
                      onClick={() => handleLeaderClick(leader)}
                      className="relative group cursor-pointer w-[174px] h-[280px] border border-black overflow-hidden"
                    >
                      <Image
                        src={leader.image_url || leader.image || ''}
                        alt={leader.name}
                        fill
                        className="object-cover object-[center_top] group-hover:scale-105 transition-transform duration-300"
                        quality={90}
                        sizes="174px"
                        priority={false}
                      />
                      <div className="absolute inset-0 opacity-100">
                        <div className="absolute inset-x-0 bottom-0 h-[88px] bg-[#653A96] border-t border-black px-3 py-2 flex flex-col gap-1.5 text-white">
                          <p className="font-normal tracking-[-0.04em] text-[14px] leading-[18px]">
                            {leader.name}
                          </p>
                          <p className="font-normal text-[11px] leading-[14px]">
                            {leader.designation}
                          </p>
                        </div>
                      </div>
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
                      className="relative group cursor-pointer w-[174px] h-[280px] border border-black overflow-hidden"
                    >
                      <Image
                        src={leader.image_url || leader.image || ''}
                        alt={leader.name}
                        fill
                        className="object-cover object-[center_top] group-hover:scale-105 transition-transform duration-300"
                        quality={90}
                        sizes="174px"
                        priority={false}
                      />
                      <div className="absolute inset-0 opacity-100">
                        <div className="absolute inset-x-0 bottom-0 h-[88px] bg-[#653A96] border-t border-black px-3 py-2 flex flex-col gap-1.5 text-white">
                          <p className="font-normal tracking-[-0.04em] text-[14px] leading-[18px]">
                            {leader.name}
                          </p>
                          <p className="font-normal text-[11px] leading-[14px]">
                            {leader.designation}
                          </p>
                        </div>
                      </div>
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
                      className="relative group cursor-pointer w-[174px] h-[280px] border border-black overflow-hidden"
                    >
                      <Image
                        src={leader.image_url || leader.image || ''}
                        alt={leader.name}
                        fill
                        className="object-cover object-[center_top] group-hover:scale-105 transition-transform duration-300"
                        quality={90}
                        sizes="174px"
                        priority={false}
                      />
                      <div className="absolute inset-0 opacity-100">
                        <div className="absolute inset-x-0 bottom-0 h-[88px] bg-[#653A96] border-t border-black px-3 py-2 flex flex-col gap-1.5 text-white">
                          <p className="font-normal tracking-[-0.04em] text-[14px] leading-[18px]">
                            {leader.name}
                          </p>
                          <p className="font-normal text-[11px] leading-[14px]">
                            {leader.designation}
                          </p>
                        </div>
                      </div>
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
                      className="relative group cursor-pointer w-[174px] h-[280px] border border-black overflow-hidden"
                    >
                      <Image
                        src={leader.image_url || leader.image || ''}
                        alt={leader.name}
                        fill
                        className="object-cover object-[center_top] group-hover:scale-105 transition-transform duration-300"
                        quality={90}
                        sizes="174px"
                        priority={false}
                      />
                      <div className="absolute inset-0 opacity-100">
                        <div className="absolute inset-x-0 bottom-0 h-[88px] bg-[#653A96] border-t border-black px-3 py-2 flex flex-col gap-1.5 text-white">
                          <p className="font-normal tracking-[-0.04em] text-[14px] leading-[18px]">
                            {leader.name}
                          </p>
                          <p className="font-normal text-[11px] leading-[14px]">
                            {leader.designation}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
          {!isLoading && !error && leaders.length > leadersPerPage && (
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
          {!isLoading && !error && leaders.length === 0 && (
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
    </PageLayout>
  );
}
