const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const logger = require('./utils/logger');
const errorHandler = require('./middlewares/errorHandler');

// Rutas
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Middlewares de seguridad
app.use(helmet());
app.use(cors());
app.use(express.json());

// Logger HTTP
app.use(
  morgan('combined', {
    stream: {
      write: (message) => logger.http(message.trim())
    }
  })
);

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas principales
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Ruta de salud básica
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Middleware de manejo de errores
app.use(errorHandler);

module.exports = app;