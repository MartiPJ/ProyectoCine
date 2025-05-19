// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Crea un nuevo usuario en la base de datos
 *     tags: [Usuario]
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

router.get('/usuarios', authController.verUsuarios);

router.put('/usuarios/:id_usuario', authController.actualizarUsuario);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: deja ingrear al usuario a la aplicacion
 *     tags: [Login]
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

/**
 * @swagger
 * /sala:
 *   post:
 *     summary: Registra una nueva sala
 *     tags: [Sala]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre de la sala
 *                 example: Sala 1
 *               capacidad_filas:
 *                 type: number
 *                 description: Capacidad de filas de la sala
 *                 example: 10
 *               capacidad_columnas:
 *                 type: number
 *                 description: Capacidad de columnas de la sala
 *                 example: 20
 *     responses:
 *       201:
 *         description: Sala creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Sala creada
 */
router.post('/sala', authController.registrarSala);

/**
 * @swagger
 * /salas/{id}:
 *   put:
 *     summary: Modificar una sala existente
 *     description: Permite modificar los datos de una sala existente en el sistema.
 *     tags:
 *       - Salas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la sala a modificar.
 *         schema:
 *           type: integer
 *       - in: body
 *         name: body
 *         required: true
 *         description: Datos de la sala a modificar.
 *         schema:
 *           type: object
 *           properties:
 *             nombre:
 *               type: string
 *               description: Nombre de la sala.
 *               example: Sala Principal
 *             capacidad_filas:
 *               type: integer
 *               description: Número de filas de capacidad.
 *               example: 10
 *             capacidad_columnas:
 *               type: integer
 *               description: Número de columnas de capacidad.
 *               example: 15
 *     responses:
 *       200:
 *         description: Sala modificada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Sala modificada
 *                 result:
 *                   type: object
 *                   description: Resultado de la operación.
 *       400:
 *         description: Faltan datos requeridos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Faltan datos requeridos
 *       500:
 *         description: Error en el servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al modificar la sala
 *                 details:
 *                   type: string
 *                   example: Detalles del error.
 */
router.put('/sala/:id', authController.modificarSala);

/**
 * @swagger
 * /salas:
 *   get:
 *     summary: Obtiene todas las salas registradas
 *     tags: [Sala]
 *     responses:
 *       200:
 *         description: Lista de salas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_sala:
 *                     type: integer
 *                     description: ID de la sala
 *                   nombre:
 *                     type: string
 *                     description: Nombre de la sala
 *                   capacidad_filas:
 *                     type: integer
 *                     description: Capacidad de filas de la sala
 *                   capacidad_columnas:
 *                     type: integer
 *                     description: Capacidad de columnas de la sala
 */
router.get('/salas/:id_sala?', authController.verSalas);

/**
 * @swagger
 * /reservarSala:
 *   post:
 *     summary: Reserva una sala
 *     tags: [Reserva]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_usuario:
 *                 type: integer
 *                 description: ID del usuario que reserva la sala
 *                 example: 1
 *               id_sala:
 *                 type: integer
 *                 description: ID de la sala a reservar
 *                 example: 2
 *               id_funcion:
 *                 type: integer
 *                 description: ID de la función asociada a la reserva
 *                 example: 3
 *               estado:
 *                 type: string
 *                 description: Estado de la reserva (ej. 'confirmada', 'pendiente')
 *                 example: confirmada
 *               fecha:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha y hora de la reserva en formato ISO 8601 (ej. '2023-10-01T12:00:00Z')
 *     responses:
 *       201:
 *         description: Reserva creada exitosamente
 */
router.post('/reservarSala', authController.reservarSala);

router.get('/reservaciones/:id_reservacion?', authController.verReservaciones);

/**
 * @swagger
 * /pelicula:
 *   post:
 *     summary: Crea una nueva película
 *     tags: [Pelicula]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 description: Nombre de la película
 *                 example: La gran aventura
 *               imagen_poster:
 *                 type: boolean
 *                 description: Si la película tiene un poster
 *                 example: true
 *               descripcion:
 *                 type: string
 *                 description: Clasificación de la película (ej. 'Pelicula de aventura')
 *                 example: Pelicula de aventura hecha por Robert
 */
router.post('/pelicula', authController.ingresarPelicula)

router.get('/peliculas', authController.verPeliculas)

/**
 * @swagger
 * /funcion:
 *   post:
 *     summary: Crea una nueva función de película
 *     tags: [Funcion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_sala:
 *                 type: integer
 *                 description: ID de la sala donde se proyectará la película
 *                 example: 1
 *               id_pelicula:
 *                 type: integer
 *                 description: ID de la película que se proyectará
 *                 example: 2
 *               fecha:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha (ej. '2023-10-01')
 *                 example: '2023-10-01'
 *               hora:
 *                type: string
 *                format: time
 *                description: Hora de la función (ej. '14:00:00')
 *                example: '14:00:00'
 */
router.post('/funcion', authController.ingresarFuncion)

router.get('/funciones/:id_funcion?', authController.verFunciones);

router.put('/funcion/:id_funcion', authController.modificarFuncion);

/**
 * @swagger
 * /asiento:
 *   post:
 *     summary: Crea un nuevo asiento
 *     tags: [Asiento]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_sala:
 *                 type: integer
 *                 description: ID de la sala donde se encuentra el asiento
 *                 example: 1
 *               fila:
 *                 type: integer
 *                 description: Número de fila del asiento
 *                 example: 5
 *               columna:
 *                 type: integer
 *                 description: Número de columna del asiento
 *                 example: 10
 */
router.post('/asiento', authController.ingresarAsiento)

router.get('/asientos/:id_sala?', authController.verAsientos);

/**
 * @swagger
 * /asientoReservado:
 *   post:
 *     summary: Reserva un asiento
 *     tags: [Asiento]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_reservacion:
 *                 type: integer
 *                 description: ID de la reservación asociada al asiento
 *                 example: 1
 *               id_asiento:
 *                 type: integer
 *                 description: ID del asiento reservado
 *                 example: 2
 */
router.post('/asientoReservado', authController.ingresarAsientoReservado)

router.get('/asientos/:id_asiento/disponible/:id_funcion', authController.verificarDisponibilidadAsiento);

router.get('/asientosReservados/:id_funcion?', authController.verAsientosReservados)

router.get('/funciones/sala/:id_sala?', authController.verFuncionesPorSala)
module.exports = router;
