const { sequelize } = require('../../src/config/database');
const { User } = require('../../src/models/User');
const { Task } = require('../../src/models/Task');
const taskService = require('../../src/services/taskService');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'testsecret';

describe('TaskService', () => {
  let user;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    user = await User.create({
      username: 'taskuser',
      email: 'task@example.com',
      password: 'hashed'
    });
  });

  afterEach(async () => {
    await Task.destroy({ where: {} });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('debería crear una nueva tarea', async () => {
    const task = await taskService.createTask(user.id, {
      title: 'Nueva tarea',
      description: 'Descripción',
      status: 'pending'
    });
    expect(task.id).toBeDefined();
    expect(task.title).toBe('Nueva tarea');
    expect(task.userId).toBe(user.id);
  });

  test('debería obtener las tareas del usuario', async () => {
    await taskService.createTask(user.id, { title: 'Tarea 1' });
    await taskService.createTask(user.id, { title: 'Tarea 2' });
    const tasks = await taskService.getTasks(user.id);
    expect(tasks.length).toBe(2);
  });

  test('debería actualizar una tarea', async () => {
    const task = await taskService.createTask(user.id, { title: 'Viejo título' });
    const updated = await taskService.updateTask(user.id, task.id, {
      title: 'Nuevo título'
    });
    expect(updated.title).toBe('Nuevo título');
  });

  test('debería eliminar una tarea', async () => {
    const task = await taskService.createTask(user.id, { title: 'Eliminar' });
    const result = await taskService.deleteTask(user.id, task.id);
    expect(result).toBe(true);
    const remaining = await taskService.getTasks(user.id);
    expect(remaining.length).toBe(0);
  });
});