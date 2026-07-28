export interface LocationInfo {
  pincode: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
}

const PINCODE_DATABASE: Record<string, { city: string; state: string; lat: number; lng: number }> = {
  '400001': { city: 'Mumbai', state: 'Maharashtra', lat: 18.96, lng: 72.82 },
  '400050': { city: 'Bandra, Mumbai', state: 'Maharashtra', lat: 19.06, lng: 72.83 },
  '110001': { city: 'Connaught Place, New Delhi', state: 'Delhi', lat: 28.63, lng: 77.21 },
  '560001': { city: 'MG Road, Bengaluru', state: 'Karnataka', lat: 12.97, lng: 77.59 },
  '560102': { city: 'HSR Layout, Bengaluru', state: 'Karnataka', lat: 12.91, lng: 77.64 },
  '500081': { city: 'HITECH City, Hyderabad', state: 'Telangana', lat: 17.44, lng: 78.38 },
  '600001': { city: 'Parrys, Chennai', state: 'Tamil Nadu', lat: 13.08, lng: 80.28 },
  '700001': { city: 'BBD Bagh, Kolkata', state: 'West Bengal', lat: 22.57, lng: 88.35 },
  '411001': { city: 'Camp, Pune', state: 'Maharashtra', lat: 18.52, lng: 73.85 },
  '380001': { city: 'Lal Darwaja, Ahmedabad', state: 'Gujarat', lat: 23.02, lng: 72.57 }
};

export function resolveLocation(pincode: string = '400001'): LocationInfo {
  const cleanPin = pincode.trim();
  const found = PINCODE_DATABASE[cleanPin];
  if (found) {
    return { pincode: cleanPin, ...found };
  }

  // Fallback default (Mumbai)
  return {
    pincode: cleanPin || '400001',
    city: 'Mumbai',
    state: 'Maharashtra',
    lat: 18.96,
    lng: 72.82
  };
}
