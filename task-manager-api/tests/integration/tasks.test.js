const request = require('supertest');
const { sequelize } = require('../../src/config/database');
const app = require('../../src/app');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'testsecret';

describe('Tasks API', () => {
  let token;
  beforeAll(async () => {
    await sequelize.sync({ force: true });
    // registrar y obtener token
    await request(app)
      .post('/api/auth/register')
      .send({ username: 'taskuser', email: 'taskint@example.com', password: 'password123' });
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'taskint@example.com', password: 'password123' });
    token = res.body.token;
  });

  afterEach(async () => {
    // eliminar todas las tareas
    await sequelize.truncate({ cascade: true });
    // registrar nuevamente para asegurar existencia de usuario
    await request(app)
      .post('/api/auth/register')
      .send({ username: 'taskuser', email: 'taskint@example.com', password: 'password123' });
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'taskint@example.com', password: 'password123' });
    token = res.body.token;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('POST /api/tasks debería crear una tarea', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Tarea 1', description: 'Desc', status: 'pending' });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Tarea 1');
  });

  test('GET /api/tasks debería listar tareas', async () => {
    await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Tarea 1' });
    await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Tarea 2' });
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
  });

  test('PUT /api/tasks/:id debería actualizar tarea', async () => {
    const create = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Vieja' });
    const id = create.body.id;
    const res = await request(app)
      .put(`/api/tasks/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Nueva', status: 'completed' });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Nueva');
    expect(res.body.status).toBe('completed');
  });

  test('DELETE /api/tasks/:id debería eliminar tarea', async () => {
    const create = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Eliminar' });
    const id = create.body.id;
    const res = await request(app)
      .delete(`/api/tasks/${id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(204);
  });
});