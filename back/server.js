const express = require('express');
const pool = require('./db'); // Importa el pool de conexiones
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const app = express();
app.use(express.json()); // Middleware para procesar JSON

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Crea un nuevo usuario en la base de datos
 *     description: Este endpoint permite agregar un nuevo usuario con nombre, contraseña, correo, teléfono, y rol. La contraseña se almacena en la base de datos después de ser hasheada.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del usuario
 *                 example: Juan Pérez
 *               contrasena:
 *                 type: string
 *                 description: Contraseña del usuario
 *                 example: mySecurePassword123
 *               correo:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *                 example: juanperez@example.com
 *               telefono:
 *                 type: number
 *                 description: Número de teléfono del usuario
 *                 example: 50212345678
 *               rol:
 *                 type: string
 *                 description: Rol del usuario (opcional, por defecto "usuario")
 *                 example: admin
 *     responses:
 *       201:
 *         description: Usuario agregado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario agregado
 *                 id:
 *                   type: integer
 *                   description: ID del usuario agregado
 *                   example: 1
 *       400:
 *         description: Error en la solicitud por datos faltantes o formato incorrecto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Faltan datos requeridos
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al insertar usuario
 *                 details:
 *                   type: string
 *                   example: Error en la conexión con la base de datos
 */

app.post('/usuarios', async (req, res) => {
    try {
        console.log('Recibiendo solicitud:', req.body);

        const { nombre, contrasena, correo, telefono, rol = 'usuario' } = req.body;
        if (!nombre || !contrasena || !correo || !telefono || rol === undefined) {
            return res.status(400).json({ error: 'Faltan datos requeridos' });
        }

        // Validar que teléfono sea un número
        if (typeof telefono !== 'number' || isNaN(telefono)) {
            return res.status(400).json({ error: 'El teléfono debe ser un número válido' });
        }

        // Hashear la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(contrasena, saltRounds);

        // Obtener una conexión del pool
        const conn = await pool.getConnection();
        try {
            const sqlQuery = 'INSERT INTO usuarios (nombre, contrasena, correo, telefono, rol) VALUES (?, ?, ?, ?, ?)';
            const result = await conn.query(sqlQuery, [nombre, hashedPassword, correo, telefono, rol]);

            res.status(201).json({ 
                message: 'Usuario agregado', 
                id: Number(result.insertId) // Convertimos BigInt a Number
            });

        } finally {
            conn.release(); // Libera la conexión
        }
    } catch (err) {
        console.error('Error al insertar usuario:', err);
        res.status(500).json({ error: 'Error al insertar usuario', details: err.message });
    }
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: deja ingrear al usuario a la aplicacion
 *     description: Este endpoint permite ingresar a la aplicacion con nombre y contraseña
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del usuario
 *                 example: Juan Pérez
 *               contrasena:
 *                 type: string
 *                 description: Contraseña del usuario
 *                 example: mySecurePassword123
 *     responses:
 *       201:
 *         description: Usuario agregado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario agregado
 *                 id:
 *                   type: integer
 *                   description: ID del usuario agregado
 *                   example: 1
 *       401:
 *         description: Error en la solicitud por datos faltantes o formato incorrecto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Faltan datos requeridos o contraseña incorrecta
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al inciar sesion del usuario
 *                 details:
 *                   type: string
 *                   example: Error en la conexión con la base de datos
 */
app.post('/login', async (req, res) => {
    let conn;
    try {
        const { nombre, contrasena } = req.body;
        
        conn = await pool.getConnection();
        const results = await conn.query('SELECT * FROM usuarios WHERE nombre = ?', [nombre]);

        if (results.length === 0) {
            return res.status(401).json({ mensaje: 'Usuario no registrado' });
        }

        const user = results[0];

        console.log('Contraseña ingresada:', contrasena);
        console.log('Contraseña almacenada:', user.contrasena);

        // Comparar la contraseña con bcrypt
        const passwordMatch = await bcrypt.compare(contrasena, user.contrasena);
        
        if (!passwordMatch) {
            console.log('Las contraseñas no coinciden.');
            return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
        }

        const token = jwt.sign(
            { id: user.id_usuario, usuario: user.nombre, rol: user.rol },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ 
            mensaje: 'Bienvenido', 
            token, 
            rol: user.rol 
        });

    } catch (err) {
        console.error('Error en el login:', err);
        res.status(500).json({ mensaje: 'Error en el servidor', detalles: err.message });
    } finally {
        if (conn) conn.release();
    }
});


// Swagger setup
const swaggerOptions = {
    swaggerDefinition: {
        myapi: '3.0.0',
        info: {
            title: 'My API',
            version:'1.0.0',
            description: 'Library API Information',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
// endpoint de swagger
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// Inicia el servidor
app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
    console.log('Documentación Swagger disponible en http://localhost:3000/api-docs');
});
