import { resolveLocation } from '../services/location.service';

describe('LocationService', () => {
  it('resolves valid pincodes (Mumbai, Delhi, Bengaluru)', () => {
    const mumbai = resolveLocation('400001');
    expect(mumbai.city).toBe('Mumbai');
    expect(mumbai.state).toBe('Maharashtra');

    const delhi = resolveLocation('110001');
    expect(delhi.city).toContain('Delhi');
    expect(delhi.state).toBe('Delhi');

    const blr = resolveLocation('560102');
    expect(blr.city).toContain('Bengaluru');
    expect(blr.state).toBe('Karnataka');
  });

  it('provides safe fallback for unknown pincodes', () => {
    const unknown = resolveLocation('999999');
    expect(unknown.pincode).toBe('999999');
    expect(unknown.city).toBe('Mumbai');
    expect(unknown.state).toBe('Maharashtra');
  });
});
