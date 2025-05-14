// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');


async function registrarUsuario(req, res) {
    try {
        const { nombre, contrasena, correo, telefono, rol = 'usuario' } = req.body;
        if (!nombre || !contrasena || !correo || !telefono) {
            return res.status(400).json({ error: 'Faltan datos requeridos' });
        }

        const hashedPassword = await bcrypt.hash(contrasena, 10);
        const id = await userModel.crearUsuario({ nombre, contrasena: hashedPassword, correo, telefono, rol });

        res.status(201).json({ message: 'Usuario agregado', id });
    } catch (err) {
        res.status(500).json({ error: 'Error al insertar usuario', details: err.message });
    }
}

//función para registrar una sala
async function registrarSala(req, res) {
    try {
        const { nombre, capacidad_filas, capacidad_columnas } = req.body;
        if (!nombre || !capacidad_filas || !capacidad_columnas ) {
            return res.status(400).json({ error: 'Faltan datos requeridos' });
        }

        const id = await userModel.crearSala({ nombre,  capacidad_filas, capacidad_columnas });

        res.status(201).json({ message: 'Sala creada', id });
    } catch (err) {
        res.status(500).json({ error: 'Error al crear la sala', details: err.message });
    }
}

//función para modificar una sala
async function modificarSala(req, res) {
    try {
        const id_sala = req.params.id;
        const { nombre, capacidad_filas, capacidad_columnas } = req.body;

        if (!nombre || !capacidad_filas || !capacidad_columnas) {
            return res.status(400).json({ error: 'Faltan datos requeridos' });
        }

        const result = await userModel.ModificarSala({ id_sala, nombre, capacidad_filas, capacidad_columnas });

        res.status(200).json({ message: 'Sala modificada', result });
    } catch (err) {
        res.status(500).json({ error: 'Error al modificar la sala', details: err.message });
    }
}

//funcion para ver todas las salas
async function verSalas(req, res) {
    try {
        const salas = await userModel.verSalas();
        console.log("Resultado de la consulta SQL 2222:", salas);

        res.status(200).json(salas);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener las salas', details: err.message });
    }
}

//fucioon para reservar una sala
async function reservarSala(req, res) {
    try {
        const { id_usuario, id_sala, id_funcion, estado, fecha } = req.body;
        if (!id_usuario || !id_sala || !id_funcion || !estado || !fecha) {
            return res.status(400).json({ error: 'Faltan datos requeridos' });
        }

        const id = await userModel.reservarSala({ id_usuario, id_sala, id_funcion, estado, fecha });

        res.status(201).json({ message: 'Reserva realizada', id });
    } catch (err) {
        res.status(500).json({ error: 'Error al realizar la reserva', details: err.message });
    }
}

//funcion para ingresar pelicula
async function ingresarPelicula(req, res) {
    try {
        const { titulo, imagen_poster, descripcion } = req.body;
        if (!titulo || !imagen_poster || !descripcion) {
            return res.status(400).json({ error: 'Faltan datos requeridos' });
        }

        const id = await userModel.crearPelicula({ titulo, imagen_poster, descripcion});

        res.status(201).json({ message: 'Pelicula creada', id });
    } catch (err) {
        res.status(500).json({ error: 'Error al crear la pelicula', details: err.message });
    }
}

//funcion para ingresar funcion de peliculas
async function ingresarFuncion(req, res) {
    try {
        const { id_pelicula, id_sala, fecha, hora } = req.body;
        if (!id_pelicula || !id_sala || !fecha || !hora) {
            return res.status(400).json({ error: 'Faltan datos requeridos' });
        }

        

        const id = await userModel.crearFuncion({ id_sala, id_pelicula, fecha, hora });

        res.status(201).json({ message: 'Funcion creada', id });
    } catch (err) {
        res.status(500).json({ error: 'Error al crear la funcion', details: err.message });
    }
}


//funcion para ingresar asiento
async function ingresarAsiento(req, res) {
    try {
        const { id_sala, fila, columna } = req.body;
        if (!id_sala || !fila || !columna) {
            return res.status(400).json({ error: 'Faltan datos requeridos' });
        }

        const id = await userModel.crearAsiento({ id_sala, fila, columna });

        res.status(201).json({ message: 'Asiento creado', id });
    } catch (err) {
        res.status(500).json({ error: 'Error al crear el asiento', details: err.message });
    }
}

//funcion de asiento reservado
async function ingresarAsientoReservado(req, res) {
    try {
        const { id_reservacion, id_asiento } = req.body;
        if (!id_reservacion || !id_asiento) {
            return res.status(400).json({ error: 'Faltan datos requeridos' });
        }

        const id = await userModel.crearAsientoReservado({ id_reservacion, id_asiento });

        res.status(201).json({ message: 'Asiento reservado', id });
    } catch (err) {
        res.status(500).json({ error: 'Error al reservar el asiento', details: err.message });
    }
}

//función para iniciar sesión
async function loginUsuario(req, res) {
    try {
        const { nombre, contrasena } = req.body;
        const user = await userModel.buscarUsuarioPorNombre(nombre);

        if (!user) return res.status(401).json({ mensaje: 'Usuario no registrado' });

        const match = await bcrypt.compare(contrasena, user.contrasena);
        if (!match) return res.status(401).json({ mensaje: 'Contraseña incorrecta' });

        const token = jwt.sign(
            { id: user.id_usuario, usuario: user.nombre, rol: user.rol },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ mensaje: 'Bienvenido', token, rol: user.rol });
    } catch (err) {
        res.status(500).json({ mensaje: 'Error en el servidor', detalles: err.message });
    }
}

module.exports = {
    registrarUsuario,
    loginUsuario,
    registrarSala,
    modificarSala,
    verSalas,
    reservarSala,
    ingresarPelicula,
    ingresarFuncion,
    ingresarAsiento,
    ingresarAsientoReservado,
};
