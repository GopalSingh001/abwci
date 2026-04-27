import PageLayout from '../components/PageLayout';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function LeaderProfile() {
  const router = useRouter();
  const { name } = router.query;
  const [leader, setLeader] = useState(null);
  const [loading, setLoading] = useState(true);

  // Leader data - will be replaced with API data later
  const allLeaders = [
    {
      id: 1,
      name: "Noor Jinmediah",
      position: "Global Head",
      image: "/assets/global-leaders/global-1.png",
      bio: "Noor Jinmediah is a visionary leader with over 15 years of experience in international development and women's empowerment. She has led numerous initiatives across multiple continents, focusing on economic inclusion and capacity building for women entrepreneurs.",
      email: "noor.jinmediah@abwci.org",
      phone: "+1 (555) 123-4567",
      location: "New York, USA",
      expertise: ["Strategic Planning", "International Development", "Women's Empowerment", "Capacity Building"],
      achievements: [
        "Led 50+ successful women empowerment programs",
        "Established partnerships with 200+ organizations",
        "Mentored 1000+ women entrepreneurs globally",
        "Recipient of Global Leadership Excellence Award 2023"
      ]
    },
    {
      id: 2,
      name: "Dr. Sarah Johnson",
      position: "Executive Director",
      image: "/assets/global-leaders/global-2.png",
      bio: "Dr. Sarah Johnson brings extensive expertise in organizational development and strategic leadership. With a Ph.D. in International Relations, she has been instrumental in shaping ABWCI's global strategy and expanding its reach across diverse markets.",
      email: "sarah.johnson@abwci.org",
      phone: "+1 (555) 234-5678",
      location: "London, UK",
      expertise: ["Organizational Development", "Strategic Leadership", "International Relations", "Policy Development"],
      achievements: [
        "Expanded ABWCI operations to 25+ countries",
        "Developed comprehensive capacity building frameworks",
        "Led strategic partnerships with major international organizations",
        "Published 20+ research papers on women's economic empowerment"
      ]
    },
    {
      id: 3,
      name: "Maria Rodriguez",
      position: "Deputy Director",
      image: "/assets/global-leaders/global-3.png",
      bio: "Maria Rodriguez is a dynamic leader specializing in program management and regional coordination. Her background in business administration and her passion for social impact have made her a key driver in ABWCI's program delivery and regional expansion efforts.",
      email: "maria.rodriguez@abwci.org",
      phone: "+1 (555) 345-6789",
      location: "Madrid, Spain",
      expertise: ["Program Management", "Regional Coordination", "Business Administration", "Social Impact"],
      achievements: [
        "Successfully managed 100+ regional programs",
        "Coordinated cross-border initiatives in Latin America",
        "Developed innovative program delivery models",
        "Led team of 50+ program coordinators"
      ]
    },
    {
      id: 4,
      name: "Dr. Aisha Patel",
      position: "Program Director",
      image: "/assets/global-leaders/global-4.png",
      bio: "Dr. Aisha Patel is a renowned expert in women's economic development with a focus on technology integration and digital empowerment. Her innovative approaches to capacity building have transformed how ABWCI delivers training and support to women entrepreneurs.",
      email: "aisha.patel@abwci.org",
      phone: "+1 (555) 456-7890",
      location: "Mumbai, India",
      expertise: ["Economic Development", "Technology Integration", "Digital Empowerment", "Training Development"],
      achievements: [
        "Launched digital empowerment programs reaching 10,000+ women",
        "Developed innovative training methodologies",
        "Integrated technology solutions in capacity building",
        "Established partnerships with tech companies"
      ]
    },
    {
      id: 5,
      name: "Jennifer Chen",
      position: "Operations Manager",
      image: "/assets/global-leaders/global-5.png",
      bio: "Jennifer Chen excels in operational excellence and process optimization. Her background in business operations and her attention to detail have been crucial in ensuring ABWCI's programs run smoothly and efficiently across all regions.",
      email: "jennifer.chen@abwci.org",
      phone: "+1 (555) 567-8901",
      location: "Singapore",
      expertise: ["Operations Management", "Process Optimization", "Quality Assurance", "Resource Management"],
      achievements: [
        "Optimized operational processes reducing costs by 30%",
        "Implemented quality assurance frameworks",
        "Managed resources for 200+ concurrent programs",
        "Developed operational best practices"
      ]
    },
    {
      id: 6,
      name: "Dr. Fatima Al-Zahra",
      position: "Strategic Advisor",
      image: "/assets/global-leaders/global-6.png",
      bio: "Dr. Fatima Al-Zahra is a strategic thinker and policy expert with deep knowledge of Middle Eastern and African markets. Her cultural insights and strategic vision have been instrumental in ABWCI's expansion into new regions and markets.",
      email: "fatima.alzahra@abwci.org",
      phone: "+1 (555) 678-9012",
      location: "Dubai, UAE",
      expertise: ["Strategic Planning", "Policy Development", "Cultural Intelligence", "Market Expansion"],
      achievements: [
        "Led strategic expansion into Middle East and Africa",
        "Developed culturally sensitive program frameworks",
        "Established key partnerships in emerging markets",
        "Provided strategic guidance for 50+ initiatives"
      ]
    }
  ];

  useEffect(() => {
    if (name) {
      // Convert URL slug back to name format
      const leaderName = name.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      
      // Handle special cases like "Dr."
      const formattedName = leaderName.replace('Dr ', 'Dr. ');
      
      const foundLeader = allLeaders.find(leader => 
        leader.name.toLowerCase().replace(/\s+/g, '-') === name
      );
      
      setLeader(foundLeader);
      setLoading(false);
    }
  }, [name]);

  if (loading) {
    return (
      <PageLayout title="Loading..." showHeaderButton={false}>
        <div className="p-8 flex justify-center items-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#653a96] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading leader profile...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!leader) {
    return (
      <PageLayout title="Leader Not Found" showHeaderButton={false}>
        <div className="p-8 text-center">
          <h1 className="text-4xl text-[#653a96] mb-4">Leader Not Found</h1>
          <p className="text-gray-600 mb-8">The requested leader profile could not be found.</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-[#653a96] text-white rounded-lg hover:bg-[#4a2470] transition-colors duration-200"
          >
            Go Back
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={leader.name} showHeaderButton={false}>
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="mb-8 flex items-center space-x-2 text-[#653a96] hover:text-[#4a2470] transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Leadership</span>
          </button>

          {/* Leader Profile */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              {/* Left Side - Image and Basic Info */}
              <div>
                <div className="relative w-80 h-80 mx-auto mb-6 rounded-2xl overflow-hidden">
                  <Image
                    src={leader.image}
                    alt={leader.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="text-center">
                  <h1 
                    className="text-4xl text-[#653a96] mb-2 font-bold"
                    style={{
                      fontFamily: 'DM Serif Display',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '42px',
                      lineHeight: '57px',
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale',
                      textRendering: 'optimizeLegibility'
                    }}
                  >
                    {leader.name}
                  </h1>
                  <p className="text-xl text-gray-600 mb-6">{leader.position}</p>
                  
                  {/* Contact Info */}
                  <div className="space-y-3 text-left">
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-[#653a96]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-700">{leader.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-[#653a96]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-gray-700">{leader.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-[#653a96]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-gray-700">{leader.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Detailed Information */}
              <div className="space-y-8">
                {/* Bio */}
                <div>
                  <h2 className="text-2xl font-semibold text-[#653a96] mb-4">Biography</h2>
                  <p className="text-gray-700 leading-relaxed">{leader.bio}</p>
                </div>

                {/* Expertise */}
                <div>
                  <h2 className="text-2xl font-semibold text-[#653a96] mb-4">Areas of Expertise</h2>
                  <div className="flex flex-wrap gap-2">
                    {leader.expertise.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-[#653a96]/10 text-[#653a96] rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Achievements */}
                <div>
                  <h2 className="text-2xl font-semibold text-[#653a96] mb-4">Key Achievements</h2>
                  <ul className="space-y-3">
                    {leader.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <svg className="w-5 h-5 text-[#653a96] mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
