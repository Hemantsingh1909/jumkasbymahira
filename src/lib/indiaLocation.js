/**
 * Comprehensive dataset and utilities for Indian States, Union Territories,
 * City-to-State mapping, and Pincode auto-detection.
 */

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];

// Mapping of popular cities/towns to their respective State / UT
const CITY_TO_STATE_MAP = {
  // Maharashtra
  'mumbai': 'Maharashtra',
  'bombay': 'Maharashtra',
  'pune': 'Maharashtra',
  'poona': 'Maharashtra',
  'nagpur': 'Maharashtra',
  'nashik': 'Maharashtra',
  'nasik': 'Maharashtra',
  'thane': 'Maharashtra',
  'aurangabad': 'Maharashtra',
  'chhatrapati sambhajinagar': 'Maharashtra',
  'sambhajinagar': 'Maharashtra',
  'solapur': 'Maharashtra',
  'kolhapur': 'Maharashtra',
  'navi mumbai': 'Maharashtra',
  'kalyan': 'Maharashtra',
  'dombivli': 'Maharashtra',
  'vasai': 'Maharashtra',
  'virar': 'Maharashtra',
  'amravati': 'Maharashtra',
  'nanded': 'Maharashtra',
  'sangli': 'Maharashtra',
  'jalgaon': 'Maharashtra',
  'akola': 'Maharashtra',
  'latur': 'Maharashtra',
  'dhule': 'Maharashtra',
  'ahmednagar': 'Maharashtra',
  'ahilyanagar': 'Maharashtra',
  'chandrapur': 'Maharashtra',
  'parbhani': 'Maharashtra',
  'jalna': 'Maharashtra',
  'ichalkaranji': 'Maharashtra',
  'satara': 'Maharashtra',
  'ratnagiri': 'Maharashtra',
  'panvel': 'Maharashtra',
  'bhiwandi': 'Maharashtra',
  'miraj': 'Maharashtra',
  'beed': 'Maharashtra',
  'yavatmal': 'Maharashtra',
  'gondia': 'Maharashtra',
  'wardha': 'Maharashtra',

  // Delhi / NCR
  'delhi': 'Delhi',
  'new delhi': 'Delhi',
  'central delhi': 'Delhi',
  'south delhi': 'Delhi',
  'north delhi': 'Delhi',
  'west delhi': 'Delhi',
  'east delhi': 'Delhi',
  'dwarka': 'Delhi',
  'rohini': 'Delhi',

  // Karnataka
  'bengaluru': 'Karnataka',
  'bangalore': 'Karnataka',
  'mysuru': 'Karnataka',
  'mysore': 'Karnataka',
  'hubballi': 'Karnataka',
  'hubli': 'Karnataka',
  'dharwad': 'Karnataka',
  'mangaluru': 'Karnataka',
  'mangalore': 'Karnataka',
  'belagavi': 'Karnataka',
  'belgaum': 'Karnataka',
  'davanagere': 'Karnataka',
  'ballari': 'Karnataka',
  'bellary': 'Karnataka',
  'vijayapura': 'Karnataka',
  'bijapur': 'Karnataka',
  'shivamogga': 'Karnataka',
  'shimoga': 'Karnataka',
  'tumakuru': 'Karnataka',
  'tumkur': 'Karnataka',
  'kalaburagi': 'Karnataka',
  'gulbarga': 'Karnataka',
  'raichur': 'Karnataka',
  'bidar': 'Karnataka',
  'hospet': 'Karnataka',
  'hosapete': 'Karnataka',
  'gadag': 'Karnataka',
  'udupi': 'Karnataka',
  'manipal': 'Karnataka',
  'hassan': 'Karnataka',
  'chikmagalur': 'Karnataka',

  // Tamil Nadu
  'chennai': 'Tamil Nadu',
  'madras': 'Tamil Nadu',
  'coimbatore': 'Tamil Nadu',
  'madurai': 'Tamil Nadu',
  'tiruchirappalli': 'Tamil Nadu',
  'trichy': 'Tamil Nadu',
  'salem': 'Tamil Nadu',
  'tirunelveli': 'Tamil Nadu',
  'tiruppur': 'Tamil Nadu',
  'tirupur': 'Tamil Nadu',
  'vellore': 'Tamil Nadu',
  'erode': 'Tamil Nadu',
  'thoothukudi': 'Tamil Nadu',
  'tuticorin': 'Tamil Nadu',
  'dindigul': 'Tamil Nadu',
  'thanjavur': 'Tamil Nadu',
  'tanjore': 'Tamil Nadu',
  'ranipet': 'Tamil Nadu',
  'sivakasi': 'Tamil Nadu',
  'karur': 'Tamil Nadu',
  'ooty': 'Tamil Nadu',
  'udhagamandalam': 'Tamil Nadu',
  'hosur': 'Tamil Nadu',
  'nagercoil': 'Tamil Nadu',
  'kanchipuram': 'Tamil Nadu',
  'kumarakonam': 'Tamil Nadu',
  'cuddalore': 'Tamil Nadu',
  'kanyakumari': 'Tamil Nadu',

  // Telangana
  'hyderabad': 'Telangana',
  'secunderabad': 'Telangana',
  'cyberabad': 'Telangana',
  'warangal': 'Telangana',
  'nizamabad': 'Telangana',
  'karimnagar': 'Telangana',
  'ramagundam': 'Telangana',
  'khammam': 'Telangana',
  'mahbubnagar': 'Telangana',
  'nalgonda': 'Telangana',
  'adilabad': 'Telangana',
  'suryapet': 'Telangana',
  'siddipet': 'Telangana',
  'mancherial': 'Telangana',

  // Gujarat
  'ahmedabad': 'Gujarat',
  'surat': 'Gujarat',
  'vadodara': 'Gujarat',
  'baroda': 'Gujarat',
  'rajkot': 'Gujarat',
  'bhavnagar': 'Gujarat',
  'jamnagar': 'Gujarat',
  'junagadh': 'Gujarat',
  'gandhinagar': 'Gujarat',
  'anand': 'Gujarat',
  'navsari': 'Gujarat',
  'morbi': 'Gujarat',
  'nadiad': 'Gujarat',
  'surendranagar': 'Gujarat',
  'bharuch': 'Gujarat',
  'mehsana': 'Gujarat',
  'bhuj': 'Gujarat',
  'porbandar': 'Gujarat',
  'vapi': 'Gujarat',
  'valsad': 'Gujarat',
  'gandhidham': 'Gujarat',
  'veraval': 'Gujarat',
  'godhra': 'Gujarat',
  'palanpur': 'Gujarat',
  'botad': 'Gujarat',

  // Rajasthan
  'jaipur': 'Rajasthan',
  'jodhpur': 'Rajasthan',
  'kota': 'Rajasthan',
  'bikaner': 'Rajasthan',
  'ajmer': 'Rajasthan',
  'udaipur': 'Rajasthan',
  'bhilwara': 'Rajasthan',
  'alwar': 'Rajasthan',
  'bharatpur': 'Rajasthan',
  'sikar': 'Rajasthan',
  'pali': 'Rajasthan',
  'sri ganganagar': 'Rajasthan',
  'ganganagar': 'Rajasthan',
  'jaisalmer': 'Rajasthan',
  'beawar': 'Rajasthan',
  'jhunjhunu': 'Rajasthan',
  'hanumangarh': 'Rajasthan',
  'tonk': 'Rajasthan',
  'kishangarh': 'Rajasthan',
  'chittorgarh': 'Rajasthan',
  'mount abu': 'Rajasthan',
  'barmer': 'Rajasthan',
  'churu': 'Rajasthan',
  'nagaur': 'Rajasthan',

  // Uttar Pradesh
  'lucknow': 'Uttar Pradesh',
  'kanpur': 'Uttar Pradesh',
  'ghaziabad': 'Uttar Pradesh',
  'agra': 'Uttar Pradesh',
  'meerut': 'Uttar Pradesh',
  'varanasi': 'Uttar Pradesh',
  'banaras': 'Uttar Pradesh',
  'kashi': 'Uttar Pradesh',
  'prayagraj': 'Uttar Pradesh',
  'allahabad': 'Uttar Pradesh',
  'bareilly': 'Uttar Pradesh',
  'aligarh': 'Uttar Pradesh',
  'moradabad': 'Uttar Pradesh',
  'saharanpur': 'Uttar Pradesh',
  'gorakhpur': 'Uttar Pradesh',
  'noida': 'Uttar Pradesh',
  'greater noida': 'Uttar Pradesh',
  'firozabad': 'Uttar Pradesh',
  'jhansi': 'Uttar Pradesh',
  'muzaffarnagar': 'Uttar Pradesh',
  'mathura': 'Uttar Pradesh',
  'vrindavan': 'Uttar Pradesh',
  'ayodhya': 'Uttar Pradesh',
  'faizabad': 'Uttar Pradesh',
  'rampur': 'Uttar Pradesh',
  'shahjahanpur': 'Uttar Pradesh',
  'farrukhabad': 'Uttar Pradesh',
  'hapur': 'Uttar Pradesh',
  'etawah': 'Uttar Pradesh',
  'mirzapur': 'Uttar Pradesh',
  'bulandshahr': 'Uttar Pradesh',
  'sambhal': 'Uttar Pradesh',
  'amroha': 'Uttar Pradesh',
  'raebareli': 'Uttar Pradesh',
  'jaunpur': 'Uttar Pradesh',

  // West Bengal
  'kolkata': 'West Bengal',
  'calcutta': 'West Bengal',
  'howrah': 'West Bengal',
  'durgapur': 'West Bengal',
  'asansol': 'West Bengal',
  'siliguri': 'West Bengal',
  'bardhaman': 'West Bengal',
  'burdwan': 'West Bengal',
  'malda': 'West Bengal',
  'kharagpur': 'West Bengal',
  'haldia': 'West Bengal',
  'darjeeling': 'West Bengal',
  'kalimpong': 'West Bengal',
  'berhampore': 'West Bengal',
  'shantipur': 'West Bengal',
  'jalpaiguri': 'West Bengal',
  'hooghly': 'West Bengal',
  'chinsurah': 'West Bengal',

  // Kerala
  'kochi': 'Kerala',
  'cochin': 'Kerala',
  'ernakulam': 'Kerala',
  'thiruvananthapuram': 'Kerala',
  'trivandrum': 'Kerala',
  'kozhikode': 'Kerala',
  'calicut': 'Kerala',
  'thrissur': 'Kerala',
  'trichur': 'Kerala',
  'kollam': 'Kerala',
  'quilon': 'Kerala',
  'palakkad': 'Kerala',
  'palghat': 'Kerala',
  'alappuzha': 'Kerala',
  'alleppey': 'Kerala',
  'kannur': 'Kerala',
  'cannore': 'Kerala',
  'kottayam': 'Kerala',
  'kasaragod': 'Kerala',
  'malappuram': 'Kerala',
  'guruvayur': 'Kerala',
  'munnar': 'Kerala',
  'wayanad': 'Kerala',

  // Madhya Pradesh
  'bhopal': 'Madhya Pradesh',
  'indore': 'Madhya Pradesh',
  'jabalpur': 'Madhya Pradesh',
  'gwalior': 'Madhya Pradesh',
  'ujjain': 'Madhya Pradesh',
  'sagar': 'Madhya Pradesh',
  'dewas': 'Madhya Pradesh',
  'satna': 'Madhya Pradesh',
  'ratlam': 'Madhya Pradesh',
  'rewa': 'Madhya Pradesh',
  'katni': 'Madhya Pradesh',
  'singrauli': 'Madhya Pradesh',
  'burhanpur': 'Madhya Pradesh',
  'khandwa': 'Madhya Pradesh',
  'bhind': 'Madhya Pradesh',
  'chhindwara': 'Madhya Pradesh',
  'guna': 'Madhya Pradesh',
  'shivpuri': 'Madhya Pradesh',
  'vidisha': 'Madhya Pradesh',
  'damoh': 'Madhya Pradesh',
  'mandsaur': 'Madhya Pradesh',
  'hoshangabad': 'Madhya Pradesh',
  'narmadapuram': 'Madhya Pradesh',

  // Punjab
  'ludhiana': 'Punjab',
  'amritsar': 'Punjab',
  'jalandhar': 'Punjab',
  'patiala': 'Punjab',
  'bathinda': 'Punjab',
  'bhatinda': 'Punjab',
  'mohali': 'Punjab',
  'sas nagar': 'Punjab',
  'hoshiarpur': 'Punjab',
  'batala': 'Punjab',
  'pathankot': 'Punjab',
  'moga': 'Punjab',
  'abohar': 'Punjab',
  'malerkotla': 'Punjab',
  'khanna': 'Punjab',
  'phagwara': 'Punjab',
  'kapurthala': 'Punjab',
  'firozpur': 'Punjab',

  // Haryana
  'gurugram': 'Haryana',
  'gurgaon': 'Haryana',
  'faridabad': 'Haryana',
  'panipat': 'Haryana',
  'ambala': 'Haryana',
  'yamunanagar': 'Haryana',
  'rohtak': 'Haryana',
  'hisar': 'Haryana',
  'karnal': 'Haryana',
  'sonipat': 'Haryana',
  'panchkula': 'Haryana',
  'bhiwani': 'Haryana',
  'sirsa': 'Haryana',
  'bahadurgarh': 'Haryana',
  'jind': 'Haryana',
  'thanesar': 'Haryana',
  'kurukshetra': 'Haryana',
  'kaithal': 'Haryana',
  'rewari': 'Haryana',
  'palwal': 'Haryana',
  'manesar': 'Haryana',

  // Bihar
  'patna': 'Bihar',
  'gaya': 'Bihar',
  'bhagalpur': 'Bihar',
  'muzaffarpur': 'Bihar',
  'purnia': 'Bihar',
  'darbhanga': 'Bihar',
  'bihar sharif': 'Bihar',
  'arrah': 'Bihar',
  'begusarai': 'Bihar',
  'katihar': 'Bihar',
  'munger': 'Bihar',
  'chhapra': 'Bihar',
  'danapur': 'Bihar',
  'saharsa': 'Bihar',
  'sasaram': 'Bihar',
  'hajipur': 'Bihar',
  'dehri': 'Bihar',
  'bettiah': 'Bihar',
  'motihari': 'Bihar',

  // Andhra Pradesh
  'visakhapatnam': 'Andhra Pradesh',
  'vizag': 'Andhra Pradesh',
  'vijayawada': 'Andhra Pradesh',
  'guntur': 'Andhra Pradesh',
  'nellore': 'Andhra Pradesh',
  'kurnool': 'Andhra Pradesh',
  'kakinada': 'Andhra Pradesh',
  'rajahmundry': 'Andhra Pradesh',
  'tirupati': 'Andhra Pradesh',
  'kadapa': 'Andhra Pradesh',
  'anantapur': 'Andhra Pradesh',
  'vizianagaram': 'Andhra Pradesh',
  'eluru': 'Andhra Pradesh',
  'ongole': 'Andhra Pradesh',
  'nandyal': 'Andhra Pradesh',
  'machilipatnam': 'Andhra Pradesh',
  'adoni': 'Andhra Pradesh',
  'tenali': 'Andhra Pradesh',
  'chittoor': 'Andhra Pradesh',
  'hindupur': 'Andhra Pradesh',
  'bhimavaram': 'Andhra Pradesh',
  'srikakulam': 'Andhra Pradesh',

  // Odisha
  'bhubaneswar': 'Odisha',
  'cuttack': 'Odisha',
  'rourkela': 'Odisha',
  'berhampur': 'Odisha',
  'brahmapur': 'Odisha',
  'sambalpur': 'Odisha',
  'puri': 'Odisha',
  'balasore': 'Odisha',
  'bhadrak': 'Odisha',
  'baripada': 'Odisha',
  'jharsuguda': 'Odisha',

  // Chhattisgarh
  'raipur': 'Chhattisgarh',
  'bhilai': 'Chhattisgarh',
  'bilaspur': 'Chhattisgarh',
  'korba': 'Chhattisgarh',
  'durg': 'Chhattisgarh',
  'rajnandgaon': 'Chhattisgarh',
  'jagdalpur': 'Chhattisgarh',
  'raigarh': 'Chhattisgarh',
  'ambikapur': 'Chhattisgarh',

  // Jharkhand
  'ranchi': 'Jharkhand',
  'jamshedpur': 'Jharkhand',
  'dhanbad': 'Jharkhand',
  'bokaro': 'Jharkhand',
  'bokaro steel city': 'Jharkhand',
  'deoghar': 'Jharkhand',
  'hazaribagh': 'Jharkhand',
  'giridih': 'Jharkhand',
  'ramgarh': 'Jharkhand',
  'medininagar': 'Jharkhand',

  // Assam
  'guwahati': 'Assam',
  'gauhati': 'Assam',
  'silchar': 'Assam',
  'dibrugarh': 'Assam',
  'jorhat': 'Assam',
  'nagaon': 'Assam',
  'tinsukia': 'Assam',
  'tezpur': 'Assam',
  'bongaigaon': 'Assam',

  // Uttarakhand
  'dehradun': 'Uttarakhand',
  'haridwar': 'Uttarakhand',
  'roorkee': 'Uttarakhand',
  'haldwani': 'Uttarakhand',
  'rudrapur': 'Uttarakhand',
  'kashipur': 'Uttarakhand',
  'rishikesh': 'Uttarakhand',
  'nainital': 'Uttarakhand',
  'mussoorie': 'Uttarakhand',
  'almora': 'Uttarakhand',

  // Himachal Pradesh
  'shimla': 'Himachal Pradesh',
  'dharamshala': 'Himachal Pradesh',
  'solan': 'Himachal Pradesh',
  'mandi': 'Himachal Pradesh',
  'kullu': 'Himachal Pradesh',
  'manali': 'Himachal Pradesh',
  'baddi': 'Himachal Pradesh',
  'nahan': 'Himachal Pradesh',
  'hamirpur': 'Himachal Pradesh',
  'una': 'Himachal Pradesh',

  // Goa
  'panaji': 'Goa',
  'panjim': 'Goa',
  'margao': 'Goa',
  'madgaon': 'Goa',
  'vasco da gama': 'Goa',
  'vasco': 'Goa',
  'mapusa': 'Goa',
  'ponda': 'Goa',
  'calangute': 'Goa',
  'candolim': 'Goa',

  // Chandigarh
  'chandigarh': 'Chandigarh',

  // Jammu and Kashmir
  'srinagar': 'Jammu and Kashmir',
  'jammu': 'Jammu and Kashmir',
  'anantnag': 'Jammu and Kashmir',
  'baramulla': 'Jammu and Kashmir',
  'udhampur': 'Jammu and Kashmir',
  'sopore': 'Jammu and Kashmir',
  'kathua': 'Jammu and Kashmir',

  // Ladakh
  'leh': 'Ladakh',
  'kargil': 'Ladakh',

  // Sikkim
  'gangtok': 'Sikkim',
  'namchi': 'Sikkim',

  // Tripura
  'agartala': 'Tripura',
  'dharmanagar': 'Tripura',

  // Manipur
  'imphal': 'Manipur',

  // Meghalaya
  'shillong': 'Meghalaya',
  'tura': 'Meghalaya',

  // Mizoram
  'aizawl': 'Mizoram',

  // Nagaland
  'kohima': 'Nagaland',
  'dimapur': 'Nagaland',

  // Arunachal Pradesh
  'itanagar': 'Arunachal Pradesh',
  'naharlagun': 'Arunachal Pradesh',
  'pasighat': 'Arunachal Pradesh',
  'tawang': 'Arunachal Pradesh',

  // Puducherry
  'puducherry': 'Puducherry',
  'pondicherry': 'Puducherry',
  'karaikal': 'Puducherry',
  'mahe': 'Puducherry',
  'yanam': 'Puducherry',

  // Andaman & Nicobar
  'port blair': 'Andaman and Nicobar Islands',

  // Dadra and Nagar Haveli and Daman and Diu
  'daman': 'Dadra and Nagar Haveli and Daman and Diu',
  'diu': 'Dadra and Nagar Haveli and Daman and Diu',
  'silvassa': 'Dadra and Nagar Haveli and Daman and Diu',

  // Lakshadweep
  'kavaratti': 'Lakshadweep',
};

/**
 * Finds matching Indian state for a given city name.
 * Returns the state name if found, or null if unknown.
 * @param {string} cityName
 * @returns {string | null}
 */
export function findStateByCity(cityName) {
  if (!cityName || typeof cityName !== 'string') return null;
  const clean = cityName.trim().toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ');
  if (!clean) return null;

  // Direct match
  if (CITY_TO_STATE_MAP[clean]) {
    return CITY_TO_STATE_MAP[clean];
  }

  // Substring match for compound city names (e.g., "South Mumbai", "North Kolkata", "Jaipur City")
  for (const [key, state] of Object.entries(CITY_TO_STATE_MAP)) {
    if (clean === key || clean.startsWith(key + ' ') || clean.endsWith(' ' + key)) {
      return state;
    }
  }

  return null;
}

/**
 * Derives Indian State from the first 2 digits of a 6-digit postal code.
 * @param {string} pincode
 * @returns {string | null}
 */
export function findStateByPincode(pincode) {
  if (!pincode || typeof pincode !== 'string') return null;
  const clean = pincode.replace(/\D/g, '');
  if (clean.length < 2) return null;

  const prefix = parseInt(clean.substring(0, 2), 10);
  if (prefix === 11) return 'Delhi';
  if (prefix >= 12 && prefix <= 13) return 'Haryana';
  if (prefix >= 14 && prefix <= 15) return 'Punjab';
  if (prefix === 16) return 'Chandigarh';
  if (prefix === 17) return 'Himachal Pradesh';
  if (prefix >= 18 && prefix <= 19) return 'Jammu and Kashmir';
  if (prefix >= 20 && prefix <= 28) {
    if (prefix === 24 || prefix === 26) return 'Uttarakhand';
    return 'Uttar Pradesh';
  }
  if (prefix >= 30 && prefix <= 34) return 'Rajasthan';
  if (prefix >= 36 && prefix <= 39) return 'Gujarat';
  if (prefix === 40) return 'Maharashtra'; // 403 is Goa, but 40 is Maharashtra/Goa
  if (prefix >= 41 && prefix <= 44) return 'Maharashtra';
  if (prefix >= 45 && prefix <= 48) return 'Madhya Pradesh';
  if (prefix === 49) return 'Chhattisgarh';
  if (prefix >= 50 && prefix <= 53) {
    if (prefix === 50) return 'Telangana';
    return 'Andhra Pradesh';
  }
  if (prefix >= 56 && prefix <= 59) return 'Karnataka';
  if (prefix >= 60 && prefix <= 64) return 'Tamil Nadu';
  if (prefix === 67 || prefix === 68 || prefix === 69) return 'Kerala';
  if (prefix >= 70 && prefix <= 74) return 'West Bengal';
  if (prefix >= 75 && prefix <= 77) return 'Odisha';
  if (prefix === 78) return 'Assam';
  if (prefix === 79) {
    const sub = parseInt(clean.substring(0, 3), 10);
    if (sub >= 790 && sub <= 792) return 'Arunachal Pradesh';
    if (sub >= 793 && sub <= 794) return 'Meghalaya';
    if (sub === 795) return 'Manipur';
    if (sub === 796) return 'Mizoram';
    if (sub >= 797 && sub <= 798) return 'Nagaland';
    if (sub === 799) return 'Tripura';
    return 'Assam';
  }
  if (prefix >= 80 && prefix <= 85) {
    if (prefix >= 81 && prefix <= 83) return 'Jharkhand';
    return 'Bihar';
  }
  return null;
}
