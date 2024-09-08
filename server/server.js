require('dotenv').config();

// Check for JWT_SECRET immediately after loading environment variables
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not set. Please set it in your .env file or in the environment variables.');
  process.exit(1);
}

const app = require('./app');
const config = require('./config/database');
const fs = require('fs');
const path = require('path');
const { query } = require('./config/database');

const PORT = process.env.PORT || 5000;

const initDb = async () => {
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'db', 'init.sql'), 'utf8');
    console.log('Executing SQL:', sql);
    await query(sql);
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
    process.exit(1);
  }
};

const startServer = async () => {
  try {
    await initDb();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();