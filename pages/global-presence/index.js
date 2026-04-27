import SimpleLayout from '../knowledge/components/SimpleLayout';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { regions, mapImages, defaultMapImage } from '../../data/global-presence-data';
import { leadersAPI } from '../../lib/api';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import { defaults as defaultInteractions } from 'ol/interaction';

// Function to get flag image from API (flagcdn) with safe fallback
const getFlagImage = (countryCode) => {
  if (!countryCode) return null;
  return `https://flagcdn.com/w80/${countryCode.toLowerCase()}.png`;
};

// Function to strip HTML tags and get plain text
const stripHtml = (html) => {
  if (!html) return '';
  // Remove HTML tags using regex
  const text = html.replace(/<[^>]*>/g, '');
  // Decode HTML entities
  const tmp = typeof document !== 'undefined' ? document.createElement('DIV') : null;
  if (tmp) {
    tmp.innerHTML = text;
    return tmp.textContent || tmp.innerText || text;
  }
  // Fallback for server-side: just remove tags
  return text.replace(/&[^;]+;/g, ' ').replace(/\s+/g, ' ').trim();
};

// Function to truncate text to a certain number of characters
const truncateText = (text, maxLength = 150) => {
  if (!text) return '';
  const plainText = stripHtml(text);
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength).trim() + '...';
};

// Region center coordinates and zoom levels for OpenLayers
const regionCoordinates = {
  'africa': { lat: 0, lng: 20, zoom: 3 },
  'asia': { lat: 30, lng: 100, zoom: 3 },
  'europe': { lat: 54, lng: 15, zoom: 4 },
  'north-america': { lat: 40, lng: -100, zoom: 3 },
  'south-america': { lat: -14, lng: -60, zoom: 3 }
};

// Helper function to map leader regions to countries
const mapLeaderRegionToCountry = (leaderRegion, designation) => {
  if (!leaderRegion) return null;
  
  const regionLower = leaderRegion.toLowerCase().trim();
  const designationLower = (designation || '').toLowerCase();
  
  // Direct country name mappings
  const countryMapping = {
    // African countries
    'nigeria': 'nigeria',
    'kenya': 'kenya',
    'south africa': 'south-africa',
    'tanzania': 'tanzania',
    'ghana': 'ghana',
    'ethiopia': 'ethiopia',
    'egypt': 'egypt',
    'morocco': 'morocco',
    'algeria': 'algeria',
    'cameroon': 'cameroon',
    'zimbabwe': 'zimbabwe',
    
    // Asian countries
    'india': 'india',
    'bangladesh': 'bangladesh',
    'nepal': 'nepal',
    'sri lanka': 'sri-lanka',
    'pakistan': 'pakistan',
    'georgia': 'georgia',
    'china': 'china',
    'japan': 'japan',
    'singapore': 'singapore',
    'malaysia': 'malaysia',
    'thailand': 'thailand',
    'indonesia': 'indonesia',
    'south korea': 'south-korea',
    'myanmar': 'myanmar',
    'brunei': 'brunei-darussalam',
    'brunei darussalam': 'brunei-darussalam',
    'philippines': 'philippines',
    'maldives': 'maldives',
    'uae': 'uae',
    'united arab emirates': 'uae',
    'emirates': 'uae',
    
    // European countries
    'united kingdom': 'united-kingdom',
    'uk': 'united-kingdom',
    'germany': 'germany',
    'france': 'france',
    'italy': 'italy',
    'spain': 'spain',
    'netherlands': 'netherlands',
    'sweden': 'sweden',
    'switzerland': 'switzerland',
    'poland': 'poland',
    'norway': 'norway',
    'ukraine': 'ukraine',
    'russia': 'russia',
    'latvia': 'latvia',
    'montenegro': 'montenegro',
    'armenia': 'armenia',
    'israel': 'israel',
    
    // North American countries
    'united states': 'united-states',
    'usa': 'united-states',
    'us': 'united-states',
    'canada': 'canada',
    'mexico': 'mexico',
    'panama': 'panama',
    'costa rica': 'costa-rica',
    'guatemala': 'guatemala',
    'honduras': 'honduras',
    'el salvador': 'el-salvador',
    'nicaragua': 'nicaragua',
    'dominican republic': 'dominican-republic',
    'ecuador': 'mexico', // Some overlap
    
    // South American countries
    'argentina': 'argentina',
    'chile': 'chile',
    'peru': 'peru',
    'colombia': 'colombia',
    'ecuador': 'ecuador',
    'brazil': 'brazil',
    
    // Indian states - map to India
    'goa': 'india',
    'haryana': 'india',
    'punjab': 'india',
    'tamil nadu': 'india',
    'delhi': 'india',
    'delhi-ncr': 'india',
    'telangana': 'india',
    'andhra pradesh': 'india',
    'rajasthan': 'india',
    'uttar pradesh': 'india',
    'northeast india': 'india',
    'bihar': 'india',
    'jharkhand': 'india',
    'maharashtra': 'india',
    'karnataka': 'india',
    'kerala': 'india',
    
    // US states - map to United States
    'washington': 'washington',
    'idaho': 'united-states',
    'texas': 'united-states',
    'florida': 'united-states',
    'washington dc': 'washington',
    'dc': 'united-states',
  };
  
  // Check for exact match first
  if (countryMapping[regionLower]) {
    return countryMapping[regionLower];
  }
  
  // Check for partial matches (more precise - only if region contains the key as a whole word)
  for (const [key, value] of Object.entries(countryMapping)) {
    // Use word boundary matching to avoid false positives
    // Check if the key appears as a whole word in the region
    const keyRegex = new RegExp(`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (keyRegex.test(regionLower)) {
      return value;
    }
  }
  
  // Regional mappings
  if (regionLower.includes('africa') || regionLower.includes('african')) {
    return 'nigeria'; // Default African country
  }
  if (regionLower.includes('asia') || regionLower.includes('asian') || regionLower.includes('south asia')) {
    return 'india'; // Default Asian country
  }
  if (regionLower.includes('europe') || regionLower.includes('european')) {
    return 'united-kingdom'; // Default European country
  }
  if (regionLower.includes('north america') || regionLower.includes('north american')) {
    return 'united-states'; // Default North American country
  }
  if (regionLower.includes('south america') || regionLower.includes('south american') || regionLower.includes('latin america')) {
    return 'brazil'; // Default South American country
  }
  if (regionLower.includes('middle east')) {
    return 'egypt'; // Default Middle East
  }
  
  return null;
};

export default function GlobalPresence() {
  const router = useRouter();
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [mapView, setMapView] = useState('map'); // 'map' or 'satellite'
  const [selectedCountry, setSelectedCountry] = useState(null);
  const mapRef = useRef(null);
  const olMapRef = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [leaders, setLeaders] = useState([]);
  const [leadersLoading, setLeadersLoading] = useState(true);
  const [leadersByCountry, setLeadersByCountry] = useState({});
  const leadersScrollRef = useRef(null);
  const [selectedLeader, setSelectedLeader] = useState(null);

  // Initialize OpenLayers map (only once)
  useEffect(() => {
    if (!mapRef.current || olMapRef.current) return;

    // Create map with default view (world view)
    const defaultRegion = { lat: 20, lng: 0, zoom: 2 };
    const center = fromLonLat([defaultRegion.lng, defaultRegion.lat]);

    // Create initial tile layer (will be updated by the update effect)
    const tileLayer = new TileLayer({
      source: new OSM()
    });

    olMapRef.current = new Map({
      target: mapRef.current,
      layers: [tileLayer],
      view: new View({
        center: center,
        zoom: defaultRegion.zoom,
        projection: 'EPSG:3857'
      }),
      // Enable default interactions (pan, zoom, pinch zoom for mobile)
      interactions: defaultInteractions({
        // Enable pinch zoom for mobile
        pinchRotate: true,
        // Enable double click zoom
        doubleClickZoom: true,
        // Enable mouse wheel zoom
        mouseWheelZoom: true,
        // Enable drag pan
        dragPan: true,
        // Enable keyboard navigation
        keyboard: true
      })
    });

    setIsMapLoaded(true);

    // Handle window resize to update map size
    const handleResize = () => {
      if (olMapRef.current) {
        setTimeout(() => {
          olMapRef.current.updateSize();
        }, 100);
      }
    };

    window.addEventListener('resize', handleResize);
    // Also trigger resize after a short delay to ensure container is rendered
    setTimeout(handleResize, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (olMapRef.current) {
        olMapRef.current.setTarget(undefined);
        olMapRef.current = null;
      }
    };
  }, []);

  // Update map when region or view changes
  useEffect(() => {
    if (!isMapLoaded || !olMapRef.current) return;

    const region = selectedRegion ? regionCoordinates[selectedRegion] : { lat: 20, lng: 0, zoom: 2 };
    const center = fromLonLat([region.lng, region.lat]);

    try {
      // Update map center and zoom
      const view = olMapRef.current.getView();
      view.animate({
        center: center,
        zoom: region.zoom,
        duration: 500
      });

      // Update tile layer based on view mode
      const currentLayer = olMapRef.current.getLayers().getArray()[0];
      const newLayer = new TileLayer({
        source: mapView === 'satellite' 
          ? new XYZ({
              url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
              attributions: '© Esri'
            })
          : new OSM()
      });

      olMapRef.current.removeLayer(currentLayer);
      olMapRef.current.addLayer(newLayer);
      
      // Update map size after layer change (important for mobile)
      setTimeout(() => {
        if (olMapRef.current) {
          olMapRef.current.updateSize();
        }
      }, 100);
    } catch (error) {
      console.error('Error updating OpenLayers map:', error);
    }
  }, [isMapLoaded, selectedRegion, mapView]);

  // Get region from URL query parameter (for navbar navigation)
  useEffect(() => {
    if (router.query.region) {
      const regionFromUrl = router.query.region;
      if (regions.find(r => r.id === regionFromUrl)) {
        setSelectedRegion(regionFromUrl);
      }
    }
  }, [router.query.region]);

  // Fetch leaders data
  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        setLeadersLoading(true);
        const response = await leadersAPI.getAll({ 
          status: 'active', 
          limit: 1000 // Get all active leaders
        });
        
        if (response.success) {
          const leadersData = response.data || [];
          
          // Filter leaders: Exclude Global Secretariat leaders (except Founders, but exclude Co-founder & Secretary General)
          // Keep: Regional & Country Presidents, Global Ambassadors, State Presidents, Founders (not Co-founder & Secretary General)
          const filteredLeaders = leadersData.filter(leader => {
            const designation = (leader.designation || '').toLowerCase();
            
            // Check if it's a Founder (but NOT Co-founder & Secretary General)
            const isCoFounder = designation.includes('co-founder') || designation.includes('co founder') || designation.includes('cofounder');
            const isFounder = designation.includes('founder') && !isCoFounder;
            
            // Check if it's Co-founder & Secretary General - exclude this
            const isCoFounderSecretaryGeneral = 
              isCoFounder &&
              (designation.includes('secretary general') || designation.includes('secretary-general'));
            
            // Keep all Founders (except Co-founder & Secretary General)
            if (isFounder && !isCoFounderSecretaryGeneral) {
              return true;
            }
            
            // Check if it's a Global Secretariat leader (excluding Founders)
            // Global Secretariat includes: chief, secretary, director, coordinator, manager, advisor, consultant, lead, strategist, affairs, officer
            const isGlobalSecretariat = 
              isCoFounderSecretaryGeneral ||
              designation.includes('chief') ||
              (designation.includes('secretary') && !designation.includes('founder')) ||
              designation.includes('director') ||
              designation.includes('coordinator') ||
              designation.includes('manager') ||
              designation.includes('advisor') ||
              designation.includes('consultant') ||
              designation.includes('lead') ||
              designation.includes('strategist') ||
              designation.includes('affairs') ||
              (designation.includes('officer') && 
               !designation.includes('country') && 
               !designation.includes('regional') && 
               !designation.includes('state'));
            
            // Exclude Global Secretariat leaders (but keep everything else)
            return !isGlobalSecretariat;
          });
          
          setLeaders(filteredLeaders);
          
          // Group leaders by country with deduplication (keep the one with most data)
          const grouped = {};
          const processedLeaders = {}; // Track processed leaders: key -> {countryId, leaderData, dataScore}
          
          // Helper function to calculate data completeness score
          const getDataScore = (leader) => {
            let score = 0;
            const email = leader.email_address ? String(leader.email_address).trim() : '';
            const linkedin = leader.linkedin ? String(leader.linkedin).trim() : '';
            const affiliations = leader.affiliations ? String(leader.affiliations).trim() : '';
            const bio = leader.bio ? String(leader.bio).trim() : '';
            
            if (email.length > 0) score += 10;
            if (linkedin.length > 0) score += 10;
            if (affiliations.length > 0) score += 5;
            if (bio.length > 0) score += 5;
            if (leader.image) score += 5;
            if (leader.region) score += 5;
            
            return score;
          };
          
          filteredLeaders.forEach(leader => {
            // Create a unique key for deduplication: use ID if available, otherwise use normalized name
            const leaderKey = leader.id 
              ? `id_${leader.id}` 
              : `name_${(leader.name || '').toLowerCase().trim().replace(/\s+/g, ' ')}`;
            
            // Try to get country ID from region, or try to infer from designation if region is null
            let countryId = null;
            const designationLower = (leader.designation || '').toLowerCase();
            const isFounder = designationLower.includes('founder') && 
                             !designationLower.includes('co-founder') && 
                             !designationLower.includes('co founder') && 
                             !designationLower.includes('cofounder');
            
            if (leader.region) {
              countryId = mapLeaderRegionToCountry(leader.region, leader.designation);
            } else {
              // If no region, try to infer from designation
              if (designationLower.includes('india') || designationLower.includes('indian')) {
                countryId = 'india';
              } else if (designationLower.includes('usa') || designationLower.includes('united states') || designationLower.includes('us ')) {
                countryId = 'united-states';
              } else if (designationLower.includes('uk') || designationLower.includes('united kingdom') || designationLower.includes('british')) {
                countryId = 'united-kingdom';
              } else if (designationLower.includes('canada') || designationLower.includes('canadian')) {
                countryId = 'canada';
              } else if (designationLower.includes('australia') || designationLower.includes('australian')) {
                countryId = 'australia';
              } else if (designationLower.includes('argentina') || designationLower.includes('argentinian')) {
                countryId = 'argentina';
              } else if (designationLower.includes('brazil') || designationLower.includes('brazilian')) {
                countryId = 'brazil';
              } else if (designationLower.includes('global') || designationLower.includes('international')) {
                countryId = 'india';
              } else if (isFounder) {
                // For founders without a specific country, default to India (main headquarters)
                countryId = 'india';
              } else {
                // Don't assign a default country if we can't determine it
                countryId = null;
              }
            }
            
            // If still no country ID but it's a founder, assign to India as fallback
            if (!countryId && isFounder) {
              countryId = 'india';
            }
            
            // If we have a country ID, process the leader
            // IMPORTANT: Only process each leader once - use the first valid country mapping
            if (countryId && !processedLeaders[leaderKey]) {
              // Explicitly extract email_address and linkedin to ensure they're included
              const emailAddress = leader.email_address !== undefined && leader.email_address !== null 
                ? String(leader.email_address).trim() 
                : '';
              const linkedIn = leader.linkedin !== undefined && leader.linkedin !== null 
                ? String(leader.linkedin).trim() 
                : '';
              
              const leaderData = {
                id: leader.id,
                name: leader.name,
                designation: leader.designation,
                image: leader.image_url || leader.image || '/assets/default-avatar.png',
                linkedin: linkedIn,
                email: emailAddress,
                affiliations: leader.affiliations || '',
                bio: leader.bio || ''
              };
              
              const currentScore = getDataScore(leader);
              
              // First time seeing this leader, add it
              // We already checked !processedLeaders[leaderKey] above, so this is guaranteed to be first occurrence
              if (!grouped[countryId]) {
                grouped[countryId] = [];
              }
              grouped[countryId].push(leaderData);
              
              // Mark this leader as processed to prevent duplicates
              processedLeaders[leaderKey] = {
                countryId,
                leaderData,
                score: currentScore
              };
            }
          });
          
          setLeadersByCountry(grouped);
        }
      } catch (error) {
        console.error('Error fetching leaders:', error);
      } finally {
        setLeadersLoading(false);
      }
    };
    
    fetchLeaders();
  }, []);

  // Auto-select first country with leaders when region changes
  useEffect(() => {
    if (selectedRegion && !selectedCountry && !leadersLoading) {
      const currentRegion = regions.find(r => r.id === selectedRegion);
      if (currentRegion && currentRegion.countries.length > 0) {
        // Sort countries: those with leaders first
        const sortedCountries = [...currentRegion.countries].sort((a, b) => {
          const aCount = leadersByCountry[a.id]?.length || 0;
          const bCount = leadersByCountry[b.id]?.length || 0;
          
          // Countries with leaders come first
          if (aCount > 0 && bCount === 0) return -1;
          if (aCount === 0 && bCount > 0) return 1;
          
          // If both have leaders or both don't, sort by count (descending)
          return bCount - aCount;
        });
        
        // Select the first country (which will be the first one with leaders if any exist)
        if (sortedCountries.length > 0) {
          setSelectedCountry(sortedCountries[0]);
        }
      }
    }
  }, [selectedRegion, selectedCountry, leadersLoading, leadersByCountry]);

  const handleRegionChange = (regionId) => {
    setSelectedRegion(regionId);
    setSelectedCountry(null); // Reset country selection when region changes
  };

  const handleCountryClick = (country) => {
    setSelectedCountry(country);
    // Reset scroll position when country changes
    if (leadersScrollRef.current) {
      leadersScrollRef.current.scrollLeft = 0;
    }
  };

  const scrollLeaders = (direction) => {
    if (leadersScrollRef.current) {
      // Calculate card width dynamically from the first card
      const firstCard = leadersScrollRef.current.querySelector('.leader-card');
      if (!firstCard) return;
      
      const cardWidth = firstCard.offsetWidth;
      const gap = window.innerWidth < 640 ? 16 : 24; // space-x-4 on mobile, space-x-6 on desktop
      const scrollAmount = cardWidth + gap; // Scroll by one card width + gap
      const currentScroll = leadersScrollRef.current.scrollLeft;
      const maxScroll = leadersScrollRef.current.scrollWidth - leadersScrollRef.current.clientWidth;
      
      if (direction === 'right' && currentScroll < maxScroll) {
        leadersScrollRef.current.scrollBy({
          left: scrollAmount,
          behavior: 'smooth'
        });
      } else if (direction === 'left' && currentScroll > 0) {
        leadersScrollRef.current.scrollBy({
          left: -scrollAmount,
          behavior: 'smooth'
        });
      }
    }
  };

  const currentRegion = regions.find(r => r.id === selectedRegion);

  // Get all countries and sort them: countries with leaders first, then by leader count
  const allCountries = currentRegion 
    ? [...currentRegion.countries].sort((a, b) => {
        const aCount = leadersByCountry[a.id]?.length || 0;
        const bCount = leadersByCountry[b.id]?.length || 0;
        
        // Countries with leaders come first
        if (aCount > 0 && bCount === 0) return -1;
        if (aCount === 0 && bCount > 0) return 1;
        
        // If both have leaders or both don't, sort by count (descending)
        return bCount - aCount;
      })
    : [];

  return (
    <SimpleLayout title="Global Presence">
      <div className="p-2 sm:p-4 md:p-6 lg:pt-4 lg:px-8 lg:pb-8 pb-6 sm:pb-12 lg:pb-16 xl:pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-4 sm:mb-6 lg:mb-6">

            {/* Go Back Button and Breadcrumb - Same line on desktop */}
            <div className="relative flex flex-col sm:flex-row sm:items-center mb-2 sm:mb-4 lg:mb-4">
              {/* Go Back Button */}
              <div className="w-full sm:w-auto mb-2 sm:mb-0 sm:absolute sm:left-0">
                <button 
                  onClick={() => window.history.back()}
                  className="flex items-center space-x-2 sm:space-x-3 text-gray-700 active:text-[#653a96] hover:text-[#653a96] transition-all duration-300 touch-manipulation"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="text-sm sm:text-base lg:text-lg font-medium">Go back</span>
                </button>
              </div>

              {/* Breadcrumb - Hidden on mobile, centered on desktop */}
              <div className="hidden md:block text-sm sm:text-base w-full text-center" 
              style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontWeight: 400,
                lineHeight: '24px',
              }}
              >
                <nav className="flex items-center justify-center space-x-2 whitespace-nowrap overflow-hidden" aria-label="Breadcrumb">
                  <Link 
                    href="/" 
                    className="text-gray-600 hover:text-[#653a96] transition-colors duration-200 flex-shrink-0"
                  >
                    Home
                  </Link>
                  <span className="text-gray-400 flex-shrink-0" aria-hidden="true">&gt;</span>
                  <span className="text-gray-800 font-medium truncate" aria-current="page" title="Global Presence">
                    Global Presence
                  </span>
                </nav>
              </div>
            </div>

            {/* Page Title with Globe Icon */}
            <div className="flex items-center justify-center mb-3 sm:mb-4 lg:mb-5">
              <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
                <div className="w-7 h-7 sm:w-9 sm:h-9 lg:w-12 lg:h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Image 
                    src="/assets/fluent-mdl2_world.png" 
                    alt="Global Presence" 
                    width={48} 
                    height={48}
                    className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8"
                  />
                </div>
                <h1 
                  className="text-gray-800"
                  style={{
                    fontFamily: 'DM Serif Display, serif',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: 'clamp(20px, 5vw, 42px)',
                    lineHeight: 'clamp(24px, 6vw, 58px)'
                  }}
                >
                  Global Presence
                </h1>
              </div>
            </div>
          </div>

          {/* Map/Satellite Toggle */}
          <div className="flex justify-center mb-0 sm:mb-0 sm:justify-end sm:mr-10 lg:mb-0">
            <div className="flex border-2 border-gray-100 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => setMapView('map')}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-medium border-r-2 border-gray-100 transition-colors duration-200 touch-manipulation ${
                  mapView === 'map' 
                    ? 'bg-[#fecb07] text-gray-800 ' 
                    : 'bg-white text-gray-800 active:bg-gray-50'
                }`}
                aria-label="Switch to map view"
              >
                Map
              </button>
              <button
                onClick={() => setMapView('satellite')}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-colors duration-200 touch-manipulation ${
                  mapView === 'satellite' 
                    ? 'bg-[#fecb07] text-gray-800' 
                    : 'bg-white text-gray-800 active:bg-gray-50'
                }`}
                aria-label="Switch to satellite view"
              >
                Satellite
              </button>
            </div>
          </div>

          {/* Map Section */}
          <div className="mb-3 sm:mb-5 lg:mb-6">
            <div className="relative w-full h-48 sm:h-64 md:h-72 lg:h-80 rounded-lg sm:rounded-2xl lg:rounded-3xl overflow-hidden border border-gray-300 sm:border-2 shadow-md">
              {!isMapLoaded && (
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center z-10">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-[#653a96] mx-auto mb-2"></div>
                    <p className="text-xs sm:text-sm text-gray-600">Loading map...</p>
                  </div>
                </div>
              )}
              <div 
                ref={mapRef} 
                className="w-full h-full" 
                style={{ 
                  minHeight: '224px',
                  touchAction: 'none' // Prevent default touch behaviors for better map interaction
                }} 
              />
            </div>
          </div>

          {/* Region Radio Buttons */}
          <div className="mt-3 sm:mt-5 lg:mt-6 mb-4 sm:mb-8 lg:mb-10 w-full">
            <style dangerouslySetInnerHTML={{__html: `
              input[type="radio"][name="region"] {
                -webkit-appearance: none !important;
                -moz-appearance: none !important;
                appearance: none !important;
                width: 1rem !important;
                height: 1rem !important;
                cursor: pointer !important;
                border: 2px solid #d1d5db !important;
                border-radius: 50% !important;
                background-color: white !important;
              }
              input[type="radio"][name="region"]:checked {
                border-color: #fecb07 !important;
                background-color: #fecb07 !important;
              }
              @media (min-width: 640px) {
                input[type="radio"][name="region"] {
                  width: 1.25rem !important;
                  height: 1.25rem !important;
                }
              }
              @media (min-width: 1024px) {
                input[type="radio"][name="region"] {
                  width: 1.375rem !important;
                  height: 1.375rem !important;
                }
              }
            `}} />
            <div className="flex flex-wrap gap-2 sm:gap-6 lg:gap-8 xl:gap-10 justify-center px-1 sm:px-6 lg:px-8 w-full">
              {regions.map((region) => (
                <label
                  key={region.id}
                  className="flex items-center space-x-1.5 sm:space-x-2.5 lg:space-x-3 cursor-pointer transition-all duration-200 touch-manipulation"
                >
                  <input
                    type="radio"
                    name="region"
                    value={region.id}
                    checked={selectedRegion === region.id}
                    onChange={() => handleRegionChange(region.id)}
                    className="cursor-pointer"
                  />
                  <span className="text-[11px] sm:text-sm lg:text-base xl:text-lg font-medium text-gray-800 whitespace-nowrap">
                    {region.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Main Content - Sidebar Layout */}
          {currentRegion && (
            <div className="flex flex-col lg:flex-row gap-3 sm:gap-6 lg:gap-8">
              {/* Left Sidebar - Countries List */}
              <div className="w-full lg:w-80 bg-gray-50 rounded-lg sm:rounded-2xl p-2 sm:p-4 lg:p-6 shadow-sm">
                <h2 className="text-sm sm:text-base lg:text-xl font-medium text-gray-800 mb-3 sm:mb-4 lg:mb-6">
                  Countries in {currentRegion.name}
                  {allCountries.length > 0 && (
                    <span className="text-xs sm:text-sm text-gray-500 font-normal ml-1 sm:ml-2">
                      ({allCountries.length} {allCountries.length === 1 ? 'country' : 'countries'})
                    </span>
                  )}
                </h2>
                {leadersLoading ? (
                  <div className="flex items-center justify-center py-6 sm:py-8">
                    <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-[#653a96]"></div>
                  </div>
                ) : allCountries.length > 0 ? (
                  <div className="max-h-48 sm:max-h-80 lg:max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 -webkit-overflow-scrolling-touch">
                    <div className="space-y-1.5 sm:space-y-2 pr-1 sm:pr-2">
                      {allCountries.map((country) => {
                        const leaderCount = leadersByCountry[country.id]?.length || 0;
                        return (
                          <div
                            key={country.id}
                            onClick={() => handleCountryClick(country)}
                            className={`flex items-center justify-between space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg cursor-pointer transition-all duration-200 touch-manipulation active:scale-[0.98] ${
                              selectedCountry?.id === country.id
                                ? 'bg-[#653a96] text-white shadow-md'
                                : 'bg-white hover:bg-gray-200 active:bg-gray-300'
                            }`}
                          >
                            <div className="flex items-center space-x-1.5 sm:space-x-3 flex-1 min-w-0">
                              <div className="flex-shrink-0">
                                <Image
                                  src={getFlagImage(country.code)}
                                  alt={`${country.name} flag`}
                                  width={20}
                                  height={15}
                                  className="w-4 h-3 sm:w-6 sm:h-5 rounded-sm"
                                  onError={(e) => {
                                    // Fallback to emoji flag if API image fails
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'block';
                                  }}
                                />
                                <span className="text-lg hidden">{country.flag}</span>
                              </div>
                              <span className="text-xs sm:text-sm font-medium truncate">{country.name}</span>
                            </div>
                            <span className={`text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded-full flex-shrink-0 ${
                              selectedCountry?.id === country.id
                                ? 'bg-white/20 text-white'
                                : leaderCount > 0 
                                  ? 'bg-gray-200 text-gray-600'
                                  : 'bg-gray-100 text-gray-400'
                            }`}>
                              {leaderCount}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-sm">No countries available in this region</p>
                  </div>
                )}
              </div>

              {/* Right Content - Profile Cards */}
              <div className="flex-1 w-full min-w-0">
                {selectedCountry && (
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6 flex-wrap gap-2">
                      <h3 className="text-sm sm:text-base lg:text-xl font-medium text-gray-800">
                        Point of Contact
                      </h3>
                      {!leadersLoading && leadersByCountry[selectedCountry.id] && leadersByCountry[selectedCountry.id].length > 0 && (
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <button
                            onClick={() => scrollLeaders('left')}
                            className="p-2 sm:p-2.5 rounded-lg bg-gray-100 active:bg-gray-200 hover:bg-gray-200 transition-colors touch-manipulation"
                            aria-label="Scroll left"
                          >
                            <svg className="w-5 h-5 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => scrollLeaders('right')}
                            className="p-2 sm:p-2.5 rounded-lg bg-gray-100 active:bg-gray-200 hover:bg-gray-200 transition-colors touch-manipulation"
                            aria-label="Scroll right"
                          >
                            <svg className="w-5 h-5 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                    {leadersLoading ? (
                      <div className="flex items-center justify-center py-8 sm:py-12">
                        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-[#653a96]"></div>
                        <span className="ml-3 text-sm sm:text-base text-gray-600">Loading leaders...</span>
                      </div>
                    ) : selectedCountry && leadersByCountry[selectedCountry.id] && leadersByCountry[selectedCountry.id].length > 0 ? (
                      <div className="relative w-full overflow-hidden">
                        <style dangerouslySetInnerHTML={{__html: `
                          .leaders-scroll-container {
                            scroll-snap-type: x mandatory;
                            display: flex !important;
                            width: 100% !important;
                            max-width: 100% !important;
                            box-sizing: border-box !important;
                            overflow-x: auto !important;
                            -webkit-overflow-scrolling: touch !important;
                            scrollbar-width: none !important;
                            -ms-overflow-style: none !important;
                          }
                          .leaders-scroll-container::-webkit-scrollbar {
                            display: none !important;
                          }
                          .leader-card {
                            box-sizing: border-box !important;
                            flex-shrink: 0 !important;
                            width: calc(100% - 1rem) !important;
                            min-width: calc(100% - 1rem) !important;
                            max-width: calc(100% - 1rem) !important;
                            flex: 0 0 calc(100% - 1rem) !important;
                            scroll-snap-align: start;
                          }
                          @media (min-width: 640px) {
                            .leader-card {
                              width: calc((100% - 2rem) / 2) !important;
                              min-width: calc((100% - 2rem) / 2) !important;
                              max-width: calc((100% - 2rem) / 2) !important;
                              flex: 0 0 calc((100% - 2rem) / 2) !important;
                            }
                          }
                          @media (min-width: 1024px) {
                            .leader-card {
                              width: calc((100% - 3rem) / 3) !important;
                              min-width: calc((100% - 3rem) / 3) !important;
                              max-width: calc((100% - 3rem) / 3) !important;
                              flex: 0 0 calc((100% - 3rem) / 3) !important;
                            }
                          }
                        `}} />
                        <div
                          ref={leadersScrollRef}
                          className="flex space-x-2 sm:space-x-6 overflow-x-auto scrollbar-hide pb-4 leaders-scroll-container"
                          style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                            WebkitOverflowScrolling: 'touch',
                          }}
                        >
                          {leadersByCountry[selectedCountry.id].map((profile) => (
                            <div
                              key={profile.id}
                              onClick={() => setSelectedLeader(profile)}
                              className="bg-white rounded-lg sm:rounded-2xl p-2.5 sm:p-4 lg:p-6 border border-gray-200 leader-card shadow-sm cursor-pointer hover:shadow-md transition-shadow duration-200"
                              style={{
                                height: 'auto',
                                minHeight: '300px',
                                maxHeight: '480px',
                                boxSizing: 'border-box',
                                display: 'flex',
                                flexDirection: 'column'
                              }}
                            >
                              <div className="flex-1 flex flex-col overflow-hidden">
                                <div className="text-center mb-2 sm:mb-4 flex-shrink-0">
                                  <div className="w-12 h-12 sm:w-20 sm:h-20 mx-auto mb-1.5 sm:mb-4 rounded-full overflow-hidden bg-gray-100">
                                    <Image
                                      src={profile.image}
                                      alt={profile.name}
                                      width={80}
                                      height={80}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.target.src = '/assets/default-avatar.png';
                                      }}
                                    />
                                  </div>
                                  <h4 className="text-sm sm:text-lg font-medium text-gray-800 mb-1 sm:mb-2">{profile.name}</h4>
                                  <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">{profile.designation}</p>
                                </div>
                                {profile.bio && (
                                  <p 
                                    className="text-xs sm:text-sm text-gray-500 mb-3 px-2 text-left leading-relaxed flex-1 overflow-hidden"
                                    style={{
                                      wordWrap: 'break-word',
                                      overflowWrap: 'break-word',
                                      display: '-webkit-box',
                                      WebkitLineClamp: 4,
                                      WebkitBoxOrient: 'vertical',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis'
                                    }}
                                  >
                                    {truncateText(profile.bio, 150)}
                                  </p>
                                )}
                                {profile.affiliations && (
                                  <div className="mb-3 px-2">
                                    <p className="text-xs text-gray-400 mb-1 font-medium">Affiliation(s):</p>
                                    <p 
                                      className="text-xs sm:text-sm text-gray-600 leading-relaxed"
                                      style={{
                                        wordWrap: 'break-word',
                                        overflowWrap: 'break-word',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                      }}
                                    >
                                      {profile.affiliations}
                                    </p>
                                  </div>
                                )}
                              </div>
                              <div 
                                className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:space-x-3 mt-auto pt-3 border-t border-gray-100 flex-shrink-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {(() => {
                                  const linkedInValue = profile.linkedin ? String(profile.linkedin).trim() : '';
                                  const emailValue = profile.email ? String(profile.email).trim() : '';
                                  const hasLinkedIn = linkedInValue.length > 0;
                                  const hasEmail = emailValue.length > 0;
                                  
                                  if (!hasLinkedIn && !hasEmail) {
                                    return (
                                      <span className="text-xs text-gray-400 text-center px-2">Contact information not available</span>
                                    );
                                  }
                                  
                                  return (
                                    <>
                                      {hasLinkedIn && (
                                        <a
                                          href={linkedInValue}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center space-x-1 sm:space-x-2 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-white text-gray-800 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 text-xs sm:text-sm w-full sm:w-auto justify-center"
                                        >
                                          <Image src="/assets/linkedin.png" alt="LinkedIn" width={14} height={14} className="sm:w-4 sm:h-4" />
                                          <span>LinkedIn</span>
                                        </a>
                                      )}
                                      {hasEmail && (
                                        <a
                                          href={`mailto:${emailValue}`}
                                          className="flex items-center space-x-1 sm:space-x-2 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-white text-gray-800 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 text-xs sm:text-sm w-full sm:w-auto justify-center"
                                        >
                                          <Image src="/assets/material-symbols_mail.svg" alt="Mail" width={14} height={14} className="sm:w-4 sm:h-4" />
                                          <span>Mail</span>
                                        </a>
                                      )}
                                    </>
                                  );
                                })()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200 text-center">
                        <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                        <h4 className="text-base sm:text-lg font-medium text-gray-800 mb-2">No Leaders Found</h4>
                        <p className="text-xs sm:text-sm text-gray-600">
                          There are no active leaders assigned to {selectedCountry.name} at the moment.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Leader Detail Modal */}
          {selectedLeader && (
            <div 
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedLeader(null)}
            >
              <div 
                className="bg-white rounded-lg sm:rounded-xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl leader-modal"
                onClick={(e) => e.stopPropagation()}
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                <style dangerouslySetInnerHTML={{__html: `
                  .leader-modal::-webkit-scrollbar {
                    display: none !important;
                  }
                `}} />
                <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">Leader Details</h3>
                  <button
                    onClick={() => setSelectedLeader(null)}
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Close"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="p-4 sm:p-5">
                  {/* Profile Image and Basic Info */}
                  <div className="text-center mb-4">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-3 rounded-full overflow-hidden bg-gray-100">
                      <Image
                        src={selectedLeader.image}
                        alt={selectedLeader.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/assets/default-avatar.png';
                        }}
                      />
                    </div>
                    <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">{selectedLeader.name}</h4>
                    {selectedLeader.designation && (
                      <p className="text-sm sm:text-base text-gray-600 mb-3">{selectedLeader.designation}</p>
                    )}
                  </div>

                  {/* Bio */}
                  {selectedLeader.bio && (
                    <div className="mb-4">
                      <h5 className="text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Biography</h5>
                      <div 
                        className="text-xs sm:text-sm text-gray-600 leading-relaxed"
                        style={{ 
                          whiteSpace: 'pre-line',
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word'
                        }}
                      >
                        {selectedLeader.bio}
                      </div>
                    </div>
                  )}

                  {/* Affiliations */}
                  {selectedLeader.affiliations && (
                    <div className="mb-4">
                      <h5 className="text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Affiliation(s)</h5>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{selectedLeader.affiliations}</p>
                    </div>
                  )}

                  {/* Contact Information */}
                  <div className="border-t border-gray-200 pt-4">
                    <h5 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">Contact Information</h5>
                    <div className="flex flex-col sm:flex-row gap-2">
                      {(() => {
                        const linkedInValue = selectedLeader.linkedin ? String(selectedLeader.linkedin).trim() : '';
                        const emailValue = selectedLeader.email ? String(selectedLeader.email).trim() : '';
                        const hasLinkedIn = linkedInValue.length > 0;
                        const hasEmail = emailValue.length > 0;
                        
                        if (!hasLinkedIn && !hasEmail) {
                          return (
                            <div className="text-center py-3 text-gray-500">
                              <p className="text-xs">Contact information not available</p>
                            </div>
                          );
                        }
                        
                        return (
                          <>
                            {hasLinkedIn && (
                              <a
                                href={linkedInValue}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center space-x-1.5 px-3 py-2 text-[#653a96] hover:text-[#4d2d70] transition-colors duration-200 text-xs sm:text-sm font-medium"
                              >
                                <Image src="/assets/linkedin.png" alt="LinkedIn" width={16} height={16} className="opacity-80" style={{ filter: 'brightness(0) saturate(100%) invert(25%) sepia(90%) saturate(2000%) hue-rotate(250deg) brightness(0.8) contrast(1.2)' }} />
                                <span>LinkedIn Profile</span>
                                <svg className="w-3 h-3 text-[#653a96]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            )}
                            {hasEmail && (
                              <a
                                href={`mailto:${emailValue}`}
                                className="flex items-center justify-center space-x-1.5 px-3 py-2 text-[#653a96] hover:text-[#4d2d70] transition-colors duration-200 text-xs sm:text-sm font-medium"
                              >
                                <Image src="/assets/material-symbols_mail.svg" alt="Mail" width={16} height={16} className="opacity-80" style={{ filter: 'brightness(0) saturate(100%) invert(25%) sepia(90%) saturate(2000%) hue-rotate(250deg) brightness(0.8) contrast(1.2)' }} />
                                <span>Send Email</span>
                                <svg className="w-3 h-3 text-[#653a96]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                              </a>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          
        </div>
      </div>
    </SimpleLayout>
  );
}
