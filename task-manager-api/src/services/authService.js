const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { User } = require('../models/User');

dotenv.config();

const SALT_ROUNDS = 10;

async function register({ username, email, password }) {
  // Verificar si el usuario ya existe
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    const error = new Error('El correo electrónico ya está registrado');
    error.statusCode = 409;
    throw error;
  }

  // Hash de la contraseña
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ username, email, password: hashedPassword });

  return user;
}

async function login({ email, password }) {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    const error = new Error('Credenciales inválidas');
    error.statusCode = 401;
    throw error;
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Credenciales inválidas');
    error.statusCode = 401;
    throw error;
  }
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  // Excluir la contraseña antes de devolver
  const userData = { id: user.id, username: user.username, email: user.email };
  return { token, user: userData };
}

module.exports = { register, login };