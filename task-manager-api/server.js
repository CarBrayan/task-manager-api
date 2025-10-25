const dotenv = require('dotenv');
const { sequelize } = require('./src/config/database');
const app = require('./src/app');
const logger = require('./src/utils/logger');

// Cargar variables de entorno
dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Sincronizar modelos con la base de datos
    await sequelize.sync();
    logger.info('Base de datos sincronizada correctamente');

    app.listen(PORT, () => {
      logger.info(`Servidor iniciado en el puerto ${PORT}`);
    });
  } catch (error) {
    logger.error(`Error al iniciar el servidor: ${error.message}`);
    process.exit(1);
  }
}

startServer();