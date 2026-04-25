/**
 * Area Coordinates Mapping for Dhaka/Bangladesh
 * Used for smart volunteer assignment when GPS location is not available
 * 
 * Format: areaName -> { latitude, longitude }
 * Can be easily extended with more areas
 */

export interface AreaCoordinate {
  latitude: number
  longitude: number
  region?: string
}

// Common Dhaka areas with their approximate coordinates

export const dhakaAreas: Record<string, AreaCoordinate> = {
  // ── Central Dhaka ──
  "dhaka": { latitude: 23.8103, longitude: 90.4125, region: "Central" },
  "shahbagh": { latitude: 23.7381, longitude: 90.3978, region: "Central" },
  "ramna": { latitude: 23.7432, longitude: 90.4123, region: "Central" },
  "motijheel": { latitude: 23.7291, longitude: 90.4174, region: "Central" },
  "paltan": { latitude: 23.7337, longitude: 90.4150, region: "Central" },
  "segunbagicha": { latitude: 23.7389, longitude: 90.4089, region: "Central" },
  "kakrail": { latitude: 23.7389, longitude: 90.4089, region: "Central" },
  "naya paltan": { latitude: 23.7337, longitude: 90.4150, region: "Central" },
  "purana paltan": { latitude: 23.7337, longitude: 90.4150, region: "Central" },
  "bijoy nagar": { latitude: 23.7389, longitude: 90.4050, region: "Central" },
  "farmgate": { latitude: 23.7582, longitude: 90.3893, region: "Central" },
  "karwan bazar": { latitude: 23.7516, longitude: 90.3928, region: "Central" },
  "tejgaon": { latitude: 23.7667, longitude: 90.3833, region: "Central" },
  "tejgaon industrial": { latitude: 23.7700, longitude: 90.3900, region: "Central" },
  "hatirjheel": { latitude: 23.7618, longitude: 90.4130, region: "Central" },
  "eskaton": { latitude: 23.7460, longitude: 90.4010, region: "Central" },
  "shantinagar": { latitude: 23.7340, longitude: 90.4180, region: "Central" },
  "minto road": { latitude: 23.7389, longitude: 90.4089, region: "Central" },
  "matsya bhaban": { latitude: 23.7389, longitude: 90.4010, region: "Central" },

  // ── North Dhaka ──
  "uttara": { latitude: 23.8759, longitude: 90.3795, region: "North" },
  "uttara sector 1": { latitude: 23.8650, longitude: 90.3795, region: "North" },
  "uttara sector 3": { latitude: 23.8700, longitude: 90.3850, region: "North" },
  "uttara sector 4": { latitude: 23.8750, longitude: 90.3800, region: "North" },
  "uttara sector 6": { latitude: 23.8800, longitude: 90.3850, region: "North" },
  "uttara sector 7": { latitude: 23.8850, longitude: 90.3750, region: "North" },
  "uttara sector 10": { latitude: 23.8759, longitude: 90.3700, region: "North" },
  "uttara sector 11": { latitude: 23.8759, longitude: 90.3650, region: "North" },
  "uttara sector 12": { latitude: 23.8759, longitude: 90.3600, region: "North" },
  "tongi": { latitude: 23.9879, longitude: 90.4027, region: "North" },
  "tongi bazar": { latitude: 23.9879, longitude: 90.4027, region: "North" },
  "turag": { latitude: 23.9000, longitude: 90.3500, region: "North" },
  "ashkona": { latitude: 23.8450, longitude: 90.3900, region: "North" },
  "diabari": { latitude: 23.8950, longitude: 90.3700, region: "North" },
  "nikunja": { latitude: 23.8350, longitude: 90.4000, region: "North" },
  "khilkhet": { latitude: 23.8250, longitude: 90.4100, region: "North" },
  "kuril": { latitude: 23.8250, longitude: 90.4250, region: "North" },
  "airport": { latitude: 23.8433, longitude: 90.3978, region: "North" },
  "hazrat shahjalal airport": { latitude: 23.8433, longitude: 90.3978, region: "North" },

  // ── Mirpur Area ──
  "mirpur": { latitude: 23.8067, longitude: 90.3667, region: "North" },
  "mirpur 1": { latitude: 23.7967, longitude: 90.3583, region: "North" },
  "mirpur 2": { latitude: 23.8033, longitude: 90.3617, region: "North" },
  "mirpur 6": { latitude: 23.8050, longitude: 90.3650, region: "North" },
  "mirpur 7": { latitude: 23.8083, longitude: 90.3617, region: "North" },
  "mirpur 10": { latitude: 23.8067, longitude: 90.3667, region: "North" },
  "mirpur 11": { latitude: 23.8167, longitude: 90.3583, region: "North" },
  "mirpur 12": { latitude: 23.8267, longitude: 90.3583, region: "North" },
  "mirpur 13": { latitude: 23.8350, longitude: 90.3600, region: "North" },
  "mirpur 14": { latitude: 23.8400, longitude: 90.3633, region: "North" },
  "pallabi": { latitude: 23.8267, longitude: 90.3583, region: "North" },
  "shewrapara": { latitude: 23.7950, longitude: 90.3633, region: "North" },
  "kazipara": { latitude: 23.7950, longitude: 90.3633, region: "North" },
  "kafrul": { latitude: 23.7850, longitude: 90.3542, region: "North" },
  "ibrahimpur": { latitude: 23.8100, longitude: 90.3700, region: "North" },
  "pirerbag": { latitude: 23.7900, longitude: 90.3600, region: "North" },
  "rupnagar": { latitude: 23.8200, longitude: 90.3500, region: "North" },
  "section 6 mirpur": { latitude: 23.8050, longitude: 90.3650, region: "North" },

  // ── Gulshan / Banani / Baridhara ──
  "gulshan": { latitude: 23.7925, longitude: 90.4150, region: "Central" },
  "gulshan 1": { latitude: 23.7858, longitude: 90.4125, region: "Central" },
  "gulshan 2": { latitude: 23.7958, longitude: 90.4158, region: "Central" },
  "banani": { latitude: 23.7937, longitude: 90.4066, region: "Central" },
  "baridhara": { latitude: 23.8050, longitude: 90.4305, region: "Central" },
  "baridhara dohs": { latitude: 23.8100, longitude: 90.4350, region: "Central" },
  "diplomatic zone": { latitude: 23.8050, longitude: 90.4305, region: "Central" },
  "bashundhara": { latitude: 23.8150, longitude: 90.4280, region: "Central" },
  "bashundhara r/a": { latitude: 23.8150, longitude: 90.4280, region: "Central" },
  "north dohs": { latitude: 23.8200, longitude: 90.4200, region: "Central" },
  "cantonment": { latitude: 23.8200, longitude: 90.4000, region: "Central" },

  // ── Dhanmondi / Mohammadpur ──
  "dhanmondi": { latitude: 23.7465, longitude: 90.3759, region: "Central" },
  "dhanmondi 27": { latitude: 23.7500, longitude: 90.3750, region: "Central" },
  "dhanmondi 32": { latitude: 23.7533, longitude: 90.3700, region: "Central" },
  "mohammadpur": { latitude: 23.7650, longitude: 90.3594, region: "Central" },
  "mohammadpur bazar": { latitude: 23.7650, longitude: 90.3594, region: "Central" },
  "mohammadpur bus stand": { latitude: 23.7633, longitude: 90.3567, region: "Central" },
  "shyamoli": { latitude: 23.7700, longitude: 90.3600, region: "Central" },
  "adabor": { latitude: 23.7700, longitude: 90.3467, region: "Central" },
  "lalmatia": { latitude: 23.7550, longitude: 90.3733, region: "Central" },
  "hazaribagh": { latitude: 23.7267, longitude: 90.3800, region: "Central" },
  "kalabagan": { latitude: 23.7483, longitude: 90.3833, region: "Central" },
  "green road": { latitude: 23.7533, longitude: 90.3867, region: "Central" },
  "science lab": { latitude: 23.7417, longitude: 90.3900, region: "Central" },
  "new market": { latitude: 23.7350, longitude: 90.3867, region: "Central" },
  "azimpur": { latitude: 23.7267, longitude: 90.3883, region: "Central" },
  "nilkhet": { latitude: 23.7317, longitude: 90.3933, region: "Central" },
  "elephant road": { latitude: 23.7400, longitude: 90.3933, region: "Central" },

  // ── Khilgaon / Rayer Bazar / East ──
  "khilgaon": { latitude: 23.7472, longitude: 90.4352, region: "East" },
  "khilgaon tp": { latitude: 23.7472, longitude: 90.4352, region: "East" },
  "khilagoan": { latitude: 23.7472, longitude: 90.4352, region: "East" },
  "khilagaon": { latitude: 23.7472, longitude: 90.4352, region: "East" },
  "khilgoan": { latitude: 23.7472, longitude: 90.4352, region: "East" },
  "khaigaon": { latitude: 23.7472, longitude: 90.4352, region: "East" },
"khaigoan": { latitude: 23.7472, longitude: 90.4352, region: "East" },
"khaygun": { latitude: 23.7472, longitude: 90.4352, region: "East" },
  "tilpapara": { latitude: 23.7450, longitude: 90.4380, region: "East" },
  "khilgaon chowrasta": { latitude: 23.7500, longitude: 90.4333, region: "East" },
  "badda": { latitude: 23.7800, longitude: 90.4333, region: "East" },
  "badda bazar": { latitude: 23.7800, longitude: 90.4333, region: "East" },
  "meradia": { latitude: 23.7583, longitude: 90.4419, region: "East" },
  "karnaphuli": { latitude: 23.7541, longitude: 90.4357, region: "East" },
  "rampura": { latitude: 23.7617, longitude: 90.4233, region: "East" },
  "banasree": { latitude: 23.7583, longitude: 90.4467, region: "East" },
  "aftabnagar": { latitude: 23.7550, longitude: 90.4500, region: "East" },
  "mugda": { latitude: 23.7383, longitude: 90.4283, region: "East" },
  "malibagh": { latitude: 23.7467, longitude: 90.4183, region: "East" },
  "mouchak": { latitude: 23.7467, longitude: 90.4183, region: "East" },
  "rajarbagh": { latitude: 23.7383, longitude: 90.4233, region: "East" },
  "rajabazar": { latitude: 23.7481, longitude: 90.4337, region: "East" },
  "gopibazar": { latitude: 23.7409, longitude: 90.4326, region: "East" },
  "chankharpul": { latitude: 23.7371, longitude: 90.4253, region: "East" },
  "charkhanpur": { latitude: 23.7600, longitude: 90.4300, region: "East" },
  "demra": { latitude: 23.7133, longitude: 90.4833, region: "East" },
  "jatrabari": { latitude: 23.7083, longitude: 90.4333, region: "East" },
  "syedabad": { latitude: 23.7083, longitude: 90.4333, region: "East" },
  "konapara": { latitude: 23.7050, longitude: 90.4500, region: "East" },
  "matuail": { latitude: 23.6950, longitude: 90.4600, region: "East" },

  // ── Golapbag / Central-East ──
  "golabbag": { latitude: 23.7400, longitude: 90.4100, region: "Central" },
  "golapbag": { latitude: 23.7400, longitude: 90.4100, region: "Central" },
  "golapbug": { latitude: 23.7400, longitude: 90.4100, region: "Central" },
  "golap bag": { latitude: 23.7400, longitude: 90.4100, region: "Central" },
  "golap bug": { latitude: 23.7400, longitude: 90.4100, region: "Central" },
  "golab bag": { latitude: 23.7400, longitude: 90.4100, region: "Central" },
  "golab bug": { latitude: 23.7400, longitude: 90.4100, region: "Central" },

  // ── Old Dhaka / South ──
  "old dhaka": { latitude: 23.7100, longitude: 90.4074, region: "South" },
  "lalbagh": { latitude: 23.7109, longitude: 90.3857, region: "South" },
  "lalbag": { latitude: 23.7109, longitude: 90.3857, region: "South" },
  "chawkbazar": { latitude: 23.7150, longitude: 90.4050, region: "South" },
  "islampur": { latitude: 23.7183, longitude: 90.4067, region: "South" },
  "nazira bazar": { latitude: 23.7183, longitude: 90.4067, region: "South" },
  "imamganj": { latitude: 23.7133, longitude: 90.4100, region: "South" },
  "farashganj": { latitude: 23.7033, longitude: 90.4141, region: "South" },
  "sadarghat": { latitude: 23.7033, longitude: 90.4141, region: "South" },
  "wiseghat": { latitude: 23.7083, longitude: 90.4167, region: "South" },
  "ahsanullah": { latitude: 23.7183, longitude: 90.4083, region: "South" },
  "bangshal": { latitude: 23.7183, longitude: 90.4100, region: "South" },
  "armanitola": { latitude: 23.7167, longitude: 90.4133, region: "South" },
  "sutrapur": { latitude: 23.7200, longitude: 90.4200, region: "South" },
  "wari": { latitude: 23.7233, longitude: 90.4200, region: "South" },
  "gendaria": { latitude: 23.7167, longitude: 90.4283, region: "South" },
  "dholaikhal": { latitude: 23.7233, longitude: 90.4133, region: "South" },
  "postogola": { latitude: 23.6950, longitude: 90.4333, region: "South" },
  "keraniganj": { latitude: 23.6833, longitude: 90.3833, region: "South" },
  "buriganga": { latitude: 23.7000, longitude: 90.3933, region: "South" },
  "zinzira": { latitude: 23.6900, longitude: 90.3900, region: "South" },


  // ── Rayer Bazar / West ──
  "rayer bazar": { latitude: 23.7500, longitude: 90.3600, region: "Central" },
  "rayerbazar": { latitude: 23.7500, longitude: 90.3600, region: "Central" },
  "beribadh": { latitude: 23.7600, longitude: 90.3400, region: "West" },
  "savar": { latitude: 23.8583, longitude: 90.2667, region: "West" },
  "hemayetpur": { latitude: 23.8700, longitude: 90.2333, region: "West" },
  "ashulia": { latitude: 23.9000, longitude: 90.3000, region: "West" },
  "aminbazar": { latitude: 23.7950, longitude: 90.3150, region: "West" },
  "gabtoli": { latitude: 23.7783, longitude: 90.3433, region: "West" },
  "technical": { latitude: 23.7783, longitude: 90.3633, region: "West" },

  // ── Jatrabari / Postogola / South-East ──
  "jurain": { latitude: 23.7000, longitude: 90.4200, region: "South" },
  "shyampur": { latitude: 23.7083, longitude: 90.4500, region: "South" },
  "narayanganj": { latitude: 23.6236, longitude: 90.5000, region: "South" },

  // ── Other Major Areas ──
  "baytul mukarram": { latitude: 23.7295, longitude: 90.4125, region: "Central" },
  "press club": { latitude: 23.7337, longitude: 90.4100, region: "Central" },
  "tscd": { latitude: 23.7337, longitude: 90.4100, region: "Central" },
  "national press club": { latitude: 23.7337, longitude: 90.4100, region: "Central" },
  "mohammedpur": { latitude: 23.7650, longitude: 90.3594, region: "Central" },
  "mohamour": { latitude: 23.7200, longitude: 90.4400, region: "South" },
  "mohampur": { latitude: 23.7200, longitude: 90.4400, region: "South" },
  "jutebazar": { latitude: 23.7374, longitude: 90.4254, region: "East" },
  "siddiqbazar": { latitude: 23.7357, longitude: 90.4371, region: "East" },

  // ── Other Cities ──
  "chittagong": { latitude: 22.3569, longitude: 91.7832, region: "Chittagong" },
  "sylhet": { latitude: 24.8949, longitude: 91.8614, region: "Sylhet" },
  "khulna": { latitude: 22.8456, longitude: 89.5403, region: "Khulna" },
  "barisal": { latitude: 22.7010, longitude: 90.3535, region: "Barisal" },
  "rangpur": { latitude: 25.7439, longitude: 89.2752, region: "Rangpur" },
  "mymensingh": { latitude: 24.7471, longitude: 90.4203, region: "Mymensingh" },
  "rajshahi": { latitude: 24.3745, longitude: 88.6012, region: "Rajshahi" },
  "gazipur": { latitude: 23.9431, longitude: 90.4036, region: "Gazipur" },
  "tangail": { latitude: 24.2513, longitude: 89.9167, region: "Tangail" },
  "comilla": { latitude: 23.4607, longitude: 91.1809, region: "Comilla" },
  "bogra": { latitude: 24.8465, longitude: 89.3773, region: "Bogra" },
  "jessore": { latitude: 23.1667, longitude: 89.2167, region: "Jessore" },
  "noakhali": { latitude: 22.8696, longitude: 91.0996, region: "Noakhali" },
  "cox bazar": { latitude: 21.4272, longitude: 92.0058, region: "Cox's Bazar" },
  "cox's bazar": { latitude: 21.4272, longitude: 92.0058, region: "Cox's Bazar" },
}
 

// Normalize area name for matching
export function normalizeAreaName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
}

// Get coordinates for an address/service area
export function getAreaCoordinates(address: string): AreaCoordinate | null {
  if (!address) return null
  
  const normalized = normalizeAreaName(address)
  
  // Direct match
  if (dhakaAreas[normalized]) {
    return dhakaAreas[normalized]
  }
  
  // Partial match - check if any key is contained in the address
  for (const [area, coords] of Object.entries(dhakaAreas)) {
    if (normalized.includes(area) || area.includes(normalized)) {
      return coords
    }
  }
  
  return null
}

// Get all areas (for dropdown selection, etc.)
export function getAllAreas(): { name: string; coords: AreaCoordinate }[] {
  return Object.entries(dhakaAreas).map(([name, coords]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    coords
  }))
}

// Calculate distance between two coordinates (Haversine formula)
export function calculateDistanceFromCoords(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371 // Radius of Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

