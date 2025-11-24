const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');

describe('Auth API', () => {
  it('registers a new user and returns tokens', async () => {
    const payload = {
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      password: 'Password123!',
    };

    const response = await request(app).post('/api/v1/auth/register').send(payload).expect(201);

    expect(response.body.data.user.email).toBe(payload.email);
    expect(response.body.data.tokens.accessToken).toBeDefined();
    expect(response.body.data.tokens.refreshToken).toBeDefined();
    const users = await User.find();
    expect(users).toHaveLength(1);
  });

  it('logs in an existing user and returns new tokens', async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({ fullName: 'John Doe', email: 'john@example.com', password: 'Password123!' });

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'john@example.com', password: 'Password123!' })
      .expect(200);

    expect(response.body.data.tokens.accessToken).toBeDefined();
  });
});

