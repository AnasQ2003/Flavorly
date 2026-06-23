const express          = require('express');
const { getPool, sql } = require('../config/db');
const authMiddleware   = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// ── GET /api/recipes/favorites ────────────────────────────────────────────────
router.get('/favorites', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('user_id', sql.Int, req.user.id)
      .query(`
        SELECT recipe_id AS recipeId, created_at AS createdAt
        FROM dbo.Favorites
        WHERE user_id = @user_id
        ORDER BY created_at DESC
      `);
    res.json({ favorites: result.recordset.map(r => r.recipeId) });
  } catch (err) {
    console.error('[recipes/favorites]', err);
    res.status(500).json({ error: 'Failed to fetch favorites.' });
  }
});

// ── POST /api/recipes/favorites/:recipeId ─────────────────────────────────────
router.post('/favorites/:recipeId', async (req, res) => {
  try {
    const { recipeId } = req.params;
    const pool = await getPool();

    // Upsert: ignore if already exists
    await pool.request()
      .input('user_id',   sql.Int,      req.user.id)
      .input('recipe_id', sql.NVarChar,  recipeId)
      .query(`
        IF NOT EXISTS (
          SELECT 1 FROM dbo.Favorites WHERE user_id = @user_id AND recipe_id = @recipe_id
        )
        INSERT INTO dbo.Favorites (user_id, recipe_id) VALUES (@user_id, @recipe_id)
      `);

    res.json({ ok: true, recipeId });
  } catch (err) {
    console.error('[recipes/favorites/add]', err);
    res.status(500).json({ error: 'Failed to add to favorites.' });
  }
});

// ── DELETE /api/recipes/favorites/:recipeId ───────────────────────────────────
router.delete('/favorites/:recipeId', async (req, res) => {
  try {
    const { recipeId } = req.params;
    const pool = await getPool();

    await pool.request()
      .input('user_id',   sql.Int,      req.user.id)
      .input('recipe_id', sql.NVarChar,  recipeId)
      .query('DELETE FROM dbo.Favorites WHERE user_id = @user_id AND recipe_id = @recipe_id');

    res.json({ ok: true, recipeId });
  } catch (err) {
    console.error('[recipes/favorites/remove]', err);
    res.status(500).json({ error: 'Failed to remove from favorites.' });
  }
});

module.exports = router;
