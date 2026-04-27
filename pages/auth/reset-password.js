import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { authAPI } from '../../lib/api';

export default function ResetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState('/assets/auth/Rectangle 2.png');

  // Get email and OTP from sessionStorage
  useEffect(() => {
    const storedEmail = sessionStorage.getItem('resetEmail');
    const storedOTP = sessionStorage.getItem('resetOTP');
    
    if (storedEmail) {
      setEmail(storedEmail);
    }
    if (storedOTP) {
      setOtp(storedOTP);
    }
    
    // If email or OTP is missing, redirect back to forgot-password
    if (!storedEmail || !storedOTP) {
      router.push('/auth/forgot-password');
    }
  }, [router]);

  // Fetch reset-password page background image
  useEffect(() => {
    const fetchPageImage = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page-images`);
        if (response.ok) {
          const data = await response.json();
          const pageImage = data.data?.find(img => img.page_name === 'reset-password' && img.is_active);
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
    setError('');
    
    // Validation
    if (!password || !confirm) {
      setError('Please enter both password fields');
      return;
    }
    
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    if (!email || !otp) {
      setError('Session expired. Please start over.');
      router.push('/auth/forgot-password');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await authAPI.resetPassword({
        email: email,
        otp: otp,
        newPassword: password
      });
      
      if (response.success) {
        // Clear sessionStorage
        sessionStorage.removeItem('resetEmail');
        sessionStorage.removeItem('resetOTP');
        
        // Show success modal
        setShowSuccess(true);
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/auth/login?reset=success');
        }, 3000);
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background */}
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

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[30px] p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center">
              {/* Success Icon */}
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              {/* Success Message */}
              <h2 
                className="text-2xl text-[#2b2d30] mb-2"
                style={{ fontFamily: 'DM Serif Display', fontWeight: 400 }}
              >
                Password Updated Successfully!
              </h2>
              <p 
                className="text-gray-600 mb-6"
                style={{ fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: '16px' }}
              >
                Your password has been reset. Redirecting to login page...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Card */}
      <div className="absolute left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-[110px] top-1/2 -translate-y-1/2 bg-white rounded-[30px] md:rounded-[50px] p-6 md:p-10 shadow-xl z-10 w-[calc(100%-2rem)] md:w-full max-w-[491px]" style={{ minHeight: '400px' }}>
        <h1 className="text-[#2b2d30] mb-3 text-[28px] md:text-[48px]" style={{ fontFamily: 'DM Serif Display', fontWeight: 400, fontSize: 'clamp(28px, 6vw, 48px)', lineHeight: '1.2' }}>New Password</h1>
        <p className="mb-6 md:mb-8 text-sm md:text-base" style={{ fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '20px', color: '#000' }}>Enter your new password</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm" style={{ fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block" style={{ fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '17px', color: '#2B2D30' }}>New Password</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={(e)=>setPassword(e.target.value)} 
                placeholder="New Password" 
                className="w-full h-[57px] px-5 pr-12 bg-[#f5f5f5] border border-[#d9d9d9] rounded-[30px] focus:outline-none focus:ring-2 focus:ring-[#653a96]" 
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
          <div className="space-y-2">
            <label className="block" style={{ fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '17px', color: '#2B2D30' }}>Confirm Password</label>
            <div className="relative">
              <input 
                type={showConfirmPassword ? 'text' : 'password'} 
                value={confirm} 
                onChange={(e)=>setConfirm(e.target.value)} 
                placeholder="•••••••••••••••••••" 
                className="w-full h-[57px] px-5 pr-12 bg-[#f5f5f5] border border-[#d9d9d9] rounded-[30px] focus:outline-none focus:ring-2 focus:ring-[#653a96]" 
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
          <div className="flex items-center gap-10 pt-2">
            <button type="submit" disabled={loading || !password || password!==confirm} className="bg-[#653a96] text-white rounded-[30px] px-[30px] py-[12px] disabled:bg-gray-400 w-full md:w-auto" style={{ minWidth: '113px', height: '44px', fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 500, fontSize: '16px', lineHeight: '20px' }}>
              {loading ? 'Saving...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

