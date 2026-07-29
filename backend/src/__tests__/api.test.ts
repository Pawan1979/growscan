import request from 'supertest';
import express from 'express';

// Mock firebase-admin to prevent Jest ESM parsing errors on "jose" dependency
jest.mock('firebase-admin/auth', () => ({
  getAuth: jest.fn(() => ({
    verifyIdToken: jest.fn().mockResolvedValue({ uid: 'test-user-123' })
  }))
}));
import compareRouter from '../routes/compare.route';
import cartRouter from '../routes/cart.route';
import barcodeRouter from '../routes/barcode.route';
import productsRouter from '../routes/products.route';
import alertsRouter from '../routes/alerts.route';

const app = express();
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'GrocScan Backend API' });
});

app.use('/api/compare', compareRouter);
app.use('/api/cart', cartRouter);
app.use('/api/barcode', barcodeRouter);
app.use('/api/products', productsRouter);
app.use('/api/alerts', alertsRouter);

describe('Express API Endpoints', () => {
  it('GET /api/health returns 200 OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('GET /api/compare?q=Amul%20Milk returns price comparison', async () => {
    const res = await request(app).get('/api/compare?q=Amul%20Milk&pin=400001');
    expect(res.status).toBe(200);
    expect(res.body.query).toBe('Amul Milk');
    expect(res.body.results.length).toBeGreaterThan(0);
  });

  it('POST /api/cart/compare evaluates multi-item cart', async () => {
    const res = await request(app)
      .post('/api/cart/compare')
      .send({
        items: [{ name: 'Amul Milk', quantity: 2 }, { name: 'Tata Salt', quantity: 1 }],
        pincode: '400001',
      });

    expect(res.status).toBe(200);
    expect(res.body.totalItems).toBe(2);
    expect(res.body.singlePlatformTotals.length).toBeGreaterThan(0);
  });

  it('GET /api/barcode/:code returns product details', async () => {
    const res = await request(app).get('/api/barcode/8901262010054');
    expect(res.status).toBe(200);
    expect(res.body.barcode).toBe('8901262010054');
    expect(res.body.name).toBeDefined();
  });

  it('GET /api/products/suggestions returns autocomplete suggestions', async () => {
    const res = await request(app).get('/api/products/suggestions?q=Amul');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /api/products/history returns 30-day price trend', async () => {
    const res = await request(app).get('/api/products/history?q=Fortune%20Oil');
    expect(res.status).toBe(200);
    expect(res.body.dates.length).toBe(30);
    expect(res.body.series.length).toBe(5);
  });

  it('POST & GET & DELETE /api/alerts manages price drop alerts', async () => {
    const createRes = await request(app)
      .post('/api/alerts')
      .send({
        productName: 'Integration Test Coffee',
        targetPrice: 100,
        currentCheapestPrice: 120,
        platformName: 'Blinkit',
        pincode: '400001',
      });

    expect(createRes.status).toBe(201);
    const alertId = createRes.body.id;

    const listRes = await request(app).get('/api/alerts');
    expect(listRes.status).toBe(200);
    expect(listRes.body.some((a: any) => a.id === alertId)).toBe(true);

    const deleteRes = await request(app).delete(`/api/alerts/${alertId}`);
    expect(deleteRes.status).toBe(200);
  });
});
