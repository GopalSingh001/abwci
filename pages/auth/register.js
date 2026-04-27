import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { authAPI } from '../../lib/api';
import legalTermsData from '../../data/legal-terms.json';

// Helper to get flag image from CDN (flagcdn) with safe fallback to emoji
const getFlagImage = (isoCode) => {
  if (!isoCode) return null;
  return `https://flagcdn.com/w40/${isoCode.toLowerCase()}.png`;
};

export default function Register() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registerImages, setRegisterImages] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  // Preload all registration images before showing the page
  const preloadRegisterImages = async (images) => {
    if (!images) {
      console.error('No images provided for preloading');
      return;
    }
    
    const imagesToLoad = [];
    
    // Get all image URLs from backend (must have all 4 steps)
    for (let step = 1; step <= 4; step++) {
      if (images[step]) {
        imagesToLoad.push(images[step]);
      } else {
        // If any step is missing, we can't proceed
        console.error(`Missing image for step ${step} from backend`);
        setImagesLoaded(true); // Show page anyway, but images might be missing
        return;
      }
    }

    if (typeof window === 'undefined') {
      // Server-side: just mark as loaded
      setImagesLoaded(true);
      return;
    }

    // Quick cache check - if all images are cached, hide loader immediately
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
        setImagesLoaded(true);
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
        setImagesLoaded(true);
      });
      return; // Exit early, images are already loaded
    }

    // Images need to be loaded from network - show loader
    // Preload all images and wait for them to fully load
    const loadPromises = imagesToLoad.map((url) => {
      return new Promise((resolve) => {
        const img = new window.Image();
        let resolved = false;
        const timeout = setTimeout(() => {
          if (!resolved) {
            resolved = true;
            // Even if timeout, mark as resolved so page can show
            resolve({ url, loaded: false });
          }
        }, 5000); // 5 second timeout per image
        
        img.onload = () => {
          if (!resolved) {
            resolved = true;
            clearTimeout(timeout);
            // Verify image is actually loaded
            if (img.complete && img.naturalWidth > 0) {
              resolve({ url, loaded: true });
            } else {
              resolve({ url, loaded: false });
            }
          }
        };
        
        img.onerror = () => {
          if (!resolved) {
            resolved = true;
            clearTimeout(timeout);
            resolve({ url, loaded: false });
          }
        };
        
        // Set src to start loading
        img.src = url;
      });
    });

    try {
      // Add overall timeout of 4 seconds - show page even if images are still loading
      const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => {
          resolve('timeout');
        }, 4000); // 4 second maximum wait
      });

      // Wait for all images to load (or timeout)
      const results = await Promise.race([
        Promise.all(loadPromises),
        timeoutPromise
      ]);
      
      if (results === 'timeout') {
        // Timeout reached, show page anyway
        setImagesLoaded(true);
      } else {
        // All promises resolved
        const allLoaded = results.every(result => result && result.loaded === true);
        
        // If all images loaded successfully, mark as ready
        if (allLoaded) {
          // Verify all images are in cache by checking them again (parallel check)
          const verifyPromises = imagesToLoad.map((url) => {
            return new Promise((resolve) => {
              const verifyImg = new window.Image();
              verifyImg.src = url;
              // Check immediately - if cached, it will be complete
              setTimeout(() => {
                resolve(verifyImg.complete && verifyImg.naturalWidth > 0);
              }, 10);
            });
          });
          
          const verifyResults = await Promise.all(verifyPromises);
          const allVerified = verifyResults.every(result => result === true);
          
          // Additional delay to ensure browser cache is fully updated
          await new Promise(resolve => setTimeout(resolve, allVerified ? 100 : 200));
          setImagesLoaded(true);
        } else {
          // Some images failed, but show page anyway after a delay
          await new Promise(resolve => setTimeout(resolve, 200));
          setImagesLoaded(true);
        }
      }
    } catch (error) {
      console.error('Error preloading images:', error);
      // Still show the page even if some images fail
      setImagesLoaded(true);
    }
  };
  
  // Fetch register images from backend and preload them
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3;
    
    const fetchRegisterImages = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
        const response = await fetch(`${API_BASE_URL}/register-images`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data && Array.isArray(data.data)) {
            // Convert array to object keyed by step_number
            const imagesMap = {};
            data.data.forEach(image => {
              if (image.step_number && image.image_url) {
                imagesMap[image.step_number] = image.image_url;
              }
            });
            
            // Check if we have all 4 step images
            const hasAllImages = [1, 2, 3, 4].every(step => imagesMap[step]);
            
            if (hasAllImages) {
              // Set the images from backend
              setRegisterImages(imagesMap);
              
              // Preload all backend images
              await preloadRegisterImages(imagesMap);
            } else {
              const missingSteps = [1, 2, 3, 4].filter(step => !imagesMap[step]);
              console.error(`Missing images for steps: ${missingSteps.join(', ')}`);
              
              // Retry if we haven't exceeded max retries
              if (retryCount < maxRetries) {
                retryCount++;
                console.log(`Retrying to fetch images (attempt ${retryCount}/${maxRetries})...`);
                setTimeout(() => {
                  fetchRegisterImages();
                }, 1000);
              } else {
                console.error('Max retries reached. Showing page without all images.');
                // Show page anyway with whatever images we have
                setRegisterImages(imagesMap);
                setImagesLoaded(true);
              }
            }
          } else {
            console.error('Invalid response format from register-images API');
            setImagesLoaded(true);
          }
        } else {
          console.error('Failed to fetch register images from backend');
          setImagesLoaded(true);
        }
      } catch (error) {
        console.error('Error fetching register images:', error);
        // Show page even if fetch fails
        setImagesLoaded(true);
      }
    };
    
    fetchRegisterImages();
  }, []);

  // Fetch country codes from open source API
  useEffect(() => {
    const fetchCountryCodes = async () => {
      try {
        // Using restcountries.com API to get country data with phone codes
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,idd,flags,cca2');
        if (response.ok) {
          const countries = await response.json();
          const codes = countries
            .filter(country => {
              // Filter countries that have valid phone codes
              if (!country.idd) return false;
              const root = country.idd.root || '';
              const suffixes = country.idd.suffixes || [];
              return root && suffixes.length > 0;
            })
            .map(country => {
              const root = country.idd.root || '';
              const suffix = country.idd.suffixes?.[0] || '';
              const code = root + suffix;
              // Get flag emoji - convert ISO code to flag emoji
              let flag = '🌍';
              if (country.cca2) {
                try {
                  // Convert ISO code (e.g., "IN") to flag emoji using regional indicator symbols
                  const codePoints = country.cca2
                    .toUpperCase()
                    .split('')
                    .map(char => 127397 + char.charCodeAt(0));
                  flag = String.fromCodePoint(...codePoints);
                } catch (e) {
                  // Fallback to emoji from API if conversion fails
                  flag = country.flags?.emoji || '🌍';
                }
              } else if (country.flags?.emoji) {
                flag = country.flags.emoji;
              }
              return {
                code: code,
                name: country.name.common,
                flag: flag,
                isoCode: country.cca2 || ''
              };
            })
            .filter(item => item.code && item.code.length > 0) // Remove invalid codes
            .sort((a, b) => a.name.localeCompare(b.name));
          
          if (codes.length > 0) {
            setCountryCodes(codes);
            // Set default to India if available
            const india = codes.find(c => c.code === '+91' || c.name === 'India');
            if (india) {
              setSelectedCountry(india);
            }
          } else {
            throw new Error('No country codes found');
          }
        } else {
          throw new Error('API response not ok');
        }
      } catch (error) {
        console.error('Error fetching country codes from API:', error);
        // Try alternative API: country-api
        try {
          const altResponse = await fetch('https://country-api.drnyeinchan.com/api/countries');
          if (altResponse.ok) {
            const data = await altResponse.json();
            if (data.countries && Array.isArray(data.countries)) {
              const codes = data.countries
                .filter(country => country.phoneCode)
                .map(country => {
                  let flag = '🌍';
                  if (country.flag) {
                    flag = country.flag;
                  } else if (country.isoCode) {
                    // Convert ISO code to flag emoji
                    const codePoints = country.isoCode
                      .toUpperCase()
                      .split('')
                      .map(char => 127397 + char.charCodeAt(0));
                    flag = String.fromCodePoint(...codePoints);
                  }
                  return {
                    code: country.phoneCode.startsWith('+') ? country.phoneCode : `+${country.phoneCode}`,
                    name: country.name,
                    flag: flag,
                    isoCode: country.isoCode || ''
                  };
                })
                .sort((a, b) => a.name.localeCompare(b.name));
              
              if (codes.length > 0) {
                setCountryCodes(codes);
                const india = codes.find(c => c.code === '+91' || c.name === 'India');
                if (india) {
                  setSelectedCountry(india);
                }
                return;
              }
            }
          }
        } catch (altError) {
          console.error('Alternative API also failed:', altError);
        }
        
        // Final fallback: Use a comprehensive list from a reliable source
        // This is a minimal fallback - the API should work in most cases
        console.warn('Using minimal fallback country codes');
        const fallbackCodes = [
          { code: '+91', name: 'India', flag: '🇮🇳', isoCode: 'IN' },
          { code: '+1', name: 'United States', flag: '🇺🇸', isoCode: 'US' },
          { code: '+44', name: 'United Kingdom', flag: '🇬🇧', isoCode: 'GB' },
          { code: '+86', name: 'China', flag: '🇨🇳', isoCode: 'CN' },
          { code: '+81', name: 'Japan', flag: '🇯🇵', isoCode: 'JP' },
          { code: '+49', name: 'Germany', flag: '🇩🇪', isoCode: 'DE' },
          { code: '+33', name: 'France', flag: '🇫🇷', isoCode: 'FR' },
          { code: '+61', name: 'Australia', flag: '🇦🇺', isoCode: 'AU' },
          { code: '+971', name: 'United Arab Emirates', flag: '🇦🇪', isoCode: 'AE' },
          { code: '+65', name: 'Singapore', flag: '🇸🇬', isoCode: 'SG' },
        ];
        setCountryCodes(fallbackCodes);
      }
    };
    fetchCountryCodes();
  }, []);

  // Check if user is already logged in
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    // If user is already logged in, redirect to home page
    if (authToken && userData) {
      router.push('/');
    }
  }, [router]);

  // Track if step 1 should be skipped
  const [skipStep1, setSkipStep1] = useState(false);
  // Track if user is coming from "Join as a Mentor" (role=mentor)
  const [isMentorRole, setIsMentorRole] = useState(false);
  // Track if user is coming from "Become a Member" (role=member)
  const [isMemberRole, setIsMemberRole] = useState(false);

  // Check for query parameter to skip step 1 and set Businesswoman as default
  useEffect(() => {
    if (router.isReady) {
      const { skipStep1: skipParam, type, role } = router.query;
      
      // If role is 'mentor', set flag but don't skip steps (normal flow from step 1)
      if (role === 'mentor') {
        setIsMentorRole(true);
        // Don't skip steps - start from step 1 with normal flow
        return;
      }
      
      // If skipStep1 is true or type is 'mentor' (Get a Mentor flow), skip to step 2 with Businesswoman selected
      if (skipParam === 'true' || type === 'mentor') {
        setSkipStep1(true);
        setSelectedOption('Businesswoman');
        setFormData(prev => ({ ...prev, organizationType: 'Businesswoman' }));
        setCurrentStep(2);
        return;
      }
      
      // Default case: If no query parameters (default /auth/register), set as Member but show normal flow
      if (!skipParam && !type && !role) {
        setIsMemberRole(true);
        // Don't skip steps - normal flow from step 1
      }
    }
  }, [router.isReady, router.query]);
  const [formData, setFormData] = useState({
    organizationType: '',
    fullName: '',
    countryCode: '+91',
    mobileNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    membershipType: '',
    organizationName: '',
    position: '',
    country: '',
    registrationNumber: '',
    registrationType: '',
    ownership: '',
    sectors: [],
    regions: [],
    employees: '',
    website: '',
    hearAboutUs: '',
    officeAddress: '',
    acceptTerms: false,
    detailsCorrect: false
  });
  const [countryCodes, setCountryCodes] = useState([]);
  const [showCountryCodeDropdown, setShowCountryCodeDropdown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({ code: '+91', name: 'India', flag: '🇮🇳', isoCode: 'IN' });
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Sectors and Regions state
  const [sectorInput, setSectorInput] = useState('');
  const [regionInput, setRegionInput] = useState('');
  const [showSectorDropdown, setShowSectorDropdown] = useState(false);
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [showHearAboutUsDropdown, setShowHearAboutUsDropdown] = useState(false);
  const [showOwnershipDropdown, setShowOwnershipDropdown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  
  // Predefined sectors
  const predefinedSectors = [
    'Automobile', 'Oil/Gas', 'Technology', 'Healthcare', 'Finance', 'Education',
    'Manufacturing', 'Retail', 'Real Estate', 'Agriculture', 'Energy', 'Telecommunications',
    'Transportation', 'Hospitality', 'Entertainment', 'Media', 'Construction', 'Pharmaceuticals',
    'Food & Beverage', 'Fashion', 'Beauty & Cosmetics', 'Sports', 'Tourism', 'Banking',
    'Insurance', 'Legal Services', 'Consulting', 'Marketing', 'E-commerce', 'Logistics',
    'Aerospace', 'Defense', 'Renewable Energy', 'Textiles', 'Chemicals', 'Mining',
    'Water Management', 'Waste Management', 'Environmental Services', 'Non-profit', 'Government'
  ];
  
  // Predefined regions - only these 4 options
  const predefinedRegions = [
    'Global', 'State', 'Country', 'Other'
  ];
  
  // Predefined options for "How did you hear about us?"
  const hearAboutUsOptions = [
    'Social Media (Facebook)',
    'Social Media (Instagram)',
    'Social Media (LinkedIn)',
    'Social Media (Twitter/X)',
    'Social Media (Other)',
    'Google Search',
    'Referral from Friend/Colleague',
    'Website',
    'Email Newsletter',
    'Advertisement',
    'Event/Conference',
    'News Article',
    'Partner Organization',
    'Search Engine (Other)',
    'Other'
  ];

  const organizationTypes = [
    'Business Association',
    'Company Investing in Women',
    'Incubator',
    'Accelerator',
    'Angel Investor /Venture Capitalists / Investment Fund',
    'Businesswoman',
    'Education Institution',
    'Management School/University Student',
    'Country Member',
    'Multilateral/Bilateral Organisations/NGOs',
    'Mentor'
  ];

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setFormData(prev => ({ ...prev, organizationType: option }));
    // Move to next step after selection
    setTimeout(() => {
      setCurrentStep(2);
    }, 500);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  // Add sector
  const handleAddSector = (sector) => {
    const sectorToAdd = sector.trim();
    if (sectorToAdd && !formData.sectors.includes(sectorToAdd)) {
      setFormData(prev => ({
        ...prev,
        sectors: [...prev.sectors, sectorToAdd]
      }));
      setSectorInput('');
      setShowSectorDropdown(false);
    }
  };
  
  // Remove sector
  const handleRemoveSector = (sectorToRemove) => {
    setFormData(prev => ({
      ...prev,
      sectors: prev.sectors.filter(s => s !== sectorToRemove)
    }));
  };
  
  // Add region
  const handleAddRegion = (region) => {
    const regionToAdd = region.trim();
    if (regionToAdd && !formData.regions.includes(regionToAdd)) {
      setFormData(prev => ({
        ...prev,
        regions: [...prev.regions, regionToAdd]
      }));
      setRegionInput('');
    }
  };
  
  // Get available regions (not already selected)
  const availableRegions = predefinedRegions.filter(r => !formData.regions.includes(r));
  
  // Remove region
  const handleRemoveRegion = (regionToRemove) => {
    setFormData(prev => ({
      ...prev,
      regions: prev.regions.filter(r => r !== regionToRemove)
    }));
  };
  
  // Filter sectors based on input
  const filteredSectors = sectorInput
    ? predefinedSectors.filter(s => 
        s.toLowerCase().includes(sectorInput.toLowerCase()) &&
        !formData.sectors.includes(s)
      )
    : predefinedSectors.filter(s => !formData.sectors.includes(s));

  const handleNext = async () => {
    setError('');
    
    // Validation for step 2
    if (currentStep === 2) {
      if (!formData.fullName || !formData.email || !formData.password) {
        setError('Please fill in all required fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      const phoneDigits = (formData.mobileNumber || '').replace(/\D/g, '');
      if (!phoneDigits || phoneDigits.length < 6 || phoneDigits.length > 15) {
        setError('Please enter a valid mobile number');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        return;
      }
    }
    
    if (currentStep < 4) {
      // If coming from mentor flow (skipStep1 is true), skip step 3 and go directly to step 4
      if (currentStep === 2 && skipStep1) {
        setCurrentStep(4);
      } else {
        setCurrentStep(currentStep + 1);
      }
    } else {
      // Handle final submission
      if (!formData.acceptTerms || !formData.detailsCorrect) {
        setError('Please accept the terms and conditions');
        return;
      }
      
      setLoading(true);
      try {
        // Determine organizationType based on user flow
        let finalOrganizationType = formData.organizationType;
        
        // If user came from "Join as a Mentor" (role=mentor), set organizationType to "Mentor"
        if (isMentorRole) {
          finalOrganizationType = 'Mentor';
        }
        // If user came from "Become a Member" (role=member), set organizationType to "Member"
        else if (isMemberRole) {
          finalOrganizationType = 'Member';
        }
        // If user came from "Get a Mentor" (skipStep1 is true and not member role), set organizationType to "Mentee"
        else if (skipStep1 && !isMemberRole) {
          finalOrganizationType = 'Mentee';
        }
        
        const submissionData = { ...formData, organizationType: finalOrganizationType };
        
        const response = await authAPI.register(submissionData);
        
        if (response.success) {
          // Redirect to success page
          router.push('/auth/register/success');
        } else {
          setError(response.message || 'Registration failed. Please try again.');
        }
      } catch (err) {
        console.error('Registration error:', err);
        setError(err.message || 'Registration failed. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 4 && skipStep1) {
      // If coming from mentor flow and on step 4, go back to step 2 (skipping step 3)
      setCurrentStep(2);
    } else if (currentStep > 2) {
      // If we're past step 2, go back one step
      setCurrentStep((prev) => prev - 1);
    } else if (currentStep === 2 && !skipStep1) {
      // If we're on step 2 and step 1 wasn't skipped, go back to step 1
      setCurrentStep(1);
    } else {
      // If step 1 was skipped or we're on step 1, go back to previous page
      router.back();
    }
  };

  // Show full-page loader until all images are loaded
  if (!imagesLoaded) {
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
    <>
      <Head>
        {/* Preload all registration step images for instant switching */}
        {registerImages && Object.keys(registerImages).map((step) => {
          const imageUrl = registerImages[step];
          if (!imageUrl) return null;
          return (
            <link
              key={`preload-step-${step}`}
              rel="preload"
              as="image"
              href={imageUrl}
            />
          );
        })}
      </Head>
      <div className="min-h-screen bg-white flex flex-col md:flex-row relative">
        {/* Yellow Progress Bar - Absolute Top of Page */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-200 z-50">
          <div 
            className="h-full bg-[#FECB07] transition-all duration-300 ease-in-out"
            style={{ 
              width: skipStep1 
                ? `${(currentStep === 2 ? 50 : 100)}%` 
                : `${(currentStep / 4) * 100}%` 
            }}
          />
        </div>

        {/* Logo - Top Left Corner */}
        <Link href="/">
        <div className="absolute top-4 left-4 md:top-6 md:left-10 z-20">
          <Image
            src="/assets/footer-new.png"
            alt="ABWCI Logo"
            width={80}
            height={80}
            className="w-28 h-14 md:w-40 md:h-20 object-contain"
          />
        </div>
        </Link>
        {/* Left Side - Image */}
        {registerImages && registerImages[currentStep] && (
          <div className="hidden md:block w-1/2 relative">
            <img
              src={registerImages[currentStep]}
              alt="Signup Background"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ display: 'block' }}
            />
          </div>
        )}

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 pt-20 md:pt-8 relative">
        
        <div className="w-full max-w-[420px]">
          {/* Header Section */}
              <div className="mb-8">
                {/* Back Button */}
                <div className="mb-4">
                  <button 
                    type="button"
                    onClick={handleBack}
                    disabled={loading}
                    className="w-8 h-8 flex items-center justify-center cursor-pointer disabled:opacity-50"
                  >
                    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M28.3346 15.5827H11.0938L19.013 7.66352L17.0013 5.66602L5.66797 16.9993L17.0013 28.3327L18.9988 26.3352L11.0938 18.416H28.3346V15.5827Z" fill="#653A96"/>
                    </svg>
                  </button>
                </div>
                
                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* Step Indicator */}
                <div className="mb-4">
                  <span 
                    className="text-[#2b2d30] text-sm font-medium"
                    style={{
                      fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '19.54px'
                    }}
                  >
                    Step {skipStep1 ? (currentStep === 2 ? '1' : '2') : currentStep}/4
                  </span>
                </div>

                {/* Title */}
                <h1 
                  className="text-[#653a96] mb-6 md:mb-8"
                  style={{
                    fontFamily: 'DM Serif Display, serif',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    fontSize: 'clamp(24px, 5vw, 38px)',
                    lineHeight: '1.1',
                    whiteSpace: 'nowrap',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textRendering: 'optimizeLegibility'
                  }}
                >
                  {currentStep === 1 ? "You are representing a/an" : 
                   currentStep === 2 ? "Tell us about yourself" : 
                   currentStep === 3 ? "Tell us about your organisation" :
                   skipStep1 ? "Complete your registration" : "Tell us about the office location"}
                </h1>
              </div>

          {/* Step 1: Organization Type Selection */}
          {currentStep === 1 && (
            <>
              <style dangerouslySetInnerHTML={{__html: `
                .organization-scroll-container::-webkit-scrollbar {
                  width: 6px;
                }
                .organization-scroll-container::-webkit-scrollbar-track {
                  background: #f5f5f5;
                  border-radius: 10px;
                }
                .organization-scroll-container::-webkit-scrollbar-thumb {
                  background: #653a96;
                  border-radius: 10px;
                }
                .organization-scroll-container::-webkit-scrollbar-thumb:hover {
                  background: #4a2470;
                }
                .organization-scroll-container {
                  scrollbar-width: thin;
                  scrollbar-color: #653a96 #f5f5f5;
                }
              `}} />
              <div 
                className="organization-scroll-container space-y-3 md:space-y-4 overflow-y-auto pr-2"
                style={{
                  maxHeight: '520px'
                }}
              >
                {organizationTypes.map((type, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(type)}
                    className={`w-full p-3 md:p-4 rounded-[20px] text-left transition-all duration-200 text-base
                      ${
                      selectedOption === type
                        ? 'bg-[#653a96] text-white'
                        : 'bg-[#f5f5f5] text-[#2b2d30] hover:bg-[#e5e5e5]'
                    }`}
                    style={{
                      fontFamily: 'Helvetica Neue medium, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                      fontStyle: 'normal',
                      fontWeight: 500,
                      fontSize: '15px',
                      lineHeight: '18px'
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 2: Personal Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-[#2b2d30] mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Full Name"
                  className="w-full px-5 py-3 bg-[#f5f5f5] border border-[#d9d9d9] rounded-[40px] text-[#000000] placeholder-[#000000] placeholder-opacity-40 focus:outline-none focus:ring-2 focus:ring-[#653a96] focus:border-transparent"
                />
              </div>

              {/* Country Code and Mobile Number */}
              <div className="flex gap-3">
                <div className="w-28 relative">
                  <label className="block text-sm font-medium text-[#2b2d30] mb-2">Country Code</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCountryCodeDropdown(!showCountryCodeDropdown)}
                      className="w-full px-3 py-3 bg-[#f5f5f5] border border-[#d9d9d9] rounded-[40px] text-[#000000] flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#653a96] focus:border-transparent"
                    >
                      <span className="flex items-center gap-1.5">
                        {getFlagImage(selectedCountry.isoCode) ? (
                          <>
                            <img
                              src={getFlagImage(selectedCountry.isoCode)}
                              alt={`${selectedCountry.name || 'country'} flag`}
                              className="w-5 h-4 rounded-[3px]"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const next = e.currentTarget.nextSibling;
                                if (next) next.style.display = 'inline-block';
                              }}
                            />
                            <span className="text-lg hidden" style={{ fontSize: '18px' }}>{selectedCountry.flag || '🌍'}</span>
                          </>
                        ) : (
                          <span className="text-lg flex-shrink-0" style={{ fontSize: '18px' }}>{selectedCountry.flag || '🌍'}</span>
                        )}
                        <span className="text-sm font-medium">{selectedCountry.code}</span>
                      </span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {showCountryCodeDropdown && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setShowCountryCodeDropdown(false)}
                        ></div>
                    <div
                      className="absolute z-20 mt-1 w-32 max-h-60 bg-white border border-[#d9d9d9] rounded-[20px] shadow-lg overflow-y-auto"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      <style dangerouslySetInnerHTML={{__html: `
                        .country-code-scroll::-webkit-scrollbar { display: none; }
                      `}} />
                          <div className="p-2">
                            {countryCodes.length > 0 ? (
                              countryCodes.map((country, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => {
                                    setSelectedCountry(country);
                                    handleInputChange('countryCode', country.code);
                                    setShowCountryCodeDropdown(false);
                                  }}
                                  className={`w-full px-3 py-2 text-left rounded-[15px] hover:bg-[#f5f5f5] transition-colors flex items-center gap-2 ${
                                    selectedCountry.code === country.code ? 'bg-[#653a96] text-white hover:bg-[#4a2470]' : 'text-[#000000]'
                                  }`}
                                >
                              {getFlagImage(country.isoCode) ? (
                                <>
                                  <img
                                    src={getFlagImage(country.isoCode)}
                                    alt={`${country.name} flag`}
                                    className="w-5 h-4 rounded-[3px]"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                      const next = e.currentTarget.nextSibling;
                                      if (next) next.style.display = 'inline-block';
                                    }}
                                  />
                                  <span className="text-lg hidden" style={{ fontSize: '18px' }}>{country.flag || '🌍'}</span>
                                </>
                              ) : (
                                <span className="text-lg flex-shrink-0" style={{ fontSize: '18px' }}>{country.flag || '🌍'}</span>
                              )}
                                  <span className="text-sm font-medium">{country.code}</span>
                                </button>
                              ))
                            ) : (
                              <div className="px-3 py-2 text-center text-gray-500 text-xs">Loading...</div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-[#2b2d30] mb-2">Mobile Number</label>
                  <input
                    type="tel"
                    value={formData.mobileNumber}
                    onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                    onFocus={() => setShowCountryCodeDropdown(false)}
                    placeholder="Mobile Number"
                    className="w-full px-5 py-3 bg-[#f5f5f5] border border-[#d9d9d9] rounded-[40px] text-[#000000] placeholder-[#000000] placeholder-opacity-40 focus:outline-none focus:ring-2 focus:ring-[#653a96] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[#2b2d30] mb-2">Email address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Email address"
                  className="w-full px-5 py-3 bg-[#f5f5f5] border border-[#d9d9d9] rounded-[40px] text-[#000000] placeholder-[#000000] placeholder-opacity-40 focus:outline-none focus:ring-2 focus:ring-[#653a96] focus:border-transparent"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-[#2b2d30] mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Password"
                    className="w-full px-5 py-3 pr-12 bg-[#f5f5f5] border border-[#d9d9d9] rounded-[40px] text-[#000000] placeholder-[#000000] placeholder-opacity-40 focus:outline-none focus:ring-2 focus:ring-[#653a96] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-[#2b2d30] mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirm Password"
                    className="w-full px-5 py-3 pr-12 bg-[#f5f5f5] border border-[#d9d9d9] rounded-[40px] text-[#000000] placeholder-[#000000] placeholder-opacity-40 focus:outline-none focus:ring-2 focus:ring-[#653a96] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Next Button */}
              <button
                onClick={handleNext}
                disabled={loading}
                className="w-full bg-[#653a96] text-white px-6 md:px-8 py-3 md:py-4 rounded-[40px] font-medium hover:bg-[#4a2470] transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm md:text-base"
                style={{
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '19.54px'
                }}
              >
                {loading ? 'Processing...' : 'Next'}
              </button>
            </div>
          )}

          {/* Step 3: Organization Information */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Organization Name */}
              <div>
                <label className="block text-sm font-medium text-[#2b2d30] mb-2">Name of the organisation</label>
                <input
                  type="text"
                  value={formData.organizationName}
                  onChange={(e) => handleInputChange('organizationName', e.target.value)}
                  placeholder="Name"
                  className="w-full px-5 py-3 bg-[#f5f5f5] border border-[#d9d9d9] rounded-[40px] text-[#000000] placeholder-[#000000] placeholder-opacity-40 focus:outline-none focus:ring-2 focus:ring-[#653a96] focus:border-transparent"
                />
              </div>

              {/* Position */}
              <div>
                <label className="block text-sm font-medium text-[#2b2d30] mb-2">Your Position</label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  placeholder="Position"
                  className="w-full px-5 py-3 bg-[#f5f5f5] border border-[#d9d9d9] rounded-[40px] text-[#000000] placeholder-[#000000] placeholder-opacity-40 focus:outline-none focus:ring-2 focus:ring-[#653a96] focus:border-transparent"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-[#2b2d30] mb-2">Country</label>
                {(() => {
                  const selectedCountryObj = countryCodes.find(c => c.name === formData.country);
                  const displayFlag = selectedCountryObj?.flag || '🌍';
                  const flagUrl = getFlagImage(selectedCountryObj?.isoCode || selectedCountry?.isoCode);
                  return (
                <div className="relative">
                  <input
                    type="text"
                    value={countrySearch || formData.country}
                    onChange={(e) => {
                      setCountrySearch(e.target.value);
                      setShowCountryDropdown(true);
                    }}
                    onFocus={() => setShowCountryDropdown(true)}
                    placeholder="Select Country"
                    className="w-full pl-12 pr-12 py-3 bg-[#f5f5f5] border border-[#d9d9d9] rounded-[40px] text-[#000000] placeholder-[#000000] placeholder-opacity-40 focus:outline-none focus:ring-2 focus:ring-[#653a96] focus:border-transparent"
                  />
                  {/* Left flag/icon */}
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                    {flagUrl ? (
                      <>
                        <img
                          src={flagUrl}
                          alt="Flag"
                          className="w-5 h-4 rounded-[3px]"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            const next = e.target.nextSibling;
                            if (next) next.style.display = 'inline-block';
                          }}
                        />
                        <span className="text-lg hidden" style={{ fontSize: '18px' }}>{displayFlag}</span>
                      </>
                    ) : (
                      <span className="text-lg" style={{ fontSize: '18px' }}>{displayFlag}</span>
                    )}
                  </div>
                  {/* Dropdown caret */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {showCountryDropdown && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => {
                          setShowCountryDropdown(false);
                          setCountrySearch('');
                        }}
                      ></div>
                      <div
                        className="absolute z-20 mt-1 w-full max-h-60 bg-white border border-[#d9d9d9] rounded-[20px] shadow-lg overflow-y-auto"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                      >
                        <style dangerouslySetInnerHTML={{__html: `
                          .country-scroll::-webkit-scrollbar { display: none; }
                        `}} />
                        <div className="p-2">
                          {countryCodes.length === 0 && (
                            <div className="px-4 py-2 text-center text-gray-500 text-xs">Loading...</div>
                          )}
                          {countryCodes
                            .filter(country => {
                              if (!countrySearch) return true;
                              return country.name.toLowerCase().includes(countrySearch.toLowerCase());
                            })
                            .slice(0, 50)
                            .map((country, idx) => (
                              <button
                                key={`${country.name}-${idx}`}
                                type="button"
                                onClick={() => {
                                  handleInputChange('country', country.name);
                                  setCountrySearch(country.name);
                                  setSelectedCountry(country);
                                  setShowCountryDropdown(false);
                                }}
                                className={`w-full px-4 py-2 text-left rounded-[15px] hover:bg-[#f5f5f5] transition-colors text-[#000000] text-sm flex items-center gap-2 ${
                                  formData.country === country.name ? 'bg-[#653a96] text-white hover:bg-[#4a2470]' : ''
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  {getFlagImage(country.isoCode) ? (
                                    <>
                                      <img
                                        src={getFlagImage(country.isoCode)}
                                        alt={`${country.name} flag`}
                                        className="w-5 h-4 rounded-[3px]"
                                        onError={(e) => {
                                          e.target.style.display = 'none';
                                          const next = e.target.nextSibling;
                                          if (next) next.style.display = 'inline-block';
                                        }}
                                      />
                                      <span className="text-lg hidden" style={{ fontSize: '18px' }}>{country.flag || '🌍'}</span>
                                    </>
                                  ) : (
                                    <span className="text-lg" style={{ fontSize: '18px' }}>{country.flag || '🌍'}</span>
                                  )}
                                  <span className="text-sm font-medium">{country.name}</span>
                                </div>
                              </button>
                            ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                  );
                })()}
              </div>

              {/* Registration Number */}
              <div>
                <label className="block text-sm font-medium text-[#2b2d30] mb-2">Registration Number</label>
                <input
                  type="text"
                  value={formData.registrationNumber}
                  onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                  placeholder="Type of Organisation"
                  className="w-full px-5 py-3 bg-[#f5f5f5] border border-[#d9d9d9] rounded-[40px] text-[#000000] placeholder-[#000000] placeholder-opacity-40 focus:outline-none focus:ring-2 focus:ring-[#653a96] focus:border-transparent"
                />
              </div>

              {/* Registration Type */}
              <div>
                <label className="block text-sm font-medium text-[#2b2d30] mb-2">Registration Number Type</label>
                <input
                  type="text"
                  value={formData.registrationType}
                  onChange={(e) => handleInputChange('registrationType', e.target.value)}
                  placeholder="Type of Organisation"
                  className="w-full px-5 py-3 bg-[#f5f5f5] border border-[#d9d9d9] rounded-[40px] text-[#000000] placeholder-[#000000] placeholder-opacity-40 focus:outline-none focus:ring-2 focus:ring-[#653a96] focus:border-transparent"
                />
              </div>

              {/* Ownership */}
              <div>
                <label className="block text-sm font-medium text-[#2b2d30] mb-2">Company's Ownership structure</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.ownership}
                    onClick={() => setShowOwnershipDropdown(true)}
                    onFocus={() => setShowOwnershipDropdown(true)}
                    readOnly
                    placeholder="Select Ownership structure"
                    className="w-full px-5 py-3 pr-12 bg-[#f5f5f5] border border-[#d9d9d9] rounded-[40px] text-[#000000] placeholder-[#000000] placeholder-opacity-40 focus:outline-none focus:ring-2 focus:ring-[#653a96] focus:border-transparent cursor-pointer"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {showOwnershipDropdown && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowOwnershipDropdown(false)}
                      ></div>
                      <div
                        className="absolute z-20 mt-1 w-full max-h-60 bg-white border border-[#d9d9d9] rounded-[20px] shadow-lg overflow-y-auto"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                      >
                        <style dangerouslySetInnerHTML={{__html: `
                          .ownership-scroll::-webkit-scrollbar { display: none; }
                        `}} />
                        <div className="p-2">
                          {[
                            'Sole Proprietorship',
                            'Partnership',
                            'Limited Liability Company (LLC)',
                            'Public or Private Limited'
                          ].map((option, idx) => (
                            <button
                              key={`${option}-${idx}`}
                              type="button"
                              onClick={() => {
                                handleInputChange('ownership', option);
                                setShowOwnershipDropdown(false);
                              }}
                              className={`w-full px-4 py-2 text-left rounded-[15px] hover:bg-[#f5f5f5] transition-colors text-[#000000] text-sm ${
                                formData.ownership === option ? 'bg-[#653a96] text-white hover:bg-[#4a2470]' : ''
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Sectors */}
              <div>
                <label className="block text-sm font-medium text-[#2b2d30] mb-2">Sectors you represent</label>
                <div className="relative">
                  <div className="flex">
                    <input
                      type="text"
                      value={sectorInput}
                      onChange={(e) => {
                        setSectorInput(e.target.value);
                        setShowSectorDropdown(true);
                      }}
                      onFocus={() => setShowSectorDropdown(true)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (sectorInput.trim()) {
                            handleAddSector(sectorInput);
                          }
                        }
                      }}
                      placeholder="Type or select a sector"
                      className="flex-1 px-5 py-3 bg-[#f5f5f5] border border-[#d9d9d9] rounded-l-[40px] text-[#000000] placeholder-[#000000] placeholder-opacity-40 focus:outline-none focus:ring-2 focus:ring-[#653a96] focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (formData.sectors.length === 0 && sectorInput.trim()) {
                          // First selection - add from input
                          handleAddSector(sectorInput);
                        } else if (formData.sectors.length > 0) {
                          // After first selection - open dropdown
                          setShowSectorDropdown(!showSectorDropdown);
                        }
                      }}
                      className="px-4 py-3 bg-[#f5f5f5] border border-[#d9d9d9] border-l-0 rounded-r-[40px] hover:bg-[#e5e5e5] transition-colors duration-200"
                    >
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Dropdown for sectors - auto-adds on click */}
                  {showSectorDropdown && filteredSectors.length > 0 && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowSectorDropdown(false)}
                      ></div>
                      <div
                        className="absolute z-20 mt-1 w-full max-h-48 bg-white border border-[#d9d9d9] rounded-[20px] shadow-lg overflow-y-auto"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                      >
                        <style dangerouslySetInnerHTML={{__html: `
                          .sector-scroll::-webkit-scrollbar { display: none; }
                        `}} />
                        <div className="p-2">
                          {filteredSectors.slice(0, 10).map((sector, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => {
                                handleAddSector(sector);
                                setShowSectorDropdown(false);
                              }}
                              className="w-full px-4 py-2 text-left rounded-[15px] hover:bg-[#f5f5f5] transition-colors text-[#000000] text-sm"
                            >
                              {sector}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                
                {/* Selected sectors as tags */}
                {formData.sectors.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.sectors.map((sector, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#653a96] text-[#653a96] rounded-[30px] text-xs"
                      >
                        {sector}
                        <button
                          type="button"
                          onClick={() => handleRemoveSector(sector)}
                          className="ml-1 hover:text-red-600 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Regions */}
              <div>
                <label className="block text-sm font-medium text-[#2b2d30] mb-2">Regions you represent</label>
                <div className="relative">
                  <input
                    type="text"
                    value=""
                    onClick={() => setShowRegionDropdown(true)}
                    onFocus={() => setShowRegionDropdown(true)}
                    readOnly
                    placeholder={availableRegions.length ? "Select a region" : "All regions selected"}
                    className="w-full px-5 py-3 pr-12 bg-[#f5f5f5] border border-[#d9d9d9] rounded-[40px] text-[#000000] placeholder-[#000000] placeholder-opacity-40 focus:outline-none focus:ring-2 focus:ring-[#653a96] focus:border-transparent cursor-pointer"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {showRegionDropdown && availableRegions.length > 0 && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowRegionDropdown(false)}
                      ></div>
                      <div
                        className="absolute z-20 mt-1 w-full max-h-48 bg-white border border-[#d9d9d9] rounded-[20px] shadow-lg overflow-y-auto"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                      >
                        <style dangerouslySetInnerHTML={{__html: `
                          .region-scroll::-webkit-scrollbar { display: none; }
                        `}} />
                        <div className="p-2">
                          {availableRegions.map((region, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => {
                                handleAddRegion(region);
                                setShowRegionDropdown(false);
                              }}
                              className="w-full px-4 py-2 text-left rounded-[15px] hover:bg-[#f5f5f5] transition-colors text-[#000000] text-sm"
                            >
                              {region}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                
                {/* Selected regions as tags */}
                {formData.regions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.regions.map((region, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#653a96] text-[#653a96] rounded-[30px] text-xs"
                      >
                        {region}
                        <button
                          type="button"
                          onClick={() => handleRemoveRegion(region)}
                          className="ml-1 hover:text-red-600 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Number of Employees */}
              <div>
                <label className="block text-sm font-medium text-[#2b2d30] mb-2">Number of employees</label>
                <input
                  type="number"
                  value={formData.employees}
                  onChange={(e) => handleInputChange('employees', e.target.value)}
                  placeholder="Number of Employees"
                  min="0"
                  className="w-full px-5 py-3 bg-[#f5f5f5] border border-[#d9d9d9] rounded-[40px] text-[#000000] placeholder-[#000000] placeholder-opacity-40 focus:outline-none focus:ring-2 focus:ring-[#653a96] focus:border-transparent"
                />
              </div>

              {/* Next Button */}
              <button
                onClick={handleNext}
                disabled={loading}
                className="w-full bg-[#653a96] text-white px-6 md:px-8 py-3 md:py-4 rounded-[40px] font-medium hover:bg-[#4a2470] transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm md:text-base"
                style={{
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontSize: '18px',
                  lineHeight: '21.98px'
                }}
              >
                {loading ? 'Processing...' : 'Next'}
              </button>
            </div>
          )}

          {/* Step 4: Office Location */}
          {currentStep === 4 && (
            <div className="space-y-6">
              {/* Only show these fields if NOT coming from mentor flow */}
              {!skipStep1 && (
                <>
                  {/* Website */}
                  <div>
                    <label className="block text-sm font-medium text-[#000000] mb-2">Website</label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="Website URL"
                      className="w-full px-5 py-3 bg-[#f5f5f5] border border-[#d9d9d9] rounded-[30px] text-[#000000] placeholder-[#000000] placeholder-opacity-40 focus:outline-none focus:ring-2 focus:ring-[#653a96] focus:border-transparent"
                    />
                  </div>

                  {/* How did you hear about us */}
                  <div>
                    <label className="block text-sm font-medium text-[#000000] mb-2">How did you hear about us?</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.hearAboutUs}
                        onChange={(e) => {
                          handleInputChange('hearAboutUs', e.target.value);
                          setShowHearAboutUsDropdown(true);
                        }}
                        onFocus={() => setShowHearAboutUsDropdown(true)}
                        placeholder="Type or select an option"
                        className="w-full px-5 py-3 bg-[#f5f5f5] border border-[#d9d9d9] rounded-[30px] text-[#000000] placeholder-[#000000] placeholder-opacity-40 focus:outline-none focus:ring-2 focus:ring-[#653a96] focus:border-transparent"
                      />
                      
                      {/* Dropdown for hear about us options */}
                      {showHearAboutUsDropdown && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setShowHearAboutUsDropdown(false)}
                          ></div>
                          <div
                            className="absolute z-20 mt-1 w-full max-h-48 bg-white border border-[#d9d9d9] rounded-[20px] shadow-lg overflow-y-auto"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                          >
                            <style dangerouslySetInnerHTML={{__html: `
                              .hear-scroll::-webkit-scrollbar { display: none; }
                            `}} />
                            <div className="p-2">
                              {hearAboutUsOptions
                                .filter(option => 
                                  !formData.hearAboutUs || 
                                  option.toLowerCase().includes(formData.hearAboutUs.toLowerCase())
                                )
                                .slice(0, 10)
                                .map((option, index) => (
                                  <button
                                    key={index}
                                    type="button"
                                    onClick={() => {
                                      handleInputChange('hearAboutUs', option);
                                      setShowHearAboutUsDropdown(false);
                                    }}
                                    className="w-full px-4 py-2 text-left rounded-[15px] hover:bg-[#f5f5f5] transition-colors text-[#000000] text-sm"
                                  >
                                    {option}
                                  </button>
                                ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Main Office Address */}
                  <div>
                    <label className="block text-sm font-medium text-[#000000] mb-2">Main Office Address</label>
                    <textarea
                      value={formData.officeAddress}
                      onChange={(e) => handleInputChange('officeAddress', e.target.value)}
                      placeholder="Main Office Address"
                      rows={4}
                      className="w-full px-5 py-3 bg-[#f5f5f5] border border-[#d9d9d9] rounded-[30px] text-[#000000] placeholder-[#000000] placeholder-opacity-40 focus:outline-none focus:ring-2 focus:ring-[#653a96] focus:border-transparent resize-none"
                    />
                  </div>
                </>
              )}

              {/* Checkboxes */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <label className="relative inline-flex items-center">
                    <input
                      type="checkbox"
                      id="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                      className="peer sr-only"
                    />
                    <span className="w-5 h-5 mt-1 inline-flex items-center justify-center rounded-full bg-white border-2 border-[#653a96] text-transparent peer-checked:bg-[#653a96] peer-checked:border-[#653a96] peer-checked:text-white transition-colors peer-focus:outline peer-focus:outline-2 peer-focus:outline-offset-1 peer-focus:outline-[#653a96]">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  </label>
                  <label htmlFor="acceptTerms" className="text-sm text-[#000000]">
                    I, hereby, accept{' '}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedPolicy('termsAndConditions');
                        setIsModalOpen(true);
                      }}
                      className="text-[#653a96] underline hover:text-[#4a2470] bg-transparent border-none cursor-pointer p-0"
                    >
                      Terms and Conditions
                    </button>
                    {' '}and{' '}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedPolicy('privacyPolicy');
                        setIsModalOpen(true);
                      }}
                      className="text-[#653a96] underline hover:text-[#4a2470] bg-transparent border-none cursor-pointer p-0"
                    >
                      Privacy Policy
                    </button>
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <label className="relative inline-flex items-center">
                    <input
                      type="checkbox"
                      id="detailsCorrect"
                      checked={formData.detailsCorrect}
                      onChange={(e) => handleInputChange('detailsCorrect', e.target.checked)}
                      className="peer sr-only"
                    />
                    <span className="w-5 h-5 mt-1 inline-flex items-center justify-center rounded-full bg-white border-2 border-[#653a96] text-transparent peer-checked:bg-[#653a96] peer-checked:border-[#653a96] peer-checked:text-white transition-colors peer-focus:outline peer-focus:outline-2 peer-focus:outline-offset-1 peer-focus:outline-[#653a96]">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  </label>
                  <label htmlFor="detailsCorrect" className="text-sm text-[#000000]">
                    All the details, given by me, are correct in the court of Law
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleNext}
                disabled={!formData.acceptTerms || !formData.detailsCorrect || loading}
                className="w-full bg-[#653a96] text-white px-6 md:px-8 py-3 md:py-4 rounded-[50px] font-medium hover:bg-[#4a2470] transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm md:text-base"
                style={{
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '19.54px'
                }}
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Legal Terms Modal */}
      {isModalOpen && selectedPolicy && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center px-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-900 hover:bg-red-100 hover:text-red-600 transition-all duration-200 shadow-lg"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-8 md:p-12" style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}>
              <style dangerouslySetInnerHTML={{__html: `
                div::-webkit-scrollbar {
                  display: none;
                }
              `}} />
              
              {/* Title */}
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6" style={{
                fontFamily: 'DM Serif Display, serif',
                fontWeight: 500
              }}>
                {legalTermsData[selectedPolicy].title}
              </h2>

              {/* Content */}
              <div className="space-y-6">
                {legalTermsData[selectedPolicy].content.map((section, index) => (
                  <div key={index}>
                    {section.heading && (
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6" style={{
                        fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                        fontWeight: 600
                      }}>
                        {section.heading}
                      </h3>
                    )}
                    
                    {section.text && (
                      <p 
                        className="text-gray-700 leading-relaxed mb-3" 
                        style={{
                          fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                          fontSize: '16px',
                          lineHeight: '24px'
                        }}
                        dangerouslySetInnerHTML={{ __html: section.text }}
                      />
                    )}
                    
                    {section.points && (
                      <ul className="space-y-2 ml-4 mb-4">
                        {section.points.map((point, pointIndex) => (
                          <li key={pointIndex} className="text-gray-700 leading-relaxed flex" style={{
                            fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                            fontSize: '15px',
                            lineHeight: '22px'
                          }}>
                            <span className="text-[#653a96] mr-3">•</span>
                            <span dangerouslySetInnerHTML={{ __html: point }} />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
