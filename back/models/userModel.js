// models/userModel.js
const pool = require('../config/db'); // Asegúrate de que la conexión a la base de datos esté configurada correctamente

// Crear un nuevo usuario en la base de datos
async function crearUsuario({ nombre, contrasena, correo, telefono, rol }) {
    const conn = await pool.getConnection();
    try {
        const sql = 'INSERT INTO usuarios (nombre, contrasena, correo, telefono, rol) VALUES (?, ?, ?, ?, ?)';
        const result = await conn.query(sql, [nombre, contrasena, correo, telefono, rol]);
        return Number(result.insertId); // <- Cambio clave aquí
    } finally {
        conn.release();
    }
}

async function crearSala({ nombre, capacidad_filas, capacidad_columnas}) {
    const conn = await pool.getConnection();
    try {
        const sql = 'INSERT INTO sala (nombre ,capacidad_filas, capacidad_columnas) VALUES (?, ?, ?)';
        const result = await conn.query(sql, [nombre, capacidad_filas, capacidad_columnas]);
        return Number(result.insertId); // <- Cambio clave aquí
    } finally {
        conn.release();
    }
}

async function ModificarSala({ id_sala, nombre, capacidad_filas, capacidad_columnas}) {
    const conn = await pool.getConnection();
    try {
        const sql = 'UPDATE sala SET nombre = ?, capacidad_filas = ?, capacidad_columnas = ? WHERE id_sala = ?';
        const result = await conn.query(sql, [nombre, capacidad_filas, capacidad_columnas, id_sala]);
        return Number(result.insertId); // <- Cambio clave aquí
    } finally {
        conn.release();
    }

}

async function verSalas() {
    const conn = await pool.getConnection();
    try {
        const sql = 'SELECT * FROM sala';
        const result = await conn.query(sql);
        console.log("Resultado de la consulta SQL:", result);
        return result;
    } finally {
        conn.release();
    }   
}

//funcion para hacer reservaciones de sala
async function reservarSala({ id_usuario, id_sala,id_funcion, estado, fecha }) {
    const conn = await pool.getConnection();
    try {
        const sql = 'INSERT INTO reservacion (id_usuario, id_sala,id_funcion, estado, fecha) VALUES (?, ?, ?, ? , ?)';
        const result = await conn.query(sql, [id_usuario, id_sala,id_funcion, estado, fecha]);
        return Number(result.insertId); // <- Cambio clave aquí
    } finally {
        conn.release();
    }
}

//funcion para crear una pelicula
async function crearPelicula({ titulo, imagen_poster, descripcion}) {
    const conn = await pool.getConnection();
    try {
        const sql = 'INSERT INTO pelicula (titulo, imagen_poster, descripcion) VALUES (?, ?, ?)';
        const result = await conn.query(sql, [titulo, imagen_poster, descripcion]);
        return Number(result.insertId); // <- Cambio clave aquí
    } finally {
        conn.release();
    }
}

//funcion para crear funciones de peliculas
async function crearFuncion({ id_sala, id_pelicula, fecha, hora }) {
    const conn = await pool.getConnection();
    try {
        const sql = 'INSERT INTO funcion (id_sala, id_pelicula, fecha, hora) VALUES (?, ?, ?, ?)';
        const result = await conn.query(sql, [id_sala, id_pelicula, fecha, hora]);
        return Number(result.insertId); // <- Cambio clave aquí
    } finally {
        conn.release();
    }
}


//funcion para asiento
async function crearAsiento({ id_sala, fila, columna }) {
    const conn = await pool.getConnection();
    try {
        const sql = 'INSERT INTO asiento (id_sala, fila, columna ) VALUES (?, ?, ?)';
        const result = await conn.query(sql, [id_sala, fila, columna ]);
        return Number(result.insertId); // <- Cambio clave aquí
    } finally {
        conn.release();
    }
}

//funcion de Asiiento reservado
async function crearAsientoReservado({ id_reservacion, id_asiento }) {
    const conn = await pool.getConnection();
    try {
        const sql = 'INSERT INTO asiento_reservado (id_reservacion, id_asiento) VALUES (?, ?)';
        const result = await conn.query(sql, [id_reservacion, id_asiento]);
        return Number(result.insertId); // <- Cambio clave aquí
    } finally {
        conn.release();
    }
}

//funcion para buscar un usuario por nombre
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
    buscarUsuarioPorNombre,
    crearSala,
    ModificarSala,
    verSalas,
    reservarSala,
    crearPelicula,
    crearFuncion,
    crearAsiento,
    crearAsientoReservado,
};
