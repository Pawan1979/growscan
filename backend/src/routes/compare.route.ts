import { Router, Request, Response } from 'express';
import { PriceService } from '../services/price.service';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const query = (req.query.q as string) || 'Amul Milk';
    const pincode = (req.query.pin as string) || '400001';
    const rawPasses = req.query.passes as string;
    const userPasses = rawPasses ? rawPasses.split(',') : [];

    const result = await PriceService.comparePrices(query, pincode, userPasses);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to compare prices', details: err.message });
  }
});

export default router;
