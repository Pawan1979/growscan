import { PriceService } from '../services/price.service';
import { PreloadService } from '../services/preload.service';

describe('PriceService', () => {
  it('compares prices across 5 quick commerce platforms', async () => {
    const res = await PriceService.comparePrices('Amul Milk', '400001');

    expect(res.query).toBe('Amul Milk');
    expect(res.pincode).toBe('400001');
    expect(res.results.length).toBeGreaterThanOrEqual(4);
    expect(res.cheapestPlatform).toBeDefined();
    expect(res.fastestPlatform).toBeDefined();
  });

  it('tracks user search queries dynamically into preload queue', async () => {
    await PriceService.comparePrices('Custom Olive Oil 500ml', '400001');
    const preloadItems = PreloadService.getItemsToPreload();
    expect(preloadItems).toContain('Custom Olive Oil 500ml');
  });

  it('generates 30-day price trend history', () => {
    const history = PriceService.getPriceHistory('Fortune Oil');

    expect(history.productName).toContain('Fortune');
    expect(history.dates.length).toBe(30);
    expect(history.series.length).toBe(5);
    expect(history.lowestPrice).toBeGreaterThan(0);
    expect(history.highestPrice).toBeGreaterThanOrEqual(history.lowestPrice);
  });
});
