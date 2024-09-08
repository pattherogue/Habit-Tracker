const express = require('express');
const router = express.Router();
const { register, login, getUserData } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

router.post('/register', async (req, res, next) => {
  try {
    const result = await register(req, res);
    res.status(201).json(result);
  } catch (error) {
    console.error('Registration error:', error);
    next(error);
  }
});

router.post('/login', login);
router.get('/user', authenticateToken, getUserData);

module.exports = router;