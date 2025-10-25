const authService = require('../services/authService');

async function register(req, res, next) {
  try {
    const user = await authService.register(req.body);
    // Excluir contraseña en la respuesta
    const userData = { id: user.id, username: user.username, email: user.email };
    res.status(201).json({ user: userData });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login };