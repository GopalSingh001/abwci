import SimpleLayout from '../components/SimpleLayout';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { usePost } from '../../../lib/usePosts';
import { useLanguage } from '../../../lib/LanguageContext';
import { formatDateLong } from '../../../lib/utils/dateFormatter';

export default function ResourceDetail() {
  const { t } = useLanguage();
  const router = useRouter();
  const { id } = router.query;
  
  // Fetch resource data using the custom hook
  const { post: resource, loading, error } = usePost(id);

  if (loading) {
    return (
      <SimpleLayout title={t('knowledge.loading')}>
        <div className="p-8">
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">{t('knowledge.loadingResource')}</div>
          </div>
        </div>
      </SimpleLayout>
    );
  }

  if (error || !resource) {
    return (
      <SimpleLayout title={t('knowledge.resourceNotFound')}>
        <div className="p-8">
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              {error || t('knowledge.resourceNotFound')}
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
    <SimpleLayout title={resource.post_title}>
      <div className="px-4 py-6 md:p-8">
        {/* Go Back Button - Smaller on Mobile */}
        <div className="mb-6">
          <button 
            onClick={() => router.back()}
            className="flex items-center space-x-2 md:space-x-3 text-gray-700 hover:text-[#653a96] transition-all duration-300"
          >
            <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm md:text-lg font-medium">{t('common.goBack')}</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb - Hidden on Mobile */}
          <div className="hidden md:block text-center mb-6">
            <nav className="flex items-center justify-center space-x-2 flex-wrap" aria-label="Breadcrumb">
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
                {t('expandedNav.knowledgeHub')}
              </Link>
              <span className="text-gray-400" aria-hidden="true">&gt;</span>
              <Link 
                href="/knowledge/resources" 
                className="text-gray-600 hover:text-[#653a96] transition-colors duration-200"
              >
                {t('expandedNav.resources')}
              </Link>
              <span className="text-gray-400" aria-hidden="true">&gt;</span>
              <span className="text-gray-800 font-medium" aria-current="page">
                {resource.post_title}
              </span>
            </nav>
          </div>

          {/* Resource Title */}
          <h1 
            className="text-2xl md:text-3xl lg:text-4xl text-gray-800 mb-6 md:mb-8 text-center"
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
            {resource.post_title}
          </h1>

          {/* Hero Image */}
          <div className="relative w-full h-56 md:h-80 lg:h-96 rounded-2xl md:rounded-3xl overflow-hidden mb-6 md:mb-8">
            <Image
              src={resource.post_banner_url || resource.post_thumbnail_url || resource.post_banner || resource.post_thumbnail || resource.country_image_url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop'}
              alt={resource.post_title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          {/* Resource Meta and Social Share */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-8">
            <div className="flex flex-wrap items-center gap-2 md:gap-4">
              <div className="text-sm md:text-base text-gray-600 font-medium">
                {formatDateLong(resource.post_date || resource.created_at)}
              </div>
              <div className="text-sm md:text-base text-gray-600">
                {resource.post_country}
              </div>
              <div className="px-2 md:px-3 py-1 bg-[#653a96] text-white rounded-lg text-xs md:text-sm font-medium">
                {resource.post_category}
              </div>
            </div>
            
            <div className="flex items-center gap-3 md:gap-4">
              {/* Social Media Icons */}
              <div className="flex items-center gap-2 md:gap-3">
                <button className="w-5 h-5 md:w-6 md:h-6 text-gray-600 hover:text-[#653a96] transition-colors duration-200">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </button>
                <button className="w-6 h-6 text-gray-600 hover:text-[#653a96] transition-colors duration-200">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </button>
                <button className="w-6 h-6 text-gray-600 hover:text-[#653a96] transition-colors duration-200">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </button>
                <button className="w-6 h-6 text-gray-600 hover:text-[#653a96] transition-colors duration-200">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
              </div>
              
              {/* Share Button */}
              <button className="bg-white border border-[#653a96] text-[#653a96] px-4 py-2 rounded-lg font-medium hover:bg-[#653a96] hover:text-white transition-colors duration-200">
                {t('knowledge.share')}
              </button>
            </div>
          </div>

          {/* Resource Content */}
          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-gray-800 leading-relaxed mb-6">
              {resource.post_desc}
            </p>
          </div>

          {/* Additional Content */}
          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-gray-800 leading-relaxed">
              This resource provides valuable insights and tools for {resource.post_category.toLowerCase()}. It's specifically designed for {resource.post_country} and offers comprehensive guidance for women entrepreneurs and business leaders.
            </p>
          </div>

          {/* Newsletter Subscription */}
          <div className="bg-gray-50 rounded-2xl md:rounded-3xl p-5 md:p-8 mb-6 md:mb-8">
            <h2 
              className="text-xl md:text-2xl lg:text-3xl text-gray-800 mb-4 md:mb-6"
              style={{
                fontFamily: 'DM Serif Display',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: '1.35',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility'
              }}
            >
              For more resources related to business world for women, Subscribe to our newsletter
            </h2>
            
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4">
              <div className="flex-1 bg-white border border-gray-400 rounded-full px-4 md:px-6 py-3">
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full bg-transparent text-sm md:text-base text-gray-800 placeholder-gray-500 focus:outline-none"
                />
              </div>
              <button className="bg-[#fecb07] border border-gray-800 text-gray-800 px-6 md:px-8 py-3 rounded-full text-sm md:text-base font-medium hover:bg-[#e6b800] transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>

          {/* Final Content */}
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-800 leading-relaxed">
              Access this resource to enhance your business knowledge and stay updated with the latest trends in {resource.post_category.toLowerCase()}. Our comprehensive collection of resources is designed to support women entrepreneurs worldwide.
            </p>
          </div>
        </div>
      </div>
    </SimpleLayout>
  );
}
