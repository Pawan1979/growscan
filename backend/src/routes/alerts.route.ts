import { Router, Request, Response } from 'express';
import { AlertService } from '../services/alert.service';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const alerts = await AlertService.getAlerts();
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  const { productName, targetPrice, currentCheapestPrice, platformName, pincode } = req.body;
  if (!productName || !targetPrice) {
    return res.status(400).json({ error: 'productName and targetPrice are required' });
  }

  try {
    const alert = await AlertService.createAlert({
      productName,
      targetPrice: Number(targetPrice),
      currentCheapestPrice: Number(currentCheapestPrice || targetPrice + 5),
      platformName: platformName || 'Blinkit',
      pincode: pincode || '400001',
    });

    res.status(201).json(alert);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create alert' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const success = await AlertService.deleteAlert(id);
    if (success) {
      res.json({ message: 'Alert deleted successfully' });
    } else {
      res.status(404).json({ error: 'Alert not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete alert' });
  }
});

export default router;
