const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

const isTest = process.env.NODE_ENV === 'test';

// Configuración de Sequelize para SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: isTest ? ':memory:' : process.env.DB_STORAGE || 'database.sqlite',
  logging: false
});

module.exports = { sequelize };