import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import rateLimit from 'express-rate-limit';

import compareRouter from './routes/compare.route';
import cartRouter from './routes/cart.route';
import barcodeRouter from './routes/barcode.route';
import productsRouter from './routes/products.route';
import alertsRouter from './routes/alerts.route';
import { PreloadService } from './services/preload.service';
import './services/firebase.service'; // Initialize Firebase Admin

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests, please try again later.' },
});

app.use('/api', limiter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'GrocScan Backend API', timestamp: new Date().toISOString() });
});

app.use('/api/compare', compareRouter);
app.use('/api/cart', cartRouter);
app.use('/api/barcode', barcodeRouter);
app.use('/api/products', productsRouter);
app.use('/api/alerts', alertsRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 GrocScan Backend Server running on http://localhost:${PORT}`);
  // Asynchronously trigger catalog pre-loading
  PreloadService.preloadHighFrequencyData();
});
