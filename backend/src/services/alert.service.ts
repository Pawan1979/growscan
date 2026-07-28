import { PriceAlert } from '../types/index';

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
  static getAlerts(): PriceAlert[] {
    return alertsStore;
  }

  static createAlert(data: {
    productName: string;
    targetPrice: number;
    currentCheapestPrice: number;
    platformName: string;
    pincode: string;
  }): PriceAlert {
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
    alertsStore.unshift(newAlert);
    return newAlert;
  }

  static deleteAlert(id: string): boolean {
    const index = alertsStore.findIndex((a) => a.id === id);
    if (index !== -1) {
      alertsStore.splice(index, 1);
      return true;
    }
    return false;
  }
}
