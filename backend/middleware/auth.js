const jwt = require('jsonwebtoken');

/**
 * Middleware: verify Bearer JWT, attach req.user = { id, email }
 */
module.exports = function authMiddleware(req, res, next) {
  const header = req.headers['authorization'] || '';
  if (!header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    req.user = { id: payload.id, email: payload.email };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token expired or invalid' });
  }
};
