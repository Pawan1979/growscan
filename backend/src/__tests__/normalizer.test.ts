import { calculateUnitPrice, normalizePlatformPrice } from '../services/normalizer.service';

describe('NormalizerService', () => {
  describe('calculateUnitPrice', () => {
    it('calculates price per 100ml correctly for ml', () => {
      const result = calculateUnitPrice(54, '500 ml');
      expect(result).toBe('₹10.80 / 100ml');
    });

    it('calculates price per 100ml correctly for Litres', () => {
      const result = calculateUnitPrice(135, '1 L');
      expect(result).toBe('₹13.50 / 100ml');
    });

    it('calculates price per 100g correctly for kg', () => {
      const result = calculateUnitPrice(28, '1 kg');
      expect(result).toBe('₹2.80 / 100g');
    });
  });

  describe('normalizePlatformPrice with Passes', () => {
    it('applies Blinkit Pass free delivery on orders >= 99', () => {
      const normalized = normalizePlatformPrice(
        {
          platformId: 'blinkit',
          productName: 'Aashirvaad Atta 5kg',
          mrp: 275,
          price: 245,
          available: true,
          etaMinutes: 10,
          unit: '5 kg',
        },
        ['blinkit_pass']
      );

      expect(normalized.deliveryFee).toBe(0);
      expect(normalized.trueTotal).toBe(245 + normalized.platformFee + normalized.handlingFee);
    });

    it('applies Zepto Super free delivery and zero handling fee on orders >= 99', () => {
      const normalized = normalizePlatformPrice(
        {
          platformId: 'zepto',
          productName: 'Fortune Oil 1L',
          mrp: 150,
          price: 135,
          available: true,
          etaMinutes: 9,
          unit: '1 L',
        },
        ['zepto_super']
      );

      expect(normalized.deliveryFee).toBe(0);
      expect(normalized.handlingFee).toBe(0);
      expect(normalized.trueTotal).toBe(135 + normalized.platformFee);
    });
  });
});
