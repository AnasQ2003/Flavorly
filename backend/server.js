require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Root & health check ──────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    app: 'Flavorly API',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      health:        '/api/health',
      auth:          '/api/auth',
      profile:       '/api/profile',
      recipes:       '/api/recipes',
      mealplans:     '/api/mealplans',
      shopping:      '/api/shopping',
      notifications: '/api/notifications',
    },
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Flavorly API', timestamp: new Date() });
});

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/profile',       require('./routes/profile'));
app.use('/api/recipes',       require('./routes/recipes'));
app.use('/api/mealplans',     require('./routes/mealplans'));
app.use('/api/shopping',      require('./routes/shopping'));
app.use('/api/notifications', require('./routes/notifications'));

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Global error handler ────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const server = app.listen(PORT, () => {
  console.log(`🟢 Flavorly API running on http://localhost:${PORT}`);
  console.log(`   Routes: auth | profile | recipes | mealplans | shopping | notifications`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Kill the other process first.`);
    process.exit(1);
  } else {
    throw err;
  }
});
