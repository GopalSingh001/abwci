import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { authAPI } from '../../lib/api';

const interests = [
  { id: 'technology', label: 'Technology', icon: '/dashboard/icons/simple-icons_circuitverse.png' },
  { id: 'knowledge', label: 'Knowledge', icon: '/dashboard/icons/garden_knowledge-base-26.png' },
  { id: 'finance', label: 'Finance', icon: '/dashboard/icons/mdi_finance.png' },
  { id: 'entrepreneurship', label: 'Entrepreneurship', icon: '/dashboard/icons/mdi_business-woman.png' },
  { id: 'network', label: 'Network', icon: '/dashboard/icons/foundation_social-myspace.png' },
  { id: 'marketing', label: 'Marketing', icon: '/dashboard/icons/mdi_marketplace.png' }
];

export default function InterestsSelection() {
  const router = useRouter();
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userMemberType, setUserMemberType] = useState(null);

  useEffect(() => {
    checkAuthAndGetInterests();
  }, []);

  const checkAuthAndGetInterests = async () => {
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

      // Get member type
      const memberType = userData?.member_type || localStorage.getItem('user_member_type');
      setUserMemberType(memberType);

      // Check if user has already completed this step
      const hasCompletedInterests = localStorage.getItem('interests_selection_completed');
      if (hasCompletedInterests) {
        // User has already completed, redirect to appropriate dashboard
        redirectToDashboard(memberType);
        return;
      }

      // Load existing interests if any
      try {
        const interestsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/members/interests`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (interestsResponse.ok) {
          const interestsData = await interestsResponse.json();
          if (interestsData.success && interestsData.data && interestsData.data.length > 0) {
            setSelectedInterests(interestsData.data.map(i => i.interest_type));
          }
        }
      } catch (err) {
        // Ignore if interests don't exist yet
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const redirectToDashboard = (memberType) => {
    if (memberType === 'mentor') {
      router.push('/dashboard/mentor');
    } else if (memberType === 'mentee') {
      router.push('/dashboard/mentee');
    } else {
      router.push('/dashboard');
    }
  };

  const toggleInterest = (interestId) => {
    setSelectedInterests(prev => {
      if (prev.includes(interestId)) {
        return prev.filter(id => id !== interestId);
      } else {
        return [...prev, interestId];
      }
    });
  };

  const handleNext = async () => {
    if (selectedInterests.length === 0) {
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = userData.id || userData.user?.id;

      // First, ensure member record exists
      try {
        const memberCheckResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/members/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!memberCheckResponse.ok) {
          // Member doesn't exist, create one
          console.log('Member not found, creating member record...');
          const createMemberResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/members`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              uid: userId,
              first_name: userData.first_name || userData.user?.first_name || userData.firstName || 'User',
              last_name: userData.last_name || userData.user?.last_name || userData.lastName || '',
              email: userData.email || userData.user?.email || '',
              member_type: userMemberType || 'mentee'
            })
          });

          if (!createMemberResponse.ok) {
            const errorData = await createMemberResponse.json();
            console.error('Failed to create member:', errorData);
            alert('Failed to create member profile. Please contact support.');
            setSubmitting(false);
            return;
          }
          console.log('✅ Member record created');
        }
      } catch (memberCheckError) {
        console.error('Error checking/creating member:', memberCheckError);
      }

      // Save interests
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/members/interests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          interests: selectedInterests
        })
      });

      const responseData = await response.json();
      console.log('Interests API response:', responseData);

      if (response.ok && responseData.success) {
        // Only mark as completed if API call was successful
        localStorage.setItem('interests_selection_completed', 'true');
        console.log('✅ Interests saved successfully');
      } else {
        console.error('❌ Failed to save interests:', responseData);
        alert('Failed to save interests: ' + (responseData.error || 'Unknown error'));
        setSubmitting(false);
        return;
      }
      
      // Redirect to appropriate dashboard based on member type
      redirectToDashboard(userMemberType);
    } catch (error) {
      console.error('Error saving interests:', error);
      alert('Error saving interests. Please try again.');
      setSubmitting(false);
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
          position: 'relative'
        }}
      >
        {/* Background Image */}
        <Image
          src="/dashboard/flower.jpg"
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

        {/* Back Button */}
        <button
          onClick={() => router.push('/dashboard/membership-selection')}
          className="absolute z-10 flex items-center justify-center hover:opacity-80 transition-opacity"
          style={{
            left: '57px',
            top: '95px',
            width: '34px',
            height: '34px'
          }}
        >
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M28.3346 15.5827H11.0938L19.013 7.66352L17.0013 5.66602L5.66797 16.9993L17.0013 28.3327L18.9988 26.3352L11.0938 18.416H28.3346V15.5827Z" fill="#FFFFFF"/>
          </svg>
        </button>

        {/* Tell us what do you need help with */}
        <div 
          className="absolute z-10 text-center"
          style={{
            left: '50%',
            top: '150px',
            transform: 'translateX(-50%)',
            width: '547px',
            maxWidth: '90%'
          }}
        >
          <h1 
            style={{
              fontFamily: 'DM Serif Display, serif',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '36px',
              lineHeight: '49px',
              color: '#FFFFFF',
              margin: 0
            }}
          >
            Tell us what do you need help with
          </h1>
        </div>

        {/* Interests Grid */}
        <div 
          className="absolute z-10 flex flex-col gap-5"
          style={{
            left: '50%',
            top: '250px',
            transform: 'translateX(-50%)',
            width: '652px',
            maxWidth: '90%'
          }}
        >
          {/* Row 1 */}
          <div className="flex flex-row gap-5">
            <button
              onClick={() => toggleInterest('technology')}
              className="flex flex-row justify-between items-center rounded-[30px] transition-all duration-200 focus:outline-none"
              style={{
                width: '316px',
                height: '76px',
                background: selectedInterests.includes('technology') ? '#653A96' : '#F5F5F5',
                border: selectedInterests.includes('technology') ? '1px solid #653A96' : '1px solid #D9D9D9',
                padding: '20px 30px',
                gap: '10px',
                outline: 'none'
              }}
            >
              <span 
                style={{
                  fontFamily: 'Helvetica Neue, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '20px',
                  color: selectedInterests.includes('technology') ? '#FFFFFF' : '#2B2D30',
                  flex: 1,
                  textAlign: 'center'
                }}
              >
                Technology
              </span>
              <div style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Image
                  src={interests.find(i => i.id === 'technology')?.icon || ''}
                  alt="Technology"
                  width={36}
                  height={36}
                  className="object-contain"
                  style={{
                    filter: selectedInterests.includes('technology') 
                      ? 'brightness(0) invert(1)' 
                      : 'brightness(0) saturate(100%) invert(39%) sepia(100%) saturate(5000%) hue-rotate(260deg) brightness(0.6) contrast(1.2)'
                  }}
                />
              </div>
            </button>

            <button
              onClick={() => toggleInterest('knowledge')}
              className="flex flex-row justify-between items-center rounded-[30px] transition-all duration-200 focus:outline-none"
              style={{
                width: '316px',
                height: '76px',
                background: selectedInterests.includes('knowledge') ? '#653A96' : '#F5F5F5',
                border: selectedInterests.includes('knowledge') ? '1px solid #653A96' : '1px solid #D9D9D9',
                padding: '20px 30px',
                gap: '10px',
                outline: 'none'
              }}
            >
              <span 
                style={{
                  fontFamily: 'Helvetica Neue, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '20px',
                  color: selectedInterests.includes('knowledge') ? '#FFFFFF' : '#2B2D30',
                  flex: 1,
                  textAlign: 'center'
                }}
              >
                Knowledge
              </span>
              <div style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Image
                  src={interests.find(i => i.id === 'knowledge')?.icon || ''}
                  alt="Knowledge"
                  width={36}
                  height={36}
                  className="object-contain"
                  style={{
                    filter: selectedInterests.includes('knowledge') 
                      ? 'brightness(0) invert(1)' 
                      : 'brightness(0) saturate(100%) invert(39%) sepia(100%) saturate(5000%) hue-rotate(260deg) brightness(0.6) contrast(1.2)'
                  }}
                />
              </div>
            </button>
          </div>

          {/* Row 2 */}
          <div className="flex flex-row gap-5">
            <button
              onClick={() => toggleInterest('finance')}
              className="flex flex-row justify-between items-center rounded-[30px] transition-all duration-200 focus:outline-none"
              style={{
                width: '316px',
                height: '76px',
                background: selectedInterests.includes('finance') ? '#653A96' : '#F5F5F5',
                border: selectedInterests.includes('finance') ? '1px solid #653A96' : '1px solid #D9D9D9',
                padding: '20px 30px',
                gap: '10px',
                outline: 'none'
              }}
            >
              <span 
                style={{
                  fontFamily: 'Helvetica Neue, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '20px',
                  color: selectedInterests.includes('finance') ? '#FFFFFF' : '#2B2D30',
                  flex: 1,
                  textAlign: 'center'
                }}
              >
                Finance
              </span>
              <div style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Image
                  src={interests.find(i => i.id === 'finance')?.icon || ''}
                  alt="Finance"
                  width={36}
                  height={36}
                  className="object-contain"
                  style={{
                    filter: selectedInterests.includes('finance') 
                      ? 'brightness(0) invert(1)' 
                      : 'brightness(0) saturate(100%) invert(39%) sepia(100%) saturate(5000%) hue-rotate(260deg) brightness(0.6) contrast(1.2)'
                  }}
                />
              </div>
            </button>

            <button
              onClick={() => toggleInterest('entrepreneurship')}
              className="flex flex-row justify-between items-center rounded-[30px] transition-all duration-200 focus:outline-none"
              style={{
                width: '316px',
                height: '76px',
                background: selectedInterests.includes('entrepreneurship') ? '#653A96' : '#F5F5F5',
                border: selectedInterests.includes('entrepreneurship') ? '1px solid #653A96' : '1px solid #D9D9D9',
                padding: '20px 30px',
                gap: '10px',
                outline: 'none'
              }}
            >
              <span 
                style={{
                  fontFamily: 'Helvetica Neue, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '20px',
                  color: selectedInterests.includes('entrepreneurship') ? '#FFFFFF' : '#2B2D30',
                  flex: 1,
                  textAlign: 'center'
                }}
              >
                Entrepreneurship
              </span>
              <div style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Image
                  src={interests.find(i => i.id === 'entrepreneurship')?.icon || ''}
                  alt="Entrepreneurship"
                  width={36}
                  height={36}
                  className="object-contain"
                  style={{
                    filter: selectedInterests.includes('entrepreneurship') 
                      ? 'brightness(0) invert(1)' 
                      : 'brightness(0) saturate(100%) invert(39%) sepia(100%) saturate(5000%) hue-rotate(260deg) brightness(0.6) contrast(1.2)'
                  }}
                />
              </div>
            </button>
          </div>

          {/* Row 3 */}
          <div className="flex flex-row gap-5">
            <button
              onClick={() => toggleInterest('network')}
              className="flex flex-row justify-between items-center rounded-[30px] transition-all duration-200 focus:outline-none"
              style={{
                width: '316px',
                height: '76px',
                background: selectedInterests.includes('network') ? '#653A96' : '#F5F5F5',
                border: selectedInterests.includes('network') ? '1px solid #653A96' : '1px solid #D9D9D9',
                padding: '20px 30px',
                gap: '10px',
                outline: 'none'
              }}
            >
              <span 
                style={{
                  fontFamily: 'Helvetica Neue, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '20px',
                  color: selectedInterests.includes('network') ? '#FFFFFF' : '#2B2D30',
                  flex: 1,
                  textAlign: 'center'
                }}
              >
                Network
              </span>
              <div style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Image
                  src={interests.find(i => i.id === 'network')?.icon || ''}
                  alt="Network"
                  width={36}
                  height={36}
                  className="object-contain"
                  style={{
                    filter: selectedInterests.includes('network') 
                      ? 'brightness(0) invert(1)' 
                      : 'brightness(0) saturate(100%) invert(39%) sepia(100%) saturate(5000%) hue-rotate(260deg) brightness(0.6) contrast(1.2)'
                  }}
                />
              </div>
            </button>

            <button
              onClick={() => toggleInterest('marketing')}
              className="flex flex-row justify-between items-center rounded-[30px] transition-all duration-200 focus:outline-none"
              style={{
                width: '316px',
                height: '76px',
                background: selectedInterests.includes('marketing') ? '#653A96' : '#F5F5F5',
                border: selectedInterests.includes('marketing') ? '1px solid #653A96' : '1px solid #D9D9D9',
                padding: '20px 30px',
                gap: '10px',
                outline: 'none'
              }}
            >
              <span 
                style={{
                  fontFamily: 'Helvetica Neue, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '20px',
                  color: selectedInterests.includes('marketing') ? '#FFFFFF' : '#2B2D30',
                  flex: 1,
                  textAlign: 'center'
                }}
              >
                Marketing
              </span>
              <div style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Image
                  src={interests.find(i => i.id === 'marketing')?.icon || ''}
                  alt="Marketing"
                  width={36}
                  height={36}
                  className="object-contain"
                  style={{
                    filter: selectedInterests.includes('marketing') 
                      ? 'brightness(0) invert(1)' 
                      : 'brightness(0) saturate(100%) invert(39%) sepia(100%) saturate(5000%) hue-rotate(260deg) brightness(0.6) contrast(1.2)'
                  }}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Get Started Button - Only show when at least one interest is selected */}
        {selectedInterests.length > 0 && (
          <button
            onClick={handleNext}
            disabled={submitting}
            className="absolute z-10 flex flex-row justify-center items-center rounded-[40px] transition-all duration-200 hover:opacity-90 disabled:opacity-50"
            style={{
              left: '50%',
              top: '580px',
              transform: 'translateX(-50%)',
              width: '260px',
              height: '56px',
              background: '#FFC95C',
              border: '1px solid #2B2D30',
              padding: '14px 50px',
              gap: '10px'
            }}
          >
            <span 
              style={{
                fontFamily: 'Helvetica Neue, sans-serif',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: '20px',
                lineHeight: '24px',
                color: '#2B2D30',
                whiteSpace: 'nowrap'
              }}
            >
              {submitting ? 'Saving...' : 'Get Started'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

