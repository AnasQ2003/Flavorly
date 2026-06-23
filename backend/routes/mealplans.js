const express          = require('express');
const { getPool, sql } = require('../config/db');
const authMiddleware   = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// ── GET /api/mealplans?dateOffset=2 ──────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const dateOffset = req.query.dateOffset != null ? parseInt(req.query.dateOffset) : null;
    const pool = await getPool();

    const req2 = pool.request().input('user_id', sql.Int, req.user.id);
    let query = `
      SELECT id, date_offset AS dateOffset, slot, recipe_id AS recipeId,
             servings, calories, title, chef, image, time
      FROM dbo.MealPlans
      WHERE user_id = @user_id
    `;
    if (dateOffset != null) {
      req2.input('dateOffset', sql.Int, dateOffset);
      query += ' AND date_offset = @dateOffset';
    }
    query += ' ORDER BY date_offset, slot';

    const result = await req2.query(query);
    res.json({ mealplans: result.recordset });
  } catch (err) {
    console.error('[mealplans/get]', err);
    res.status(500).json({ error: 'Failed to fetch meal plans.' });
  }
});

// ── PUT /api/mealplans/:id ────────────────────────────────────────────────────
// Body: { recipeId, servings, calories, title, chef, image, time }
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { recipeId, servings, calories, title, chef, image, time } = req.body;
    const pool = await getPool();

    // Verify ownership
    const check = await pool.request()
      .input('id',      sql.NVarChar, id)
      .input('user_id', sql.Int, req.user.id)
      .query('SELECT id FROM dbo.MealPlans WHERE id = @id AND user_id = @user_id');
    if (!check.recordset.length) return res.status(404).json({ error: 'Meal plan entry not found.' });

    await pool.request()
      .input('id',       sql.NVarChar, id)
      .input('recipeId', sql.NVarChar, recipeId || null)
      .input('servings', sql.Int,      servings != null ? servings : null)
      .input('calories', sql.Int,      calories != null ? calories : null)
      .input('title',    sql.NVarChar, title || null)
      .input('chef',     sql.NVarChar, chef || null)
      .input('image',    sql.NVarChar, image || null)
      .input('time',     sql.NVarChar, time || null)
      .query(`
        UPDATE dbo.MealPlans SET
          recipe_id = COALESCE(@recipeId, recipe_id),
          servings  = COALESCE(@servings, servings),
          calories  = COALESCE(@calories, calories),
          title     = @title,
          chef      = @chef,
          image     = @image,
          time      = @time
        WHERE id = @id
      `);

    const updated = await pool.request()
      .input('id', sql.NVarChar, id)
      .query(`
        SELECT id, date_offset AS dateOffset, slot, recipe_id AS recipeId,
               servings, calories, title, chef, image, time
        FROM dbo.MealPlans WHERE id = @id
      `);

    res.json({ mealplan: updated.recordset[0] });
  } catch (err) {
    console.error('[mealplans/update]', err);
    res.status(500).json({ error: 'Failed to update meal plan.' });
  }
});

module.exports = router;
