import PageLayout from './components/PageLayout';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePostsByPage } from '../../lib/usePosts';
import { useLanguage } from '../../lib/LanguageContext';

export default function Partnerships() {
  const { t } = useLanguage();
  const [showAll, setShowAll] = useState(false);
  const [pageImage, setPageImage] = useState(''); // Default fallback
  const [stats, setStats] = useState({
    activeMembers: 0,
    partnerships: 0,
    countryCount: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);
  
  // Filter out posts without valid images
  const postsWithValidImages = (posts) => {
    return posts.filter(post => {
      const hasThumbnail = post.post_thumbnail_url && post.post_thumbnail_url.trim() !== '';
      const hasBanner = post.post_banner_url && post.post_banner_url.trim() !== '';
      return hasThumbnail || hasBanner;
    });
  };

  // Fetch partnership data from API - Get all partners
  const { posts: rawPartnerships, loading: partnershipsLoading, error: partnershipsError } = usePostsByPage('partners', 50);
  
  // Filter partnerships to only include those with valid images
  const partnerships = postsWithValidImages(rawPartnerships);
  
  // Show first 14 partners initially (even number for better mobile display), then all if "More" is clicked
  const displayedPartnerships = showAll ? partnerships : partnerships.slice(0, 15);
  
  // Fetch statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        // Fetch member stats
        const membersResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/members/stats/summary`);
        if (membersResponse.ok) {
          const membersData = await membersResponse.json();
          if (membersData.success) {
            setStats(prev => ({
              ...prev,
              activeMembers: membersData.data?.total_members || 0,
              countryCount: membersData.data?.countries_represented || 0
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  // Update partnerships count when partnerships change
  useEffect(() => {
    setStats(prev => ({
      ...prev,
      partnerships: partnerships.length
    }));
  }, [partnerships.length]);

  // Fetch partnerships page image
  useEffect(() => {
    const fetchPageImage = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page-images`);
        if (response.ok) {
          const data = await response.json();
          const partnershipsImage = data.data?.find(img => img.page_name === 'partnerships' && img.is_active);
          if (partnershipsImage?.image_url) {
            setPageImage(partnershipsImage.image_url);
          }
        }
      } catch (error) {
        console.log('Error fetching page image, using fallback:', error);
      }
    };
    fetchPageImage();
  }, []);

  return (
    <PageLayout title={t('expandedNav.partnerships')} buttonText={t('partners.partnerWithUs')}>
      <div className="p-8 bg-white md:p-8 pt-0 md:pt-8 pb-4 px-4">
        {/* Content Sections */}
        <div className="space-y-4 md:space-y-4 space-y-0">
          {/* Statistics Section - Hidden on Mobile */}
          <div className="hidden md:block bg-gradient-to-r from-[#4f287b] via-[#653a96] to-[#391660] rounded-2xl p-8 text-white">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center justify-center space-x-4 px-4 flex-row">
                <div className="flex-shrink-0">
                  <Image
                    src="/assets/icon-park-outline_target.png"
                    alt="Target"
                    width={40}
                    height={40}
                    className="w-10 h-10"
                  />
                </div>
                <div className="flex flex-col text-center">
                  <p className="text-base opacity-90 mb-2">{t('partners.activeMembers')}</p>
                  <h3 className="text-3xl font-bold">
                    {statsLoading ? '...' : `${stats.activeMembers.toLocaleString()}+`}
                  </h3>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-4 px-4 flex-row">
                <div className="flex-shrink-0">
                  <Image
                    src="/assets/reket.png"
                    alt="Rocket"
                    width={40}
                    height={40}
                    className="w-10 h-10"
                  />
                </div>
                <div className="flex flex-col text-center">
                  <p className="text-base opacity-90 mb-2">{t('expandedNav.partnerships')}</p>
                  <h3 className="text-3xl font-bold">
                    {statsLoading ? '...' : `${stats.partnerships.toLocaleString()}+`}
                  </h3>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-4 px-4 flex-row">
                <div className="flex-shrink-0">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10"
                  >
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div className="flex flex-col text-center">
                  <p className="text-base opacity-90 mb-2">{t('Countries')}</p>
                  <h3 className="text-3xl font-bold">
                    {statsLoading ? '...' : `${stats.countryCount.toLocaleString()}+`}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Section - Text Left, Image Right */}
          <div className="bg-white rounded-2xl p-8 md:p-8 pt-0 md:pt-8 pb-0 px-4">
            <div className="grid md:grid-cols-[1fr_1.2fr] grid-cols-1 gap-8 md:gap-8 gap-6 items-start">
              {/* Left Side - Text Content */}
              <div>
                <h2 
                  className="text-4xl md:text-4xl text-2xl text-[#653a96] mb-6 md:mb-6 mb-4 font-bold md:-mt-2"
                  style={{
                    fontFamily: 'DM Serif Display, serif',
                    fontStyle: 'normal',
                    fontWeight: 700,
                    fontSize: '36px',
                    lineHeight: '49px',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textRendering: 'optimizeLegibility'
                  }}
                >
                  {t('partners.ourPartners')}
                </h2>
                <p className="text-gray-800 text-lg md:text-lg text-base leading-relaxed mb-4">
                  {t('partners.intro') || 'ABWCI collaborates with leading organizations worldwide to create meaningful partnerships that drive women\'s economic empowerment. Our strategic alliances span across governments, financial institutions, technology companies, and NGOs, providing our members with unparalleled access to resources, markets, and opportunities.'}
                </p>
                <p className="text-gray-800 text-lg md:text-lg text-base leading-relaxed mb-4">
                  {t('partners.description')}
                </p>
                <p className="text-gray-800 text-lg md:text-lg text-base leading-relaxed mb-6">
                  {t('partners.description2')}
                </p>
                {/* Partner with Us CTA Button */}
                <Link
                  href="/auth/login"
                  className="inline-flex items-center justify-center rounded-full hover:bg-yellow-400 transition-colors duration-200"
                  style={{
                    background: '#FECB07',
                    borderRadius: '30px',
                    padding: '12px 32px',
                    fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                    fontWeight: 500,
                    fontSize: '16px',
                    lineHeight: '20px',
                    color: '#171717',
                    textDecoration: 'none',
                    display: 'inline-block'
                  }}
                >
                  {t('partners.partnerWithUs')}
                </Link>
              </div>
              
              {/* Right Side - Image */}
              {pageImage && (
                <div className="relative w-full h-[400px] md:h-[450px] h-64 mx-auto rounded-3xl overflow-hidden shadow-lg">
                  <Image
                    src={pageImage}
                    alt={t('expandedNav.partnerships')}
                    fill
                    className="object-cover object-center"
                    priority
                    quality={90}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Partner Logos Grid */}
          <div className="bg-white rounded-2xl p-8 md:p-8 p-4 pt-4 md:pt-4">
            {/* Loading State */}
            {partnershipsLoading && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">{t('partners.loading')}</div>
              </div>
            )}

            {/* Error State */}
            {partnershipsError && (
              <div className="text-center py-12">
                <div className="text-red-500 text-lg mb-4">{t('partners.error')}: {partnershipsError}</div>
                <button 
                  onClick={() => window.location.reload()}
                  className="text-[#653a96] hover:underline"
                >
                  {t('common.tryAgain')}
                </button>
              </div>
            )}

            {/* All Partnerships Grid - Max 5 per row, Show 15 initially (odd number for mobile) */}
            {!partnershipsLoading && !partnershipsError && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-6 gap-4">
                  {displayedPartnerships.map((partnership) => (
                    <div 
                      key={partnership.id} 
                      className="text-center group cursor-pointer"
                      onClick={() => {
                        if (partnership.post_more_link) {
                          window.open(partnership.post_more_link, '_blank');
                        }
                      }}
                    >
                      <div className="w-32 h-32 md:w-32 md:h-32 w-24 h-24 mx-auto mb-3 bg-gray-50 rounded-2xl shadow-lg flex items-center justify-center p-4 group-hover:shadow-xl transition-all duration-300">
                        {(partnership.post_thumbnail_url && partnership.post_thumbnail_url.trim() !== '') || (partnership.post_banner_url && partnership.post_banner_url.trim() !== '') ? (
                          <img
                            src={partnership.post_thumbnail_url || partnership.post_banner_url}
                            alt={partnership.post_title}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.target.src = '/assets/mdi_blog.png';
                            }}
                          />
                        ) : (
                          <Image
                            src="/assets/mdi_blog.png"
                            alt={partnership.post_title}
                            width={120}
                            height={120}
                            className="w-full h-full object-contain"
                          />
                        )}
                      </div>
                      <p className="text-sm md:text-sm text-xs text-gray-700 font-semibold group-hover:text-[#653a96] transition-colors duration-200 leading-tight">{partnership.post_title}</p>
                    </div>
                  ))}
                </div>
                
                {/* More Button - Show only if there are more than 14 partners and not showing all */}
                {!showAll && partnerships.length > 15 && (
                  <div className="text-center mt-12 md:mt-16">
                    <button
                      onClick={() => setShowAll(true)}
                      className="bg-[#653a96] text-white px-4 py-2.5 md:px-8 md:py-3 rounded-full font-medium hover:bg-[#4f287b] transition-colors duration-200 shadow-lg hover:shadow-xl text-sm md:text-base"
                      style={{
                        fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                        fontWeight: 500,
                        minWidth: '160px'
                      }}
                    >
                      {t('partners.showMorePartners')} ({partnerships.length - 15} {t('stories.more')})
                    </button>
                  </div>
                )}
                
                {/* Show Less Button - Show only if showing all partners */}
                {showAll && partnerships.length > 15 && (
                  <div className="text-center mt-12 md:mt-16">
                    <button
                      onClick={() => setShowAll(false)}
                      className="bg-gray-500 text-white px-4 py-2.5 md:px-8 md:py-3 rounded-full font-medium hover:bg-gray-600 transition-colors duration-200 shadow-lg hover:shadow-xl text-sm md:text-base"
                      style={{
                        fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                        fontWeight: 500,
                        minWidth: '120px'
                      }}
                    >
                      {t('common.showLess')}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Fallback to static content if no partnerships from API */}
            {!partnershipsLoading && !partnershipsError && partnerships.length === 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center group">
                  <div className="w-40 h-40 mx-auto mb-4 bg-gray-50 rounded-3xl shadow-lg flex items-center justify-center p-6 group-hover:shadow-xl transition-all duration-300">
                    <Image
                      src="/assets/partner-1.png"
                      alt={t('partners.governmentAgencies')}
                      width={140}
                      height={140}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-base text-gray-700 font-semibold">{t('partners.governmentAgencies')}</p>
                </div>
                <div className="text-center group">
                  <div className="w-40 h-40 mx-auto mb-4 bg-gray-50 rounded-3xl shadow-lg flex items-center justify-center p-6 group-hover:shadow-xl transition-all duration-300">
                    <Image
                      src="/assets/partner-2.png"
                      alt={t('partners.financialInstitutions')}
                      width={140}
                      height={140}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-base text-gray-700 font-semibold">{t('partners.financialInstitutions')}</p>
                </div>
                <div className="text-center group">
                  <div className="w-40 h-40 mx-auto mb-4 bg-gray-50 rounded-3xl shadow-lg flex items-center justify-center p-6 group-hover:shadow-xl transition-all duration-300">
                    <Image
                      src="/assets/partner-3.png"
                      alt={t('partners.technologyCompanies')}
                      width={140}
                      height={140}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-base text-gray-700 font-semibold">{t('partners.technologyCompanies')}</p>
                </div>
                <div className="text-center group">
                  <div className="w-40 h-40 mx-auto mb-4 bg-gray-50 rounded-3xl shadow-lg flex items-center justify-center p-6 group-hover:shadow-xl transition-all duration-300">
                    <Image
                      src="/assets/partner-4.png"
                      alt={t('partners.ngosFoundations')}
                      width={140}
                      height={140}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-base text-gray-700 font-semibold">{t('partners.ngosFoundations')}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}