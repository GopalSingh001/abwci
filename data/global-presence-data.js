// Global Presence data for countries and regions
export const regions = [
  {
    id: 'africa',
    name: 'Africa',
    countries: [
      // { id: 'algeria', name: 'Algeria', code: 'DZ', flag: '🇩🇿' },
      // { id: 'cameroon', name: 'Cameroon', code: 'CM', flag: '🇨🇲' },
      { id: 'egypt', name: 'Egypt', code: 'EG', flag: '🇪🇬' },
      // { id: 'ghana', name: 'Ghana', code: 'GH', flag: '🇬🇭' },
      { id: 'nigeria', name: 'Nigeria', code: 'NG', flag: '🇳🇬' },
      { id: 'south-africa', name: 'South Africa', code: 'ZA', flag: '🇿🇦' },
      // { id: 'zimbabwe', name: 'Zimbabwe', code: 'ZW', flag: '🇿🇼' },
      { id: 'kenya', name: 'Kenya', code: 'KE', flag: '🇰🇪' },
      // { id: 'morocco', name: 'Morocco', code: 'MA', flag: '🇲🇦' },
      // { id: 'ethiopia', name: 'Ethiopia', code: 'ET', flag: '🇪🇹' },
      { id: 'tanzania', name: 'Tanzania', code: 'TZ', flag: '🇹🇿' }
    ]
  },
  {
    id: 'asia',
    name: 'Asia',
    countries: [
      { id: 'india', name: 'India', code: 'IN', flag: '🇮🇳' },
      { id: 'china', name: 'China', code: 'CN', flag: '🇨🇳' },
      { id: 'japan', name: 'Japan', code: 'JP', flag: '🇯🇵' },
      { id: 'singapore', name: 'Singapore', code: 'SG', flag: '🇸🇬' },
      { id: 'south-korea', name: 'South Korea', code: 'KR', flag: '🇰🇷' },
      { id: 'thailand', name: 'Thailand', code: 'TH', flag: '🇹🇭' },
      { id: 'malaysia', name: 'Malaysia', code: 'MY', flag: '🇲🇾' },
      { id: 'indonesia', name: 'Indonesia', code: 'ID', flag: '🇮🇩' },
      { id: 'bangladesh', name: 'Bangladesh', code: 'BD', flag: '🇧🇩' },
      { id: 'brunei-darussalam', name: 'Brunei Darussalam', code: 'BN', flag: '🇧🇳' },
      { id: 'maldives', name: 'Maldives', code: 'MV', flag: '🇲🇻' },
      { id: 'myanmar', name: 'Myanmar', code: 'MM', flag: '🇲🇲' },
      { id: 'nepal', name: 'Nepal', code: 'NP', flag: '🇳🇵' },
      { id: 'pakistan', name: 'Pakistan', code: 'PK', flag: '🇵🇰' },
      { id: 'philippines', name: 'Philippines', code: 'PH', flag: '🇵🇭' },
      { id: 'sri-lanka', name: 'Sri Lanka', code: 'LK', flag: '🇱🇰' },
      { id: 'uae', name: 'UAE', code: 'AE', flag: '🇦🇪' }
    ]
  },
  {
    id: 'europe',
    name: 'Europe',
    countries: [
      { id: 'united-kingdom', name: 'United Kingdom', code: 'GB', flag: '🇬🇧' },
      { id: 'italy', name: 'Italy', code: 'IT', flag: '🇮🇹' },
      { id: 'netherlands', name: 'Netherlands', code: 'NL', flag: '🇳🇱' },
      { id: 'switzerland', name: 'Switzerland', code: 'CH', flag: '🇨🇭' },
      { id: 'poland', name: 'Poland', code: 'PL', flag: '🇵🇱' },
      { id: 'norway', name: 'Norway', code: 'NO', flag: '🇳🇴' },
      { id: 'ukraine', name: 'Ukraine', code: 'UA', flag: '🇺🇦' },
      { id: 'russia', name: 'Russia', code: 'RU', flag: '🇷🇺' },
      { id: 'latvia', name: 'Latvia', code: 'LV', flag: '🇱🇻' },
      { id: 'montenegro', name: 'Montenegro', code: 'ME', flag: '🇲🇪' },
      { id: 'armenia', name: 'Armenia', code: 'AM', flag: '🇦🇲' },
      { id: 'israel', name: 'Israel', code: 'IL', flag: '🇮🇱' },
      { id: 'georgia', name: 'Georgia', code: 'GE', flag: '🇬🇪' }
    ]
  },
  {
    id: 'north-america',
    name: 'North America',
    countries: [
      { id: 'united-states', name: 'United States', code: 'US', flag: '🇺🇸' },
      { id: 'washington', name: 'Washington, USA', code: 'US', flag: '🇺🇸' },
      { id: 'canada', name: 'Canada', code: 'CA', flag: '🇨🇦' },
      { id: 'mexico', name: 'Mexico', code: 'MX', flag: '🇲🇽' },
      { id: 'costa-rica', name: 'Costa Rica', code: 'CR', flag: '🇨🇷' },
      { id: 'panama', name: 'Panama', code: 'PA', flag: '🇵🇦' },
      { id: 'guatemala', name: 'Guatemala', code: 'GT', flag: '🇬🇹' },
      { id: 'honduras', name: 'Honduras', code: 'HN', flag: '🇭🇳' },
      { id: 'nicaragua', name: 'Nicaragua', code: 'NI', flag: '🇳🇮' },
      { id: 'el-salvador', name: 'El Salvador', code: 'SV', flag: '🇸🇻' },
      { id: 'dominican-republic', name: 'Dominican Republic', code: 'DO', flag: '🇩🇴' }
    ]
  },
  {
    id: 'south-america',
    name: 'South America',
    countries: [
      { id: 'brazil', name: 'Brazil', code: 'BR', flag: '🇧🇷' },
      { id: 'argentina', name: 'Argentina', code: 'AR', flag: '🇦🇷' },
      { id: 'chile', name: 'Chile', code: 'CL', flag: '🇨🇱' },
      { id: 'colombia', name: 'Colombia', code: 'CO', flag: '🇨🇴' },
      { id: 'peru', name: 'Peru', code: 'PE', flag: '🇵🇪' },
      { id: 'venezuela', name: 'Venezuela', code: 'VE', flag: '🇻🇪' },
      { id: 'ecuador', name: 'Ecuador', code: 'EC', flag: '🇪🇨' },
      { id: 'uruguay', name: 'Uruguay', code: 'UY', flag: '🇺🇾' }
    ]
  }
];

// Map images for different regions
export const mapImages = {
  'africa': '/assets/🌎 Map Maker_ Earth City, Missouri, United States (Standard).png',
  'asia': '/assets/🌎 Map Maker_ Earth City, Missouri, United States (Standard).png',
  'europe': '/assets/🌎 Map Maker_ Earth City, Missouri, United States (Standard).png',
  'north-america': '/assets/🌎 Map Maker_ Earth City, Missouri, United States (Standard).png',
  'south-america': '/assets/🌎 Map Maker_ Earth City, Missouri, United States (Standard).png'
};

// Default map image
export const defaultMapImage = '/assets/🌎 Map Maker_ Earth City, Missouri, United States (Standard).png';

// global data for contact points
// export const globalData = {
//   'south-africa': [
//     {
//       id: 1,
//       name: 'Sarah Johnson',
//       designation: 'Regional Director',
//       image: '/assets/global-leaders/global-1.png',
//       linkedin: 'https://linkedin.com/in/sarah-johnson',
//       email: 'sarah.johnson@abwci.org'
//     },
//     {
//       id: 2,
//       name: 'Nomsa Mthembu',
//       designation: 'Country Coordinator',
//       image: '/assets/global-leaders/global-2.png',
//       linkedin: 'https://linkedin.com/in/nomsa-mthembu',
//       email: 'nomsa.mthembu@abwci.org'
//     },
//     {
//       id: 3,
//       name: 'Lisa van der Merwe',
//       designation: 'Partnership Manager',
//       image: '/assets/global-leaders/global-3.png',
//       linkedin: 'https://linkedin.com/in/lisa-vandermerwe',
//       email: 'lisa.vandermerwe@abwci.org'
//     }
//   ],
//   'nigeria': [
//     {
//       id: 1,
//       name: 'Aisha Ibrahim',
//       designation: 'Regional Director',
//       image: '/assets/global-leaders/global-1.png',
//       linkedin: 'https://linkedin.com/in/aisha-ibrahim',
//       email: 'aisha.ibrahim@abwci.org'
//     },
//     {
//       id: 2,
//       name: 'Chioma Okonkwo',
//       designation: 'Country Coordinator',
//       image: '/assets/global-leaders/global-2.png',
//       linkedin: 'https://linkedin.com/in/chioma-okonkwo',
//       email: 'chioma.okonkwo@abwci.org'
//     },
//     {
//       id: 3,
//       name: 'Funmi Adebayo',
//       designation: 'Partnership Manager',
//       image: '/assets/global-leaders/global-3.png',
//       linkedin: 'https://linkedin.com/in/funmi-adebayo',
//       email: 'funmi.adebayo@abwci.org'
//     }
//   ],
//   'kenya': [
//     {
//       id: 1,
//       name: 'Grace Wanjiku',
//       designation: 'Regional Director',
//       image: '/assets/global-leaders/global-1.png',
//       linkedin: 'https://linkedin.com/in/grace-wanjiku',
//       email: 'grace.wanjiku@abwci.org'
//     },
//     {
//       id: 2,
//       name: 'Mary Njoki',
//       designation: 'Country Coordinator',
//       image: '/assets/global-leaders/global-2.png',
//       linkedin: 'https://linkedin.com/in/mary-njoki',
//       email: 'mary.njoki@abwci.org'
//     },
//     {
//       id: 3,
//       name: 'Susan Muthoni',
//       designation: 'Partnership Manager',
//       image: '/assets/global-leaders/global-3.png',
//       linkedin: 'https://linkedin.com/in/susan-muthoni',
//       email: 'susan.muthoni@abwci.org'
//     }
//   ],
//   'egypt': [
//     {
//       id: 1,
//       name: 'Fatima Hassan',
//       designation: 'Regional Director',
//       image: '/assets/global-leaders/global-1.png',
//       linkedin: 'https://linkedin.com/in/fatima-hassan',
//       email: 'fatima.hassan@abwci.org'
//     },
//     {
//       id: 2,
//       name: 'Nour El-Din',
//       designation: 'Country Coordinator',
//       image: '/assets/global-leaders/global-2.png',
//       linkedin: 'https://linkedin.com/in/nour-eldin',
//       email: 'nour.eldin@abwci.org'
//     },
//     {
//       id: 3,
//       name: 'Yasmin Mahmoud',
//       designation: 'Partnership Manager',
//       image: '/assets/global-leaders/global-3.png',
//       linkedin: 'https://linkedin.com/in/yasmin-mahmoud',
//       email: 'yasmin.mahmoud@abwci.org'
//     }
//   ],
//   'morocco': [
//     {
//       id: 1,
//       name: 'Aicha Benali',
//       designation: 'Regional Director',
//       image: '/assets/global-leaders/global-1.png',
//       linkedin: 'https://linkedin.com/in/aicha-benali',
//       email: 'aicha.benali@abwci.org'
//     },
//     {
//       id: 2,
//       name: 'Khadija Alami',
//       designation: 'Country Coordinator',
//       image: '/assets/global-leaders/global-2.png',
//       linkedin: 'https://linkedin.com/in/khadija-alami',
//       email: 'khadija.alami@abwci.org'
//     },
//     {
//       id: 3,
//       name: 'Zineb Tazi',
//       designation: 'Partnership Manager',
//       image: '/assets/global-leaders/global-3.png',
//       linkedin: 'https://linkedin.com/in/zineb-tazi',
//       email: 'zineb.tazi@abwci.org'
//     }
//   ],
//   'ghana': [
//     {
//       id: 1,
//       name: 'Akosua Mensah',
//       designation: 'Regional Director',
//       image: '/assets/global-leaders/global-1.png',
//       linkedin: 'https://linkedin.com/in/akosua-mensah',
//       email: 'akosua.mensah@abwci.org'
//     },
//     {
//       id: 2,
//       name: 'Efua Asante',
//       designation: 'Country Coordinator',
//       image: '/assets/global-leaders/global-2.png',
//       linkedin: 'https://linkedin.com/in/efua-asante',
//       email: 'efua.asante@abwci.org'
//     },
//     {
//       id: 3,
//       name: 'Adwoa Boateng',
//       designation: 'Partnership Manager',
//       image: '/assets/global-leaders/global-3.png',
//       linkedin: 'https://linkedin.com/in/adwoa-boateng',
//       email: 'adwoa.boateng@abwci.org'
//     }
//   ],
//   'ethiopia': [
//     {
//       id: 1,
//       name: 'Selamawit Tesfaye',
//       designation: 'Regional Director',
//       image: '/assets/global-leaders/global-1.png',
//       linkedin: 'https://linkedin.com/in/selamawit-tesfaye',
//       email: 'selamawit.tesfaye@abwci.org'
//     },
//     {
//       id: 2,
//       name: 'Meron Gebre',
//       designation: 'Country Coordinator',
//       image: '/assets/global-leaders/global-2.png',
//       linkedin: 'https://linkedin.com/in/meron-gebre',
//       email: 'meron.gebre@abwci.org'
//     },
//     {
//       id: 3,
//       name: 'Hirut Alemayehu',
//       designation: 'Partnership Manager',
//       image: '/assets/global-leaders/global-3.png',
//       linkedin: 'https://linkedin.com/in/hirut-alemayehu',
//       email: 'hirut.alemayehu@abwci.org'
//     }
//   ],
//   'tanzania': [
//     {
//       id: 1,
//       name: 'Neema Mwalimu',
//       designation: 'Regional Director',
//       image: '/assets/global-leaders/global-1.png',
//       linkedin: 'https://linkedin.com/in/neema-mwalimu',
//       email: 'neema.mwalimu@abwci.org'
//     },
//     {
//       id: 2,
//       name: 'Grace Mwamba',
//       designation: 'Country Coordinator',
//       image: '/assets/global-leaders/global-2.png',
//       linkedin: 'https://linkedin.com/in/grace-mwamba',
//       email: 'grace.mwamba@abwci.org'
//     },
//     {
//       id: 3,
//       name: 'Asha Juma',
//       designation: 'Partnership Manager',
//       image: '/assets/global-leaders/global-3.png',
//       linkedin: 'https://linkedin.com/in/asha-juma',
//       email: 'asha.juma@abwci.org'
//     }
//   ],
//   'algeria': [
//     {
//       id: 1,
//       name: 'Fatima Benali',
//       designation: 'Regional Director',
//       image: '/assets/global-leaders/global-1.png',
//       linkedin: 'https://linkedin.com/in/fatima-benali',
//       email: 'fatima.benali@abwci.org'
//     },
//     {
//       id: 2,
//       name: 'Aicha Bouzid',
//       designation: 'Country Coordinator',
//       image: '/assets/global-leaders/global-2.png',
//       linkedin: 'https://linkedin.com/in/aicha-bouzid',
//       email: 'aicha.bouzid@abwci.org'
//     },
//     {
//       id: 3,
//       name: 'Nour El-Hadi',
//       designation: 'Partnership Manager',
//       image: '/assets/global-leaders/global-3.png',
//       linkedin: 'https://linkedin.com/in/nour-elhadi',
//       email: 'nour.elhadi@abwci.org'
//     }
//   ],
//   'cameroon': [
//     {
//       id: 1,
//       name: 'Grace Mballa',
//       designation: 'Regional Director',
//       image: '/assets/global-leaders/global-1.png',
//       linkedin: 'https://linkedin.com/in/grace-mballa',
//       email: 'grace.mballa@abwci.org'
//     },
//     {
//       id: 2,
//       name: 'Esther Ngu',
//       designation: 'Country Coordinator',
//       image: '/assets/global-leaders/global-2.png',
//       linkedin: 'https://linkedin.com/in/esther-ngu',
//       email: 'esther.ngu@abwci.org'
//     },
//     {
//       id: 3,
//       name: 'Patience Fon',
//       designation: 'Partnership Manager',
//       image: '/assets/global-leaders/global-3.png',
//       linkedin: 'https://linkedin.com/in/patience-fon',
//       email: 'patience.fon@abwci.org'
//     }
//   ],
//   'zimbabwe': [
//     {
//       id: 1,
//       name: 'Tendai Moyo',
//       designation: 'Regional Director',
//       image: '/assets/global-leaders/global-1.png',
//       linkedin: 'https://linkedin.com/in/tendai-moyo',
//       email: 'tendai.moyo@abwci.org'
//     },
//     {
//       id: 2,
//       name: 'Rumbidzai Chigwada',
//       designation: 'Country Coordinator',
//       image: '/assets/global-leaders/global-2.png',
//       linkedin: 'https://linkedin.com/in/rumbidzai-chigwada',
//       email: 'rumbidzai.chigwada@abwci.org'
//     },
//     {
//       id: 3,
//       name: 'Priscilla Mutasa',
//       designation: 'Partnership Manager',
//       image: '/assets/global-leaders/global-3.png',
//       linkedin: 'https://linkedin.com/in/priscilla-mutasa',
//       email: 'priscilla.mutasa@abwci.org'
//     }
//   ]
// };
