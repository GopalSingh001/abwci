import PageLayout from './components/PageLayout';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { usePostsByPage } from '../../lib/usePosts';
import { useLanguage } from '../../lib/LanguageContext';
import { successStoriesAPI } from '../../lib/api';

const MAX_SUBMISSION_VIDEO_SIZE = 5 * 1024 * 1024; // 5MB
const SUBMIT_FONT = 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';

const COUNTRY_OPTIONS = [
  { code: 'IN', name: 'India' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'SG', name: 'Singapore' },
  { code: 'AU', name: 'Australia' },
  { code: 'CA', name: 'Canada' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' },
  { code: 'PL', name: 'Poland' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'BE', name: 'Belgium' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'AT', name: 'Austria' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'HU', name: 'Hungary' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'SK', name: 'Slovakia' },
  { code: 'RO', name: 'Romania' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'HR', name: 'Croatia' },
  { code: 'SI', name: 'Slovenia' },
  { code: 'NG', name: 'Nigeria' }
];

const INITIAL_STORY_FORM = {
  firstName: '',
  middleName: '',
  lastName: '',
  email: '',
  country: '',
  designation: '',
  quote: ''
};

export default function SuccessStories() {
  const { t } = useLanguage();
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [selectedStory, setSelectedStory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAllStories, setShowAllStories] = useState(false);
  const partnerStoriesScrollRefMobile = useRef(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [storyForm, setStoryForm] = useState(INITIAL_STORY_FORM);
  const [videoFile, setVideoFile] = useState(null);
  const [videoError, setVideoError] = useState('');
  const [showSubmitToast, setShowSubmitToast] = useState(false);
  const [submitResult, setSubmitResult] = useState(null); // { type, message }
  const [isSubmittingStory, setIsSubmittingStory] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  // Fetch success stories from API
  const { posts: rawPartnerStories, loading: storiesLoading, error: storiesError } = usePostsByPage('stories', 20);
  
  // Filter stories to only include those with valid images
  const filteredStories = rawPartnerStories.filter(story => {
    const hasThumbnail = story.post_thumbnail_url && story.post_thumbnail_url.trim() !== '' && story.post_thumbnail_url !== null;
    const hasBanner = story.post_banner_url && story.post_banner_url.trim() !== '' && story.post_banner_url !== null;
    return hasThumbnail || hasBanner;
  });
  
  // Sort stories by priority (priority 1 comes first, then 2, 3, etc. NULL/0 priorities go last)
  const partnerStories = [...filteredStories].sort((a, b) => {
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
  
  // Get featured stories for hero section (max 3) - these are already sorted by priority
  const featuredStories = partnerStories.slice(0, 3);
  
  // Show first 8 stories initially, then all if "More" is clicked
  const displayedStories = showAllStories ? partnerStories : partnerStories.slice(0, 8);

  // Auto-scroll functionality
  useEffect(() => {
    if (featuredStories.length > 1) {
      const interval = setInterval(() => {
        setCurrentStoryIndex((prevIndex) => 
          prevIndex === featuredStories.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000); // Change every 5 seconds

      return () => clearInterval(interval);
    }
  }, [featuredStories.length]);

  useEffect(() => {
    if (submitResult) {
      setShowSubmitToast(true);
      const timer = setTimeout(() => setShowSubmitToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [submitResult]);

  useEffect(() => {
    if (isSubmitModalOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
    return undefined;
  }, [isSubmitModalOpen]);

  const handleStoryClick = (story) => {
    setSelectedStory(story);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStory(null);
  };

  // Scroll functions for mobile
  const scrollPartnerStoriesLeft = () => {
    if (partnerStoriesScrollRefMobile.current) {
      const scrollAmount = 363; // Width of card (359px) + margin (4px)
      partnerStoriesScrollRefMobile.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollPartnerStoriesRight = () => {
    if (partnerStoriesScrollRefMobile.current) {
      const scrollAmount = 363; // Width of card (359px) + margin (4px)
      partnerStoriesScrollRefMobile.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleStoryFieldChange = (field, value) => {
    setStoryForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetStoryForm = () => {
    setStoryForm(INITIAL_STORY_FORM);
    setVideoFile(null);
    setVideoError('');
  };

  const handleVideoChange = (file) => {
    if (!file) {
      setVideoFile(null);
      setVideoError('');
      return;
    }

    if (file.size > MAX_SUBMISSION_VIDEO_SIZE) {
      setVideoError('Video size should not exceed 5 MB.');
      setVideoFile(null);
      return;
    }

    setVideoError('');
    setVideoFile(file);
  };

  const closeSubmitModal = () => {
    setIsSubmitModalOpen(false);
    setVideoError('');
  setIsCountryDropdownOpen(false);
  };

  const handleStorySubmit = async (e) => {
    e.preventDefault();
    const requiredFields = [
      storyForm.firstName.trim(),
      storyForm.lastName.trim(),
      storyForm.email.trim(),
      storyForm.quote.trim(),
    ];

    if (requiredFields.some((field) => !field) || !videoFile) {
      setSubmitResult({
        type: 'error',
        message: t('stories.submissionValidation'),
      });
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(storyForm.email.trim())) {
      setSubmitResult({
        type: 'error',
        message: t('common.formValidationEmail') || 'Please enter a valid email address.',
      });
      return;
    }

    if (videoError) {
      setSubmitResult({
        type: 'error',
        message: videoError,
      });
      return;
    }

    try {
      setIsSubmittingStory(true);
      const formData = new FormData();
      formData.append('first_name', storyForm.firstName.trim());
      formData.append('middle_name', storyForm.middleName.trim());
      formData.append('last_name', storyForm.lastName.trim());
      formData.append('email', storyForm.email.trim());
      formData.append('country', storyForm.country);
      formData.append('designation', storyForm.designation.trim());
      formData.append('quote', storyForm.quote.trim());
      formData.append('video', videoFile);

      await successStoriesAPI.submit(formData);
      setSubmitResult({
        type: 'success',
        message: t('stories.submissionSuccess'),
      });
      resetStoryForm();
      setIsSubmitModalOpen(false);
    } catch (error) {
      setSubmitResult({
        type: 'error',
        message: error?.message || t('stories.submissionError'),
      });
    } finally {
      setIsSubmittingStory(false);
    }
  };

  const selectedCountryOption = COUNTRY_OPTIONS.find((country) => country.name === storyForm.country);

  return (
    <PageLayout
      title={t('expandedNav.successStories')}
      buttonText={t('stories.submitStory')}
      buttonOnClick={() => setIsSubmitModalOpen(true)}
    >
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={closeSubmitModal}
            aria-hidden="true"
          />
          <div
            className="relative w-full max-w-[520px] bg-[#FECB07] border border-[#171717] rounded-[30px] p-5 md:p-6 flex flex-col gap-4 max-h-[94vh] overflow-y-auto shadow-2xl"
            style={{ fontFamily: SUBMIT_FONT }}
          >
            <button
              type="button"
              onClick={closeSubmitModal}
              className="absolute top-4 right-4 text-[#171717] hover:text-black transition-colors"
              aria-label="Close submission form"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="#171717" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </button>
            <form className="flex flex-col gap-4 mt-6" onSubmit={handleStorySubmit}>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-[#171717]">Full Name</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'First', key: 'firstName' },
                    { label: 'Middle', key: 'middleName' },
                    { label: 'Last', key: 'lastName' }
                  ].map((field) => (
                    <input
                      key={field.key}
                      type="text"
                      placeholder={field.label}
                      value={storyForm[field.key]}
                      onChange={(e) => handleStoryFieldChange(field.key, e.target.value)}
                      className="bg-white border border-[#171717] rounded-[20px] px-5 py-3 text-sm text-[#616161] focus:outline-none"
                      style={{ flexBasis: '130px', flexGrow: 1, minWidth: '120px' }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-[#171717]">Email address</p>
                <input
                  type="email"
                  placeholder="Email address"
                  value={storyForm.email}
                  onChange={(e) => handleStoryFieldChange('email', e.target.value)}
                  className="bg-white border border-[#171717] rounded-[20px] px-5 py-3 text-sm text-[#616161] focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-[#171717]">Country</p>
                <div className="relative w-full">
                  <button
                    type="button"
                    onClick={() => setIsCountryDropdownOpen((prev) => !prev)}
                    className="flex items-center justify-between w-full px-5 py-3 bg-white border border-[#171717] rounded-[20px] hover:bg-gray-50 focus:outline-none"
                  >
                    <div className="flex items-center gap-2 text-sm text-[#616161]">
                      {selectedCountryOption ? (
                        <>
                          <img
                            src={`https://flagcdn.com/w20/${selectedCountryOption.code.toLowerCase()}.png`}
                            alt={`${selectedCountryOption.name} flag`}
                            className="w-5 h-4 object-cover rounded-sm"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                          <span>{selectedCountryOption.name}</span>
                        </>
                      ) : (
                        <span>Select country</span>
                      )}
                    </div>
                    <svg
                      className={`w-4 h-4 text-[#171717] transition-transform duration-200 ${isCountryDropdownOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isCountryDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-2xl shadow-xl z-50 max-h-60 overflow-y-auto">
                      <div className="py-1">
                        <button
                          type="button"
                          onClick={() => {
                            handleStoryFieldChange('country', '');
                            setIsCountryDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 text-sm"
                        >
                          <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${!storyForm.country ? 'border-[#653a96] bg-[#653a96]' : 'border-gray-300'}`}>
                            {!storyForm.country && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <span>Select country</span>
                        </button>
                        {COUNTRY_OPTIONS.map((country) => (
                          <button
                            type="button"
                            key={country.code}
                            onClick={() => {
                              handleStoryFieldChange('country', country.name);
                              setIsCountryDropdownOpen(false);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 text-sm"
                          >
                            <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${storyForm.country === country.name ? 'border-[#653a96] bg-[#653a96]' : 'border-gray-300'}`}>
                              {storyForm.country === country.name && (
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <img
                              src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                              alt={`${country.name} flag`}
                              className="w-5 h-4 object-cover rounded-sm"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                            <span>{country.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-[#171717]">Designation</p>
                <input
                  type="text"
                  placeholder="Designation"
                  value={storyForm.designation}
                  onChange={(e) => handleStoryFieldChange('designation', e.target.value)}
                  className="bg-white border border-[#171717] rounded-[20px] px-5 py-3 text-sm text-[#616161] focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-[#171717]">Upload Video</p>
                <label
                  htmlFor="storyVideo"
                  className="flex items-center justify-between bg-white border border-[#171717] rounded-[20px] px-5 py-3 text-sm text-[#616161] cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border border-[#171717] flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M12 5v14M5 12h14" stroke="#616161" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                    <span className="truncate max-w-[200px]">{videoFile ? videoFile.name : 'Upload Video (max 5 MB)'}</span>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M6 15l6-6 6 6" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </label>
                <input
                  id="storyVideo"
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => handleVideoChange(e.target.files?.[0])}
                />
                {videoError && <p className="text-xs text-red-600">{videoError}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-[#171717]">Quote</p>
                <textarea
                  rows={4}
                  placeholder={t('stories.quotePlaceholder')}
                  value={storyForm.quote}
                  onChange={(e) => handleStoryFieldChange('quote', e.target.value)}
                  className="bg-white border border-[#171717] rounded-[20px] px-5 py-3 text-sm text-[#616161] focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="bg-[#653A96] text-white px-10 py-3 rounded-[30px] text-sm font-medium flex items-center gap-2 disabled:opacity-60"
                  style={{ fontFamily: SUBMIT_FONT }}
                  disabled={isSubmittingStory}
                >
                  {isSubmittingStory ? (t('common.sending') || 'Submitting...') : (t('common.submit') || 'Submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="md:p-8 pt-2 bg-white">
        {/* Hero Video Section - Bigger with Real Data */}
        <div className="mb-8 md:mb-8 mb-0">
          <div className="relative w-full md:h-[600px] h-[567px] md:rounded-3xl rounded-none overflow-hidden">
            {/* Loading State */}
            {storiesLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-gray-500 text-xl">{t('stories.loading')}</div>
              </div>
            )}

            {/* Error State */}
            {storiesError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-red-500 text-xl">{t('stories.error')}</div>
              </div>
            )}

            {/* Featured Story Display */}
            {!storiesLoading && !storiesError && featuredStories.length > 0 && (
              <>
                {/* Background Image */}
                <div className="relative w-full h-full bg-gray-100">
                  {(featuredStories[currentStoryIndex].post_thumbnail_url && featuredStories[currentStoryIndex].post_thumbnail_url.trim() !== '') || 
                   (featuredStories[currentStoryIndex].post_banner_url && featuredStories[currentStoryIndex].post_banner_url.trim() !== '') ? (
                    <img
                      src={featuredStories[currentStoryIndex].post_thumbnail_url || featuredStories[currentStoryIndex].post_banner_url}
                      alt={featuredStories[currentStoryIndex].post_title}
                      className="w-full h-full md:object-contain object-cover"
                      onError={(e) => {
                        e.target.src = '/assets/story-vdo.png';
                      }}
                    />
                  ) : (
                    <Image
                      src="/assets/story-vdo.png"
                      alt={t('stories.successStory')}
                      fill
                      className="md:object-contain object-cover"
                    />
                  )}
                </div>

                {/* Clickable Overlay - Makes entire hero section clickable */}
                <div 
                  className="absolute inset-0 cursor-pointer"
                  onClick={() => handleStoryClick(featuredStories[currentStoryIndex])}
                >
                  {/* Gradient Overlay - Mobile: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.9) 100%) */}
                  <div className="absolute inset-0 md:bg-gradient-to-t md:from-black/60 md:to-transparent" 
                    style={{
                      background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.9) 100%)'
                    }}
                  ></div>

                  {/* Content Overlay - Desktop */}
                  <div className="hidden md:block absolute bottom-16 left-8 right-8 text-white" style={{ paddingBottom: '20px' }}>
                    <div className="flex flex-col gap-5">
                      {/* Quote Section */}
                      <div className="flex gap-3 items-start">
                        <div className="flex-shrink-0" style={{ 
                          width: '40px',
                          height: '40px',
                          display: 'flex',
                          alignItems: 'flex-start',
                          paddingTop: '0px',
                          marginTop: '-8px'
                        }}>
                          <img
                            src="/assets/comma.svg"
                            alt="Quote mark"
                            style={{ 
                              width: '32px',
                              height: '32px',
                              objectFit: 'contain',
                              filter: 'brightness(0) invert(1)'
                            }}
                          />
                        </div>
                        <p className="text-white flex-1" style={{ 
                          fontFamily: 'Inter, sans-serif', 
                          fontWeight: 400, 
                          fontSize: '20px', 
                          lineHeight: '30px',
                          paddingTop: '0px'
                        }}>
                          {featuredStories[currentStoryIndex].post_short_desc || 
                           featuredStories[currentStoryIndex].post_desc?.replace(/<[^>]*>/g, '').substring(0, 300) + '...'}
                        </p>
                      </div>
                      
                      {/* Name and Designation - One Column, Left Aligned */}
                      <div className="flex flex-col items-start gap-5" style={{ marginLeft: '52px' }}>
                        <span className="text-white" style={{ 
                          fontFamily: 'Inter, sans-serif', 
                          fontWeight: 400, 
                          fontSize: '22px', 
                          lineHeight: '26px' 
                        }}>
                          {featuredStories[currentStoryIndex].post_title}
                        </span>
                        {featuredStories[currentStoryIndex].post_designation && (
                          <span className="text-white" style={{ 
                            fontFamily: 'Inter, sans-serif', 
                            fontWeight: 400, 
                            fontSize: '16px', 
                            lineHeight: '20px' 
                          }}>
                            {featuredStories[currentStoryIndex].post_designation}
                            {featuredStories[currentStoryIndex].post_company && (
                              <> • {featuredStories[currentStoryIndex].post_company}</>
                            )}
                          </span>
                        )}
                        {!featuredStories[currentStoryIndex].post_designation && featuredStories[currentStoryIndex].post_company && (
                          <span className="text-white" style={{ 
                            fontFamily: 'Inter, sans-serif', 
                            fontWeight: 400, 
                            fontSize: '16px', 
                            lineHeight: '20px' 
                          }}>
                            {featuredStories[currentStoryIndex].post_company}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Mobile Content Overlay - Quote Style */}
                  <div className="md:hidden absolute bottom-0 left-0 right-0 pb-20 px-6 text-white">
                    <div className="flex flex-col gap-5" style={{ width: '100%', maxWidth: '320px' }}>
                      {/* Quote Section */}
                      <div className="flex gap-3 items-start">
                        <div className="flex-shrink-0" style={{ 
                          width: '40px',
                          height: '40px',
                          display: 'flex',
                          alignItems: 'flex-start',
                          paddingTop: '0px',
                          marginTop: '-8px'
                        }}>
                          <img
                            src="/assets/comma.svg"
                            alt="Quote mark"
                            style={{ 
                              width: '30px',
                              height: '30px',
                              objectFit: 'contain',
                              filter: 'brightness(0) invert(1)'
                            }}
                          />
                        </div>
                        <p className="text-white flex-1" style={{ 
                          fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', 
                          fontWeight: 400, 
                          fontSize: '20px', 
                          lineHeight: '24px',
                          paddingTop: '0px'
                        }}>
                          {featuredStories[currentStoryIndex].post_short_desc || 
                           featuredStories[currentStoryIndex].post_desc?.replace(/<[^>]*>/g, '').substring(0, 150) + '...'}
                        </p>
                      </div>
                      
                      {/* Name and Designation - One Column, Left Aligned */}
                      <div className="flex flex-col items-start gap-2 ml-[52px] mb-[20px]">
                        <span className="text-white" style={{ 
                          fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', 
                          fontWeight: 400, 
                          fontSize: '18px', 
                          lineHeight: '22px' 
                        }}>
                          {featuredStories[currentStoryIndex].post_title}
                        </span>
                        {featuredStories[currentStoryIndex].post_designation && (
                          <span className="text-white" style={{ 
                            fontFamily: 'Inter, sans-serif', 
                            fontWeight: 400, 
                            fontSize: '14px', 
                            lineHeight: '17px' 
                          }}>
                            {featuredStories[currentStoryIndex].post_designation}
                            {featuredStories[currentStoryIndex].post_company && (
                              <> • {featuredStories[currentStoryIndex].post_company}</>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Indicators - Desktop Only */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:flex gap-5">
                  {featuredStories.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentStoryIndex(index)}
                      className={`h-1 rounded transition-all duration-300 ${
                        index === currentStoryIndex ? 'bg-[#653a96] w-[60px]' : 'bg-gray-400 w-[60px]'
                      }`}
                    />
                  ))}
                </div>

                {/* Mobile Progress Indicators - Positioned below content with gap */}
                <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-5">
                  {featuredStories.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1 rounded transition-all duration-300 ${
                        index === currentStoryIndex ? 'bg-[#653a96] w-[60px]' : 'bg-[#D9D9D9] w-[60px]'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Fallback when no stories with images */}
            {!storiesLoading && !storiesError && featuredStories.length === 0 && (
              <>
                <Image
                  src="/assets/story-vdo.png"
                  alt="Success Story Video"
                  fill
                  className="object-contain"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                {/* Content Overlay */}
                <div className="absolute bottom-8 left-8 text-white">
                  <h3 className="text-xl font-medium mb-2">{t('stories.successStory')}</h3>
                  <p className="text-sm opacity-90 mb-4">{t('stories.watchInspiring')}</p>
                  <div className="flex items-center space-x-2 text-sm">
                    <span>{t('stories.sampleCountry')}</span>
                    <span>•</span>
                    <span>{t('stories.memberSince')}</span>
                  </div>
                </div>
                {/* Progress Indicators - Desktop Only */}
                <div className="absolute bottom-4 right-8 hidden md:flex space-x-2">
                  <div className="w-4 h-1 bg-[#653a96] rounded"></div>
                  <div className="w-4 h-1 bg-gray-400 rounded"></div>
                  <div className="w-4 h-1 bg-gray-400 rounded"></div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Content Sections */}
        <div className="md:space-y-8 space-y-6">
          {/* Stories by our partners section */}
          <div className="md:p-0 px-4 md:mt-0 mt-[100px]">
            <h2 className="md:text-5xl text-[36px] font-serif text-black md:mb-12 mb-10 md:font-bold font-normal" style={{
              fontFamily: 'DM Serif Display, sans-serif',
              fontWeight: 500,
              fontSize: '36px',
              lineHeight: '44px',
              textAlign: 'center'
            }}>
              {t('stories.byPartners')}
            </h2>
            
            {/* Partner Stories - Desktop Grid */}
            {!storiesLoading && !storiesError && (
              <div className="space-y-8">
                {/* Desktop Grid - Hidden on mobile */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {displayedStories.map((story) => (
                    <div 
                      key={story.id} 
                      className="bg-gray-50 rounded-3xl overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                      onClick={() => handleStoryClick(story)}
                    >
                      {/* Video/Image Section - Full width */}
                      <div className="relative w-full h-64">
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
                          <Image
                            src="/assets/success-1.png"
                            alt={story.post_title}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="p-6 space-y-4">
                        <p className="text-gray-800 text-sm leading-relaxed">
                          {story.post_short_desc || 
                           story.post_desc?.replace(/<[^>]*>/g, '').substring(0, 120) + '...' ||
                           t('homepage.sections.inspiringSuccessStory')}
                        </p>
                        <div>
                          <h3 className="text-lg font-medium text-black">{story.post_title}</h3>
                          <p className="text-sm text-gray-600">
                            {story.post_designation || story.post_company || t('homepage.sections.communityMember')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mobile Horizontal Scroll - Show on mobile only */}
                <div className="md:hidden">
                  <div className="relative overflow-hidden group">
                    {/* Left Arrow Button - Mobile */}
                    <button
                      onClick={scrollPartnerStoriesLeft}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full p-3 shadow-lg border border-gray-300 hover:border-gray-400 transition-all duration-200 active:scale-95"
                    >
                      <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    {/* Right Arrow Button - Mobile */}
                    <button
                      onClick={scrollPartnerStoriesRight}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full p-3 shadow-lg border border-gray-300 hover:border-gray-400 transition-all duration-200 active:scale-95"
                    >
                      <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    <div 
                      ref={partnerStoriesScrollRefMobile}
                      className="overflow-x-auto scrollbar-hide"
                      style={{ 
                        scrollbarWidth: 'none', 
                        msOverflowStyle: 'none',
                        scrollBehavior: 'smooth'
                      }}
                    >
                      <div className="flex">
                        {displayedStories.map((story, index) => (
                          <div key={`partner-${story.id}-${index}`} className="flex-shrink-0 w-[359px] mx-2">
                            <div 
                              className="bg-[#F5F5F5] rounded-[30px] overflow-hidden text-center h-full cursor-pointer"
                              style={{ padding: '30px 20px' }}
                              onClick={() => handleStoryClick(story)}
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
                                    fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', 
                                    fontWeight: 400, 
                                    fontSize: '24px', 
                                    lineHeight: '29px' 
                                  }}>
                                    {story.post_title}
                                  </h4>
                                  <p className="text-[#616161]" style={{ 
                                    fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', 
                                    fontWeight: 400, 
                                    fontSize: '16px', 
                                    lineHeight: '19px' 
                                  }}>
                                    {story.post_designation || story.post_company || t('homepage.sections.communityMember')}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* More Button - Show only if there are more than 8 stories and not showing all */}
                {!showAllStories && partnerStories.length > 8 && (
                  <div className="text-center mt-6 md:mt-8">
                    <button
                      onClick={() => setShowAllStories(true)}
                      className="bg-[#653a96] text-white px-4 py-2.5 md:px-8 md:py-3 rounded-full font-medium hover:bg-[#4f287b] transition-colors duration-200 shadow-lg hover:shadow-xl text-sm md:text-base"
                      style={{
                        fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                        fontWeight: 500,
                        minWidth: '160px'
                      }}
                    >
                      {t('common.showMore')} ({partnerStories.length - 8} {t('stories.more')})
                    </button>
                  </div>
                )}
                
                {/* Show Less Button - Show only if showing all stories */}
                {showAllStories && partnerStories.length > 8 && (
                  <div className="text-center mt-10 md:mt-8">
                    <button
                      onClick={() => setShowAllStories(false)}
                      className="bg-gray-500 text-white px-4 py-2.5 md:px-8 md:py-3 rounded-full font-medium hover:bg-gray-600 transition-colors duration-200 shadow-lg hover:shadow-xl text-sm md:text-base"
                      style={{
                        fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                        fontWeight: 500,
                        minWidth: '120px'
                      }}
                    >
                      {t('common.showLess')}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Loading State */}
            {storiesLoading && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">{t('stories.loading')}</div>
              </div>
            )}

            {/* Error State */}
            {storiesError && (
              <div className="text-center py-12">
                <div className="text-red-500 text-lg mb-4">{t('stories.error')}: {storiesError}</div>
                <button 
                  onClick={() => window.location.reload()}
                  className="text-[#653a96] hover:underline"
                >
                  {t('common.tryAgain')}
                </button>
              </div>
            )}
          </div>

          {/* Call to Action */}
          {/* <div className="bg-gradient-to-r from-[#653a96] to-[#4f287b] rounded-2xl p-6 md:p-8 text-white text-center mt-6 md:mt-8 mx-4 md:mx-0">
            <h2 className="text-2xl md:text-3xl font-serif mb-3 md:mb-4" style={{
              fontFamily: 'DM Serif Display',
              fontWeight: 500
            }}>{t('stories.beNext')}</h2>
            <p className="text-base md:text-lg mb-5 md:mb-6 opacity-90" style={{
              fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
              fontWeight: 400
            }}>{t('stories.joinCommunity')}</p>
            <button className="bg-[#fecb07] text-gray-900 px-6 py-2.5 md:px-8 md:py-3 rounded-full font-medium hover:bg-[#e6b800] transition-colors duration-200 shadow-lg hover:shadow-xl text-sm md:text-base" style={{
              fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
              fontWeight: 600,
              minWidth: '160px'
            }}>
              {t('stories.joinToday')}
            </button>
          </div> */}
        </div>

        {/* Story Detail Modal */}
        {isModalOpen && selectedStory && (
          <div 
            className="fixed inset-0 z-50 bg-black bg-opacity-60"
            onClick={closeModal}
          >
            <div 
              className="fixed md:relative md:inset-auto md:mx-auto md:my-auto rounded-2xl shadow-2xl w-[calc(100vw-32px)] h-[calc(100vh-32px)] md:w-auto md:max-w-4xl md:max-h-[95vh] md:h-[90vh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'fixed',
                top: '16px',
                left: '16px',
                right: '16px',
                bottom: '16px',
                width: 'calc(100vw - 32px)',
                height: 'calc(100vh - 32px)'
              }}
            >
              {/* Close Button - Always visible and prominent - Outside content area */}
              <button
                onClick={closeModal}
                className="absolute z-[10000] w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center text-gray-900 hover:bg-red-100 hover:text-red-600 transition-all duration-200 shadow-lg border border-gray-300"
                aria-label="Close modal"
                style={{ 
                  zIndex: 10000,
                  position: 'absolute',
                  top: '20px',
                  right: '20px'
                }}
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Blurred Background Image */}
              <div className="absolute inset-0 z-0">
                {(selectedStory.post_thumbnail_url && selectedStory.post_thumbnail_url.trim() !== '') || 
                 (selectedStory.post_banner_url && selectedStory.post_banner_url.trim() !== '') ? (
                  <img
                    src={selectedStory.post_thumbnail_url || selectedStory.post_banner_url}
                    alt={selectedStory.post_title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/assets/success-1.png';
                    }}
                  />
                ) : (
                  <Image
                    src="/assets/success-1.png"
                    alt={selectedStory.post_title}
                    fill
                    className="object-cover"
                  />
                )}
                {/* Blur overlay - Increased opacity for better text readability */}
                <div className="absolute inset-0 backdrop-blur-md bg-white/70"></div>
              </div>

              {/* Content Section - Scrollable - Starts from top */}
              <div className="relative z-10 flex-1 h-[60vh]  flex flex-col overflow-y-auto p-4 md:p-8 pt-20 mt-10 md:pt-12">
                {/* Title */}
                <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
                  {selectedStory.post_title}
                </h2>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4 md:mb-6 text-xs md:text-sm text-gray-700">
                  {selectedStory.post_designation && (
                    <span className="font-medium">{selectedStory.post_designation}</span>
                  )}
                  {selectedStory.post_company && (
                    <>
                      {selectedStory.post_designation && <span>•</span>}
                      <span>{selectedStory.post_company}</span>
                    </>
                  )}
                  {selectedStory.post_country && (
                    <>
                      {(selectedStory.post_designation || selectedStory.post_company) && <span>•</span>}
                      <span>{selectedStory.post_country}</span>
                    </>
                  )}
                </div>

                {/* Short Description */}
                {selectedStory.post_short_desc && (
                  <p className="text-base md:text-lg text-gray-800 mb-4 md:mb-6 leading-relaxed font-medium">
                    {selectedStory.post_short_desc}
                  </p>
                )}

                {/* Full Description - Scrollable - Full Height */}
                {selectedStory.post_desc && (
                  <div className="mb-4 md:mb-6 flex-1 overflow-y-auto">
                    <div 
                      className="text-gray-800 leading-relaxed text-sm md:text-base space-y-3 md:space-y-4"
                      style={{
                        paddingRight: '4px'
                      }}
                    >
                      {selectedStory.post_desc
                        .replace(/<[^>]*>/g, '') // Remove HTML tags
                        .split(/\r\n|\r|\n/) // Split by line breaks
                        .filter(line => line.trim().length > 0) // Remove empty lines
                        .map((paragraph, index) => (
                          <p key={index} className="mb-3 md:mb-4 last:mb-0">
                            {paragraph.trim()}
                          </p>
                        ))}
                    </div>
                  </div>
                )}

                {/* Additional Details */}
                {(selectedStory.post_email || selectedStory.post_phone || selectedStory.post_website) && (
                  <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-300">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Contact Information</h3>
                    <div className="space-y-2 text-xs md:text-sm text-gray-700">
                      {selectedStory.post_email && (
                        <div className="flex flex-col md:flex-row md:items-center">
                          <span className="font-medium mr-2 mb-1 md:mb-0">Email:</span>
                          <a href={`mailto:${selectedStory.post_email}`} className="text-[#653a96] hover:underline font-medium break-all">
                            {selectedStory.post_email}
                          </a>
                        </div>
                      )}
                      {selectedStory.post_phone && (
                        <div className="flex flex-col md:flex-row md:items-center">
                          <span className="font-medium mr-2 mb-1 md:mb-0">Phone:</span>
                          <a href={`tel:${selectedStory.post_phone}`} className="text-[#653a96] hover:underline font-medium">
                            {selectedStory.post_phone}
                          </a>
                        </div>
                      )}
                      {selectedStory.post_website && (
                        <div className="flex flex-col md:flex-row md:items-center">
                          <span className="font-medium mr-2 mb-1 md:mb-0">Website:</span>
                          <a 
                            href={selectedStory.post_website.startsWith('http') ? selectedStory.post_website : `https://${selectedStory.post_website}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[#653a96] hover:underline font-medium break-all"
                          >
                            {selectedStory.post_website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      
      </div>
      {showSubmitToast && submitResult && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4" role="status" aria-live="polite">
          <div
            className={`flex items-start gap-3 w-[360px] max-w-[90vw] shadow-lg rounded-md border px-4 py-3 ${
              submitResult.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}
            style={{ fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif' }}
          >
            <div className={`mt-0.5 ${submitResult.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {submitResult.type === 'success' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.172 7.707 8.879a1 1 0 10-1.414 1.414L9 13l4.707-4.707z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M18 10A8 8 0 11.001 10 8 8 0 0118 10zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 10-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <div className="flex-1 text-sm text-black/80">{submitResult.message}</div>
            <button
              type="button"
              aria-label="Close"
              onClick={() => setShowSubmitToast(false)}
              className={`ml-2 p-1 rounded hover:bg-black/5 ${submitResult.type === 'success' ? 'text-green-700' : 'text-red-700'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
