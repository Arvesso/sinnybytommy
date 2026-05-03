import { Router } from 'express';
import db from '../db.js';
import { requireUser } from '../auth.js';

const router = Router();

// Create order from cart payload
router.post('/', requireUser, (req, res) => {
  const { items, first_name, last_name, phone, address, payment_method } = req.body;
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'Корзина пуста' });
  if (!first_name || !last_name || !phone || !address) return res.status(400).json({ error: 'Заполните данные доставки' });

  // Recalculate from DB to prevent tampering
  let total = 0;
  const resolved = [];
  for (const it of items) {
    const p = db.prepare('SELECT * FROM products WHERE id = ?').get(it.product_id);
    if (!p) return res.status(400).json({ error: 'Товар недоступен' });
    const qty = Math.max(1, Math.min(99, Number(it.qty) || 1));
    total += p.price * qty;
    resolved.push({ ...p, size: it.size || 'one size', qty });
  }

  const tx = db.transaction(() => {
    const r = db.prepare(`
      INSERT INTO orders (user_id, first_name, last_name, phone, address, total, payment_method)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(req.user.id, first_name, last_name, phone, address, total, payment_method || 'card');
    const oid = r.lastInsertRowid;
    const ins = db.prepare(`
      INSERT INTO order_items (order_id, product_id, name, variant, image, size, price, qty)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const it of resolved) {
      ins.run(oid, it.id, it.name, it.variant, it.image, it.size, it.price, it.qty);
    }
    return oid;
  });

  const orderId = tx();
  res.json({ id: orderId, total });
});

router.get('/', requireUser, (req, res) => {
  const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
  for (const o of orders) {
    o.items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(o.id);
  }
  res.json(orders);
});

router.get('/:id', requireUser, (req, res) => {
  const o = db.prepare('SELECT * FROM orders WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!o) return res.status(404).json({ error: 'Заказ не найден' });
  o.items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(o.id);
  res.json(o);
});

export default router;
