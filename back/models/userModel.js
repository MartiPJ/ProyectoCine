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

// Función para generar asientos automáticamente para una sala
async function generarAsientosParaSala(id_sala, filas, columnas) {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        
        // Generar todos los asientos
        const placeholders = [];
        const values = [];
        for (let fila = 1; fila <= filas; fila++) {
            for (let columna = 1; columna <= columnas; columna++) {
                placeholders.push('(?, ?, ?)');
                values.push(id_sala, fila, columna);
            }
        }
        
        // Insertar todos los asientos en una sola consulta
        if (placeholders.length > 0) {
            const sql = `INSERT INTO asiento (id_sala, fila, columna) VALUES ${placeholders.join(',')}`;
            await conn.query(sql, values);
        }
        
        await conn.commit();
        return true;
    } catch (error) {
        await conn.rollback();
        console.error('Error en generarAsientosParaSala:', error);
        throw error;
    } finally {
        conn.release();
    }
}

// Modificar la función crearSala para que llame a generarAsientosParaSala
async function crearSala({ nombre, capacidad_filas, capacidad_columnas }) {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        
        // 1. Primero creamos la sala
        const sql = 'INSERT INTO sala (nombre, capacidad_filas, capacidad_columnas) VALUES (?, ?, ?)';
        const result = await conn.query(sql, [nombre, capacidad_filas, capacidad_columnas]);
        const id_sala = Number(result.insertId);
        
        // 2. Generamos los asientos automáticamente
        await generarAsientosParaSala(id_sala, capacidad_filas, capacidad_columnas);
        
        await conn.commit();
        return id_sala;
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
}

// Modificar la sala y ajustar los asientos
async function ModificarSala({ id_sala, nombre, capacidad_filas, capacidad_columnas }) {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        
        // 1. Actualizar los datos de la sala
        const updateSql = 'UPDATE sala SET nombre = ?, capacidad_filas = ?, capacidad_columnas = ? WHERE id_sala = ?';
        await conn.query(updateSql, [nombre, capacidad_filas, capacidad_columnas, id_sala]);
        
        // 2. Obtener los asientos actuales (corregido)
        const [asientosActuales] = await conn.query(
            'SELECT fila, columna FROM asiento WHERE id_sala = ?',
            [id_sala]
        );
        
        // Convertir a array si es necesario (dependiendo del driver)
        const asientosArray = Array.isArray(asientosActuales) ? asientosActuales : [asientosActuales];
        
        // 3. Determinar qué asientos deben ser eliminados o agregados
        const asientosNecesarios = new Set();
        for (let fila = 1; fila <= capacidad_filas; fila++) {
            for (let columna = 1; columna <= capacidad_columnas; columna++) {
                asientosNecesarios.add(`${fila},${columna}`);
            }
        }
        
        const asientosExistentes = new Set(
            asientosArray
                .filter(a => a && a.fila !== undefined && a.columna !== undefined)
                .map(a => `${a.fila},${a.columna}`)
        );

        
        // 4. Eliminar asientos que ya no son necesarios
        const asientosAEliminar = asientosArray.filter(a =>
            a && a.fila !== undefined && a.columna !== undefined &&
            !asientosNecesarios.has(`${a.fila},${a.columna}`)
        );

        
        if (asientosAEliminar.length > 0) {
            // Usar consulta preparada para evitar SQL injection
            await conn.query(
                'DELETE FROM asiento WHERE id_sala = ? AND (fila, columna) IN (?)',
                [id_sala, asientosAEliminar.map(a => [a.fila, a.columna])]
            );
        }
        
        // 5. Agregar nuevos asientos necesarios
        const nuevosAsientos = [];
        for (let fila = 1; fila <= capacidad_filas; fila++) {
            for (let columna = 1; columna <= capacidad_columnas; columna++) {
                if (!asientosExistentes.has(`${fila},${columna}`)) {
                    nuevosAsientos.push([id_sala, fila, columna]);
                }
            }
        }
        
        if (nuevosAsientos.length > 0) {
            const placeholders = nuevosAsientos.map(() => '(?, ?, ?)').join(',');
            const values = nuevosAsientos.flat();
            await conn.query(
                `INSERT INTO asiento (id_sala, fila, columna) VALUES ${placeholders}`,
                values
            );
        }
        
        await conn.commit();
        return id_sala;
    } catch (error) {
        await conn.rollback();
        console.error('Error en ModificarSala:', error);
        throw error;
    } finally {
        conn.release();
    }
}

//funcion para verificar disponibilidad de asiento
async function verificarDisponibilidadAsiento(id_asiento, id_funcion) {
    const conn = await pool.getConnection();
    try {
        const sql = `
            SELECT a.* 
            FROM asiento a
            LEFT JOIN asientoreservado ar ON a.id_asiento = ar.id_asiento
            LEFT JOIN reservacion r ON ar.id_reservacion = r.id_reservacion
            WHERE a.id_asiento = ? 
            AND r.id_funcion = ?
            AND r.estado IN ('pendiente', 'confirmada')
        `;
        const [result] = await conn.query(sql, [id_asiento, id_funcion]);
        
        // Si no hay resultado, el asiento está disponible
        return result.length === 0;
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
    verificarDisponibilidadAsiento,
    obtenerFuncionesPorSala
};
