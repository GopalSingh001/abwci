import SimpleLayout from '../components/SimpleLayout';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { usePostsByPage, usePostsByCategory } from '../../../lib/usePosts';
import { useLanguage } from '../../../lib/LanguageContext';

export default function AllBlogs() {
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
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Blog categories
  const blogCategories = [
    'All',
    'Retail & E-commerce',
    'Customer Experience', 
    'Leadership & Workplace Culture',
    'Entrepreneurship'
  ];

  // Fetch ALL blogs from API - show everything like admin panel
  const { posts: rawAllBlogs, loading: blogsLoading, error: blogsError } = usePostsByPage('blogs', 100);
  
  // Show all blogs without any filtering
  const allBlogs = rawAllBlogs;

  // Filter blogs based on category and search
  const filteredArticles = allBlogs.filter(article => {
    const matchesCategory = selectedCategory === 'All' || article.post_category === selectedCategory;
    const matchesSearch = article.post_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (article.post_short_desc && article.post_short_desc.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

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
    <SimpleLayout title={t('knowledge.allBlogs')}>
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-4 md:mb-6 lg:mb-8">
          {/* Go Back Button */}
          <div className="mb-4 md:mb-6">
            <button 
              onClick={() => window.history.back()}
              className="flex items-center space-x-2 md:space-x-3 text-gray-700 hover:text-[#653a96] transition-all duration-300"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm md:text-base lg:text-lg font-medium">{t('common.goBack')}</span>
            </button>
          </div>

          {/* Breadcrumb and Title */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-0 mb-4 md:mb-6 lg:mb-8">
            <div>
              {/* Breadcrumb - Hidden on Mobile */}
              <div className="hidden md:block text-base mb-4">
                <nav className="flex items-center space-x-2" aria-label="Breadcrumb">
                  <Link 
                    href="/" 
                    className="text-gray-600 hover:text-[#653a96] transition-colors duration-200"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '19px'
                    }}
                  >
                    {t('common.home')}
                  </Link>
                  <span 
                    className="text-gray-400" 
                    aria-hidden="true"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontSize: '16px'
                    }}
                  >
                    &gt;
                  </span>
                  <Link 
                    href="#" 
                    className="text-gray-600 hover:text-[#653a96] transition-colors duration-200"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '19px'
                    }}
                  >
                    {t('expandedNav.knowledgeHub')}
                  </Link>
                  <span 
                    className="text-gray-400" 
                    aria-hidden="true"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontSize: '16px'
                    }}
                  >
                    &gt;
                  </span>
                  <span 
                    className="text-gray-800 font-medium" 
                    aria-current="page"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontWeight: 500,
                      fontSize: '16px',
                      lineHeight: '19px'
                    }}
                  >
                    {t('expandedNav.blogs')}
                  </span>
                </nav>
              </div>

              {/* Page Title */}
              <div className="flex items-center space-x-2 md:space-x-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Image src="/assets/mdi_blog.png" alt="Blog" width={48} height={48} className="w-8 h-8 md:w-12 md:h-12" />
                </div>
                <h1 
                  className="text-2xl md:text-3xl lg:text-[42px] text-gray-800"
                  style={{
                    fontFamily: 'DM Serif Display',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '1.3',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textRendering: 'optimizeLegibility'
                  }}
                >
                  {t('expandedNav.blogs')}
                </h1>
              </div>
            </div>

            {/* Search Bar */}
            <div className="bg-gray-100 border border-gray-400 rounded-2xl md:rounded-3xl px-4 md:px-6 py-3 md:py-4 flex items-center space-x-2 md:space-x-3 w-full lg:w-auto lg:min-w-[320px]">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder={t('knowledge.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent text-gray-800 placeholder-gray-600 focus:outline-none text-sm md:text-base lg:text-lg"
              />
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 md:gap-3 mb-6 md:mb-8 lg:mb-12">
          {blogCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-2 md:px-4 md:py-2.5 lg:px-5 lg:py-3 rounded-lg text-xs md:text-sm font-medium transition-colors duration-200 ${
                selectedCategory === category
                  ? 'bg-[#653a96] text-white'
                  : 'border border-[#653a96] text-[#653a96] hover:bg-[#653a96] hover:text-white'
              }`}
              style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontWeight: 500,
                lineHeight: '18px'
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {blogsLoading && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">{t('knowledge.loadingBlogs')}</div>
          </div>
        )}

        {/* Error State */}
        {blogsError && (
          <div className="text-center py-12">
            <div className="text-red-500 text-lg mb-4">{t('knowledge.error')}: {blogsError}</div>
            <button 
              onClick={() => window.location.reload()}
              className="text-[#653a96] hover:underline"
            >
              {t('common.tryAgain')}
            </button>
          </div>
        )}

        {/* Articles Grid - Based on Figma Design */}
        {!blogsLoading && !blogsError && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {filteredArticles.map((article) => (
              <div 
                key={article.id} 
                onClick={() => handleArticleClick(article)}
                className="bg-gray-100 rounded-2xl md:rounded-3xl p-4 md:p-5 group cursor-pointer hover:shadow-lg transition-all duration-300"
              >
                {/* Article Image */}
                <div className="relative w-full h-48 md:h-64 lg:h-80 rounded-xl md:rounded-2xl overflow-hidden mb-4 md:mb-5 border border-gray-800 bg-gray-100">
                  {(article.post_banner_url || article.post_thumbnail_url) ? (
                    <img
                      src={article.post_banner_url || article.post_thumbnail_url}
                      alt={article.post_title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        // If image fails, show placeholder
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center"><img src="/assets/mdi_blog.png" alt="Blog" width="80" height="80" class="opacity-50" /></div>';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image
                        src="/assets/mdi_blog.png"
                        alt={article.post_title}
                        width={80}
                        height={80}
                        className="opacity-50"
                      />
                    </div>
                  )}
                </div>

                {/* Article Content */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Category Badge */}
                    {article.post_category && (
                      <div className="bg-white rounded-lg px-2 md:px-3 py-0.5 md:py-1 mb-2 md:mb-3 inline-block">
                        <span className="text-xs md:text-sm text-gray-800 font-medium">{article.post_category}</span>
                      </div>
                    )}
                    
                    {/* Article Title */}
                    <h3 className="text-base md:text-lg lg:text-xl font-medium text-gray-800 mb-2 md:mb-3 group-hover:text-[#653a96] transition-colors duration-200 leading-tight line-clamp-2">
                      {article.post_title}
                    </h3>
                  </div>
                  
                  {/* Arrow Icon */}
                  <div className="ml-2 md:ml-4 flex-shrink-0">
                    <svg
                      className="w-6 h-6 md:w-8 md:h-8 text-gray-400 group-hover:text-[#653a96] transition-colors duration-200"
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

        {/* No Results Message */}
        {!blogsLoading && !blogsError && filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">{t('knowledge.noArticles')}</div>
            <p className="text-gray-400">{t('knowledge.adjustSearch')}</p>
          </div>
        )}

        {/* Load More Button */}
        {filteredArticles.length > 0 && (
          <div className="text-center mt-6 md:mt-8 lg:mt-12">
            <button className="bg-[#653a96] text-white px-6 py-2.5 md:px-8 md:py-3 rounded-full text-sm md:text-base font-medium hover:bg-[#4a2470] transition-colors duration-200">
              {t('knowledge.loadMore')}
            </button>
          </div>
        )}
      </div>
    </SimpleLayout>
  );
}
