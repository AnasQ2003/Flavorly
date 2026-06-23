const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const { getPool, sql } = require('../config/db');
const authMiddleware   = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRES = '7d';

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

// ── POST /api/auth/register ──────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim())           return res.status(400).json({ error: 'Name is required.' });
    if (!email?.includes('@'))   return res.status(400).json({ error: 'Valid email is required.' });
    if ((password?.length ?? 0) < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });

    const pool = await getPool();

    // Check duplicate
    const exists = await pool.request()
      .input('email', sql.NVarChar, email.trim().toLowerCase())
      .query('SELECT id FROM dbo.Users WHERE email = @email');
    if (exists.recordset.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const hash    = await bcrypt.hash(password, 10);
    const handle  = email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '');
    const initials = name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

    const result = await pool.request()
      .input('name',     sql.NVarChar, name.trim())
      .input('handle',   sql.NVarChar, handle)
      .input('email',    sql.NVarChar, email.trim().toLowerCase())
      .input('hash',     sql.NVarChar, hash)
      .input('initials', sql.NVarChar, initials)
      .query(`
        INSERT INTO dbo.Users (name, handle, email, password_hash, avatar)
        OUTPUT INSERTED.id, INSERTED.name, INSERTED.email, INSERTED.handle, INSERTED.avatar, INSERTED.bio, INSERTED.location, INSERTED.premium
        VALUES (@name, @handle, @email, @hash, @initials)
      `);

    const user  = result.recordset[0];
    const token = signToken(user);
    res.status(201).json({ token, user });
  } catch (err) {
    console.error('[auth/register]', err);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// ── POST /api/auth/login ─────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });

    const pool = await getPool();
    const result = await pool.request()
      .input('email', sql.NVarChar, email.trim().toLowerCase())
      .query('SELECT id, name, email, handle, avatar, bio, location, premium, password_hash FROM dbo.Users WHERE email = @email');

    const user = result.recordset[0];
    if (!user) return res.status(401).json({ error: 'Invalid email or password.' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid)  return res.status(401).json({ error: 'Invalid email or password.' });

    const { password_hash, ...safeUser } = user;
    const token = signToken(safeUser);
    res.json({ token, user: safeUser });
  } catch (err) {
    console.error('[auth/login]', err);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// ── GET /api/auth/me ─────────────────────────────────────────────────────────
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, req.user.id)
      .query('SELECT id, name, email, handle, avatar, bio, location, premium FROM dbo.Users WHERE id = @id');

    const user = result.recordset[0];
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ user });
  } catch (err) {
    console.error('[auth/me]', err);
    res.status(500).json({ error: 'Failed to fetch user.' });
  }
});

module.exports = router;
