import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PassSelector } from '../components/PassSelector';

describe('PassSelector Component', () => {
  it('renders all subscription passes (Swiggy One, Zepto Super, Blinkit Pass, BB Star)', () => {
    render(<PassSelector activePasses={['swiggy_one']} onTogglePass={vi.fn()} />);

    expect(screen.getByText('Swiggy One')).toBeDefined();
    expect(screen.getByText('Zepto Super')).toBeDefined();
    expect(screen.getByText('Blinkit Pass')).toBeDefined();
    expect(screen.getByText('BB Star')).toBeDefined();
  });

  it('triggers onTogglePass callback when clicked', () => {
    const onToggleMock = vi.fn();
    render(<PassSelector activePasses={[]} onTogglePass={onToggleMock} />);

    const zeptoBtn = screen.getByText('Zepto Super');
    fireEvent.click(zeptoBtn);

    expect(onToggleMock).toHaveBeenCalledWith('zepto_super');
  });
});
