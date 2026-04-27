import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useLanguage } from '../../lib/LanguageContext';
import Image from 'next/image';
import Link from 'next/link';
import { usePostsByPage } from '../../lib/usePosts';
import { useRouter } from 'next/router';

export default function KnowledgeHub() {
  const { t } = useLanguage();
  const router = useRouter();
  const [heroImage, setHeroImage] = useState('');
  const [ctaImage, setCtaImage] = useState('');
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  
  // Font stack for consistent typography
  const fontFamily = 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch page images from API (only hero and cta, middle section uses static image)
  useEffect(() => {
    const fetchPageImages = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page-images`);
        if (response.ok) {
          const data = await response.json();
          const images = data.data || [];
          
          // Hero image (top)
          const heroImg = images.find(img => img.page_name === 'knowledge-hub-hero' && img.is_active);
          if (heroImg?.image_url) {
            setHeroImage(heroImg.image_url);
          }
          
          // CTA section image
          const ctaImg = images.find(img => img.page_name === 'knowledge-hub-cta' && img.is_active);
          if (ctaImg?.image_url) {
            setCtaImage(ctaImg.image_url);
          }
        }
      } catch (error) {
        console.log('Error fetching page images:', error);
      }
    };
    fetchPageImages();
  }, []);

  // Fetch events from API - matching pages/index.js
  useEffect(() => {
    const fetchEvents = async () => {
      setEventsLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`);
        if (response.ok) {
          const data = await response.json();
          console.log('Events API response:', data); // Debug log
          
          // Get all active events, sort by date, and limit to 2 (like pages/index.js)
          const allEvents = (data.data || [])
            .filter(event => {
              // Only show active events (is_active can be true, null, or undefined)
              // Don't filter by date - show all active events
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
          
          console.log('Filtered events:', allEvents); // Debug log
          setEvents(allEvents);
        } else {
          console.error('Events API response not OK:', response.status);
          setEvents([]);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]); // Set empty array on error
      } finally {
        setEventsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Fetch blogs from backend
  const { posts: rawBlogs, loading: blogsLoading } = usePostsByPage('blogs', 10);
  
  // Filter blogs with valid images and limit to 3
  const blogsWithImages = rawBlogs.filter(blog => {
    const hasThumbnail = blog.post_thumbnail_url && blog.post_thumbnail_url.trim() !== '';
    const hasBanner = blog.post_banner_url && blog.post_banner_url.trim() !== '';
    return hasThumbnail || hasBanner;
  }).slice(0, 3);

  // Fetch resources from backend
  const { posts: rawResources, loading: resourcesLoading } = usePostsByPage('resources', 10);
  
  // Limit resources to 3 (like blogs section) - show even without images
  const resourcesWithImages = rawResources.slice(0, 3);

  // Truncate description text
  const truncateText = (text, maxLength = 120) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  // Handle blog click
  const handleBlogClick = (blog) => {
    if (!blog.post_desc || blog.post_desc.trim() === '') {
      if (blog.post_register_link) {
        window.open(blog.post_register_link, '_blank');
        return;
      }
    }
    router.push(`/knowledge/blog/${blog.id}`);
  };

  // Handle resource click
  const handleResourceClick = (resource) => {
    if (resource.post_more_link && resource.post_more_link.trim() !== '') {
      window.open(resource.post_more_link, '_blank');
      return;
    }
    router.push(`/knowledge/resources/${resource.id}`);
  };

  // Handle email subscription
  const handleSubscribe = (e) => {
    e.preventDefault();
    // TODO: Implement email subscription API call
    console.log('Subscribe email:', email);
    setEmail('');
    alert('Thank you for subscribing!');
  };

  // Format date for events - matching format from pages/index.js
  const formatEventDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Layout>
      {/* Desktop Version */}
      {!isMobile && (
      <div 
        className="relative bg-white w-full overflow-hidden"
        style={{ 
          minHeight: '3328px'
        }}
      >
        {/* Hero Section 1 - Rectangle 204 */}
        <div 
          className="absolute w-full"
          style={{
            height: '750px',
            left: '0',
            top: '0',
            zIndex: 1,
            backgroundImage: heroImage 
              ? `linear-gradient(180deg, rgba(101, 58, 150, 0) 51.44%, #653A96 97.12%), url('${heroImage}')`
              : 'linear-gradient(180deg, rgba(101, 58, 150, 0) 51.44%, #653A96 97.12%)',
            backgroundSize: 'cover',
            backgroundPosition: '50% 40%',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'scroll'
          }}
        >
          {/* Frame 7944 - Text Content */}
          <div 
            className="absolute flex flex-col"
            style={{
              width: '941px',
              maxWidth: 'calc(100% - 258px)',
              left: '129px',
              top: '450px',
              gap: '10px',
              zIndex: 2
            }}
          >
            <h2 
              style={{ 
                fontFamily: fontFamily,
                fontWeight: 700,
                fontSize: '24px',
                lineHeight: '28px',
                color: '#FECB07',
                margin: 0
              }}
            >
              Knowledge Hub
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
              <h1 
                style={{ 
                  fontFamily: 'DM Serif Display, serif',
                  fontWeight: 400,
                  fontSize: '48px',
                  lineHeight: '56px',
                  color: '#FFFFFF',
                  margin: 0
                }}
              >
                Learn & Grow Together
              </h1>
            </div>
          </div>

          {/* Frame 7945 - Explore our resources link */}
          <div 
            className="absolute"
            style={{
              left: '129px',
              top: '558px',
              zIndex: 2
            }}
          >
            <Link 
              href="#resources"
              className="hover:opacity-80 transition-opacity"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span 
                style={{ 
                  fontFamily: fontFamily,
                  fontWeight: 500,
                  fontSize: '18px',
                  lineHeight: '22px',
                  letterSpacing: '-0.02em',
                  color: '#FECB07',
                  whiteSpace: 'nowrap',
                  marginTop: '6px'
                }}
              >
                Explore our resources
              </span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }} className="mt-3">
                <path d="M13.5 6L20 12M20 12L13.5 18M20 12H4" stroke="#FECB07" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>

        {/* Hero Section 2 - Rectangle 207 (touching Hero 1) - Static Image */}
        <div 
          className="absolute w-full"
          style={{
            height: '391px',
            left: '0',
            top: '650px',
            zIndex: 2,
            backgroundColor: '#D9D9D9',
            backgroundImage: 'url(/knowledge-hub.png)',
            backgroundSize: 'cover',
            backgroundPosition: '50% 40%',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'scroll'
          }}
        >
          {/* Upcoming Events Section */}
          <div 
            className="absolute flex flex-col items-center"
            style={{
              width: '664px',
              left: '50%',
              transform: 'translateX(-50%)',
              top: '50px',
              gap: '35px',
              paddingBottom: '20px'
            }}
          >
            <h2 
              style={{ 
                fontFamily: fontFamily,
                fontWeight: 500,
                fontSize: '28px',
                lineHeight: '34px',
                textAlign: 'center',
                letterSpacing: '-0.02em',
                color: '#FFFFFF',
                width: '100%'
              }}
            >
              Upcoming Events
            </h2>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'row', 
              gap: '30px', 
              width: '100%'
            }}>
              {eventsLoading ? (
                <div style={{ width: '100%', textAlign: 'center', padding: '40px', color: '#FFFFFF' }}>
                  <p style={{ fontFamily: fontFamily, color: '#FFFFFF' }}>Loading events...</p>
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
                    minWidth: '319px',
                    cursor: event.registration_link ? 'pointer' : 'default'
                  }}
                  className={event.registration_link ? 'hover:opacity-90 transition-opacity' : ''}
                >
                  <div 
                    style={{
                      width: '100%',
                      height: '160px',
                      borderRadius: '20px',
                      backgroundColor: '#D9D9D9',
                      overflow: 'hidden',
                      position: 'relative'
                    }}
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
                        fontFamily: fontFamily,
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
                        fontFamily: fontFamily,
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
                        fontFamily: fontFamily,
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
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '23px', flex: '1', minWidth: '319px' }}>
                    <div style={{ width: '100%', height: '129px', borderRadius: '20px', backgroundColor: '#D9D9D9' }} />
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px', width: '282px' }}>
                      <span style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: '16px', lineHeight: '20px', letterSpacing: '-0.02em', color: '#FFFFFF' }}>03 Dec</span>
                      <span style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: '18px', lineHeight: '22px', letterSpacing: '-0.02em', color: '#FFFFFF' }}>|</span>
                      <span style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: '16px', lineHeight: '20px', letterSpacing: '-0.02em', color: '#FFFFFF' }}>Ease of Doing Business</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '23px', flex: '1', minWidth: '319px' }}>
                    <div style={{ width: '100%', height: '129px', borderRadius: '20px', backgroundColor: '#D9D9D9' }} />
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px', width: '282px' }}>
                      <span style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: '16px', lineHeight: '20px', letterSpacing: '-0.02em', color: '#FFFFFF' }}>03 Dec</span>
                      <span style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: '18px', lineHeight: '22px', letterSpacing: '-0.02em', color: '#FFFFFF' }}>|</span>
                      <span style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: '16px', lineHeight: '20px', letterSpacing: '-0.02em', color: '#FFFFFF' }}>Ease of Doing Business</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Frame 7954 - Blogs Section */}
        <div 
          id="blogs"
          className="absolute flex flex-col"
          style={{
            width: '100%',
            left: '0',
            right: '0',
            top: '1172px',
            gap: '38px',
            padding: '0 80px'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', gap: '38px' }}>
            <h2 
              style={{ 
                fontFamily: fontFamily,
                fontWeight: 700,
                fontSize: '28px',
                lineHeight: '38px',
                color: '#000000'
              }}
            >
              Blogs
            </h2>
            <Link
              href="/knowledge/blog"
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: '10px 30px',
                gap: '12px',
                background: '#FECB07',
                borderRadius: '30px'
              }}
              className="hover:opacity-90 transition-opacity"
            >
              <span 
                style={{ 
                  fontFamily: fontFamily,
                  fontWeight: 500,
                  fontSize: '14px',
                  lineHeight: '17px',
                  color: '#171717'
                }}
              >
                Read more
              </span>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                <path d="M13.5 6L20 12M20 12L13.5 18M20 12H4" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
          {/* Frame 7953 - Blog Cards */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'row', 
            gap: '30px', 
            width: '100%', 
            justifyContent: 'space-between', 
            flexWrap: 'nowrap'
          }}>
            {blogsLoading ? (
              <div style={{ width: '100%', textAlign: 'center', padding: '40px' }}>
                <p style={{ fontFamily: fontFamily, color: '#999' }}>Loading blogs...</p>
              </div>
            ) : blogsWithImages.length > 0 ? blogsWithImages.map((blog, index) => (
              <div
                key={blog.id || index}
                onClick={() => handleBlogClick(blog)}
                className="hover:opacity-90 transition-opacity cursor-pointer"
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '30px', 
                  flex: '1', 
                  minWidth: '0'
                }}
              >
                <div 
                  style={{
                    width: '100%',
                    height: '200px',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    backgroundColor: '#D9D9D9'
                  }}
                >
                  <img
                    src={blog.post_thumbnail_url || blog.post_banner_url}
                    alt={blog.post_title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = '/assets/placeholder.jpg';
                    }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <h3 
                    style={{ 
                      fontFamily: fontFamily,
                      fontWeight: 500,
                      fontSize: '18px',
                      lineHeight: '22px',
                      letterSpacing: '-0.02em',
                      color: '#653A96'
                    }}
                  >
                    {blog.post_title || 'Blog'}
                  </h3>
                  <p 
                    style={{ 
                      fontFamily: fontFamily,
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '17px',
                      letterSpacing: '-0.02em',
                      color: '#000000'
                    }}
                  >
                    {truncateText(blog.post_short_desc || blog.post_desc || 'No description available', 120)}
                  </p>
                </div>
              </div>
            )) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', flex: '1', minWidth: '0' }}>
                  <div style={{ width: '100%', height: '200px', borderRadius: '20px', backgroundColor: '#D9D9D9' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <h3 style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: '18px', lineHeight: '22px', letterSpacing: '-0.02em', color: '#653A96' }}>Blog 1</h3>
                    <p style={{ fontFamily: fontFamily, fontWeight: 400, fontSize: '14px', lineHeight: '17px', letterSpacing: '-0.02em', color: '#000000' }}>Grameen Heroes is a flagship CSR initiative of Hero MotoCorp Ltd., implemented by ABWCI to surface, strengthen and scale rural and semi-urban women-led enterprises across India...</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', flex: '1', minWidth: '0' }}>
                  <div style={{ width: '100%', height: '200px', borderRadius: '20px', backgroundColor: '#D9D9D9' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <h3 style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: '18px', lineHeight: '22px', letterSpacing: '-0.02em', color: '#653A96' }}>Blog 2</h3>
                    <p style={{ fontFamily: fontFamily, fontWeight: 400, fontSize: '14px', lineHeight: '17px', color: '#171717' }}>WE4WE unlocked the entrepreneurial power of tribal women in Koraput, Odisha by strengthening women-led Farmer Producer Organizations (FPOs) through market linkages...</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', flex: '1', minWidth: '0' }}>
                  <div style={{ width: '100%', height: '200px', borderRadius: '20px', backgroundColor: '#D9D9D9' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <h3 style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: '18px', lineHeight: '22px', letterSpacing: '-0.02em', color: '#653A96' }}>Blog 3</h3>
                    <p style={{ fontFamily: fontFamily, fontWeight: 400, fontSize: '14px', lineHeight: '17px', letterSpacing: '-0.02em', color: '#000000' }}>The COVID-19 pandemic left thousands of women widowed overnight — emotionally shattered and suddenly responsible for sustaining their families alone...</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Frame 7955 - Resources Section */}
        <div 
          id="resources"
          className="absolute flex flex-col"
          style={{
            width: '100%',
            left: '0',
            right: '0',
            top: '1682px',
            gap: '38px',
            padding: '0 80px'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', gap: '38px' }}>
            <h2 
              style={{ 
                fontFamily: fontFamily,
                fontWeight: 700,
                fontSize: '28px',
                lineHeight: '38px',
                color: '#000000'
              }}
            >
              Country-wise curated Resources
            </h2>
            <Link
              href="/knowledge/resources"
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: '10px 30px',
                gap: '12px',
                background: '#FECB07',
                borderRadius: '30px',
                flexShrink: 0
              }}
              className="hover:opacity-90 transition-opacity"
            >
              <span 
                style={{ 
                  fontFamily: fontFamily,
                  fontWeight: 500,
                  fontSize: '14px',
                  lineHeight: '17px',
                  color: '#171717'
                }}
              >
                Check more
              </span>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                <path d="M13.5 6L20 12M20 12L13.5 18M20 12H4" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
          {/* Frame 7953 - Resource Cards */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'row', 
            gap: '30px', 
            width: '100%', 
            justifyContent: 'space-between', 
            flexWrap: 'nowrap'
          }}>
            {resourcesLoading ? (
              <div style={{ width: '100%', textAlign: 'center', padding: '40px' }}>
                <p style={{ fontFamily: fontFamily, color: '#999' }}>Loading resources...</p>
              </div>
            ) : resourcesWithImages.length > 0 ? resourcesWithImages.map((resource, index) => (
              <div
                key={resource.id || index}
                onClick={() => handleResourceClick(resource)}
                className="hover:opacity-90 transition-opacity cursor-pointer"
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '30px', 
                  flex: '1', 
                  minWidth: '0'
                }}
              >
                <div 
                  style={{
                    width: '100%',
                    height: '200px',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    backgroundColor: '#D9D9D9'
                  }}
                >
                  {(resource.post_thumbnail_url || resource.post_banner_url) ? (
                    <img
                      src={resource.post_thumbnail_url || resource.post_banner_url}
                      alt={resource.post_title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : null}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <h3 
                    style={{ 
                      fontFamily: fontFamily,
                      fontWeight: 500,
                      fontSize: '18px',
                      lineHeight: '22px',
                      letterSpacing: '-0.02em',
                      color: '#653A96'
                    }}
                  >
                    {resource.post_title || 'Resource'}
                  </h3>
                </div>
              </div>
            )) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', flex: '1', minWidth: '0' }}>
                  <div style={{ width: '100%', height: '200px', borderRadius: '20px', backgroundColor: '#D9D9D9' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <h3 style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: '18px', lineHeight: '22px', letterSpacing: '-0.02em', color: '#653A96' }}>Resources 1</h3>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', flex: '1', minWidth: '0' }}>
                  <div style={{ width: '100%', height: '200px', borderRadius: '20px', backgroundColor: '#D9D9D9' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <h3 style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: '18px', lineHeight: '22px', letterSpacing: '-0.02em', color: '#653A96' }}>Resources 2</h3>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', flex: '1', minWidth: '0' }}>
                  <div style={{ width: '100%', height: '200px', borderRadius: '20px', backgroundColor: '#D9D9D9' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <h3 style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: '18px', lineHeight: '22px', letterSpacing: '-0.02em', color: '#653A96' }}>Resources 3</h3>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Rectangle 208 - CTA Section with Image (just above footer) */}
        <div 
          className="absolute w-full"
          style={{
            height: '900px',
            left: '0',
            top: '2206px',
            backgroundImage: ctaImage 
              ? `linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url('${ctaImage}')`
              : 'linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1))',
            backgroundSize: 'cover',
            backgroundPosition: '50% 40%',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'scroll'
          }}
        >
          {/* Title Text */}
          <h2 
            style={{
              position: 'absolute',
              width: '600px',
              maxWidth: 'calc(100% - 284px)',
              left: '142px',
              top: '184px',
              fontFamily: 'DM Serif Display, serif',
              fontWeight: 400,
              fontSize: '56px',
              lineHeight: '64px',
              letterSpacing: '-0.02em',
              color: '#000000'
            }}
          >
            Get all the Knowledge you need, at one-place
          </h2>

          {/* Text Content */}
          <p 
            style={{
              position: 'absolute',
              width: '600px',
              maxWidth: 'calc(100% - 284px)',
              left: '142px',
              top: '340px',
              fontFamily: fontFamily,
              fontWeight: 400,
              fontSize: '20px',
              lineHeight: '24px',
              letterSpacing: '-0.02em',
              color: '#000000'
            }}
          >
            Never miss important updates. Stay informed with the latest templates, frameworks, and operational insights from our team.
          </p>

          {/* Email Subscription Form */}
          <div 
            style={{
              position: 'absolute',
              width: '500px',
              maxWidth: 'calc(100% - 284px)',
              left: '142px',
              top: '428px',
              display: 'flex',
              flexDirection: 'column',
              gap: '15px'
            }}
          >
            <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                <label 
                  style={{
                    fontFamily: fontFamily,
                    fontWeight: 400,
                    width: '100%',
                    fontSize: '18px',
                    lineHeight: '22px',
                    color: '#2B2D30'
                  }}
                >
                  Email address
                </label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="Email address" 
                  required 
                  style={{ 
                    width: '100%', 
                    padding: '18px 20px',
                    background: '#F5F5F5',
                    border: '1px solid #D9D9D9',
                    borderRadius: '40px',
                    fontFamily: fontFamily,
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '20px',
                    color: 'rgba(0, 0, 0, 0.4)',
                    outline: 'none'
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '18px 30px',
                  gap: '12px',
                  background: '#FECB07',
                  borderRadius: '30px',
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%'
                }}
                className="hover:opacity-90 transition-opacity"
              >
                <span 
                  style={{ 
                    fontFamily: fontFamily,
                    fontWeight: 500,
                    fontSize: '16px',
                    lineHeight: '20px',
                    color: '#171717'
                  }}
                >
                  Subscribe to Updates
                </span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                  <path d="M13.5 6L20 12M20 12L13.5 18M20 12H4" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
      )}

      {/* Mobile Version */}
      {isMobile && (
        <div 
          className="relative bg-white w-full overflow-hidden"
          style={{ 
            minHeight: 'auto'
          }}
        >
          {/* Hero Section 1 - Mobile Centered */}
          <div 
            className="w-full relative flex flex-col items-center justify-center"
            style={{
              minHeight: '700px',
              padding: '100px 20px 60px 20px',
              backgroundImage: heroImage 
                ? `linear-gradient(180deg, rgba(101, 58, 150, 0) 0%, rgba(101, 58, 150, 0) 50%, #653A96 100%), url('${heroImage}')`
                : 'linear-gradient(180deg, rgba(101, 58, 150, 0) 0%, rgba(101, 58, 150, 0) 50%, #653A96 100%)',
              backgroundSize: 'cover',
              backgroundPosition: '50% 30%',
              backgroundRepeat: 'no-repeat',
              backgroundColor: '#653A96'
            }}
          >
            {/* Text Content - Mobile Centered */}
            <div 
              className="flex flex-col items-center mt-36"
              style={{
                width: '100%',
                maxWidth: '340px',
                gap: '16px',
                textAlign: 'center'
              }}
            >
              <h2 style={{ fontFamily: fontFamily, fontWeight: 700, fontSize: '18px', lineHeight: '22px', color: '#FECB07', textAlign: 'center', width: '100%', margin: 0 }}>Knowledge Hub</h2>
              <h1 style={{ fontFamily: 'DM Serif Display, serif', fontWeight: 400, fontSize: '34px', lineHeight: '40px', color: '#FFFFFF', whiteSpace: 'normal', textAlign: 'center', width: '100%', margin: 0 }}>Learn & Grow<br/>Together</h1>
              
              {/* Explore our resources link */}
              <Link href="#resources" className="hover:opacity-80 transition-opacity" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginTop: '8px' }}>
                <span style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: '16px', lineHeight: '20px', letterSpacing: '-0.02em', color: '#FECB07', whiteSpace: 'nowrap' }}>Explore our resources</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                  <path d="M13.5 6L20 12M20 12L13.5 18M20 12H4" stroke="#FECB07" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Hero Section 2 with Upcoming Events - Mobile */}
          <div 
            className="w-full relative flex flex-col items-center justify-start" 
            style={{ 
              minHeight: '400px', 
              padding: '40px 20px',
              backgroundColor: '#D9D9D9', 
              backgroundImage: 'url(/knowledge-hub.png)', 
              backgroundSize: 'cover', 
              backgroundPosition: 'center center', 
              backgroundRepeat: 'no-repeat'
            }}
          >
            <h2 style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: '24px', lineHeight: '32px', textAlign: 'center', letterSpacing: '-0.02em', color: '#FFFFFF', width: '100%', marginBottom: '24px' }}>Upcoming Events</h2>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', width: '100%', overflowX: 'auto', scrollSnapType: 'x mandatory', paddingBottom: '10px', WebkitOverflowScrolling: 'touch' }} className="hide-scrollbar">
              {eventsLoading ? (
                <div style={{ width: '100%', textAlign: 'center', padding: '40px', color: '#FFFFFF' }}>
                  <p style={{ fontFamily: fontFamily, color: '#FFFFFF' }}>Loading events...</p>
                </div>
              ) : events.length > 0 ? events.map((event, index) => (
                <div 
                  key={event.id || index}
                  onClick={() => {
                    if (event.registration_link) {
                      window.open(event.registration_link, '_blank');
                    }
                  }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: '0 0 260px', minWidth: '260px', cursor: event.registration_link ? 'pointer' : 'default', scrollSnapAlign: 'start' }}
                  className={event.registration_link ? 'hover:opacity-90 transition-opacity' : ''}
                >
                  <div style={{ width: '100%', height: '140px', borderRadius: '16px', backgroundColor: '#D9D9D9', overflow: 'hidden', position: 'relative' }}>
                    {event.image_url ? (
                      <img src={event.image_url} alt={event.title || 'Event'} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }} onError={(e) => { e.target.style.display = 'none'; }} />
                    ) : null}
                    <div style={{ width: '100%', height: '100%', display: event.image_url ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '14px', backgroundColor: '#D9D9D9' }}>No Image</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px', width: '100%' }}>
                    <span style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: '14px', lineHeight: '18px', letterSpacing: '-0.02em', color: '#FFFFFF' }}>{formatEventDate(event.event_date)}</span>
                    <span style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: '16px', lineHeight: '20px', letterSpacing: '-0.02em', color: '#FFFFFF' }}>|</span>
                    <span style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: '14px', lineHeight: '18px', letterSpacing: '-0.02em', color: '#FFFFFF', flex: 1 }}>{event.title || 'Event'}</span>
                  </div>
                </div>
              )) : (
                <div style={{ width: '100%', textAlign: 'center', padding: '40px', color: '#FFFFFF' }}>
                  <p style={{ fontFamily: fontFamily, color: '#FFFFFF' }}>No upcoming events</p>
                </div>
              )}
            </div>
          </div>

          {/* Blogs Section - Mobile */}
          <div id="blogs" className="flex flex-col items-center px-5" style={{ width: '100%', marginTop: '40px', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <h2 style={{ fontFamily: fontFamily, fontWeight: 700, fontSize: '24px', lineHeight: '32px', color: '#000000', textAlign: 'left' }}>Blogs</h2>
              <Link href="/knowledge/blog" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '8px 16px', gap: '6px', background: '#FECB07', borderRadius: '20px' }} className="hover:opacity-90 transition-opacity">
                <span style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: '12px', lineHeight: '15px', color: '#171717', whiteSpace: 'nowrap' }}>Read more</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                  <path d="M13.5 6L20 12M20 12L13.5 18M20 12H4" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', width: '100%', overflowX: 'auto', scrollSnapType: 'x mandatory', paddingBottom: '16px', WebkitOverflowScrolling: 'touch' }} className="hide-scrollbar">
              {blogsLoading ? (
                <div style={{ width: '100%', textAlign: 'center', padding: '40px' }}>
                  <p style={{ fontFamily: fontFamily, color: '#999' }}>Loading blogs...</p>
                </div>
              ) : blogsWithImages.length > 0 ? blogsWithImages.map((blog, index) => (
                <div key={blog.id || index} onClick={() => handleBlogClick(blog)} className="hover:opacity-90 transition-opacity cursor-pointer" style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: '0 0 280px', minWidth: '280px', scrollSnapAlign: 'start' }}>
                  <div style={{ width: '100%', height: '160px', borderRadius: '16px', overflow: 'hidden', backgroundColor: '#D9D9D9' }}>
                    <img src={blog.post_thumbnail_url || blog.post_banner_url} alt={blog.post_title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.src = '/assets/placeholder.jpg'; }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                    <h3 style={{ fontFamily: fontFamily, fontWeight: 600, fontSize: '16px', lineHeight: '22px', letterSpacing: '-0.02em', color: '#653A96' }}>{blog.post_title || 'Blog'}</h3>
                    <p style={{ fontFamily: fontFamily, fontWeight: 400, fontSize: '13px', lineHeight: '18px', letterSpacing: '-0.02em', color: '#333333', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{truncateText(blog.post_short_desc || blog.post_desc || 'No description available', 100)}</p>
                  </div>
                </div>
              )) : (
                <div style={{ width: '100%', textAlign: 'center', padding: '40px' }}>
                  <p style={{ fontFamily: fontFamily, color: '#999' }}>No blogs available</p>
                </div>
              )}
            </div>
          </div>

          {/* Resources Section - Mobile */}
          <div id="resources" className="flex flex-col items-center px-5" style={{ width: '100%', marginTop: '40px', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <h2 style={{ fontFamily: fontFamily, fontWeight: 700, fontSize: '20px', lineHeight: '28px', color: '#000000', textAlign: 'left' }}>Country-wise Resources</h2>
              <Link href="/knowledge/resources" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '8px 16px', gap: '6px', background: '#FECB07', borderRadius: '20px' }} className="hover:opacity-90 transition-opacity">
                <span style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: '12px', lineHeight: '15px', color: '#171717', whiteSpace: 'nowrap' }}>Check more</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                  <path d="M13.5 6L20 12M20 12L13.5 18M20 12H4" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', width: '100%', overflowX: 'auto', scrollSnapType: 'x mandatory', paddingBottom: '16px', WebkitOverflowScrolling: 'touch' }} className="hide-scrollbar">
              {resourcesLoading ? (
                <div style={{ width: '100%', textAlign: 'center', padding: '40px' }}>
                  <p style={{ fontFamily: fontFamily, color: '#999' }}>Loading resources...</p>
                </div>
              ) : resourcesWithImages.length > 0 ? resourcesWithImages.map((resource, index) => (
                <div key={resource.id || index} onClick={() => handleResourceClick(resource)} className="hover:opacity-90 transition-opacity cursor-pointer" style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: '0 0 280px', minWidth: '280px', scrollSnapAlign: 'start' }}>
                  <div style={{ width: '100%', height: '160px', borderRadius: '16px', overflow: 'hidden', backgroundColor: '#D9D9D9' }}>
                    {(resource.post_thumbnail_url || resource.post_banner_url) ? (
                      <img src={resource.post_thumbnail_url || resource.post_banner_url} alt={resource.post_title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
                    ) : null}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                    <h3 style={{ fontFamily: fontFamily, fontWeight: 600, fontSize: '16px', lineHeight: '22px', letterSpacing: '-0.02em', color: '#653A96' }}>{resource.post_title || 'Resource'}</h3>
                  </div>
                </div>
              )) : (
                <div style={{ width: '100%', textAlign: 'center', padding: '40px' }}>
                  <p style={{ fontFamily: fontFamily, color: '#999' }}>No resources available</p>
                </div>
              )}
            </div>
          </div>

          {/* CTA Section - Mobile */}
          <div 
            className="w-full relative"
            style={{
              minHeight: '750px',
              marginTop: '40px',
              backgroundImage: ctaImage 
                ? `linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url('${ctaImage}')`
                : 'linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1))',
              backgroundSize: 'cover',
              backgroundPosition: '50% 40%',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className= "mt-4" style={{ padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <h2 className="mt-48" style={{ fontFamily: 'DM Serif Display, serif', fontWeight: 400, fontSize: '32px', lineHeight: '40px', letterSpacing: '-0.02em', color: '#000000', textAlign: 'center', width: '100%' }}>Get all the Knowledge you need, at one-place</h2>
              <p style={{ fontFamily: fontFamily, fontWeight: 400, fontSize: '16px', lineHeight: '22px', letterSpacing: '-0.02em', color: '#000000', textAlign: 'center', width: '100%' }}>Never miss important updates. Stay informed with the latest templates, frameworks, and operational insights from our team.</p>
              <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%', maxWidth: '340px', marginTop: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                  <label style={{ fontFamily: fontFamily, fontWeight: 400, width: '100%', fontSize: '16px', lineHeight: '22px', color: '#2B2D30', textAlign: 'center' }}>Email address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" required style={{ width: '100%', padding: '14px 20px', background: '#F5F5F5', border: '1px solid #D9D9D9', borderRadius: '40px', fontFamily: fontFamily, fontWeight: 400, fontSize: '14px', lineHeight: '20px', color: 'rgba(0, 0, 0, 0.4)', outline: 'none' }} />
                </div>
                <button type="submit" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: '14px 30px', gap: '12px', background: '#FECB07', borderRadius: '30px', border: 'none', cursor: 'pointer', width: '100%' }} className="hover:opacity-90 transition-opacity">
                  <span style={{ fontFamily: fontFamily, fontWeight: 500, fontSize: '14px', lineHeight: '20px', color: '#171717' }}>Subscribe to Updates</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                    <path d="M13.5 6L20 12M20 12L13.5 18M20 12H4" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
