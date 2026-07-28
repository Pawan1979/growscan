import { PriceService } from '../services/price.service';

describe('Cart Comparison & Split-Cart Optimizer', () => {
  it('evaluates multi-item cart costs across all single platforms', async () => {
    const items = [
      { name: 'Amul Taaza Milk 500ml', quantity: 2 },
      { name: 'Tata Salt 1kg', quantity: 1 },
      { name: 'Fortune Sunflower Oil 1L', quantity: 1 },
    ];

    const result = await PriceService.compareCart(items, '400001');

    expect(result.totalItems).toBe(3);
    expect(result.singlePlatformTotals.length).toBeGreaterThanOrEqual(4);
    expect(result.cheapestSinglePlatform).toBeDefined();
    expect(result.splitCartOption).toBeDefined();
  });
});
