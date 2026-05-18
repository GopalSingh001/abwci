import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { authAPI } from '../../lib/api';
import Image from 'next/image';

export default function UserDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    checkAuth();
  }, []);

  // Update clock time smoothly (every 100ms for smooth second hand movement)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 100);

    return () => clearInterval(timer);
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');

    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      // Get user info
      const userResponse = await authAPI.getCurrentUser(token);
      const userData = userResponse.user || userResponse.data;

      // Check if user is admin - redirect to admin panel
      const userEmail = userData?.email?.toLowerCase();
      if (userEmail === 'admin') {
        router.push('/admin');
        return;
      }

      // Determine member type (prefer user payload, then localStorage, then members API)
      let memberType = null;
      const userId = userData?.id || userData?.user?.id;

      // 1) Prefer backend members table (source of truth)
      if (userId) {
        try {
          const memberRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/members/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (memberRes.ok) {
            const memberJson = await memberRes.json();
            memberType = memberJson?.data?.member_type || null;
          }
        } catch (e) {
          // non-blocking
        }
      }

      // 2) Fallback to user payload if backend had nothing
      if (!memberType) {
        memberType = userData?.member_type || null;
      }

      // 3) Fallback to localStorage as last resort
      if (!memberType) {
        memberType = localStorage.getItem('user_member_type') || null;
      }

      // Persist resolved type for future sessions
      if (memberType) {
        const updatedUser = {
          ...userData,
          member_type: memberType,
          user: userData.user ? { ...userData.user, member_type: memberType } : userData.user
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('user_member_type', memberType);
      }

      // Check if interests are completed - check backend database
      let hasCompletedInterests = false;

      try {
        const interestsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/members/interests`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (interestsResponse.ok) {
          const interestsData = await interestsResponse.json();
          hasCompletedInterests = interestsData.success && interestsData.data && interestsData.data.length > 0;

          // Update localStorage to match backend state
          if (hasCompletedInterests) {
            localStorage.setItem('interests_selection_completed', 'true');
          } else {
            localStorage.removeItem('interests_selection_completed');
          }
        }
      } catch (e) {
        // If fetch fails, fall back to localStorage
        hasCompletedInterests = localStorage.getItem('interests_selection_completed') === 'true';
      }

      // If still not set, send to membership selection
      if (!memberType) {
        router.push('/dashboard/membership-selection');
        return;
      }

      // If interests not completed, send there next
      if (!hasCompletedInterests) {
        router.push('/dashboard/interests-selection');
        return;
      }

      // Route to role dashboards
      if (memberType === 'mentor') {
        router.push('/dashboard/mentor');
        return;
      } else if (memberType === 'mentee') {
        router.push('/dashboard/mentee');
        return;
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setError('Failed to load user data');
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="text-purple-600 hover:underline"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start pt-20">
      {/* Success Image - Full Width */}
      <div className="relative w-full h-56 mb-8 px-6 pl-24 pr-24">
        <div className="relative w-full h-full">
          <Image
            src="/assets/signup-success.png"
            alt="Success"
            fill
            className="object-cover rounded-[30px]"
          />
        </div>
      </div>

      {/* Success Content */}
      <div className="w-full px-6 mt-6 pl-24 pr-24">
        <h1
          className="text-[#000000] mb-10"
          style={{
            fontFamily: 'DM Serif Display',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: '56px',
            lineHeight: '66px',
            letterSpacing: '-0.96px',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            textRendering: 'optimizeLegibility'
          }}
        >
          We are currently under development
        </h1>

        <button
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            localStorage.removeItem('user_member_type');
            localStorage.removeItem('interests_selection_completed');
            router.push('/');
          }}
          className="inline-flex items-center space-x-3 bg-[#ffc95c] text-[#2b2d30] px-8 py-4 rounded-[40px] font-medium hover:bg-[#e6b800] transition-colors duration-200"
          style={{
            fontFamily: 'Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
            fontStyle: 'normal',
            fontWeight: 500,
            fontSize: '18px',
            lineHeight: '22px',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            textRendering: 'optimizeLegibility'
          }}
        >
          <span>Logout</span>
          <svg width="18" height="18" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.5 13.5C1.0875 13.5 0.7345 13.3532 0.441 13.0597C0.1475 12.7662 0.0005 12.413 0 12V1.5C0 1.0875 0.147 0.7345 0.441 0.441C0.735 0.1475 1.088 0.0005 1.5 0H6.75V1.5H1.5V12H6.75V13.5H1.5ZM9.75 10.5L8.71875 9.4125L10.6312 7.5H4.5V6H10.6312L8.71875 4.0875L9.75 3L13.5 6.75L9.75 10.5Z" fill="black" />
          </svg>
        </button>
      </div>
    </div>
  );
}

