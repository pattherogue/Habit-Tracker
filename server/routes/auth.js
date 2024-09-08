const express = require('express');
const router = express.Router();
const { register, login, getUserData } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/user', authenticateToken, getUserData);

module.exports = router;