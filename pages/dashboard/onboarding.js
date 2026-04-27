import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { authAPI } from '../../lib/api';

export default function Onboarding() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkUserStatusAndRedirect();
  }, []);

  const checkUserStatusAndRedirect = async () => {
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
        setTimeout(() => router.push('/admin'), 3000);
        return;
      }

      // Determine member type
      let memberType = null;
      const userId = userData?.id || userData?.user?.id;

      // 1) Try to get from backend members table
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

      // 2) Fallback to user payload
      if (!memberType) {
        memberType = userData?.member_type || null;
      }

      // 3) Fallback to localStorage
      if (!memberType) {
        memberType = localStorage.getItem('user_member_type') || null;
      }

      // Save member type for future use
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
        
        console.log('Interests check response status:', interestsResponse.status);
        
        if (interestsResponse.ok) {
          const interestsData = await interestsResponse.json();
          console.log('Interests data from DB:', interestsData);
          hasCompletedInterests = interestsData.success && interestsData.data && interestsData.data.length > 0;
          console.log('Has completed interests:', hasCompletedInterests);
          
          // Update localStorage to match backend state
          if (hasCompletedInterests) {
            localStorage.setItem('interests_selection_completed', 'true');
          } else {
            localStorage.removeItem('interests_selection_completed');
          }
        } else {
          console.error('Failed to fetch interests:', interestsResponse.status);
        }
      } catch (e) {
        console.error('Error fetching interests:', e);
        // If fetch fails, fall back to localStorage
        hasCompletedInterests = localStorage.getItem('interests_selection_completed') === 'true';
        console.log('Falling back to localStorage, hasCompleted:', hasCompletedInterests);
      }

      console.log('Member type:', memberType, 'Has interests:', hasCompletedInterests);

      // Decide redirect destination
      let destination = '/dashboard/membership-selection';

      if (memberType) {
        if (!hasCompletedInterests) {
          // Has member type but not interests - go to interests selection
          destination = '/dashboard/interests-selection';
        } else {
          // Has both member type and interests - go to appropriate dashboard
          if (memberType === 'mentor') {
            destination = '/dashboard/mentor';
          } else if (memberType === 'mentee') {
            destination = '/dashboard/mentee';
          } else {
            destination = '/dashboard';
          }
        }
      }

      // Wait for 3 seconds to show onboarding, then redirect
      setTimeout(() => {
        router.push(destination);
      }, 3000);

    } catch (error) {
      console.error('Error checking user status:', error);
      // On error, just redirect to membership selection after 3 seconds
      setTimeout(() => {
        router.push('/dashboard/membership-selection');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-[30px] mx-auto flex flex-col items-center"
        style={{
          width: '1280px',
          maxWidth: '100%',
          height: '832px',
          maxHeight: '90vh',
          position: 'relative'
        }}
      >
        {/* ABWCI Logo at top */}
        <div 
          className="absolute"
          style={{
            left: '50%',
            top: '5px',
            transform: 'translateX(-50%)',
            width: '170px',
            height: '68px'
          }}
        >
          <Image
            src="/abwci-newlogo.svg"
            alt="ABWCI Logo"
            width={170}
            height={68}
            className="object-contain"
            priority
          />
        </div>

        {/* Center Circle Logo - Centered vertically */}
        <div 
          className="absolute"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '169px',
            height: '169px',
            marginTop: '-50px'
          }}
        >
          <Image
            src="/dashboard/circle_bow.png"
            alt="Circle Logo"
            width={169}
            height={169}
            className="object-contain"
            priority
          />
        </div>

        {/* Text: Curating your membership experience - Centered and aligned */}
        <div 
          className="absolute text-center"
          style={{
            left: '50%',
            top: 'calc(50% + 80px)',
            transform: 'translateX(-50%)',
            width: '593px',
            maxWidth: 'calc(100% - 40px)'
          }}
        >
          <h1 
            className="text-black m-0"
            style={{
              fontFamily: 'DM Serif Display, serif',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '36px',
              lineHeight: '49px',
              letterSpacing: '-0.02em',
              color: '#000000'
            }}
          >
            Curating your membership experience
          </h1>
        </div>
      </div>
    </div>
  );
}

