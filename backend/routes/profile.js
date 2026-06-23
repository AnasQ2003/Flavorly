const express        = require('express');
const bcrypt         = require('bcryptjs');
const { getPool, sql } = require('../config/db');
const authMiddleware   = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// ── GET /api/profile ──────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, req.user.id)
      .query(`
        SELECT id, name, handle, email, avatar, bio, location, premium
        FROM dbo.Users WHERE id = @id
      `);
    const user = result.recordset[0];
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ profile: user });
  } catch (err) {
    console.error('[profile/get]', err);
    res.status(500).json({ error: 'Failed to fetch profile.' });
  }
});

// ── PUT /api/profile ──────────────────────────────────────────────────────────
// Body: { name?, handle?, bio?, location?, avatar? }
router.put('/', async (req, res) => {
  try {
    const { name, handle, bio, location, avatar } = req.body;
    const pool = await getPool();

    // Handle collision
    if (handle) {
      const clash = await pool.request()
        .input('handle', sql.NVarChar, handle.trim())
        .input('id',     sql.Int, req.user.id)
        .query('SELECT id FROM dbo.Users WHERE handle = @handle AND id != @id');
      if (clash.recordset.length > 0) {
        return res.status(409).json({ error: 'That handle is already taken.' });
      }
    }

    await pool.request()
      .input('id',       sql.Int, req.user.id)
      .input('name',     sql.NVarChar, name || null)
      .input('handle',   sql.NVarChar, handle || null)
      .input('bio',      sql.NVarChar, bio ?? null)
      .input('location', sql.NVarChar, location ?? null)
      .input('avatar',   sql.NVarChar, avatar || null)
      .query(`
        UPDATE dbo.Users SET
          name       = COALESCE(@name,     name),
          handle     = COALESCE(@handle,   handle),
          bio        = COALESCE(@bio,      bio),
          location   = COALESCE(@location, location),
          avatar     = COALESCE(@avatar,   avatar),
          updated_at = GETDATE()
        WHERE id = @id
      `);

    const updated = await pool.request()
      .input('id', sql.Int, req.user.id)
      .query('SELECT id, name, handle, email, avatar, bio, location, premium FROM dbo.Users WHERE id = @id');

    res.json({ profile: updated.recordset[0] });
  } catch (err) {
    console.error('[profile/update]', err);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// ── PUT /api/profile/password ─────────────────────────────────────────────────
router.put('/password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Both current and new password are required.' });
    if (newPassword.length < 6) return res.status(400).json({ error: 'New password must be at least 6 characters.' });

    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, req.user.id)
      .query('SELECT password_hash FROM dbo.Users WHERE id = @id');
    const user = result.recordset[0];

    const valid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Current password is incorrect.' });

    const newHash = await bcrypt.hash(newPassword, 10);
    await pool.request()
      .input('id',   sql.Int, req.user.id)
      .input('hash', sql.NVarChar, newHash)
      .query('UPDATE dbo.Users SET password_hash = @hash, updated_at = GETDATE() WHERE id = @id');

    res.json({ ok: true, message: 'Password updated successfully.' });
  } catch (err) {
    console.error('[profile/password]', err);
    res.status(500).json({ error: 'Failed to update password.' });
  }
});

module.exports = router;
