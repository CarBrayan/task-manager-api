# API de Gestión de Tareas

## Introducción

Este mini‑proyecto implementa una **API RESTful** para gestionar usuarios y tareas. El objetivo principal es poner en práctica principios de ingeniería de software y demostrar una configuración básica de **integración continua** utilizando **GitHub Actions**. A lo largo del proyecto se prestó especial atención a las buenas prácticas de calidad y seguridad: validación de datos, manejo de errores, autenticación con JWT, uso de cabeceras de seguridad y separación clara de responsabilidades.

## Alcance y arquitectura

### Patrones de arquitectura

Para estructurar el sistema se eligió el patrón **Modelo‑Vista‑Controlador (MVC)**. Según la documentación de Wikipedia, MVC es un patrón de arquitectura de software que separa los datos y la lógica de negocio de su representación y del módulo encargado de gestionar los eventos【981200822981249†L164-L173】. Esta separación facilita la reutilización de código y el mantenimiento del proyecto. El presente proyecto solo expone una API (no incluye vistas), pero se mantiene la organización MVC mediante **modelos** (gestión de datos), **controladores** (manejo de peticiones), **servicios** (lógica de negocio) y **rutas** (enrutamiento HTTP).

Se optó por una arquitectura **monolítica MVC** en lugar de microservicios porque el alcance de la aplicación es reducido y no requiere la complejidad inherente a una infraestructura distribuida. Las aplicaciones monolíticas tienen ventajas como **implementación sencilla**, **desarrollo y pruebas más simples** y mayor facilidad de depuración【635976050967512†L424-L444】. Aunque una arquitectura de microservicios ofrece escalado flexible e implementaciones independientes【635976050967512†L527-L569】, también introduce más puntos de fallo y complejidad de orquestación. Por lo tanto, para un mini‑proyecto educativo es más apropiado un monolito bien estructurado.

### Tecnologías utilizadas

* **Node.js** con **Express** para el servidor HTTP.
* **Sequelize** y **SQLite** para la persistencia de datos. SQLite funciona en un solo archivo, por lo que simplifica el despliegue y las pruebas.
* **JSON Web Tokens (JWT)** para autenticación.
* **Express‑Validator** para validar entradas y evitar ataques por datos maliciosos. La documentación de Express recomienda no confiar en el input del usuario【251132876570587†L143-L149】.
* **Helmet** para establecer cabeceras de seguridad; este middleware ayuda a mitigar vulnerabilidades conocidas en aplicaciones Express【251132876570587†L176-L218】.
* **Winston** y **Morgan** para el registro de eventos.
* **Swagger** para documentar la API.
* **Jest** y **Supertest** para pruebas unitarias e integrales.
* **GitHub Actions** para la integración continua: el flujo de trabajo se inspira en la guía oficial de GitHub que utiliza un runner `ubuntu-latest`, instala dependencias con `npm ci` y ejecuta las pruebas【667023179633544†L408-L419】. Se utiliza `npm ci` porque instala las dependencias a partir del archivo `package-lock.json` de forma rápida y fiable【667023179633544†L454-L457】.

## Estructura del proyecto

El repositorio sigue la siguiente estructura de carpetas:

```
task-manager-api/
├── src/                 # Código fuente
│   ├── config/          # Configuración de base de datos y Swagger
│   ├── controllers/     # Controladores HTTP
│   ├── middlewares/     # Middlewares (auth, validación, manejo de errores)
│   ├── models/          # Modelos Sequelize (User y Task)
│   ├── routes/          # Definición de rutas
│   ├── services/        # Lógica de negocio
│   ├── utils/           # Utilidades (logger y constantes)
│   └── app.js           # Configuración de la aplicación Express
├── tests/               # Pruebas unitarias e integrales
│   ├── unit/
│   └── integration/
├── .github/workflows/ci.yml  # Definición de workflow de GitHub Actions
├── .env.example         # Variables de entorno de ejemplo
├── package.json         # Dependencias y scripts
├── server.js            # Arranque del servidor y sincronización DB
└── README.md            # Documentación del proyecto
```

## Seguridad y buenas prácticas

El proyecto implementa varias prácticas para proteger la API y cumplir con criterios de calidad:

1. **Validación de entradas**: Se utiliza `express‑validator` para asegurar que los datos recibidos cumplan con formatos y rangos esperados. La guía de seguridad de Express subraya que una de las necesidades más críticas en aplicaciones web es validar y tratar adecuadamente la entrada del usuario【251132876570587†L143-L149】.
2. **Cabeceras de seguridad**: El middleware `helmet` ajusta cabeceras como `Content‑Security‑Policy`, `Strict‑Transport‑Security` y otras para proteger contra ataques de fuerza bruta, clickjacking y XSS【251132876570587†L176-L218】.
3. **Cifrado de datos confidenciales**: Las contraseñas se almacenan con bcrypt y los tokens se generan con una clave secreta almacenada en variables de entorno. Si la aplicación manejara datos sensibles, la documentación de Express recomienda utilizar TLS【251132876570587†L120-L139】.
4. **Autenticación JWT**: Todas las rutas relacionadas con tareas requieren un token válido en la cabecera `Authorization`. El middleware de autenticación verifica el token y carga el usuario correspondiente.
5. **Manejo centralizado de errores**: El middleware `errorHandler` captura excepciones y devuelve respuestas JSON consistentes. Esto evita exponer trazas de pila a los clientes.

## Endpoints principales

A continuación se resumen los endpoints expuestos por la API. La base de la URL es `http://localhost:{PORT}/api`.

### Autenticación

| Método | Ruta            | Descripción                           |
|-------:|-----------------|--------------------------------------|
| **POST** | `/auth/register` | Registra un nuevo usuario. Se envían `username`, `email` y `password`. Devuelve los datos del usuario creado. |
| **POST** | `/auth/login`    | Inicia sesión con `email` y `password`. Devuelve un JWT y los datos del usuario. |

### Tareas (protegido con JWT)

| Método | Ruta              | Descripción                                                         |
|-------:|-------------------|--------------------------------------------------------------------|
| **GET** | `/tasks`          | Lista todas las tareas del usuario autenticado.                    |
| **GET** | `/tasks/{id}`     | Obtiene una tarea específica por su ID.                            |
| **POST**| `/tasks`          | Crea una nueva tarea. Recibe `title`, `description`, `status` y `dueDate`. |
| **PUT** | `/tasks/{id}`     | Actualiza una tarea existente. Permite modificar `title`, `description`, `status` y `dueDate`. |
| **DELETE** | `/tasks/{id}` | Elimina una tarea existente.                                        |

La documentación detallada de cada endpoint, incluidos ejemplos de peticiones y respuestas, está disponible en `/api-docs` a través de Swagger UI.

## Instalación y ejecución

1. **Clonar el repositorio** (o copiar la carpeta `task-manager-api`).
2. Crear un archivo `.env` a partir de `.env.example` y ajustar las variables necesarias (por ejemplo, `JWT_SECRET`).
3. Instalar dependencias:

   ```bash
   npm install
   ```

4. Ejecutar la base de datos y el servidor:

   ```bash
   npm start
   ```

5. Acceder a la documentación interactiva en `http://localhost:{PORT}/api-docs`.

Durante el desarrollo se recomienda usar `npm run dev` para que *nodemon* recargue el servidor automáticamente al detectar cambios.

## Pruebas automatizadas

El proyecto incluye pruebas unitarias e integrales basadas en **Jest** y **Supertest**. Para ejecutarlas:

```bash
npm test
```

Las pruebas de unidad se centran en la lógica de los servicios (registro, inicio de sesión y operaciones sobre tareas). Las pruebas de integración verifican el funcionamiento completo de la API, incluidas validaciones y autenticación.

## Integración continua

Se ha configurado un flujo de trabajo de **GitHub Actions** en `.github/workflows/ci.yml` que se ejecuta automáticamente en cada `push` o `pull request`. El flujo realiza las siguientes acciones:

1. Clona el repositorio (`actions/checkout`).
2. Configura la versión de Node.js (`actions/setup-node`).
3. Instala dependencias con `npm ci` y ejecuta todas las pruebas con `npm test`. Este enfoque sigue la guía oficial de GitHub Actions para proyectos Node.js【667023179633544†L408-L419】 y aprovecha que `npm ci` utiliza el lockfile para obtener instalaciones rápidas y reproducibles【667023179633544†L454-L457】.

## Contribuciones

Los aportes son bienvenidos. Por favor, crea un *fork* del repositorio, realiza tus cambios en una rama y abre un *pull request*. Asegúrate de que las pruebas se ejecuten correctamente y respeta la guía de estilo definida por ESLint y Prettier.

## Licencia

Este proyecto está licenciado bajo la licencia MIT.