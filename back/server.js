// server.js
const express = require('express');
require('dotenv').config();
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const authRoutes = require('./routes/authRoutes'); // Asegúrate de que la ruta sea correcta
const cors = require('cors'); // IMPORTANTE para conexión con el frontend

const app = express();
app.use(cors()); // Permitir solicitudes desde el frontend
app.use(express.json());
app.use(authRoutes); // Usar rutas
const PORT = process.env.PORT || 4000;
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'My API',
            version: '1.0.0',
            description: 'Library API Information',
        },
        servers: [{ url: `http://localhost:${PORT}` }],
    },
    apis: ['./routes/authRoutes.js'], // Puedes mover la documentación a otro archivo luego
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.get('/', (req, res) => {
    res.send('✅ Backend en línea');
});



app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en puerto ${PORT}`);
    console.log(`📘 Documentación Swagger disponible en http://localhost:${PORT}/api-docs`);
});
