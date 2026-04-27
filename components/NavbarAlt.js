import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../lib/LanguageContext';
import { regions } from '../data/global-presence-data';
import { useRouter } from 'next/router';
import { supportAPI } from '../lib/api';

const NavbarAlt = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [showExpandedNav, setShowExpandedNav] = useState(false);
  const [activeExpandedSection, setActiveExpandedSection] = useState(null); // which desktop section is expanded
  const [hoverTimeout, setHoverTimeout] = useState(null);
  // Ref to desktop nav items container (for positioning expanded panel)
  const navItemsRef = useRef(null);
  const navItemRefs = useRef({});
  const [languageSearch, setLanguageSearch] = useState('');
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [aboutPageImage, setAboutPageImage] = useState('');
  const [mentorshipImage, setMentorshipImage] = useState('');
  // Navbar dropdown specific images
  const [navAboutImage, setNavAboutImage] = useState('');
  const [navOpportunitiesImage, setNavOpportunitiesImage] = useState('');
  const [navImpactImage, setNavImpactImage] = useState('');
  const [navLeadershipImage, setNavLeadershipImage] = useState('');
  const [navSupportImage, setNavSupportImage] = useState('');
  const [supportPageImage, setSupportPageImage] = useState('');
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    aboutUs: true,
    leadership: false,
    opportunities: false,
    knowledgeHub: false,
    ourImpact: false,
    members: false,
  });
  const languageDropdownRef = useRef(null);
  const [hoveredRegion, setHoveredRegion] = useState(null); // For Network dropdown map
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const loginDropdownRef = useRef(null);
  const loginDropdownTimeoutRef = useRef(null);
  const [isTopLanguageOpen, setIsTopLanguageOpen] = useState(false);
  const topLanguageDropdownRef = useRef(null);
  const [topSearchQuery, setTopSearchQuery] = useState('');
  const [fontScale, setFontScale] = useState(1.0); // Font scale factor (1.0 = 100%, 1.2 = 120%, etc.)
  const [supportNavPosition, setSupportNavPosition] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [navImagesLoaded, setNavImagesLoaded] = useState(false);
  const [isJoinUsDropdownOpen, setIsJoinUsDropdownOpen] = useState(false);
  const joinUsDropdownRef = useRef(null);
  const joinUsDropdownTimeoutRef = useRef(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactFormSubject, setContactFormSubject] = useState('');
  const [contactFormData, setContactFormData] = useState({
    fullName: '',
    email: '',
    country: null,
    message: ''
  });
  const [contactFormSubmitting, setContactFormSubmitting] = useState(false);
  const [contactFormResult, setContactFormResult] = useState(null);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [supportSearchQuery, setSupportSearchQuery] = useState('');
  const [supportActiveCategory, setSupportActiveCategory] = useState(null);
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const router = useRouter();
  
  const { currentLanguage, changeLanguage, t } = useLanguage();

  // Phone number for support dropdown
  const phoneNumber = '(+91) 11-4095-6653';

  // Handle copy phone number
  const handleCopyPhoneNumber = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(phoneNumber);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = phoneNumber;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          const successful = document.execCommand('copy');
          if (successful) {
            setShowCopiedToast(true);
            setTimeout(() => setShowCopiedToast(false), 3000);
          }
        } catch (fallbackErr) {
          console.error('Fallback copy failed:', fallbackErr);
        } finally {
          document.body.removeChild(textArea);
        }
      }
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 3000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Countries list for contact form
  const countries = [
    { code: 'IN', name: 'India', flag: '🇮🇳' },
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
    { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪' },
    { code: 'FR', name: 'France', flag: '🇫🇷' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' },
    { code: 'PL', name: 'Poland', flag: '🇵🇱' },
    { code: 'IT', name: 'Italy', flag: '🇮🇹' },
    { code: 'ES', name: 'Spain', flag: '🇪🇸' },
    { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
    { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
    { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
    { code: 'AT', name: 'Austria', flag: '🇦🇹' },
    { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
    { code: 'NO', name: 'Norway', flag: '🇳🇴' },
    { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
    { code: 'FI', name: 'Finland', flag: '🇫🇮' },
    { code: 'HU', name: 'Hungary', flag: '🇭🇺' },
    { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿' },
    { code: 'SK', name: 'Slovakia', flag: '🇸🇰' },
    { code: 'RO', name: 'Romania', flag: '🇷🇴' },
    { code: 'BG', name: 'Bulgaria', flag: '🇧🇬' },
    { code: 'HR', name: 'Croatia', flag: '🇭🇷' },
    { code: 'SI', name: 'Slovenia', flag: '🇸🇮' },
    { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  ];

  // Map language codes to country codes for flag images
  const languageToCountryCode = {
    'en': 'us',
    'es': 'es',
    'fr': 'fr',
    'de': 'de',
    'it': 'it',
    'pt': 'pt',
    'ar': 'sa',
    'hi': 'in',
    'zh': 'cn',
    'ja': 'jp',
    'ur': 'pk',
    'bn': 'bd',
    'ne': 'np',
    'si': 'lk',
    'ta': 'in',
    'vi': 'vn',
    'th': 'th',
    'fil': 'ph',
    'ms': 'my',
    'sw': 'ke',
    'ka': 'ge',
    'ky': 'kg',
    'lv': 'lv',
    'hu': 'hu',
    'pl': 'pl',
    'nb': 'no',
    'my': 'mm',
    'ha': 'ng',
    'yo': 'ng',
    'ig': 'ng',
    'pcm': 'ng'
  };

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error parsing user data:', error);
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    checkAuth();
    
    // Listen for storage changes (e.g., login/logout in another tab)
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  // Font size management - Always start with default scale on refresh
  useEffect(() => {
    // Always reset to normal (1.0) on mount/refresh - no scaling applied
    setFontScale(1.0);
    
    // Remove any existing font scale styles to ensure clean state
    const styleElement = document.getElementById('font-scale-style');
    if (styleElement) {
      styleElement.remove();
    }
    
    // Reset root font size to default
    document.documentElement.style.fontSize = '';
    document.documentElement.style.removeProperty('font-size');
  }, []);

  // Apply font scale changes - scales all text proportionally (magnification)
  useEffect(() => {
    const styleId = 'font-scale-style';
    let styleElement = document.getElementById(styleId);
    
    // If scale is 1.0 (normal), remove any scaling styles
    if (fontScale === 1.0) {
      if (styleElement) {
        styleElement.remove();
      }
      // Reset root font size to default
      document.documentElement.style.fontSize = '';
      document.documentElement.style.removeProperty('font-size');
      return;
    }
    
    // Only apply scaling when fontScale is not 1.0
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    
    // Apply scale using CSS - creates a magnification effect for text
    styleElement.textContent = `
      /* Scale root font size - this affects rem-based units */
      html {
        font-size: calc(16px * ${fontScale}) !important;
      }
      
      /* For elements, we need to scale their font-size by the scale factor */
      *:not(button[title="Increase font size"]):not(button[title="Decrease font size"]):not(img):not(svg):not(canvas):not(video):not(iframe) {
        font-size: calc(1em * ${fontScale}) !important;
      }
      
      /* Reset for A+ A- buttons to prevent scaling */
      button[title="Increase font size"],
      button[title="Decrease font size"] {
        font-size: 11px !important;
      }
    `;
  }, [fontScale]);

  // Calculate SUPPORT nav item position for top bar alignment
  useEffect(() => {
    const updateSupportPosition = () => {
      if (typeof window !== 'undefined' && navItemRefs.current?.support) {
        const supportElement = navItemRefs.current.support;
        if (supportElement) {
          const rect = supportElement.getBoundingClientRect();
          const topBarContainer = document.querySelector('[data-top-bar-container]');
          if (topBarContainer) {
            const containerRect = topBarContainer.getBoundingClientRect();
            // Calculate left position relative to top bar container
            const leftPosition = rect.left - containerRect.left;
            setSupportNavPosition(leftPosition);
          }
        }
      }
    };

    // Update on mount and resize
    const timeout = setTimeout(updateSupportPosition, 300);
    window.addEventListener('resize', updateSupportPosition);
    
    // Also update when nav items are rendered
    const checkInterval = setInterval(() => {
      if (navItemRefs.current?.support) {
        updateSupportPosition();
        clearInterval(checkInterval);
      }
    }, 100);

    return () => {
      window.removeEventListener('resize', updateSupportPosition);
      clearTimeout(timeout);
      clearInterval(checkInterval);
    };
  }, []);

  // Handle font size increase (magnification) - gradual increase
  const handleFontSizeIncrease = () => {
    setFontScale(prev => Math.min(prev + 0.02, 1.5)); // Increase by 2% per click, max 150% (1.5x)
  };

  // Handle font size decrease (magnification) - gradual decrease
  const handleFontSizeDecrease = () => {
    setFontScale(prev => Math.max(prev - 0.02, 0.8)); // Decrease by 2% per click, min 80% (0.8x)
  };

  // Preload all navigation panel images (similar to banner preloading in index.js)
  const preloadNavImages = async () => {
    if (typeof window === 'undefined') return;
    
    // Static fallback images that are always used
    const staticImages = [
      '/assets/aboutus.png',
      '/assets/mentorship.png',
      '/projects/main1.png',
      '/assets/world/africa.png'
    ];
    
    // Preload all static images
    const loadPromises = staticImages.map((url) => {
      return new Promise((resolve) => {
        const img = new window.Image();
        const timeout = setTimeout(() => {
          resolve(url); // Resolve anyway after timeout
        }, 2000); // 2 second timeout per image
        
        img.onload = () => {
          clearTimeout(timeout);
          resolve(url);
        };
        img.onerror = () => {
          clearTimeout(timeout);
          resolve(url); // Resolve anyway to not block
        };
        img.src = url;
      });
    });

    try {
      // Wait for all images to load or timeout (max 3 seconds total)
      const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => {
          resolve('timeout');
        }, 3000); // 3 second maximum wait
      });

      await Promise.race([
        Promise.all(loadPromises),
        timeoutPromise
      ]);
      setNavImagesLoaded(true);
    } catch (error) {
      console.error('Error preloading nav images:', error);
      // Still mark as loaded even if some fail
      setNavImagesLoaded(true);
    }
  };

  // Fetch page images (about-us, mentorship and navbar dropdown images)
  useEffect(() => {
    const fetchPageImages = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page-images`);
        if (response.ok) {
          const data = await response.json();
          const aboutUsImage = data.data?.find(img => img.page_name === 'about-us' && img.is_active);
          if (aboutUsImage?.image_url) {
            setAboutPageImage(aboutUsImage.image_url);
            // Preload the API image immediately
            const img = new window.Image();
            img.src = aboutUsImage.image_url;
            // Also add preload link for better browser optimization
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = aboutUsImage.image_url;
            document.head.appendChild(link);
          }
          const mentorshipPageImage = data.data?.find(img => img.page_name === 'mentorship' && img.is_active);
          if (mentorshipPageImage?.image_url) {
            setMentorshipImage(mentorshipPageImage.image_url);
            // Preload the API image immediately
            const img = new window.Image();
            img.src = mentorshipPageImage.image_url;
            // Also add preload link for better browser optimization
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = mentorshipPageImage.image_url;
            document.head.appendChild(link);
          }

          // Navbar dropdown: About Us image
          const navAbout = data.data?.find(img => img.page_name === 'nav-about-us' && img.is_active);
          if (navAbout?.image_url) {
            setNavAboutImage(navAbout.image_url);
          }

          // Navbar dropdown: Opportunities image
          const navOpportunities = data.data?.find(img => img.page_name === 'nav-opportunities' && img.is_active);
          if (navOpportunities?.image_url) {
            setNavOpportunitiesImage(navOpportunities.image_url);
          }

          // Navbar dropdown: Our Impact image
          const navImpact = data.data?.find(img => img.page_name === 'nav-impact' && img.is_active);
          if (navImpact?.image_url) {
            setNavImpactImage(navImpact.image_url);
          }

          // Navbar dropdown: Leadership image
          const navLeadership = data.data?.find(img => img.page_name === 'nav-leadership' && img.is_active);
          if (navLeadership?.image_url) {
            setNavLeadershipImage(navLeadership.image_url);
          }

          // Support page image (for fallback)
          const supportPage = data.data?.find(img => img.page_name === 'support' && img.is_active);
          if (supportPage?.image_url) {
            setSupportPageImage(supportPage.image_url);
          }

          // Navbar dropdown: Support image
          const navSupport = data.data?.find(img => img.page_name === 'nav-support' && img.is_active);
          if (navSupport?.image_url) {
            setNavSupportImage(navSupport.image_url);
          }
        }
      } catch (error) {
        console.log('Error fetching page images:', error);
      }
    };
    fetchPageImages();
  }, []);

  // Preload all navigation panel images on component mount
  useEffect(() => {
    preloadNavImages();
  }, []);

  // Fetch events from API - matching pages/knowledge/index.js
  useEffect(() => {
    const fetchEvents = async () => {
      setEventsLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`);
        if (response.ok) {
          const data = await response.json();
          
          // Get all active events, sort by date, and limit to 2 (like pages/knowledge/index.js)
          const allEvents = (data.data || [])
            .filter(event => {
              // Only show active events
              return event.is_active !== false;
            })
            .sort((a, b) => {
              // Sort by date: most recent first
              if (!a.event_date && !b.event_date) return 0;
              if (!a.event_date) return 1;
              if (!b.event_date) return -1;
              
              const dateA = new Date(a.event_date);
              const dateB = new Date(b.event_date);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              
              // Prioritize upcoming events, then sort by date
              const aIsUpcoming = dateA >= today;
              const bIsUpcoming = dateB >= today;
              
              if (aIsUpcoming && !bIsUpcoming) return -1;
              if (!aIsUpcoming && bIsUpcoming) return 1;
              
              // Both same type, sort by date (ascending for upcoming, descending for past)
              return aIsUpcoming ? dateA - dateB : dateB - dateA;
            })
            .slice(0, 2);
          
          setEvents(allEvents);
        } else {
          setEvents([]);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
      } finally {
        setEventsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Format date for events - matching format from pages/knowledge/index.js
  const formatEventDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Language options
  const languages = [
    { code: 'en', name: t('languages.en'), flag: '🇺🇸' },
    { code: 'es', name: t('languages.es'), flag: '🇪🇸' },
    { code: 'fr', name: t('languages.fr'), flag: '🇫🇷' },
    { code: 'de', name: t('languages.de'), flag: '🇩🇪' },
    { code: 'it', name: t('languages.it'), flag: '🇮🇹' },
    { code: 'pt', name: t('languages.pt'), flag: '🇵🇹' },
    { code: 'ar', name: t('languages.ar'), flag: '🇸🇦' },
    { code: 'hi', name: t('languages.hi'), flag: '🇮🇳' },
    { code: 'zh', name: t('languages.zh'), flag: '🇨🇳' },
    { code: 'ja', name: t('languages.ja'), flag: '🇯🇵' },
    { code: 'ur', name: t('languages.ur') || 'Urdu', flag: '🇵🇰' },
    { code: 'bn', name: t('languages.bn') || 'বাংলা', flag: '🇧🇩' },
    { code: 'ne', name: t('languages.ne') || 'नेपाली', flag: '🇳🇵' },
    { code: 'si', name: t('languages.si') || 'සිංහල', flag: '🇱🇰' },
    { code: 'ta', name: t('languages.ta') || 'தமிழ்', flag: '🇮🇳' },
    { code: 'vi', name: t('languages.vi') || 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'th', name: t('languages.th') || 'ไทย', flag: '🇹🇭' },
    { code: 'fil', name: t('languages.fil') || 'Filipino', flag: '🇵🇭' },
    { code: 'ms', name: t('languages.ms') || 'Bahasa Melayu', flag: '🇲🇾' },
    { code: 'sw', name: t('languages.sw') || 'Kiswahili', flag: '🇰🇪' },
    { code: 'ka', name: t('languages.ka') || 'ქართული', flag: '🇬🇪' },
    { code: 'ky', name: t('languages.ky') || 'Кыргызча', flag: '🇰🇬' },
    { code: 'lv', name: t('languages.lv') || 'Latviešu', flag: '🇱🇻' },
    { code: 'hu', name: t('languages.hu') || 'Magyar', flag: '🇭🇺' },
    { code: 'pl', name: t('languages.pl') || 'Polski', flag: '🇵🇱' },
    { code: 'nb', name: t('languages.nb') || 'Norsk', flag: '🇳🇴' },
    { code: 'my', name: t('languages.my') || 'မြန်မာ', flag: '🇲🇲' }
    ,{ code: 'ha', name: t('languages.ha') || 'Hausa', flag: '🇳🇬' }
    ,{ code: 'yo', name: t('languages.yo') || 'Yorùbá', flag: '🇳🇬' }
    ,{ code: 'ig', name: t('languages.ig') || 'Igbo', flag: '🇳🇬' }
    ,{ code: 'pcm', name: t('languages.pcm') || 'Naija Pidgin', flag: '🇳🇬' }
  ];

  const filteredLanguages = languages.filter((language) => {
    const query = languageSearch.trim().toLowerCase();
    if (!query) return true;
    return (
      language.code.toLowerCase().includes(query) ||
      (language.name || '').toString().toLowerCase().includes(query)
    );
  });

  // Ref for expanded panel to prevent closing when clicking inside
  const expandedPanelRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Keep dropdown open when clicking inside language dropdown/search
      if (languageDropdownRef.current && languageDropdownRef.current.contains(event.target)) {
        return;
      }
      // Keep dropdown open when clicking inside top language dropdown
      if (topLanguageDropdownRef.current && topLanguageDropdownRef.current.contains(event.target)) {
        return;
      }
      // Keep dropdown open when clicking inside login dropdown
      if (loginDropdownRef.current && loginDropdownRef.current.contains(event.target)) {
        return;
      }
      // Keep dropdown open when clicking inside join us dropdown
      if (joinUsDropdownRef.current && joinUsDropdownRef.current.contains(event.target)) {
        return;
      }
      // Keep dropdown open when clicking inside expanded panel
      if (expandedPanelRef.current && expandedPanelRef.current.contains(event.target)) {
        return;
      }
      // Keep dropdown open when clicking on nav items
      if (navItemsRef.current && navItemsRef.current.contains(event.target)) {
        return;
      }
      if (activeDropdown !== null) {
        setActiveDropdown(null);
      }
      if (isLanguageOpen) {
        setIsLanguageOpen(false);
        setLanguageSearch(''); // Clear search when closing
      }
      if (isTopLanguageOpen) {
        setIsTopLanguageOpen(false);
        setLanguageSearch(''); // Clear search when closing
      }
      if (isLoginDropdownOpen) {
        setIsLoginDropdownOpen(false);
      }
      if (isJoinUsDropdownOpen) {
        setIsJoinUsDropdownOpen(false);
      }
      // Only close expanded nav if clicking truly outside (not on navbar or panel)
      if (showExpandedNav && !expandedPanelRef.current?.contains(event.target) && 
          !navItemsRef.current?.contains(event.target)) {
        // Check if clicking on navbar container itself
        const navbarElement = event.target.closest('nav');
        if (!navbarElement || !navbarElement.contains(navItemsRef.current)) {
          setShowExpandedNav(false);
          setActiveExpandedSection(null);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [activeDropdown, isLanguageOpen, showExpandedNav, isLoginDropdownOpen, isTopLanguageOpen, isJoinUsDropdownOpen]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  // Reset dropdown state when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      setShowExpandedNav(false);
      setActiveExpandedSection(null);
      setActiveDropdown(null);
      setIsLanguageOpen(false);
      setIsLoginDropdownOpen(false);
      setIsJoinUsDropdownOpen(false);
      setHoveredRegion(null);
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        setHoverTimeout(null);
      }
      if (joinUsDropdownTimeoutRef.current) {
        clearTimeout(joinUsDropdownTimeoutRef.current);
        joinUsDropdownTimeoutRef.current = null;
      }
    };

    router.events.on('routeChangeStart', handleRouteChange);
    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router, hoverTimeout]);

  // Also reset state when pathname changes (additional safety)
  useEffect(() => {
    setShowExpandedNav(false);
    setActiveExpandedSection(null);
    setActiveDropdown(null);
    setIsLanguageOpen(false);
    setIsLoginDropdownOpen(false);
    setIsJoinUsDropdownOpen(false);
    setHoveredRegion(null);
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    if (joinUsDropdownTimeoutRef.current) {
      clearTimeout(joinUsDropdownTimeoutRef.current);
      joinUsDropdownTimeoutRef.current = null;
    }
  }, [router.pathname]);

  // Close country dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isCountryOpen && !event.target.closest('.country-dropdown-container')) {
        setIsCountryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCountryOpen]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setIsLoginDropdownOpen(false);
    // Force a full page reload to update all components
    window.location.href = '/';
  };

  // Handle opening contact modal with subject
  const handleOpenContactModal = (subject) => {
    setContactFormSubject(subject);
    setContactFormData({
      fullName: '',
      email: '',
      country: null,
      message: ''
    });
    setContactFormResult(null);
    setIsJoinUsDropdownOpen(false);
    setShowContactModal(true);
  };

  // Handle contact form submission
  const handleContactFormSubmit = async (e) => {
    e.preventDefault();
    setContactFormSubmitting(true);
    setContactFormResult(null);
    
    try {
      const nameTrimmed = (contactFormData.fullName || '').trim();
      const emailTrimmed = (contactFormData.email || '').trim();
      const messageTrimmed = (contactFormData.message || '').trim();

      if (!nameTrimmed || !emailTrimmed || !messageTrimmed) {
        setContactFormResult({ type: 'error', message: 'Please fill in all required fields.' });
        setContactFormSubmitting(false);
        return;
      }
      if (nameTrimmed.length < 2) {
        setContactFormResult({ type: 'error', message: 'Full name must be at least 2 characters.' });
        setContactFormSubmitting(false);
        return;
      }
      if (!/\S+@\S+\.\S+/.test(emailTrimmed)) {
        setContactFormResult({ type: 'error', message: 'Please enter a valid email address.' });
        setContactFormSubmitting(false);
        return;
      }
      if (messageTrimmed.length < 5) {
        setContactFormResult({ type: 'error', message: 'Message must be at least 5 characters.' });
        setContactFormSubmitting(false);
        return;
      }

      const messageWithSubject = contactFormSubject 
        ? `${contactFormSubject}\n\n${messageTrimmed}`
        : messageTrimmed;

      const response = await supportAPI.submit({
        full_name: nameTrimmed,
        email: emailTrimmed,
        country_code: contactFormData.country ? contactFormData.country.code : null,
        message: messageWithSubject,
      });
      
      if (response && response.success) {
        setContactFormResult({ type: 'success', message: 'Submitted successfully. We will get back to you soon!' });
        setContactFormData({
          fullName: '',
          email: '',
          country: null,
          message: ''
        });
        // Close modal after 2 seconds on success
        setTimeout(() => {
          setShowContactModal(false);
          setContactFormResult(null);
        }, 2000);
      } else {
        setContactFormResult({ type: 'error', message: response?.error || response?.message || 'Submission failed. Please try again.' });
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      let errorMessage = 'Submission failed. Please try again.';
      
      // Handle API error responses
      if (error?.payload) {
        const base = error.payload.error || error.payload.message;
        const details = Array.isArray(error.payload.details) ? `: ${error.payload.details.join(', ')}` : '';
        errorMessage = base ? `${base}${details}` : errorMessage;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      setContactFormResult({ type: 'error', message: errorMessage });
    } finally {
      setContactFormSubmitting(false);
    }
  };

  // Handle language change
  const handleLanguageChange = (languageCode) => {
    setIsLanguageOpen(false);
    setLanguageSearch(''); // Clear search when language is changed
    changeLanguage(languageCode);
    console.log('Language changed to:', languageCode);
  };

  // Handle hover with delay to prevent rapid toggling
  // Note: This function is defined before expandedPanelConfig, so preloadSectionImage
  // will be called after expandedPanelConfig is defined (when component renders)
  const handleMouseEnter = (e, sectionKey = null) => {
    e?.stopPropagation();
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setActiveDropdown(null);
    if (sectionKey) {
      // Reset hovered region when switching sections
      if (sectionKey !== 'global') {
        setHoveredRegion(null);
      }
      // Small delay before opening for smoother feel (like AVPN)
      const openTimeout = setTimeout(() => {
        setActiveExpandedSection(sectionKey);
        setShowExpandedNav(true);
        // Don't set default region - show default image
        if (sectionKey === 'global') {
          setHoveredRegion(null);
        }
      }, 50); // Small delay for smoother opening
      setHoverTimeout(openTimeout);
    } else {
      // If no section key, close the expanded nav
      setActiveExpandedSection(null);
      setShowExpandedNav(false);
    }
  };

  // Handle click on nav item - keep dropdown open
  const handleNavItemClick = (e, sectionKey) => {
    e?.stopPropagation();
    e?.preventDefault();
    // Clear any timeout that might close the dropdown
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    // Reset hovered region when switching sections
    if (sectionKey !== 'global') {
      setHoveredRegion(null);
    }
    // Immediately update the active section
    setActiveExpandedSection(sectionKey);
    setShowExpandedNav(true);
    // Don't set default region - show default image
    if (sectionKey === 'global') {
      setHoveredRegion(null);
    }
    // Force keep it open - don't allow auto-close
  };

  const handleMouseLeaveNavItem = (e) => {
    e?.stopPropagation();
    // Don't close immediately - wait to see if mouse moves to expanded panel
  };

  const handleMouseLeaveNavbar = (e) => {
    e?.stopPropagation();
    // Clear any existing timeout
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    // Don't close if mouse is moving to expanded panel or nav items
    const relatedTarget = e.relatedTarget;
    if (relatedTarget && relatedTarget instanceof Node) {
      if (expandedPanelRef.current?.contains(relatedTarget) || 
          navItemsRef.current?.contains(relatedTarget)) {
        return; // Don't close
      }
    }
    // Slightly longer delay for smoother closing (like AVPN)
    const timeout = setTimeout(() => {
      setShowExpandedNav(false);
      setActiveExpandedSection(null);
      setHoverTimeout(null);
    }, 250); // Balanced delay for smooth closing
    setHoverTimeout(timeout);
  };

  const handleMouseEnterPanel = (e) => {
    e?.stopPropagation();
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
  };

  const handleMouseLeavePanel = (e) => {
    e?.stopPropagation();
    // Don't close if mouse is moving back to navbar
    const relatedTarget = e.relatedTarget;
    if (relatedTarget && relatedTarget instanceof Node) {
      // Check if mouse is moving to navbar
      if (navItemsRef.current?.contains(relatedTarget)) {
        return; // Don't close
      }
    }
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    // Slightly longer delay for smoother closing (like AVPN)
    const timeout = setTimeout(() => {
      setShowExpandedNav(false);
      setActiveExpandedSection(null);
      setHoverTimeout(null);
      setHoveredRegion(null); // Reset map hover when closing
    }, 250); // Balanced delay for smooth closing
    setHoverTimeout(timeout);
  };

  // Toggle collapsible sections in mobile menu
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Collapsible Section Component for Mobile Menu
  const CollapsibleSection = ({ title, sectionKey, children, hasSubItems = true }) => {
    const isExpanded = expandedSections[sectionKey];
    // Check if current page matches this section
    const isActiveSection = (() => {
      const path = router.pathname;
      switch(sectionKey) {
        case 'aboutUs': return path.startsWith('/about');
        case 'opportunities': return path.startsWith('/opportunities');
        case 'ourImpact': return path.startsWith('/impact');
        case 'leadership': return path.startsWith('/leadership');
        case 'knowledgeHub': return path.startsWith('/knowledge');
        case 'members': return path.startsWith('/auth') || path.startsWith('/dashboard');
        default: return false;
      }
    })();
    return (
      <div className="border-b border-white/10">
        <button
          onClick={() => hasSubItems && toggleSection(sectionKey)}
          className={`w-full flex items-center justify-between py-3.5 px-5 text-left transition-colors duration-200 ${isExpanded ? 'bg-white/15' : 'hover:bg-white/10'} ${isActiveSection ? 'bg-[#FECB07]/20' : ''}`}
        >
          <span className={`text-sm font-semibold uppercase tracking-wide ${isActiveSection ? 'text-[#FECB07]' : 'text-white'}`}>{title}</span>
          {hasSubItems && (
            <svg 
              className={`w-4 h-4 text-white transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>
        {hasSubItems && isExpanded && (
          <div className="bg-white/10 border-l-2 border-[#FECB07] ml-5 overflow-hidden" style={{ animation: 'expandIn 0.2s ease-out' }}>
            <style jsx>{`
              @keyframes expandIn {
                from {
                  opacity: 0;
                  max-height: 0;
                }
                to {
                  opacity: 1;
                  max-height: 500px;
                }
              }
            `}</style>
            {children}
          </div>
        )}
      </div>
    );
  };

  // Menu Item Component for Mobile Menu
  const MenuItem = ({ href, children, onClick }) => {
    const isActive = router.pathname === href || router.asPath === href;
    return (
      <Link 
        href={href} 
        className={`block py-2.5 px-4 text-sm transition-all duration-200 border-b border-white/5 last:border-b-0 ${isActive ? 'text-[#FECB07] bg-white/10 font-medium' : 'text-white/90 hover:text-white hover:bg-white/10'}`}
        style={{
          fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'
        }}
        onClick={onClick}
      >
        {isActive && <span className="mr-2">•</span>}
        {children}
      </Link>
    );
  };

  const navItems = [
    {
      key: 'about',
      label: t('navbar.aboutUs'),
      href: '/about',
      dropdown: [
        { label: t('expandedNav.aboutUs'), href: '/about' },
        { label: t('expandedNav.globalSecretariat'), href: '/about/global-secretariat' },
        { label: t('expandedNav.partnerships'), href: '/about/partnerships' },
        { label: t('expandedNav.successStories'), href: '/about/success-stories' }
      ]
    },
    {
      key: 'opportunities',
      label: t('navbar.opportunities'),
      href: '/opportunities',
      dropdown: [
        { label: t('expandedNav.mentorship'), href: '/opportunities/mentorship' },
        { label: t('expandedNav.aiPlatform'), href: '/opportunities/ai-platform' },
        // { label: t('expandedNav.tenders'), href: '/opportunities/tenders' }
      ]
    },
    {
      key: 'ourImpact',
      label: t('navbar.ourImpact'),
      href: '/impact',
      dropdown: [
        { label: 'Our Impact', href: '/impact' },
        { label: 'Projects', href: '/impact/project' },
        { label: 'Activity Report', href: '/impact/activity-report' },
        { label: 'Roundups', href: '/impact/roundups' }
      ]
    },
    {
      key: 'leadership',
      label: t('navbar.leadership'),
      href: '/leadership',
      dropdown: [
        { label: t('expandedNav.globalAmbassadors'), href: '/leadership/category/global-ambassadors' },
        { label: t('expandedNav.regionalPresidents'), href: '/leadership/category/regional-presidents' },
        { label: t('expandedNav.statePresidents'), href: '/leadership/category/state-presidents' },
        { label: t('expandedNav.globalSecretariat'), href: '/leadership/category/global-secretariat' }
      ]
    },
    {
      key: 'global',
      label: t('navbar.global'),
      href: '/global-presence',
      dropdown: [
        { label: t('expandedNav.africa'), href: '/global-presence?region=africa' },
        { label: t('expandedNav.asia'), href: '/global-presence?region=asia' },
        { label: t('expandedNav.europe'), href: '/global-presence?region=europe' },
        { label: t('expandedNav.northAmerica'), href: '/global-presence?region=north-america' },
        { label: t('expandedNav.southAmerica'), href: '/global-presence?region=south-america' }
      ]
    },
    {
      key: 'knowledge',
      label: t('navbar.knowledgeHub'),
      href: '/knowledge',
      dropdown: [
        { label: 'Knowledge hub', href: '/knowledge' },
        { label: t('expandedNav.blogs'), href: '/knowledge/blog' },
        { label: t('expandedNav.resources'), href: '/knowledge/resources' }
      ]
    },
    {
      key: 'support',
      label: t('navbar.support'),
      href: '/support',
      dropdown: []
    },
  ];

  // Content configuration for the desktop expanded panel
  const expandedPanelConfig = {
    about: {
      title: t('expandedNav.aboutUs'),
      href: '/about',
      imageSrc: navAboutImage || aboutPageImage || '',
      description:
        'A Global Chamber for Women Entrepreneurs - enabling and celebrating women\'s business acumen & ambition through connecting our members to industry leaders, professional development resources, and relevant opportunities.',
      items: [
        { label: t('expandedNav.aboutUs'), href: '/about' },
        { label: t('expandedNav.globalSecretariat'), href: '/about/global-secretariat' },
        { label: t('expandedNav.partnerships'), href: '/about/partnerships' },
        { label: t('expandedNav.successStories'), href: '/about/success-stories' }
      ],
      useFullPanel: true // Use full panel with image
    },
    knowledge: {
      title: t('expandedNav.knowledgeHub'),
      href: '/knowledge',
      items: [
        { label: 'Knowledge hub', href: '/knowledge' },
        { label: t('expandedNav.blogs'), href: '/knowledge/blog' },
        { label: t('expandedNav.resources'), href: '/knowledge/resources' }
      ],
      useFullPanel: true, // Use full panel with events
      useEventsView: true // Use custom events view
    },
    opportunities: {
      title: t('expandedNav.opportunities'),
      href: '/opportunities',
      imageSrc: navOpportunitiesImage || mentorshipImage || '',
      description:
        'Access curated mentorship, AI-enabled tools, and business opportunities tailored for women entrepreneurs.',
      items: [
        { label: t('expandedNav.mentorship'), href: '/opportunities/mentorship' },
        { label: t('expandedNav.aiPlatform'), href: '/opportunities/ai-platform' },
        // { label: t('expandedNav.tenders'), href: '/opportunities/tenders' }
      ],
      useFullPanel: true, // Use full panel with image
      useMentorshipView: true // Use custom mentorship view with buttons
    },
    leadership: {
      title: t('expandedNav.leadership'),
      href: '/leadership/category/global-ambassadors',
      imageSrc: navLeadershipImage || aboutPageImage || '',
      description: 'Empowering women in Business on a global level',
      customTitle: 'Check our Global Impact Leaders',
      items: [
        { label: t('expandedNav.globalAmbassadors'), href: '/leadership/category/global-ambassadors' },
        { label: t('expandedNav.regionalPresidents'), href: '/leadership/category/regional-presidents' },
        { label: t('expandedNav.statePresidents'), href: '/leadership/category/state-presidents' },
        { label: t('expandedNav.globalSecretariat'), href: '/leadership/category/global-secretariat' }
      ],
      useFullPanel: true, // Use full panel with image
      useMentorshipView: true // Use custom mentorship view with same styling as Opportunities
    },
    global: {
      title: t('navbar.global'),
      href: '/global-presence',
      imageSrc: '/full-map/Mapchart.svg',
      description:
        'Explore our global footprint and connect with ABWCI leaders and members across continents.',
      items: [
        { label: t('expandedNav.africa'), href: '/global-presence?region=africa' },
        { label: t('expandedNav.asia'), href: '/global-presence?region=asia' },
        { label: t('expandedNav.europe'), href: '/global-presence?region=europe' },
        { label: t('expandedNav.northAmerica'), href: '/global-presence?region=north-america' },
        { label: t('expandedNav.southAmerica'), href: '/global-presence?region=south-america' }
      ],
      useFullPanel: true, // Use full panel with image
      useMapView: true // Use interactive map instead of static image
    },
    ourImpact: {
      title: t('navbar.ourImpact'),
      href: '/impact',
      imageSrc: navImpactImage || '/projects/main1.png',
      description:
        "A nationwide journey unlocking entrepreneurship, inclusion, and economic independence for women at the grassroots. Together, we're building a future where rural women don't just participate in the economy — they lead it.",
      customTitle: "Grameen Heroes | ग्रामीण हीरोज़",
      customSubtitle: "1500+ women reached | 5 State-Level Pitches | 35 National Winners",
      items: [
        { label: 'Our Impact', href: '/impact' },
        { label: 'Projects', href: '/impact/project' },
        { label: 'Activity Report', href: '/impact/activity-report' },
        { label: 'Roundups', href: '/impact/roundups' }
      ],
      useFullPanel: true // Use full panel with image
    },
    support: {
      title: t('expandedNav.support'),
      href: '/support',
      imageSrc: navSupportImage || supportPageImage || '/assets/support/Rectangle 101.png',
      items: [
        { label: t('expandedNav.contactUs'), href: '/support' },
        { label: t('expandedNav.faqs'), href: '/support' }
      ],
      useFullPanel: true, // Use full panel with image
      useSupportView: true // Use custom support view with search and categories
    }
  };

  // Preload image for a section (defined after expandedPanelConfig)
  const preloadSectionImage = (sectionKey) => {
    const config = expandedPanelConfig[sectionKey];
    if (config?.imageSrc && typeof window !== 'undefined') {
      const img = new window.Image();
      img.src = config.imageSrc;
    }
  };

  return (
    <nav className="relative z-50 group">
      {/* Top Purple Bar */}
      <div 
        className="hidden lg:block"
        style={{
          position: 'relative',
          width: '100%',
          height: '40px',
          background: '#653A96',
          zIndex: 49,
          overflow: 'visible'
        }}
      >
        <div className="w-full h-full px-6 lg:px-8 xl:px-12 2xl:px-16" style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', overflow: 'visible' }} data-top-bar-container>
          {/* Search Box - Positioned above logo, aligned with logo's "A" */}
          <div 
            className="absolute top-1/2 -translate-y-1/2"
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '4px 10px',
              gap: '10px',
              width: isSearchFocused ? '240px' : '180px',
              height: '24px',
              background: '#FFFFFF',
              borderRadius: '20px',
              left: 'clamp(20px, 1.5vw, 24px)', // Responsive left position aligned with logo's "A"
              transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: isSearchFocused ? '0 2px 8px rgba(0, 0, 0, 0.15)' : 'none'
            }}
          >
            <input
              type="text"
              placeholder="Search"
              value={topSearchQuery}
              onChange={(e) => setTopSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && topSearchQuery.trim()) {
                  router.push(`/search?q=${encodeURIComponent(topSearchQuery)}`);
                }
              }}
              className="search-input-placeholder"
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontWeight: 400,
                fontSize: '12px',
                lineHeight: '14px',
                letterSpacing: '-0.02em',
                color: '#2B2D30',
                caretColor: '#000000'
              }}
            />
            <style jsx>{`
              .search-input-placeholder::placeholder {
                color:rgb(0, 0, 0);
                opacity: 0.6;
              }
            `}</style>
            <button
              onClick={() => {
                if (topSearchQuery.trim()) {
                  router.push(`/search?q=${encodeURIComponent(topSearchQuery)}`);
                }
              }}
              onMouseDown={(e) => e.preventDefault()}
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.875 10.875L8.4375 8.4375M9.75 5.625C9.75 7.90317 7.90317 9.75 5.625 9.75C3.34683 9.75 1.5 7.90317 1.5 5.625C1.5 3.34683 3.34683 1.5 5.625 1.5C7.90317 1.5 9.75 3.34683 9.75 5.625Z" stroke="#2B2D30" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Right Section - Aligned with SUPPORT navigation */}
          <div 
            style={{
              position: 'absolute',
              left: supportNavPosition !== null ? `${supportNavPosition}px` : 'auto',
              right: supportNavPosition === null ? 'clamp(24px, 2vw, 48px)' : 'auto',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '18px'
            }}
          >
            {/* Contact Us */}
            <button
              onClick={handleCopyPhoneNumber}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '6px',
                textDecoration: 'none'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mt-2">
                <path d="M11.3 12C9.91111 12 8.53889 11.6973 7.18333 11.092C5.82778 10.4867 4.59444 9.62822 3.48333 8.51667C2.37222 7.40511 1.514 6.17178 0.908667 4.81667C0.303333 3.46156 0.000444444 2.08933 0 0.7C0 0.5 0.0666666 0.333333 0.2 0.2C0.333333 0.0666666 0.5 0 0.7 0H3.4C3.55556 0 3.69444 0.0528888 3.81667 0.158667C3.93889 0.264444 4.01111 0.389333 4.03333 0.533333L4.46667 2.86667C4.48889 3.04444 4.48333 3.19444 4.45 3.31667C4.41667 3.43889 4.35556 3.54444 4.26667 3.63333L2.65 5.26667C2.87222 5.67778 3.136 6.07489 3.44133 6.458C3.74667 6.84111 4.08289 7.21067 4.45 7.56667C4.79444 7.91111 5.15556 8.23067 5.53333 8.52533C5.91111 8.82 6.31111 9.08933 6.73333 9.33333L8.3 7.76667C8.4 7.66667 8.53067 7.59178 8.692 7.542C8.85333 7.49222 9.01156 7.47822 9.16667 7.5L11.4667 7.96667C11.6222 8.01111 11.75 8.09178 11.85 8.20867C11.95 8.32556 12 8.456 12 8.6V11.3C12 11.5 11.9333 11.6667 11.8 11.8C11.6667 11.9333 11.5 12 11.3 12Z" fill="white"/>
              </svg>
              <span
                style={{
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontWeight: 500,
                  fontSize: '12px',
                  lineHeight: '14px',
                  letterSpacing: '-0.02em',
                  color: '#FFFFFF'
                }}
              >
                Contact Us
              </span>
            </button>

            {/* A+ | A- */}
            {/* <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <button
                type="button"
                onClick={handleFontSizeIncrease}
                style={{
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontWeight: 500,
                  fontSize: '12px',
                  lineHeight: '14px',
                  letterSpacing: '-0.02em',
                  color: '#FFFFFF',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0 2px',
                  transition: 'opacity 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                title="Increase font size"
              >
                A+
              </button>
              <span
                style={{
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontWeight: 500,
                  fontSize: '12px',
                  lineHeight: '14px',
                  letterSpacing: '-0.02em',
                  color: '#FFFFFF'
                }}
              >
                |
              </span>
              <button
                type="button"
                onClick={handleFontSizeDecrease}
                style={{
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontWeight: 500,
                  fontSize: '12px',
                  lineHeight: '14px',
                  letterSpacing: '-0.02em',
                  color: '#FFFFFF',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0 2px',
                  transition: 'opacity 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                title="Decrease font size"
              >
                A-
              </button>
            </div> */}

            {/* Social Icons */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              {/* LinkedIn Icon */}
              <a
                href="https://www.linkedin.com/company/association-of-business-women-in-commerce-and-industry/about/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity duration-200 flex-shrink-0"
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <svg width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.3333 0C13.7754 0 14.1993 0.175595 14.5118 0.488155C14.8244 0.800716 15 1.22464 15 1.66667V13.3333C15 13.7754 14.8244 14.1993 14.5118 14.5118C14.1993 14.8244 13.7754 15 13.3333 15H1.66667C1.22464 15 0.800716 14.8244 0.488155 14.5118C0.175595 14.1993 0 13.7754 0 13.3333V1.66667C0 1.22464 0.175595 0.800716 0.488155 0.488155C0.800716 0.175595 1.22464 0 1.66667 0H13.3333ZM12.9167 12.9167V8.5C12.9167 7.77949 12.6304 7.0885 12.121 6.57903C11.6115 6.06955 10.9205 5.78333 10.2 5.78333C9.49167 5.78333 8.66667 6.21667 8.26667 6.86667V5.94167H5.94167V12.9167H8.26667V8.80833C8.26667 8.16667 8.78333 7.64167 9.425 7.64167C9.73442 7.64167 10.0312 7.76458 10.25 7.98338C10.4688 8.20217 10.5917 8.49891 10.5917 8.80833V12.9167H12.9167ZM3.23333 4.63333C3.60464 4.63333 3.96073 4.48583 4.22328 4.22328C4.48583 3.96073 4.63333 3.60464 4.63333 3.23333C4.63333 2.45833 4.00833 1.825 3.23333 1.825C2.85982 1.825 2.5016 1.97338 2.23749 2.23749C1.97338 2.5016 1.825 2.85982 1.825 3.23333C1.825 4.00833 2.45833 4.63333 3.23333 4.63333ZM4.39167 12.9167V5.94167H2.08333V12.9167H4.39167Z" fill="#FFFFFF"/>
                </svg>
              </a>

              {/* Twitter/X Icon */}
              <a
                href="https://x.com/abwci_global"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity duration-200 flex-shrink-0"
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.2719 1.5874H18.0831L11.9415 8.60573L19.1665 18.1582H13.5093L9.0784 12.3649L4.00898 18.1582H1.19606L7.76465 10.6499L0.833984 1.5874H6.6344L10.6395 6.88198L15.2719 1.5874ZM14.2852 16.4757H15.843L5.78773 3.18073H4.1159L14.2852 16.4757Z" fill="#FFFFFF"/>
                </svg>
              </a>
            </div>

              {/* Language Selector */}
            <div style={{ position: 'relative' }} ref={topLanguageDropdownRef}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsTopLanguageOpen(!isTopLanguageOpen);
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.66602 9.99996C1.66602 14.6025 5.39685 18.3333 9.99935 18.3333C14.6018 18.3333 18.3327 14.6025 18.3327 9.99996C18.3327 5.39746 14.6018 1.66663 9.99935 1.66663C5.39685 1.66663 1.66602 5.39746 1.66602 9.99996Z" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10.8331 1.70825C10.8331 1.70825 13.3331 4.99992 13.3331 9.99992C13.3331 14.9999 10.8331 18.2916 10.8331 18.2916M9.1664 18.2916C9.1664 18.2916 6.66641 14.9999 6.66641 9.99992C6.66641 4.99992 9.1664 1.70825 9.1664 1.70825M2.19141 12.9166H17.8081M2.19141 7.08325H17.8081" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    gap: '2px'
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontWeight: 500,
                      fontSize: '11px',
                      lineHeight: '13px',
                      letterSpacing: '-0.02em',
                      color: '#FFFFFF'
                    }}
                  >
                    {languages.find(lang => lang.code === currentLanguage)?.name || 'English'}
                  </span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </button>

              {/* Top Language Dropdown */}
              {isTopLanguageOpen && (
                <div
                  style={{ 
                    position: 'absolute',
                    width: '220px',
                    maxHeight: '320px',
                    top: '108px',
                    right: '0px',
                    background: '#FFFFFF',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    border: '1px solid #E5E7EB',
                    zIndex: 100,
                    overflowY: 'auto',
                    transition: 'opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    willChange: 'opacity, transform'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {languages.map((language) => (
                    <button
                      type="button"
                      key={language.code}
                      onClick={() => {
                        handleLanguageChange(language.code);
                        setIsTopLanguageOpen(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        textAlign: 'left',
                        border: 'none',
                        background: currentLanguage === language.code ? '#653a96' : 'transparent',
                        color: currentLanguage === language.code ? '#FFFFFF' : '#374151',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'background-color 0.15s ease',
                        fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                        fontWeight: currentLanguage === language.code ? 600 : 400,
                        fontSize: '13px',
                        lineHeight: '16px'
                      }}
                      onMouseEnter={(e) => {
                        if (currentLanguage !== language.code) {
                          e.currentTarget.style.background = '#F3F4F6';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentLanguage !== language.code) {
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                    >
                      <span style={{ width: '20px', height: '14px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <img
                          src={`https://flagcdn.com/w40/${languageToCountryCode[language.code] || 'us'}.png`}
                          alt={`${language.name} flag`}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'inline-block';
                          }}
                          style={{ width: '20px', height: '14px', objectFit: 'cover', borderRadius: '2px' }}
                        />
                        <span style={{ fontSize: '16px', lineHeight: '1', display: 'none' }} role="img" aria-label={`${language.name} flag`}>{language.flag}</span>
                      </span>
                      <span>{language.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Get a Mentor Button */}
            <Link 
              href="/auth/register?skipStep1=true"
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '6px',
                textDecoration: 'none'
              }}
            >
              <span
                style={{
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontWeight: 500,
                  fontSize: '12px',
                  lineHeight: '14px',
                  letterSpacing: '-0.02em',
                  color: '#FFFFFF'
                }}
              >
                Get a Mentor
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar - Always white background */}
      <div 
        className="bg-white relative"
        style={{
          position: 'relative',
          height: '68px',
          boxSizing: 'border-box',
          zIndex: 50,
            backgroundColor: '#FFFFFF',
        }}
        onMouseLeave={handleMouseLeaveNavbar}
      >
        {/* Yellow underline indicator - will be positioned below specific nav item */}
        <div className="w-full h-full px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between h-full">
            {/* Mobile/Tablet Layout - Hamburger Left, Logo Center, Language Right */}
            <div className="flex items-center justify-between w-full lg:hidden relative h-full">
              {/* Hamburger Menu - Left */}
              <div className="flex items-center ml-2 flex-shrink-0 z-10">
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="focus:outline-none p-2.5 transition-colors duration-200 text-[#653A96]"
                >
                  <Image src="/assets/hero-img/Frame 7909.png" alt="Close" width={40} height={40} />
                  {/* <svg className="h-7 w-7 sm:h-8 sm:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    {isMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg> */}
                </button>
              </div>

              {/* Logo - Center */}
              <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center z-10">
                <Link href="/" className="flex items-center">
                  <div className="relative flex items-center">
                    <Image
                      src="/abwci-newlogo.svg"
                      alt="ABWCI Logo"
                      width={180}
                      height={108}
                      quality={100}
                      className="w-28 h-16 sm:w-32 sm:h-20 object-contain"
                      priority
                      style={{
                        imageRendering: 'crisp-edges',
                        WebkitImageRendering: 'crisp-edges',
                      }}
                    />
                  </div>
                </Link>
              </div>

              {/* Language Button - Right (Globe Icon) */}
              <div className="flex items-center mr-2 flex-shrink-0 z-10 relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLanguageOpen(!isLanguageOpen);
                  }}
                  className="flex items-center focus:outline-none p-2 transition-colors duration-200"
                >
                  <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.66602 9.99996C1.66602 14.6025 5.39685 18.3333 9.99935 18.3333C14.6018 18.3333 18.3327 14.6025 18.3327 9.99996C18.3327 5.39746 14.6018 1.66663 9.99935 1.66663C5.39685 1.66663 1.66602 5.39746 1.66602 9.99996Z" stroke="#653A96" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10.8331 1.70825C10.8331 1.70825 13.3331 4.99992 13.3331 9.99992C13.3331 14.9999 10.8331 18.2916 10.8331 18.2916M9.1664 18.2916C9.1664 18.2916 6.66641 14.9999 6.66641 9.99992C6.66641 4.99992 9.1664 1.70825 9.1664 1.70825M2.19141 12.9166H17.8081M2.19141 7.08325H17.8081" stroke="#653A96" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                {/* Language Dropdown - Mobile */}
                {isLanguageOpen && (
                  <div
                    ref={languageDropdownRef}
                    className="fixed bg-white rounded-lg shadow-lg border border-gray-200 z-[100]"
                    style={{ 
                      width: 'min(280px, calc(100vw - 2rem))',
                      maxWidth: 'calc(100vw - 2rem)',
                      top: '68px',
                      right: '1rem',
                      left: 'auto',
                      maxHeight: 'calc(100vh - 100px)',
                      transition: 'opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      willChange: 'opacity, transform'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
                      <input
                        type="text"
                        value={languageSearch}
                        onChange={(e) => setLanguageSearch(e.target.value)}
                        placeholder="Search language"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#653a96] focus:border-transparent text-gray-800 placeholder-gray-400"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="py-2 max-h-64 overflow-y-auto">
                      {filteredLanguages.length === 0 && (
                        <div className="px-4 py-2 text-sm text-gray-500">No results</div>
                      )}
                      {filteredLanguages.map((language) => (
                        <button
                          type="button"
                          key={language.code}
                          onClick={() => handleLanguageChange(language.code)}
                          className={`w-full px-4 py-2 text-left transition-colors duration-200 flex items-center ${
                            currentLanguage === language.code ? 'bg-[#653a96] text-white' : 'text-gray-700'
                          }`}
                          style={{
                            fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                            fontWeight: currentLanguage === language.code ? 600 : 400,
                            fontSize: '14px',
                            lineHeight: '17px'
                          }}
                        >
                          <span className="mr-3" style={{ width: '28px', height: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <img
                              src={`https://flagcdn.com/w40/${languageToCountryCode[language.code] || 'us'}.png`}
                              alt={`${language.name} flag`}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'inline-block';
                              }}
                              style={{ width: '28px', height: '20px', objectFit: 'cover', borderRadius: '2px' }}
                            />
                            <span style={{ fontSize: '20px', lineHeight: '1', display: 'none' }} role="img" aria-label={`${language.name} flag`}>{language.flag}</span>
                          </span>
                          <span>{language.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Layout - Only shows on large screens (1024px+) */}
            <div className="hidden lg:flex items-center justify-center w-full h-full">
              {/* Logo Section - Left */}
              <div className="flex items-center flex-shrink-0" style={{ marginRight: 'clamp(30px, 2.5vw, 45px)' }}>
                <Link href="/" className="flex items-center">
                  <div className="relative flex items-center">
                    <Image
                      src="/abwci-newlogo.svg"
                      alt="ABWCI Logo"
                      width={180}
                      height={108}
                      quality={100}
                      className="w-20 h-12 sm:w-24 sm:h-14 md:w-28 md:h-16 lg:w-28 lg:h-16 xl:w-32 xl:h-20 object-contain"
                      priority
                      style={{
                        imageRendering: 'crisp-edges',
                        WebkitImageRendering: 'crisp-edges',
                      }}
                    />
                  </div>
                </Link>
              </div>

              {/* Desktop Navigation - Center Section */}
              <div className="flex items-center">
                <div
                  ref={navItemsRef}
                  className="flex items-center"
                  style={{ gap: 'clamp(10px, 1.2vw, 18px)' }}
                  data-nav-items
                >
                  {navItems.map((item, index) => {
                    const isActive = activeExpandedSection === item.key;
                    return (
                    <div 
                      key={index} 
                        ref={(el) => { if (el) navItemRefs.current[item.key] = el; }}
                      className="relative navbar-item group flex-shrink-0"
                        data-key={item.key}
                        onMouseEnter={(e) => {
                          // Preload image immediately when hovering
                          preloadSectionImage(item.key);
                          handleMouseEnter(e, item.key);
                        }}
                        onMouseLeave={handleMouseLeaveNavItem}
                        onClick={(e) => handleNavItemClick(e, item.key)}
                      >
                        <div className="flex flex-col items-center min-w-0">
                          <div 
                            className="px-2 lg:px-2.5 xl:px-3 py-1.5 lg:py-2 flex items-center cursor-pointer text-[#653A96]"
                            style={{
                              fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                              fontWeight: 500,
                              fontSize: 'clamp(11px, 1vw, 14px)',
                              lineHeight: '1.3',
                              letterSpacing: '0.02em',
                              whiteSpace: 'nowrap',
                              transition: 'opacity 0.15s ease-out, transform 0.15s ease-out',
                              willChange: 'opacity'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.opacity = '0.8';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.opacity = '1';
                            }}
                            title={item.label}
                          >
                          {item.label}
                        </div>
                          {/* Yellow underline indicator - only below active nav item */}
                          {isActive && (
                            <div 
                              className="hidden lg:block absolute h-[3px] bg-[#FECB07]"
                              style={{ 
                                bottom: '0px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: 'calc(100% + 8px)',
                                minWidth: '60px',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                willChange: 'transform, opacity'
                              }}
                            />
                          )}
                      </div>
                    </div>
                    );
                  })}
                </div>
                
              </div>

              {/* Right Section - Login/Register, Social Icons, and Language Button */}
              <div className="flex items-center flex-shrink-0" style={{ gap: 'clamp(10px, 1.2vw, 18px)', marginLeft: 'clamp(30px, 2.5vw, 45px)' }}>
                {/* Login/Register or User Name */}
                <div className="flex items-center flex-shrink-0 relative" ref={loginDropdownRef}>
                  {isAuthenticated && user ? (
                    <div className="relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsLoginDropdownOpen(!isLoginDropdownOpen);
                          // Close other dropdowns
                          setShowExpandedNav(false);
                          setActiveExpandedSection(null);
                          setIsLanguageOpen(false);
                        }}
                        onMouseEnter={(e) => {
                          e.stopPropagation();
                          // Opacity effect
                          e.currentTarget.style.opacity = '0.8';
                          // Clear any pending close timeout
                          if (loginDropdownTimeoutRef.current) {
                            clearTimeout(loginDropdownTimeoutRef.current);
                            loginDropdownTimeoutRef.current = null;
                          }
                          setIsLoginDropdownOpen(true);
                          // Close other dropdowns
                          setShowExpandedNav(false);
                          setActiveExpandedSection(null);
                          setIsLanguageOpen(false);
                        }}
                        onMouseLeave={(e) => {
                          // Opacity effect
                          e.currentTarget.style.opacity = '1';
                          // Don't close immediately - wait to see if mouse moves to dropdown
                          const relatedTarget = e.relatedTarget;
                          if (relatedTarget && relatedTarget instanceof Node) {
                            if (loginDropdownRef.current?.contains(relatedTarget)) {
                              return; // Don't close
                            }
                          }
                          // Clear any existing timeout
                          if (loginDropdownTimeoutRef.current) {
                            clearTimeout(loginDropdownTimeoutRef.current);
                          }
                          // Delay closing to allow moving to dropdown
                          loginDropdownTimeoutRef.current = setTimeout(() => {
                            setIsLoginDropdownOpen(false);
                            loginDropdownTimeoutRef.current = null;
                          }, 200);
                        }}
                        className="px-2 lg:px-2.5 xl:px-3 py-1.5 lg:py-2 text-sm transition-colors duration-200 flex items-center flex-shrink-0 text-[#653A96] relative"
                      style={{
                        fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                        fontWeight: 500,
                          fontSize: 'clamp(11px, 1vw, 14px)',
                        lineHeight: '1.3',
                        letterSpacing: '0.02em',
                        whiteSpace: 'nowrap',
                        transition: 'opacity 0.15s ease-out, transform 0.15s ease-out',
                        willChange: 'opacity'
                      }}
                        title={user.firstName || user.username || user.first_name}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mr-1.5 flex-shrink-0" style={{ color: '#653A96' }}>
                        <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.33 4 18V20H20V18C20 15.33 14.67 14 12 14Z" fill="currentColor"/>
                      </svg>
                        <span>{user.firstName || user.first_name || user.username}</span>
                        {/* Yellow underline indicator */}
                        {isLoginDropdownOpen && (
                          <div 
                            className="hidden lg:block absolute h-[3px] bg-[#FECB07]"
                            style={{ 
                              bottom: '0px',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              width: 'calc(100% + 8px)',
                              minWidth: '60px',
                              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                              willChange: 'transform, opacity'
                            }}
                          />
                        )}
                      </button>
                      
                      {/* User Dropdown Menu - When Logged In */}
                      {isLoginDropdownOpen && (
                        <div
                          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-6 rounded-2xl shadow-2xl py-2 min-w-[200px] z-50"
                          style={{
                            background: 'linear-gradient(180deg, #653A96 57.21%, #4E1E85 100%)',
                            transition: 'opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            willChange: 'opacity, transform'
                          }}
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => e.stopPropagation()}
                          onMouseEnter={() => {
                            // Clear any pending close timeout
                            if (loginDropdownTimeoutRef.current) {
                              clearTimeout(loginDropdownTimeoutRef.current);
                              loginDropdownTimeoutRef.current = null;
                            }
                            setIsLoginDropdownOpen(true);
                          }}
                          onMouseLeave={(e) => {
                            // Don't close immediately - wait to see if mouse moves back to button
                            const relatedTarget = e.relatedTarget;
                            if (relatedTarget && relatedTarget instanceof Node) {
                              if (loginDropdownRef.current?.contains(relatedTarget)) {
                                return; // Don't close
                              }
                            }
                            // Delay closing
                            if (loginDropdownTimeoutRef.current) {
                              clearTimeout(loginDropdownTimeoutRef.current);
                            }
                            loginDropdownTimeoutRef.current = setTimeout(() => {
                              setIsLoginDropdownOpen(false);
                              loginDropdownTimeoutRef.current = null;
                            }, 200);
                          }}
                        >
                          {user.email?.toLowerCase() === 'admin' && (
                            <>
                              <Link
                                href="/admin"
                                className="flex items-center px-4 py-3 text-white hover:bg-white/10 transition-colors"
                                style={{
                                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                                  fontSize: '16px'
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsLoginDropdownOpen(false);
                                }}
                                onMouseDown={(e) => e.stopPropagation()}
                              >
                                Admin Dashboard
                              </Link>
                            </>
                          )}
                          <Link
                            href="/auth/register?role=mentor"
                            className="flex items-center px-4 py-3 text-white hover:bg-white/10 transition-colors"
                            style={{
                              fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                              fontSize: '16px'
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsLoginDropdownOpen(false);
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                          >
                            {t('expandedNav.becomeMentor') || 'Join as a Mentor'}
                          </Link>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleLogout();
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            className="w-full flex items-center px-4 py-3 text-white hover:bg-white/10 transition-colors text-left"
                            style={{
                              fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                              fontSize: '16px'
                            }}
                          >
                            Logout
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsLoginDropdownOpen(!isLoginDropdownOpen);
                          // Close other dropdowns
                          setShowExpandedNav(false);
                          setActiveExpandedSection(null);
                          setIsLanguageOpen(false);
                        }}
                        onMouseEnter={(e) => {
                          e.stopPropagation();
                          // Opacity effect
                          e.currentTarget.style.opacity = '0.8';
                          // Clear any pending close timeout
                          if (loginDropdownTimeoutRef.current) {
                            clearTimeout(loginDropdownTimeoutRef.current);
                            loginDropdownTimeoutRef.current = null;
                          }
                          setIsLoginDropdownOpen(true);
                          // Close other dropdowns
                          setShowExpandedNav(false);
                          setActiveExpandedSection(null);
                          setIsLanguageOpen(false);
                        }}
                        onMouseLeave={(e) => {
                          // Opacity effect
                          e.currentTarget.style.opacity = '1';
                          // Don't close immediately - wait to see if mouse moves to dropdown
                          const relatedTarget = e.relatedTarget;
                          if (relatedTarget && relatedTarget instanceof Node) {
                            if (loginDropdownRef.current?.contains(relatedTarget)) {
                              return; // Don't close
                            }
                          }
                          // Clear any existing timeout
                          if (loginDropdownTimeoutRef.current) {
                            clearTimeout(loginDropdownTimeoutRef.current);
                          }
                          // Delay closing to allow moving to dropdown
                          loginDropdownTimeoutRef.current = setTimeout(() => {
                            setIsLoginDropdownOpen(false);
                            loginDropdownTimeoutRef.current = null;
                          }, 200);
                        }}
                        className="px-2 lg:px-2.5 xl:px-3 py-1.5 lg:py-2 text-sm transition-colors duration-200 flex items-center flex-shrink-0 text-[#653A96] relative"
                      style={{
                        fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                        fontWeight: 500,
                          fontSize: 'clamp(11px, 1vw, 14px)',
                        lineHeight: '1.3',
                        letterSpacing: '0.02em',
                        whiteSpace: 'nowrap',
                        transition: 'opacity 0.15s ease-out, transform 0.15s ease-out',
                        willChange: 'opacity'
                      }}
                      title={t('navbar.loginRegister')}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mr-1.5 flex-shrink-0" style={{ color: '#653A96' }}>
                        <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.33 4 18V20H20V18C20 15.33 14.67 14 12 14Z" fill="currentColor"/>
                      </svg>
                        <span>{(t('navbar.loginRegister') || 'Login/Register').toUpperCase()}</span>
                        {/* Yellow underline indicator */}
                        {isLoginDropdownOpen && (
                          <div 
                            className="hidden lg:block absolute h-[3px] bg-[#FECB07]"
                            style={{ 
                              bottom: '0px',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              width: 'calc(100% + 8px)',
                              minWidth: '60px',
                              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                              willChange: 'transform, opacity'
                            }}
                          />
                        )}
                      </button>
                      
                      {/* Login Dropdown Menu */}
                      {isLoginDropdownOpen && (
                        <div
                          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-6 rounded-2xl shadow-2xl py-2 min-w-[200px] z-50"
                          style={{
                            background: 'linear-gradient(180deg, #653A96 57.21%, #4E1E85 100%)',
                            transition: 'opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            willChange: 'opacity, transform'
                          }}
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => e.stopPropagation()}
                          onMouseEnter={() => {
                            // Clear any pending close timeout
                            if (loginDropdownTimeoutRef.current) {
                              clearTimeout(loginDropdownTimeoutRef.current);
                              loginDropdownTimeoutRef.current = null;
                            }
                            setIsLoginDropdownOpen(true);
                          }}
                          onMouseLeave={(e) => {
                            // Don't close immediately - wait to see if mouse moves back to button
                            const relatedTarget = e.relatedTarget;
                            if (relatedTarget && relatedTarget instanceof Node) {
                              if (loginDropdownRef.current?.contains(relatedTarget)) {
                                return; // Don't close
                              }
                            }
                            // Delay closing
                            if (loginDropdownTimeoutRef.current) {
                              clearTimeout(loginDropdownTimeoutRef.current);
                            }
                            loginDropdownTimeoutRef.current = setTimeout(() => {
                              setIsLoginDropdownOpen(false);
                              loginDropdownTimeoutRef.current = null;
                            }, 200);
                          }}
                        >
                          <Link
                            href="/auth/login"
                            className="flex items-center px-4 py-3 text-white hover:bg-white/10 transition-colors"
                            style={{
                              fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                              fontSize: '16px'
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsLoginDropdownOpen(false);
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                          >
                            {t('expandedNav.memberLogin') || 'Existing Member'}
                    </Link>
                          <Link
                            href="/auth/register"
                            className="flex items-center px-4 py-3 text-white hover:bg-white/10 transition-colors"
                            style={{
                              fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                              fontSize: '16px'
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsLoginDropdownOpen(false);
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                          >
                            {t('expandedNav.becomeMember') || 'Become a Member'}
                          </Link>
                          <Link
                            href="/auth/register?role=mentor"
                            className="flex items-center px-4 py-3 text-white hover:bg-white/10 transition-colors"
                            style={{
                              fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                              fontSize: '16px'
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsLoginDropdownOpen(false);
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                          >
                            {t('expandedNav.becomeMentor') || 'Join as a Mentor'}
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Join Us Dropdown */}
                <div className="flex items-center flex-shrink-0 relative" ref={joinUsDropdownRef}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsJoinUsDropdownOpen(!isJoinUsDropdownOpen);
                      // Close other dropdowns
                      setShowExpandedNav(false);
                      setActiveExpandedSection(null);
                      setIsLanguageOpen(false);
                      setIsLoginDropdownOpen(false);
                    }}
                    onMouseEnter={(e) => {
                      e.stopPropagation();
                      // Opacity effect
                      e.currentTarget.style.opacity = '0.8';
                      // Clear any pending close timeout
                      if (joinUsDropdownTimeoutRef.current) {
                        clearTimeout(joinUsDropdownTimeoutRef.current);
                        joinUsDropdownTimeoutRef.current = null;
                      }
                      setIsJoinUsDropdownOpen(true);
                      // Close other dropdowns
                      setShowExpandedNav(false);
                      setActiveExpandedSection(null);
                      setIsLanguageOpen(false);
                      setIsLoginDropdownOpen(false);
                    }}
                    onMouseLeave={(e) => {
                      // Opacity effect
                      e.currentTarget.style.opacity = '1';
                      // Don't close immediately - wait to see if mouse moves to dropdown
                      const relatedTarget = e.relatedTarget;
                      if (relatedTarget && relatedTarget instanceof Node) {
                        if (joinUsDropdownRef.current?.contains(relatedTarget)) {
                          return; // Don't close
                        }
                      }
                      // Clear any existing timeout
                      if (joinUsDropdownTimeoutRef.current) {
                        clearTimeout(joinUsDropdownTimeoutRef.current);
                      }
                      // Delay closing to allow moving to dropdown
                      joinUsDropdownTimeoutRef.current = setTimeout(() => {
                        setIsJoinUsDropdownOpen(false);
                        joinUsDropdownTimeoutRef.current = null;
                      }, 200);
                    }}
                    className="px-2 lg:px-2.5 xl:px-3 py-1.5 lg:py-2 text-sm transition-colors duration-200 flex items-center flex-shrink-0 text-[#653A96] relative"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontWeight: 500,
                      fontSize: 'clamp(11px, 1vw, 14px)',
                      lineHeight: '1.3',
                      letterSpacing: '0.02em',
                      whiteSpace: 'nowrap',
                      transition: 'opacity 0.15s ease-out, transform 0.15s ease-out',
                      willChange: 'opacity',
                      textTransform: 'none'
                    }}
                    title="Join Us"
                  >
                    <span>JOIN US</span>
                    {/* Yellow underline indicator */}
                    {isJoinUsDropdownOpen && (
                      <div 
                        className="hidden lg:block absolute h-[3px] bg-[#FECB07]"
                        style={{ 
                          bottom: '0px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: 'calc(100% + 8px)',
                          minWidth: '60px',
                          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                          willChange: 'transform, opacity'
                        }}
                      />
                    )}
                  </button>
                  
                  {/* Join Us Dropdown Menu */}
                  {isJoinUsDropdownOpen && (
                    <div
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-6 rounded-2xl shadow-2xl py-2 min-w-[200px] z-50"
                      style={{
                        background: 'linear-gradient(180deg, #653A96 57.21%, #4E1E85 100%)',
                        transition: 'opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        willChange: 'opacity, transform'
                      }}
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                      onMouseEnter={() => {
                        // Clear any pending close timeout
                        if (joinUsDropdownTimeoutRef.current) {
                          clearTimeout(joinUsDropdownTimeoutRef.current);
                          joinUsDropdownTimeoutRef.current = null;
                        }
                        setIsJoinUsDropdownOpen(true);
                      }}
                      onMouseLeave={(e) => {
                        // Don't close immediately - wait to see if mouse moves back to button
                        const relatedTarget = e.relatedTarget;
                        if (relatedTarget && relatedTarget instanceof Node) {
                          if (joinUsDropdownRef.current?.contains(relatedTarget)) {
                            return; // Don't close
                          }
                        }
                        // Delay closing
                        if (joinUsDropdownTimeoutRef.current) {
                          clearTimeout(joinUsDropdownTimeoutRef.current);
                        }
                        joinUsDropdownTimeoutRef.current = setTimeout(() => {
                          setIsJoinUsDropdownOpen(false);
                          joinUsDropdownTimeoutRef.current = null;
                        }, 200);
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => handleOpenContactModal('Join as a Volunteer')}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="w-full flex items-center px-4 py-3 text-white hover:bg-white/10 transition-colors text-left"
                        style={{
                          fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                          fontSize: '16px'
                        }}
                      >
                        Join as a Volunteer
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenContactModal('Join as an Intern')}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="w-full flex items-center px-4 py-3 text-white hover:bg-white/10 transition-colors text-left"
                        style={{
                          fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                          fontSize: '16px'
                        }}
                      >
                        Join as an Intern
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenContactModal('Join as a Partner')}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="w-full flex items-center px-4 py-3 text-white hover:bg-white/10 transition-colors text-left"
                        style={{
                          fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                          fontSize: '16px'
                        }}
                      >
                        Join as a Partner
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenContactModal('Work with Us')}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="w-full flex items-center px-4 py-3 text-white hover:bg-white/10 transition-colors text-left"
                        style={{
                          fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                          fontSize: '16px'
                        }}
                      >
                        Work with Us
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Mobile/Tablet Menu - Vertical List Layout with Collapsible Sections */}
        {isMenuOpen && (
          <div 
            className="lg:hidden shadow-2xl fixed top-0 left-0 right-0 z-50 overflow-y-auto max-h-screen" 
            style={{ 
              background: 'linear-gradient(180deg, #653A96 57.21%, #4E1E85 100%)',
              animation: 'slideDown 0.25s ease-out' 
            }}
          >
            <style jsx>{`
              @keyframes slideDown {
                from {
                  opacity: 0;
                  transform: translateY(-10px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}</style>
            {/* Mobile Menu Header */}
            <div className="sticky top-0 bg-white/10 backdrop-blur-sm border-b border-white/20 z-10">
              <div className="flex items-center justify-between px-4 py-3">
                {/* Close Button - Left */}
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white focus:outline-none p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {/* <Image src="/assets/hero-img/Frame 7909.png" alt="Close" width={24} height={24} /> */}
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                {/* Logo - Center */}
                <div className="absolute left-1/2 transform -translate-x-1/2">
                <Link href="/" className="flex items-center">
                  <div className="relative flex items-center">
                    <Image
                      src="/assets/footer-new.png"
                      alt="ABWCI Logo"
                      width={180}
                      height={108}
                      quality={100}
                      className="w-28 h-16 sm:w-32 sm:h-20 object-contain"
                      priority
                      style={{
                        imageRendering: 'crisp-edges',
                        WebkitImageRendering: 'crisp-edges',
                      }}
                    />
                  </div>
                </Link>
                </div>

                {/* Language Button - Right (Globe Icon) */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsLanguageOpen(!isLanguageOpen);
                    }}
                    className="flex items-center text-white focus:outline-none p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <svg width="22" height="22" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.66602 9.99996C1.66602 14.6025 5.39685 18.3333 9.99935 18.3333C14.6018 18.3333 18.3327 14.6025 18.3327 9.99996C18.3327 5.39746 14.6018 1.66663 9.99935 1.66663C5.39685 1.66663 1.66602 5.39746 1.66602 9.99996Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10.8331 1.70825C10.8331 1.70825 13.3331 4.99992 13.3331 9.99992C13.3331 14.9999 10.8331 18.2916 10.8331 18.2916M9.1664 18.2916C9.1664 18.2916 6.66641 14.9999 6.66641 9.99992C6.66641 4.99992 9.1664 1.70825 9.1664 1.70825M2.19141 12.9166H17.8081M2.19141 7.08325H17.8081" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  
                  {/* Language Dropdown - Mobile Menu */}
                  {isLanguageOpen && (
                    <div
                      ref={languageDropdownRef}
                      className="fixed bg-white rounded-lg shadow-lg border border-gray-200 z-[100]"
                      style={{ 
                        width: 'min(280px, calc(100vw - 2rem))',
                        maxWidth: 'calc(100vw - 2rem)',
                        top: '68px',
                        right: '1rem',
                        left: 'auto',
                        maxHeight: 'calc(100vh - 100px)',
                        transition: 'opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        willChange: 'opacity, transform'
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
                        <input
                          type="text"
                          value={languageSearch}
                          onChange={(e) => setLanguageSearch(e.target.value)}
                          placeholder="Search language"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#653a96] focus:border-transparent text-gray-800 placeholder-gray-400"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="py-2 max-h-64 overflow-y-auto">
                        {filteredLanguages.length === 0 && (
                          <div className="px-4 py-2 text-sm text-gray-500">No results</div>
                        )}
                        {filteredLanguages.map((language) => (
                          <button
                            type="button"
                            key={language.code}
                            onClick={() => handleLanguageChange(language.code)}
                            className={`w-full px-4 py-2 text-left transition-colors duration-200 flex items-center ${
                              currentLanguage === language.code ? 'bg-[#653a96] text-white' : 'text-gray-700'
                            }`}
                            style={{
                              fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                              fontWeight: currentLanguage === language.code ? 600 : 400,
                              fontSize: '14px',
                              lineHeight: '17px'
                            }}
                          >
                            <span className="mr-3" style={{ width: '28px', height: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <img
                                src={`https://flagcdn.com/w40/${languageToCountryCode[language.code] || 'us'}.png`}
                                alt={`${language.name} flag`}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'inline-block';
                                }}
                                style={{ width: '28px', height: '20px', objectFit: 'cover', borderRadius: '2px' }}
                              />
                              <span style={{ fontSize: '20px', lineHeight: '1', display: 'none' }} role="img" aria-label={`${language.name} flag`}>{language.flag}</span>
                            </span>
                            <span>{language.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation Menu Content */}
            <div className="pb-4">
              {/* About Us Section - Expanded by default */}
              <CollapsibleSection title={t('navbar.aboutUs')} sectionKey="aboutUs">
                <MenuItem href="/about" onClick={() => setIsMenuOpen(false)}>
                  {t('expandedNav.aboutUs')}
                </MenuItem>
                <MenuItem href="/about/success-stories" onClick={() => setIsMenuOpen(false)}>
                  {t('expandedNav.successStories')}
                </MenuItem>
                <MenuItem href="/about/partnerships" onClick={() => setIsMenuOpen(false)}>
                  {t('expandedNav.partnerships')}
                </MenuItem>
                <MenuItem href="/about/global-secretariat"     onClick={() => setIsMenuOpen(false)}>
                  {t('expandedNav.globalSecretariat')}
                </MenuItem>
              </CollapsibleSection>

              {/* Opportunities Section - Collapsible */}
              <CollapsibleSection title={t('navbar.opportunities')} sectionKey="opportunities">
                <MenuItem href="/opportunities/mentorship" onClick={() => setIsMenuOpen(false)}>
                  {t('expandedNav.mentorship')}
                </MenuItem>
                <MenuItem href="/opportunities/ai-platform" onClick={() => setIsMenuOpen(false)}>
                  {t('expandedNav.aiPlatform')}
                </MenuItem>
                {/* <MenuItem href="/opportunities/tenders" onClick={() => setIsMenuOpen(false)}>
                  {t('expandedNav.tenders')}
                </MenuItem> */}
              </CollapsibleSection>

              {/* Our Impact Section - Collapsible */}
              <CollapsibleSection title={t('navbar.ourImpact')} sectionKey="ourImpact">
                <MenuItem href="/impact" onClick={() => setIsMenuOpen(false)}>
                  Our Impact
                </MenuItem>
                <MenuItem href="/impact/project" onClick={() => setIsMenuOpen(false)}>
                  Projects
                </MenuItem>
                <MenuItem href="/impact/activity-report" onClick={() => setIsMenuOpen(false)}>
                  Activity Report
                </MenuItem>
                <MenuItem href="/impact/roundups" onClick={() => setIsMenuOpen(false)}>
                  Roundups
                </MenuItem>
              </CollapsibleSection>

              {/* Leadership Section - Collapsible */}
              <CollapsibleSection title={t('navbar.leadership')} sectionKey="leadership">
                <MenuItem href="/leadership/category/global-ambassadors" onClick={() => setIsMenuOpen(false)}>
                  {t('expandedNav.globalAmbassadors')}
                </MenuItem>
                <MenuItem href="/leadership/category/regional-presidents" onClick={() => setIsMenuOpen(false)}>
                  {t('expandedNav.regionalPresidents')}
                </MenuItem>
                <MenuItem href="/leadership/category/state-presidents" onClick={() => setIsMenuOpen(false)}>
                  {t('expandedNav.statePresidents')}
                </MenuItem>
                <MenuItem href="/leadership/category/global-secretariat" onClick={() => setIsMenuOpen(false)}>
                  {t('expandedNav.globalSecretariat')}
                </MenuItem>
              </CollapsibleSection>

              {/* Global Presence - Direct Link */}
              <div className="border-b border-white/10">
                <Link 
                  href="/global-presence" 
                  className={`block py-3.5 px-5 text-sm font-semibold uppercase tracking-wide transition-colors duration-200 ${router.pathname.startsWith('/global-presence') ? 'text-[#FECB07] bg-[#FECB07]/20' : 'text-white hover:bg-white/10'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {router.pathname.startsWith('/global-presence') && <span className="mr-2">•</span>}
                  {t('navbar.global')}
                </Link>
              </div>

              {/* Knowledge Hub Section - Collapsible */}
              <CollapsibleSection title={t('navbar.knowledgeHub')} sectionKey="knowledgeHub">
                <MenuItem href="/knowledge" onClick={() => setIsMenuOpen(false)}>
                  Knowledge hub
                </MenuItem>
                <MenuItem href="/knowledge/blog" onClick={() => setIsMenuOpen(false)}>
                  {t('expandedNav.blogs')}
                </MenuItem>
                <MenuItem href="/knowledge/resources" onClick={() => setIsMenuOpen(false)}>
                  {t('expandedNav.resources')}
                </MenuItem>
              </CollapsibleSection>

              {/* Support Section - Direct Link */}
              <div className="border-b border-white/10">
                <Link 
                  href="/support" 
                  className={`block py-3.5 px-5 text-sm font-semibold uppercase tracking-wide transition-colors duration-200 ${router.pathname.startsWith('/support') ? 'text-[#FECB07] bg-[#FECB07]/20' : 'text-white hover:bg-white/10'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {router.pathname.startsWith('/support') && <span className="mr-2">•</span>}
                  {t('expandedNav.support')}
                </Link>
              </div>

               {/* Members Section - Collapsible */}
               <CollapsibleSection title={t('navbar.loginRegister')} sectionKey="members">
                <MenuItem href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                  {t('expandedNav.memberLogin')}
                </MenuItem>
                <MenuItem href="/auth/register" onClick={() => setIsMenuOpen(false)}>
                  {t('expandedNav.becomeMember')}
                </MenuItem>
                <MenuItem href="/opportunities/mentorship" onClick={() => setIsMenuOpen(false)}>
                  {t('expandedNav.becomeMentor')}
                </MenuItem>
              </CollapsibleSection>
            </div>
          </div>
        )}
      </div>
      
      {/* Desktop Expanded Panel - per-section content */}
      {!isLanguageOpen && showExpandedNav && activeExpandedSection && (() => {
        // Calculate panel position to align with nav items block (from ABOUT US to SUPPORT)
        const config = expandedPanelConfig[activeExpandedSection];
        const useSimpleDropdown = config && !config.useFullPanel;
        
        let panelStyle = {
          top: '116px',
          left: 'clamp(100px, 10vw, 160px)',
          right: 'clamp(100px, 10vw, 160px)',
          width: 'auto',
          maxWidth: '1000px',
        };
        
        if (typeof window !== 'undefined' && navItemsRef?.current) {
          const rect = navItemsRef.current.getBoundingClientRect();
          const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
          
          if (useSimpleDropdown) {
            // For simple dropdown, center align with the active nav item
            const activeItemRef = navItemRefs.current[activeExpandedSection];
            if (activeItemRef) {
              const itemRect = activeItemRef.getBoundingClientRect();
              // Center the dropdown under the nav item text
              // Calculate center of nav item
              const itemCenter = itemRect.left + (itemRect.width / 2);
              panelStyle = {
                top: '116px',
                left: `${itemCenter}px`,
                right: 'auto',
                width: 'auto',
                maxWidth: 'none',
                transform: 'translateX(-50%)', // Center the dropdown
              };
            } else {
              // Fallback if ref not available
              panelStyle = {
                top: '116px',
                left: `${rect.left}px`,
                right: 'auto',
                width: 'auto',
                maxWidth: 'none',
              };
            }
          } else {
            // For full panel, extend width
            // Special handling for support dropdown - make it wider
            const isSupport = activeExpandedSection === 'support';
            const left = Math.max(rect.left - 20, 0);
            const right = Math.max(viewportWidth - rect.right - 20, 0);
            panelStyle = {
              top: '116px',
              left: `${left}px`,
              right: `${right}px`,
              width: 'auto',
              maxWidth: isSupport ? '1400px' : `${rect.width + 40}px`,
              minWidth: isSupport ? '1200px' : 'auto',
            };
          }
        }
        
        // Combine transforms properly with smoother animation
        const baseTransform = panelStyle.transform || '';
        // More pronounced slide-down effect for smoother feel
        const visibilityTransform = showExpandedNav ? 'translateY(0)' : 'translateY(-15px)';
        const finalTransform = baseTransform 
          ? `${baseTransform} ${visibilityTransform}`.trim()
          : visibilityTransform;

        return (
          <div
            key={activeExpandedSection} // Force remount when section changes
            ref={expandedPanelRef}
            className="hidden lg:block absolute z-40"
            style={{
              ...panelStyle,
              opacity: showExpandedNav ? 1 : 0,
              transform: finalTransform,
              pointerEvents: showExpandedNav ? 'auto' : 'none',
              // Smoother transitions: ease-out for opening, ease-in for closing
              transition: showExpandedNav 
                ? 'opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                : 'opacity 0.2s cubic-bezier(0.4, 0, 1, 1), transform 0.2s cubic-bezier(0.4, 0, 1, 1)',
              willChange: 'opacity, transform',
            }}
            onMouseEnter={handleMouseEnterPanel}
            onMouseLeave={handleMouseLeavePanel}
            onClick={(e) => e.stopPropagation()}
          >
          {(() => {
            // Always get fresh config based on current activeExpandedSection
            // Double-check that we have a valid section and config
            if (!activeExpandedSection || !showExpandedNav) return null;
            
            const config = expandedPanelConfig[activeExpandedSection];
            if (!config) return null;

            // Simple dropdown for knowledge, leadership, support, ourImpact
            if (!config.useFullPanel) {
              return (
                <div 
                  className="rounded-2xl shadow-2xl py-4 px-2 min-w-[180px]"
                  style={{ 
                    background: 'linear-gradient(180deg, #653A96 57.21%, #4E1E85 100%)',
                    transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: 'translateZ(0)' // Force GPU acceleration
                  }}
                >
                  <div className="flex flex-col">
                    {(config.items || []).map((link, index) => (
                      <Link
                        key={`${activeExpandedSection}-${link.href}-${index}`}
                        href={link.href}
                        className="flex items-center px-4 py-3 rounded-md hover:bg-white/10 text-white"
                        style={{ 
                          fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                          fontSize: '16px',
                          transition: 'background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                          transform: 'translateZ(0)' // Force GPU acceleration
                        }}
                        onClick={() => setShowExpandedNav(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }

            // Full panel with image for about, opportunities
            // Special map view for global/network
            // Special events view for knowledge hub
            // Special mentorship view for opportunities
            if (config.useEventsView) {
              return (
                <div className="mx-auto" style={{ maxWidth: '100%', overflow: 'hidden' }}>
                  <div
                    className="shadow-2xl flex gap-6 px-6 py-6"
                    style={{ 
                      background: 'linear-gradient(180deg, #653A96 57.21%, #4E1E85 100%)',
                      minHeight: '380px',
                      borderRadius: '24px',
                      transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      transform: 'translateZ(0)', // Force GPU acceleration
                      maxWidth: '100%',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Left column: section menu */}
                    <div className="flex flex-col w-48 border-r border-white pr-4 pt-6 pl-4 flex-shrink-0">
                      {(config.items || []).map((link, index) => (
                        <Link
                          key={`${activeExpandedSection}-${link.href}-${index}`}
                          href={link.href}
                          className="flex items-center px-2 py-2.5 rounded-md hover:bg-white/10 text-white"
                          style={{
                            fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                            fontSize: '16px',
                            fontWeight: 400,
                            lineHeight: '1.4',
                            transition: 'background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: 'translateZ(0)' // Force GPU acceleration
                          }}
                          onClick={() => setShowExpandedNav(false)}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>

                    {/* Right column: Upcoming Events */}
                    <div className="flex-1 flex flex-col gap-4" style={{ minWidth: 0, overflow: 'hidden' }}>
                      <h2 
                        style={{ 
                          fontFamily: 'Helvetica Neue medium, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                          fontWeight: 400,
                          fontSize: '22px',
                          lineHeight: '28px',
                          letterSpacing: '-0.02em',
                          color: '#FFFFFF',
                          marginBottom: '10px',
                          marginTop: '10px',
                          marginLeft: '20px'
                        }}
                      >
                        Upcoming Webinars
                      </h2>
                      <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', width: '100%', maxWidth: '100%' }}>
                        {eventsLoading ? (
                          <div style={{ width: '100%', textAlign: 'center', padding: '40px', color: '#FFFFFF' }}>
                            <p style={{ fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', color: '#FFFFFF' }}>Loading events...</p>
                          </div>
                        ) : events.length > 0 ? events.map((event, index) => (
                          <div 
                            key={event.id || index}
                            onClick={() => {
                              if (event.registration_link) {
                                window.open(event.registration_link, '_blank');
                              }
                            }}
                            style={{ 
                              display: 'flex', 
                              flexDirection: 'column', 
                              gap: '23px', 
                              flex: '1', 
                              minWidth: '0',
                              cursor: event.registration_link ? 'pointer' : 'default'
                            }}
                            className={event.registration_link ? 'hover:opacity-90 transition-opacity' : ''}
                          >
                            <div 
                              style={{
                                width: '100%',
                                height: '120px',
                                borderRadius: '20px',
                                backgroundColor: '#D9D9D9',
                                overflow: 'hidden',
                                position: 'relative'
                              }}
                              className="mt-3"
                            >
                              {event.image_url ? (
                                <img
                                  src={event.image_url}
                                  alt={event.title || 'Event'}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    objectPosition: 'center',
                                    display: 'block'
                                  }}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div 
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  display: event.image_url ? 'none' : 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#999',
                                  fontSize: '14px',
                                  backgroundColor: '#D9D9D9'
                                }}
                              >
                                No Image
                              </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px', width: '100%' }}>
                              <span 
                                style={{ 
                                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                                  fontWeight: 500,
                                  fontSize: '16px',
                                  lineHeight: '20px',
                                  letterSpacing: '-0.02em',
                                  color: '#FFFFFF'
                                }}
                              >
                                {formatEventDate(event.event_date)}
                              </span>
                              <span 
                                style={{ 
                                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                                  fontWeight: 500,
                                  fontSize: '18px',
                                  lineHeight: '22px',
                                  letterSpacing: '-0.02em',
                                  color: '#FFFFFF'
                                }}
                              >
                                |
                              </span>
                              <span 
                                style={{ 
                                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                                  fontWeight: 500,
                                  fontSize: '16px',
                                  lineHeight: '20px',
                                  letterSpacing: '-0.02em',
                                  color: '#FFFFFF',
                                  flex: 1
                                }}
                              >
                                {event.title || 'Event'}
                              </span>
                            </div>
                          </div>
                        )) : (
                          <>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '23px', flex: '1', minWidth: '0' }}>
                              <div style={{ width: '100%', height: '120px', borderRadius: '20px', backgroundColor: '#D9D9D9' }} />
                              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px', width: '100%' }}>
                                <span style={{ fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 500, fontSize: '16px', lineHeight: '20px', letterSpacing: '-0.02em', color: '#FFFFFF' }}>03 Dec</span>
                                <span style={{ fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 500, fontSize: '18px', lineHeight: '22px', letterSpacing: '-0.02em', color: '#FFFFFF' }}>|</span>
                                <span style={{ fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 500, fontSize: '16px', lineHeight: '20px', letterSpacing: '-0.02em', color: '#FFFFFF', flex: 1 }}>Ease of Doing Business</span>
                              </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '23px', flex: '1', minWidth: '0' }}>
                              <div style={{ width: '100%', height: '120px', borderRadius: '20px', backgroundColor: '#D9D9D9' }} />
                              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px', width: '100%' }}>
                                <span style={{ fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 500, fontSize: '16px', lineHeight: '20px', letterSpacing: '-0.02em', color: '#FFFFFF' }}>03 Dec</span>
                                <span style={{ fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 500, fontSize: '18px', lineHeight: '22px', letterSpacing: '-0.02em', color: '#FFFFFF' }}>|</span>
                                <span style={{ fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 500, fontSize: '16px', lineHeight: '20px', letterSpacing: '-0.02em', color: '#FFFFFF', flex: 1 }}>Ease of Doing Business</span>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            if (config.useMentorshipView) {
              // Leadership should use 15px font size, Opportunities uses 17px
              const isLeadership = activeExpandedSection === 'leadership';
              return (
                <div className="mx-auto">
                  <div
                    className="shadow-2xl flex gap-6 px-6 py-6"
                    style={{ 
                      background: 'linear-gradient(180deg, #653A96 57.21%, #4E1E85 100%)',
                      borderRadius: '24px',
                      minHeight: '380px',
                      transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      transform: 'translateZ(0)' // Force GPU acceleration
                    }}
                  >
                    {/* Left column: section menu */}
                    <div className="flex flex-col w-48 border-r border-white pr-4 pt-6 pl-4">
                      {(config.items || []).map((link, index) => (
                        <Link
                          key={`${activeExpandedSection}-${link.href}-${index}`}
                          href={link.href}
                          className="flex items-center px-2 py-2.5 rounded-md hover:bg-white/10 text-white"
                          style={{
                            fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                            fontSize: '16px',
                            fontWeight: 400,
                            lineHeight: '1.4',
                            transition: 'background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: 'translateZ(0)' // Force GPU acceleration
                          }}
                          onClick={() => setShowExpandedNav(false)}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>

                    {/* Right column: image + text + buttons */}
                    <div className="flex-1 flex flex-col gap-4">
                      <div className="w-full h-72 overflow-hidden bg-gray-200 rounded-xl">
                        {config.imageSrc && (
                          <Image
                            src={config.imageSrc}
                            alt="Mentorship"
                            width={800}
                            height={400}
                            className="w-full h-full object-cover rounded-xl"
                            // Use same framing for Opportunities and Leadership dropdown images
                            style={{ objectPosition: '50% 40%' }}
                            priority
                            loading="eager"
                          />
                        )}
                      </div>
                      <div className="flex flex-col gap-3">
                        <h3
                          className="text-white text-2xl font-serif"
                          style={{
                            fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                            fontWeight: 600,
                            lineHeight: '1.2'
                          }}
                        >
                          {config.customTitle || 'Get Mentored by Industry Experts'}
                        </h3>
                        <p
                          className="text-[#FECB07] text-base"
                          style={{
                            fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                            fontWeight: 400
                          }}
                        >
                          {config.description || 'Your Go-To Business Help. Available 24x7'}
                        </p>
                        {activeExpandedSection === 'opportunities' ? (
                          <div className="flex gap-3 mt-2">
                            <Link
                              href="/auth/register?skipStep1=true"
                              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-sm font-medium bg-[#FECB07] text-[#171717] hover:bg-yellow-300 transition-colors"
                              style={{
                                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                                fontWeight: 500
                              }}
                              onClick={() => setShowExpandedNav(false)}
                            >
                              {t('opportunities.getMentor') || 'Get a Mentor'}
                            </Link>
                            <Link
                              href="/auth/register?role=mentor"
                              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-sm font-medium text-white hover:bg-white/10 transition-colors"
                              style={{
                                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                                fontWeight: 500
                              }}
                              onClick={() => setShowExpandedNav(false)}
                            >
                              {t('opportunities.becomeMentor') || 'Join as a Mentor'}
                            </Link>
                          </div>
                        ) : (
                          <Link
                            href={config.href}
                            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-sm font-medium bg-[#FECB07] text-[#171717] hover:bg-yellow-300 transition-colors w-fit"
                            style={{
                              fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                              fontWeight: 500
                            }}
                            onClick={() => setShowExpandedNav(false)}
                          >
                            {t('common.seeMore') || 'See more'}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            if (config.useSupportView) {
              // FAQ sections for category buttons
              const faqSections = [
                { title: 'About ABWCI', index: 0 },
                { title: 'Membership & Registration', index: 1 }
              ];

              return (
                <div className="mx-auto" style={{ width: '100%', maxWidth: '1400px' }}>
                  <div
                    className="shadow-2xl flex gap-6 px-6 py-6"
                    style={{ 
                      background: 'linear-gradient(180deg, #653A96 57.21%, #4E1E85 100%)',
                      borderRadius: '24px',
                      minHeight: '340px',
                      width: '100%',
                      minWidth: '1200px',
                      transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      transform: 'translateZ(0)' // Force GPU acceleration
                    }}
                  >
                    {/* Left column: section menu */}
                    <div className="flex flex-col w-48 border-r border-white pr-4 pt-6 pl-4 flex-shrink-0">
                      {(config.items || []).map((link, index) => (
                        <Link
                          key={`${activeExpandedSection}-${link.href}-${index}`}
                          href={link.href}
                          className="flex items-center px-2 py-2.5 rounded-md hover:bg-white/10 text-white"
                          style={{
                            fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                            fontSize: '16px',
                            fontWeight: 400,
                            lineHeight: '1.4',
                            transition: 'background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: 'translateZ(0)' // Force GPU acceleration
                          }}
                          onClick={() => setShowExpandedNav(false)}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>

                    {/* Right column: heading, image, and buttons */}
                    <div className="flex-1 flex flex-col relative" style={{ minWidth: 0 }}>
                      {/* Heading */}
                      <h2
                        style={{
                          fontFamily: 'Helvetica Neue medium, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                          fontWeight: 400,
                          fontSize: '22px',
                          lineHeight: '28px',
                          letterSpacing: '-0.02em',
                          color: '#FFFFFF',
                          marginBottom: '10px',
                          marginTop: '10px',
                          marginLeft: '20px'
                        }}
                      >
                        Reach Out to Us
                      </h2>

                      {/* Image with overlay content */}
                      <div className="w-full h-48 overflow-hidden mt-5 bg-gray-200 rounded-3xl relative">
                        {config.imageSrc && (
                          <Image
                            src={config.imageSrc}
                            alt="Support"
                            fill
                            className="object-cover rounded-3xl"
                            style={{ objectPosition: '0% 70%' }}
                            priority
                            loading="eager"
                          />
                        )}
                        {/* Overlay gradient */}
                        <div className="absolute inset-0" style={{
                          background: 'linear-gradient(0deg, rgba(101, 58, 150, 0.2), rgba(101, 58, 150, 0.2))'
                        }}></div>
                        
                        {/* Content overlay - buttons and search on top of image */}
                        <div className="absolute inset-0 flex flex-row p-6">
                          {/* Left side: Categories and Search */}
                          <div className="flex flex-col justify-center items-start gap-2 mt-5" style={{ paddingLeft: '20px' }}>
                            {/* Category buttons - wider to match search box */}
                            <div className="flex gap-2" style={{ width: '360px' }}>
                              {faqSections.map((section) => (
                                <button
                                  key={section.index}
                                  onClick={() => {
                                    setSupportActiveCategory(supportActiveCategory === section.index ? null : section.index);
                                    router.push('/support');
                                    setShowExpandedNav(false);
                                  }}
                                  className={`flex justify-center items-center px-3 py-1.5 rounded-[10px] whitespace-nowrap border flex-1 ${
                                    supportActiveCategory === section.index 
                                      ? 'bg-white text-[#653a96] border-white' 
                                      : 'text-white border-white bg-transparent'
                                  }`}
                                  style={{
                                    fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                                    fontWeight: 400,
                                    fontSize: '16px',
                                    lineHeight: '19px',
                                    color: supportActiveCategory === section.index ? undefined : '#FFFFFF'
                                  }}
                                >
                                  {section.title}
                                </button>
                              ))}
                            </div>

                            {/* Search box */}
                            <div className="flex items-center" style={{ marginTop: '4px' }}>
                              <div 
                                className="flex items-center px-6 py-3 bg-white border border-[#616161] rounded-[30px] shadow-lg"
                                style={{
                                  width: '360px',
                                  height: '52px',
                                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                                }}
                              >
                                <svg className="w-5 h-5 text-[#616161] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                  type="text"
                                  placeholder={t('support.searchPlaceholder') || 'Search your query'}
                                  value={supportSearchQuery}
                                  onChange={(e) => setSupportSearchQuery(e.target.value)}
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter' && supportSearchQuery.trim()) {
                                      router.push(`/support?q=${encodeURIComponent(supportSearchQuery)}`);
                                      setShowExpandedNav(false);
                                    }
                                  }}
                                  className="flex-1 bg-transparent text-[#616161] placeholder-[#616161] focus:outline-none"
                                  style={{
                                    fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                                    fontWeight: 400,
                                    fontSize: '16px',
                                    lineHeight: '19px'
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Right side: Contact icons */}
                          <div className="flex flex-row justify-center items-center gap-6" style={{ width: '320px', flexShrink: 0, marginLeft: 'auto' }}>
                            {/* WhatsApp */}
                            <Link 
                              href="https://wa.me/9810485280" 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="flex flex-col justify-center items-center"
                              style={{
                                width: '100px',
                                textDecoration: 'none'
                              }}
                              onClick={() => setShowExpandedNav(false)}
                            >
                              <div className="flex items-center justify-center mb-2">
                              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M25.5 4.36509C24.1248 2.97598 22.4868 1.87459 20.6815 1.12517C18.8761 0.375741 16.9397 -0.00672017 14.985 8.93544e-05C6.795 8.93544e-05 0.12 6.67509 0.12 14.8651C0.12 17.4901 0.81 20.0401 2.1 22.2901L0 30.0001L7.875 27.9301C10.05 29.1151 12.495 29.7451 14.985 29.7451C23.175 29.7451 29.85 23.0701 29.85 14.8801C29.85 10.9051 28.305 7.17009 25.5 4.36509ZM14.985 27.2251C12.765 27.2251 10.59 26.6251 8.685 25.5001L8.235 25.2301L3.555 26.4601L4.8 21.9001L4.5 21.4351C3.26662 19.4655 2.61171 17.189 2.61 14.8651C2.61 8.05509 8.16 2.50509 14.97 2.50509C18.27 2.50509 21.375 3.79509 23.7 6.13509C24.8512 7.28103 25.7635 8.64408 26.3841 10.1452C27.0046 11.6464 27.321 13.2558 27.315 14.8801C27.345 21.6901 21.795 27.2251 14.985 27.2251ZM21.765 17.9851C21.39 17.8051 19.56 16.9051 19.23 16.7701C18.885 16.6501 18.645 16.5901 18.39 16.9501C18.135 17.3251 17.43 18.1651 17.22 18.4051C17.01 18.6601 16.785 18.6901 16.41 18.4951C16.035 18.3151 14.835 17.9101 13.425 16.6501C12.315 15.6601 11.58 14.4451 11.355 14.0701C11.145 13.6951 11.325 13.5001 11.52 13.3051C11.685 13.1401 11.895 12.8701 12.075 12.6601C12.255 12.4501 12.33 12.2851 12.45 12.0451C12.57 11.7901 12.51 11.5801 12.42 11.4001C12.33 11.2201 11.58 9.39009 11.28 8.64009C10.98 7.92009 10.665 8.01009 10.44 7.99509H9.72C9.465 7.99509 9.075 8.08509 8.73 8.46009C8.4 8.83509 7.44 9.73509 7.44 11.5651C7.44 13.3951 8.775 15.1651 8.955 15.4051C9.135 15.6601 11.58 19.4101 15.3 21.0151C16.185 21.4051 16.875 21.6301 17.415 21.7951C18.3 22.0801 19.11 22.0351 19.755 21.9451C20.475 21.8401 21.96 21.0451 22.26 20.1751C22.575 19.3051 22.575 18.5701 22.47 18.4051C22.365 18.2401 22.14 18.1651 21.765 17.9851Z" fill="white"/>
</svg>

                              </div>
                              <span className="text-white text-center" style={{
                                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                                fontWeight: 400,
                                fontSize: '14px',
                                lineHeight: '17px',
                                letterSpacing: '-0.02em',
                                color: '#FFFFFF'
                              }}>
                                {t('support.whatsappUs') || 'Whatsapp Us'}
                              </span>
                            </Link>
                            
                            {/* Call */}
                            <button 
                              onClick={handleCopyPhoneNumber}
                              className="flex flex-col justify-center items-center cursor-pointer bg-transparent border-none"
                              style={{
                                width: '100px',
                                textDecoration: 'none'
                              }}
                            >
                              <div className="flex items-center justify-center mb-2">
                              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M25.425 27C22.3 27 19.2125 26.319 16.1625 24.957C13.1125 23.595 10.3375 21.6635 7.8375 19.1625C5.3375 16.6615 3.4065 13.8865 2.0445 10.8375C0.6825 7.7885 0.001 4.701 0 1.575C0 1.125 0.15 0.75 0.45 0.45C0.75 0.15 1.125 0 1.575 0H7.65C8 0 8.3125 0.119 8.5875 0.357C8.8625 0.595 9.025 0.876 9.075 1.2L10.05 6.45C10.1 6.85 10.0875 7.1875 10.0125 7.4625C9.9375 7.7375 9.8 7.975 9.6 8.175L5.9625 11.85C6.4625 12.775 7.056 13.6685 7.743 14.5305C8.43 15.3925 9.1865 16.224 10.0125 17.025C10.7875 17.8 11.6 18.519 12.45 19.182C13.3 19.845 14.2 20.451 15.15 21L18.675 17.475C18.9 17.25 19.194 17.0815 19.557 16.9695C19.92 16.8575 20.276 16.826 20.625 16.875L25.8 17.925C26.15 18.025 26.4375 18.2065 26.6625 18.4695C26.8875 18.7325 27 19.026 27 19.35V25.425C27 25.875 26.85 26.25 26.55 26.55C26.25 26.85 25.875 27 25.425 27Z" fill="white"/>
</svg>

                              </div>
                              <span className="text-white text-center" style={{
                                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                                fontWeight: 400,
                                fontSize: '14px',
                                lineHeight: '17px',
                                letterSpacing: '-0.02em',
                                color: '#FFFFFF'
                              }}>
                                {t('support.callUs') || 'Call Us'}
                              </span>
                            </button>
                            
                            {/* Mail */}
                            <Link 
                              href="mailto:info@abwci.org" 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="flex flex-col justify-center items-center"
                              style={{
                                width: '100px',
                                textDecoration: 'none'
                              }}
                              onClick={() => setShowExpandedNav(false)}
                            >
                              <div className="flex items-center justify-center mb-2">
                              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3 24C2.175 24 1.469 23.7065 0.882 23.1195C0.295 22.5325 0.001 21.826 0 21V3C0 2.175 0.294 1.469 0.882 0.882C1.47 0.295 2.176 0.001 3 0H27C27.825 0 28.5315 0.294 29.1195 0.882C29.7075 1.47 30.001 2.176 30 3V21C30 21.825 29.7065 22.5315 29.1195 23.1195C28.5325 23.7075 27.826 24.001 27 24H3ZM15 13.5L27 6V3L15 10.5L3 3V6L15 13.5Z" fill="white"/>
</svg>

                              </div>
                              <span className="text-white text-center" style={{
                                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                                fontWeight: 400,
                                fontSize: '14px',
                                lineHeight: '17px',
                                letterSpacing: '-0.02em',
                                color: '#FFFFFF'
                              }}>
                                {t('support.mailUs') || 'Mail Us'}
                              </span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
            
            if (config.useMapView) {
              // Map region names to indices
              const regionMap = {
                'africa': 0,
                'asia': 1,
                'europe': 2,
                'north-america': 3,
                'south-america': 4
              };
              
              return (
                <div className="mx-auto">
                  <div
                    className="shadow-2xl flex gap-6 px-6 py-6"
                    style={{ 
                      background: 'linear-gradient(180deg, #653A96 57.21%, #4E1E85 100%)',
                      borderRadius: '24px',
                      minHeight: '380px',
                      transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      transform: 'translateZ(0)' // Force GPU acceleration
                    }}
                  >
                    {/* Left column: section menu - Interactive */}
                    <div className="flex flex-col w-48 border-r border-white pr-4 pt-6 pl-4">
                      {(config.items || []).map((link, index) => {
                        // Extract region from href
                        const regionMatch = link.href.match(/region=([^&]+)/);
                        const regionIndex = regionMatch ? regionMap[regionMatch[1]] : null;
                        
                        return (
                          <Link
                            key={`${activeExpandedSection}-${link.href}-${index}`}
                            href={link.href}
                            className="flex items-center px-2 py-2.5 rounded-md hover:bg-white/10 text-white"
                            style={{
                              fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                              fontSize: '16px',
                              fontWeight: 400,
                              lineHeight: '1.4',
                              transition: 'background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              transform: 'translateZ(0)' // Force GPU acceleration
                            }}
                            onMouseEnter={() => {
                              if (regionIndex !== null) {
                                setHoveredRegion(regionIndex);
                              }
                            }}
                            onMouseLeave={() => setHoveredRegion(null)}
                            onClick={() => setShowExpandedNav(false)}
                          >
                            {link.label}
                          </Link>
                        );
                      })}
                    </div>

                    {/* Right column: Interactive Map */}
                    <div className="flex-1 flex flex-col">
                      {/* Dynamic World Map */}
                      <div className="relative w-full h-full">
                        {hoveredRegion !== null ? (
                          <Image
                            src={[
                              "/full-map/mapss/africa.png",
                              "/full-map/mapss/asia.png",
                              "/full-map/mapss/europ.png",
                              "/full-map/mapss/north-america.png",
                              "/full-map/mapss/south-america.png",
                            ][hoveredRegion]}
                            alt="Continent Map"
                            fill
                            className="object-contain transition-opacity duration-300"
                          />
                        ) : (
                          <Image
                            src="/full-map/Mapchart.svg"
                            alt="World Map"
                            fill
                            className="object-contain"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            // Full panel with image for about, opportunities
            // Leadership should keep 15px font size, others use 17px
            const isLeadership = activeExpandedSection === 'leadership';
            return (
              <div className="mx-auto">
                <div
                  className="shadow-2xl flex gap-6 px-6 py-6"
                  style={{ 
                    background: 'linear-gradient(180deg, #653A96 57.21%, #4E1E85 100%)',
                    borderRadius: '24px',
                    minHeight: '380px',
                    transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: 'translateZ(0)' // Force GPU acceleration
                  }}
                >
                  {/* Left column: section menu */}
                  <div className="flex flex-col w-48 border-r border-white pr-4 pt-6 pl-4">
                    {(config.items || []).map((link, index) => (
                      <Link
                        key={`${activeExpandedSection}-${link.href}-${index}`}
                        href={link.href}
                        className="flex items-center px-2 py-2.5 rounded-md hover:bg-white/10 text-white"
                        style={{
                          fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                          fontSize: '16px',
                          fontWeight: 400,
                          lineHeight: '1.4',
                          transition: 'background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                          transform: 'translateZ(0)' // Force GPU acceleration
                        }}
                        onClick={() => setShowExpandedNav(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>

                  {/* Right column: image + text + CTA */}
                  <div className="flex-1 flex flex-col gap-3">
                    <div className="w-full h-56 overflow-hidden bg-gray-200 rounded-xl">
                      {config.imageSrc && (
                        <Image
                          src={config.imageSrc}
                          alt={config.title}
                          width={800}
                          height={400}
                          className="w-full h-full object-cover rounded-xl"
                          priority
                          loading="eager"
                        />
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      {/* Custom title for Our Impact section */}
                      {config.customTitle && (
                        <h3
                          className="text-white font-medium"
                          style={{
                            fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                            fontSize: '20px',
                            fontWeight: 500,
                            lineHeight: '1.3'
                          }}
                        >
                          {config.customTitle}
                        </h3>
                      )}
                      {/* Custom subtitle for Our Impact section */}
                      {config.customSubtitle && (
                        <p
                          className="text-[#FECB07]"
                          style={{
                            fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                            fontSize: '18px',
                            fontWeight: 500,
                            lineHeight: '1.4'
                          }}
                        >
                          {config.customSubtitle}
                        </p>
                      )}
                      <p
                        className="text-white leading-relaxed"
                        style={{
                          fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                          fontSize: '15px',
                          fontWeight: 400,
                          lineHeight: '1.5'
                        }}
                      >
                        {config.description && config.description.includes('Global Chamber for Women Entrepreneurs') ? (
                          <>
                            A <span style={{ fontWeight: 700, color: '#FECB07' }}>Global Chamber for Women Entrepreneurs</span>
                            {config.description.split('Global Chamber for Women Entrepreneurs')[1]}
                          </>
                        ) : (
                          config.description
                        )}
                      </p>
                      <Link
                        href={config.href}
                        className="flex inline-flex items-start justify-start px-6 mt-2 py-2.5 w-fit rounded-full text-sm font-medium bg-[#FECB07] text-[#171717] hover:bg-yellow-300 transition-colors"
                            style={{
                              fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                              fontWeight: 500
                            }}
                        onClick={() => setShowExpandedNav(false)}
                      >
                        {t('common.seeMore') || 'See more'}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
          </div>
        );
      })()}

      {/* Contact Us Modal */}
      {showContactModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowContactModal(false);
              setContactFormResult(null);
            }
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2
                style={{
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontWeight: 400,
                  fontSize: '26px',
                  lineHeight: '29px',
                  color: '#653A96'
                }}
              >
                Contact Us
              </h2>
              <button
                type="button"
                onClick={() => {
                  setShowContactModal(false);
                  setContactFormResult(null);
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                style={{ padding: '4px' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6">
              {contactFormSubject && (
                <div className="mb-4 p-3 bg-[#653A96]/10 rounded-lg">
                  <p
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontWeight: 500,
                      fontSize: '16px',
                      lineHeight: '20px',
                      color: '#653A96'
                    }}
                  >
                    Subject: {contactFormSubject}
                  </p>
                </div>
              )}

              <form onSubmit={handleContactFormSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-2"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontSize: '14px'
                    }}
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={contactFormData.fullName}
                    onChange={(e) => setContactFormData({ ...contactFormData, fullName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#653a96] focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontSize: '14px'
                    }}
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-2"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontSize: '14px'
                    }}
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    value={contactFormData.email}
                    onChange={(e) => setContactFormData({ ...contactFormData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#653a96] focus:border-transparent"
                    placeholder="Enter your email address"
                    required
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontSize: '14px'
                    }}
                  />
                </div>

                {/* Country */}
                <div className="country-dropdown-container">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-2"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontSize: '14px'
                    }}
                  >
                    Country
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsCountryOpen(!isCountryOpen)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left flex items-center justify-between bg-white"
                      style={{
                        fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                        fontSize: '14px'
                      }}
                    >
                      <span className="flex items-center gap-2">
                        {contactFormData.country ? (
                          <>
                            <img
                              src={`https://flagcdn.com/w20/${contactFormData.country.code.toLowerCase()}.png`}
                              alt={`${contactFormData.country.name} flag`}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                if (e.target.nextSibling) {
                                  e.target.nextSibling.style.display = 'inline-block';
                                }
                              }}
                              style={{ width: '20px', height: '14px', objectFit: 'cover', borderRadius: '2px' }}
                            />
                            <span style={{ fontSize: '16px', lineHeight: '1', display: 'none' }} role="img" aria-label={`${contactFormData.country.name} flag`}>{contactFormData.country.flag}</span>
                            <span>{contactFormData.country.name}</span>
                          </>
                        ) : (
                          'Select Country'
                        )}
                      </span>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 9l6 6 6-6" stroke="#2B2D30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    {isCountryOpen && (
                      <div className="absolute z-20 mt-2 w-full max-h-56 overflow-auto bg-white border border-gray-200 rounded-xl shadow-md">
                        {countries.map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => {
                              setContactFormData({ ...contactFormData, country: c });
                              setIsCountryOpen(false);
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2"
                            style={{
                              fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                              fontSize: '14px',
                              lineHeight: '18px',
                              color: '#2B2D30'
                            }}
                          >
                            <span style={{ width: '20px', height: '14px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <img
                                src={`https://flagcdn.com/w20/${c.code.toLowerCase()}.png`}
                                alt={`${c.name} flag`}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  if (e.target.nextSibling) {
                                    e.target.nextSibling.style.display = 'inline-block';
                                  }
                                }}
                                style={{ width: '20px', height: '14px', objectFit: 'cover', borderRadius: '2px' }}
                              />
                              <span style={{ fontSize: '16px', lineHeight: '1', display: 'none' }} role="img" aria-label={`${c.name} flag`}>{c.flag}</span>
                            </span>
                            <span>{c.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-2"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontSize: '14px'
                    }}
                  >
                    Message *
                  </label>
                  <textarea
                    value={contactFormData.message}
                    onChange={(e) => setContactFormData({ ...contactFormData, message: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#653a96] focus:border-transparent resize-none"
                    placeholder="Tell us more about your inquiry..."
                    required
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontSize: '14px'
                    }}
                  />
                </div>

                {/* Result Message */}
                {contactFormResult && (
                  <div
                    className={`p-4 rounded-lg ${
                      contactFormResult.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    <p
                      className={contactFormResult.type === 'success' ? 'text-green-800' : 'text-red-800'}
                      style={{
                        fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                        fontSize: '14px'
                      }}
                    >
                      {contactFormResult.message}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowContactModal(false);
                      setContactFormResult(null);
                    }}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontSize: '16px'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={contactFormSubmitting}
                    className="flex-1 px-6 py-3 bg-[#653A96] text-white rounded-lg font-medium hover:bg-[#4f287b] transition-colors disabled:opacity-60"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontSize: '16px'
                    }}
                  >
                    {contactFormSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Copied to Clipboard Toast */}
      {showCopiedToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[10000] px-4" role="status" aria-live="polite">
          <div
            className="flex items-center gap-3 w-[360px] max-w-[90vw] shadow-lg rounded-md border px-4 py-3 bg-green-50 border-green-200"
            style={{ fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif' }}
          >
            <div className="text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.172 7.707 8.879a1 1 0 10-1.414 1.414L9 13l4.707-4.707z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1 text-sm text-black/80">
              Phone number copied to clipboard: {phoneNumber}
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={() => setShowCopiedToast(false)}
              className="ml-2 p-1 rounded hover:bg-black/5 text-green-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavbarAlt;

