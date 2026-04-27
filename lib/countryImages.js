// Service for fetching country-based images from Unsplash API
const UNSPLASH_ACCESS_KEY = 'your_unsplash_access_key'; // You'll need to get this from Unsplash
const UNSPLASH_BASE_URL = 'https://api.unsplash.com';

// Fallback images for countries (using Unsplash's public API)
const COUNTRY_IMAGE_MAP = {
  'malaysia': 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=400&h=300&fit=crop',
  'japan': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop',
  'singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=300&fit=crop',
  'thailand': 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400&h=300&fit=crop',
  'india': 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=300&fit=crop',
  'china': 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400&h=300&fit=crop',
  'south korea': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
  'vietnam': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
  'philippines': 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&h=300&fit=crop',
  'indonesia': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
  'australia': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
  'new zealand': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
  'united states': 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=400&h=300&fit=crop',
  'canada': 'https://images.unsplash.com/photo-1503614472-8c93d4e6b1c9?w=400&h=300&fit=crop',
  'united kingdom': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop',
  'germany': 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=300&fit=crop',
  'france': 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop',
  'italy': 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=400&h=300&fit=crop',
  'spain': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=300&fit=crop',
  'brazil': 'https://images.unsplash.com/photo-1544989165-0c0b0a0b0b0b?w=400&h=300&fit=crop',
  'mexico': 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=300&fit=crop',
  'argentina': 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=300&fit=crop',
  'south africa': 'https://images.unsplash.com/photo-1544989165-0c0b0a0b0b0b?w=400&h=300&fit=crop',
  'egypt': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=300&fit=crop',
  'turkey': 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=300&fit=crop',
  'russia': 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=300&fit=crop',
  'default': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
};

// Function to get country image URL
export const getCountryImageUrl = (country) => {
  if (!country) {
    return COUNTRY_IMAGE_MAP.default;
  }
  
  const countryKey = country.toLowerCase().trim();
  return COUNTRY_IMAGE_MAP[countryKey] || COUNTRY_IMAGE_MAP.default;
};

// Function to get country-specific search terms for Unsplash
export const getCountrySearchTerms = (country) => {
  const searchTerms = {
    'malaysia': 'malaysia kuala lumpur',
    'japan': 'japan tokyo temple',
    'singapore': 'singapore marina bay',
    'thailand': 'thailand bangkok temple',
    'india': 'india taj mahal',
    'china': 'china great wall',
    'south korea': 'south korea seoul',
    'vietnam': 'vietnam ho chi minh',
    'philippines': 'philippines manila',
    'indonesia': 'indonesia bali',
    'australia': 'australia sydney opera',
    'new zealand': 'new zealand auckland',
    'united states': 'usa new york',
    'canada': 'canada toronto',
    'united kingdom': 'uk london',
    'germany': 'germany berlin',
    'france': 'france paris eiffel',
    'italy': 'italy rome colosseum',
    'spain': 'spain barcelona',
    'brazil': 'brazil rio de janeiro',
    'mexico': 'mexico mexico city',
    'argentina': 'argentina buenos aires',
    'south africa': 'south africa cape town',
    'egypt': 'egypt pyramids',
    'turkey': 'turkey istanbul',
    'russia': 'russia moscow',
    'default': 'world travel'
  };
  
  const countryKey = country.toLowerCase().trim();
  return searchTerms[countryKey] || searchTerms.default;
};

// Function to fetch random country image from Unsplash (requires API key)
export const fetchCountryImageFromUnsplash = async (country) => {
  try {
    const searchTerm = getCountrySearchTerms(country);
    const response = await fetch(
      `${UNSPLASH_BASE_URL}/photos/random?query=${encodeURIComponent(searchTerm)}&w=400&h=300&fit=crop&client_id=${UNSPLASH_ACCESS_KEY}`
    );
    
    if (response.ok) {
      const data = await response.json();
      return data.urls.regular;
    }
  } catch (error) {
    console.error('Error fetching image from Unsplash:', error);
  }
  
  // Fallback to static image
  return getCountryImageUrl(country);
};

export default {
  getCountryImageUrl,
  getCountrySearchTerms,
  fetchCountryImageFromUnsplash
};
