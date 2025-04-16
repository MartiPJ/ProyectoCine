// models/userModel.js
const pool = require('../config/db'); // Asegúrate de que la conexión a la base de datos esté configurada correctamente

async function crearUsuario({ nombre, contrasena, correo, telefono, rol }) {
    const conn = await pool.getConnection();
    try {
        const sql = 'INSERT INTO usuarios (nombre, contrasena, correo, telefono, rol) VALUES (?, ?, ?, ?, ?)';
        const result = await conn.query(sql, [nombre, contrasena, correo, telefono, rol]);
        return result.insertId;
    } finally {
        conn.release();
    }
}

async function buscarUsuarioPorNombre(nombre) {
    const conn = await pool.getConnection();
    try {
        const sql = 'SELECT * FROM usuarios WHERE nombre = ?';
        const result = await conn.query(sql, [nombre]);
        return result[0];
    } finally {
        conn.release();
    }
}

module.exports = {
    crearUsuario,
    buscarUsuarioPorNombre
};
