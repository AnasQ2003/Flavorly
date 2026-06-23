const express          = require('express');
const { getPool, sql } = require('../config/db');
const authMiddleware   = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// ── GET /api/shopping ─────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('user_id', sql.Int, req.user.id)
      .query(`
        SELECT id, name, qty, price, aisle, done, note
        FROM dbo.ShoppingList
        WHERE user_id = @user_id
        ORDER BY aisle, created_at
      `);
    // Map done (bit) → boolean
    const items = result.recordset.map(r => ({ ...r, done: !!r.done }));
    res.json({ items });
  } catch (err) {
    console.error('[shopping/get]', err);
    res.status(500).json({ error: 'Failed to fetch shopping list.' });
  }
});

// ── PATCH /api/shopping/:id/toggle ───────────────────────────────────────────
router.patch('/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();

    const check = await pool.request()
      .input('id',      sql.NVarChar, id)
      .input('user_id', sql.Int, req.user.id)
      .query('SELECT done FROM dbo.ShoppingList WHERE id = @id AND user_id = @user_id');
    if (!check.recordset.length) return res.status(404).json({ error: 'Item not found.' });

    const newDone = check.recordset[0].done ? 0 : 1;

    await pool.request()
      .input('id',   sql.NVarChar, id)
      .input('done', sql.Bit, newDone)
      .query('UPDATE dbo.ShoppingList SET done = @done WHERE id = @id');

    res.json({ ok: true, id, done: !!newDone });
  } catch (err) {
    console.error('[shopping/toggle]', err);
    res.status(500).json({ error: 'Failed to toggle item.' });
  }
});

// ── POST /api/shopping ────────────────────────────────────────────────────────
// Body: { name, qty, price, aisle, note }
router.post('/', async (req, res) => {
  try {
    const { name, qty, price, aisle, note } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'Item name is required.' });
    if (!aisle)        return res.status(400).json({ error: 'Aisle is required.' });

    const id   = `s${Date.now()}`;
    const pool = await getPool();

    await pool.request()
      .input('id',      sql.NVarChar,      id)
      .input('user_id', sql.Int,           req.user.id)
      .input('name',    sql.NVarChar,      name.trim())
      .input('qty',     sql.NVarChar,      qty || '1')
      .input('price',   sql.Decimal(18,2), Number(price) || 0)
      .input('aisle',   sql.NVarChar,      aisle)
      .input('note',    sql.NVarChar,      note || null)
      .query(`
        INSERT INTO dbo.ShoppingList (id, user_id, name, qty, price, aisle, note)
        VALUES (@id, @user_id, @name, @qty, @price, @aisle, @note)
      `);

    res.status(201).json({ ok: true, item: { id, name, qty, price: Number(price) || 0, aisle, done: false, note: note || null } });
  } catch (err) {
    console.error('[shopping/add]', err);
    res.status(500).json({ error: 'Failed to add item.' });
  }
});

// ── DELETE /api/shopping/:id ──────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();

    await pool.request()
      .input('id',      sql.NVarChar, id)
      .input('user_id', sql.Int, req.user.id)
      .query('DELETE FROM dbo.ShoppingList WHERE id = @id AND user_id = @user_id');

    res.json({ ok: true });
  } catch (err) {
    console.error('[shopping/delete]', err);
    res.status(500).json({ error: 'Failed to delete item.' });
  }
});

module.exports = router;
