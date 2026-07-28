export interface PlatformPrice {
  platformId: string;
  platformName: string;
  logoUrl?: string;
  color: string;
  productName: string;
  mrp: number;
  price: number;
  discountPercent: number;
  available: boolean;
  etaMinutes: number;
  unit: string;
  unitPriceText: string;
  platformFee: number;
  deliveryFee: number;
  handlingFee: number;
  trueTotal: number;
  deepLink?: string;
}

export interface ComparisonResult {
  query: string;
  pincode: string;
  city: string;
  state: string;
  cheapestPlatform: string;
  fastestPlatform: string;
  bestValuePlatform: string;
  results: PlatformPrice[];
  timestamp: string;
}

export interface CartItem {
  id: string;
  name: string;
  quantity: number;
  unit?: string;
  estimatedPrice?: number;
}

export interface PlatformCartSummary {
  platformId: string;
  platformName: string;
  color: string;
  itemSubtotal: number;
  platformFee: number;
  deliveryFee: number;
  handlingFee: number;
  grandTotal: number;
  availableItemCount: number;
  totalItemCount: number;
  items: {
    name: string;
    quantity: number;
    pricePerUnit: number;
    totalPrice: number;
    available: boolean;
  }[];
}

export interface SplitCartRecommendation {
  recommended: boolean;
  savingsAmount: number;
  explanation: string;
  splits: {
    platformName: string;
    color: string;
    itemNames: string[];
    subtotal: number;
    fees: number;
    total: number;
  }[];
}

export interface CartComparisonResult {
  pincode: string;
  totalItems: number;
  cheapestSinglePlatform: string;
  singlePlatformTotals: PlatformCartSummary[];
  splitCartOption: SplitCartRecommendation;
}

export interface ProductDetail {
  id: string;
  barcode?: string;
  name: string;
  brand: string;
  unit: string;
  category: string;
  imageUrl: string;
  currentPrices: PlatformPrice[];
  priceHistory: {
    date: string;
    platformId: string;
    price: number;
  }[];
}
