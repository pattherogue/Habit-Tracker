const db = require('../config/database');

exports.getHabits = async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM habits WHERE user_id = $1', [req.user.userId]);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

exports.createHabit = async (req, res, next) => {
  const { name, frequency, goal } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO habits (name, frequency, goal, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, frequency, goal || null, req.user.userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating habit:', error);
    next(error);
  }
};

exports.getHabitDetails = async (req, res, next) => {
  const habitId = req.params.id;
  try {
    const habitResult = await db.query('SELECT * FROM habits WHERE id = $1 AND user_id = $2', [habitId, req.user.userId]);
    if (habitResult.rows.length === 0) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    const habit = habitResult.rows[0];
    
    const progressResult = await db.query('SELECT * FROM habit_progress WHERE habit_id = $1 ORDER BY date DESC', [habitId]);
    habit.progress = progressResult.rows;

    const streakResult = await db.query(`
      WITH streaks AS (
        SELECT 
          date, 
          date - (ROW_NUMBER() OVER (ORDER BY date))::integer AS streak_group
        FROM habit_progress
        WHERE habit_id = $1 AND completed = true
      )
      SELECT 
        (MAX(date) - MIN(date) + 1) AS streak_length,
        MIN(date) AS streak_start,
        MAX(date) AS streak_end
      FROM streaks
      GROUP BY streak_group
      ORDER BY streak_length DESC
    `, [habitId]);

    habit.currentStreak = streakResult.rows[0]?.streak_length || 0;
    habit.longestStreak = Math.max(...streakResult.rows.map(r => r.streak_length), 0);

    res.json(habit);
  } catch (error) {
    next(error);
  }
};

exports.updateHabit = async (req, res, next) => {
  const habitId = req.params.id;
  const { name, frequency, goal } = req.body;
  try {
    const result = await db.query(
      'UPDATE habits SET name = $1, frequency = $2, goal = $3 WHERE id = $4 AND user_id = $5 RETURNING *',
      [name, frequency, goal, habitId, req.user.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

exports.deleteHabit = async (req, res, next) => {
  const habitId = req.params.id;
  try {
    await db.query('DELETE FROM habit_progress WHERE habit_id = $1', [habitId]);
    const result = await db.query('DELETE FROM habits WHERE id = $1 AND user_id = $2 RETURNING *', [habitId, req.user.userId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

exports.updateHabitProgress = async (req, res, next) => {
  const habitId = req.params.id;
  const { completed, date } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO habit_progress (habit_id, completed, date) VALUES ($1, $2, $3) RETURNING *',
      [habitId, completed, date || new Date()]
    );
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

exports.getHabitStatistics = async (req, res, next) => {
  try {
    const result = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN completed THEN 1 ELSE 0 END) as completed,
        DATE_TRUNC('day', CURRENT_DATE) as today,
        DATE_TRUNC('week', CURRENT_DATE) as week_start,
        DATE_TRUNC('month', CURRENT_DATE) as month_start
      FROM habit_progress
      WHERE habit_id IN (SELECT id FROM habits WHERE user_id = $1)
        AND date >= DATE_TRUNC('month', CURRENT_DATE)
    `, [req.user.userId]);
    
    const stats = result.rows[0];
    const total = parseInt(stats.total) || 0;
    const completed = parseInt(stats.completed) || 0;
    
    const todayResult = await db.query(`
      SELECT COUNT(*) as total, SUM(CASE WHEN completed THEN 1 ELSE 0 END) as completed
      FROM habit_progress
      WHERE habit_id IN (SELECT id FROM habits WHERE user_id = $1)
        AND date = $2
    `, [req.user.userId, stats.today]);

    const todayStats = todayResult.rows[0];
    const todayTotal = parseInt(todayStats.total) || 0;
    const todayCompleted = parseInt(todayStats.completed) || 0;

    res.json({
      overall: {
        total,
        completed,
        completionRate: total > 0 ? (completed / total * 100).toFixed(2) : 0
      },
      today: {
        total: todayTotal,
        completed: todayCompleted,
        completionRate: todayTotal > 0 ? (todayCompleted / todayTotal * 100).toFixed(2) : 0
      },
      // You can add similar queries for week and month if needed
    });
  } catch (error) {
    next(error);
  }
};