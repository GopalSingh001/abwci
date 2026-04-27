import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { authAPI } from '../../lib/api';

export default function MembershipSelection() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userMemberType, setUserMemberType] = useState(null);

  useEffect(() => {
    checkAuthAndGetMemberType();
  }, []);

  const checkAuthAndGetMemberType = async () => {
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

      // Determine member_type (prioritize user payload, fallback to members table)
      let memberType = userData?.member_type || null;
      const userId = userData?.id || userData?.user?.id;

      if (!memberType && userId) {
        try {
          const memberRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/members/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (memberRes.ok) {
            const memberJson = await memberRes.json();
            memberType = memberJson?.data?.member_type || memberType;
            // Persist into local user for future sessions
            if (memberType) {
              const updatedUser = {
                ...userData,
                member_type: memberType,
                user: userData.user ? { ...userData.user, member_type: memberType } : userData.user
              };
              localStorage.setItem('user', JSON.stringify(updatedUser));
            }
          }
        } catch (e) {
          // non-blocking; fall through
        }
      }

      setUserMemberType(memberType);
      
      // If already selected, skip this step
      if (memberType === 'mentor' || memberType === 'mentee') {
        router.push('/dashboard');
        return;
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (!selectedType) {
      return;
    }

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const userEmail = userData?.email || userData?.user?.email;
      
      let updatedUser = userData;

      if (userEmail) {
        // Get member by user ID first
        const getMemberResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/members/user/${userData.id || userData.user?.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (getMemberResponse.ok) {
          const memberData = await getMemberResponse.json();
          const memberId = memberData.data?.id;
          
          if (memberId) {
            // Update member type using member ID
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/members/${memberId}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                member_type: selectedType
              })
            });
          }
        }

        // Update local user object with member_type for subsequent logins
        updatedUser = {
          ...userData,
          member_type: selectedType,
          user: userData.user ? { ...userData.user, member_type: selectedType } : userData.user
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      // Redirect after saving selection
      router.push('/dashboard');
    } catch (error) {
      console.error('Error updating member type:', error);
      router.push('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full">
      <div 
        className="relative w-full h-full overflow-hidden"
        style={{
          position: 'relative',
          background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.7) 100%)'
        }}
      >
        {/* Background Image */}
        <Image
          src="/dashboard/membership_bg.jpg"
          alt="Background"
          fill
          className="object-cover -z-10"
          priority
        />
        
        {/* Overlay gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.7) 100%)'
          }}
        />

        {/* ABWCI Logo at top */}
        <div 
          className="absolute z-10"
          style={{
            left: '50%',
            top: '40px',
            transform: 'translateX(-50%)',
            width: '150px',
            height: '60px'
          }}
        >
          <Image
            src="/dashboard/white_abwci.png"
            alt="ABWCI Logo"
            width={150}
            height={60}
            className="object-contain"
            priority
          />
        </div>

        {/* Step 1/4 - Just below logo with gap */}
        <div 
          className="absolute z-10 text-center"
          style={{
            left: '50%',
            top: '140px',
            transform: 'translateX(-50%)',
            width: '54px',
            height: '17px'
          }}
        >
          <span 
            style={{
              fontFamily: 'Helvetica Neue, sans-serif',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '17px',
              color: '#FFFFFF'
            }}
          >
            Step 1/4
          </span>
        </div>

        {/* You are joining as an - Just below Step 1/4 */}
        <div 
          className="absolute z-10 text-center"
          style={{
            left: '50%',
            top: '185px',
            transform: 'translateX(-50%)',
            width: 'auto',
            maxWidth: '90%'
          }}
        >
          <h1 
            style={{
              fontFamily: 'DM Serif Display, serif',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '48px',
              lineHeight: '58px',
              letterSpacing: '-0.02em',
              color: '#FFFFFF',
              margin: 0
            }}
          >
            You are joining as an
          </h1>
        </div>

        {/* Buttons Frame - Closer to text */}
        <div 
          className="absolute z-10 flex flex-row gap-[10px] justify-center"
          style={{
            left: '50%',
            top: '280px',
            transform: 'translateX(-50%)',
            width: '532px',
            maxWidth: '90%',
            height: '57px'
          }}
        >
          {/* Entrepreneur / Mentee Button */}
          <button
            onClick={() => setSelectedType('mentee')}
            className="flex flex-col justify-center items-center px-5 rounded-[30px] transition-all duration-200"
            style={{
              width: '261px',
              height: '57px',
              background: selectedType === 'mentee' ? '#653A96' : '#F5F5F5',
              padding: '20px',
              gap: '10px'
            }}
          >
            <span 
              style={{
                fontFamily: 'Helvetica Neue, sans-serif',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '17px',
                color: selectedType === 'mentee' ? '#FFFFFF' : '#653A96'
              }}
            >
              Entrepreneur / Mentee
            </span>
          </button>

          {/* Ecosystem Enabler / Mentor Button */}
          <button
            onClick={() => setSelectedType('mentor')}
            className="flex flex-col justify-center items-center px-5 rounded-[30px] transition-all duration-200"
            style={{
              width: '261px',
              height: '57px',
              background: selectedType === 'mentor' ? '#653A96' : '#F5F5F5',
              padding: '20px',
              gap: '10px'
            }}
          >
            <span 
              style={{
                fontFamily: 'Helvetica Neue, sans-serif',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '17px',
                color: selectedType === 'mentor' ? '#FFFFFF' : '#653A96'
              }}
            >
              Ecosystem Enabler / Mentor
            </span>
          </button>
        </div>

        {/* Next Button - Only show when selection is made */}
        {selectedType && (
          <button
            onClick={handleNext}
            className="absolute z-10 flex flex-row justify-center items-center rounded-[40px] transition-all duration-200 hover:opacity-90"
            style={{
              left: '50%',
              top: '360px',
              transform: 'translateX(-50%)',
              width: '180px',
              height: '48px',
              background: '#FFC95C',
              border: '1px solid #2B2D30',
              padding: '12px 60px',
              gap: '10px'
            }}
          >
            <span 
              style={{
                fontFamily: 'Helvetica Neue, sans-serif',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: '18px',
                lineHeight: '22px',
                color: '#2B2D30'
              }}
            >
              Next
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

