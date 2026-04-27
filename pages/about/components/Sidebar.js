import Link from 'next/link';
import { useRouter } from 'next/router';
import { useLanguage } from '../../../lib/LanguageContext';

const Sidebar = () => {
  const router = useRouter();
  const { t } = useLanguage();

  const sidebarItems = [
    { label: t('expandedNav.aboutUs'), href: '/about', active: router.pathname === '/about' },
    { label: t('expandedNav.globalSecretariat'), href: '/about/global-secretariat', active: router.pathname === '/about/global-secretariat' },
    { label: t('expandedNav.partnerships'), href: '/about/partnerships', active: router.pathname === '/about/partnerships' },
    { label: t('expandedNav.successStories'), href: '/about/success-stories', active: router.pathname === '/about/success-stories' }
  ];

  return (
    <div className="w-64 bg-white min-h-screen">
      <div className="p-6">
        {/* Go Back Button */}
        <div className="mb-16">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 text-gray-800 hover:text-[#653a96] transition-all duration-300 text-base text-3xl font-bold hover:scale-105"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span style={{fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontWeight: 500,
                fontSize: '16px',
                lineHeight: '24px'
              }} >{t('common.goBack')}</span>
          </button>
        </div>

        {/* Navigation Items */}
        <div className="space-y-2">
          {sidebarItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontWeight: 500,
                fontSize: '16px',
                lineHeight: '24px',
                position: 'relative'
              }}
              className={`block px-4 py-4 transition-all duration-300 transform hover:scale-105 hover:translate-x-2  ${
                item.active
                  ? 'text-gray-800'
                  : 'text-gray-800 hover:text-[#653a96]'
              }`}
            >
              {item.active && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '6px',
                    width: '160px',
                    height: '2px',
                    backgroundColor: '#653a96',
                    display: 'block'
                  }}
                />
              )}
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
