import { PlatformPrice } from '../types/index.js';

export const PLATFORM_FEES: Record<string, { platformFee: number; deliveryFee: number; handlingFee: number; color: string; name: string }> = {
  blinkit: { platformFee: 5, deliveryFee: 15, handlingFee: 4, color: '#f8cc1b', name: 'Blinkit' },
  zepto: { platformFee: 4, deliveryFee: 15, handlingFee: 5, color: '#8b3dff', name: 'Zepto' },
  instamart: { platformFee: 6, deliveryFee: 20, handlingFee: 5, color: '#fc8019', name: 'Swiggy Instamart' },
  bigbasket: { platformFee: 0, deliveryFee: 25, handlingFee: 0, color: '#84c225', name: 'BigBasket BB Now' },
  dmart: { platformFee: 0, deliveryFee: 30, handlingFee: 0, color: '#e23744', name: 'DMart Ready' },
  dunzo: { platformFee: 5, deliveryFee: 25, handlingFee: 5, color: '#00d290', name: 'Dunzo Daily' },
};

/**
 * Calculates per-unit price string e.g. "₹5.40 / 100ml" or "₹12.00 / 100g"
 */
export function calculateUnitPrice(price: number, unitStr: string): string {
  if (!unitStr) return `₹${price.toFixed(2)}`;

  const match = unitStr.match(/(\d+(?:\.\d+)?)\s*(g|gm|kg|ml|l|ltr|litre|pc|pcs|pack)/i);
  if (!match) return `₹${price.toFixed(2)}`;

  const value = parseFloat(match[1]);
  const rawUnit = match[2].toLowerCase();

  if (rawUnit === 'g' || rawUnit === 'gm') {
    const pricePer100g = (price / value) * 100;
    return `₹${pricePer100g.toFixed(2)} / 100g`;
  } else if (rawUnit === 'kg') {
    const pricePer100g = (price / (value * 1000)) * 100;
    return `₹${pricePer100g.toFixed(2)} / 100g`;
  } else if (rawUnit === 'ml') {
    const pricePer100ml = (price / value) * 100;
    return `₹${pricePer100ml.toFixed(2)} / 100ml`;
  } else if (rawUnit === 'l' || rawUnit === 'ltr' || rawUnit === 'litre') {
    const pricePer100ml = (price / (value * 1000)) * 100;
    return `₹${pricePer100ml.toFixed(2)} / 100ml`;
  }

  return `₹${(price / value).toFixed(2)} / ${rawUnit}`;
}

/**
 * Normalizes raw platform data into standardized PlatformPrice structure with pass optimization
 */
export function normalizePlatformPrice(
  raw: {
    platformId: string;
    productName: string;
    mrp: number;
    price: number;
    available: boolean;
    etaMinutes: number;
    unit: string;
    deepLink?: string;
  },
  userPasses: string[] = []
): PlatformPrice {
  const fees = PLATFORM_FEES[raw.platformId.toLowerCase()] || {
    platformFee: 5,
    deliveryFee: 15,
    handlingFee: 4,
    color: '#6c63ff',
    name: raw.platformId,
  };

  let platformFee = fees.platformFee;
  let deliveryFee = fees.deliveryFee;
  let handlingFee = fees.handlingFee;

  const pid = raw.platformId.toLowerCase();

  // Apply subscription pass waivers
  if (pid === 'blinkit' && userPasses.includes('blinkit_pass') && raw.price >= 99) {
    deliveryFee = 0;
  }
  if (pid === 'zepto' && userPasses.includes('zepto_super') && raw.price >= 99) {
    deliveryFee = 0;
    handlingFee = 0;
  }
  if (pid === 'instamart' && userPasses.includes('swiggy_one') && raw.price >= 149) {
    deliveryFee = 0;
  }
  if (pid === 'bigbasket' && userPasses.includes('bb_star') && raw.price >= 199) {
    deliveryFee = 0;
  }

  const discountPercent = raw.mrp > raw.price ? Math.round(((raw.mrp - raw.price) / raw.mrp) * 100) : 0;
  const unitPriceText = calculateUnitPrice(raw.price, raw.unit);
  const trueTotal = raw.available ? raw.price + platformFee + deliveryFee + handlingFee : Infinity;

  return {
    platformId: pid,
    platformName: fees.name,
    color: fees.color,
    productName: raw.productName,
    mrp: raw.mrp,
    price: raw.price,
    discountPercent,
    available: raw.available,
    etaMinutes: raw.etaMinutes,
    unit: raw.unit,
    unitPriceText,
    platformFee,
    deliveryFee,
    handlingFee,
    trueTotal: raw.available ? trueTotal : 0,
    deepLink: raw.deepLink || `#buy-${raw.platformId}`,
  };
}
