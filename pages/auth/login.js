import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { authAPI } from '../../lib/api';
import legalTermsData from '../../data/legal-terms.json';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [backgroundImage, setBackgroundImage] = useState('/assets/antonino-visalli-RNiBLy7aHck-unsplash.jpg');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  // Fetch login page background image
  useEffect(() => {
    const fetchPageImage = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page-images`);
        if (response.ok) {
          const data = await response.json();
          const loginImage = data.data?.find(img => img.page_name === 'login' && img.is_active);
          if (loginImage?.image_url) {
            setBackgroundImage(loginImage.image_url);
          }
        }
      } catch (error) {
        console.log('Error fetching page image, using fallback:', error);
      }
    };
    fetchPageImage();
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      console.log('🔍 Attempting login with:', { email: formData.email, passwordLength: formData.password.length });
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password
      });

      console.log('🔍 Login response:', response);
      console.log('🔍 response.success:', response.success);
      console.log('🔍 response.data:', response.data);
      console.log('🔍 response.data.requiresOTP:', response.data?.requiresOTP);
      console.log('🔍 response.data.token:', response.data?.token ? 'Token exists' : 'No token');

      if (response && response.success) {
        // Check if OTP is required
        if (response.data.requiresOTP === true) {
          // Regular user - redirect to OTP verification page
          console.log('✅ Regular user - redirecting to OTP verification');
          router.push({
            pathname: '/auth/verify-otp',
            query: { email: formData.email }
          });
        } else if (response.data.requiresOTP === false && response.data.token) {
          // Admin user - no OTP required, token provided directly
          console.log('✅ Admin user detected - storing token');
          console.log('Token:', response.data.token);
          console.log('User:', response.data.user);
          
          // Use 'token' key for admin panel compatibility
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('authToken', response.data.token); // Keep for backward compatibility
          localStorage.setItem('user', JSON.stringify(response.data.user));
          
          // Check if user is admin (email === 'admin')
          const userEmail = response.data.user?.email?.toLowerCase();
          const isAdmin = userEmail === 'admin';
          
          if (isAdmin) {
            // Admin user - redirect to admin dashboard
            console.log('✅ Admin user - redirecting to admin panel');
            window.location.href = '/admin';
          } else {
            // Regular user with direct token (shouldn't happen, but handle it)
            console.log('✅ Regular user - redirecting to onboarding');
            window.location.href = '/dashboard/onboarding';
          }
        } else {
          console.log('❌ Unexpected response structure');
          setError('Login failed. Please try again.');
        }
      } else {
        console.log('❌ response.success is false or undefined');
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      console.error('❌ Login error caught:', err);
      console.error('❌ Error details:', {
        message: err.message,
        status: err.status,
        payload: err.payload
      });
      
      // Show more specific error messages
      if (err.payload) {
        setError(err.payload.message || err.payload.error || err.message || 'Invalid email or password');
      } else {
        setError(err.message || 'Invalid email or password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Mobile View - Card Centered */}
      <div className="md:hidden min-h-screen flex items-center justify-center relative bg-white">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundImage}
            alt="Background"
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
        </div>

        {/* Logo - Centered at Top */}
        <Link href="/">
          <div className="absolute top-[25px] left-1/2 -translate-x-1/2 z-20">
            <Image
              src="/assets/footer-new.png"
              alt="ABWCI Logo"
              width={140}
              height={55}
              className="w-[140px] h-[55px] object-contain"
            />
          </div>
        </Link>

        {/* Login Card - Centered */}
        <div className="relative z-10 bg-white rounded-[50px] px-5 py-10 w-[328px] shadow-2xl flex flex-col gap-8">
          {/* Title */}
          <h1 
            className="text-[28px] text-[#2b2d30] text-center"
            style={{
              fontFamily: 'DM Serif Display',
              fontStyle: 'normal',
              fontWeight: 600,
              lineHeight: '1.2',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility'
            }}
          >
            Welcome, Let's Login
          </h1>

          {/* Error Message */}
          {error && (
            <div className="mx-auto w-[288px] p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-5 w-[288px] mx-auto">
            {/* Email Field */}
            <div className="flex flex-col gap-3 w-full">
              <label className="block text-sm font-medium text-[#2b2d30]">
                Email Address
              </label>
              <input
                type="text"
                id="email-mobile"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                className="w-full px-5 py-4 bg-[#f5f5f5] border border-[#d9d9d9] rounded-[30px] text-base text-[#000000] placeholder-[#000000] placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-[#653a96] focus:border-transparent"
                required
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-3 w-full">
              <label htmlFor="password-mobile" className="block text-sm font-medium text-[#2b2d30]">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password-mobile"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="w-full px-5 py-4 bg-[#f5f5f5] border border-[#d9d9d9] rounded-[30px] text-base text-[#000000] placeholder-[#000000] placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-[#653a96] focus:border-transparent pr-12"
                  required
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

            {/* Login Button and Forgot Password */}
            <div className="flex items-center justify-between w-full mt-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#653a96] text-white px-6 py-3 rounded-[30px] font-medium hover:bg-[#4a2470] transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed text-base"
                style={{
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '19.54px'
                }}
              >
                {loading ? 'Processing...' : 'Login'}
              </button>
              <Link 
                href="/auth/forgot-password" 
                className="text-[#2b2d30] text-sm hover:underline"
                style={{
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '19.36px'
                }}
              >
                Forgot Password?
              </Link>
            </div>
          </form>

          {/* New Member Section */}
          <div className="mt-2 space-y-3 w-[288px] mx-auto">
            <p 
              className="text-[#2b2d30] text-center text-sm"
              style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '19.36px'
              }}
            >
              New Member?
            </p>
            <Link 
              href="/auth/register"
              className="block w-full bg-[#ffc045] border border-[#2b2d30] text-[#2b2d30] px-5 py-3 rounded-[30px] font-medium hover:bg-[#e6a800] transition-colors duration-200 text-center text-base"
              style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: '16px',
                lineHeight: '19.54px'
              }}
            >
              Create an Account
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#653a96] z-10 py-3 px-4">
          <div className="flex flex-col items-center gap-2">
            {/* Copyright */}
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.03 7C9.25 7 7 9.25 7 12.03C7 14.81 9.25 17.06 12.03 17.06C13.58 17.06 14.97 16.35 15.92 15.22L14.36 13.98C13.83 14.62 12.99 15.03 12.03 15.03C10.42 15.03 9.16 13.77 9.16 12.16C9.16 10.55 10.42 9.29 12.03 9.29C12.98 9.29 13.82 9.72 14.35 10.35L15.91 9.12C14.96 7.98 13.58 7.27 12.03 7Z" fill="white"/>
              </svg>
              <span 
                className="text-white whitespace-nowrap text-sm"
                style={{
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 400
                }}
              >
                ABWCI 2025 . All Rights Reserved
              </span>
            </div>
            {/* Footer Links */}
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <button 
                onClick={() => {
                  setSelectedPolicy('termsAndConditions');
                  setIsModalOpen(true);
                }}
                className="hover:underline bg-transparent border-none cursor-pointer text-white text-sm whitespace-nowrap"
                style={{
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 400
                }}
              >
                Terms and Conditions
              </button>
              <button 
                onClick={() => {
                  setSelectedPolicy('privacyPolicy');
                  setIsModalOpen(true);
                }}
                className="hover:underline bg-transparent border-none cursor-pointer text-white text-sm whitespace-nowrap"
                style={{
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 400
                }}
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => {
                  setSelectedPolicy('compliancePolicy');
                  setIsModalOpen(true);
                }}
                className="hover:underline bg-transparent border-none cursor-pointer text-white text-sm whitespace-nowrap"
                style={{
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 400
                }}
              >
                Compliance Policy
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop View - Original Layout */}
      <div className="hidden md:flex min-h-screen items-start justify-end relative">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 bg-[#653a96]">
          <Image
            src={backgroundImage}
            alt="Background"
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
        </div>

        {/* Logo - Top Left Corner */}
        <Link href="/">
          <div className="absolute top-6 left-6 z-20">
            <Image
              src="/assets/footer-new.png"
              alt="ABWCI Logo"
              width={80}
              height={80}
              className="w-40 h-20 object-contain"
            />
          </div>
        </Link>

        {/* Login Card - Positioned Right */}
        <div className="relative z-10 bg-white rounded-[50px] p-10 max-w-[491px] mt-24 lg:mt-28 xl:mt-32 mr-6 lg:mr-16 xl:mr-24 2xl:mr-32 shadow-2xl">

          {/* Title */}
          <h1 
            className="text-[40px] text-[#2b2d30] mb-8 text-center"
            style={{
              fontFamily: 'DM Serif Display',
              fontStyle: 'normal',
              fontWeight: 600,
              lineHeight: '1.2',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility'
            }}
          >
            Welcome, Let's Login
          </h1>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-[#2b2d30]">
                Email Address
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                className="w-full px-5 py-4 bg-[#f5f5f5] border border-[#d9d9d9] rounded-[30px] text-base text-[#000000] placeholder-[#000000] placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-[#653a96] focus:border-transparent"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-3">
              <label htmlFor="password" className="block text-sm font-medium text-[#2b2d30]">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="w-full px-5 py-4 bg-[#f5f5f5] border border-[#d9d9d9] rounded-[30px] text-base text-[#000000] placeholder-[#000000] placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-[#653a96] focus:border-transparent pr-12"
                  required
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

            {/* Login Button and Forgot Password */}
            <div className="flex items-center justify-between mt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#653a96] text-white px-8 py-3 rounded-[30px] font-medium hover:bg-[#4a2470] transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed text-base"
                style={{
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '19.54px'
                }}
              >
                {loading ? 'Processing...' : 'Login'}
              </button>
              <Link 
                href="/auth/forgot-password" 
                className="text-[#2b2d30] text-base hover:underline"
                style={{
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '19.36px'
                }}
              >
                Forgot Password?
              </Link>
            </div>
          </form>

          {/* New Member Section */}
          <div className="mt-6 space-y-3">
            <p 
              className="text-[#2b2d30] text-center text-base"
              style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '19.36px'
              }}
            >
              New Member?
            </p>
            <Link 
              href="/auth/register"
              className="block w-full bg-[#ffc045] border border-[#2b2d30] text-[#2b2d30] px-5 py-3 rounded-[30px] font-medium hover:bg-[#e6a800] transition-colors duration-200 text-center text-base"
              style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: '16px',
                lineHeight: '19.54px'
              }}
            >
              Create an Account
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#653a96] py-3 z-10">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center space-x-3 text-white text-base">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.03 7C9.25 7 7 9.25 7 12.03C7 14.81 9.25 17.06 12.03 17.06C13.58 17.06 14.97 16.35 15.92 15.22L14.36 13.98C13.83 14.62 12.99 15.03 12.03 15.03C10.42 15.03 9.16 13.77 9.16 12.16C9.16 10.55 10.42 9.29 12.03 9.29C12.98 9.29 13.82 9.72 14.35 10.35L15.91 9.12C14.96 7.98 13.58 7.27 12.03 7Z" fill="white"/>
              </svg>
              <span className="whitespace-nowrap">ABWCI 2025 . All Rights Reserved</span>
            </div>
            <div className="flex items-center gap-6 text-white text-base">
              <button 
                onClick={() => {
                  setSelectedPolicy('termsAndConditions');
                  setIsModalOpen(true);
                }}
                className="hover:underline whitespace-nowrap bg-transparent border-none cursor-pointer text-white"
              >
                Terms and Conditions
              </button>
              <button 
                onClick={() => {
                  setSelectedPolicy('privacyPolicy');
                  setIsModalOpen(true);
                }}
                className="hover:underline whitespace-nowrap bg-transparent border-none cursor-pointer text-white"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => {
                  setSelectedPolicy('compliancePolicy');
                  setIsModalOpen(true);
                }}
                className="hover:underline whitespace-nowrap bg-transparent border-none cursor-pointer text-white"
              >
                Compliance Policy
              </button>
            </div>
          </div>
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
    </>
  );
}
