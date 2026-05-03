import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

import './db.js';
import { seed } from './seed.js';
import { authMiddleware } from './auth.js';
import authRouter from './routes/auth.js';
import catalogRouter from './routes/catalog.js';
import ordersRouter from './routes/orders.js';
import adminRouter from './routes/admin.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
seed();

const app = express();
app.use(express.json({ limit: '4mb' }));
app.use(cookieParser());
app.use(authMiddleware);

app.use('/uploads', express.static(path.join(__dirname, '..', 'data', 'uploads')));

app.use('/api/auth', authRouter);
app.use('/api', catalogRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/admin', adminRouter);

// Serve built client in production
const distDir = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`✓ TommySinny server on http://localhost:${port}`);
});
