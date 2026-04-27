import Link from 'next/link';
import { useRouter } from 'next/router';
import { useLanguage } from '../../../lib/LanguageContext';
import { useState } from 'react';

const MobileSidebar = () => {
  const router = useRouter();
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  const sidebarItems = [
    { 
      label: t('expandedNav.aboutUs'), 
      href: '/about', 
      active: router.pathname === '/about',
      icon: '🏠'
    },
    { 
      label: t('expandedNav.globalSecretariat'), 
      href: '/about/global-secretariat', 
      active: router.pathname === '/about/global-secretariat',
      icon: '👥'
    },
    { 
      label: t('expandedNav.partnerships'), 
      href: '/about/partnerships', 
      active: router.pathname === '/about/partnerships',
      icon: '🤝'
    },
    { 
      label: t('expandedNav.successStories'), 
      href: '/about/success-stories', 
      active: router.pathname === '/about/success-stories',
      icon: '📈'
    }
  ];

  return (
    <div className={`bg-white transition-all duration-300 fixed left-0 top-0 z-50  ${
      isExpanded ? 'w-64' : 'w-16'
    }`}>
      <div className={`p-4 h-screen flex flex-col justify-start items-start pt-14 ${isExpanded ? 'justify-start items-start pt-4' : 'justify-start items-start'}`}>
        {/* Back Button */}
        <div className={`mb-6 flex items-center ${isExpanded ? 'justify-start' : 'justify-center'}`}>
          <button 
            onClick={() => window.history.back()}
            className="flex items-center justify-center w-8 h-8 text-gray-800 hover:text-[#653a96] transition-all duration-300 hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Expand/Collapse Button */}
        <div className={`mb-6 flex items-center ${isExpanded ? 'justify-start' : 'justify-start'}`}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full hover:bg-gray-200 transition-all duration-300"
          >
            <svg 
              className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${
                isExpanded ? 'rotate-180' : ''
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Navigation Items */}
        <div className="space-y-2">
          {sidebarItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`flex items-center transition-all duration-300 hover:scale-105 ${
                item.active
                  ? 'text-[#653a96]'
                  : 'text-gray-600 hover:text-[#653a96]'
              }`}
            >
              {/* Icon */}
              <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 ${
                item.active ? 'bg-[#653a96]/10' : 'hover:bg-gray-100'
              }`}>
                <span className="text-lg">{item.icon}</span>
              </div>
              
              {/* Text (only visible when expanded) */}
              {isExpanded && (
                <span 
                  className="ml-3 text-sm font-medium transition-all duration-300"
                  style={{
                    fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '20px'
                  }}
                >
                  {item.label}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default MobileSidebar;
