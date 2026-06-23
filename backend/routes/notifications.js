const express          = require('express');
const { getPool, sql } = require('../config/db');
const authMiddleware   = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// ── GET /api/notifications ────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('user_id', sql.Int, req.user.id)
      .query(`
        SELECT id, type, title, body, [to] AS [to], time_label AS timeLabel, is_read AS isRead
        FROM dbo.Notifications
        WHERE user_id = @user_id
        ORDER BY created_at DESC
      `);
    const notifications = result.recordset.map(n => ({ ...n, isRead: !!n.isRead }));
    res.json({ notifications });
  } catch (err) {
    console.error('[notifications/get]', err);
    res.status(500).json({ error: 'Failed to fetch notifications.' });
  }
});

// ── PATCH /api/notifications/:id/read ────────────────────────────────────────
router.patch('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();

    await pool.request()
      .input('id',      sql.NVarChar, id)
      .input('user_id', sql.Int, req.user.id)
      .query('UPDATE dbo.Notifications SET is_read = 1 WHERE id = @id AND user_id = @user_id');

    res.json({ ok: true });
  } catch (err) {
    console.error('[notifications/read]', err);
    res.status(500).json({ error: 'Failed to mark as read.' });
  }
});

// ── PATCH /api/notifications/read-all ────────────────────────────────────────
router.patch('/read-all', async (req, res) => {
  try {
    const pool = await getPool();
    await pool.request()
      .input('user_id', sql.Int, req.user.id)
      .query('UPDATE dbo.Notifications SET is_read = 1 WHERE user_id = @user_id');
    res.json({ ok: true });
  } catch (err) {
    console.error('[notifications/read-all]', err);
    res.status(500).json({ error: 'Failed to mark all as read.' });
  }
});

// ── DELETE /api/notifications ─────────────────────────────────────────────────
router.delete('/', async (req, res) => {
  try {
    const pool = await getPool();
    await pool.request()
      .input('user_id', sql.Int, req.user.id)
      .query('DELETE FROM dbo.Notifications WHERE user_id = @user_id');
    res.json({ ok: true });
  } catch (err) {
    console.error('[notifications/clear]', err);
    res.status(500).json({ error: 'Failed to clear notifications.' });
  }
});

module.exports = router;
