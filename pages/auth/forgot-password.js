import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { authAPI } from '../../lib/api';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [backgroundImage, setBackgroundImage] = useState('/assets/antonino-visalli-RNiBLy7aHck-unsplash.jpg');

  // Fetch forgot-password page background image
  useEffect(() => {
    const fetchPageImage = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page-images`);
        if (response.ok) {
          const data = await response.json();
          const pageImage = data.data?.find(img => img.page_name === 'forgot-password' && img.is_active);
          if (pageImage?.image_url) {
            setBackgroundImage(pageImage.image_url);
          }
        }
      } catch (error) {
        // fallback silently
      }
    };
    fetchPageImage();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.forgotPassword(email);

      if (response.success) {
        // Store email for reset password page
        sessionStorage.setItem('resetEmail', email);
        setIsSubmitted(true);

        // Redirect to verification code page after 2 seconds
        setTimeout(() => {
          router.push('/auth/verify-code');
        }, 2000);
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(err.message || 'Failed to send reset code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 bg-[#653a96]">
          <Image
            src={backgroundImage}
            alt="Background"
            fill
            className="object-cover opacity-20"
          />
        </div>

        {/* Success Card */}
        <div className="relative z-10 bg-white rounded-[30px] md:rounded-[50px] p-6 md:p-12 w-full max-w-[491px] mx-4 shadow-2xl text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/assets/login.png"
              alt="ABWCI Logo"
              width={120}
              height={120}
              className="w-30 h-30 object-contain"
            />
          </div>

          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Success Message */}
          <h1
            className="text-[24px] md:text-[32px] text-[#2b2d30] mb-4"
            style={{
              fontFamily: 'DM Serif Display',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: 'clamp(24px, 5vw, 32px)',
              lineHeight: '1.2',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility'
            }}
          >
            Check Your Email
          </h1>

          <p
            className="text-[#2b2d30] mb-6 md:mb-8 text-sm md:text-base"
            style={{
              fontFamily: 'Inter',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '19.36px'
            }}
          >
            We've sent a 6-digit verification code to <strong>{email}</strong>. Please check your email and enter the code on the next page.
          </p>

          <p
            className="text-[#653a96] text-sm mb-8"
            style={{
              fontFamily: 'Inter',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '16.94px'
            }}
          >
            Redirecting to reset password page...
          </p>

          {/* Back to Login */}
          <Link
            href="/auth/login"
            className="inline-block bg-[#653a96] text-white px-8 py-3 rounded-[30px] font-medium hover:bg-[#4a2470] transition-colors duration-200"
            style={{
              fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
              fontStyle: 'normal',
              fontWeight: 500,
              fontSize: '16px',
              lineHeight: '19.54px'
            }}
          >
            Back to Login
          </Link>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#653a96] z-10 py-3 px-4">
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-2 max-w-7xl mx-auto">
            {/* Copyright */}
            <div className="flex items-center gap-2 md:gap-3">
              <svg width="20" height="20" className="md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.03 7C9.25 7 7 9.25 7 12.03C7 14.81 9.25 17.06 12.03 17.06C13.58 17.06 14.97 16.35 15.92 15.22L14.36 13.98C13.83 14.62 12.99 15.03 12.03 15.03C10.42 15.03 9.16 13.77 9.16 12.16C9.16 10.55 10.42 9.29 12.03 9.29C12.98 9.29 13.82 9.72 14.35 10.35L15.91 9.12C14.96 7.98 13.58 7.27 12.03 7Z" fill="white" />
              </svg>
              <span
                className="text-white whitespace-nowrap text-sm md:text-base"
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
            <div className="flex items-center gap-4 md:gap-6 flex-wrap justify-center">
              <Link
                href="/terms"
                className="hover:underline text-white text-sm md:text-base whitespace-nowrap"
                style={{
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 400
                }}
              >
                Terms and Conditions
              </Link>
              <Link
                href="/privacy"
                className="hover:underline text-white text-sm md:text-base whitespace-nowrap"
                style={{
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 400
                }}
              >
                Privacy Policy
              </Link>
              <Link
                href="/compliance"
                className="hover:underline text-white text-sm md:text-base whitespace-nowrap"
                style={{
                  fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 400
                }}
              >
                Compliance Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 bg-[#653a96]">
        <Image
          src={backgroundImage}
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Logo - Top Left */}
      <Link href="/">
        <div className="absolute top-4 left-4 md:top-6 md:left-[58px] z-20 cursor-pointer">
          <Image
            src="/assets/footer-new.png"
            alt="ABWCI Logo"
            width={114}
            height={45}
            className="w-28 h-14 md:w-40 md:h-20 object-contain"
          />
        </div>
      </Link>

      {/* Back Button */}
      <Link href="/auth/login">
        <div className="absolute top-20 left-4 md:top-[112px] md:left-[57px] z-20 flex items-center gap-2 md:gap-3 cursor-pointer">
          <svg width="28" height="28" className="md:w-[34px] md:h-[34px]" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M28.3346 15.5827H11.0938L19.013 7.66352L17.0013 5.66602L5.66797 16.9993L17.0013 28.3327L18.9988 26.3352L11.0938 18.416H28.3346V15.5827Z" fill="#FFFFFF" />
          </svg>
          <span className="text-white font-medium text-sm md:text-lg" style={{
            fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '19.54px'
          }}>Go back</span>
        </div>
      </Link>

      {/* Forgot Password Card */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:top-[120px] md:translate-y-0 md:left-auto md:right-[110px] bg-white rounded-[30px] md:rounded-[50px] p-6 md:p-10 shadow-xl z-10 w-[calc(100%-2rem)] md:w-full max-w-[491px]" style={{ minHeight: 'auto' }}>
        {/* Title */}
        <h1
          className="text-[#2b2d30] mb-4 md:mb-6"
          style={{
            fontFamily: 'DM Serif Display',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: 'clamp(28px, 6vw, 48px)',
            lineHeight: '1.2'
          }}
        >
          Forgot Password?
        </h1>

        <p
          className="text-[#2b2d30] mb-6 md:mb-8 text-sm md:text-base"
          style={{
            fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: '13px',
            lineHeight: '17px'
          }}
        >
          No worries! Enter your email address and we'll send you a verification code to reset your password.
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Forgot Password Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Email Field */}
          <div className="space-y-3">
            <label className="block mb-1 text-[#2b2d30]" style={{
              fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '17px'
            }}>
              Email Address
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full h-[57px] px-5 bg-[#f5f5f5] border border-[#d9d9d9] rounded-[30px] focus:outline-none focus:ring-2 focus:ring-[#653a96]"
              style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontWeight: 400,
                fontSize: '16px',
                color: '#2B2D30'
              }}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-start mt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#653a96] text-white rounded-[30px] hover:bg-[#4a2470] transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed w-full md:w-auto"
              style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '19.54px',
                padding: '12px 30px',
                minWidth: '180px',
                height: '44px'
              }}
            >
              {loading ? 'Sending...' : 'Send Verification Code'}
            </button>
          </div>
        </form>
      </div>
      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#653a96] z-10 py-3 px-4">
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-2 max-w-7xl mx-auto">
          {/* Copyright */}
          <div className="flex items-center gap-2 md:gap-3">
            <svg width="20" height="20" className="md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.03 7C9.25 7 7 9.25 7 12.03C7 14.81 9.25 17.06 12.03 17.06C13.58 17.06 14.97 16.35 15.92 15.22L14.36 13.98C13.83 14.62 12.99 15.03 12.03 15.03C10.42 15.03 9.16 13.77 9.16 12.16C9.16 10.55 10.42 9.29 12.03 9.29C12.98 9.29 13.82 9.72 14.35 10.35L15.91 9.12C14.96 7.98 13.58 7.27 12.03 7Z" fill="white" />
            </svg>
            <span
              className="text-white whitespace-nowrap text-sm md:text-base"
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
          <div className="flex items-center gap-4 md:gap-6 flex-wrap justify-center">
            <Link
              href="/terms"
              className="hover:underline text-white text-sm md:text-base whitespace-nowrap"
              style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontStyle: 'normal',
                fontWeight: 400
              }}
            >
              Terms and Conditions
            </Link>
            <Link
              href="/privacy"
              className="hover:underline text-white text-sm md:text-base whitespace-nowrap"
              style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontStyle: 'normal',
                fontWeight: 400
              }}
            >
              Privacy Policy
            </Link>
            <Link
              href="/compliance"
              className="hover:underline text-white text-sm md:text-base whitespace-nowrap"
              style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontStyle: 'normal',
                fontWeight: 400
              }}
            >
              Compliance Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
