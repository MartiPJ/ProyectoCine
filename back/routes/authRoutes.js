// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

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

router.post('/usuarios', authController.registrarUsuario);

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
router.post('/login', authController.loginUsuario);

module.exports = router;
