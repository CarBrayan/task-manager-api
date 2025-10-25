const { body, param, validationResult } = require('express-validator');
const { TASK_STATUSES } = require('../utils/constants');

// Middleware para manejar resultados de validación
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validación de registro
const registerValidator = [
  body('username')
    .isString()
    .isLength({ min: 3 })
    .withMessage('El nombre de usuario debe tener al menos 3 caracteres'),
  body('email').isEmail().withMessage('El correo electrónico no es válido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  handleValidation
];

// Validación de login
const loginValidator = [
  body('email').isEmail().withMessage('El correo electrónico no es válido'),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es obligatoria'),
  handleValidation
];

// Validación de creación de tarea
const taskCreateValidator = [
  body('title')
    .isString()
    .notEmpty()
    .withMessage('El título es obligatorio'),
  body('description')
    .optional()
    .isString()
    .withMessage('La descripción debe ser una cadena de texto'),
  body('status')
    .optional()
    .isIn(TASK_STATUSES)
    .withMessage('Estado no válido'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('La fecha de vencimiento debe ser una fecha válida en formato ISO 8601'),
  handleValidation
];

// Validación de actualización de tarea
const taskUpdateValidator = [
  param('id').isInt().withMessage('El ID debe ser un entero'),
  body('title')
    .optional()
    .isString()
    .withMessage('El título debe ser una cadena de texto'),
  body('description')
    .optional()
    .isString()
    .withMessage('La descripción debe ser una cadena de texto'),
  body('status')
    .optional()
    .isIn(TASK_STATUSES)
    .withMessage('Estado no válido'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('La fecha de vencimiento debe ser una fecha válida en formato ISO 8601'),
  handleValidation
];

module.exports = {
  registerValidator,
  loginValidator,
  taskCreateValidator,
  taskUpdateValidator
};