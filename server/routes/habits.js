const express = require('express');
const router = express.Router();
const { 
  getHabits, 
  createHabit, 
  getHabitDetails, 
  updateHabit, 
  deleteHabit, 
  updateHabitProgress,
  getHabitStatistics
} = require('../controllers/habitController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', getHabits);
router.post('/', createHabit);
router.get('/statistics', getHabitStatistics);
router.get('/:id', getHabitDetails);
router.put('/:id', updateHabit);
router.delete('/:id', deleteHabit);
router.post('/:id/progress', updateHabitProgress);

module.exports = router;