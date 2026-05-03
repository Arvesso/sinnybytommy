import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import db from '../db.js';
import { requireAdmin } from '../auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '..', '..', 'data', 'uploads');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().replace(/[^a-z0-9.]/g, '') || '.bin';
    const safe = Date.now() + '-' + Math.random().toString(36).slice(2, 8) + ext;
    cb(null, safe);
  }
});
const upload = multer({ storage, limits: { fileSize: 8 * 1024 * 1024 } });

const router = Router();
router.use(requireAdmin);

// Stats
router.get('/stats', (_req, res) => {
  const ordersCount = db.prepare('SELECT COUNT(*) c FROM orders').get().c;
  const usersCount = db.prepare('SELECT COUNT(*) c FROM users').get().c;
  const productsCount = db.prepare('SELECT COUNT(*) c FROM products').get().c;
  const totalRevenue = db.prepare("SELECT COALESCE(SUM(total),0) s FROM orders WHERE status != 'cancelled'").get().s;
  const newOrders = db.prepare("SELECT COUNT(*) c FROM orders WHERE status = 'new'").get().c;
  const last = db.prepare(`
    SELECT o.id, o.total, o.status, o.first_name, o.last_name, o.created_at
    FROM orders o ORDER BY o.created_at DESC LIMIT 8
  `).all();
  const byCategory = db.prepare(`
    SELECT c.name, COUNT(p.id) AS c FROM categories c
    LEFT JOIN products p ON p.category_id = c.id GROUP BY c.id ORDER BY c.position
  `).all();
  res.json({ ordersCount, usersCount, productsCount, totalRevenue, newOrders, last, byCategory });
});

// Upload
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Файл не получен' });
  res.json({ url: '/uploads/' + req.file.filename });
});

// Categories CRUD
router.get('/categories', (_req, res) => {
  res.json(db.prepare('SELECT * FROM categories ORDER BY position').all());
});
router.post('/categories', (req, res) => {
  const { slug, name, position } = req.body;
  if (!slug || !name) return res.status(400).json({ error: 'slug и name обязательны' });
  try {
    const r = db.prepare('INSERT INTO categories (slug, name, position) VALUES (?, ?, ?)').run(slug, name, position || 0);
    res.json(db.prepare('SELECT * FROM categories WHERE id = ?').get(r.lastInsertRowid));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});
router.put('/categories/:id', (req, res) => {
  const { slug, name, position } = req.body;
  db.prepare('UPDATE categories SET slug = ?, name = ?, position = ? WHERE id = ?')
    .run(slug, name, position || 0, req.params.id);
  res.json(db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id));
});
router.delete('/categories/:id', (req, res) => {
  db.prepare('DELETE FROM categories WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// Products CRUD
router.get('/products', (_req, res) => {
  res.json(db.prepare(`
    SELECT p.*, c.name AS category_name FROM products p
    LEFT JOIN categories c ON c.id = p.category_id ORDER BY p.created_at DESC
  `).all());
});
router.post('/products', (req, res) => {
  const { category_id, name, variant, price, image, sizes, description, is_popular, in_stock } = req.body;
  if (!name || price == null) return res.status(400).json({ error: 'name и price обязательны' });
  const r = db.prepare(`
    INSERT INTO products (category_id, name, variant, price, image, sizes, description, is_popular, in_stock)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(category_id || null, name, variant || '', price, image || '', sizes || 'S,M,L,XL', description || '', is_popular ? 1 : 0, in_stock ? 1 : 0);
  res.json(db.prepare('SELECT * FROM products WHERE id = ?').get(r.lastInsertRowid));
});
router.put('/products/:id', (req, res) => {
  const { category_id, name, variant, price, image, sizes, description, is_popular, in_stock } = req.body;
  db.prepare(`
    UPDATE products SET category_id=?, name=?, variant=?, price=?, image=?, sizes=?, description=?, is_popular=?, in_stock=?
    WHERE id = ?
  `).run(category_id || null, name, variant || '', price, image || '', sizes || 'S,M,L,XL', description || '', is_popular ? 1 : 0, in_stock ? 1 : 0, req.params.id);
  res.json(db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id));
});
router.delete('/products/:id', (req, res) => {
  db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// Orders
router.get('/orders', (_req, res) => {
  const list = db.prepare(`
    SELECT o.*, u.phone AS user_phone FROM orders o
    LEFT JOIN users u ON u.id = o.user_id
    ORDER BY o.created_at DESC
  `).all();
  for (const o of list) o.items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(o.id);
  res.json(list);
});
router.put('/orders/:id', (req, res) => {
  const { status } = req.body;
  if (!['new', 'paid', 'shipped', 'delivered', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Некорректный статус' });
  }
  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ ok: true });
});

// Hero / lookbook / celebrities
const simpleCrud = (table) => {
  const r = Router();
  r.get('/', (_req, res) => res.json(db.prepare(`SELECT * FROM ${table} ORDER BY position`).all()));
  r.post('/', (req, res) => {
    const cols = Object.keys(req.body);
    const vals = cols.map(c => req.body[c]);
    const placeholders = cols.map(() => '?').join(',');
    const ins = db.prepare(`INSERT INTO ${table} (${cols.join(',')}) VALUES (${placeholders})`).run(...vals);
    res.json(db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(ins.lastInsertRowid));
  });
  r.put('/:id', (req, res) => {
    const cols = Object.keys(req.body);
    const set = cols.map(c => `${c} = ?`).join(',');
    db.prepare(`UPDATE ${table} SET ${set} WHERE id = ?`).run(...cols.map(c => req.body[c]), req.params.id);
    res.json(db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(req.params.id));
  });
  r.delete('/:id', (req, res) => { db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(req.params.id); res.json({ ok: true }); });
  return r;
};

router.use('/slides', simpleCrud('hero_slides'));
router.use('/lookbook', simpleCrud('lookbook'));
router.use('/celebrities', simpleCrud('celebrities'));

// Site settings (key-value)
router.get('/settings', (_req, res) => {
  const rows = db.prepare('SELECT key, value FROM site_settings').all();
  res.json(Object.fromEntries(rows.map(r => [r.key, r.value])));
});
router.put('/settings', (req, res) => {
  const upsert = db.prepare(`
    INSERT INTO site_settings (key, value) VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `);
  const tx = db.transaction((entries) => {
    for (const [k, v] of entries) upsert.run(k, v == null ? '' : String(v));
  });
  tx(Object.entries(req.body || {}));
  res.json({ ok: true });
});

// Users
router.get('/users', (_req, res) => {
  res.json(db.prepare('SELECT id, phone, first_name, last_name, is_admin, newsletter, created_at FROM users ORDER BY created_at DESC').all());
});
router.put('/users/:id', (req, res) => {
  const { is_admin } = req.body;
  db.prepare('UPDATE users SET is_admin = ? WHERE id = ?').run(is_admin ? 1 : 0, req.params.id);
  res.json({ ok: true });
});

export default router;
