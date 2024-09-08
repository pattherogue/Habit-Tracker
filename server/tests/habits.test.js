const request = require('supertest');
const app = require('../app');
const db = require('../config/database');
const jwt = require('jsonwebtoken');

describe('Habit Endpoints', () => {
  let token;
  let userId;

  beforeAll(async () => {
    // Create a test user and generate a token
    const result = await db.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id', ['test@example.com', 'hashedpassword']);
    userId = result.rows[0].id;
    token = jwt.sign({ userId }, process.env.JWT_SECRET);
  });

  beforeEach(async () => {
    await db.query('DELETE FROM habits');
  });

  afterAll(async () => {
    await db.query('DELETE FROM users');
  });

  it('should create a new habit', async () => {
    const res = await request(app)
      .post('/api/habits')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Habit',
        frequency: 'daily'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toEqual('Test Habit');
  });

  it('should get all habits for a user', async () => {
    // First, create a habit
    await request(app)
      .post('/api/habits')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Habit',
        frequency: 'daily'
      });

    const res = await request(app)
      .get('/api/habits')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(1);
    expect(res.body[0].name).toEqual('Test Habit');
  });
});