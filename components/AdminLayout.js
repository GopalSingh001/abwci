import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navbar from './NavbarAlt';
import Head from 'next/head';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState({});

  useEffect(() => {
    checkAuth();
  }, []);

  // Helper function to check if any submenu item is active
  const isSubmenuActive = (item) => {
    if (!item.submenu) return false;
    const currentPath = router.asPath || router.pathname;
    const isActive = item.submenu.some(subitem => {
      return currentPath === subitem.link || currentPath.startsWith(subitem.link + '/');
    });
    
    // Debug log for Leaders menu specifically
    if (item.id === 'leaders') {
      // console.log(`🔍 Leaders check: currentPath=${currentPath}, isActive=${isActive}`);
    }
    
    return isActive;
  };

  // Helper function to check if a menu should be expanded
  const shouldMenuBeExpanded = (item) => {
    return expandedMenus[item.id] || isSubmenuActive(item);
  };

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    console.log('🔑 [AdminLayout] Checking auth, token exists:', !!token);
    
    if (!token) {
      console.log('❌ No token found, redirecting to login');
      router.push('/auth/login');
      return;
    }

    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/auth/me`;
      console.log('📤 Checking auth at:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📥 Auth response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Auth check failed:', errorData);
        throw new Error('Not authenticated');
      }

      const data = await response.json();
      console.log('✅ Auth successful, user:', data.user || data.data);
      setUser(data.user || data.data);
    } catch (error) {
      console.error('❌ Auth check failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      router.push('/auth/login');
    }
  };

  const toggleMenu = (menu) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'dashboard',
      link: '/admin'
    },
    {
      id: 'leaders',
      label: 'Leaders',
      icon: 'leaders',
      submenu: [
        { id: 'all-leaders', label: 'All Leaders', link: '/admin/leaders' },
        { id: 'global-ambassadors', label: 'Global Ambassadors', link: '/admin/leaders/category/global-ambassadors' },
        { id: 'regional-presidents', label: 'Regional Presidents', link: '/admin/leaders/category/regional-presidents' },
        { id: 'state-presidents', label: 'State Presidents', link: '/admin/leaders/category/state-presidents' },
        { id: 'global-secretariat', label: 'Global Secretariat', link: '/admin/leaders/category/global-secretariat' }
      ]
    },
    {
      id: 'users',
      label: 'Users',
      icon: 'users',
      submenu: [
        { id: 'all-users', label: 'All Users', link: '/admin/users' },
        { id: 'mentors', label: 'Mentors', link: '/admin/users/type/Mentor' },
        { id: 'mentees', label: 'Mentees', link: '/admin/users/type/Mentee' },
        { id: 'members', label: 'Members', link: '/admin/users/type/Member' }
      ]
    },
    {
      id: 'posts',
      label: 'Posts',
      icon: 'posts',
      submenu: [
        { id: 'blogs', label: 'Blogs', link: '/admin/posts/blogs' },
        { id: 'resources', label: 'Resources', link: '/admin/posts/resources' },
        { id: 'stories', label: 'Success Stories', link: '/admin/posts/stories' },
        { id: 'partners', label: 'Partnerships', link: '/admin/posts/partners' },
        { id: 'tenders', label: 'Tenders', link: '/admin/posts/tenders' }
      ]
    },
    {
      id: 'content',
      label: 'Content',
      icon: 'content',
      submenu: [
        { id: 'announcements', label: 'Announcements', link: '/admin/announcements' },
        { id: 'actions', label: 'Actions', link: '/admin/actions' },
        { id: 'events', label: 'Events', link: '/admin/events' }
      ]
    },
    {
      id: 'banners',
      label: 'Banners',
      icon: 'banners',
      submenu: [
        { id: 'key-updates', label: 'Key Updates', link: '/admin/key-updates' },
        { id: 'hero-banners', label: 'Hero Banners', link: '/admin/banners' },
        { id: 'page-images', label: 'Page Images', link: '/admin/page-images' },
        { id: 'key-features', label: 'Key Features', link: '/admin/key-features' },
        { id: 'register-images', label: 'Register Images', link: '/admin/register-images' }
      ]
    },
    {
      id: 'support',
      label: 'Support Requests',
      icon: 'support',
      link: '/admin/support'
    },
    {
      id: 'waitlist',
      label: 'Waitlist',
      icon: 'waitlist',
      link: '/admin/waitlist'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'settings',
      submenu: [
        { id: 'countries', label: 'Countries', link: '/admin/countries' },
        { id: 'sectors', label: 'Sectors', link: '/admin/sectors' }
      ]
    }
  ];

  // Icon mapping for cleaner icons
  const getIcon = (iconName) => {
    const icons = {
      dashboard: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
        </svg>
      ),
      key: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      ),
      banners: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      content: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      posts: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      users: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      leaders: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      support: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
        </svg>
      ),
      waitlist: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      settings: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    };
    return icons[iconName] || icons.dashboard;
  };

  return (
    <div className="min-h-screen  flex flex-col">
      <Head>
        <title>Admin - ABWCI</title>
        <link rel="icon" href="/abwci.ico" />
        <link rel="shortcut icon" href="/abwci.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/abwci.ico" />
      </Head>
      {/* Navbar */}
      <Navbar />
      
      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 text-gray-700 transition-all duration-300 overflow-y-auto shadow-sm`}>
          <div className="p-4">
            {/* Logo */}
            <div className="flex items-center justify-between mb-8">
              {sidebarOpen && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    A
                  </div>
                  <span className="font-semibold text-lg text-gray-800">Admin Panel</span>
                </div>
              )}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded"
              >
                {sidebarOpen ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </div>

            {/* Menu Items */}
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <div key={item.id}>
                  {item.link ? (
                    <Link href={item.link}>
                      <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group relative ${router.pathname === item.link ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-600' : ''}`}>
                        <div className="text-gray-600 group-hover:text-purple-600 transition-colors">
                          {getIcon(item.icon)}
                        </div>
                        {sidebarOpen && (
                          <span className="text-sm font-medium truncate">{item.label}</span>
                        )}
                        {/* Single line indicator */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 bg-purple-600 rounded-r-full transition-all duration-200 ${router.pathname === item.link ? 'opacity-100' : 'opacity-0'}`}></div>
                      </div>
                    </Link>
                  ) : (
                    <>
                      <button
                        onClick={() => toggleMenu(item.id)}
                        className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-colors group relative ${isSubmenuActive(item) ? '!bg-purple-50 !text-purple-700 hover:!bg-purple-100' : 'hover:bg-gray-100'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`transition-colors ${isSubmenuActive(item) ? '!text-purple-600' : 'text-gray-600 group-hover:text-purple-600'}`}>
                            {getIcon(item.icon)}
                          </div>
                          {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                        </div>
                        {sidebarOpen && (
                          <svg className={`w-4 h-4 transform transition-all ${isSubmenuActive(item) ? '!text-purple-500' : 'text-gray-400'} ${shouldMenuBeExpanded(item) ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                        {/* Active indicator for parent menu */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 bg-purple-600 rounded-r-full transition-all duration-200 ${isSubmenuActive(item) ? 'opacity-100' : 'opacity-0'}`}></div>
                      </button>
                      {shouldMenuBeExpanded(item) && sidebarOpen && item.submenu && (
                        <div className="ml-6 mt-1 space-y-1" onClick={(e) => e.stopPropagation()}>
                          {item.submenu.map((subitem) => (
                            <Link key={subitem.id} href={subitem.link}>
                              <div className={`px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer text-sm relative ${router.pathname === subitem.link ? 'bg-purple-50 text-purple-700' : 'text-gray-600'}`}>
                                <span className="truncate">{subitem.label}</span>
                                {/* Single line indicator for submenu items */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1 bg-purple-600 rounded-r-full transition-all duration-200 ${router.pathname === subitem.link ? 'opacity-100' : 'opacity-0'}`}></div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </nav>

            {/* User Info */}
            {sidebarOpen && user && (
              <div className="mt-8 pt-4 border-t border-gray-200">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-gray-800">{user.username}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  <button
                    onClick={handleLogout}
                    className="mt-2 text-xs text-red-600 hover:text-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

