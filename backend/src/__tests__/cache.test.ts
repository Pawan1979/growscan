import { CacheService } from '../services/cache.service';

describe('CacheService', () => {
  it('stores and retrieves cached items', async () => {
    await CacheService.set('test_key', { price: 100 }, 3600);
    const value = await CacheService.get<{ price: number }>('test_key');
    expect(value).toEqual({ price: 100 });
  });

  it('deletes cached items', async () => {
    await CacheService.set('key_to_delete', { data: 'test' }, 3600);
    await CacheService.del('key_to_delete');
    const value = await CacheService.get('key_to_delete');
    expect(value).toBeNull();
  });

  it('expires cached items after TTL', async () => {
    await CacheService.set('expired_key', { data: 'test' }, -1); // Expired 1 second ago
    const value = await CacheService.get('expired_key');
    expect(value).toBeNull();
  });
});
