import SimpleLayout from '../components/SimpleLayout';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { usePost } from '../../../lib/usePosts';
import { useLanguage } from '../../../lib/LanguageContext';
import { cleanHtmlContent } from '../../../lib/utils/htmlCleaner';
import { formatDateLong } from '../../../lib/utils/dateFormatter';

export default function BlogPost() {
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
  const { id } = router.query;
  
  // Fetch article data using the custom hook
  const { post: article, loading, error } = usePost(id);

  // Share functionality
  const handleShare = (platform) => {
    if (!article) return;
    
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const title = article.post_title || '';
    const text = article.post_short_desc || '';
    
    const shareUrls = {
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    };
    
    if (platform && shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    } else {
      // Native share API or fallback
      if (navigator.share) {
        navigator.share({
          title: title,
          text: text,
          url: url
        }).catch(err => console.log('Error sharing:', err));
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(url).then(() => {
          alert('Link copied to clipboard!');
        }).catch(err => {
          console.log('Failed to copy:', err);
        });
      }
    }
  };

  if (loading) {
    return (
      <SimpleLayout title={t('knowledge.loading')}>
        <div className="p-8">
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">{t('knowledge.loadingArticle')}</div>
          </div>
        </div>
      </SimpleLayout>
    );
  }

  if (error || !article) {
    return (
      <SimpleLayout title={t('knowledge.articleNotFound')}>
        <div className="p-8">
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              {error || t('knowledge.articleNotFound')}
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
    <SimpleLayout title={article.post_title}>
      <div className="px-4 py-4 md:p-8">
        {/* Go Back Button - Smaller on Mobile */}
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
            <nav className="flex items-center justify-center space-x-2" aria-label="Breadcrumb">
              <Link 
                href="/" 
                className="text-gray-600 hover:text-[#653a96] transition-colors duration-200 whitespace-nowrap"
              >
                {t('common.home')}
              </Link>
              <span className="text-gray-400" aria-hidden="true">&gt;</span>
              <span className="text-gray-600 whitespace-nowrap">
                {t('expandedNav.knowledgeHub')}
              </span>
              <span className="text-gray-400" aria-hidden="true">&gt;</span>
              <Link 
                href="/knowledge/blog" 
                className="text-gray-600 hover:text-[#653a96] transition-colors duration-200 whitespace-nowrap"
              >
                {t('expandedNav.blogs')}
              </Link>
              <span className="text-gray-400" aria-hidden="true">&gt;</span>
              <span className="text-gray-800 font-medium whitespace-nowrap truncate max-w-md" aria-current="page" title={article.post_title}>
                {article.post_title}
              </span>
            </nav>
          </div>

          {/* Article Title */}
          <h1 
            className="text-[24px] leading-[30px] md:text-[32px] md:leading-[40px] lg:text-[40px] lg:leading-[48px] text-gray-800 mb-4 md:mb-6 lg:mb-8 text-center px-2 md:px-0"
            style={{
              fontFamily: 'DM Serif Display, serif',
              fontStyle: 'normal',
              fontWeight: 400,
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility'
            }}
          >
            {article.post_title}
          </h1>

          {/* Hero Image */}
          <div className="relative w-full h-[200px] md:h-[350px] lg:h-[400px] rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden mb-4 md:mb-6 lg:mb-8">
            <Image
              src={article.post_banner_url || article.post_thumbnail_url || article.post_banner || article.post_thumbnail || '/assets/placeholder-blog.png'}
              alt={article.post_title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          {/* Article Meta and Social Share */}
          <div className="flex flex-row items-center justify-between mb-4 md:mb-6 lg:mb-8 gap-2 md:gap-4">
            <div className="text-[#653a96] text-[12px] md:text-sm font-medium whitespace-nowrap">
              {formatDateLong(article.post_date || article.created_at)}
            </div>
            
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Social Media Icons */}
              <div className="flex items-center space-x-1.5 md:space-x-2">
                <button 
                  onClick={() => handleShare('pinterest')}
                  className="text-[#653a96] hover:text-[#4a2470] transition-colors duration-200"
                  aria-label="Share on Pinterest"
                >
                  <svg className="w-[18px] h-[18px] md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </button>
                <button 
                  onClick={() => handleShare('linkedin')}
                  className="text-[#653a96] hover:text-[#4a2470] transition-colors duration-200"
                  aria-label="Share on LinkedIn"
                >
                  <svg className="w-[18px] h-[18px] md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </button>
                <button 
                  onClick={() => handleShare('twitter')}
                  className="text-[#653a96] hover:text-[#4a2470] transition-colors duration-200"
                  aria-label="Share on Twitter"
                >
                  <svg className="w-[18px] h-[18px] md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </button>
                <button 
                  onClick={() => handleShare('facebook')}
                  className="text-[#653a96] hover:text-[#4a2470] transition-colors duration-200"
                  aria-label="Share on Facebook"
                >
                  <svg className="w-[18px] h-[18px] md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
              </div>
              
              {/* Share Button - Positioned to the Right */}
              <button 
                onClick={() => handleShare()}
                className="bg-white border border-[#653a96] text-[#653a96] px-2.5 py-1 md:px-4 md:py-2 rounded-md md:rounded-lg text-[11px] md:text-sm font-medium hover:bg-[#653a96] hover:text-white transition-colors duration-200"
              >
                {t('knowledge.share')}
              </button>
            </div>
          </div>

          {/* Article Content */}
          <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none mb-4 md:mb-6 lg:mb-8">
            <div 
              className="text-gray-800 text-[14px] md:text-[15px] lg:text-base leading-[22px] md:leading-[24px] lg:leading-relaxed mb-4 md:mb-6"
              style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontWeight: 400,
                letterSpacing: '0.02em',
                textRendering: 'optimizeLegibility',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
              }}
            >
              {article.post_desc ? (() => {
                const cleanedContent = cleanHtmlContent(article.post_desc);
                
                // First, try splitting by double line breaks
                let paragraphs = cleanedContent.split(/\n\n+/).filter(p => p.trim());
                
                // If we only got one paragraph, try splitting by single line breaks
                if (paragraphs.length === 1 && cleanedContent.includes('\n')) {
                  // Split by single line breaks, but group consecutive non-list lines
                  const lines = cleanedContent.split('\n').filter(line => line.trim());
                  paragraphs = [];
                  let currentPara = [];
                  
                  for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].trim();
                    const isBullet = line.startsWith('•');
                    
                    if (isBullet) {
                      // If we have accumulated text, save it as a paragraph
                      if (currentPara.length > 0) {
                        paragraphs.push(currentPara.join(' '));
                        currentPara = [];
                      }
                      // Collect all consecutive bullet points
                      const bulletGroup = [line];
                      while (i + 1 < lines.length && lines[i + 1].trim().startsWith('•')) {
                        bulletGroup.push(lines[i + 1].trim());
                        i++;
                      }
                      paragraphs.push(bulletGroup.join('\n'));
                    } else {
                      // Regular text line - add to current paragraph
                      currentPara.push(line);
                    }
                  }
                  
                  // Add any remaining paragraph
                  if (currentPara.length > 0) {
                    paragraphs.push(currentPara.join(' '));
                  }
                }
                
                // If still only one paragraph and it's very long, try to split by sentence boundaries
                // Look for patterns like: sentence ending (.!?) followed by capital letter (new paragraph)
                if (paragraphs.length === 1 && paragraphs[0].length > 200) {
                  const text = paragraphs[0];
                  
                  // Split by common paragraph indicators:
                  // 1. Sentence ending followed by capital letter (but not after abbreviations like "Ltd.")
                  // 2. Headings like "About Team Marksmen" (capital word, capital word pattern)
                  // 3. Lists starting with bullets
                  
                  // First, handle lists separately
                  if (text.includes('•')) {
                    const parts = text.split(/(•[^\n•]+)/);
                    const newParas = [];
                    let current = '';
                    
                    for (const part of parts) {
                      if (part.trim().startsWith('•')) {
                        if (current.trim()) {
                          newParas.push(current.trim());
                          current = '';
                        }
                        newParas.push(part.trim());
                      } else {
                        current += part;
                      }
                    }
                    if (current.trim()) {
                      newParas.push(current.trim());
                    }
                    
                    if (newParas.length > 1) {
                      paragraphs = newParas;
                    }
                  }
                  
                  // If still one paragraph, split by sentence boundaries
                  if (paragraphs.length === 1) {
                    // Split by: period/question/exclamation, optional space, then capital letter
                    // But be careful not to split on abbreviations (Ltd., Inc., etc.)
                    const splits = text.split(/([.!?])\s+(?=[A-Z][a-z])/);
                    if (splits.length > 1) {
                      paragraphs = [];
                      let current = '';
                      for (let i = 0; i < splits.length; i++) {
                        current += splits[i];
                        // If next part starts with capital and current ends with sentence punctuation
                        if (i < splits.length - 1 && /[.!?]\s*$/.test(current.trim())) {
                          paragraphs.push(current.trim());
                          current = '';
                        }
                      }
                      if (current.trim()) {
                        paragraphs.push(current.trim());
                      }
                      
                      // Filter out very short paragraphs (likely false splits)
                      paragraphs = paragraphs.filter(p => p.trim().length > 20);
                    }
                  }
                }
                
                return paragraphs.map((paragraph, index) => {
                  const trimmedPara = paragraph.trim();
                  
                  // Check if paragraph is a list (starts with bullet or contains multiple bullets)
                  const isListItem = trimmedPara.startsWith('•') || trimmedPara.split('\n').filter(line => line.trim().startsWith('•')).length > 1;
                  
                  if (isListItem) {
                    // For list items, split by single line breaks and render as list
                    const items = trimmedPara.split('\n').filter(item => item.trim() && item.trim().startsWith('•'));
                    if (items.length > 0) {
                      return (
                        <ul key={index} className="list-disc pl-5 mb-4 space-y-2" style={{ listStyleType: 'disc' }}>
                          {items.map((item, itemIndex) => (
                            <li 
                              key={itemIndex} 
                              className="mb-1"
                              style={{
                                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                                fontWeight: 400,
                                fontSize: '16px',
                                lineHeight: '24px',
                                letterSpacing: '0.02em',
                                textRendering: 'optimizeLegibility',
                                WebkitFontSmoothing: 'antialiased',
                                MozOsxFontSmoothing: 'grayscale',
                              }}
                            >
                              {item.trim().replace(/^•\s*/, '')}
                            </li>
                          ))}
                        </ul>
                      );
                    }
                  }
                  
                  // Regular paragraph - render as single paragraph
                  return (
                    <p 
                      key={index} 
                      className="mb-4 leading-relaxed"
                      style={{
                        fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                        fontWeight: 400,
                        fontSize: '16px',
                        lineHeight: '24px',
                        letterSpacing: '0.02em',
                        textRendering: 'optimizeLegibility',
                        WebkitFontSmoothing: 'antialiased',
                        MozOsxFontSmoothing: 'grayscale',
                      }}
                    >
                      {trimmedPara}
                    </p>
                  );
                });
              })() : ''}
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div className="bg-gray-50 rounded-xl md:rounded-2xl lg:rounded-3xl p-4 md:p-6 lg:p-8 mb-4 md:mb-6 lg:mb-8">
            <h2 
              className="text-[18px] leading-[24px] md:text-[22px] md:leading-[28px] lg:text-[24px] lg:leading-[32px] text-gray-800 mb-3 md:mb-4 lg:mb-6"
              style={{
                fontFamily: 'DM Serif Display',
                fontStyle: 'normal',
                fontWeight: 400,
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility'
              }}
            >
              For more news related to business world for women, Subscribe to our newsletter
            </h2>
            
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4">
              <div className="flex-1 bg-white border border-gray-400 rounded-full px-4 py-2 md:px-5 md:py-2.5 lg:px-6 lg:py-3">
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none text-[13px] md:text-sm lg:text-base"
                />
              </div>
              <button className="bg-[#fecb07] border border-gray-800 text-gray-800 px-5 py-2 md:px-6 md:py-2.5 lg:px-8 lg:py-3 rounded-full text-[13px] md:text-sm lg:text-base font-medium hover:bg-[#e6b800] transition-colors duration-200 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>

        </div>
      </div>
    </SimpleLayout>
  );
}
