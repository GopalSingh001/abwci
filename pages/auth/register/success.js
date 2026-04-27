import Image from 'next/image';
import Link from 'next/link';

export default function RegisterSuccess() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start pt-20 p-8">
      {/* Success Image */}
      <div className="relative w-full max-w-5xl h-48 mb-8">
        <Image
          src="/assets/signup-success.png"
          alt="Success"
          fill
          className="object-cover rounded-[30px]"
        />
      </div>

      {/* Success Content */}
      <div className="text-center max-w-4xl">
        <h1 
          className="text-[#000000] mb-6"
          style={{
            fontFamily: 'DM Serif Display',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: '36px',
            lineHeight: '49px',
            letterSpacing: '-0.72px',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            textRendering: 'optimizeLegibility'
          }}
        >
          Your Application has been submitted successfully!
        </h1>
        
        <p 
          className="text-[#000000] mb-8"
          style={{
            fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: '16px',
            lineHeight: '19px',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            textRendering: 'optimizeLegibility'
          }}
        >
          We will send you a confirmation mail on your registered email address along with the login credentials, once approved.<br />
          Thank you for showing the interest!
        </p>

        <Link 
          href="/"
          className="inline-flex items-center space-x-2 bg-[#ffc95c] text-[#2b2d30] px-6 py-3 rounded-[30px] font-medium hover:bg-[#e6b800] transition-colors duration-200"
          style={{
            fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
            fontStyle: 'normal',
            fontWeight: 500,
            fontSize: '14px',
            lineHeight: '17px',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            textRendering: 'optimizeLegibility'
          }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          <span>Go back to Website</span>
        </Link>
      </div>
    </div>
  );
}
