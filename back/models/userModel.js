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

//funcion para ver usuarios
async function verUsuarios() {
    const conn = await pool.getConnection();
    try {
        const sql = 'SELECT * FROM usuarios';
        const result = await conn.query(sql);
        return result;
    } finally {
        conn.release();
    }   
}


//funcion para crear salas
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

// Ver todas las salas
async function verTodasLasSalas() {
    const conn = await pool.getConnection();
    try {
        const sql = 'SELECT * FROM sala';
        const result = await conn.query(sql);
        return result;
    } finally {
        conn.release();
    }
}

// Ver una sala específica por id
async function verSalaPorId(id) {
    const conn = await pool.getConnection();
    try {
        const sql = 'SELECT * FROM sala WHERE id_sala = ?';
        const [result] = await conn.query(sql, [id]);
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

//funcion para ver todas las reservaciones
async function verTodasLasReservaciones() {
    const conn = await pool.getConnection();
    try {
        const sql = 'SELECT * FROM reservacion';
        const result = await conn.query(sql);
        return result;
    } finally {
        conn.release();
    }
}
//funcion para ver reservaciones por ID
async function verReservacionPorId(id) {
    const conn = await pool.getConnection();
    try {
        const sql = 'SELECT * FROM reservacion WHERE id_reservacion = ?';
        const [result] = await conn.query(sql, [id]);
        return result;
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

//funcion para ver peliculas
async function verPeliculas() {
    const conn = await pool.getConnection();
    try {
        const sql = 'SELECT * FROM pelicula';
        const result = await conn.query(sql);
        return result;
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

// Ver todas las funciones con título de la película
async function verTodasLasFunciones() {
    const conn = await pool.getConnection();
    try {
        const sql = `
            SELECT f.*, p.titulo AS titulo_pelicula
            FROM funcion f
            JOIN pelicula p ON f.id_pelicula = p.id_pelicula
        `;
        const result = await conn.query(sql);
        return result;
    } finally {
        conn.release();
    }
}

// Ver función por ID con título de la película
async function verFuncionPorId(id_funcion) {
    const conn = await pool.getConnection();
    try {
        const sql = `
            SELECT f.*, p.titulo AS titulo_pelicula
            FROM funcion f
            JOIN pelicula p ON f.id_pelicula = p.id_pelicula
            WHERE f.id_funcion = ?
        `;
        const [result] = await conn.query(sql, [id_funcion]);
        return result;
    } finally {
        conn.release();
    }
}




//funcion para crear asiento
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

//funcion para ver asientos
async function verTodosLosAsientos() {
    const conn = await pool.getConnection();
    try {
        const sql = 'SELECT * FROM asiento';
        const result = await conn.query(sql);
        return result;
    } finally {
        conn.release();
    }
}

//funcion para ver asientos por sala
async function verAsientosPorSala(id_sala) {
    const conn = await pool.getConnection();
    try {
        const sql = 'SELECT * FROM asiento WHERE id_sala = ?';
        const result = await conn.query(sql, [id_sala]);
        return result;
    } finally {
        conn.release();
    }
}


//funcion de Asiento reservado
async function crearAsientoReservado({ id_reservacion, id_asiento }) {
    const conn = await pool.getConnection();
    try {
        const sql = 'INSERT INTO asientoreservado (id_reservacion, id_asiento) VALUES (?, ?)';
        const result = await conn.query(sql, [id_reservacion, id_asiento]);
        return Number(result.insertId); // <- Cambio clave aquí
    } finally {
        conn.release();
    }
}

//funcion para ver asientos reservados
async function verAsientosReservados() {
    const conn = await pool.getConnection();
    try {
        const sql = 'SELECT * FROM asientoreservado';
        const result = await conn.query(sql);
        return result;
    } finally {
        conn.release();
    }
}

//funcion para ver asientos reservados por id
async function verAsientosReservadosPorId(id_reservacion) {
    const conn = await pool.getConnection();
    try {
        const sql = 'SELECT * FROM asientoreservado WHERE id_reservacion = ?';
        const result = await conn.query(sql, [id_reservacion]);
        return result;
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


//funcion para obtener funciones de una sala especifica
async function obtenerFuncionesPorSala(id_sala) {
    const conn = await pool.getConnection();
    try {
        const sql = 'SELECT * FROM funcion WHERE id_sala = ?';
        const result = await conn.query(sql, [id_sala]);
        return result;
    } finally {
        conn.release();
    }
}

module.exports = {
    crearUsuario,
    verUsuarios,
    buscarUsuarioPorNombre,
    crearSala,
    ModificarSala,
    verTodasLasSalas,
    verSalaPorId,
    reservarSala,
    verTodasLasReservaciones,
    verReservacionPorId,
    crearPelicula,
    verPeliculas,
    crearFuncion,
    verTodasLasFunciones,
    verFuncionPorId,
    crearAsiento,
    verTodosLosAsientos,
    verAsientosPorSala,
    crearAsientoReservado,
    verAsientosReservados,
    verAsientosReservadosPorId,
    obtenerFuncionesPorSala
};
