// server.js
const express = require('express');
require('dotenv').config();
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const authRoutes = require('./routes/authRoutes'); // Asegúrate de que la ruta sea correcta

const app = express();
app.use(express.json());
app.use(authRoutes); // Usar rutas

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'My API',
            version: '1.0.0',
            description: 'Library API Information',
        },
        servers: [{ url: 'http://localhost:3000' }],
    },
    apis: ['./routes/authRoutes.js'], // Puedes mover la documentación a otro archivo luego
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
    console.log('Documentación Swagger disponible en http://localhost:3000/api-docs');
});
