import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { authAPI } from '../../lib/api';

export default function VerifyOTP() {
  const router = useRouter();
  const { email } = router.query;
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [backgroundImage, setBackgroundImage] = useState('/assets/Rectangle 2.png');

  // Fetch verify-otp page background image
  useEffect(() => {
    const fetchPageImage = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page-images`);
        if (response.ok) {
          const data = await response.json();
          const otpImage = data.data?.find(img => img.page_name === 'verify-otp' && img.is_active);
          if (otpImage?.image_url) {
            setBackgroundImage(otpImage.image_url);
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

  // Handle OTP input
  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split('');
    setOtp([...newOtp, ...Array(6 - newOtp.length).fill('')]);
    
    // Focus last filled input
    const lastIndex = Math.min(pastedData.length - 1, 5);
    const lastInput = document.getElementById(`otp-${lastIndex}`);
    if (lastInput) lastInput.focus();
  };

  // Auto-submit when all 6 digits are filled
  useEffect(() => {
    const otpString = otp.join('');
    if (otpString.length === 6) {
      handleVerifyOTP(otpString);
    }
  }, [otp]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Verify OTP
  const handleVerifyOTP = async (otpCode = null) => {
    const otpString = otpCode || otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authAPI.verifyOTP({
        email: email,
        otp: otpString
      });

      if (response.success && response.data.token) {
        // Store token in localStorage - using 'token' key for admin panel compatibility
        localStorage.setItem('token', response.data.token); // Changed from 'authToken' to 'token'
        localStorage.setItem('authToken', response.data.token); // Keep for backward compatibility
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Check if user is admin (email === 'admin')
        const userEmail = response.data.user?.email?.toLowerCase();
        const isAdmin = userEmail === 'admin';

        if (isAdmin) {
          // Admin user - redirect to admin dashboard
          console.log('✅ Admin user - redirecting to admin panel...');
          router.push('/admin');
        } else {
          // Regular user - redirect to onboarding first, then dashboard
          console.log('✅ Regular user - redirecting to onboarding...');
          router.push('/dashboard/onboarding');
        }
      } else {
        setError('Invalid OTP. Please try again.');
        setOtp(['', '', '', '', '', '']);
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      setError(err.message || 'Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;

    setResending(true);
    setError('');

    try {
      const response = await authAPI.resendOTP(email);
      
      if (response.success) {
        setResendCooldown(60); // 60 seconds cooldown
        setOtp(['', '', '', '', '', '']);
        // Focus first input
        const firstInput = document.getElementById('otp-0');
        if (firstInput) firstInput.focus();
      } else {
        setError('Failed to resend OTP. Please try again.');
      }
    } catch (err) {
      console.error('Resend OTP error:', err);
      setError(err.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setResending(false);
    }
  };

  // Redirect if no email in query
  useEffect(() => {
    if (!email && router.isReady) {
      router.push('/auth/login');
    }
  }, [email, router.isReady]);

  if (!email) return null;

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
            width={125}
            height={50}
            className="w-28 h-14 md:w-40 md:h-20 object-contain"
          />
        </div>
      </Link>

      {/* Back Button */}
      <Link href="/auth/login">
        <div className="absolute top-20 left-4 md:top-[112px] md:left-[57px] z-20 flex items-center gap-2 md:gap-3 cursor-pointer">
          <svg width="28" height="28" className="md:w-[34px] md:h-[34px]" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M28.3346 15.5827H11.0938L19.013 7.66352L17.0013 5.66602L5.66797 16.9993L17.0013 28.3327L18.9988 26.3352L11.0938 18.416H28.3346V15.5827Z" fill="#FFFFFF"/>
          </svg>
          <span className="text-white font-medium text-sm md:text-lg" style={{ fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: '16px',
            lineHeight: '19.54px'
          }}>Go back</span>
        </div>
      </Link>

      {/* OTP Verification Card */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:top-[75px] md:translate-y-0 md:left-auto md:right-[100px] w-[calc(100%-2rem)] md:w-[620px] max-w-[620px] bg-white rounded-[30px] md:rounded-[40px] p-6 md:p-12 shadow-xl z-10" style={{ height: 'auto', minHeight: 'auto' }}>
        {/* Title */}
        <h1 
          className="text-[#2b2d30] mb-6 md:mb-16"
          style={{
            fontFamily: 'DM Serif Display',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: 'clamp(28px, 7vw, 56px)',
            lineHeight: '1.2'
          }}
        >
          Enter the OTP
        </h1>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* OTP Input Section */}
        <div className="mb-8 md:mb-12">
          {/* OTP Label */}
          <label className="block mb-2 md:mb-3 text-[#2b2d30]" style={{
            fontFamily: 'Inter',
            fontWeight: 500,
            fontSize: '14px',
            lineHeight: '20px'
          }}>
            OTP
          </label>
          
          {/* OTP Input Fields */}
          <div className="flex gap-1.5 md:gap-3 justify-center md:justify-start">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                disabled={loading}
                className="w-[44px] h-[44px] md:w-[75px] md:h-[75px] text-center bg-white border-2 border-[#2b2d30] rounded-[12px] md:rounded-[20px] focus:outline-none focus:border-[#653a96] focus:ring-2 focus:ring-[#653a96] disabled:opacity-50 disabled:bg-gray-50"
                style={{
                  fontFamily: 'Inter',
                  fontWeight: 500,
                  fontSize: 'clamp(16px, 4vw, 24px)',
                  lineHeight: '1.2',
                  color: '#2B2D30'
                }}
              />
            ))}
          </div>
        </div>

        {/* Submit Button and Resend OTP */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 md:gap-0">
          {/* Resend OTP - Left */}
          <p className="text-[#2b2d30] text-sm md:text-base text-center md:text-left" style={{
            fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '20px'
          }}>
            Didn't receive the code?{' '}
            <button
              onClick={handleResendOTP}
              disabled={resending || resendCooldown > 0 || loading}
              className="text-[#653a96] hover:text-[#4a2470] underline transition-colors duration-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:no-underline"
              style={{
                fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '20px'
              }}
            >
              {resending ? 'Sending...' : resendCooldown > 0 ? `Resend OTP (${resendCooldown}s)` : 'Resend OTP'}
            </button>
          </p>

          {/* Submit Button - Right */}
          <button
            onClick={() => handleVerifyOTP()}
            disabled={loading || otp.join('').length !== 6}
            className="bg-[#653a96] text-white border border-[#2b2d30] rounded-[30px] hover:bg-[#4a2470] transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed w-full md:w-auto"
            style={{
              fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
              fontWeight: 500,
              fontSize: '18px',
              lineHeight: '22px',
              padding: '12px 40px',
              minWidth: '140px',
              height: '48px'
            }}
          >
            {loading ? 'Verifying...' : 'Submit'}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#653a96] z-10 py-3 px-4">
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-2 max-w-7xl mx-auto">
          {/* Copyright */}
          <div className="flex items-center gap-2 md:gap-3">
            <svg width="20" height="20" className="md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.03 7C9.25 7 7 9.25 7 12.03C7 14.81 9.25 17.06 12.03 17.06C13.58 17.06 14.97 16.35 15.92 15.22L14.36 13.98C13.83 14.62 12.99 15.03 12.03 15.03C10.42 15.03 9.16 13.77 9.16 12.16C9.16 10.55 10.42 9.29 12.03 9.29C12.98 9.29 13.82 9.72 14.35 10.35L15.91 9.12C14.96 7.98 13.58 7.27 12.03 7Z" fill="white"/>
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

