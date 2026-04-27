import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { authAPI } from '../../lib/api';

export default function VerifyCode() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [resending, setResending] = useState(false);
  const inputsRef = useRef([]);
  const [backgroundImage, setBackgroundImage] = useState('/assets/auth/Rectangle 2.png');

  useEffect(() => {
    const stored = sessionStorage.getItem('resetEmail');
    if (stored) setEmail(stored);
  }, []);

  // Fetch verify-code page background image
  useEffect(() => {
    const fetchPageImage = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page-images`);
        if (response.ok) {
          const data = await response.json();
          const pageImage = data.data?.find(img => img.page_name === 'verify-code' && img.is_active);
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

  const handleChange = (idx, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...code];
    next[idx] = value;
    setCode(next);
    if (value && inputsRef.current[idx + 1]) {
      inputsRef.current[idx + 1].focus();
    }
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !code[idx] && inputsRef.current[idx - 1]) {
      const prevIdx = idx - 1;
      const next = [...code];
      next[prevIdx] = '';
      setCode(next);
      inputsRef.current[prevIdx].focus();
      e.preventDefault();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const next = [...code];
    for (let i = 0; i < 6; i++) {
      next[i] = pasted[i] || '';
    }
    setCode(next);
    const focusIdx = Math.min(pasted.length, 5);
    if (inputsRef.current[focusIdx]) inputsRef.current[focusIdx].focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = code.join('');
    if (otp.length === 6) {
      // Store OTP in sessionStorage for reset-password page
      sessionStorage.setItem('resetOTP', otp);
      router.push('/auth/reset-password');
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    try {
      await authAPI.forgotPassword(email);
      // Reset code input
      setCode(['', '', '', '', '', '']);
      if (inputsRef.current[0]) inputsRef.current[0].focus();
    } catch (err) {
      console.error('Resend OTP error:', err);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background (Rectangle 2) */}
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

      {/* Code Entry Card */}
      <div className="absolute left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-[110px] top-36 md:top-[120px] bg-white rounded-[30px] md:rounded-[50px] p-6 md:p-12 shadow-xl z-10 w-[calc(100%-2rem)] md:w-full max-w-[520px]" style={{ minHeight: '380px' }}>
        <div className="mb-2">
          <h1 className="text-[#2b2d30] mb-4 text-[28px] md:text-[48px]" style={{ fontFamily: 'DM Serif Display', fontWeight: 400, fontSize: 'clamp(28px, 6vw, 48px)', lineHeight: '1.2' }}>Enter the code</h1>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-6">
          <span className="text-xs md:text-sm break-all" style={{ fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 400 }}> {email} </span>
          <button type="button" onClick={() => router.push('/auth/forgot-password')} className="flex items-center gap-1 text-[#653a96]">
            <Image src="/assets/auth/Vector.png" alt="Update" width={16} height={16} className="md:w-5 md:h-5" />
             <span style={{ fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 500, fontSize: '13px' }} className='pl-1'>Update</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-[#2b2d30]" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '14px', lineHeight: '17px' }}>
            Verification Code
          </label>
          <div className="flex gap-2 md:gap-2 mb-6 md:mb-8 justify-center md:justify-start" onPaste={handlePaste}>
            {code.map((c, i) => (
              <input
                key={i}
                value={c}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                ref={(el) => (inputsRef.current[i] = el)}
                className="w-[45px] h-[45px] md:w-[60px] md:h-[60px] rounded-[15px] md:rounded-[20px] border border-[#2B2D30] text-center"
                style={{ fontFamily: 'Inter', fontSize: 'clamp(14px, 3vw, 16px)', lineHeight: '19px', color: '#2B2D30' }}
                inputMode="numeric"
                maxLength={1}
              />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-10 mt-4">
            <button type="submit" className="bg-[#653a96] text-white rounded-[30px] px-[30px] py-[12px] w-full sm:w-auto" style={{ minWidth: '113px', height: '44px', fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 500, fontSize: '16px', lineHeight: '20px' }}>
              Submit
            </button>
            <button type="button" disabled={resending} onClick={handleResend} className="text-[#653a96] text-center sm:text-left" style={{ fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', fontWeight: 500, fontSize: '14px', lineHeight: '17px' }}>
              {resending ? 'Sending...' : 'Send again'}
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


