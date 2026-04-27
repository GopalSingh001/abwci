import Layout from '../components/Layout';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { usePostsByPage } from '../lib/usePosts';
import { useLanguage } from '../lib/LanguageContext';
import { regions } from '../data/global-presence-data';

export default function Home() {
  const { t } = useLanguage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('announcements');
  const [isScrolling, setIsScrolling] = useState(true);
  const [activeFaq, setActiveFaq] = useState(null); // deprecated: kept for compatibility
  const [activeFaqSection, setActiveFaqSection] = useState(null); // No section open by default
  const [activeFaqQuestion, setActiveFaqQuestion] = useState(null); // Format: "sectionIndex-questionIndex"
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(0); // Default to Africa (index 0)
  const [hoveredLocation, setHoveredLocation] = useState(null); // Track hovered location on continent images
  const [activeHero, setActiveHero] = useState(0); // Track which hero section is active
  const [activeKeyFeature, setActiveKeyFeature] = useState(null); // Track which key feature card is active (click-based)
  const [currentKeyUpdateImage, setCurrentKeyUpdateImage] = useState(0); // Track which key update image is currently shown
  const [isVideoPlaying, setIsVideoPlaying] = useState(false); // Track video play/pause state
  const [isVideoMuted, setIsVideoMuted] = useState(true); // Track video mute state
  const [isAutoRotationPaused, setIsAutoRotationPaused] = useState(false); // Track if auto-rotation is paused
  const videoRefDesktop = useRef(null); // Ref for desktop video element
  const videoRefMobile = useRef(null); // Ref for mobile video element
  const [dynamicKeyUpdates, setDynamicKeyUpdates] = useState([]); // Dynamic key updates from API
  const [keyUpdatesLoading, setKeyUpdatesLoading] = useState(true); // Loading state for key updates
  const [dynamicAnnouncements, setDynamicAnnouncements] = useState([]); // Dynamic announcements from API
  const [dynamicEvents, setDynamicEvents] = useState([]); // Dynamic events from API
  const [dynamicActions, setDynamicActions] = useState([]); // Dynamic actions from API
  const [contentLoading, setContentLoading] = useState(true); // Loading state for content
  const [dynamicBanners, setDynamicBanners] = useState([]); // Dynamic banners from API
  const [bannersLoading, setBannersLoading] = useState(true); // Loading state for banners
  const [bannerImagesLoaded, setBannerImagesLoaded] = useState(false); // Start with loader, hide after cache check
  const [dynamicKeyFeatures, setDynamicKeyFeatures] = useState([]); // Dynamic key features from API
  const [keyFeaturesLoading, setKeyFeaturesLoading] = useState(true); // Loading state for key features
  const scrollRefDesktop = useRef(null);
  const scrollRefMobile = useRef(null);
  const successStoriesScrollRefDesktop = useRef(null);
  const successStoriesScrollRefMobile = useRef(null);
  const partnershipsScrollRefDesktop = useRef(null);
  const partnershipsScrollRefMobile = useRef(null);
  const partnershipsSyncedRef = useRef(false);
  const [isSuccessStoriesHovered, setIsSuccessStoriesHovered] = useState(false);
  const [isSuccessStoriesTouched, setIsSuccessStoriesTouched] = useState(false);
  const [isPartnershipsHovered, setIsPartnershipsHovered] = useState(false);
  const [isPartnershipsExpanded, setIsPartnershipsExpanded] = useState(false); // Track if partnerships section is expanded
  const [isHeroHovered, setIsHeroHovered] = useState(false); // Track hero section hover state

  // Key update images array (fallback)
  const keyUpdateImages = [
    '/assets/key-update/WhatsApp Image 2025-10-06 at 10.40.02.jpeg',
    '/assets/key-update/WhatsApp Image 2025-10-06 at 10.40.02 (1).jpeg',
    '/assets/key-update/WhatsApp Image 2025-10-06 at 10.40.03.jpeg',
    '/assets/key-update/WhatsApp Image 2025-10-06 at 10.40.03 (1).jpeg',
    '/assets/key-update/WhatsApp Image 2025-10-06 at 10.40.03 (2).jpeg',
    '/assets/key-update/WhatsApp Image 2025-10-06 at 10.40.03 (3).jpeg',
    '/assets/key-update/WhatsApp Image 2025-10-06 at 10.40.32.jpeg',
    // '/assets/key-update/Rectangle 21.png'
  ];

  // Banner images array (fallback) - ordered by position
  const fallbackBannerImages = [
    '/assets/Rectangle 140.png',
    '/assets/hero-img/Rectangle 140.png',
    '/assets/hero-img/Rectangle 140 (1).png',
    '/assets/hero-img/Rectangle 140 (2).png',
    '/assets/hero-img/Rectangle 140 (1).png' // Hero 5 - same as Hero 3 for now
  ];

  // Fetch dynamic key updates
  const fetchKeyUpdates = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/key-updates`);
      if (response.ok) {
        const data = await response.json();
        setDynamicKeyUpdates(data.data || []);
      } else {
        setDynamicKeyUpdates([]);
      }
    } catch (error) {
      setDynamicKeyUpdates([]);
    } finally {
      setKeyUpdatesLoading(false);
    }
  };

  // Fetch dynamic announcements
  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/announcements`);
      if (response.ok) {
        const data = await response.json();
        setDynamicAnnouncements(data.data || []);
      } else {
        setDynamicAnnouncements([]);
      }
    } catch (error) {
      setDynamicAnnouncements([]);
    }
  };

  // Fetch dynamic events
  const fetchEvents = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`);
      if (response.ok) {
        const data = await response.json();
        setDynamicEvents(data.data || []);
      } else {
        setDynamicEvents([]);
      }
    } catch (error) {
      setDynamicEvents([]);
    }
  };

  // Fetch dynamic actions
  const fetchActions = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/actions`);
      if (response.ok) {
        const data = await response.json();
        setDynamicActions(data.data || []);
      } else {
        setDynamicActions([]);
      }
    } catch (error) {
      setDynamicActions([]);
    }
  };

  // Fetch dynamic banners
  const fetchBanners = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/banners`);
      if (response.ok) {
        const data = await response.json();
        // Sort by banner_position to ensure correct order
        const sortedBanners = (data.data || []).sort((a, b) => a.banner_position - b.banner_position);
        setDynamicBanners(sortedBanners);
        // Preload all banner images
        preloadBannerImages(sortedBanners);
      } else {
        setDynamicBanners([]);
        // Preload fallback images
        preloadBannerImages([]);
      }
    } catch (error) {
      setDynamicBanners([]);
      // Preload fallback images
      preloadBannerImages([]);
    } finally {
      setBannersLoading(false);
    }
  };

  // Preload all banner images before showing hero sections
  const preloadBannerImages = async (banners) => {
    const imagesToLoad = [];

    // Get all banner image URLs (active banners or fallbacks)
    for (let position = 1; position <= 5; position++) {
      let imageUrl;
      if (banners.length > 0) {
        const banner = banners.find(b => b.banner_position === position && b.is_active);
        imageUrl = banner?.image_url || fallbackBannerImages[position - 1] || fallbackBannerImages[0];
      } else {
        imageUrl = fallbackBannerImages[position - 1] || fallbackBannerImages[0];
      }
      imagesToLoad.push(imageUrl);
    }

    // Quick cache check - if all images are cached, hide loader immediately
    if (typeof window !== 'undefined') {
      // First, do a synchronous check for already-loaded images
      let allCachedSync = true;
      for (const url of imagesToLoad) {
        const img = new window.Image();
        img.src = url;
        // If image is already in cache, it will be complete immediately
        if (!img.complete || img.naturalWidth === 0) {
          allCachedSync = false;
          break;
        }
      }

      // If synchronous check passed, hide loader immediately
      if (allCachedSync) {
        requestAnimationFrame(() => {
          setBannerImagesLoaded(true);
        });
        return;
      }

      // Otherwise, do async check with very short timeout
      const quickCheckPromises = imagesToLoad.map((url) => {
        return new Promise((resolve) => {
          const img = new window.Image();
          let resolved = false;

          img.onload = () => {
            if (!resolved) {
              resolved = true;
              resolve(true);
            }
          };

          img.onerror = () => {
            if (!resolved) {
              resolved = true;
              resolve(false);
            }
          };

          // Very short timeout - cached images load instantly
          setTimeout(() => {
            if (!resolved) {
              resolved = true;
              resolve(img.complete && img.naturalWidth > 0);
            }
          }, 20); // 20ms - cached images should be detected almost instantly

          img.src = url;
        });
      });

      const cacheResults = await Promise.all(quickCheckPromises);
      const allCached = cacheResults.every(result => result === true);

      // If all images are cached, hide loader immediately
      if (allCached) {
        requestAnimationFrame(() => {
          setBannerImagesLoaded(true);
        });
        return; // Exit early, images are already loaded
      }
    }

    // Images need to be loaded from network - show loader
    // Preload all images with timeout
    const loadPromises = typeof window === 'undefined'
      ? []
      : imagesToLoad.map((url) => {
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
            resolve(url); // Resolve anyway to not block the page
          };
          img.src = url;
        });
      });

    try {
      // Add overall timeout of 3 seconds - show page even if images are still loading
      const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => {
          resolve('timeout');
        }, 3000); // 3 second maximum wait
      });

      await Promise.race([
        Promise.all(loadPromises),
        timeoutPromise
      ]);
      setBannerImagesLoaded(true);
    } catch (error) {
      console.error('Error preloading images:', error);
      // Still show the page even if some images fail
      setBannerImagesLoaded(true);
    }
  };

  // Fetch dynamic key features
  const fetchKeyFeatures = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/key-features`);
      if (response.ok) {
        const data = await response.json();
        setDynamicKeyFeatures(data.data || []);
      } else {
        setDynamicKeyFeatures([]);
      }
    } catch (error) {
      setDynamicKeyFeatures([]);
    } finally {
      setKeyFeaturesLoading(false);
    }
  };

  // Fetch all content
  const fetchAllContent = async () => {
    setContentLoading(true);
    await Promise.all([
      fetchKeyUpdates(),
      fetchAnnouncements(),
      fetchEvents(),
      fetchActions(),
      fetchBanners(),
      fetchKeyFeatures()
    ]);
    setContentLoading(false);
  };

  // Navigation functions
  const goToNextImage = () => {
    const totalImages = dynamicKeyUpdates.length > 0 ? dynamicKeyUpdates.length : keyUpdateImages.length;
    setCurrentKeyUpdateImage((prev) => (prev + 1) % totalImages);
  };

  const goToPreviousImage = () => {
    const totalImages = dynamicKeyUpdates.length > 0 ? dynamicKeyUpdates.length : keyUpdateImages.length;
    setCurrentKeyUpdateImage((prev) => (prev - 1 + totalImages) % totalImages);
  };

  // Success Stories scroll functions
  const scrollSuccessStoriesLeft = (isMobile = false) => {
    const scrollContainer = isMobile ? successStoriesScrollRefMobile.current : successStoriesScrollRefDesktop.current;
    if (scrollContainer) {
      const scrollAmount = isMobile ? 280 : 400; // Width of card + margin
      scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollSuccessStoriesRight = (isMobile = false) => {
    const scrollContainer = isMobile ? successStoriesScrollRefMobile.current : successStoriesScrollRefDesktop.current;
    if (scrollContainer) {
      const scrollAmount = isMobile ? 280 : 400; // Width of card + margin
      scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Video control functions
  const toggleVideoPlay = () => {
    const videoRef = videoRefDesktop.current || videoRefMobile.current;
    if (videoRef) {
      if (isVideoPlaying) {
        videoRef.pause();
      } else {
        videoRef.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
      setIsAutoRotationPaused(!isAutoRotationPaused); // Pause/resume auto-rotation
    }
  };

  const toggleVideoMute = () => {
    const videoRef = videoRefDesktop.current || videoRefMobile.current;
    if (videoRef) {
      videoRef.muted = !isVideoMuted;
      setIsVideoMuted(!isVideoMuted);
    }
  };

  // Fetch all success stories (no limit)
  const { posts: rawSuccessStories, loading: storiesLoading } = usePostsByPage('stories', 1000);

  // Sort stories by priority (priority 1 comes first, then 2, 3, etc. NULL/0 priorities go last)
  const successStories = [...rawSuccessStories].sort((a, b) => {
    // Handle priority: null, undefined, or 0 should be treated as lowest priority (999)
    const priorityA = (a.post_priority && a.post_priority > 0) ? a.post_priority : 999;
    const priorityB = (b.post_priority && b.post_priority > 0) ? b.post_priority : 999;

    if (priorityA !== priorityB) {
      return priorityA - priorityB; // ASC order: 1, 2, 3... (999 goes last)
    }

    // If priorities are equal (or both are null/0), sort by updated_at or created_at (newest first)
    const dateA = new Date(a.updated_at || a.created_at || 0);
    const dateB = new Date(b.updated_at || b.created_at || 0);
    return dateB - dateA; // DESC order: newest first
  });

  // Sync CSS animation transform with scroll position when hovering (desktop only)
  useEffect(() => {
    if (!isSuccessStoriesHovered) return;

    const scrollContainer = successStoriesScrollRefDesktop.current;
    if (!scrollContainer) return;

    const flexContainer = scrollContainer.querySelector('.flex');
    if (!flexContainer) return;

    // Get current transform position
    const computedStyle = window.getComputedStyle(flexContainer);
    const transform = computedStyle.transform;

    if (transform && transform !== 'none') {
      const matrix = new DOMMatrix(transform);
      const currentTransformX = Math.abs(matrix.m41);

      // Remove animation and sync scroll position
      flexContainer.classList.remove('animate-scroll-slow');
      flexContainer.style.transform = 'none';
      flexContainer.style.animation = 'none';

      // Set scroll to match transform position
      scrollContainer.scrollLeft = currentTransformX;
    }
  }, [isSuccessStoriesHovered]);

  // Sync partnerships animation transform with scroll position when hovering
  useEffect(() => {
    if (!isPartnershipsHovered) {
      // Reset sync flag when not hovering
      partnershipsSyncedRef.current = false;
      return;
    }

    // Only sync once per hover event
    if (partnershipsSyncedRef.current) return;

    const scrollContainer = partnershipsScrollRefDesktop.current || partnershipsScrollRefMobile.current;
    if (!scrollContainer) return;

    const flexContainer = scrollContainer.querySelector('.flex');
    if (!flexContainer) return;

    // Get current transform position from the custom animation
    const computedStyle = window.getComputedStyle(flexContainer);
    const transform = computedStyle.transform;

    if (transform && transform !== 'none') {
      const matrix = new DOMMatrix(transform);
      const currentTransformX = Math.abs(matrix.m41);

      // Only sync if we have a valid transform value and haven't synced yet
      if (currentTransformX > 0 || transform.includes('translateX')) {
        // Remove animation and sync scroll position
        flexContainer.style.animation = 'none';
        flexContainer.style.transform = 'none';

        // Calculate scroll position: if transform is at x%, we need to scroll to that position
        // The animation moves -100%/3, so we need to convert that to actual scroll position
        const totalWidth = flexContainer.scrollWidth;
        const visibleWidth = scrollContainer.clientWidth;
        const scrollableWidth = totalWidth - visibleWidth;

        // If transform shows we're at position X in animation cycle, map to scroll position
        // Since animation goes from 0 to -33.33%, we need to map that to 0 to scrollableWidth
        let scrollPos = 0;
        if (currentTransformX > 0) {
          // Convert transform percentage to scroll position
          const animationProgress = currentTransformX / (totalWidth / 3);
          scrollPos = animationProgress * scrollableWidth;
        }

        // Set scroll to match transform position
        scrollContainer.scrollLeft = scrollPos;
        partnershipsSyncedRef.current = true;
      }
    }
  }, [isPartnershipsHovered]);

  // Fetch partnerships with images only - increased limit to get all partnerships
  const { posts: rawPartnerships, loading: partnershipsLoading } = usePostsByPage('partners', 1000);

  // Filter partnerships to only include those with valid images - relaxed check
  const partnerships = rawPartnerships.filter(partnership => {
    if (!partnership) return false;
    const thumbnail = partnership.post_thumbnail_url?.trim();
    const banner = partnership.post_banner_url?.trim();
    return (thumbnail && thumbnail.length > 0) || (banner && banner.length > 0);
  });

  // Add custom animation for partnerships that scrolls through all logos
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'partnership-scroll-animation';
    // Animation moves -33.333% (1/3) since we duplicate 3 times
    style.textContent = `
      @keyframes partnership-scroll {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(calc(-100% / 3));
        }
      }
      @keyframes partnership-scroll-reverse {
        0% {
          transform: translateX(calc(-100% / 3));
        }
        100% {
          transform: translateX(0);
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      const existingStyle = document.getElementById('partnership-scroll-animation');
      if (existingStyle && existingStyle.parentNode) {
        existingStyle.parentNode.removeChild(existingStyle);
      }
    };
  }, []);


  // Get dynamic data for different tabs
  const getTabData = () => {
    const today = new Date();
    const todayString = `${today.getDate()} ${today.toLocaleString('default', { month: 'short' })} ${today.getFullYear()}`;

    switch (activeTab) {
      case 'announcements':
        return dynamicAnnouncements.map(announcement => {
          // Extract date part only (YYYY-MM-DD) to avoid timezone conversion issues
          const dateStr = announcement.announcement_date || announcement.created_at;
          const dateOnly = dateStr ? dateStr.split('T')[0] : null;
          const dateObj = dateOnly ? new Date(dateOnly + 'T00:00:00') : new Date();

          return {
            id: announcement.id,
            title: announcement.title,
            date: dateObj.toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            }),
            type: 'announcement',
            link: announcement.link
          };
        });
      case 'actions':
        return dynamicActions.map(action => ({
          id: action.id,
          title: action.title,
          date: action.due_date ? new Date(action.due_date).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          }) : todayString,
          type: 'action',
          link: action.link,
          action_type: action.action_type
        }));
      case 'events':
        return dynamicEvents.map(event => ({
          id: event.id,
          title: event.title,
          date: new Date(event.event_date).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          }),
          type: 'event',
          link: event.registration_link,
          location: event.location,
          event_type: event.event_type,
          image_url: event.image_url
        }));
      default:
        return [];
    }
  };

  const currentData = getTabData();

  // Helper function to map location name to region ID
  const getRegionIdFromLocation = (locationName) => {
    const locationToRegion = {
      // Africa
      'Nigeria': 'africa', 'South Africa': 'africa', 'Kenya': 'africa', 'Tanzania': 'africa', 'Egypt': 'africa',
      // Asia
      'India': 'asia', 'China': 'asia', 'Japan': 'asia', 'Singapore': 'asia', 'Thailand': 'asia', 'Malaysia': 'asia', 'Indonesia': 'asia',
      // Europe
      'United Kingdom': 'europe', 'Germany': 'europe', 'France': 'europe', 'Italy': 'europe', 'Spain': 'europe', 'Netherlands': 'europe',
      // North America
      'United States': 'north-america', 'Canada': 'north-america', 'Panama': 'north-america', 'Mexico': 'north-america', 'Guatemala': 'north-america', 'Belize': 'north-america',
      // South America
      'Brazil': 'south-america', 'Argentina': 'south-america', 'Chile': 'south-america', 'Colombia': 'south-america', 'Peru': 'south-america',
    };
    return locationToRegion[locationName] ?? null;
  };

  // Handle location click - navigate to global presence page
  const handleLocationClick = (locationName, e) => {
    e.preventDefault();
    e.stopPropagation();
    const regionId = getRegionIdFromLocation(locationName);
    if (regionId) {
      // Navigate to global presence page with region query parameter
      router.push(`/global-presence?region=${regionId}`);
    }
  };

  // Helper function to get banner image by position
  const getBannerImage = (position) => {
    if (bannersLoading) {
      return fallbackBannerImages[position - 1] || fallbackBannerImages[0];
    }

    if (dynamicBanners.length > 0) {
      const banner = dynamicBanners.find(b => b.banner_position === position && b.is_active);
      return banner?.image_url || fallbackBannerImages[position - 1] || fallbackBannerImages[0];
    }

    return fallbackBannerImages[position - 1] || fallbackBannerImages[0];
  };

  // Helper function to get key feature image by feature key
  const getFeatureImage = (featureKey) => {
    const fallbackImages = {
      capacity: '/assets/key-feature/capacity-bg.png',
      mentorship: '/assets/key-feature/mentorship-bg.png',
      finance: '/assets/key-feature/finance-bg.png',
      visibility: '/assets/key-feature/visibility-bg.png',
      technology: '/assets/key-feature/technology-bg.png',
      crossborder: '/assets/key-feature/crossborder-bg.png'
    };

    if (keyFeaturesLoading) {
      return fallbackImages[featureKey] || fallbackImages.capacity;
    }

    if (dynamicKeyFeatures.length > 0) {
      const feature = dynamicKeyFeatures.find(f => f.feature_key === featureKey && f.is_active);
      return feature?.image_url || fallbackImages[featureKey] || fallbackImages.capacity;
    }

    return fallbackImages[featureKey] || fallbackImages.capacity;
  };

  // FAQs - Direct questions (7 total: 2 from each of 3 sections + 1 from another)
  const faqQuestions = [
    // About ABWCI (2 questions)
    {
      q: 'What is ABWCI?',
      a: (
        <div className="space-y-3">
          <p><strong>Association of Business Women in Commerce & Industry (ABWCI)</strong> is a Virtual Global Chamber of Commerce for Women Business Owners. Its membership spans prominent women entrepreneurs, organisations, educational institutions, and companies investing in women.</p>
          <p>ABWCI aims to understand the needs of the future in women entrepreneurship, be responsive to challenges, and assist business women globally to benefit from emerging opportunities.</p>
        </div>
      )
    },
    {
      q: 'What is the objective of ABWCI?',
      a: (
        <div className="space-y-2">
          <p>Build a dynamic, inclusive platform connecting women entrepreneurs globally for growth, collaboration, knowledge sharing, market access, and mentorship.</p>
        </div>
      )
    },
    // Membership & Registration (2 questions)
    {
      q: 'What are the types of memberships available?',
      a: (
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Entrepreneur / Mentee Membership</strong>: For women-led startups, MSMEs, and small business owners.</li>
          <li><strong>Ecosystem Enabler / Mentor Membership</strong>: For professionals, experts, and organizations that support women entrepreneurs.</li>
          <li><strong>Premium Membership (by invitation)</strong>: For senior professionals and ecosystem enablers offering mentorship and leadership.</li>
        </ul>
      )
    },
    {
      q: 'How can I register as a member?',
      a: (
        <ol className="list-decimal pl-5 space-y-1">
          <li>Visit <Link href="https://www.abwci.org" target="_blank">www.abwci.org</Link> and choose the membership category</li>
          <li>Complete the form and verify email/mobile with OTP</li>
          <li>Submit and receive a confirmation with a Unique ID</li>
        </ol>
      )
    },
    // Programs & Opportunities (2 questions)
    {
      q: 'What kind of support does ABWCI offer to entrepreneurs?',
      a: (
        <ul className="list-disc pl-5 space-y-1">
          <li>Access to mentoring and expert sessions</li>
          <li>Funding and loan connect opportunities</li>
          <li>Learning and digital tools</li>
          <li>Market access via exhibitions, buyer-seller meets, and e-commerce integration</li>
          <li>Policy representation for women-led businesses</li>
        </ul>
      )
    },
    {
      q: "How can I apply for funding or mentorship?",
      a: (
        <p>Log in to your member dashboard and go to the <strong>"Get Funds"</strong> or <strong>"Find Mentor"</strong> sections to be guided step-by-step through the application process.</p>
      )
    },
    // Donations & Impact (1 question)
    {
      q: "How can I donate to support women entrepreneurs through ABWCI?",
      a: <p>You can contribute directly through our official donation partner platform — <Link href="https://enablewomen.org" target="_blank">EnableWomen.org</Link>. Your donation helps fund training programs, mentorship initiatives, digital inclusion projects, and access-to-finance opportunities for women-led businesses across India.</p>
    }
  ];

  // Scroll animation effect that triggers every time
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
          // Remove visible class first, then add it back to trigger animation
          el.classList.remove('visible');
          // Use setTimeout to ensure the class removal is processed  
          setTimeout(() => {
            el.classList.add('visible');
          }, 10);
        } else {
          // Remove visible class when element is out of view
          el.classList.remove('visible');
        }
      });
    };

    // Initial check
    handleScroll();

    // Add scroll listener with throttling for better performance
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

  // Hero section rotation effect - 8 second intervals
  useEffect(() => {
    // Pause auto-rotation when hovering
    if (isHeroHovered) return;

    const interval = setInterval(() => {
      setActiveHero((prev) => (prev + 1) % 5); // Cycle through 0, 1, 2, 3, 4
    }, 8000); // 8 seconds - increased to give users more time to read

    return () => clearInterval(interval);
  }, [isHeroHovered]);

  // Hero navigation functions
  const goToNextHero = () => {
    setActiveHero((prev) => (prev + 1) % 5);
  };

  const goToPreviousHero = () => {
    setActiveHero((prev) => (prev - 1 + 5) % 5);
  };

  // Fetch all content on component mount
  useEffect(() => {
    fetchAllContent();
  }, []);

  // Fallback: If banners are loaded but images haven't been preloaded yet, preload them
  useEffect(() => {
    if (!bannersLoading && !bannerImagesLoaded) {
      // Preload images with current banners state
      preloadBannerImages(dynamicBanners);
    }
  }, [bannersLoading, bannerImagesLoaded]);

  // Key update image rotation effect - 4 second intervals
  useEffect(() => {
    if (isAutoRotationPaused || keyUpdatesLoading) return; // Don't auto-rotate if paused or loading

    const totalImages = dynamicKeyUpdates.length > 0 ? dynamicKeyUpdates.length : keyUpdateImages.length;
    if (totalImages === 0) return;

    const interval = setInterval(() => {
      setCurrentKeyUpdateImage((prev) => (prev + 1) % totalImages); // Cycle through all images
    }, 4000); // 4 seconds

    return () => clearInterval(interval);
  }, [isAutoRotationPaused, dynamicKeyUpdates.length, keyUpdatesLoading]);

  // Handle video state when key update changes
  useEffect(() => {
    const videoRef = videoRefDesktop.current || videoRefMobile.current;
    if (videoRef && dynamicKeyUpdates.length > 0) {
      const currentUpdate = dynamicKeyUpdates[currentKeyUpdateImage];
      if (currentUpdate?.media_type === 'video') {
        // Reset video state when switching to a video
        videoRef.muted = isVideoMuted;
        if (isVideoPlaying) {
          videoRef.play().catch(() => { });
        } else {
          videoRef.pause();
        }
      }
    }
  }, [currentKeyUpdateImage, dynamicKeyUpdates, isVideoPlaying, isVideoMuted]);

  // Auto scroll effect - smooth circular scrolling
  useEffect(() => {
    // Prefer the visible container (desktop if visible, else mobile)
    const candidateDesktop = scrollRefDesktop.current;
    const candidateMobile = scrollRefMobile.current;
    const isVisible = (el) => !!el && el.offsetParent !== null;
    const scrollContainer = isVisible(candidateDesktop) ? candidateDesktop : (isVisible(candidateMobile) ? candidateMobile : (candidateDesktop || candidateMobile));
    if (!scrollContainer || !isScrolling) return;

    let scrollPosition = 0;
    const scrollSpeed = 0.3; // Slower for smoother effect
    let animationId;

    const autoScroll = () => {
      if (!isScrolling) return;

      const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;

      if (scrollHeight > 0) {
        scrollPosition += scrollSpeed;

        // Smooth circular scroll - when reaching bottom, smoothly reset to top
        if (scrollPosition >= scrollHeight) {
          scrollPosition = 0;
          scrollContainer.scrollTop = 0;
        } else {
          scrollContainer.scrollTop = scrollPosition;
        }
      }

      animationId = requestAnimationFrame(autoScroll);
    };

    // Start the animation
    animationId = requestAnimationFrame(autoScroll);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [activeTab, isScrolling]);

  // Show full-page loader until all banner images are loaded
  if (!bannerImagesLoaded) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center z-[9999] bg-white"
      >
        <Image
          src="/Loader.gif"
          alt="Loading..."
          width={200}
          height={200}
          className="object-contain"
        />
      </div>
    );
  }

  return (
    <Layout>
      {/* Rotating Hero Section */}
      <div
        className="relative group"
        style={{ height: '70vh' }}
        onMouseEnter={() => setIsHeroHovered(true)}
        onMouseLeave={() => setIsHeroHovered(false)}
      >
        {/* Navigation Buttons - Desktop Only - Show on Hover */}
        <div className="hidden lg:block">
          {/* Left Navigation Button */}
          <button
            onClick={goToPreviousHero}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"
            aria-label="Previous hero section"
          >
            <svg
              className="w-10 h-10 text-white animate-bounce transition-all duration-300 hover:scale-125"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={3}
              style={{
                filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.6))',
                animation: 'bounce 2s infinite, pulse 2s infinite, fadeInOut 3s infinite'
              }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right Navigation Button */}
          <button
            onClick={goToNextHero}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"
            aria-label="Next hero section"
          >
            <svg
              className="w-10 h-10 text-white animate-bounce transition-all duration-300 hover:scale-125"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={3}
              style={{
                filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.6))',
                animation: 'bounce 2s infinite, pulse 2s infinite, fadeInOut 3s infinite'
              }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Custom Animation Styles */}
        <style jsx global>{`
          @keyframes fadeInOut {
            0%, 100% {
              opacity: 0.7;
            }
            50% {
              opacity: 1;
            }
          }
        `}</style>
        {/* Hero Section 1 */}
        <section
          className={`absolute inset-0 text-white transition-opacity duration-1000 ${activeHero === 0 ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          style={{
            background: 'linear-gradient(135deg, #4f287b 11%, #653a96 52%, #391660 100%)',
            height: '70vh'
          }}
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <Image
              src={getBannerImage(1)}
              alt="Hero Banner 1"
              fill
              className="object-cover opacity-80"
              style={{ objectPosition: '50% 40%' }}
              priority
              quality={90}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="absolute left-1/2 bottom-24 md:bottom-20 mb-2 transform -translate-x-1/2 w-full text-center px-4">
              {/* Desktop version - vertically centered heading */}
              <div className="hidden md:block">
                <h1 className="text-white text-center" style={{
                  fontFamily: 'DM Serif Display, serif',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: 'clamp(32px, 4vw, 52px)',
                  lineHeight: '1.2',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  marginBottom: '24px'
                }}
                  dangerouslySetInnerHTML={{ __html: t('homepage.associationName').replace('\n', '<br />') }}
                >
                </h1>
              </div>

              {/* Mobile version - centered */}
              <h1 className="md:hidden text-white text-center mb-3 animate-on-scroll" style={{
                fontFamily: 'DM Serif Display, serif',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: 'clamp(26px, 7vw, 36px)',
                lineHeight: '1.25',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
                dangerouslySetInnerHTML={{ __html: t('homepage.associationName').replace('\n', '<br />') }}
              >
              </h1>

              {/* Desktop version content */}
              <div className="hidden md:block">
                <p className="mb-6 mx-auto"
                  style={{
                    fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                    fontWeight: 400,
                    fontSize: 'clamp(16px, 1.5vw, 24px)',
                    lineHeight: '1.3'
                  }}
                >
                  {t('homepage.hero.empoweringText')}
                </p>

                {/* Key Points */}
                <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-6">
                  <div className="flex items-start">
                    <Image
                      src="/assets/hero-img/gis_globe-alt-o.svg"
                      alt="Global Network"
                      width={32}
                      height={32}
                      className="mr-3  mt-1"
                    />
                    <span
                      style={{
                        fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                        fontWeight: 400,
                        fontSize: 'clamp(14px, 1.2vw, 16px)',
                        lineHeight: '1.5',
                        textAlign: 'left'
                      }}
                      dangerouslySetInnerHTML={{ __html: t('homepage.hero.globalNetwork').replace('\n', '<br />') }}
                    ></span>
                  </div>
                  <div className="flex items-start">
                    <Image
                      src="/assets/hero-img/material-symbols_accessibility.svg"
                      alt="Access"
                      width={40}
                      height={40}
                      className="mr-3  mt-1"
                    />
                    <span
                      style={{
                        fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                        fontWeight: 400,
                        fontSize: 'clamp(14px, 1.2vw, 16px)',
                        lineHeight: '1.5',
                        textAlign: 'left'
                      }}
                      dangerouslySetInnerHTML={{ __html: t('homepage.hero.accessMarkets').replace('\n', '<br />') }}
                    ></span>
                  </div>
                </div>
              </div>

              {/* Mobile version content */}
              <div className="md:hidden">
                <p className="mb-3 text-center animate-on-scroll"
                  style={{
                    fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                    fontWeight: 400,
                    fontSize: 'clamp(16px, 4.5vw, 22px)',
                    lineHeight: '1.4'
                  }}
                >
                  {t('homepage.hero.empoweringText')}
                </p>

                {/* Mobile Key Points */}
                <div className="flex flex-col justify-center items-center gap-2 mb-4">
                  <div className="flex items-center text-center">
                    <Image
                      src="/assets/gis_globe-alt-o.png"
                      alt="Global Network"
                      width={24}
                      height={24}
                      className="mr-2"
                    />
                    <span
                      style={{
                        fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                        fontWeight: 400,
                        fontSize: 'clamp(15px, 4vw, 18px)',
                        lineHeight: '1.4'
                      }}
                      dangerouslySetInnerHTML={{ __html: t('homepage.hero.globalNetwork').replace('\n', '<br />') }}
                    ></span>
                  </div>
                  <div className="flex items-center text-center">
                    <Image
                      src="/assets/human.png"
                      alt="Access"
                      width={24}
                      height={24}
                      className="mr-2"
                    />
                    <span
                      style={{
                        fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                        fontWeight: 400,
                        fontSize: 'clamp(15px, 4vw, 18px)',
                        lineHeight: '1.4'
                      }}
                      dangerouslySetInnerHTML={{ __html: t('homepage.hero.accessMarkets').replace('\n', '<br />') }}
                    ></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed CTA Button Position - Desktop */}
            <div className="hidden md:block absolute bottom-14 left-1/2 transform -translate-x-1/2">
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center rounded-full hover:bg-yellow-400 transition-colors duration-200"
                style={{
                  background: '#FECB07',
                  borderRadius: '30px',
                  width: '216px',
                  height: '40px',
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '20px',
                  color: '#171717',
                  padding: '10px 30px',
                  textDecoration: 'none'
                }}
              >
                {t('homepage.hero.joinButton')}
              </Link>
            </div>

            {/* Fixed CTA Button Position - Mobile */}
            <div className="md:hidden absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center rounded-full hover:bg-yellow-400 transition-colors duration-200 shadow-md"
                style={{
                  background: '#FECB07',
                  borderRadius: '30px',
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontWeight: 600,
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  lineHeight: '1.2',
                  color: '#171717',
                  padding: '10px 28px',
                  minWidth: '160px',
                  height: '42px',
                  textDecoration: 'none'
                }}
              >
                {t('homepage.hero.joinButton')}
              </Link>
            </div>
          </div>

        </section>

        {/* Hero Section 2 */}
        <section
          className={`absolute inset-0 text-white transition-opacity duration-1000 ${activeHero === 1 ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          style={{
            background: 'linear-gradient(135deg, #4f287b 11%, #653a96 52%, #391660 100%)',
            height: '70vh'
          }}
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <Image
              src={getBannerImage(2)}
              alt="Hero Banner 2"
              fill
              className="object-cover opacity-80"
              style={{ objectPosition: '50% 40%' }}
              priority
              quality={90}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

          {/* Left Bottom Content */}
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
            <div className="absolute left-1/2 bottom-24 md:bottom-40 transform -translate-x-1/2 w-full text-center px-4">
              {/* Desktop Version */}
              <div className="hidden md:block">
                <div className="text-center mb-3">
                  <h1 className="text-white text-center text-6xl mb-0 mx-auto" style={{
                    maxWidth: '800px',
                    fontFamily: 'DM Serif Display, serif',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: 'clamp(28px, 3.5vw, 45px)',
                    lineHeight: '1.2'
                  }} dangerouslySetInnerHTML={{ __html: t('homepage.hero.title').replace('\n', '<br />') }}>
                  </h1>
                </div>

                {/* Logo and Community Text */}
                <div className="flex items-center justify-center gap-2 mb-0">
                  {/* Group 3 Logo */}
                  <div className="relative">
                    <Image
                      src="/assets/hero-img/Group 8.svg"
                      alt="ABWCI Logo"
                      width={140}
                      height={56}
                      className="object-contain"
                    />
                  </div>

                  {/* Separator */}
                  <div
                    className="text-white"
                    style={{
                      fontFamily: 'DM Serif Display, serif',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '32px',
                      lineHeight: '51px',
                      width: '9px',
                      height: '51px'
                    }}
                  >
                    |
                  </div>

                  {/* Community Text */}
                  <div
                    className="text-[#fecb07]"
                    style={{
                      fontFamily: 'DM Serif Display, serif',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: 'clamp(24px, 2.5vw, 34px)',
                      lineHeight: '1.3',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Community +
                  </div>
                </div>
              </div>

              {/* Mobile Version */}
              <div className="md:hidden text-center">
                <h1 className="text-white text-center mb-3" style={{
                  fontFamily: 'DM Serif Display, serif',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: 'clamp(26px, 7vw, 36px)',
                  lineHeight: '1.25',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }} dangerouslySetInnerHTML={{ __html: t('homepage.hero.title').replace('\n', '<br />') }}>
                </h1>

                {/* Mobile Logo and Community Text */}
                <div className="flex items-center justify-center gap-3 mb-0">
                  {/* Group 3 Logo */}
                  <img
                    src="/assets/hero-img/Group 8.svg"
                    alt="ABWCI Logo"
                    style={{ width: '140px', height: '56px', objectFit: 'contain' }}
                  />

                  {/* Separator */}
                  <div
                    className="text-white"
                    style={{
                      fontFamily: 'DM Serif Display, serif',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '28px',
                      lineHeight: '32px'
                    }}
                  >
                    |
                  </div>

                  {/* Community Text */}
                  <div
                    className="text-[#fecb07]"
                    style={{
                      fontFamily: 'DM Serif Display, serif',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: 'clamp(24px, 6vw, 32px)',
                      lineHeight: '1.3'
                    }}
                  >
                    Community +
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed CTA Button Position - Desktop */}
            <div className="hidden md:block absolute bottom-24 left-1/2 transform -translate-x-1/2">
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center rounded-full hover:bg-yellow-400 transition-colors duration-200"
                style={{
                  background: '#FECB07',
                  borderRadius: '30px',
                  width: '216px',
                  height: '40px',
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '20px',
                  color: '#171717',
                  padding: '10px 30px',
                  textDecoration: 'none'
                }}
              >
                {t('homepage.hero.joinButton')}
              </Link>
            </div>

            {/* Fixed CTA Button Position - Mobile */}
            <div className="md:hidden absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center rounded-full hover:bg-yellow-400 transition-colors duration-200 shadow-md"
                style={{
                  background: '#FECB07',
                  borderRadius: '30px',
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontWeight: 600,
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  lineHeight: '1.2',
                  color: '#171717',
                  padding: '10px 28px',
                  minWidth: '160px',
                  height: '42px',
                  textDecoration: 'none'
                }}
              >
                {t('homepage.hero.joinButton')}
              </Link>
            </div>
          </div>

        </section>

        {/* Hero Section 3 */}
        <section
          className={`absolute inset-0 text-white transition-opacity duration-1000 ${activeHero === 2 ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          style={{
            background: 'linear-gradient(135deg, #4f287b 11%, #653a96 52%, #391660 100%)',
            height: '70vh'
          }}
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <Image
              src={getBannerImage(3)}
              alt="Hero Banner 3"
              fill
              className="object-cover opacity-80"
              style={{ objectPosition: '50% 40%' }}
              priority
              quality={90}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
            <div className="absolute left-1/2 bottom-24 md:bottom-40 transform -translate-x-1/2 w-full text-center px-4">
              {/* Desktop Version */}
              <div className="hidden md:block">
                {/* Main Text */}
                <div className="text-center mb-3">
                  <h1
                    className="text-white mb-0 mx-auto"
                    style={{
                      maxWidth: '800px',
                      fontFamily: 'DM Serif Display, serif',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: 'clamp(28px, 3.5vw, 45px)',
                      lineHeight: '1.2'
                    }} dangerouslySetInnerHTML={{ __html: t('homepage.hero.mentorshipTitle').replace('\n', '<br />') }}>
                  </h1>
                </div>

                {/* Logo and Community Text */}
                <div className="flex items-center justify-center gap-2 mb-0">
                  {/* Group 3 Logo */}
                  <div className="relative">
                    <Image
                      src="/assets/hero-img/Group 8.svg"
                      alt="ABWCI Logo"
                      width={140}
                      height={56}
                      className="object-contain"
                    />
                  </div>

                  {/* Separator */}
                  <div
                    className="text-white"
                    style={{
                      fontFamily: 'DM Serif Display, serif',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '32px',
                      lineHeight: '51px',
                      width: '9px',
                      height: '51px'
                    }}
                  >
                    |
                  </div>

                  {/* Community Text */}
                  <div
                    className="text-[#fecb07]"
                    style={{
                      fontFamily: 'DM Serif Display, serif',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: 'clamp(24px, 2.5vw, 34px)',
                      lineHeight: '1.3',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Mentorship Hub
                  </div>
                </div>
              </div>

              {/* Mobile Version */}
              <div className="md:hidden text-center">
                {/* Main Text */}
                <h1
                  className="text-white mb-3"
                  style={{
                    fontFamily: 'DM Serif Display, serif',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: 'clamp(26px, 7vw, 36px)',
                    lineHeight: '1.25',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                  }} dangerouslySetInnerHTML={{ __html: t('homepage.hero.mentorshipTitle').replace('\n', '<br />') }}>
                </h1>

                {/* Mobile Logo and Community Text */}
                <div className="flex items-center justify-center gap-3 mb-0">
                  {/* Group 3 Logo */}
                  <img
                    src="/assets/hero-img/Group 8.svg"
                    alt="ABWCI Logo"
                    style={{ width: '140px', height: '56px', objectFit: 'contain' }}
                  />

                  {/* Separator */}
                  <div
                    className="text-white"
                    style={{
                      fontFamily: 'DM Serif Display, serif',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '28px',
                      lineHeight: '32px'
                    }}
                  >
                    |
                  </div>

                  {/* Community Text */}
                  <div
                    className="text-[#fecb07]"
                    style={{
                      fontFamily: 'DM Serif Display, serif',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: 'clamp(24px, 6vw, 32px)',
                      lineHeight: '1.3',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Mentorship Hub
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed CTA Button Position - Desktop */}
            <div className="hidden md:block absolute bottom-24 left-1/2 transform -translate-x-1/2">
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center rounded-full hover:bg-yellow-400 transition-colors duration-200"
                style={{
                  background: '#FECB07',
                  borderRadius: '30px',
                  width: '216px',
                  height: '40px',
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '20px',
                  color: '#171717',
                  padding: '10px 30px',
                  textDecoration: 'none'
                }}
              >
                {t('homepage.hero.joinButton')}
              </Link>
            </div>

            {/* Fixed CTA Button Position - Mobile */}
            <div className="md:hidden absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center rounded-full hover:bg-yellow-400 transition-colors duration-200 shadow-md"
                style={{
                  background: '#FECB07',
                  borderRadius: '30px',
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontWeight: 600,
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  lineHeight: '1.2',
                  color: '#171717',
                  padding: '10px 28px',
                  minWidth: '160px',
                  height: '42px',
                  textDecoration: 'none'
                }}
              >
                {t('homepage.hero.joinButton')}
              </Link>
            </div>
          </div>

        </section>
        {/* Hero Section 4 */}
        <section
          className={`absolute inset-0 text-white transition-opacity duration-1000 ${activeHero === 3 ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          style={{
            background: 'linear-gradient(135deg, #4f287b 11%, #653a96 52%, #391660 100%)',
            height: '70vh'
          }}
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <Image
              src={getBannerImage(4)}
              alt="Hero Banner 4"
              fill
              className="object-cover opacity-80"
              style={{ objectPosition: '50% 30%' }}
              priority
              quality={90}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
            <div className="absolute left-1/2 bottom-32 md:bottom-40 transform -translate-x-1/2 w-full text-center px-4">
              {/* Desktop Version */}
              <div className="hidden md:block">
                {/* Main Text */}
                <div className="text-center mb-0">
                  <h1
                    className="text-white mb-0  mx-auto"
                    style={{
                      maxWidth: '800px',
                      fontFamily: 'DM Serif Display, serif',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: 'clamp(28px, 3.5vw, 45px)',
                      lineHeight: '1.2'
                    }} dangerouslySetInnerHTML={{ __html: t('homepage.hero.fundingTitle').replace('\n', '<br />') }}>
                  </h1>
                </div>
              </div>

              {/* Mobile Version */}
              <div className="md:hidden text-center">
                {/* Main Text */}
                <h1
                  className="text-white mb-0 "
                  style={{
                    fontFamily: 'DM Serif Display, serif',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: 'clamp(24px, 6vw, 32px)',
                    lineHeight: '1.2'
                  }} dangerouslySetInnerHTML={{ __html: t('homepage.hero.fundingTitle').replace('\n', '<br />') }}>
                </h1>
              </div>
            </div>

            {/* Fixed CTA Button Position - Desktop */}
            <div className="hidden md:block absolute bottom-24 left-1/2 transform -translate-x-1/2">
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center rounded-full hover:bg-yellow-400 transition-colors duration-200"
                style={{
                  background: '#FECB07',
                  borderRadius: '30px',
                  width: '216px',
                  height: '40px',
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '20px',
                  color: '#171717',
                  padding: '10px 30px',
                  textDecoration: 'none'
                }}
              >
                {t('homepage.hero.joinButton')}
              </Link>
            </div>

            {/* Fixed CTA Button Position - Mobile */}
            <div className="md:hidden absolute bottom-16 left-1/2 transform -translate-x-1/2">
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center rounded-full hover:bg-yellow-400 transition-colors duration-200 shadow-md"
                style={{
                  background: '#FECB07',
                  borderRadius: '30px',
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontWeight: 600,
                  fontSize: 'clamp(13px, 3.2vw, 15px)',
                  lineHeight: '1.2',
                  color: '#171717',
                  padding: 'clamp(8px, 2vw, 10px) clamp(18px, 4.5vw, 24px)',
                  minWidth: 'clamp(120px, 30vw, 150px)',
                  height: 'clamp(32px, 8vw, 38px)',
                  textDecoration: 'none'
                }}
              >
                {t('homepage.hero.joinButton')}
              </Link>
            </div>
          </div>

        </section>

        {/* Hero Section 5 */}
        <section
          className={`absolute inset-0 text-white transition-opacity duration-1000 ${activeHero === 4 ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          style={{
            background: 'linear-gradient(135deg, #4f287b 11%, #653a96 52%, #391660 100%)',
            height: '70vh'
          }}
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <Image
              src={getBannerImage(5)}
              alt="Hero Banner 5"
              fill
              className="object-cover opacity-80"
              style={{ objectPosition: '50% 10%' }}
              priority
              quality={90}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
            <div className="absolute left-1/2 bottom-32 md:bottom-40 transform -translate-x-1/2 w-full text-center px-4">
              {/* Desktop Version */}
              <div className="hidden md:block">
                {/* Main Text */}
                <div className="text-center mb-6">
                  <h1
                    className="text-white mb-0  mx-auto"
                    style={{
                      maxWidth: '800px',
                      fontFamily: 'DM Serif Display, serif',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: 'clamp(28px, 3.5vw, 45px)',
                      lineHeight: '1.2'
                    }}>
                    Donate to make a difference
                    <br />with enablewomen.org
                  </h1>
                </div>

                {/* Feature Sections */}
                <div className="flex flex-row items-center justify-center gap-14 mb-6" style={{ width: 'auto', maxWidth: '600px', margin: '0 auto' }}>
                  {/* Tax Benefits Section */}
                  <div className="flex flex-row items-center gap-6" style={{ width: 'auto', height: 'auto' }}>
                    {/* Icon - Tax Benefits icon */}
                    <div className="relative" style={{ width: '40px', height: '50px', flexShrink: 0 }}>
                      <svg width="40" height="50" viewBox="0 0 27 34" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                        <path d="M0.75 17.8765H4.30619C4.4033 17.8732 4.50001 17.8904 4.59 17.9271C4.67998 17.9638 4.76121 18.019 4.82835 18.0893C4.8955 18.1595 4.94705 18.2431 4.97963 18.3347C5.01222 18.4262 5.02509 18.5236 5.01743 18.6205V32.0059C5.02534 32.1028 5.01263 32.2002 4.98012 32.2918C4.9476 32.3834 4.89604 32.467 4.82882 32.5372C4.7616 32.6074 4.68026 32.6625 4.59017 32.6989C4.50008 32.7353 4.40329 32.7522 4.30619 32.7485H0.75" stroke="#FECB07" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M10.9223 14.7386L8.18827 18.1426C8.00871 18.3664 7.78293 18.5487 7.52636 18.6771C7.2698 18.8055 6.98853 18.8769 6.70179 18.8866H5.01758M5.01758 28.8866C8.06736 31.1981 10.8497 32.75 12.6463 32.75H21.5695C22.6506 32.75 23.3305 32.6732 23.7999 31.2635C24.5169 27.6647 25.0133 24.026 25.2878 20.3674C25.2878 19.6248 24.5439 18.8809 23.0574 18.8809H14.6193M11.2523 17.0445L9.05029 1.6362C9.03461 1.52613 9.04275 1.41397 9.07415 1.30732C9.10555 1.20066 9.15949 1.10199 9.23231 1.01797C9.30514 0.933953 9.39515 0.866552 9.49627 0.820322C9.59738 0.774092 9.70725 0.750111 9.81843 0.75H20.5638" stroke="#FECB07" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M15.9261 18.8865L14.6231 5.85809C14.6125 5.75856 14.6231 5.6579 14.654 5.56271C14.685 5.46752 14.7357 5.37993 14.8028 5.30568C14.8699 5.23143 14.952 5.17219 15.0436 5.13183C15.1352 5.09147 15.2343 5.0709 15.3344 5.07146H25.1495C25.2528 5.07023 25.3552 5.09154 25.4495 5.13393C25.5438 5.17631 25.6278 5.23874 25.6955 5.31687C25.7632 5.395 25.813 5.48695 25.8416 5.58632C25.8701 5.68569 25.8766 5.79008 25.8607 5.89223L23.8977 18.979" stroke="#FECB07" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M19.9905 13.0117C19.849 13.0117 19.7133 12.9555 19.6133 12.8554C19.5132 12.7554 19.457 12.6197 19.457 12.4783C19.457 12.3368 19.5132 12.2011 19.6133 12.1011C19.7133 12.001 19.849 11.9448 19.9905 11.9448M19.9905 13.0117C20.1319 13.0117 20.2676 12.9555 20.3677 12.8554C20.4677 12.7554 20.5239 12.6197 20.5239 12.4783C20.5239 12.3368 20.4677 12.2011 20.3677 12.1011C20.2676 12.001 20.1319 11.9448 19.9905 11.9448" stroke="#FECB07" strokeWidth="1.5" />
                      </svg>
                    </div>
                    <span className="text-white" style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '20px',
                      color: '#FFFFFF',
                      display: 'block',
                      maxWidth: '220px',
                      textAlign: 'left'
                    }}
                      dangerouslySetInnerHTML={{ __html: 'Avail Tax Benefits <br /> u/s 80G with <br /> your donations' }}
                    >
                    </span>
                  </div>

                  {/* FCRA Section */}
                  <div className="flex flex-row items-center gap-6" style={{ width: 'auto', height: 'auto' }}>
                    {/* Icon - FCRA/International icon */}
                    <div className="relative" style={{ width: '48px', height: '48px', flexShrink: 0 }}>
                      <svg width="48" height="48" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                        <path d="M13.5526 32.7499H31.6789M15.6851 22.0873V32.7499M19.9501 22.0873V32.7499M25.2814 22.0873V32.7499M29.5464 22.0873V32.7499M32.7452 22.0873H12.4863L21.8338 15.9457C22.0606 15.7794 22.3345 15.6897 22.6158 15.6897C22.897 15.6897 23.1709 15.7794 23.3977 15.9457L32.7452 22.0873Z" stroke="#FECB07" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M7.84856 30.0446C5.58965 28.5322 3.75333 26.4693 2.51287 24.0504C1.27241 21.6315 0.668727 18.9364 0.758784 16.2195C0.84884 13.5026 1.62967 10.8534 3.02758 8.52195C4.4255 6.19051 6.3944 4.25369 8.74849 2.89427C11.1026 1.53484 13.7642 0.797642 16.4823 0.752233C19.2003 0.706824 21.8851 1.3547 24.2833 2.63473C26.6815 3.91476 28.714 5.78473 30.189 8.06817C31.664 10.3516 32.5329 12.9732 32.7136 15.6856" stroke="#FECB07" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9.42307 18.8787C9.2148 16.066 9.32545 13.2388 9.7529 10.451C10.1365 7.18961 11.2089 4.047 12.8991 1.23145M0.794922 15.6899H9.28943M3.22172 8.22609H30.2847M2.09007 23.1537H8.22317M20.6074 1.23145C22.455 4.35462 23.5782 7.85256 23.8943 11.4675" stroke="#FECB07" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="text-white" style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '20px',
                      color: '#FFFFFF',
                      display: 'block',
                      maxWidth: '220px',
                      textAlign: 'left'
                    }}
                      dangerouslySetInnerHTML={{ __html: 'Open to <br /> FCRA-Approved <br /> International Donations' }}
                    >
                    </span>
                  </div>
                </div>
              </div>

              {/* Mobile Version */}
              <div className="md:hidden text-center">
                {/* Main Text */}
                <h1
                  className="text-white mb-6 "
                  style={{
                    fontFamily: 'DM Serif Display, serif',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: 'clamp(24px, 6vw, 32px)',
                    lineHeight: '1.2'
                  }}>
                  Donate to make a difference with enablewomen.org
                </h1>

                {/* Mobile Feature Sections */}
                <div className="flex flex-col items-center gap-5 mb-6">
                  {/* Tax Benefits Section */}
                  <div className="flex flex-row items-center gap-4">
                    {/* Icon */}
                    <div className="relative" style={{ width: '32px', height: '40px', flexShrink: 0 }}>
                      <svg width="32" height="40" viewBox="0 0 27 34" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                        <path d="M0.75 17.8765H4.30619C4.4033 17.8732 4.50001 17.8904 4.59 17.9271C4.67998 17.9638 4.76121 18.019 4.82835 18.0893C4.8955 18.1595 4.94705 18.2431 4.97963 18.3347C5.01222 18.4262 5.02509 18.5236 5.01743 18.6205V32.0059C5.02534 32.1028 5.01263 32.2002 4.98012 32.2918C4.9476 32.3834 4.89604 32.467 4.82882 32.5372C4.7616 32.6074 4.68026 32.6625 4.59017 32.6989C4.50008 32.7353 4.40329 32.7522 4.30619 32.7485H0.75" stroke="#FECB07" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M10.9223 14.7386L8.18827 18.1426C8.00871 18.3664 7.78293 18.5487 7.52636 18.6771C7.2698 18.8055 6.98853 18.8769 6.70179 18.8866H5.01758M5.01758 28.8866C8.06736 31.1981 10.8497 32.75 12.6463 32.75H21.5695C22.6506 32.75 23.3305 32.6732 23.7999 31.2635C24.5169 27.6647 25.0133 24.026 25.2878 20.3674C25.2878 19.6248 24.5439 18.8809 23.0574 18.8809H14.6193M11.2523 17.0445L9.05029 1.6362C9.03461 1.52613 9.04275 1.41397 9.07415 1.30732C9.10555 1.20066 9.15949 1.10199 9.23231 1.01797C9.30514 0.933953 9.39515 0.866552 9.49627 0.820322C9.59738 0.774092 9.70725 0.750111 9.81843 0.75H20.5638" stroke="#FECB07" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M15.9261 18.8865L14.6231 5.85809C14.6125 5.75856 14.6231 5.6579 14.654 5.56271C14.685 5.46752 14.7357 5.37993 14.8028 5.30568C14.8699 5.23143 14.952 5.17219 15.0436 5.13183C15.1352 5.09147 15.2343 5.0709 15.3344 5.07146H25.1495C25.2528 5.07023 25.3552 5.09154 25.4495 5.13393C25.5438 5.17631 25.6278 5.23874 25.6955 5.31687C25.7632 5.395 25.813 5.48695 25.8416 5.58632C25.8701 5.68569 25.8766 5.79008 25.8607 5.89223L23.8977 18.979" stroke="#FECB07" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M19.9905 13.0117C19.849 13.0117 19.7133 12.9555 19.6133 12.8554C19.5132 12.7554 19.457 12.6197 19.457 12.4783C19.457 12.3368 19.5132 12.2011 19.6133 12.1011C19.7133 12.001 19.849 11.9448 19.9905 11.9448M19.9905 13.0117C20.1319 13.0117 20.2676 12.9555 20.3677 12.8554C20.4677 12.7554 20.5239 12.6197 20.5239 12.4783C20.5239 12.3368 20.4677 12.2011 20.3677 12.1011C20.2676 12.001 20.1319 11.9448 19.9905 11.9448" stroke="#FECB07" strokeWidth="1.5" />
                      </svg>
                    </div>
                    <span className="text-white" style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '17px',
                      display: 'block',
                      textAlign: 'left'
                    }}
                      dangerouslySetInnerHTML={{ __html: 'Avail Tax Benefits <br /> u/s 80G with <br /> your donations' }}
                    >
                    </span>
                  </div>

                  {/* FCRA Section */}
                  <div className="flex flex-row items-center gap-4">
                    {/* Icon */}
                    <div className="relative ml-5" style={{ width: '36px', height: '36px', flexShrink: 0 }}>
                      <svg width="36" height="36" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                        <path d="M13.5526 32.7499H31.6789M15.6851 22.0873V32.7499M19.9501 22.0873V32.7499M25.2814 22.0873V32.7499M29.5464 22.0873V32.7499M32.7452 22.0873H12.4863L21.8338 15.9457C22.0606 15.7794 22.3345 15.6897 22.6158 15.6897C22.897 15.6897 23.1709 15.7794 23.3977 15.9457L32.7452 22.0873Z" stroke="#FECB07" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M7.84856 30.0446C5.58965 28.5322 3.75333 26.4693 2.51287 24.0504C1.27241 21.6315 0.668727 18.9364 0.758784 16.2195C0.84884 13.5026 1.62967 10.8534 3.02758 8.52195C4.4255 6.19051 6.3944 4.25369 8.74849 2.89427C11.1026 1.53484 13.7642 0.797642 16.4823 0.752233C19.2003 0.706824 21.8851 1.3547 24.2833 2.63473C26.6815 3.91476 28.714 5.78473 30.189 8.06817C31.664 10.3516 32.5329 12.9732 32.7136 15.6856" stroke="#FECB07" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9.42307 18.8787C9.2148 16.066 9.32545 13.2388 9.7529 10.451C10.1365 7.18961 11.2089 4.047 12.8991 1.23145M0.794922 15.6899H9.28943M3.22172 8.22609H30.2847M2.09007 23.1537H8.22317M20.6074 1.23145C22.455 4.35462 23.5782 7.85256 23.8943 11.4675" stroke="#FECB07" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="text-white" style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '17px',
                      display: 'block',
                      textAlign: 'left'
                    }}
                      dangerouslySetInnerHTML={{ __html: 'Open to <br /> FCRA-Approved <br /> International Donations' }}
                    >
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed CTA Button Position - Desktop */}
            <div className="hidden md:block absolute bottom-16 left-1/2 transform -translate-x-1/2">
              <Link
                href="https://www.enablewomen.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full hover:bg-yellow-400 transition-colors duration-200"
                style={{
                  background: '#FECB07',
                  borderRadius: '30px',
                  width: '216px',
                  height: '40px',
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '20px',
                  color: '#171717',
                  padding: '10px 30px',
                  textDecoration: 'none'
                }}
              >
                Donate Now
              </Link>
            </div>

            {/* Fixed CTA Button Position - Mobile */}
            <div className="md:hidden absolute bottom-12 left-1/2 transform -translate-x-1/2">
              <Link
                href="https://www.enablewomen.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full hover:bg-yellow-400 transition-colors duration-200 shadow-md"
                style={{
                  background: '#FECB07',
                  borderRadius: '30px',
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontWeight: 600,
                  fontSize: 'clamp(13px, 3.2vw, 15px)',
                  lineHeight: '1.2',
                  color: '#171717',
                  padding: 'clamp(8px, 2vw, 10px) clamp(18px, 4.5vw, 24px)',
                  minWidth: 'clamp(120px, 30vw, 150px)',
                  height: 'clamp(32px, 8vw, 38px)',
                  textDecoration: 'none'
                }}
              >
                Donate Now
              </Link>
            </div>
          </div>

        </section>

      </div>
      {/* Key Updates Section */}
      <section className="py-10 bg-white relative mt-0 z-10 rounded-t-3xl shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Version */}
          <div className="hidden md:block mb-8 w-3/5">
            <h2 className="text-6xl lg:text-6xl text-[#653a96] mb-3"
              style={{
                fontFamily: 'DM Serif Display, serif', fontWeight: 500,
                fontStyle: 'Regular',
                fontSize: '46px',
                lineHeight: '51px'
              }}>
              {t('homepage.keyUpdates.title')}
            </h2>
            <p className="text-gray-800 mb-8"
              style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontWeight: 400,
                fontSize: '18px',
                lineHeight: '24px'
              }}
            >
              {t('homepage.keyUpdates.subtitle')}
            </p>
          </div>

          {/* Mobile Version */}
          <div className="md:hidden mb-6 text-center">
            <h2 className="text-[#653a96] mb-2 animate-on-scroll"
              style={{
                fontFamily: 'DM Serif Display, serif',
                fontWeight: 600,
                fontSize: '32px',
                lineHeight: '36px'
              }}>
              {t('homepage.keyUpdates.title')}
            </h2>
            <p className="text-gray-800 mb-6 animate-on-scroll"
              style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '20px'
              }}
            >
              {t('homepage.keyUpdates.subtitle')}
            </p>
          </div>

          {/* Desktop Version */}
          <div className="hidden md:flex gap-8 items-start">
            {/* Key Update Media with Controls */}
            <div className="flex-1">
              <div className="relative rounded-2xl overflow-hidden shadow-xl group">
                {keyUpdatesLoading ? (
                  <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
                      <p className="text-gray-600">Loading key updates...</p>
                    </div>
                  </div>
                ) : (() => {
                  const currentUpdate = dynamicKeyUpdates.length > 0 ? dynamicKeyUpdates[currentKeyUpdateImage] : null;
                  const isVideo = currentUpdate?.media_type === 'video';
                  const mediaUrl = currentUpdate?.image_url || keyUpdateImages[currentKeyUpdateImage];

                  return isVideo ? (
                    <video
                      ref={videoRefDesktop}
                      src={mediaUrl}
                      className="w-full h-96 object-cover"
                      muted={isVideoMuted}
                      loop
                      playsInline
                      onPlay={() => setIsVideoPlaying(true)}
                      onPause={() => setIsVideoPlaying(false)}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <Image
                      src={mediaUrl}
                      alt={currentUpdate?.title || "Key Updates"}
                      width={600}
                      height={400}
                      className="w-full h-96 object-cover"
                      onError={(e) => {
                        // Fallback to static images if dynamic image fails
                        if (dynamicKeyUpdates.length > 0) {
                          e.target.src = keyUpdateImages[currentKeyUpdateImage % keyUpdateImages.length];
                        }
                      }}
                    />
                  );
                })()}

                {/* Navigation Controls - Show on all media - Bottom Center - Show on hover */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3 px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={goToPreviousImage}
                    className="text-white p-2 rounded-full border border-white hover:bg-white hover:text-black transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  {(() => {
                    const currentUpdate = dynamicKeyUpdates.length > 0 ? dynamicKeyUpdates[currentKeyUpdateImage] : null;
                    const isVideo = currentUpdate?.media_type === 'video';
                    return isVideo ? (
                      <>
                        <button
                          onClick={toggleVideoPlay}
                          className="text-white p-2 rounded-full border border-white hover:bg-white hover:text-black transition-all duration-200"
                        >
                          {isVideoPlaying ? (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={toggleVideoMute}
                          className="text-white p-2 rounded-full border border-white hover:bg-white hover:text-black transition-all duration-200"
                        >
                          {isVideoMuted ? (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                            </svg>
                          )}
                        </button>
                      </>
                    ) : null;
                  })()}
                  <button
                    onClick={goToNextImage}
                    className="text-white p-2 rounded-full border border-white hover:bg-white hover:text-black transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

              </div>
            </div>

            {/* Announcements Box */}
            <div className="w-[28rem] -mt-16">
              <div className="bg-white rounded-lg overflow-hidden h-[28rem]">
                <div className="flex border border-gray-200">
                  <button
                    onClick={() => setActiveTab('announcements')}
                    className={`group flex-1 px-4 py-3 text-sm flex items-center justify-center gap-2 font-medium transition-colors ${activeTab === 'announcements'
                      ? 'bg-[#653a96] text-white font-bold text-3xl'
                      : 'bg-white text-gray-600 hover:bg-[#fecb07] hover:text-black'
                      }`}
                  >
                    <svg
                      width="13"
                      height="14"
                      viewBox="0 0 13 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`w-4 h-4 transition duration-200 ${activeTab === 'announcements' ? 'text-white' : 'text-black group-hover:text-black'}`}
                    >
                      <path
                        d="M9.528 0.331773C9.67125 0.500523 9.75 0.715023 9.75 0.937023V12.5635C9.75004 12.7424 9.69891 12.9175 9.60266 13.0682C9.50641 13.219 9.36905 13.339 9.20678 13.4143C9.04452 13.4895 8.86412 13.5167 8.68688 13.4928C8.50965 13.4688 8.34296 13.3946 8.2065 13.279L4.48125 10.1245H1.6875C1.23995 10.1245 0.810725 9.94673 0.494257 9.63026C0.17779 9.3138 0 8.88457 0 8.43702V5.06202C0 4.61447 0.17779 4.18525 0.494257 3.86878C0.810725 3.55231 1.23995 3.37452 1.6875 3.37452H4.48125L8.20725 0.221523C8.39705 0.0610871 8.64279 -0.0174219 8.89045 0.0032517C9.13811 0.0239253 9.36743 0.14209 9.528 0.331773ZM11.328 4.22952C11.4553 4.15205 11.6082 4.12829 11.753 4.16344C11.8979 4.1986 12.0229 4.2898 12.1005 4.41702C12.531 5.12202 12.747 5.91102 12.747 6.77202C12.747 7.63302 12.531 8.42277 12.1005 9.12777C12.0631 9.19295 12.013 9.24998 11.9532 9.29549C11.8934 9.34099 11.8251 9.37406 11.7523 9.39272C11.6795 9.41139 11.6037 9.41529 11.5294 9.40417C11.4551 9.39306 11.3838 9.36717 11.3196 9.32803C11.2555 9.28889 11.1998 9.23729 11.1559 9.17629C11.1121 9.11528 11.0808 9.0461 11.0642 8.97283C11.0475 8.89956 11.0456 8.82369 11.0587 8.7497C11.0718 8.67571 11.0996 8.60509 11.1405 8.54202C11.4615 8.01552 11.622 7.42977 11.622 6.77202C11.622 6.11427 11.4615 5.52927 11.1405 5.00277C11.063 4.87544 11.0393 4.72257 11.0744 4.57773C11.1096 4.43289 11.2008 4.30717 11.328 4.22952Z"
                        fill="currentColor"
                      />
                    </svg>
                    {t('homepage.keyUpdates.announcements')}
                  </button>
                  <button
                    onClick={() => setActiveTab('actions')}
                    className={`group flex-1 px-4 py-3 text-sm flex items-center justify-center gap-2 font-medium transition-colors ${activeTab === 'actions'
                      ? 'bg-[#653a96] text-white font-bold text-3xl'
                      : 'bg-white text-gray-600 hover:bg-[#fecb07] hover:text-black'
                      }`}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`w-6 h-6 transition duration-200 ${activeTab === 'actions' ? 'text-white' : 'text-black group-hover:text-black'}`}
                    >
                      <path
                        d="M7.44375 9.95775L8.028 8.02275L6.4905 6.894H8.412L9 4.93875L9.58875 6.894H11.5095L9.9675 8.022L10.5525 9.95775L9 8.75625L7.44375 9.95775ZM5.25 16.0965V11.154C4.775 10.6865 4.40625 10.139 4.14375 9.5115C3.88125 8.8855 3.75 8.215 3.75 7.5C3.75 6.0365 4.259 4.79575 5.277 3.77775C6.295 2.75975 7.536 2.2505 9 2.25C10.464 2.2495 11.705 2.7585 12.723 3.777C13.741 4.7955 14.25 6.0365 14.25 7.5C14.25 8.2145 14.1188 8.88525 13.8563 9.51225C13.5938 10.1392 13.225 10.686 12.75 11.1525V16.095L9 14.97L5.25 16.0965ZM9 12C10.25 12 11.3125 11.5625 12.1875 10.6875C13.0625 9.8125 13.5 8.75 13.5 7.5C13.5 6.25 13.0625 5.1875 12.1875 4.3125C11.3125 3.4375 10.25 3 9 3C7.75 3 6.6875 3.4375 5.8125 4.3125C4.9375 5.1875 4.5 6.25 4.5 7.5C4.5 8.75 4.9375 9.8125 5.8125 10.6875C6.6875 11.5625 7.75 12 9 12ZM6 15.033L9 14.1922L12 15.033V11.7855C11.582 12.093 11.1173 12.3305 10.6058 12.498C10.0953 12.666 9.56 12.75 9 12.75C8.44 12.75 7.90475 12.6662 7.39425 12.4987C6.88375 12.3313 6.419 12.0935 6 11.7855V15.033Z"
                        fill="currentColor"
                      />
                    </svg>
                    {t('homepage.keyUpdates.actions')}
                  </button>
                  <button
                    onClick={() => setActiveTab('events')}
                    className={`group flex-1 px-4 py-3 text-sm flex items-center justify-center gap-2 font-medium transition-colors ${activeTab === 'events'
                      ? 'bg-[#653a96] text-white font-bold text-3xl'
                      : 'bg-white text-gray-600 hover:bg-[#fecb07] hover:text-black'
                      }`}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`w-5 h-5 transition duration-200 ${activeTab === 'events' ? 'text-white' : 'text-black group-hover:text-black'}`}
                    >
                      <g clipPath="url(#clip0_events_desktop)">
                        <path d="M8.08539 12.93L5.40539 10.25C5.32347 10.1544 5.28067 10.0313 5.28553 9.90549C5.29039 9.77965 5.34256 9.66028 5.4316 9.57123C5.52065 9.48218 5.64002 9.43002 5.76586 9.42516C5.8917 9.4203 6.01473 9.4631 6.11039 9.54501L8.08539 11.5L12.4054 7.18001C12.501 7.0981 12.6241 7.0553 12.7499 7.06016C12.8758 7.06502 12.9951 7.11718 13.0842 7.20623C13.1732 7.29528 13.2254 7.41465 13.2302 7.54049C13.2351 7.66632 13.1923 7.78936 13.1104 7.88501L8.08539 12.93Z" fill="currentColor" />
                        <path d="M16.1251 3H14.5001V4H16.0001V15H2.00013V4H3.50013V3H1.87513C1.75825 3.00195 1.6429 3.02691 1.53566 3.07345C1.42843 3.11999 1.33141 3.1872 1.25016 3.27125C1.1689 3.35529 1.105 3.45451 1.0621 3.56325C1.0192 3.67199 0.998142 3.78812 1.00013 3.905V15.095C0.998142 15.2119 1.0192 15.328 1.0621 15.4368C1.105 15.5455 1.1689 15.6447 1.25016 15.7288C1.33141 15.8128 1.42843 15.88 1.53566 15.9265C1.6429 15.9731 1.75825 15.998 1.87513 16H16.1251C16.242 15.998 16.3574 15.9731 16.4646 15.9265C16.5718 15.88 16.6688 15.8128 16.7501 15.7288C16.8314 15.6447 16.8953 15.5455 16.9382 15.4368C16.9811 15.328 17.0021 15.2119 17.0001 15.095V3.905C17.0021 3.78812 16.9811 3.67199 16.9382 3.56325C16.8953 3.45451 16.8314 3.35529 16.7501 3.27125C16.6688 3.1872 16.5718 3.11999 16.4646 3.07345C16.3574 3.02691 16.242 3.00195 16.1251 3Z" fill="currentColor" />
                        <path d="M5 5C5.13261 5 5.25979 4.94732 5.35355 4.85355C5.44732 4.75978 5.5 4.63261 5.5 4.5V1.5C5.5 1.36739 5.44732 1.24021 5.35355 1.14645C5.25979 1.05268 5.13261 1 5 1C4.86739 1 4.74021 1.05268 4.64645 1.14645C4.55268 1.24021 4.5 1.36739 4.5 1.5V4.5C4.5 4.63261 4.55268 4.75978 4.64645 4.85355C4.74021 4.94732 4.86739 5 5 5Z" fill="currentColor" />
                        <path d="M13 5C13.1326 5 13.2598 4.94732 13.3536 4.85355C13.4473 4.75978 13.5 4.63261 13.5 4.5V1.5C13.5 1.36739 13.4473 1.24021 13.3536 1.14645C13.2598 1.05268 13.1326 1 13 1C12.8674 1 12.7402 1.05268 12.6464 1.14645C12.5527 1.24021 12.5 1.36739 12.5 1.5V4.5C12.5 4.63261 12.5527 4.75978 12.6464 4.85355C12.7402 4.94732 12.8674 5 13 5Z" fill="currentColor" />
                        <path d="M6.5 3H11.5V4H6.5V3Z" fill="currentColor" />
                      </g>
                      <defs>
                        <clipPath id="clip0_events_desktop">
                          <rect width="18" height="18" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                    {t('homepage.keyUpdates.events')}
                  </button>
                </div>

                <div
                  ref={scrollRefDesktop}
                  className="p-4 h-full overflow-y-auto scrollbar-hide"
                  style={{
                    scrollbarWidth: 'none', /* Firefox */
                    msOverflowStyle: 'none', /* Internet Explorer 10+ */
                  }}
                  onMouseEnter={() => setIsScrolling(false)}
                  onMouseLeave={() => setIsScrolling(true)}
                >
                  {contentLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
                        <p className="text-gray-600">Loading content...</p>
                      </div>
                    </div>
                  ) : currentData.length > 0 ? (
                    <>
                      {currentData.map((item, index) => (
                        <div
                          key={item.id}
                          className="border-b border-gray-400 py-6 last:border-b-0"
                          onClick={() => {
                            if (item.link) {
                              window.open(item.link, '_blank', 'noopener,noreferrer');
                            }
                          }}
                          style={item.link ? { cursor: 'pointer' } : {}}
                        >
                          <div className="flex items-start gap-3">
                            <svg className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm mb-1 ${item.link ? 'text-gray-800 hover:text-[#653a96] transition-colors duration-200' : 'text-gray-800'}`}>
                                {item.title}
                              </p>
                              <div className="flex items-center text-xs text-gray-500">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                                <span style={{ fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400 }}>{item.date}</span>
                                {item.location && (
                                  <>
                                    <span className="mx-2">•</span>
                                    <span>{item.location}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            {item.image_url && (
                              <div className="flex-shrink-0 ml-2">
                                <img
                                  src={item.image_url}
                                  alt={item.title}
                                  className="w-40 h-28 object-cover rounded-lg"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Removed See all link */}
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                          </svg>
                        </div>
                        <p className="text-gray-500 text-sm mb-2" style={{ fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 500 }}>
                          {activeTab === 'actions' ? 'No actions available' : activeTab === 'events' ? 'No events scheduled' : activeTab === 'announcements' ? 'No announcements available' : 'No content available'}
                        </p>
                        <p className="text-gray-400 text-xs" style={{ fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400 }}>
                          Check back later for updates
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Version */}
          <div className="md:hidden">
            {/* Mobile Key Update Media */}
            <div className="mb-6">
              <div className="relative rounded-2xl overflow-hidden shadow-xl animate-on-scroll">
                {keyUpdatesLoading ? (
                  <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto mb-2"></div>
                      <p className="text-gray-600 text-sm">Loading key updates...</p>
                    </div>
                  </div>
                ) : (() => {
                  const currentUpdate = dynamicKeyUpdates.length > 0 ? dynamicKeyUpdates[currentKeyUpdateImage] : null;
                  const isVideo = currentUpdate?.media_type === 'video';
                  const mediaUrl = currentUpdate?.image_url || keyUpdateImages[currentKeyUpdateImage];

                  return isVideo ? (
                    <video
                      ref={videoRefMobile}
                      src={mediaUrl}
                      className="w-full h-64 object-cover"
                      muted={isVideoMuted}
                      loop
                      playsInline
                      onPlay={() => setIsVideoPlaying(true)}
                      onPause={() => setIsVideoPlaying(false)}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <Image
                      src={mediaUrl}
                      alt={currentUpdate?.title || "Key Updates"}
                      width={400}
                      height={250}
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        // Fallback to static images if dynamic image fails
                        if (dynamicKeyUpdates.length > 0) {
                          e.target.src = keyUpdateImages[currentKeyUpdateImage % keyUpdateImages.length];
                        }
                      }}
                    />
                  );
                })()}

                {/* Mobile Navigation Controls */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1 items-center bg-black/50 backdrop-blur-sm rounded-full px-1.5 py-1">
                  <button
                    onClick={goToPreviousImage}
                    className="text-white flex items-center justify-center p-1 rounded-full hover:bg-white/20 active:bg-white/30 transition-all duration-200"
                    aria-label="Previous"
                  >
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  {(() => {
                    const currentUpdate = dynamicKeyUpdates.length > 0 ? dynamicKeyUpdates[currentKeyUpdateImage] : null;
                    const isVideo = currentUpdate?.media_type === 'video';
                    return isVideo ? (
                      <>
                        <button
                          onClick={toggleVideoPlay}
                          className="text-white flex items-center justify-center p-1 rounded-full hover:bg-white/20 active:bg-white/30 transition-all duration-200"
                          aria-label={isVideoPlaying ? "Pause" : "Play"}
                        >
                          {isVideoPlaying ? (
                            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                            </svg>
                          ) : (
                            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={toggleVideoMute}
                          className="text-white flex items-center justify-center p-1 rounded-full hover:bg-white/20 active:bg-white/30 transition-all duration-200"
                          aria-label={isVideoMuted ? "Unmute" : "Mute"}
                        >
                          {isVideoMuted ? (
                            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                            </svg>
                          ) : (
                            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                            </svg>
                          )}
                        </button>
                      </>
                    ) : null;
                  })()}
                  <button
                    onClick={goToNextImage}
                    className="text-white flex items-center justify-center p-1 rounded-full hover:bg-white/20 active:bg-white/30 transition-all duration-200"
                    aria-label="Next"
                  >
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Announcements Box */}
            <div className="rounded-lg overflow-hidden">
              <div className="flex border border-gray-200">
                <button
                  onClick={() => setActiveTab('announcements')}
                  className={`group flex-1 px-3 py-2 text-xs flex items-center justify-center gap-1 font-medium transition-colors ${activeTab === 'announcements'
                    ? 'bg-[#653a96] text-white font-bold'
                    : 'bg-white text-gray-600 hover:bg-[#fecb07] hover:text-black'
                    }`}
                >
                  <svg
                    width="13"
                    height="14"
                    viewBox="0 0 13 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-4 h-4 transition duration-200 ${activeTab === 'announcements' ? 'text-white' : 'text-black group-hover:text-black'}`}
                  >
                    <path
                      d="M9.528 0.331773C9.67125 0.500523 9.75 0.715023 9.75 0.937023V12.5635C9.75004 12.7424 9.69891 12.9175 9.60266 13.0682C9.50641 13.219 9.36905 13.339 9.20678 13.4143C9.04452 13.4895 8.86412 13.5167 8.68688 13.4928C8.50965 13.4688 8.34296 13.3946 8.2065 13.279L4.48125 10.1245H1.6875C1.23995 10.1245 0.810725 9.94673 0.494257 9.63026C0.17779 9.3138 0 8.88457 0 8.43702V5.06202C0 4.61447 0.17779 4.18525 0.494257 3.86878C0.810725 3.55231 1.23995 3.37452 1.6875 3.37452H4.48125L8.20725 0.221523C8.39705 0.0610871 8.64279 -0.0174219 8.89045 0.0032517C9.13811 0.0239253 9.36743 0.14209 9.528 0.331773ZM11.328 4.22952C11.4553 4.15205 11.6082 4.12829 11.753 4.16344C11.8979 4.1986 12.0229 4.2898 12.1005 4.41702C12.531 5.12202 12.747 5.91102 12.747 6.77202C12.747 7.63302 12.531 8.42277 12.1005 9.12777C12.0631 9.19295 12.013 9.24998 11.9532 9.29549C11.8934 9.34099 11.8251 9.37406 11.7523 9.39272C11.6795 9.41139 11.6037 9.41529 11.5294 9.40417C11.4551 9.39306 11.3838 9.36717 11.3196 9.32803C11.2555 9.28889 11.1998 9.23729 11.1559 9.17629C11.1121 9.11528 11.0808 9.0461 11.0642 8.97283C11.0475 8.89956 11.0456 8.82369 11.0587 8.7497C11.0718 8.67571 11.0996 8.60509 11.1405 8.54202C11.4615 8.01552 11.622 7.42977 11.622 6.77202C11.622 6.11427 11.4615 5.52927 11.1405 5.00277C11.063 4.87544 11.0393 4.72257 11.0744 4.57773C11.1096 4.43289 11.2008 4.30717 11.328 4.22952Z"
                      fill="currentColor"
                    />
                  </svg>
                  {t('homepage.keyUpdates.announcements')}
                </button>
                <button
                  onClick={() => setActiveTab('actions')}
                  className={`group flex-1 px-3 py-2 text-xs flex items-center justify-center gap-1 font-medium transition-colors ${activeTab === 'actions'
                    ? 'bg-[#653a96] text-white font-bold'
                    : 'bg-white text-gray-600 hover:bg-[#fecb07] hover:text-black'
                    }`}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-4 h-4 transition duration-200 ${activeTab === 'actions' ? 'text-white' : 'text-black group-hover:text-black'}`}
                  >
                    <path
                      d="M7.44375 9.95775L8.028 8.02275L6.4905 6.894H8.412L9 4.93875L9.58875 6.894H11.5095L9.9675 8.022L10.5525 9.95775L9 8.75625L7.44375 9.95775ZM5.25 16.0965V11.154C4.775 10.6865 4.40625 10.139 4.14375 9.5115C3.88125 8.8855 3.75 8.215 3.75 7.5C3.75 6.0365 4.259 4.79575 5.277 3.77775C6.295 2.75975 7.536 2.2505 9 2.25C10.464 2.2495 11.705 2.7585 12.723 3.777C13.741 4.7955 14.25 6.0365 14.25 7.5C14.25 8.2145 14.1188 8.88525 13.8563 9.51225C13.5938 10.1392 13.225 10.686 12.75 11.1525V16.095L9 14.97L5.25 16.0965ZM9 12C10.25 12 11.3125 11.5625 12.1875 10.6875C13.0625 9.8125 13.5 8.75 13.5 7.5C13.5 6.25 13.0625 5.1875 12.1875 4.3125C11.3125 3.4375 10.25 3 9 3C7.75 3 6.6875 3.4375 5.8125 4.3125C4.9375 5.1875 4.5 6.25 4.5 7.5C4.5 8.75 4.9375 9.8125 5.8125 10.6875C6.6875 11.5625 7.75 12 9 12ZM6 15.033L9 14.1922L12 15.033V11.7855C11.582 12.093 11.1173 12.3305 10.6058 12.498C10.0953 12.666 9.56 12.75 9 12.75C8.44 12.75 7.90475 12.6662 7.39425 12.4987C6.88375 12.3313 6.419 12.0935 6 11.7855V15.033Z"
                      fill="currentColor"
                    />
                  </svg>
                  {t('homepage.keyUpdates.actions')}
                </button>
                <button
                  onClick={() => setActiveTab('events')}
                  className={`group flex-1 px-3 py-2 text-xs flex items-center justify-center gap-1 font-medium transition-colors ${activeTab === 'events'
                    ? 'bg-[#653a96] text-white font-bold'
                    : 'bg-white text-gray-600 hover:bg-[#fecb07] hover:text-black'
                    }`}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-4 h-4 transition duration-200 ${activeTab === 'events' ? 'text-white' : 'text-black group-hover:text-black'}`}
                  >
                    <g clipPath="url(#clip0_events_mobile)">
                      <path d="M8.08539 12.93L5.40539 10.25C5.32347 10.1544 5.28067 10.0313 5.28553 9.90549C5.29039 9.77965 5.34256 9.66028 5.4316 9.57123C5.52065 9.48218 5.64002 9.43002 5.76586 9.42516C5.8917 9.4203 6.01473 9.4631 6.11039 9.54501L8.08539 11.5L12.4054 7.18001C12.501 7.0981 12.6241 7.0553 12.7499 7.06016C12.8758 7.06502 12.9951 7.11718 13.0842 7.20623C13.1732 7.29528 13.2254 7.41465 13.2302 7.54049C13.2351 7.66632 13.1923 7.78936 13.1104 7.88501L8.08539 12.93Z" fill="currentColor" />
                      <path d="M16.1251 3H14.5001V4H16.0001V15H2.00013V4H3.50013V3H1.87513C1.75825 3.00195 1.6429 3.02691 1.53566 3.07345C1.42843 3.11999 1.33141 3.1872 1.25016 3.27125C1.1689 3.35529 1.105 3.45451 1.0621 3.56325C1.0192 3.67199 0.998142 3.78812 1.00013 3.905V15.095C0.998142 15.2119 1.0192 15.328 1.0621 15.4368C1.105 15.5455 1.1689 15.6447 1.25016 15.7288C1.33141 15.8128 1.42843 15.88 1.53566 15.9265C1.6429 15.9731 1.75825 15.998 1.87513 16H16.1251C16.242 15.998 16.3574 15.9731 16.4646 15.9265C16.5718 15.88 16.6688 15.8128 16.7501 15.7288C16.8314 15.6447 16.8953 15.5455 16.9382 15.4368C16.9811 15.328 17.0021 15.2119 17.0001 15.095V3.905C17.0021 3.78812 16.9811 3.67199 16.9382 3.56325C16.8953 3.45451 16.8314 3.35529 16.7501 3.27125C16.6688 3.1872 16.5718 3.11999 16.4646 3.07345C16.3574 3.02691 16.242 3.00195 16.1251 3Z" fill="currentColor" />
                      <path d="M5 5C5.13261 5 5.25979 4.94732 5.35355 4.85355C5.44732 4.75978 5.5 4.63261 5.5 4.5V1.5C5.5 1.36739 5.44732 1.24021 5.35355 1.14645C5.25979 1.05268 5.13261 1 5 1C4.86739 1 4.74021 1.05268 4.64645 1.14645C4.55268 1.24021 4.5 1.36739 4.5 1.5V4.5C4.5 4.63261 4.55268 4.75978 4.64645 4.85355C4.74021 4.94732 4.86739 5 5 5Z" fill="currentColor" />
                      <path d="M13 5C13.1326 5 13.2598 4.94732 13.3536 4.85355C13.4473 4.75978 13.5 4.63261 13.5 4.5V1.5C13.5 1.36739 13.4473 1.24021 13.3536 1.14645C13.2598 1.05268 13.1326 1 13 1C12.8674 1 12.7402 1.05268 12.6464 1.14645C12.5527 1.24021 12.5 1.36739 12.5 1.5V4.5C12.5 4.63261 12.5527 4.75978 12.6464 4.85355C12.7402 4.94732 12.8674 5 13 5Z" fill="currentColor" />
                      <path d="M6.5 3H11.5V4H6.5V3Z" fill="currentColor" />
                    </g>
                    <defs>
                      <clipPath id="clip0_events_mobile">
                        <rect width="18" height="18" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  {t('homepage.keyUpdates.events')}
                </button>
              </div>

              <div
                ref={scrollRefMobile}
                className="p-3 max-h-64 overflow-y-auto scrollbar-hide"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
                onMouseEnter={() => setIsScrolling(false)}
                onMouseLeave={() => setIsScrolling(true)}
              >
                {contentLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto mb-2"></div>
                      <p className="text-gray-600 text-sm">Loading content...</p>
                    </div>
                  </div>
                ) : currentData.length > 0 ? (
                  <>
                    {currentData.map((item, index) => (
                      <div
                        key={item.id}
                        className="border-b border-gray-300 py-3 last:border-b-0"
                        onClick={() => {
                          if (item.link) {
                            window.open(item.link, '_blank', 'noopener,noreferrer');
                          }
                        }}
                        style={item.link ? { cursor: 'pointer' } : {}}
                      >
                        <div className="flex items-start gap-2">
                          <svg className="w-3 h-3 text-gray-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs mb-1 ${item.link ? 'text-[#653a96]' : 'text-gray-800'}`}>
                              {item.title}
                            </p>
                            <div className="flex items-center text-xs text-gray-500">
                              <svg className="w-2 h-2 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                              <span style={{ fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400 }}>{item.date}</span>
                              {item.location && (
                                <>
                                  <span className="mx-1">•</span>
                                  <span>{item.location}</span>
                                </>
                              )}
                            </div>
                          </div>
                          {item.image_url && (
                            <div className="flex-shrink-0 ml-1">
                              <img
                                src={item.image_url}
                                alt={item.title}
                                className="w-28 h-20 object-cover rounded-lg"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Removed See all link */}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-xs mb-1" style={{ fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 500 }}>
                        {activeTab === 'actions' ? 'No actions available' : activeTab === 'events' ? 'No events scheduled' : activeTab === 'announcements' ? 'No announcements available' : 'No content available'}
                      </p>
                      <p className="text-gray-400 text-xs" style={{ fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400 }}>
                        Check back later for updates
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-on-scroll">
          {/* Desktop Version */}
          <div className="hidden md:block text-center max-w-6xl mx-auto relative">
            {/* Background Image positioned on the right - ABOVE the purple background */}
            <div className="absolute right-0 bottom-0 w-1/2 h-full flex items-end justify-end  z-20 mb-0">
              <img
                src="/assets/Frame 7857 (1).png"
                alt="About Us Background"
                className="max-w-full max-h-full object-contain opacity-40 mb-0"
                style={{ maxWidth: '300px', maxHeight: '350px' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>

            {/* Purple Box Container */}
            <div className="rounded-3xl p-12 shadow-xl relative z-10" style={{
              background: 'linear-gradient(90deg, #4F287B 11.06%, #653A96 52.4%, #391660 100%)'
            }}>
              {/* Title */}
              <h2 className="text-4xl lg:text-5xl text-white mb-6 font-normal animate-on-scroll relative z-30"
                style={{
                  fontFamily: 'DM Serif Display, serif', fontWeight: 500,
                  fontSize: '56px',
                  lineHeight: '57px'
                }}
              >
                {t('homepage.whoWeAre.title')}
              </h2>

              {/* Description */}
              <p className="text-[1rem] mb-12 text-white text-3xl  mx-auto animate-on-scroll relative z-30"
                style={{
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontWeight: 400,
                  fontSize: '18px',
                  lineHeight: '24px',
                  letterSpacing: '0.02em',
                  textRendering: 'optimizeLegibility',
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                }}
                dangerouslySetInnerHTML={{ __html: t('homepage.whoWeAre.description').replace('\n', '<br />') }}
              >
              </p>

              {/* Vision and Mission Columns */}
              <div className="flex flex-col md:flex-row gap-8 pl-10 relative z-30">
                <div className="text-left flex-1">
                  <h3 className="text-xl mb-4 text-white animate-on-scroll"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontWeight: 400,
                      fontSize: '24px',
                      lineHeight: '28px',
                      letterSpacing: '0.02em',
                      textRendering: 'optimizeLegibility',
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale',
                    }}
                  >{t('homepage.whoWeAre.vision')}</h3>
                  <p className="text-base leading-relaxed text-white font-normal animate-on-scroll"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontWeight: 400,
                      fontSize: '18px',
                      lineHeight: '24px',
                      letterSpacing: '0.02em',
                      textRendering: 'optimizeLegibility',
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale',
                    }} dangerouslySetInnerHTML={{ __html: t('homepage.whoWeAre.visionText').replace('\n', '<br />') }}>
                  </p>
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-xl mb-4 text-white animate-on-scroll"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontWeight: 400,
                      fontSize: '24px',
                      lineHeight: '28px'
                    }}
                  >{t('homepage.whoWeAre.mission')}</h3>
                  <p className="text-base leading-relaxed text-white font-normal animate-on-scroll"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontWeight: 400,
                      fontSize: '18px',
                      lineHeight: '24px'
                    }} dangerouslySetInnerHTML={{ __html: t('homepage.whoWeAre.missionText').replace('\n', '<br />') }}>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Version */}
          <div className="md:hidden">
            {/* Mobile Purple Box Container */}
            <div className="rounded-2xl p-6 mx-4 shadow-xl" style={{
              background: 'linear-gradient(90deg, #4F287B 11.06%, #653A96 52.4%, #391660 100%)'
            }}>
              {/* Mobile Title */}
              <h2 className="text-white mb-4 font-normal animate-on-scroll text-center"
                style={{
                  fontFamily: 'DM Serif Display, serif',
                  fontWeight: 500,
                  fontSize: '28px',
                  lineHeight: '32px'
                }}
              >
                {t('homepage.whoWeAre.title')}
              </h2>

              {/* Mobile Description */}
              <p className="mb-6 text-white animate-on-scroll text-center"
                style={{
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '20px'
                }}
              >
                {t('homepage.whoWeAre.description')}
              </p>

              {/* Mobile Vision and Mission */}
              <div className="flex flex-col gap-4">
                <div className="text-left">
                  <h3 className="text-lg mb-2 text-white animate-on-scroll"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontWeight: 500,
                      fontSize: '18px',
                      lineHeight: '22px'
                    }}
                  >{t('homepage.whoWeAre.vision')}</h3>
                  <p className="text-sm leading-relaxed text-white font-normal animate-on-scroll"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '18px'
                    }} dangerouslySetInnerHTML={{ __html: t('homepage.whoWeAre.visionText').replace('\n', '<br />') }}>
                  </p>
                </div>
                <div className="text-left">
                  <h3 className="text-lg mb-2 text-white animate-on-scroll"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontWeight: 500,
                      fontSize: '18px',
                      lineHeight: '22px'
                    }}
                  >{t('homepage.whoWeAre.mission')}</h3>
                  <p className="text-sm leading-relaxed text-white font-normal animate-on-scroll"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '18px'
                    }} dangerouslySetInnerHTML={{ __html: t('homepage.whoWeAre.missionText').replace('\n', '<br />') }}>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Version */}
          <div className="hidden md:block">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl text-[#653a96] mb-6 animate-on-scroll" style={{
                fontFamily: 'DM Serif Display, serif', fontWeight: 500,
                fontSize: '44px',
                lineHeight: '44px'
              }}>
                {t('homepage.sections.keyFeatures')}
              </h2>
            </div>

            {/* Key Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              {/* Row 1 */}
              <div
                className="relative rounded-2xl overflow-hidden h-72 group cursor-pointer animate-on-scroll"
                onClick={() => setActiveKeyFeature(activeKeyFeature === 'capacity' ? null : 'capacity')}
              >
                <Image
                  src={getFeatureImage('capacity')}
                  alt="Capacity Building"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-end p-8 mb-4">
                  <div>
                    <Image
                      src="/assets/key-feature/hat.png"
                      alt="Education"
                      width={56}
                      height={56}
                      className="mb-5"
                    />
                    <h3 className="text-2xl font-medium">{t('homepage.features.capacity')}</h3>
                  </div>
                </div>
              </div>

              <div
                className="relative rounded-2xl overflow-hidden h-72 group cursor-pointer animate-on-scroll"
                onClick={() => setActiveKeyFeature(activeKeyFeature === 'mentorship' ? null : 'mentorship')}
              >
                <Image
                  src={getFeatureImage('mentorship')}
                  alt="Mentorship"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-end p-8">
                  <div>
                    <Image
                      src="/assets/key-feature/laptop.png"
                      alt="Mentor"
                      width={56}
                      height={56}
                      className="mb-5"
                    />
                    <h3 className="text-2xl font-medium">{t('homepage.features.mentorship')}</h3>
                  </div>
                </div>
              </div>

              <div
                className="relative rounded-2xl overflow-hidden h-72 group cursor-pointer animate-on-scroll"
                onClick={() => setActiveKeyFeature(activeKeyFeature === 'finance' ? null : 'finance')}
              >
                <Image
                  src={getFeatureImage('finance')}
                  alt="Access to Finance"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0  flex items-end p-8">
                  <div>
                    <Image
                      src="/assets/key-feature/growth.png"
                      alt="Finance"
                      width={56}
                      height={56}
                      className="mb-5"
                    />
                    <h3 className="text-2xl font-medium">{t('homepage.features.finance')}</h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Row 2 */}
              <div
                className="relative rounded-2xl overflow-hidden h-72 group cursor-pointer animate-on-scroll"
                onClick={() => setActiveKeyFeature(activeKeyFeature === 'visibility' ? null : 'visibility')}
              >
                <Image
                  src={getFeatureImage('visibility')}
                  alt="Visibility"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0  flex items-end p-8">
                  <div>
                    <Image
                      src="/assets/key-feature/gis--story-map.png"
                      alt="Story"
                      width={56}
                      height={56}
                      className="mb-5"
                    />
                    <h3 className="text-2xl font-medium">{t('homepage.features.visibility')}</h3>
                  </div>
                </div>
              </div>

              <div
                className="relative rounded-2xl overflow-hidden h-72 group cursor-pointer animate-on-scroll"
                onClick={() => setActiveKeyFeature(activeKeyFeature === 'technology' ? null : 'technology')}
              >
                <Image
                  src={getFeatureImage('technology')}
                  alt="Technology"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0  flex items-end p-8 mb-6">
                  <div>
                    <Image
                      src="/assets/key-feature/streamline-plump--deepfake-technology-1-solid.png"
                      alt="Technology"
                      width={56}
                      height={56}
                      className="mb-5"
                    />
                    <h3 className="text-2xl font-medium">{t('homepage.features.technology')}</h3>
                  </div>
                </div>
              </div>

              <div
                className="relative rounded-2xl overflow-hidden h-72 group cursor-pointer animate-on-scroll"
                onClick={() => setActiveKeyFeature(activeKeyFeature === 'crossborder' ? null : 'crossborder')}
              >
                <Image
                  src={getFeatureImage('crossborder')}
                  alt="Cross Border"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0  flex items-end p-8">
                  <div>
                    <Image
                      src="/assets/key-feature/solar--atom-bold.png"
                      alt="Collaboration"
                      width={56}
                      height={56}
                      className="mb-5"
                    />
                    <h3 className="text-2xl font-medium">{t('homepage.features.crossborder')}</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Flowing Card */}
            {activeKeyFeature && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                {/* Backdrop */}
                <div
                  className="absolute inset-0 bg-black bg-opacity-30"
                  onClick={() => { setActiveKeyFeature(null); }}
                ></div>

                {/* Flowing Card */}
                <div className="relative w-full max-w-3xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
                  <div
                    className="relative rounded-[30px] overflow-hidden shadow-2xl transform transition-all duration-500 ease-out border border-white"
                    style={{
                      width: '817px',
                      height: '420px',
                      background: `linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${getFeatureImage(activeKeyFeature)}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      borderWidth: '1px'
                    }}
                  >
                    {/* Padded content wrapper to keep content away from edges */}
                    <div className="absolute inset-0 p-8 pt-10 pb-14">
                      {/* Large Icon */}
                      <div className="absolute left-[20px] top-[120px] w-[120px] h-[120px]">
                        {activeKeyFeature === 'capacity' && (
                          <Image
                            src="/assets/key-feature/hat.png"
                            alt="Education"
                            width={110}
                            height={110}
                            className="ml-4 mt-4"
                          />
                        )}
                        {activeKeyFeature === 'mentorship' && (
                          <Image
                            src="/assets/key-feature/laptop.png"
                            alt="Mentor"
                            width={110}
                            height={110}
                            className="ml-4 mt-4"
                          />
                        )}
                        {activeKeyFeature === 'finance' && (
                          <Image
                            src="/assets/key-feature/growth.png"
                            alt="Finance"
                            width={110}
                            height={110}
                            className="ml-4 mt-4"
                          />
                        )}
                        {activeKeyFeature === 'visibility' && (
                          <Image
                            src="/assets/key-feature/gis--story-map.png"
                            alt="Story"
                            width={110}
                            height={110}
                            className="ml-4 mt-4"
                          />
                        )}
                        {activeKeyFeature === 'technology' && (
                          <Image
                            src="/assets/key-feature/streamline-plump--deepfake-technology-1-solid.png"
                            alt="Technology"
                            width={110}
                            height={110}
                            className="ml-4 mt-4"
                          />
                        )}
                        {activeKeyFeature === 'crossborder' && (
                          <Image
                            src="/assets/key-feature/solar--atom-bold.png"
                            alt="Collaboration"
                            width={110}
                            height={110}
                            className="ml-4 mt-4"
                          />
                        )}
                      </div>

                      {/* Title */}
                      <div className="absolute left-[160px] top-[80px] w-[400px] h-[34px]">
                        <h3
                          className="text-white font-medium"
                          style={{
                            fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                            fontSize: '28px',
                            lineHeight: '34px',
                            letterSpacing: '-0.02em'
                          }}
                        >
                          {activeKeyFeature === 'capacity' && t('homepage.features.capacity')}
                          {activeKeyFeature === 'mentorship' && t('homepage.features.mentorship')}
                          {activeKeyFeature === 'finance' && t('homepage.features.finance')}
                          {activeKeyFeature === 'visibility' && t('homepage.features.visibility')}
                          {activeKeyFeature === 'technology' && t('homepage.features.technology')}
                          {activeKeyFeature === 'crossborder' && t('homepage.features.crossborder')}
                        </h3>
                      </div>

                      {/* Description */}
                      <div className="absolute left-[160px] top-[130px] w-[600px] h-[220px]">
                        <div
                          className="text-white"
                          style={{
                            fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                            fontSize: '20px',
                            lineHeight: '24px',
                            letterSpacing: '-0.02em'
                          }}
                        >
                          {activeKeyFeature === 'capacity' && (
                            <ul className="space-y-3">
                              <li className="flex items-start">
                                <span className="text-white mr-2">•</span>
                                <span>{t('homepage.features.capacityDesc1')}</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-white mr-2">•</span>
                                <span>{t('homepage.features.capacityDesc2')}</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-white mr-2">•</span>
                                <span>{t('homepage.features.capacityDesc3')}</span>
                              </li>
                            </ul>
                          )}
                          {activeKeyFeature === 'mentorship' && (
                            <ul className="space-y-3">
                              <li className="flex items-start">
                                <span className="text-white mr-2">•</span>
                                <span>{t('homepage.features.mentorshipDesc1')}</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-white mr-2">•</span>
                                <span>{t('homepage.features.mentorshipDesc2')}</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-white mr-2">•</span>
                                <span>{t('homepage.features.mentorshipDesc3')}</span>
                              </li>
                            </ul>
                          )}
                          {activeKeyFeature === 'finance' && (
                            <ul className="space-y-3">
                              <li className="flex items-start">
                                <span className="text-white mr-2">•</span>
                                <span>{t('homepage.features.financeDesc1')}</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-white mr-2">•</span>
                                <span>{t('homepage.features.financeDesc2')}</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-white mr-2">•</span>
                                <span>{t('homepage.features.financeDesc3')}</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-white mr-2">•</span>
                                <span>{t('homepage.features.financeDesc4')}</span>
                              </li>
                            </ul>
                          )}
                          {activeKeyFeature === 'visibility' && (
                            <ul className="space-y-2">
                              <li className="flex items-start">
                                <span className="text-white mr-1">•</span>
                                <span>{t('homepage.features.visibilityDesc1')}</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-white mr-1">•</span>
                                <span>{t('homepage.features.visibilityDesc2')}</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-white mr-1">•</span>
                                <span>{t('homepage.features.visibilityDesc3')}</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-white mr-1">•</span>
                                <span>{t('homepage.features.visibilityDesc4')}</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-white mr-1">•</span>
                                <span>{t('homepage.features.visibilityDesc5')}</span>
                              </li>
                            </ul>
                          )}
                          {activeKeyFeature === 'technology' && (
                            <ul className="space-y-3">
                              <li className="flex items-start">
                                <span className="text-white mr-2">•</span>
                                <span>{t('homepage.features.technologyDesc1')}</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-white mr-2">•</span>
                                <span>{t('homepage.features.technologyDesc2')}</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-white mr-2">•</span>
                                <span>{t('homepage.features.technologyDesc3')}</span>
                              </li>
                            </ul>
                          )}
                          {activeKeyFeature === 'crossborder' && (
                            <ul className="space-y-3">
                              <li className="flex items-start">
                                <span className="text-white mr-2">•</span>
                                <span>{t('homepage.features.crossborderDesc1')}</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-white mr-2">•</span>
                                <span>{t('homepage.features.crossborderDesc2')}</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-white mr-2">•</span>
                                <span>{t('homepage.features.crossborderDesc3')}</span>
                              </li>
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Version */}
          <div className="md:hidden">
            <div className="text-center mb-8">
              <h2 className="text-[#653a96] mb-4 animate-on-scroll" style={{
                fontFamily: 'DM Serif Display, serif',
                fontWeight: 600,
                fontSize: '28px',
                lineHeight: '32px'
              }}>
                {t('homepage.sections.keyFeatures')}
              </h2>
            </div>

            {/* Mobile Key Features Grid - Single Column */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              {/* Mobile Feature Cards */}
              {[
                { key: 'capacity', icon: '/assets/key-feature/hat.png', title: t('homepage.features.capacity') },
                { key: 'mentorship', icon: '/assets/key-feature/laptop.png', title: t('homepage.features.mentorship') },
                { key: 'finance', icon: '/assets/key-feature/growth.png', title: t('homepage.features.finance') },
                { key: 'visibility', icon: '/assets/key-feature/gis--story-map.png', title: t('homepage.features.visibility') },
                { key: 'technology', icon: '/assets/key-feature/streamline-plump--deepfake-technology-1-solid.png', title: t('homepage.features.technology') },
                { key: 'crossborder', icon: '/assets/key-feature/solar--atom-bold.png', title: t('homepage.features.crossborder') }
              ].map((feature) => (
                <div
                  key={feature.key}
                  className="relative rounded-xl overflow-hidden h-32 cursor-pointer animate-on-scroll"
                  style={{
                    background: `linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${getFeatureImage(feature.key)}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                  onClick={() => setActiveKeyFeature(activeKeyFeature === feature.key ? null : feature.key)}
                >
                  <div className="absolute inset-0 flex items-center p-4">
                    <Image
                      src={feature.icon}
                      alt={feature.title}
                      width={32}
                      height={32}
                      className="mr-3 flex-shrink-0"
                    />
                    <h3 className="text-sm font-medium text-white">{feature.title}</h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Modal Card */}
            {activeKeyFeature && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                  className="absolute inset-0 bg-black bg-opacity-50"
                  onClick={() => setActiveKeyFeature(null)}
                ></div>

                <div className="relative w-full max-w-sm mx-auto bg-white rounded-2xl overflow-hidden shadow-2xl max-h-[80vh] overflow-y-auto">
                  <div
                    className="relative min-h-[300px]"
                    style={{
                      background: `linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${getFeatureImage(activeKeyFeature)}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>

                    {/* Close Button */}
                    <button
                      onClick={() => setActiveKeyFeature(null)}
                      className="absolute top-4 right-4 z-10 w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    {/* Icon */}
                    <div className="absolute top-4 left-4 w-16 h-16">
                      {activeKeyFeature === 'capacity' && (
                        <Image src="/assets/key-feature/hat.png" alt="Education" width={64} height={64} />
                      )}
                      {activeKeyFeature === 'mentorship' && (
                        <Image src="/assets/key-feature/laptop.png" alt="Mentor" width={64} height={64} />
                      )}
                      {activeKeyFeature === 'finance' && (
                        <Image src="/assets/key-feature/growth.png" alt="Finance" width={64} height={64} />
                      )}
                      {activeKeyFeature === 'visibility' && (
                        <Image src="/assets/key-feature/gis--story-map.png" alt="Story" width={64} height={64} />
                      )}
                      {activeKeyFeature === 'technology' && (
                        <Image src="/assets/key-feature/streamline-plump--deepfake-technology-1-solid.png" alt="Technology" width={64} height={64} />
                      )}
                      {activeKeyFeature === 'crossborder' && (
                        <Image src="/assets/key-feature/solar--atom-bold.png" alt="Collaboration" width={64} height={64} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-white font-bold text-xl mb-3">
                        {activeKeyFeature === 'capacity' && t('homepage.features.capacity')}
                        {activeKeyFeature === 'mentorship' && t('homepage.features.mentorship')}
                        {activeKeyFeature === 'finance' && t('homepage.features.finance')}
                        {activeKeyFeature === 'visibility' && t('homepage.features.visibility')}
                        {activeKeyFeature === 'technology' && t('homepage.features.technology')}
                        {activeKeyFeature === 'crossborder' && t('homepage.features.crossborder')}
                      </h3>
                      <div className="text-white text-sm leading-relaxed">
                        {activeKeyFeature === 'capacity' && (
                          <ul className="space-y-2">
                            <li>• {t('homepage.features.capacityDesc1')}</li>
                            <li>• {t('homepage.features.capacityDesc2')}</li>
                            <li>• {t('homepage.features.capacityDesc3')}</li>
                          </ul>
                        )}
                        {activeKeyFeature === 'mentorship' && (
                          <ul className="space-y-2">
                            <li>• {t('homepage.features.mentorshipDesc1')}</li>
                            <li>• {t('homepage.features.mentorshipDesc2')}</li>
                            <li>• {t('homepage.features.mentorshipDesc3')}</li>
                          </ul>
                        )}
                        {activeKeyFeature === 'finance' && (
                          <ul className="space-y-2">
                            <li>• {t('homepage.features.financeDesc1')}</li>
                            <li>• {t('homepage.features.financeDesc2')}</li>
                            <li>• {t('homepage.features.financeDesc3')}</li>
                          </ul>
                        )}
                        {activeKeyFeature === 'visibility' && (
                          <ul className="space-y-2">
                            <li>• {t('homepage.features.visibilityDesc1')}</li>
                            <li>• {t('homepage.features.visibilityDesc2')}</li>
                            <li>• {t('homepage.features.visibilityDesc3')}</li>
                          </ul>
                        )}
                        {activeKeyFeature === 'technology' && (
                          <ul className="space-y-2">
                            <li>• {t('homepage.features.technologyDesc1')}</li>
                            <li>• {t('homepage.features.technologyDesc2')}</li>
                            <li>• {t('homepage.features.technologyDesc3')}</li>
                          </ul>
                        )}
                        {activeKeyFeature === 'crossborder' && (
                          <ul className="space-y-2">
                            <li>• {t('homepage.features.crossborderDesc1')}</li>
                            <li>• {t('homepage.features.crossborderDesc2')}</li>
                            <li>• {t('homepage.features.crossborderDesc3')}</li>
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* One Platform Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          {/* Desktop Version */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10">
              {/* Text Content - Left Side */}
              <div className="order-2 lg:order-1 lg:pl-8">
                <h2 className="text-4xl lg:text-5xl font-serif text-black mb-6 animate-on-scroll">
                  <div style={{ fontFamily: 'DM Serif Display, serif', fontWeight: 500 }}>{t('homepage.sections.onePlatform')}</div>
                  <div className="text-[#653a96] font-bold" style={{ fontFamily: 'DM Serif Display, serif', fontWeight: 500 }}>{t('homepage.sections.allBusinesswomen')}</div>
                </h2>
                <p className="text-lg text-gray-800 mb-8 text-3xl animate-on-scroll"
                  style={{
                    fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                    fontWeight: 400,
                    fontSize: '18px',
                    lineHeight: '24px'
                  }}
                >
                  {t('homepage.sections.yourAIEnabledPlatform')}
                  <br /> {t('homepage.sections.scalingBusinesses')}
                </p>

                {/* Features List */}
                <div className="space-y-6 mb-8 animate-on-scroll">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-[#653a96] rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <Image
                        src="/assets/mdi_plant.png"
                        alt="Growth"
                        width={20}
                        height={20}
                        className="filter brightness-0 invert"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-3xl text-black mb-2 animate-on-scroll"
                        style={{
                          fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                          fontWeight: 500,
                          fontSize: '20px',
                          lineHeight: '24px'
                        }}
                      >{t('homepage.sections.entrepreneurialGrowth')}</h3>
                      <p className="text-sm text-gray-800 text-4xl"
                        style={{
                          fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                          fontWeight: 400,
                          fontSize: '16px',
                          lineHeight: '24px'
                        }}
                      >
                        {t('homepage.sections.accessToMentorship')}
                        <br /> {t('homepage.sections.funding')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-[#653a96] rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <Image
                        src="/assets/material-symbols_digital-wellbeing.png"
                        alt="Wellbeing"
                        width={20}
                        height={20}
                        className="filter brightness-0 invert"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-3xl text-black mb-2 animate-on-scroll"
                        style={{
                          fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                          fontWeight: 500,
                          fontSize: '20px',
                          lineHeight: '24px'
                        }}
                      >{t('homepage.sections.wealthWellBeing')}</h3>
                      <p className="text-sm text-gray-800 text-4xl"
                        style={{
                          fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                          fontWeight: 400,
                          fontSize: '16px',
                          lineHeight: '24px'
                        }}
                      >
                        {t('homepage.sections.accessPremiumRewards')}
                        <br /> {t('homepage.sections.smartInvestment')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-[#653a96] rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <Image
                        src="/assets/fluent_people-community-20-filled.png"
                        alt="Community"
                        width={20}
                        height={20}
                        className="filter brightness-0 invert"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-3xl text-black mb-2 animate-on-scroll"
                        style={{
                          fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                          fontWeight: 500,
                          fontSize: '20px',
                          lineHeight: '24px'
                        }}
                      >{t('homepage.sections.communityGlobalInfluence')}</h3>
                      <p className="text-sm text-gray-800 text-4xl"
                        style={{
                          fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                          fontWeight: 400,
                          fontSize: '16px',
                          lineHeight: '24px'
                        }}
                      >
                        {t('homepage.sections.globalNetwork')}
                        <br /> {t('homepage.sections.forums')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 animate-on-scroll">
                  <Link
                    href="/opportunities/ai-platform"
                    className="bg-[#fecb07] text-center text-sm font-bold text-3xl text-black px-8 py-3 rounded-full hover:bg-yellow-400 transition-colors duration-200 inline-flex items-center"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontWeight: 600,
                      fontSize: '16px',
                      lineHeight: '24px'
                    }}
                  >
                    {t('homepage.sections.joinWaitlist')}
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link
                    href="/opportunities/ai-platform"
                    className="text-center text-sm text-gray-800 px-8 py-3 hover:underline"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontWeight: 500,
                      fontSize: '16px',
                      lineHeight: '24px'
                    }}
                  >
                    {t('homepage.sections.explorePlatform')}
                  </Link>
                </div>
              </div>

              {/* Laptop Image - Right Side */}
              <div className="order-1 lg:order-2 lg:-mr-32 lg:pr-0">
                <div className="relative animate-on-scroll">
                  <Image
                    src="/assets/demo-mac.png"
                    alt="Platform Demo"
                    width={1400}
                    height={1050}
                    className="w-full h-auto max-w-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Version */}
          <div className="lg:hidden">
            <div className="text-center mb-8">
              <h2 className="text-black mb-4 animate-on-scroll">
                <div style={{
                  fontFamily: 'DM Serif Display, serif',
                  fontWeight: 500,
                  fontSize: '28px',
                  lineHeight: '32px'
                }}>
                  {t('homepage.sections.onePlatform')}
                </div>
                <div className="text-[#653a96] font-bold" style={{
                  fontFamily: 'DM Serif Display, serif',
                  fontWeight: 500,
                  fontSize: '24px',
                  lineHeight: '28px'
                }}>
                  {t('homepage.sections.allBusinesswomen')}
                </div>
              </h2>
              <p className="text-gray-800 mb-6 animate-on-scroll"
                style={{
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '20px'
                }}
              >
                {t('homepage.sections.yourAIEnabledPlatform')}
                <br /> {t('homepage.sections.scalingBusinesses')}
              </p>
            </div>

            {/* Mobile Features List */}
            <div className="space-y-4 mb-6 animate-on-scroll">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-[#653a96] rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  <Image
                    src="/assets/mdi_plant.png"
                    alt="Growth"
                    width={16}
                    height={16}
                    className="filter brightness-0 invert"
                  />
                </div>
                <div>
                  <h3 className="text-black mb-1 animate-on-scroll"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontWeight: 500,
                      fontSize: '16px',
                      lineHeight: '20px'
                    }}
                  >{t('homepage.sections.entrepreneurialGrowth')}</h3>
                  <p className="text-gray-800 text-sm"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '18px'
                    }}
                  >
                    {t('homepage.sections.accessToMentorship')}
                    <br /> {t('homepage.sections.funding')}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-6 h-6 bg-[#653a96] rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  <Image
                    src="/assets/material-symbols_digital-wellbeing.png"
                    alt="Wellbeing"
                    width={16}
                    height={16}
                    className="filter brightness-0 invert"
                  />
                </div>
                <div>
                  <h3 className="text-black mb-1 animate-on-scroll"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontWeight: 500,
                      fontSize: '16px',
                      lineHeight: '20px'
                    }}
                  >{t('homepage.sections.wealthWellBeing')}</h3>
                  <p className="text-gray-800 text-sm"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '18px'
                    }}
                  >
                    {t('homepage.sections.accessPremiumRewards')}
                    <br /> {t('homepage.sections.smartInvestment')}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-6 h-6 bg-[#653a96] rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  <Image
                    src="/assets/fluent_people-community-20-filled.png"
                    alt="Community"
                    width={16}
                    height={16}
                    className="filter brightness-0 invert"
                  />
                </div>
                <div>
                  <h3 className="text-black mb-1 animate-on-scroll"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontWeight: 500,
                      fontSize: '16px',
                      lineHeight: '20px'
                    }}
                  >{t('homepage.sections.communityGlobalInfluence')}</h3>
                  <p className="text-gray-800 text-sm"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '18px'
                    }}
                  >
                    {t('homepage.sections.globalNetwork')}
                    <br /> {t('homepage.sections.forums')}
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Buttons */}
            <div className="flex flex-col gap-3 animate-on-scroll">
              <Link
                href="/opportunities/ai-platform"
                className="bg-[#fecb07] text-center text-xs font-bold text-black px-4 py-2 rounded-full hover:bg-yellow-400 transition-colors duration-200 inline-flex items-center justify-center"
                style={{
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontWeight: 600,
                  fontSize: '12px',
                  lineHeight: '16px'
                }}
              >
                {t('homepage.sections.joinWaitlist')}
                <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/opportunities/ai-platform"
                className="text-center text-xs text-gray-800 px-4 py-2 hover:underline"
                style={{
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontWeight: 500,
                  fontSize: '12px',
                  lineHeight: '16px'
                }}
              >
                {t('homepage.sections.explorePlatform')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 bg-white">
        <div className="w-full px-2 sm:px-4">
          {/* Desktop Version */}
          <div className="hidden md:block">
            <div className="text-center mb-16 px-4">
              <h2 className="text-4xl lg:text-5xl font-serif text-[#653a96] mb-4 animate-on-scroll" style={{
                fontFamily: 'DM Serif Display, serif', fontWeight: 500,
                fontSize: '50px',
                lineHeight: '51px'
              }}>
                {t('homepage.sections.successStories')}
              </h2>
              <p className="text-[#653a96] mx-auto text-3xl text-lg animate-on-scroll">
                {t('homepage.sections.letCollaborate')}
              </p>
            </div>

            <div
              className="relative overflow-hidden group"
              onMouseEnter={() => setIsSuccessStoriesHovered(true)}
              onMouseLeave={() => setIsSuccessStoriesHovered(false)}
            >
              {/* Left Arrow Button */}
              <button
                onClick={() => scrollSuccessStoriesLeft(false)}
                className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-opacity duration-300 ${isSuccessStoriesHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                style={{ pointerEvents: isSuccessStoriesHovered ? 'auto' : 'none' }}
              >
                <svg className="w-6 h-6 text-[#653a96]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Right Arrow Button */}
              <button
                onClick={() => scrollSuccessStoriesRight(false)}
                className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-opacity duration-300 ${isSuccessStoriesHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                style={{ pointerEvents: isSuccessStoriesHovered ? 'auto' : 'none' }}
              >
                <svg className="w-6 h-6 text-[#653a96]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div
                ref={successStoriesScrollRefDesktop}
                className={`overflow-hidden scrollbar-hide ${isSuccessStoriesHovered ? 'overflow-x-auto' : ''}`}
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                {storiesLoading ? (
                  <div className="text-center py-12 w-full">
                    <div className="text-gray-500 text-lg">Loading success stories...</div>
                  </div>
                ) : (
                  <div className={`flex ${!isSuccessStoriesHovered ? 'animate-scroll-slow' : ''}`} style={{
                    animationPlayState: isSuccessStoriesHovered ? 'paused' : 'running'
                  }}>
                    {/* Show all success stories - duplicate for seamless loop */}
                    {[...successStories, ...successStories].map((story, index) => {
                      if (!story) {
                        return (
                          <div key={`success-${index}`} className="flex-shrink-0 w-96 mx-3">
                            <div className="bg-gray-50 rounded-3xl p-12 text-center h-full">
                              <div className="mb-12">
                                <div className="w-80 h-80 mx-auto rounded-2xl overflow-hidden mb-8 bg-gray-200"></div>
                              </div>
                              <p className="text-xl text-gray-800 mb-10 leading-relaxed">
                                {t('homepage.sections.noSuccessStories')}
                              </p>
                              <div className="text-center">
                                <h4 className="text-3xl font-medium text-black mb-4">{t('homepage.sections.comingSoon')}</h4>
                                <p className="text-xl text-gray-500">{t('homepage.sections.moreStoriesLoading')}</p>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div key={`success-${index}`} className="flex-shrink-0 w-96 mx-3">
                          <div className="bg-gray-50 rounded-3xl p-12 text-center h-full cursor-pointer" onClick={() => { window.location.href = '/about/success-stories'; }}>
                            <div className="mb-12">
                              <div className="w-80 h-80 mx-auto rounded-2xl overflow-hidden mb-8">
                                <img
                                  src={story.post_thumbnail_url || story.post_banner_url}
                                  alt={story.post_title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.src = '/assets/success-1.png';
                                  }}
                                />
                              </div>
                            </div>

                            <p className="text-xl text-gray-800 mb-10 leading-relaxed">
                              {story.post_short_desc ||
                                story.post_desc?.replace(/<[^>]*>/g, '').substring(0, 120) + '...' ||
                                t('homepage.sections.inspiringSuccessStory')}
                            </p>

                            <div className="text-center">
                              <h4 className="text-[24px] font-medium text-black mb-4">{story.post_title}</h4>
                              <p className="text-[16px] text-gray-500">
                                {story.post_designation || story.post_company || t('homepage.sections.communityMember')}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Version */}
          <div className="md:hidden">
            <div className="text-center mb-8 px-4">
              <h2 className="text-[#653a96] mb-3 animate-on-scroll" style={{
                fontFamily: 'DM Serif Display, serif',
                fontWeight: 500,
                fontSize: '28px',
                lineHeight: '32px'
              }}>
                {t('homepage.sections.successStories')}
              </h2>
              <p className="text-[#653a96] animate-on-scroll" style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '20px'
              }}>
                {t('homepage.sections.letCollaborate')}
              </p>
            </div>

            <div className="relative overflow-hidden group">
              {/* Left Arrow Button - Mobile (always visible, compact styling) */}
              <button
                onClick={() => scrollSuccessStoriesLeft(true)}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full p-3 shadow-lg border border-gray-300 hover:border-gray-400 transition-all duration-200 active:scale-95"
              >
                <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Right Arrow Button - Mobile (always visible, compact styling) */}
              <button
                onClick={() => scrollSuccessStoriesRight(true)}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full p-3 shadow-lg border border-gray-300 hover:border-gray-400 transition-all duration-200 active:scale-95"
              >
                <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div
                ref={successStoriesScrollRefMobile}
                className="overflow-x-auto scrollbar-hide"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  scrollBehavior: 'smooth'
                }}
              >
                {storiesLoading ? (
                  <div className="text-center py-8 w-full">
                    <div className="text-gray-500 text-sm">Loading success stories...</div>
                  </div>
                ) : successStories.length === 0 ? (
                  <div className="text-center py-8 w-full">
                    <div className="bg-gray-50 rounded-2xl p-6 mx-4">
                      <div className="w-48 h-48 mx-auto rounded-xl overflow-hidden mb-4 bg-gray-200"></div>
                      <p className="text-sm text-gray-800 mb-4 leading-relaxed">
                        {t('homepage.sections.noSuccessStories')}
                      </p>
                      <div className="text-center">
                        <h4 className="text-lg font-medium text-black mb-2">{t('homepage.sections.comingSoon')}</h4>
                        <p className="text-sm text-gray-500">{t('homepage.sections.moreStoriesLoading')}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex">
                    {/* Show all success stories - no duplication needed for manual scroll */}
                    {successStories.map((story, index) => (
                      <div key={`success-${index}`} className="flex-shrink-0 w-[359px] mx-2">
                        <div
                          className="bg-[#F5F5F5] rounded-[30px] overflow-hidden text-center h-full cursor-pointer"
                          style={{ padding: '30px 20px' }}
                          onClick={() => { window.location.href = '/about/success-stories'; }}
                        >
                          {/* Image Section - Full width */}
                          <div className="w-[300px] h-[300px] mx-auto rounded-[20px] overflow-hidden mb-0" style={{ marginBottom: '30px' }}>
                            {(story.post_thumbnail_url && story.post_thumbnail_url.trim() !== '') ||
                              (story.post_banner_url && story.post_banner_url.trim() !== '') ? (
                              <img
                                src={story.post_thumbnail_url || story.post_banner_url}
                                alt={story.post_title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = '/assets/success-1.png';
                                }}
                              />
                            ) : (
                              <img
                                src="/assets/success-1.png"
                                alt={story.post_title}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>

                          {/* Content - Mobile Design */}
                          <div className="p-5 md:p-6 flex flex-col items-center gap-10" style={{ gap: '40px' }}>
                            {/* Quote Section */}
                            <div className="flex gap-5 w-full">
                              <span className="text-black" style={{
                                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                                fontSize: '20px',
                                lineHeight: '27px',
                                flexShrink: 0
                              }}>"</span>
                              <p className="text-black flex-1" style={{
                                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                                fontWeight: 400,
                                fontSize: '20px',
                                lineHeight: '24px'
                              }}>
                                {story.post_short_desc ||
                                  story.post_desc?.replace(/<[^>]*>/g, '').substring(0, 120) + '...' ||
                                  t('homepage.sections.inspiringSuccessStory')}
                              </p>
                            </div>

                            {/* Name and Designation */}
                            <div className="flex flex-col items-center gap-2.5">
                              <h4 className="text-black" style={{
                                fontFamily: 'DM Serif Display, serif',
                                fontWeight: 400,
                                fontSize: '22px',
                                lineHeight: '27px'
                              }}>
                                {story.post_title}
                              </h4>
                              <p className="text-[#616161]" style={{
                                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                                fontWeight: 400,
                                fontSize: '14px',
                                lineHeight: '17px'
                              }}>
                                {story.post_designation || story.post_company || t('homepage.sections.communityMember')}
                              </p>
                            </div>
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

      </section>

      {/* Partnerships Section */}
      <section className="py-20 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {/* Desktop Version */}
          <div className="hidden md:block">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-serif text-[#653a96] mb-4 animate-on-scroll" style={{
                fontFamily: 'DM Serif Display, serif', fontWeight: 500,
                fontSize: '50px',
                lineHeight: '51px'
              }}>
                {t('homepage.sections.partnerships')}
              </h2>
              <p className="text-[#653a96] mx-auto text-3xl text-lg animate-on-scroll">
                {t('homepage.sections.backedByGlobalLeaders')}
              </p>
            </div>

            {/* Scrolling Logos - Two Rows (shown when not expanded) */}
            {!isPartnershipsExpanded && (
              <div className="space-y-4 mb-8">
                {/* Row 1 - Scrolling Left */}
                <div
                  ref={partnershipsScrollRefDesktop}
                  className={`overflow-hidden ${isPartnershipsHovered ? 'overflow-x-auto' : ''}`}
                  onMouseEnter={() => setIsPartnershipsHovered(true)}
                  onMouseLeave={() => setIsPartnershipsHovered(false)}
                  style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    scrollBehavior: 'smooth'
                  }}
                >
                  {partnershipsLoading ? (
                    <div className="text-center py-12">
                      <div className="text-gray-500 text-lg">Loading partnerships...</div>
                    </div>
                  ) : partnerships.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-gray-500 text-lg">{t('homepage.sections.noPartnerships')}</div>
                    </div>
                  ) : (
                    <div
                      className="flex"
                      style={{
                        animation: isPartnershipsHovered ? 'none' : 'partnership-scroll 20s linear infinite',
                        animationPlayState: isPartnershipsHovered ? 'paused' : 'running',
                        width: 'auto'
                      }}
                    >
                      {/* First row - first half of partnerships */}
                      {partnerships.length > 0 ? (
                        [...partnerships.slice(0, Math.ceil(partnerships.length / 2)), ...partnerships.slice(0, Math.ceil(partnerships.length / 2)), ...partnerships.slice(0, Math.ceil(partnerships.length / 2))].map((partnership, index) => {
                          const imageUrl = partnership.post_thumbnail_url || partnership.post_banner_url;

                          return (
                            <div key={`partnership-row1-${partnership.id || index}-${index}`} className="flex-shrink-0 w-48">
                              <div
                                className="bg-transparent p-4 w-48 h-32 flex items-center justify-center cursor-pointer hover:opacity-80 transition-all duration-300"
                                onClick={() => {
                                  if (partnership.post_more_link) {
                                    window.open(partnership.post_more_link, '_blank');
                                  }
                                }}
                              >
                                {imageUrl ? (
                                  <img
                                    src={imageUrl}
                                    alt={partnership.post_title || 'Partnership logo'}
                                    className="max-w-full max-h-full object-contain"
                                    onError={(e) => {
                                      e.target.src = '/assets/mdi_blog.png';
                                    }}
                                  />
                                ) : (
                                  <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center">
                                    <span className="text-gray-400 text-xs">No image</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })
                      ) : null}
                    </div>
                  )}
                </div>

                {/* Row 2 - Scrolling Right (Reverse) */}
                {partnerships.length > 0 && !partnershipsLoading && (
                  <div
                    className={`overflow-hidden ${isPartnershipsHovered ? 'overflow-x-auto' : ''}`}
                    onMouseEnter={() => setIsPartnershipsHovered(true)}
                    onMouseLeave={() => setIsPartnershipsHovered(false)}
                    style={{
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                      scrollBehavior: 'smooth'
                    }}
                  >
                    <div
                      className="flex"
                      style={{
                        animation: isPartnershipsHovered ? 'none' : 'partnership-scroll-reverse 20s linear infinite',
                        animationPlayState: isPartnershipsHovered ? 'paused' : 'running',
                        width: 'auto'
                      }}
                    >
                      {/* Second row - second half of partnerships */}
                      {[...partnerships.slice(Math.ceil(partnerships.length / 2)), ...partnerships.slice(Math.ceil(partnerships.length / 2)), ...partnerships.slice(Math.ceil(partnerships.length / 2))].map((partnership, index) => {
                        const imageUrl = partnership.post_thumbnail_url || partnership.post_banner_url;

                        return (
                          <div key={`partnership-row2-${partnership.id || index}-${index}`} className="flex-shrink-0 w-48">
                            <div
                              className="bg-transparent p-4 w-48 h-32 flex items-center justify-center cursor-pointer hover:opacity-80 transition-all duration-300"
                              onClick={() => {
                                if (partnership.post_more_link) {
                                  window.open(partnership.post_more_link, '_blank');
                                }
                              }}
                            >
                              {imageUrl ? (
                                <img
                                  src={imageUrl}
                                  alt={partnership.post_title || 'Partnership logo'}
                                  className="max-w-full max-h-full object-contain"
                                  onError={(e) => {
                                    e.target.src = '/assets/mdi_blog.png';
                                  }}
                                />
                              ) : (
                                <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center">
                                  <span className="text-gray-400 text-xs">No image</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Expanded Grid View (shown when expanded) */}
            {isPartnershipsExpanded && (
              <div className="mb-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
                <div className="grid grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                  {partnerships.map((partnership) => {
                    const imageUrl = partnership.post_thumbnail_url || partnership.post_banner_url;

                    return (
                      <div
                        key={`partnership-expanded-${partnership.id}`}
                        className="bg-gray-50 rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                        onClick={() => {
                          if (partnership.post_more_link) {
                            window.open(partnership.post_more_link, '_blank');
                          }
                        }}
                      >
                        <div className="w-full h-20 flex items-center justify-center mb-2">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={partnership.post_title || 'Partnership logo'}
                              className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.target.src = '/assets/mdi_blog.png';
                              }}
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-gray-400 text-xs">No image</span>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-700 font-medium text-center truncate group-hover:text-[#653a96] transition-colors duration-200">
                          {partnership.post_title}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* See All / Show Less Button */}
            <div className="text-center">
              <button
                onClick={() => setIsPartnershipsExpanded(!isPartnershipsExpanded)}
                className={`text-center text-sm font-bold text-black px-6 py-3 rounded-full transition-colors duration-200 inline-block shadow-lg ${isPartnershipsExpanded
                  ? 'bg-gray-400 hover:bg-gray-500 text-white'
                  : 'bg-[#fecb07] hover:bg-yellow-400'
                  }`}
              >
                {isPartnershipsExpanded ? t('common.showLess') || 'Show Less' : t('homepage.sections.seeAll')}
              </button>
            </div>
          </div>

          {/* Mobile Version */}
          <div className="md:hidden">
            <div className="text-center mb-8">
              <h2 className="text-[#653a96] mb-3 animate-on-scroll" style={{
                fontFamily: 'DM Serif Display, serif',
                fontWeight: 500,
                fontSize: '28px',
                lineHeight: '32px'
              }}>
                {t('homepage.sections.partnerships')}
              </h2>
              <p className="text-[#653a96] animate-on-scroll" style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '20px'
              }}>
                {t('homepage.sections.backedByGlobalLeaders')}
              </p>
            </div>

            {/* Scrolling Logos - Two Rows (shown when not expanded) */}
            {!isPartnershipsExpanded && (
              <div className="space-y-2 mb-6">
                {/* Row 1 - Scrolling Left */}
                <div
                  ref={partnershipsScrollRefMobile}
                  className={`overflow-hidden ${isPartnershipsHovered ? 'overflow-x-auto' : ''}`}
                  onTouchStart={() => setIsPartnershipsHovered(true)}
                  onTouchEnd={() => setTimeout(() => setIsPartnershipsHovered(false), 2000)}
                  style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    scrollBehavior: 'smooth'
                  }}
                >
                  {partnershipsLoading ? (
                    <div className="text-center py-8">
                      <div className="text-gray-500 text-sm">Loading partnerships...</div>
                    </div>
                  ) : partnerships.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-gray-500 text-sm">{t('homepage.sections.noPartnerships')}</div>
                    </div>
                  ) : (
                    <div
                      className="flex"
                      style={{
                        animation: isPartnershipsHovered ? 'none' : 'partnership-scroll 15s linear infinite',
                        animationPlayState: isPartnershipsHovered ? 'paused' : 'running',
                        width: 'auto'
                      }}
                    >
                      {/* First row - first half of partnerships */}
                      {partnerships.length > 0 ? (
                        [...partnerships.slice(0, Math.ceil(partnerships.length / 2)), ...partnerships.slice(0, Math.ceil(partnerships.length / 2)), ...partnerships.slice(0, Math.ceil(partnerships.length / 2))].map((partnership, index) => {
                          const imageUrl = partnership.post_thumbnail_url || partnership.post_banner_url;

                          return (
                            <div key={`partnership-mobile-row1-${partnership.id || index}-${index}`} className="flex-shrink-0 w-28">
                              <div
                                className="bg-transparent p-2 w-28 h-20 flex items-center justify-center cursor-pointer hover:opacity-80 transition-all duration-300"
                                onClick={() => {
                                  if (partnership.post_more_link) {
                                    window.open(partnership.post_more_link, '_blank');
                                  }
                                }}
                              >
                                {imageUrl ? (
                                  <img
                                    src={imageUrl}
                                    alt={partnership.post_title || 'Partnership logo'}
                                    className="max-w-full max-h-full object-contain rounded-lg"
                                    onError={(e) => {
                                      e.target.src = '/assets/mdi_blog.png';
                                    }}
                                  />
                                ) : (
                                  <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                                    <span className="text-gray-400 text-xs">No image</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })
                      ) : null}
                    </div>
                  )}
                </div>

                {/* Row 2 - Scrolling Right (Reverse) */}
                {partnerships.length > 0 && !partnershipsLoading && (
                  <div
                    className={`overflow-hidden ${isPartnershipsHovered ? 'overflow-x-auto' : ''}`}
                    onTouchStart={() => setIsPartnershipsHovered(true)}
                    onTouchEnd={() => setTimeout(() => setIsPartnershipsHovered(false), 2000)}
                    style={{
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                      scrollBehavior: 'smooth'
                    }}
                  >
                    <div
                      className="flex"
                      style={{
                        animation: isPartnershipsHovered ? 'none' : 'partnership-scroll-reverse 15s linear infinite',
                        animationPlayState: isPartnershipsHovered ? 'paused' : 'running',
                        width: 'auto'
                      }}
                    >
                      {/* Second row - second half of partnerships */}
                      {[...partnerships.slice(Math.ceil(partnerships.length / 2)), ...partnerships.slice(Math.ceil(partnerships.length / 2)), ...partnerships.slice(Math.ceil(partnerships.length / 2))].map((partnership, index) => {
                        const imageUrl = partnership.post_thumbnail_url || partnership.post_banner_url;

                        return (
                          <div key={`partnership-mobile-row2-${partnership.id || index}-${index}`} className="flex-shrink-0 w-28">
                            <div
                              className="bg-transparent p-2 w-28 h-20 flex items-center justify-center cursor-pointer hover:opacity-80 transition-all duration-300"
                              onClick={() => {
                                if (partnership.post_more_link) {
                                  window.open(partnership.post_more_link, '_blank');
                                }
                              }}
                            >
                              {imageUrl ? (
                                <img
                                  src={imageUrl}
                                  alt={partnership.post_title || 'Partnership logo'}
                                  className="max-w-full max-h-full object-contain rounded-lg"
                                  onError={(e) => {
                                    e.target.src = '/assets/mdi_blog.png';
                                  }}
                                />
                              ) : (
                                <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                                  <span className="text-gray-400 text-xs">No image</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Expanded Grid View (shown when expanded) */}
            {isPartnershipsExpanded && (
              <div className="mb-6 animate-in fade-in duration-500">
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {partnerships.map((partnership) => {
                    const imageUrl = partnership.post_thumbnail_url || partnership.post_banner_url;

                    return (
                      <div
                        key={`partnership-mobile-expanded-${partnership.id}`}
                        className="bg-gray-50 rounded-lg p-2 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                        onClick={() => {
                          if (partnership.post_more_link) {
                            window.open(partnership.post_more_link, '_blank');
                          }
                        }}
                      >
                        <div className="w-full h-14 flex items-center justify-center mb-1">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={partnership.post_title || 'Partnership logo'}
                              className="max-w-full max-h-full object-contain"
                              onError={(e) => {
                                e.target.src = '/assets/mdi_blog.png';
                              }}
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-gray-400 text-xs">No image</span>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-700 font-medium text-center truncate">
                          {partnership.post_title}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* See All / Show Less Button */}
            <div className="flex justify-center items-center mt-6">
              <button
                onClick={() => setIsPartnershipsExpanded(!isPartnershipsExpanded)}
                className={`text-center text-sm font-medium px-5 py-2 rounded-full transition-colors duration-200 inline-block shadow-lg whitespace-nowrap flex items-center justify-center ${isPartnershipsExpanded
                  ? 'bg-gray-400 hover:bg-gray-500 text-white'
                  : 'bg-[#fecb07] hover:bg-yellow-400 text-black'
                  }`}
                style={{
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontWeight: 500,
                  fontSize: '14px',
                  lineHeight: '18px',
                  minHeight: '32px'
                }}
              >
                {isPartnershipsExpanded ? t('common.showLess') || 'Show Less' : t('homepage.sections.seeAll')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SDGs Section */}
      <section className="py-20 bg-[#fef7e7]">
        {/* Full Width Decorative Illustration */}
        <div className="w-full mb-12">
          <Image
            src="/assets/sdg-bg.png"
            alt="Women Empowerment Illustration"
            width={2000}
            height={200}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Centered Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Version */}
          <div className="hidden md:block">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-serif text-black mb-4 animate-on-scroll" style={{
                fontFamily: 'DM Serif Display, serif', fontWeight: 500,
                fontSize: '50px',
                lineHeight: '51px'
              }}>
                {t('homepage.sections.sdgsTitle')}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 animate-on-scroll">
              {[
                { title: t('homepage.sections.sdgs.genderEquality'), image: "/assets/sdg/E_GIF_05.gif", desc: 'Achieve gender equality and empower all women and girls.' },
                { title: t('homepage.sections.sdgs.decentWork'), image: "/assets/sdg/E_GIF_08.gif", desc: 'Promote inclusive and sustainable economic growth, employment and decent work for all.' },
                { title: t('homepage.sections.sdgs.partnerships'), image: "/assets/sdg/E_GIF_17.gif", desc: 'Revitalize the global partnership for sustainable development.' },
                { title: t('homepage.sections.sdgs.reducedInequalities'), image: "/assets/sdg/E_GIF_10.gif", desc: 'Reduce inequality within and among countries.' }
              ].map((sdg, index) => (
                <div key={index} className="text-center animate-on-scroll">
                  <div className="w-56 h-56 mx-auto mb-8 rounded-xl overflow-hidden">
                    <Image
                      src={sdg.image}
                      alt={sdg.title}
                      width={224}
                      height={224}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-medium text-black mb-4 animate-on-scroll min-h-[48px]"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontWeight: 500,
                      fontSize: '20px',
                      lineHeight: '24px'
                    }}
                  >{sdg.title}</h3>
                  <p className="text-base text-gray-600 leading-relaxed animate-on-scroll pt-3">
                    {sdg.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Version */}
          <div className="md:hidden">
            <div className="text-center mb-8">
              <h2 className="text-black mb-4 animate-on-scroll" style={{
                fontFamily: 'DM Serif Display, serif',
                fontWeight: 500,
                fontSize: '28px',
                lineHeight: '32px'
              }}>
                {t('homepage.sections.sdgsTitle')}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-6 animate-on-scroll">
              {[
                { title: t('homepage.sections.sdgs.genderEquality'), image: "/assets/sdg/E_GIF_05.gif", desc: 'Achieve gender equality and empower all women and girls.' },
                { title: t('homepage.sections.sdgs.decentWork'), image: "/assets/sdg/E_GIF_08.gif", desc: 'Promote sustained, inclusive and sustainable economic growth, full and productive employment and decent work for all' },
                { title: t('homepage.sections.sdgs.partnerships'), image: "/assets/sdg/E_GIF_17.gif", desc: 'Strengthen the means of implementation and revitalize the Global Partnership for Sustainable Development' },
                { title: t('homepage.sections.sdgs.reducedInequalities'), image: "/assets/sdg/E_GIF_10.gif", desc: 'Reduce inequality within and among countries.' }
              ].map((sdg, index) => (
                <div key={index} className="text-center animate-on-scroll">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={sdg.image}
                      alt={sdg.title}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-sm font-medium text-black mb-2 animate-on-scroll min-h-[36px]"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontWeight: 500,
                      fontSize: '14px',
                      lineHeight: '18px'
                    }}
                  >{sdg.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed animate-on-scroll"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontWeight: 400,
                      fontSize: '12px',
                      lineHeight: '16px'
                    }}
                  >
                    {sdg.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-[#fef7e7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Version */}
          <div className="hidden md:block">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif text-black mb-4 animate-on-scroll" style={{
                fontFamily: 'DM Serif Display, serif', fontWeight: 500,
                fontSize: '50px',
                lineHeight: '51px'
              }}>
                {t('homepage.sections.faqsTitle')}
              </h2>
            </div>

            <div className="max-w-6xl animate-on-scroll">
              {faqQuestions.map((item, qIdx) => {
                const questionKey = `q-${qIdx}`;
                return (
                  <div key={`faq-${qIdx}`} className="mb-4 pb-5 border-b-2 border-gray-300 last:border-b-0">
                    <button
                      onClick={() => setActiveFaqQuestion(activeFaqQuestion === questionKey ? null : questionKey)}
                      className="w-full flex justify-between items-start text-left group"
                    >
                      <h3 className="text-base text-gray-800 pr-8 leading-relaxed group-hover:text-[#653a96] transition-colors duration-200" style={{
                        fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                        fontWeight: 400,
                        fontSize: '18px',
                        lineHeight: '24px'
                      }}>
                        {item.q}
                      </h3>
                      <svg className={`w-5 h-5 text-gray-400 transform transition-all duration-300 ease-in-out flex-shrink-0 group-hover:text-[#653a96] ${activeFaqQuestion === questionKey ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeFaqQuestion === questionKey ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="mt-3">
                        <div className="bg-[#fecb07] rounded-2xl p-6 transform transition-all duration-300 ease-in-out hover:shadow-lg">
                          <div className="text-black text-lg leading-relaxed">{item.a}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Version */}
          <div className="md:hidden">
            <div className="text-center mb-8">
              <h2 className="text-black mb-4 animate-on-scroll" style={{
                fontFamily: 'DM Serif Display, serif',
                fontWeight: 600,
                fontSize: '28px',
                lineHeight: '32px'
              }}>
                {t('homepage.sections.faqsTitle')}
              </h2>
            </div>

            <div className="max-w-4xl  animate-on-scroll">
              {faqQuestions.map((item, qIdx) => {
                const questionKey = `q-m-${qIdx}`;
                return (
                  <div key={`faq-m-${qIdx}`} className="mb-3 pb-4 border-b-2 border-gray-300 last:border-b-0">
                    <button onClick={() => setActiveFaqQuestion(activeFaqQuestion === questionKey ? null : questionKey)} className="w-full flex justify-between items-start text-left group">
                      <h3 className="text-sm text-gray-800 pr-4 leading-relaxed group-hover:text-[#653a96] transition-colors duration-200" style={{ fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '20px' }}>{item.q}</h3>
                      <svg className={`w-4 h-4 text-gray-400 transform transition-all duration-300 ease-in-out flex-shrink-0 group-hover:text-[#653a96] ${activeFaqQuestion === questionKey ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                    </button>
                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeFaqQuestion === questionKey ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="mt-2">
                        <div className="bg-[#fecb07] rounded-xl p-4 transform transition-all duration-300 ease-in-out hover:shadow-lg">
                          <div className="text-xs text-black leading-relaxed">{item.a}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Global Presence Section */}
      <section className="py-6 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Version */}
          <div className="hidden md:block">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-8">
              {/* Left Side - Text Content */}
              <div className="flex-1 text-center lg:text-left">
                <h2 className="text-3xl lg:text-4xl font-serif text-[#653a96] mb-2 animate-on-scroll" style={{
                  fontFamily: 'DM Serif Display, serif', fontWeight: 500,
                  fontSize: '50px',
                  lineHeight: '51px'
                }}>
                  {t('homepage.sections.globalPresence')}
                </h2>
                <p className="text-gray-800 mb-4 text-base font-medium text-3xl animate-on-scroll">
                  {t('homepage.sections.bePartOfPowerfulNetwork')}
                </p>
              </div>

              {/* Right Side - Button */}
              <div className="flex-shrink-0">
                <Link
                  href="/auth/login"
                  className="bg-[#fecb07] text-center  animate-on-scroll text-black px-6 py-2 rounded-full hover:bg-yellow-400 transition-colors duration-200 inline-block"
                  style={{
                    fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                    fontWeight: 500,
                    fontSize: '16px',
                    lineHeight: '20px'
                  }}
                >
                  {t('homepage.sections.becomeAMember')}
                </Link>
              </div>
            </div>

            {/* Interactive World Map with Circular Indicators */}
            <div className="relative mx-auto w-full max-w-4xl mb-4 mt-6 animate-on-scroll">

              {/* Circular Indicator Section */}
              <div className="flex flex-wrap justify-center gap-8 mb-16 animate-on-scroll">
                {[
                  { label: "Africa (5)", color: "bg-white", hoverColor: "bg-[#fecb07]", image: "/maps/africa.png" },
                  { label: "Asia (17)", color: "bg-white", hoverColor: "bg-[#fecb07]", image: "/maps/asia.png" },
                  { label: "Europe (13)", color: "bg-white", hoverColor: "bg-[#fecb07]", image: "/maps/europe.png" },
                  { label: "North America (11)", color: "bg-white", hoverColor: "bg-[#fecb07]", image: "/maps/north-america.png" },
                  { label: "South America (8)", color: "bg-white", hoverColor: "bg-[#fecb07]", image: "/maps/south-america.png" }
                ].map((region, index) => (
                  <button
                    key={index}
                    className="flex items-center group cursor-pointer animate-on-scroll"
                    onMouseEnter={() => setHoveredRegion(index)}
                    onMouseLeave={() => setHoveredRegion(null)}
                    onClick={() => setSelectedRegion(selectedRegion === index ? null : index)}
                  >
                    <div className={`w-4 h-4 rounded-full border border-gray-400 mr-2 transition-all duration-300 ${hoveredRegion === index ? region.hoverColor :
                      (hoveredRegion === null && selectedRegion === index) ? region.hoverColor : region.color
                      }`}></div>
                    <span
                      className="text-gray-800 group-hover:text-[#653a96] transition-colors duration-200 font-medium"
                      style={{
                        fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                        fontWeight: 500,
                        fontSize: '15px',
                        lineHeight: '20px'
                      }}
                    >
                      {region.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Dynamic World Map */}
              <div
                className="relative w-full h-96"
                onClick={(e) => {
                  // Allow clicks on location pins to pass through
                  if (e.target.closest('[data-location-pin]')) {
                    return;
                  }
                }}
              >
                {/* Show continent image on hover or click */}
                {(hoveredRegion !== null || selectedRegion !== null) ? (
                  <>
                    <Image
                      src={[
                        "/maps/africa.png",
                        "/maps/asia.png",
                        "/maps/europe.png",
                        "/maps/north-america.png",
                        "/maps/south-america.png"
                      ][hoveredRegion !== null ? hoveredRegion : selectedRegion]}
                      alt="Continent Map"
                      fill
                      className="object-contain transition-opacity duration-300"
                    />

                    {/* Location Hover Areas - Show location names on hover */}
                    {(() => {
                      const currentRegionIndex = hoveredRegion !== null ? hoveredRegion : selectedRegion;
                      const regionIds = ['africa', 'asia', 'europe', 'north-america', 'south-america'];
                      const currentRegionId = regionIds[currentRegionIndex];
                      const currentRegionData = regions.find(r => r.id === currentRegionId);

                      if (!currentRegionData) return null;

                      // Location positions for each region (percentage-based for responsiveness)
                      // Positions are adjusted to match actual location symbols on the continent images
                      const locationPositions = {
                        'africa': [
                          { name: 'Nigeria', top: '58%', left: '48%' },
                          { name: 'South Africa', top: '80%', left: '55%' },
                          { name: 'Kenya', top: '62%', left: '59%' },
                          { name: 'Tanzania', top: '68%', left: '57%' },
                          { name: 'Egypt', top: '52%', left: '54%' },
                          // { name: 'Morocco', top: '20%', left: '38%' },
                          // { name: 'Ethiopia', top: '50%', left: '61%' },
                          // { name: 'Tanzania', top: '65%', left: '58%' },
                        ],
                        'asia': [
                          { name: 'India', top: '55%', left: '67%' },
                          { name: 'China', top: '35%', left: '70%' },
                          { name: 'Japan', top: '43%', left: '81%' },
                          { name: 'Singapore', top: '60%', left: '72%' },
                          // { name: 'South Korea', top: '30%', left: '70%' },
                          { name: 'Bangladesh', top: '50%', left: '70%' },
                          // { name: 'Brunei Darussalam', top: '55%', left: '67%' },
                          { name: 'Maldives', top: '58%', left: '65%' },
                          { name: 'Myanmar', top: '50%', left: '72%' },
                          { name: 'Nepal', top: '45%', left: '70%' },
                          { name: 'Pakistan', top: '45%', left: '60%' },
                          { name: 'Philippines', top: '55%', left: '78%' },
                          { name: 'Sri Lanka', top: '60%', left: '69%' },
                          { name: 'Thailand', top: '50%', left: '75%' },
                          { name: 'Malaysia', top: '57%', left: '74%' },
                          { name: 'Indonesia', top: '68%', left: '75%' },
                          { name: 'UAE', top: '55%', left: '60%' },
                        ],
                        'europe': [
                          { name: 'United Kingdom', top: '27%', left: '54%' },
                          { name: 'Italy', top: '38%', left: '53%' },
                          { name: 'Netherlands', top: '33%', left: '52%' },
                          { name: 'Switzerland', top: '40%', left: '50%' },
                          { name: 'Poland', top: '36%', left: '56%' },
                          { name: 'Norway', top: '20%', left: '53%' },
                          { name: 'Ukraine', top: '32%', left: '60%' },
                          { name: 'Latvia', top: '32%', left: '57%' },
                          { name: 'Montenegro', top: '42%', left: '54%' },
                          { name: 'Armenia', top: '26%', left: '63%' },
                          { name: 'Israel', top: '30%', left: '62%' },
                          { name: 'Georgia', top: '35%', left: '58%' },
                          // { name: 'Russia', top: '25%', left: '70%' },
                        ],
                        'north-america': [
                          { name: 'United States', top: '35%', left: '23%' },
                          { name: 'Washington, USA', top: '28%', left: '20%' },
                          { name: 'Canada', top: '18%', left: '26%' },
                          { name: 'Mexico', top: '42%', left: '26%' },
                          { name: 'Costa Rica', top: '53%', left: '24%' },
                          { name: 'Panama', top: '55%', left: '26%' },
                          { name: 'Guatemala', top: '46%', left: '21%' },
                          { name: 'Honduras', top: '46%', left: '23%' },
                          { name: 'Nicaragua', top: '48%', left: '24%' },
                          { name: 'El Salvador', top: '50%', left: '22%' },
                          { name: 'Dominican Republic', top: '57%', left: '28%' },
                        ],
                        'south-america': [
                          { name: 'Argentina', top: '83%', left: '33%' },
                          { name: 'Chile', top: '83%', left: '35%' },
                          { name: 'Colombia', top: '70%', left: '31%' },
                          { name: 'Peru', top: '74%', left: '33%' },
                          { name: 'Ecuador', top: '68%', left: '30%' },
                          { name: 'Brazil', top: '65%', left: '32%' },
                          { name: 'Venezuela', top: '62%', left: '30%' },
                          { name: 'Uruguay', top: '80%', left: '34%' },
                        ],
                      };

                      const positions = locationPositions[currentRegionId] || [];

                      return positions.map((location, idx) => {
                        const isHovered = hoveredLocation?.name === location.name;
                        const shouldShow = !hoveredLocation || isHovered; // Show if no hover or this is the hovered one

                        return (
                          <div
                            key={`location-${idx}`}
                            data-location-pin={location.name}
                            className="absolute cursor-pointer z-20 group transition-opacity duration-200"
                            style={{
                              top: location.top,
                              left: location.left,
                              transform: 'translate(-50%, -50%)',
                              width: '20px',
                              height: '20px',
                              opacity: shouldShow ? 1 : 0,
                              pointerEvents: shouldShow ? 'auto' : 'none',
                            }}
                            onMouseEnter={() => setHoveredLocation({ name: location.name, x: location.left, y: location.top })}
                            onMouseLeave={() => setHoveredLocation(null)}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleLocationClick(location.name, e);
                            }}
                          >
                            {/* Tooltip - Black text with white background - Always on top */}
                            {isHovered && (
                              <div
                                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-0.5 bg-white rounded-full whitespace-nowrap z-30 shadow-sm flex items-center justify-center"
                                style={{
                                  pointerEvents: 'none',
                                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                                  padding: '2px 6px',
                                  left: '50%',
                                  transform: 'translateX(-50%)',
                                  bottom: '100%',
                                  marginBottom: '4px',
                                }}
                              >
                                <span className="text-black text-[10px] font-medium leading-tight">
                                  {location.name}
                                </span>
                              </div>
                            )}

                            {/* Location Pin Indicator - Smaller - Clickable area */}
                            <div
                              className="w-4 h-4 transition-all duration-200 group-hover:scale-110 flex items-center justify-center relative"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLocationClick(location.name, e);
                              }}
                              style={{ cursor: 'pointer' }}
                            >
                              <Image
                                src="/Vector.png"
                                alt={location.name}
                                width={12}
                                height={12}
                                className="w-full h-full object-contain drop-shadow-md pointer-events-none"
                              />
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </>
                ) : (
                  <Image
                    src="/assets/world/Vector.png"
                    alt="World Map"
                    fill
                    className="object-contain"
                  />
                )}

                {/* Interactive Hover Regions - Positioned to match Vector.png continents */}
                {/* Only show hover regions when showing the default world map, not when a continent is selected */}
                {hoveredRegion === null && selectedRegion === null && (
                  <>
                    {/* North America Region - Upper Left */}
                    <div
                      className="absolute top-16 left-12 w-28 h-20 cursor-pointer z-10"
                      onMouseEnter={() => setHoveredRegion(3)}
                      onMouseLeave={() => setHoveredRegion(null)}
                      onClick={() => setSelectedRegion(3)}
                    >
                    </div>

                    {/* Asia Region - Upper Center - Adjusted to not overlap with Europe */}
                    <div
                      className="absolute top-12 left-[45%] w-[30%] h-24 cursor-pointer z-10"
                      onMouseEnter={() => setHoveredRegion(1)}
                      onMouseLeave={() => setHoveredRegion(null)}
                      onClick={() => setSelectedRegion(1)}
                    >
                    </div>

                    {/* Europe Region - Upper Right - Adjusted position */}
                    <div
                      className="absolute top-20 right-12 w-24 h-18 cursor-pointer z-10"
                      onMouseEnter={() => setHoveredRegion(2)}
                      onMouseLeave={() => setHoveredRegion(null)}
                      onClick={() => setSelectedRegion(2)}
                    >
                    </div>

                    {/* Africa Region - Center Left */}
                    <div
                      className="absolute top-1/2 left-8 transform -translate-y-1/2 w-28 h-36 cursor-pointer z-10"
                      onMouseEnter={() => setHoveredRegion(0)}
                      onMouseLeave={() => setHoveredRegion(null)}
                      onClick={() => setSelectedRegion(0)}
                    >
                    </div>

                    {/* South America Region - Center Right */}
                    <div
                      className="absolute top-1/2 right-8 transform -translate-y-1/2 w-24 h-32 cursor-pointer z-10"
                      onMouseEnter={() => setHoveredRegion(5)}
                      onMouseLeave={() => setHoveredRegion(null)}
                      onClick={() => setSelectedRegion(5)}
                    >
                    </div>

                  </>
                )}

              </div>
            </div>
          </div>

          {/* Mobile Version */}
          <div className="md:hidden">
            <div className="text-center mb-8">
              <h2 className="text-[#653a96] mb-2 animate-on-scroll" style={{
                fontFamily: 'DM Serif Display, serif',
                fontWeight: 600,
                fontSize: '28px',
                lineHeight: '32px'
              }}>
                {t('homepage.sections.globalPresence')}
              </h2>
              <p className="text-gray-800 mb-6 animate-on-scroll" style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '20px'
              }}>
                {t('homepage.sections.bePartOfPowerfulNetwork')}
              </p>

              {/* Mobile Button */}
              <div className="mb-6 flex justify-center">
                <Link
                  href="/auth/login"
                  className="bg-[#fecb07] text-center animate-on-scroll text-black px-6 py-3 rounded-full hover:bg-yellow-400 transition-colors duration-200 inline-block shadow-md"
                  style={{
                    fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '18px',
                    minWidth: '160px'
                  }}
                >
                  {t('homepage.sections.becomeAMember')}
                </Link>
              </div>
            </div>

            {/* Mobile World Map */}
            <div className="relative mx-auto w-full max-w-sm h-64 mb-12 mt-6 animate-on-scroll">
              <div
                className="relative w-full h-full"
                onClick={(e) => {
                  // Close tooltip if clicking directly on the map container (not on location pins or images)
                  const target = e.target;
                  const isLocationPin = target.closest('[class*="absolute cursor-pointer z-20"]');
                  const isImage = target.tagName === 'IMG' || target.closest('img');

                  if (!isLocationPin && !isImage && target === e.currentTarget) {
                    setHoveredLocation(null);
                  }
                }}
              >
                {/* Show continent image on hover or click */}
                {(hoveredRegion !== null || selectedRegion !== null) ? (
                  <>
                    <Image
                      src={[
                        "/maps/africa.png",
                        "/maps/asia.png",
                        "/maps/europe.png",
                        "/maps/north-america.png",
                        "/maps/south-america.png"
                      ][hoveredRegion !== null ? hoveredRegion : selectedRegion]}
                      alt="Continent Map"
                      fill
                      className="object-contain transition-opacity duration-300"
                      priority
                    />

                    {/* Location Hover Areas - Mobile Version */}
                    {(() => {
                      const currentRegionIndex = hoveredRegion !== null ? hoveredRegion : selectedRegion;
                      const regionIds = ['africa', 'asia', 'europe', 'north-america', 'south-america'];
                      const currentRegionId = regionIds[currentRegionIndex];
                      const currentRegionData = regions.find(r => r.id === currentRegionId);

                      if (!currentRegionData) return null;

                      // Location positions for mobile (same as desktop)
                      const locationPositions = {
                        'africa': [
                          { name: 'Nigeria', top: '58%', left: '48%' },
                          { name: 'South Africa', top: '80%', left: '55%' },
                          { name: 'Kenya', top: '62%', left: '59%' },
                          { name: 'Tanzania', top: '68%', left: '57%' },
                          { name: 'Egypt', top: '52%', left: '54%' },
                          // { name: 'Morocco', top: '20%', left: '38%' },
                          // { name: 'Ethiopia', top: '50%', left: '61%' },
                          // { name: 'Tanzania', top: '65%', left: '58%' },
                        ],
                        'asia': [
                          { name: 'India', top: '55%', left: '67%' },
                          { name: 'China', top: '35%', left: '70%' },
                          { name: 'Japan', top: '43%', left: '81%' },
                          { name: 'Singapore', top: '60%', left: '72%' },
                          // { name: 'South Korea', top: '30%', left: '70%' },
                          { name: 'Bangladesh', top: '50%', left: '70%' },
                          // { name: 'Brunei Darussalam', top: '55%', left: '67%' },
                          { name: 'Maldives', top: '58%', left: '65%' },
                          { name: 'Myanmar', top: '50%', left: '72%' },
                          { name: 'Nepal', top: '45%', left: '70%' },
                          { name: 'Pakistan', top: '45%', left: '60%' },
                          { name: 'Philippines', top: '55%', left: '78%' },
                          { name: 'Sri Lanka', top: '60%', left: '69%' },
                          { name: 'Thailand', top: '50%', left: '75%' },
                          { name: 'Malaysia', top: '57%', left: '74%' },
                          { name: 'Indonesia', top: '68%', left: '75%' },
                          { name: 'UAE', top: '55%', left: '60%' },
                        ],
                        'europe': [
                          { name: 'United Kingdom', top: '27%', left: '54%' },
                          { name: 'Italy', top: '38%', left: '53%' },
                          { name: 'Netherlands', top: '33%', left: '52%' },
                          { name: 'Switzerland', top: '40%', left: '50%' },
                          { name: 'Poland', top: '36%', left: '56%' },
                          { name: 'Norway', top: '20%', left: '53%' },
                          { name: 'Ukraine', top: '32%', left: '60%' },
                          { name: 'Latvia', top: '32%', left: '57%' },
                          { name: 'Montenegro', top: '42%', left: '54%' },
                          { name: 'Armenia', top: '26%', left: '63%' },
                          { name: 'Israel', top: '30%', left: '62%' },
                          { name: 'Georgia', top: '35%', left: '58%' },
                          // { name: 'Russia', top: '25%', left: '70%' },
                        ],
                        'north-america': [
                          { name: 'United States', top: '35%', left: '23%' },
                          { name: 'Washington, USA', top: '28%', left: '20%' },
                          { name: 'Canada', top: '18%', left: '26%' },
                          { name: 'Mexico', top: '42%', left: '26%' },
                          { name: 'Costa Rica', top: '53%', left: '24%' },
                          { name: 'Panama', top: '55%', left: '26%' },
                          { name: 'Guatemala', top: '46%', left: '21%' },
                          { name: 'Honduras', top: '46%', left: '23%' },
                          { name: 'Nicaragua', top: '48%', left: '24%' },
                          { name: 'El Salvador', top: '50%', left: '22%' },
                          { name: 'Dominican Republic', top: '57%', left: '28%' },
                        ],
                        'south-america': [
                          { name: 'Argentina', top: '83%', left: '33%' },
                          { name: 'Chile', top: '83%', left: '35%' },
                          { name: 'Colombia', top: '70%', left: '31%' },
                          { name: 'Peru', top: '74%', left: '33%' },
                          { name: 'Ecuador', top: '68%', left: '30%' },
                          { name: 'Brazil', top: '65%', left: '32%' },
                          { name: 'Venezuela', top: '62%', left: '30%' },
                          { name: 'Uruguay', top: '80%', left: '34%' },
                        ],
                      };

                      const positions = locationPositions[currentRegionId] || [];

                      return positions.map((location, idx) => (
                        <div
                          key={`location-mobile-${idx}`}
                          className="absolute cursor-pointer z-20 group"
                          style={{
                            top: location.top,
                            left: location.left,
                            transform: 'translate(-50%, -50%)',
                            width: '24px',
                            height: '24px',
                          }}
                          onMouseEnter={() => setHoveredLocation({ name: location.name, x: location.left, y: location.top })}
                          onMouseLeave={() => setHoveredLocation(null)}
                          onClick={(e) => {
                            e.stopPropagation();
                            // Toggle: if already showing this location, hide it; otherwise show it
                            if (hoveredLocation?.name === location.name) {
                              setHoveredLocation(null);
                            } else {
                              setHoveredLocation({ name: location.name, x: location.left, y: location.top });
                            }
                          }}
                          onTouchStart={(e) => {
                            e.stopPropagation();
                            // Toggle: if already showing this location, hide it; otherwise show it
                            if (hoveredLocation?.name === location.name) {
                              setHoveredLocation(null);
                            } else {
                              setHoveredLocation({ name: location.name, x: location.left, y: location.top });
                            }
                          }}
                        >
                          {/* Tooltip - Black text with white background - Always on top - Show on click/tap */}
                          {hoveredLocation?.name === location.name && (
                            <div
                              className="absolute bg-white rounded-full whitespace-nowrap z-30 shadow-lg flex items-center justify-center border border-gray-200"
                              style={{
                                pointerEvents: 'none',
                                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                                padding: '4px 8px',
                                minWidth: '60px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                bottom: '100%',
                                marginBottom: '8px',
                              }}
                            >
                              <span className="text-black text-xs font-medium leading-tight">
                                {location.name}
                              </span>
                            </div>
                          )}

                          {/* Location Pin Indicator - Larger for mobile tap */}
                          <div className="w-4 h-4 transition-all duration-200 group-hover:scale-110 flex items-center justify-center relative">
                            <Image
                              src="/Vector.png"
                              alt={location.name}
                              width={16}
                              height={16}
                              className="w-full h-full object-contain drop-shadow-md"
                            />
                          </div>
                        </div>
                      ));
                    })()}
                  </>
                ) : (
                  <Image
                    src="/assets/world/Vector.png"
                    alt="World Map"
                    fill
                    className="object-contain"
                    priority
                  />
                )}

                {/* Mobile Interactive Hover Regions */}
                {/* Only show hover regions when showing the default world map, not when a continent is selected */}
                {hoveredRegion === null && selectedRegion === null && (
                  <>
                    {/* North America Region */}
                    <div
                      className="absolute top-8 left-6 w-16 h-12 cursor-pointer z-10"
                      onMouseEnter={() => setHoveredRegion(3)}
                      onMouseLeave={() => setHoveredRegion(null)}
                      onClick={() => setSelectedRegion(3)}
                    ></div>

                    {/* Asia Region - Adjusted to not overlap with Europe */}
                    <div
                      className="absolute top-6 left-[40%] w-[35%] h-14 cursor-pointer z-10"
                      onMouseEnter={() => setHoveredRegion(1)}
                      onMouseLeave={() => setHoveredRegion(null)}
                      onClick={() => setSelectedRegion(1)}
                    ></div>

                    {/* Europe Region - Adjusted position */}
                    <div
                      className="absolute top-10 right-6 w-14 h-12 cursor-pointer z-10"
                      onMouseEnter={() => setHoveredRegion(2)}
                      onMouseLeave={() => setHoveredRegion(null)}
                      onClick={() => setSelectedRegion(2)}
                    ></div>

                    {/* Africa Region */}
                    <div
                      className="absolute top-1/2 left-4 transform -translate-y-1/2 w-16 h-20 cursor-pointer z-10"
                      onMouseEnter={() => setHoveredRegion(0)}
                      onMouseLeave={() => setHoveredRegion(null)}
                      onClick={() => setSelectedRegion(0)}
                    ></div>

                    {/* South America Region */}
                    <div
                      className="absolute top-1/2 right-4 transform -translate-y-1/2 w-14 h-18 cursor-pointer z-10"
                      onMouseEnter={() => setHoveredRegion(5)}
                      onMouseLeave={() => setHoveredRegion(null)}
                      onClick={() => setSelectedRegion(5)}
                    ></div>

                  </>
                )}
              </div>
            </div>

            {/* Mobile Region Indicators */}
            <div className="grid grid-cols-2 gap-2 mb-6 mt-8 animate-on-scroll">
              {[
                { label: "Africa (14)", color: "bg-white", hoverColor: "bg-[#fecb07]", image: "/maps/africa.png" },
                { label: "Asia (21)", color: "bg-white", hoverColor: "bg-[#fecb07]", image: "/maps/asia.png" },
                { label: "Europe (11)", color: "bg-white", hoverColor: "bg-[#fecb07]", image: "/maps/europe.png" },
                { label: "North America (7)", color: "bg-white", hoverColor: "bg-[#fecb07]", image: "/maps/north-america.png" },
                { label: "South America (14)", color: "bg-white", hoverColor: "bg-[#fecb07]", image: "/maps/south-america.png" }
              ].map((region, index) => (
                <button
                  key={index}
                  className="flex items-center group cursor-pointer animate-on-scroll p-2 rounded-lg hover:bg-gray-50"
                  onMouseEnter={() => setHoveredRegion(index)}
                  onMouseLeave={() => setHoveredRegion(null)}
                  onClick={() => setSelectedRegion(selectedRegion === index ? null : index)}
                >
                  <div className={`w-3 h-3 rounded-full border border-gray-400 mr-2 transition-all duration-300 ${hoveredRegion === index ? region.hoverColor :
                    (hoveredRegion === null && selectedRegion === index) ? region.hoverColor : region.color
                    }`}></div>
                  <span
                    className="text-gray-800 group-hover:text-[#653a96] transition-colors duration-200 text-xs"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontWeight: 500,
                      fontSize: '11px',
                      lineHeight: '14px'
                    }}
                  >
                    {region.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}


