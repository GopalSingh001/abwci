import SimpleLayout from '../components/SimpleLayout';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { usePostsByPage, useFeaturedPosts, usePostsByCategory } from '../../../lib/usePosts';
import { useLanguage } from '../../../lib/LanguageContext';

export default function Blog() {
  const { t } = useLanguage();
  const [blogImage, setBlogImage] = useState(null);
  
  // Fetch blog page image
  useEffect(() => {
    const fetchBlogImage = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page-images`);
        if (response.ok) {
          const data = await response.json();
          const blogPageImage = data.data?.find(img => img.page_name === 'blog' && img.is_active);
          if (blogPageImage?.image_url) {
            setBlogImage(blogPageImage.image_url);
          }
        }
      } catch (error) {
        console.log('Error fetching blog page image:', error);
      }
    };
    fetchBlogImage();
  }, []);

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
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Blog categories - original names
  const blogCategories = [
    'All',
    'Retail & E-commerce',
    'Customer Experience', 
    'Leadership & Workplace Culture',
    'Entrepreneurship'
  ];

  // Filter out posts without valid images
  const postsWithValidImages = (posts) => {
    return posts.filter(post => {
      const hasThumbnail = post.post_thumbnail_url && post.post_thumbnail_url.trim() !== '';
      const hasBanner = post.post_banner_url && post.post_banner_url.trim() !== '';
      return hasThumbnail || hasBanner;
    });
  };

  // Fetch more blogs for News Trends section to ensure we get 2 with valid images
  const { posts: rawNewsTrends, loading: newsTrendsLoading, error: newsTrendsError } = usePostsByPage('blogs', 10);
  
  // Filter news trends to only include those with valid images and limit to 2
  const newsTrends = postsWithValidImages(rawNewsTrends).slice(0, 2);

  // Fetch all blogs once - increased limit to get all available blogs
  const { posts: allBlogs, loading: blogsLoading, error: blogsError } = usePostsByPage('blogs', 50);
  
  // Filter blogs locally based on selected category
  const filteredBlogs = selectedCategory === 'All' 
    ? postsWithValidImages(allBlogs)
    : postsWithValidImages(allBlogs).filter(blog => {
        const title = blog.post_title.toLowerCase();
        switch (selectedCategory) {
          case 'Retail & E-commerce':
            return title.includes('retail') || title.includes('ecommerce') || title.includes('e-commerce') || title.includes('online') || title.includes('digital');
          case 'Customer Experience':
            return title.includes('customer') || title.includes('experience') || title.includes('service') || title.includes('satisfaction');
          case 'Leadership & Workplace Culture':
            return title.includes('leadership') || title.includes('workplace') || title.includes('culture') || title.includes('women') || title.includes('excellence') || title.includes('team');
          case 'Entrepreneurship':
            return title.includes('entrepreneur') || title.includes('business') || title.includes('startup') || title.includes('certification') || title.includes('trademark');
          default:
            return true;
        }
      });

  const filteredArticles = filteredBlogs.slice(0, 4);  // Show up to 4 articles

  const handleArticleClick = (article) => {
    // If article has no description, redirect to register link
    if (!article.post_desc || article.post_desc.trim() === '') {
      if (article.post_register_link) {
        window.open(article.post_register_link, '_blank');
        return;
      }
    }
    
    // Otherwise, navigate to the blog detail page
    router.push(`/knowledge/blog/${article.id}`);
  };

  return (
    <SimpleLayout title={t('expandedNav.blogs')}>
      <div className="relative">
        {/* Hero Banner Section */}
        <div
          className="relative w-full h-[480px] md:h-[500px] lg:h-[580px] overflow-hidden"
          style={{
            backgroundImage: blogImage
              ? `linear-gradient(180deg, rgba(101, 58, 150, 0) 42.79%, rgb(131, 93, 173) 90.62%), url('${blogImage}')`
              : 'linear-gradient(180deg, rgba(101, 58, 150, 0) 42.79%, rgb(131, 93, 173) 90.62%)',
            // Full‑width hero image (may crop a bit top/bottom on some screens)
            backgroundSize: 'cover',
            backgroundPosition: '50% 40%',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'scroll',
            backgroundColor: '#653A96',
          }}
        >
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
                    {t('expandedNav.knowledgeHub')} &gt; {t('expandedNav.blogs')}
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
                    {t('expandedNav.blogs')}
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
                  {t('expandedNav.blogs')}
                </h1>
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2 md:gap-3">
                <button
                  onClick={() => setSelectedCategory('Retail & E-commerce')}
                  className={`px-3 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-colors duration-200 text-xs md:text-sm ${
                    selectedCategory === 'Retail & E-commerce'
                      ? 'bg-white/20 text-white border border-white'
                      : 'border border-white text-white hover:bg-white/10'
                  }`}
                  style={{
                    fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                    fontWeight: 500,
                    lineHeight: '18px'
                  }}
                >
                  Retail & E-commerce
                </button>
                <button
                  onClick={() => setSelectedCategory('Customer Experience')}
                  className={`px-3 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-colors duration-200 text-xs md:text-sm ${
                    selectedCategory === 'Customer Experience'
                      ? 'bg-white/20 text-white border border-white'
                      : 'border border-white text-white hover:bg-white/10'
                  }`}
                  style={{
                    fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                    fontWeight: 500,
                    lineHeight: '18px'
                  }}
                >
                  Customer Experience
                </button>
                <button
                  onClick={() => setSelectedCategory('Leadership & Workplace Culture')}
                  className={`px-3 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-colors duration-200 text-xs md:text-sm ${
                    selectedCategory === 'Leadership & Workplace Culture'
                      ? 'bg-white/20 text-white border border-white'
                      : 'border border-white text-white hover:bg-white/10'
                  }`}
                  style={{
                    fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                    fontWeight: 500,
                    lineHeight: '18px'
                  }}
                >
                  Leadership & Culture
                </button>
                <button
                  onClick={() => setSelectedCategory('Entrepreneurship')}
                  className={`px-3 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-colors duration-200 text-xs md:text-sm ${
                    selectedCategory === 'Entrepreneurship'
                      ? 'bg-white/20 text-white border border-white'
                      : 'border border-white text-white hover:bg-white/10'
                  }`}
                  style={{
                    fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                    fontWeight: 500,
                    lineHeight: '18px'
                  }}
                >
                  Entrepreneurship
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 md:px-6 lg:px-8 pt-6 md:pt-8 pb-6 md:pb-8">
          <div className="grid lg:grid-cols-3 grid-cols-1 gap-6 md:gap-8 lg:gap-12">
            {/* Left Column - News Trends */}
            <div className="lg:col-span-2">
              {/* News Trends Section */}
              <div className="mt-4 md:mt-8">
                <h2 
                  className="text-lg md:text-xl font-medium text-gray-800 mb-4 md:mb-6"
                  style={{
                    fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                    fontWeight: 400,
                    lineHeight: '24px',
                    color: 'rgba(0, 0, 0, 0.9)'
                  }}
                >
                  {t('knowledge.newsTrends')}
                </h2>
                
                {/* Loading State */}
                {newsTrendsLoading && (
                  <div className="text-center py-8">
                    <div className="text-gray-500">{t('knowledge.loadingNewsTrends')}</div>
                  </div>
                )}

                {/* Error State */}
                {newsTrendsError && (
                  <div className="text-center py-8">
                    <div className="text-red-500 mb-4">{t('knowledge.error')}: {newsTrendsError}</div>
                    <button 
                      onClick={() => window.location.reload()}
                      className="text-[#653a96] hover:underline"
                    >
                      {t('common.tryAgain')}
                    </button>
                  </div>
                )}

                {/* News Trends Articles */}
                {!newsTrendsLoading && !newsTrendsError && (
                  <div className="space-y-6">
                    {newsTrends.slice(0, 2).map((article) => (
                      <div key={article.id} className="relative group cursor-pointer" onClick={() => handleArticleClick(article)}>
                        <div className="relative w-full h-[200px] md:h-[280px] lg:h-[300px] rounded-2xl md:rounded-3xl overflow-hidden">
                          {(article.post_banner_url && article.post_banner_url.trim() !== '') || (article.post_thumbnail_url && article.post_thumbnail_url.trim() !== '') ? (
                            <img
                              src={article.post_banner_url || article.post_thumbnail_url}
                              alt={article.post_title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.target.src = '/assets/mdi_blog.png';
                              }}
                            />
                          ) : (
                            <Image
                              src="/assets/mdi_blog.png"
                              alt={article.post_title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/30"></div>
                          
                          {/* Content Overlay */}
                          <div className="absolute inset-0 flex items-end justify-between p-4 md:p-6">
                            <div className="text-white flex-1 pr-3 md:pr-4">
                              <h3 
                                className="text-base md:text-xl lg:text-2xl font-medium leading-tight line-clamp-2"
                                style={{
                                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                                  fontWeight: 500,
                                  color: '#FFFFFF'
                                }}
                              >
                                {article.post_title}
                              </h3>
                            </div>
                            <div className="text-white flex-shrink-0">
                              <svg className="w-6 h-6 md:w-8 md:h-8" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.66634 15.5827H22.9072L14.988 7.66352L16.9997 5.66602L28.333 16.9993L16.9997 28.3327L15.0022 26.3352L22.9072 18.416H5.66634V15.5827Z" fill="currentColor"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Fallback message when no articles */}
                    {newsTrends.length === 0 && (
                      <div className="text-center py-8">
                        <div className="text-gray-500 mb-4">{t('knowledge.noNews')}</div>
                        <div className="text-sm text-gray-400">{t('knowledge.checkBack')}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

          {/* Right Column - Articles Sidebar */}
          <div className="lg:col-span-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 md:mb-8 mt-0 md:mt-8">
              <h3 
                className="text-base md:text-lg font-medium text-gray-700 opacity-70"
                style={{
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontWeight: 500,
                  lineHeight: '22px'
                }}
              >
                {t('knowledge.articles')} ({filteredArticles.length})
              </h3>
              <Link 
                href="/knowledge/blog/all-blogs" 
                className="text-[#653a96] text-sm font-medium flex items-center space-x-1 hover:underline"
                style={{
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontWeight: 500,
                  fontSize: '14px',
                  lineHeight: '17px'
                }}
              >
                <span className='underline text-sm md:text-base font-semibold'>{t('homepage.sections.seeAll')}</span>
                <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Loading State */}
            {blogsLoading && (
              <div className="text-center py-8">
                <div className="text-gray-500">{t('knowledge.loadingArticles')}</div>
              </div>
            )}

            {/* Error State */}
            {blogsError && (
              <div className="text-center py-8">
                <div className="text-red-500 mb-4">{t('knowledge.error')}: {blogsError}</div>
                <button 
                  onClick={() => window.location.reload()}
                  className="text-[#653a96] hover:underline"
                >
                  {t('common.tryAgain')}
                </button>
              </div>
            )}

            {/* Articles List */}
            {!blogsLoading && !blogsError && (
              <div className="space-y-0 flex flex-col" style={{ minHeight: 'auto' }}>
                {filteredArticles.map((article, index) => (
                  <div 
                    key={article.id} 
                    onClick={() => handleArticleClick(article)}
                    className="group cursor-pointer border-b border-[#D9D9D9] py-4 md:py-6 px-2 md:px-2.5 flex-1"
                    style={{ minHeight: 'auto' }}
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex-1">
                        <div 
                          className="text-xs md:text-sm text-gray-900 mb-2"
                          style={{
                            fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                            fontWeight: 400,
                            lineHeight: '17px',
                            color: 'rgba(0, 0, 0, 0.9)'
                          }}
                        >
                          {article.post_category}
                        </div>
                        <h4 
                          className="text-base md:text-xl lg:text-2xl font-medium text-gray-900 mb-2 group-hover:text-[#653a96] transition-colors duration-200 line-clamp-2"
                          style={{
                            fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                            fontWeight: 500,
                            lineHeight: '1.3',
                            color: 'rgba(0, 0, 0, 0.9)'
                          }}
                        >
                          {article.post_title}
                        </h4>
                        <p 
                          className="text-sm md:text-base text-gray-900 leading-relaxed line-clamp-2"
                          style={{
                            fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                            fontWeight: 400,
                            lineHeight: '19px',
                            color: 'rgba(0, 0, 0, 0.9)'
                          }}
                        >
                          {article.post_seo_title || article.post_short_desc}
                        </p>
                      </div>
                      <div className="ml-2 md:ml-4 flex-shrink-0">
                        <svg 
                          className="w-6 h-6 md:w-8 md:h-8 text-[#616161] group-hover:text-[#653a96] transition-colors duration-200" 
                          viewBox="0 0 34 34" 
                          fill="none" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M5.66634 15.5827H22.9072L14.988 7.66352L16.9997 5.66602L28.333 16.9993L16.9997 28.3327L15.0022 26.3352L22.9072 18.416H5.66634V15.5827Z" fill="currentColor"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          </div>
        </div>
      </div>
    </SimpleLayout>
  );
}