const request = require('supertest');
const { sequelize } = require('../../src/config/database');
const app = require('../../src/app');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'testsecret';

describe('Auth API', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    // limpiar base de datos entre pruebas
    await sequelize.truncate({ cascade: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('POST /api/auth/register debería crear un usuario', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
    expect(response.statusCode).toBe(201);
    expect(response.body.user.email).toBe('test@example.com');
  });

  test('POST /api/auth/login debería iniciar sesión y devolver token', async () => {
    // Registrar
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'loginuser',
        email: 'login@example.com',
        password: 'password123'
      });
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@example.com', password: 'password123' });
    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toBe('login@example.com');
  });
});