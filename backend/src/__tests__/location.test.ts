import { resolveLocation } from '../services/location.service';

describe('LocationService', () => {
  it('resolves valid pincodes (Mumbai, Delhi, Bengaluru)', async () => {
    const mumbai = await resolveLocation('400001');
    expect(mumbai.city).toBe('Mumbai');
    expect(mumbai.state).toBe('Maharashtra');

    const delhi = await resolveLocation('110001');
    expect(delhi.city).toContain('Delhi');
    expect(delhi.state).toBe('Delhi');

    const blr = await resolveLocation('560102');
    expect(blr.city).toContain('Bengaluru');
    expect(blr.state).toBe('Karnataka');
  });

  it('provides safe fallback for unknown pincodes', async () => {
    const unknown = await resolveLocation('999999');
    expect(unknown.pincode).toBe('999999');
    expect(unknown.city).toBe('Unknown City');
    expect(unknown.state).toBe('India');
  });
});
