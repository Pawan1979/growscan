import { Router, Request, Response } from 'express';

const router = Router();

const POPULAR_SUGGESTIONS = [
  'Amul Taaza Milk',
  'Tata Salt 1kg',
  'Fortune Sunflower Oil 1L',
  'Maggi 2-Minute Noodles 4 Pack',
  'Aashirvaad Atta 5kg',
  'Surf Excel Detergent Powder',
  'Coca-Cola 750ml',
  'Cadbury Dairy Milk Silk',
  'Mother Dairy Dahi 400g',
  'Amul Butter 500g',
  'Nescafé Classic Coffee 100g',
  'Lays Cream & Onion Chips'
];

router.get('/suggestions', (req: Request, res: Response) => {
  const query = ((req.query.q as string) || '').toLowerCase();
  if (!query) {
    return res.json(POPULAR_SUGGESTIONS.slice(0, 6));
  }
  const filtered = POPULAR_SUGGESTIONS.filter(s => s.toLowerCase().includes(query));
  res.json(filtered.length > 0 ? filtered : [query, `${query} Pack`, `${query} Family Size`]);
});

import { PriceService } from '../services/price.service';

router.get('/history', (req: Request, res: Response) => {
  const query = (req.query.q as string) || 'Amul Milk';
  const history = PriceService.getPriceHistory(query);
  res.json(history);
});

export default router;
