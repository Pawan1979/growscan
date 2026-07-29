import { AlertService } from '../services/alert.service';

describe('AlertService', () => {
  it('creates and lists price drop alerts', async () => {
    const newAlert = await AlertService.createAlert({
      productName: 'Test Coffee 100g',
      targetPrice: 150,
      currentCheapestPrice: 165,
      platformName: 'Zepto',
      pincode: '400001',
    });

    expect(newAlert.id).toContain('alert-');
    expect(newAlert.targetPrice).toBe(150);

    const alerts = await AlertService.getAlerts();
    expect(alerts.some((a: any) => a.id === newAlert.id)).toBe(true);

    const deleted = await AlertService.deleteAlert(newAlert.id);
    expect(deleted).toBe(true);
  });
});
