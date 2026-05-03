import { Router } from 'express';
import db from '../db.js';
import { signToken, requireUser } from '../auth.js';

const router = Router();

const normalizePhone = (raw) => {
  const digits = String(raw || '').replace(/\D/g, '');
  if (!digits) return '';
  let n = digits;
  if (n.length === 11 && n.startsWith('8')) n = '7' + n.slice(1);
  if (n.length === 10) n = '7' + n;
  return '+' + n;
};

router.post('/start', (req, res) => {
  const phone = normalizePhone(req.body.phone);
  if (!phone || phone.length < 10) return res.status(400).json({ error: 'Некорректный номер телефона' });

  let user = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone);
  let isNew = false;
  if (!user) {
    const r = db.prepare('INSERT INTO users (phone) VALUES (?)').run(phone);
    user = db.prepare('SELECT * FROM users WHERE id = ?').get(r.lastInsertRowid);
    isNew = true;
  }

  const needsProfile = !user.first_name || !user.last_name;
  const token = signToken(user);
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax', maxAge: 30 * 24 * 3600 * 1000 });
  res.json({ user: publicUser(user), isNew, needsProfile });
});

router.post('/complete', requireUser, (req, res) => {
  const { first_name, last_name, newsletter } = req.body;
  if (!first_name?.trim() || !last_name?.trim()) {
    return res.status(400).json({ error: 'Заполните имя и фамилию' });
  }
  db.prepare('UPDATE users SET first_name = ?, last_name = ?, newsletter = ? WHERE id = ?')
    .run(first_name.trim(), last_name.trim(), newsletter ? 1 : 0, req.user.id);
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  res.json({ user: publicUser(user) });
});

router.get('/me', (req, res) => {
  res.json({ user: req.user ? publicUser(req.user) : null });
});

router.post('/logout', (_req, res) => {
  res.clearCookie('token');
  res.json({ ok: true });
});

function publicUser(u) {
  return { id: u.id, phone: u.phone, first_name: u.first_name, last_name: u.last_name, is_admin: !!u.is_admin };
}

export default router;
