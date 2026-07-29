import { PriceAlert } from '../types/index';
import { db } from './firebase.service';

const alertsStore: PriceAlert[] = [
  {
    id: 'alert-1',
    productName: 'Fortune Sunlite Refined Sunflower Oil 1L',
    targetPrice: 125,
    currentCheapestPrice: 133,
    platformName: 'BigBasket',
    pincode: '400001',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'alert-2',
    productName: 'Aashirvaad Whole Wheat Atta 5kg',
    targetPrice: 230,
    currentCheapestPrice: 241,
    platformName: 'Zepto',
    pincode: '400001',
    active: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export class AlertService {
  static async getAlerts(): Promise<PriceAlert[]> {
    if (db) {
      try {
        const snapshot = await db.collection('alerts').orderBy('createdAt', 'desc').get();
        return snapshot.docs.map((doc: any) => doc.data() as PriceAlert);
      } catch (error) {
        console.error('Error getting alerts from Firestore', error);
      }
    }
    return alertsStore;
  }

  static async createAlert(data: {
    productName: string;
    targetPrice: number;
    currentCheapestPrice: number;
    platformName: string;
    pincode: string;
  }): Promise<PriceAlert> {
    const newAlert: PriceAlert = {
      id: `alert-${Date.now()}`,
      productName: data.productName,
      targetPrice: data.targetPrice,
      currentCheapestPrice: data.currentCheapestPrice,
      platformName: data.platformName,
      pincode: data.pincode,
      active: true,
      createdAt: new Date().toISOString(),
    };

    if (db) {
      try {
        await db.collection('alerts').doc(newAlert.id).set(newAlert);
        return newAlert;
      } catch (error) {
         console.error('Error saving alert to Firestore', error);
      }
    }
    
    alertsStore.unshift(newAlert);
    return newAlert;
  }

  static async deleteAlert(id: string): Promise<boolean> {
    if (db) {
       try {
         await db.collection('alerts').doc(id).delete();
         return true;
       } catch (error) {
         console.error('Error deleting alert from Firestore', error);
         return false;
       }
    }

    const index = alertsStore.findIndex((a) => a.id === id);
    if (index !== -1) {
      alertsStore.splice(index, 1);
      return true;
    }
    return false;
  }
}
