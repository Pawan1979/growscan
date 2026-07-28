import { PriceService } from './price.service';

const DEFAULT_POPULAR_ITEMS = [
  'Amul Taaza Milk 500ml',
  'Tata Salt 1kg',
  'Fortune Sunflower Oil 1L',
  'Maggi 2-Minute Noodles',
  'Aashirvaad Atta 5kg',
  'Surf Excel Detergent Powder',
  'Coca-Cola Soft Drink',
  'Cadbury Dairy Milk Silk',
];

export class PreloadService {
  private static timer: NodeJS.Timeout | null = null;
  private static userSearchFrequency = new Map<string, number>();
  private static dynamicPreloadItems = new Set<string>();

  /**
   * Returns list of items to pre-load, combining .env configuration & top user searches
   */
  static getItemsToPreload(): string[] {
    const envItemsStr = process.env.PRELOAD_POPULAR_ITEMS;
    const baseItems = envItemsStr
      ? envItemsStr.split(',').map((s) => s.trim()).filter(Boolean)
      : DEFAULT_POPULAR_ITEMS;

    const combined = new Set<string>([...baseItems, ...Array.from(PreloadService.dynamicPreloadItems)]);
    return Array.from(combined);
  }

  /**
   * Tracks user search queries dynamically and adds popular searches to preload queue
   */
  static trackSearch(query: string): void {
    if (!query || query.trim().length < 2) return;
    const normalized = query.trim();
    const count = (PreloadService.userSearchFrequency.get(normalized.toLowerCase()) || 0) + 1;
    PreloadService.userSearchFrequency.set(normalized.toLowerCase(), count);

    // If query has been searched by users, automatically register for dynamic catalog pre-loading
    if (!PreloadService.dynamicPreloadItems.has(normalized)) {
      PreloadService.dynamicPreloadItems.add(normalized);
      console.log(`📈 Dynamically added "${normalized}" to catalog preload queue (Total items: ${PreloadService.getItemsToPreload().length})`);
    }
  }

  /**
   * Pre-fetches high-frequency product data into warm cache
   */
  static async preloadHighFrequencyData(pincode: string = '400001'): Promise<void> {
    const items = PreloadService.getItemsToPreload();
    console.log(`⚡ Preloading ${items.length} high-frequency catalog items for pincode ${pincode}...`);
    
    for (const item of items) {
      try {
        await PriceService.comparePrices(item, pincode);
      } catch (err) {
        console.warn(`Failed to preload item "${item}":`, err);
      }
    }

    const intervalSeconds = parseInt(process.env.PRELOAD_INTERVAL_SECONDS || '21600', 10);
    console.log(`✅ Catalog Preload complete! Cached ${items.length} items with TTL: ${process.env.CACHE_TTL_SECONDS || '21600'}s. Next preload in ${intervalSeconds / 3600} hours.`);

    // Schedule next background refresh
    if (!PreloadService.timer) {
      PreloadService.timer = setInterval(() => {
        PreloadService.preloadHighFrequencyData(pincode);
      }, intervalSeconds * 1000);
    }
  }
}
