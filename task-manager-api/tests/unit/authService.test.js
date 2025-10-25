const { sequelize } = require('../../src/config/database');
const { User } = require('../../src/models/User');
const authService = require('../../src/services/authService');

// Configurar entorno de pruebas
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'testsecret';

describe('AuthService', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    // Limpiar usuarios después de cada prueba
    await User.destroy({ where: {} });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('debería registrar un nuevo usuario', async () => {
    const user = await authService.register({
      username: 'usuario',
      email: 'user@example.com',
      password: 'password123'
    });
    expect(user.id).toBeDefined();
    expect(user.username).toBe('usuario');
    expect(user.email).toBe('user@example.com');
  });

  test('no debería permitir correos duplicados', async () => {
    await authService.register({
      username: 'usuario1',
      email: 'duplicate@example.com',
      password: 'password123'
    });
    await expect(
      authService.register({
        username: 'usuario2',
        email: 'duplicate@example.com',
        password: 'password123'
      })
    ).rejects.toThrow(/correo electrónico ya está registrado/);
  });

  test('debería iniciar sesión con credenciales válidas', async () => {
    const user = await authService.register({
      username: 'usuario',
      email: 'login@example.com',
      password: 'password123'
    });
    const result = await authService.login({
      email: 'login@example.com',
      password: 'password123'
    });
    expect(result.token).toBeDefined();
    expect(result.user.email).toBe('login@example.com');
  });

  test('no debería iniciar sesión con contraseña incorrecta', async () => {
    await authService.register({
      username: 'usuario',
      email: 'wrongpass@example.com',
      password: 'password123'
    });
    await expect(
      authService.login({ email: 'wrongpass@example.com', password: 'badpass' })
    ).rejects.toThrow(/Credenciales inválidas/);
  });
});