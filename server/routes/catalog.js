import { Router } from 'express';
import db from '../db.js';

const router = Router();

router.get('/categories', (_req, res) => {
  const cats = db.prepare(`
    SELECT c.*, (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id) AS count
    FROM categories c ORDER BY position, name
  `).all();
  res.json(cats);
});

router.get('/products', (req, res) => {
  const { category, popular, q, limit = 100 } = req.query;
  const where = [];
  const params = [];
  if (category) { where.push('c.slug = ?'); params.push(category); }
  if (popular) { where.push('p.is_popular = 1'); }
  if (q) { where.push('(p.name LIKE ? OR p.variant LIKE ?)'); params.push('%' + q + '%', '%' + q + '%'); }
  const sql = `
    SELECT p.*, c.slug AS category_slug, c.name AS category_name
    FROM products p LEFT JOIN categories c ON c.id = p.category_id
    ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    ORDER BY p.created_at DESC LIMIT ?
  `;
  params.push(Number(limit));
  res.json(db.prepare(sql).all(...params));
});

router.get('/products/:id', (req, res) => {
  const p = db.prepare(`
    SELECT p.*, c.slug AS category_slug, c.name AS category_name
    FROM products p LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.id = ?
  `).get(req.params.id);
  if (!p) return res.status(404).json({ error: 'Не найдено' });
  res.json(p);
});

router.get('/home', (_req, res) => {
  const slides = db.prepare('SELECT * FROM hero_slides ORDER BY position').all();
  const popular = db.prepare(`
    SELECT p.*, c.slug AS category_slug FROM products p LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.is_popular = 1 ORDER BY p.created_at DESC LIMIT 12
  `).all();
  const lookbook = db.prepare('SELECT * FROM lookbook ORDER BY position').all();
  const celebrities = db.prepare('SELECT * FROM celebrities ORDER BY position').all();
  const settings = db.prepare('SELECT key, value FROM site_settings').all();
  const settingsObj = Object.fromEntries(settings.map(s => [s.key, s.value]));
  const about = {
    mark_image: settingsObj.about_mark_image || '',
    side_image: settingsObj.about_side_image || ''
  };
  res.json({ slides, popular, lookbook, celebrities, about });
});

export default router;
