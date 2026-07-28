import { Router, Request, Response } from 'express';
import { PriceService } from '../services/price.service';

const router = Router();

router.get('/:barcode', async (req: Request, res: Response) => {
  try {
    const { barcode } = req.params;
    const pincode = (req.query.pin as string) || '400001';

    const product = await PriceService.getProductByBarcode(barcode, pincode);
    res.json(product);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to lookup barcode', details: err.message });
  }
});

export default router;
