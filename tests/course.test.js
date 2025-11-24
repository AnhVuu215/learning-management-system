const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const roles = require('../src/constants/roles');
const { generateAccessToken } = require('../src/utils/jwt');

const createInstructorToken = async () => {
  const instructor = await User.create({
    fullName: 'Instructor One',
    email: 'instructor@example.com',
    password: 'Password123!',
    role: roles.INSTRUCTOR,
  });

  return generateAccessToken({
    sub: instructor._id.toString(),
    role: instructor.role,
    email: instructor.email,
    fullName: instructor.fullName,
  });
};

describe('Course API', () => {
  it('creates a course when instructor token provided', async () => {
    const token = await createInstructorToken();

    const response = await request(app)
      .post('/api/v1/courses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Node Fundamentals',
        description: 'Learn Node.js from scratch',
        level: 'beginner',
      })
      .expect(201);

    expect(response.body.data.title).toBe('Node Fundamentals');
  });

  it('lists published courses', async () => {
    const token = await createInstructorToken();
    await request(app)
      .post('/api/v1/courses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Advanced Express',
        description: 'Build APIs with Express',
        level: 'intermediate',
        isPublished: true,
      });

    const response = await request(app).get('/api/v1/courses').expect(200);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
  });
});

