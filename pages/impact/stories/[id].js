import Layout from '../../../components/Layout';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { impactStories } from '../../../data/impact-stories';
import { useLanguage } from '../../../lib/LanguageContext';

export default function ImpactStory() {
  const { t } = useLanguage();
  const router = useRouter();
  const { id } = router.query;
  
  // Find the story by slug or id
  const story = impactStories.find(s => s.slug === id || s.id.toString() === id);

  if (!story) {
    return (
      <Layout>
        <div className="p-8">
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">Story not found</div>
            <button 
              onClick={() => router.back()}
              className="text-[#653a96] hover:underline"
            >
              {t('common.goBack')}
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 py-4 md:p-8">
        {/* Go Back Button */}
        <div className="mb-4 md:mb-6">
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
                href="/impact" 
                className="text-gray-600 hover:text-[#653a96] transition-colors duration-200"
              >
                Our Impact
              </Link>
              <span className="text-gray-400" aria-hidden="true">&gt;</span>
              <span className="text-gray-800 font-medium" aria-current="page">
                {story.title}
              </span>
            </nav>
          </div>

          {/* Story Title */}
          <h1 
            className="text-2xl md:text-4xl text-gray-800 mb-6 md:mb-8 text-center"
            style={{
              fontFamily: 'DM Serif Display',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '28px',
              lineHeight: '36px',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility'
            }}
          >
            {story.title}
          </h1>

          {/* Hero Image */}
          <div className="relative w-full h-64 md:h-96 rounded-2xl md:rounded-3xl overflow-hidden mb-6 md:mb-8">
            <Image
              src={story.image}
              alt={story.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          {/* Story Meta */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4 md:gap-0">
            <div className="text-gray-600 text-xs md:text-sm font-medium">
              {new Date(story.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            
            <div className="flex items-center space-x-3 md:space-x-4 w-full md:w-auto justify-between md:justify-start">
              {/* Social Media Icons */}
              <div className="flex items-center space-x-1.5 md:space-x-2">
                <button className="w-4 h-4 md:w-5 md:h-5 text-gray-600 hover:text-[#653a96] transition-colors duration-200">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </button>
                <button className="w-4 h-4 md:w-5 md:h-5 text-gray-600 hover:text-[#653a96] transition-colors duration-200">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </button>
                <button className="w-4 h-4 md:w-5 md:h-5 text-gray-600 hover:text-[#653a96] transition-colors duration-200">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </button>
                <button className="w-4 h-4 md:w-5 md:h-5 text-gray-600 hover:text-[#653a96] transition-colors duration-200">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
              </div>
              
              {/* Share Button */}
              <button className="bg-white border border-[#653a96] text-[#653a96] px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium hover:bg-[#653a96] hover:text-white transition-colors duration-200 ml-auto md:ml-0">
                {t('knowledge.share')}
              </button>
            </div>
          </div>

          {/* Story Description */}
          <div className="mb-6 md:mb-8">
            <p 
              className="text-gray-600 text-base md:text-lg leading-relaxed italic"
              style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'
              }}
            >
              {story.description}
            </p>
          </div>

          {/* Story Content */}
          <div className="prose prose-lg md:prose-lg prose-sm max-w-none mb-6 md:mb-8">
            {story.content.map((section, index) => {
              const fontFamily = 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';
              
              if (section.type === 'paragraph') {
                return (
                  <p 
                    key={index} 
                    className="text-gray-800 text-sm md:text-base leading-relaxed mb-4 md:mb-6"
                    style={{ fontFamily }}
                  >
                    {section.text}
                  </p>
                );
              } else if (section.type === 'heading') {
                return (
                  <h2 
                    key={index}
                    className="text-xl md:text-2xl text-gray-800 font-semibold mb-4 md:mb-6 mt-8 md:mt-10"
                    style={{
                      fontFamily,
                      fontWeight: 600
                    }}
                  >
                    {section.text}
                  </h2>
                );
              } else if (section.type === 'list') {
                return (
                  <ul 
                    key={index} 
                    className="list-disc list-inside text-gray-800 text-sm md:text-base leading-relaxed mb-4 md:mb-6 space-y-2"
                    style={{ fontFamily }}
                  >
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="ml-4">{item}</li>
                    ))}
                  </ul>
                );
              } else if (section.type === 'quote') {
                return (
                  <blockquote 
                    key={index}
                    className="border-l-4 border-[#653a96] pl-4 md:pl-6 py-2 md:py-4 my-6 md:my-8 italic text-gray-700 text-base md:text-lg"
                    style={{
                      fontFamily
                    }}
                  >
                    {section.text}
                  </blockquote>
                );
              }
              return null;
            })}
          </div>

          {/* CTA Button */}
          {story.cta && (
            <div className="mb-6 md:mb-8 flex justify-center">
              <Link
                href={story.cta.link}
                className="inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 bg-[#FECB07] text-[#171717] rounded-full font-medium text-sm md:text-base hover:bg-[#FECB07]/90 transition-colors duration-200"
                style={{
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontWeight: 500
                }}
              >
                {story.cta.text}
                <svg className="w-4 h-4 md:w-5 md:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          )}

          {/* Back to Impact Page */}
          <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-200">
            <Link 
              href="/impact"
              className="inline-flex items-center space-x-2 text-[#653a96] hover:text-[#653a96]/80 transition-colors duration-200"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm md:text-base font-medium">Back to Our Impact</span>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

