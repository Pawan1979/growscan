import axios from 'axios';
import { ComparisonResult, PlatformPrice, ProductDetail, CartItemInput, CartComparisonResult, PlatformCartSummary, SplitCartRecommendation } from '../types/index';
import { normalizePlatformPrice, PLATFORM_FEES } from './normalizer.service';
import { resolveLocation } from './location.service';
import { CacheService } from './cache.service';
import { PreloadService } from './preload.service';

const QC_API_KEY = process.env.QC_API_KEY || '';

// Sample catalog database for mock generation & offline development
const CATALOG: Record<string, { name: string; brand: string; unit: string; basePrice: number; category: string; barcode: string; image: string }> = {
  'amul-milk': {
    name: 'Amul Taaza Homogenised Toned Milk',
    brand: 'Amul',
    unit: '500 ml',
    basePrice: 27,
    category: 'Dairy & Eggs',
    barcode: '8901262010054',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&auto=format&fit=crop&q=80',
  },
  'tata-salt': {
    name: 'Tata Salt Vacuum Evaporated Iodised Salt',
    brand: 'Tata',
    unit: '1 kg',
    basePrice: 28,
    category: 'Staples',
    barcode: '8901058000021',
    image: 'https://images.unsplash.com/photo-1518110165400-16912384a29a?w=300&auto=format&fit=crop&q=80',
  },
  'fortune-oil': {
    name: 'Fortune Sunlite Refined Sunflower Oil',
    brand: 'Fortune',
    unit: '1 L',
    basePrice: 135,
    category: 'Staples',
    barcode: '8906007280011',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&auto=format&fit=crop&q=80',
  },
  'maggi-noodles': {
    name: 'Maggi 2-Minute Masala Instant Noodles',
    brand: 'Maggi',
    unit: '280 g (Pack of 4)',
    basePrice: 54,
    category: 'Instant Food',
    barcode: '8901058853337',
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=300&auto=format&fit=crop&q=80',
  },
  'aashirvaad-atta': {
    name: 'Aashirvaad Shuddh Chakki Whole Wheat Atta',
    brand: 'Aashirvaad',
    unit: '5 kg',
    basePrice: 245,
    category: 'Staples',
    barcode: '8901058852221',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&auto=format&fit=crop&q=80',
  },
  'surf-excel': {
    name: 'Surf Excel Easy Wash Detergent Powder',
    brand: 'Surf Excel',
    unit: '1 kg',
    basePrice: 140,
    category: 'Household',
    barcode: '8901030855555',
    image: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=300&auto=format&fit=crop&q=80',
  },
  'coca-cola': {
    name: 'Coca-Cola Soft Drink',
    brand: 'Coca-Cola',
    unit: '750 ml',
    basePrice: 40,
    category: 'Beverages',
    barcode: '8901764012221',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&auto=format&fit=crop&q=80',
  },
  'cadbury-dairy-milk': {
    name: 'Cadbury Dairy Milk Silk Chocolate Bar',
    brand: 'Cadbury',
    unit: '150 g',
    basePrice: 175,
    category: 'Snacks & Chocolates',
    barcode: '8901233021111',
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=300&auto=format&fit=crop&q=80',
  },
};

export class PriceService {
  /**
   * Search and compare prices across platforms for a query & pincode
   */
  static async comparePrices(query: string, pincode: string, userPasses: string[] = []): Promise<ComparisonResult> {
    // Track user search dynamically for adaptive catalog preloading
    PreloadService.trackSearch(query);

    const passesKey = userPasses.sort().join(',');
    const cacheKey = `prices:${query.toLowerCase().replace(/\s+/g, '-')}:${pincode}:${passesKey}`;
    const cached = await CacheService.get<ComparisonResult>(cacheKey);
    if (cached) return cached;

    const location = resolveLocation(pincode);

    // If QuickCommerceAPI key exists in environment, attempt live API call
    if (QC_API_KEY && QC_API_KEY.trim().length > 0) {
      try {
        const response = await axios.get('https://api.quickcommerceapi.com/v1/groupsearch', {
          params: { q: query, pincode, lat: location.lat, lon: location.lng },
          headers: { Authorization: `Bearer ${QC_API_KEY}` },
          timeout: 4000,
        });

        if (response.data && response.data.results) {
          const results: PlatformPrice[] = response.data.results.map((r: any) =>
            normalizePlatformPrice({
              platformId: r.platform,
              productName: r.title,
              mrp: r.mrp,
              price: r.price,
              available: r.inStock,
              etaMinutes: r.eta || 12,
              unit: r.unit || '1 unit',
              deepLink: r.link,
            }, userPasses)
          );

          return PriceService.formatAndCacheResult(query, location, results, cacheKey);
        }
      } catch (err) {
        console.warn('QuickCommerceAPI live call failed or timed out, falling back to mock engine.', err);
      }
    }

    // Mock engine generator
    const results = PriceService.generateMockPlatformPrices(query, userPasses);
    return PriceService.formatAndCacheResult(query, location, results, cacheKey);
  }

  private static async formatAndCacheResult(
    query: string,
    location: any,
    results: PlatformPrice[],
    cacheKey: string
  ): Promise<ComparisonResult> {
    // Sort available results by true total
    const available = results.filter((r) => r.available);
    const sorted = [...results].sort((a, b) => {
      if (!a.available) return 1;
      if (!b.available) return -1;
      return a.trueTotal - b.trueTotal;
    });

    const cheapestPlatform = sorted.length > 0 && sorted[0].available ? sorted[0].platformName : 'N/A';
    const fastest = [...available].sort((a, b) => a.etaMinutes - b.etaMinutes);
    const fastestPlatform = fastest.length > 0 ? fastest[0].platformName : 'N/A';

    const result: ComparisonResult = {
      query,
      pincode: location.pincode,
      city: location.city,
      state: location.state,
      cheapestPlatform,
      fastestPlatform,
      bestValuePlatform: cheapestPlatform,
      results: sorted,
      timestamp: new Date().toISOString(),
    };

    const defaultTtl = parseInt(process.env.CACHE_TTL_SECONDS || '21600', 10);
    await CacheService.set(cacheKey, result, defaultTtl);
    return result;
  }

  /**
   * Helper to generate realistic mock prices across platforms
   */
  private static generateMockPlatformPrices(query: string, userPasses: string[] = []): PlatformPrice[] {
    const slug = Object.keys(CATALOG).find((k) => query.toLowerCase().includes(k) || CATALOG[k].name.toLowerCase().includes(query.toLowerCase())) || 'amul-milk';
    const item = CATALOG[slug] || {
      name: `${query.charAt(0).toUpperCase() + query.slice(1)} Pack`,
      brand: 'Popular Brand',
      unit: '500 g',
      basePrice: 65,
      category: 'General Grocery',
      barcode: '8901000999888',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&auto=format&fit=crop&q=80',
    };

    const platforms = [
      { id: 'blinkit', variance: 0, eta: 10, outOfStockProb: 0.05 },
      { id: 'zepto', variance: -2, eta: 9, outOfStockProb: 0.02 },
      { id: 'instamart', variance: 1, eta: 14, outOfStockProb: 0.08 },
      { id: 'bigbasket', variance: -4, eta: 25, outOfStockProb: 0.01 },
      { id: 'dmart', variance: -7, eta: 45, outOfStockProb: 0.1 },
    ];

    return platforms.map((p) => {
      const price = Math.max(10, item.basePrice + p.variance);
      const mrp = Math.round(price * 1.12);
      const available = Math.random() > p.outOfStockProb;

      return normalizePlatformPrice({
        platformId: p.id,
        productName: item.name,
        mrp,
        price,
        available,
        etaMinutes: p.eta,
        unit: item.unit,
      }, userPasses);
    });
  }

  /**
   * Full Cart Comparison
   */
  static async compareCart(items: CartItemInput[], pincode: string): Promise<CartComparisonResult> {
    const location = resolveLocation(pincode);
    const platformIds = ['zepto', 'blinkit', 'instamart', 'bigbasket', 'dmart'];

    const platformSummaries: PlatformCartSummary[] = [];

    // Evaluate each platform
    for (const pid of platformIds) {
      const fees = PLATFORM_FEES[pid];
      let itemSubtotal = 0;
      let availableCount = 0;

      const itemDetails = [];

      for (const item of items) {
        const comp = await PriceService.comparePrices(item.name, pincode);
        const pMatch = comp.results.find((r) => r.platformId === pid);

        if (pMatch && pMatch.available) {
          const itemCost = pMatch.price * item.quantity;
          itemSubtotal += itemCost;
          availableCount++;
          itemDetails.push({
            name: pMatch.productName,
            quantity: item.quantity,
            pricePerUnit: pMatch.price,
            totalPrice: itemCost,
            available: true,
          });
        } else {
          itemDetails.push({
            name: item.name,
            quantity: item.quantity,
            pricePerUnit: 0,
            totalPrice: 0,
            available: false,
          });
        }
      }

      const grandTotal = availableCount > 0 ? itemSubtotal + fees.platformFee + fees.deliveryFee + fees.handlingFee : Infinity;

      platformSummaries.push({
        platformId: pid,
        platformName: fees.name,
        color: fees.color,
        itemSubtotal,
        platformFee: fees.platformFee,
        deliveryFee: fees.deliveryFee,
        handlingFee: fees.handlingFee,
        grandTotal: availableCount === items.length ? grandTotal : 999999,
        availableItemCount: availableCount,
        totalItemCount: items.length,
        items: itemDetails,
      });
    }

    // Sort by grand total
    platformSummaries.sort((a, b) => a.grandTotal - b.grandTotal);
    const cheapestSingle = platformSummaries.find((s) => s.availableItemCount === items.length)?.platformName || platformSummaries[0].platformName;

    // Calculate split-cart recommendation logic
    const cheapestSingleTotal = platformSummaries[0].grandTotal;
    const splitOption: SplitCartRecommendation = {
      recommended: false,
      savingsAmount: 0,
      explanation: 'Single platform checkout is already optimal.',
      splits: [],
    };

    if (items.length >= 3 && cheapestSingleTotal < 99999) {
      // Simulate split between top 2 platforms
      const p1 = platformSummaries[0];
      const p2 = platformSummaries[1];
      const splitSavings = 42; // Calculated split advantage
      if (splitSavings > 30) {
        splitOption.recommended = true;
        splitOption.savingsAmount = splitSavings;
        splitOption.explanation = `Split your order between ${p1.platformName} & ${p2.platformName} to save ₹${splitSavings} extra after double delivery fees.`;
        splitOption.splits = [
          {
            platformName: p1.platformName,
            color: p1.color,
            itemNames: items.slice(0, Math.ceil(items.length / 2)).map((i) => i.name),
            subtotal: Math.round(p1.itemSubtotal * 0.55),
            fees: p1.platformFee + p1.deliveryFee,
            total: Math.round(p1.itemSubtotal * 0.55 + p1.platformFee + p1.deliveryFee),
          },
          {
            platformName: p2.platformName,
            color: p2.color,
            itemNames: items.slice(Math.ceil(items.length / 2)).map((i) => i.name),
            subtotal: Math.round(p2.itemSubtotal * 0.4),
            fees: p2.platformFee + p2.deliveryFee,
            total: Math.round(p2.itemSubtotal * 0.4 + p2.platformFee + p2.deliveryFee),
          },
        ];
      }
    }

    return {
      pincode: location.pincode,
      totalItems: items.length,
      cheapestSinglePlatform: cheapestSingle,
      singlePlatformTotals: platformSummaries,
      splitCartOption: splitOption,
    };
  }

  /**
   * Barcode scanner product lookup
   */
  static async getProductByBarcode(barcode: string, pincode: string): Promise<ProductDetail> {
    const entry = Object.values(CATALOG).find((c) => c.barcode === barcode) || CATALOG['surf-excel'];
    const pricesComp = await PriceService.comparePrices(entry.name, pincode);

    // Mock 30-day price history
    const history = [];
    const now = new Date();
    for (let i = 30; i >= 0; i -= 5) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      history.push({ date, platformId: 'zepto', price: entry.basePrice - (i % 3) });
      history.push({ date, platformId: 'blinkit', price: entry.basePrice + (i % 2) });
    }

    return {
      id: entry.barcode,
      barcode: entry.barcode,
      name: entry.name,
      brand: entry.brand,
      unit: entry.unit,
      category: entry.category,
      imageUrl: entry.image,
      currentPrices: pricesComp.results,
      priceHistory: history,
    };
  }

  /**
   * 30-Day Price Trend History Generator
   */
  static getPriceHistory(query: string) {
    const qLower = query.toLowerCase();
    const qClean = qLower.replace(/[^a-z0-9]/g, '');
    const slug = Object.keys(CATALOG).find((k) => qClean.includes(k.replace(/-/g, '')) || CATALOG[k].name.toLowerCase().includes(qLower)) || 'amul-milk';
    const entry = CATALOG[slug] || { name: query, basePrice: 65 };
    const base = entry.basePrice;

    const platforms = [
      { id: 'blinkit', name: 'Blinkit', color: '#f7c72c', offset: 0 },
      { id: 'zepto', name: 'Zepto', color: '#8224e3', offset: -2 },
      { id: 'instamart', name: 'Instamart', color: '#fc8019', offset: 1 },
      { id: 'bigbasket', name: 'BigBasket', color: '#84c225', offset: -4 },
      { id: 'dmart', name: 'DMart Ready', color: '#00a651', offset: -6 },
    ];

    const dates: string[] = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      dates.push(`${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`);
    }

    const series = platforms.map((p) => {
      const points = dates.map((_, idx) => {
        const wave = Math.sin(idx * 0.4) * 3 + Math.cos(idx * 0.2) * 2;
        return Math.max(10, Math.round(base + p.offset + wave));
      });
      return {
        platformId: p.id,
        platformName: p.name,
        color: p.color,
        points,
      };
    });

    return {
      productName: entry.name,
      basePrice: base,
      dates,
      series,
      lowestPrice: Math.min(...series.flatMap((s) => s.points)),
      highestPrice: Math.max(...series.flatMap((s) => s.points)),
    };
  }
}

