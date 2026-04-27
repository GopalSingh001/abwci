import Link from 'next/link';
import { useRouter } from 'next/router';
import { useLanguage } from '../../../lib/LanguageContext';

const AboutNavBar = () => {
  const router = useRouter();
  const { t } = useLanguage();

  const navItems = [
    { 
      label: t('expandedNav.aboutUs'), 
      mobileLabel: t('expandedNav.aboutUs'),
      href: '/about',
      active: router.pathname === '/about'
    },
    { 
      label: t('expandedNav.globalSecretariat'), 
      mobileLabel: t('expandedNav.globalSecretariat'),
      href: '/about/global-secretariat',
      active: router.pathname === '/about/global-secretariat'
    },
    { 
      label: t('expandedNav.partnerships'), 
      mobileLabel: t('expandedNav.partnerships'),
      href: '/about/partnerships',
      active: router.pathname === '/about/partnerships'
    },
    { 
      label: t('expandedNav.successStories'), 
      mobileLabel: 'Stories',
      href: '/about/success-stories',
      active: router.pathname === '/about/success-stories'
    }
  ];

  return (
    <div className="md:hidden bg-white border-b border-gray-200 sticky z-40" style={{ top: '40px' }}>
      <div className="max-w-7xl mx-auto flex flex-row items-center justify-start px-4 md:px-6 h-12 md:h-14 pt-0 pb-2 gap-6 md:gap-8 overflow-x-auto">
        {navItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="px-0 whitespace-nowrap pb-0"
            style={{
              fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '14px',
              color: item.active ? '#653A96' : '#2B2D30',
              display: 'inline-block',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (!item.active) {
                e.currentTarget.style.color = '#653A96';
              }
            }}
            onMouseLeave={(e) => {
              if (!item.active) {
                e.currentTarget.style.color = '#2B2D30';
              }
            }}
          >
            <span className="relative inline-block">
              <span className="md:hidden">{item.mobileLabel || item.label}</span>
              <span className="hidden md:inline">{item.label}</span>
              {item.active && (
                <span 
                  className="absolute left-0 right-0"
                  style={{
                    height: '2px',
                    backgroundColor: '#653A96',
                    bottom: '-5px'
                  }}
                />
              )}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AboutNavBar;

