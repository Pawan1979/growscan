import { db } from './firebase.service';
import { PlatformPrice } from '../types';

export class CatalogService {
  /**
   * Log a user search for analytics
   */
  static async logSearch(query: string, pincode: string, uid?: string) {
    if (!db) return; // Fail silently if no Firebase credentials

    try {
      await db.collection('search_history').add({
        query: query.toLowerCase(),
        pincode,
        uid: uid || 'anonymous',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to log search history:', error);
    }
  }

  /**
   * Save fetched prices to the permanent catalog
   */
  static async savePriceResults(query: string, pincode: string, results: PlatformPrice[]) {
    if (!db) return;

    try {
      const batch = db.batch();
      const collection = db.collection('price_catalog');
      const timestamp = new Date().toISOString();
      const dateKey = timestamp.split('T')[0]; // Store by day for easier aggregations

      results.forEach(result => {
        // Create a unique document ID to prevent identical duplicates on the same day
        // Format: query-platformId-pincode-date
        const docId = `${query.replace(/\s+/g, '-').toLowerCase()}-${result.platformId}-${pincode}-${dateKey}`;
        const docRef = collection.doc(docId);
        
        batch.set(docRef, {
          query: query.toLowerCase(),
          productName: result.productName,
          platformId: result.platformId,
          pincode,
          price: result.price,
          mrp: result.mrp,
          available: result.available,
          timestamp
        }, { merge: true }); // Update timestamp if we fetch again on the same day
      });

      await batch.commit();
    } catch (error) {
      console.error('Failed to save price catalog:', error);
    }
  }
}
