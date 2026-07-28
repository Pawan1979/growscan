import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductCard } from '../components/ProductCard';
import { PlatformPrice } from '../types';

const mockPrice: PlatformPrice = {
  platformId: 'blinkit',
  platformName: 'Blinkit',
  color: '#f7c72c',
  productName: 'Amul Taaza Milk 500ml',
  mrp: 30,
  price: 27,
  discountPercent: 10,
  available: true,
  etaMinutes: 10,
  unit: '500 ml',
  unitPriceText: '₹5.40 / 100ml',
  platformFee: 5,
  deliveryFee: 15,
  handlingFee: 4,
  trueTotal: 51,
};

describe('ProductCard Component', () => {
  it('renders product name, price, and platform name', () => {
    render(
      <ProductCard
        item={mockPrice}
        isCheapest={true}
        isFastest={false}
        onAddToCart={vi.fn()}
        isInCart={false}
      />
    );

    expect(screen.getByText('Amul Taaza Milk 500ml')).toBeDefined();
    expect(screen.getByText('Blinkit')).toBeDefined();
    expect(screen.getByText('₹27')).toBeDefined();
    expect(screen.getByText('Cheapest')).toBeDefined();
  });
});
