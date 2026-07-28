import { Router, Request, Response } from 'express';
import { PriceService } from '../services/price.service';

const router = Router();

router.post('/compare', async (req: Request, res: Response) => {
  try {
    const { items, pincode } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart items array is required' });
    }

    const result = await PriceService.compareCart(items, pincode || '400001');
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to compare cart', details: err.message });
  }
});

export default router;
