import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FeeBreakdownModal } from '../components/FeeBreakdownModal';
import { PlatformPrice } from '../types';

const mockItem: PlatformPrice = {
  platformId: 'zepto',
  platformName: 'Zepto',
  color: '#8224e3',
  productName: 'Tata Salt Vacuum Iodised Salt 1kg',
  mrp: 30,
  price: 28,
  discountPercent: 6,
  available: true,
  etaMinutes: 9,
  unit: '1 kg',
  unitPriceText: '₹2.80 / 100g',
  platformFee: 4,
  deliveryFee: 15,
  handlingFee: 5,
  trueTotal: 52,
};

describe('FeeBreakdownModal Component', () => {
  it('renders fee line items and true final price calculation', () => {
    render(<FeeBreakdownModal item={mockItem} onClose={vi.fn()} />);

    expect(screen.getByText('Zepto Cost Breakdown')).toBeDefined();
    expect(screen.getByText('Sticker Price')).toBeDefined();
    expect(screen.getByText('₹28')).toBeDefined();
    expect(screen.getByText('+ ₹4')).toBeDefined(); // Platform fee
    expect(screen.getByText('+ ₹15')).toBeDefined(); // Delivery fee
    expect(screen.getByText('+ ₹5')).toBeDefined(); // Handling fee
    expect(screen.getByText('₹52')).toBeDefined(); // True final total
  });
});
