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
    loginUsuario
};
