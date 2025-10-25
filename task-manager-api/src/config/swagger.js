const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestión de Tareas',
      version: '1.0.0',
      description:
        'API RESTful para gestionar usuarios y tareas. Incluye autenticación basada en tokens JWT, validación y manejo de errores.'
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            username: { type: 'string', example: 'usuario' },
            email: { type: 'string', example: 'usuario@example.com' }
          }
        },
        Task: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Tarea de ejemplo' },
            description: { type: 'string', example: 'Descripción de la tarea' },
            status: { type: 'string', example: 'pending' },
            dueDate: { type: 'string', format: 'date-time', example: '2025-12-31T00:00:00Z' }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: { type: 'string', example: 'jwt_token_aquí' },
            user: { $ref: '#/components/schemas/User' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Descripción del error' }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;