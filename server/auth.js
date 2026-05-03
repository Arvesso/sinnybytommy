import jwt from 'jsonwebtoken';
import db from './db.js';

const SECRET = process.env.JWT_SECRET || 'sinnybytommy-dev-secret-change-me';
const TOKEN_TTL = '30d';

export function signToken(user) {
  return jwt.sign({ id: user.id, phone: user.phone, is_admin: !!user.is_admin }, SECRET, { expiresIn: TOKEN_TTL });
}

export function authMiddleware(req, _res, next) {
  const token = req.cookies?.token || (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (token) {
    try {
      const payload = jwt.verify(token, SECRET);
      const user = db.prepare('SELECT id, phone, first_name, last_name, is_admin FROM users WHERE id = ?').get(payload.id);
      if (user) req.user = user;
    } catch (_e) { /* ignore */ }
  }
  next();
}

export function requireUser(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Требуется вход' });
  next();
}

export function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Требуется вход' });
  if (!req.user.is_admin) return res.status(403).json({ error: 'Доступ запрещён' });
  next();
}
