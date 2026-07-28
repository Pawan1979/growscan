import { Router, Request, Response } from 'express';
import { AlertService } from '../services/alert.service';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json(AlertService.getAlerts());
});

router.post('/', (req: Request, res: Response) => {
  const { productName, targetPrice, currentCheapestPrice, platformName, pincode } = req.body;
  if (!productName || !targetPrice) {
    return res.status(400).json({ error: 'productName and targetPrice are required' });
  }

  const alert = AlertService.createAlert({
    productName,
    targetPrice: Number(targetPrice),
    currentCheapestPrice: Number(currentCheapestPrice || targetPrice + 5),
    platformName: platformName || 'Blinkit',
    pincode: pincode || '400001',
  });

  res.status(201).json(alert);
});

router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const success = AlertService.deleteAlert(id);
  if (success) {
    res.json({ message: 'Alert deleted successfully' });
  } else {
    res.status(404).json({ error: 'Alert not found' });
  }
});

export default router;
