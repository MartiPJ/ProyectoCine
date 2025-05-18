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

//funcion para ver usuarios
async function verUsuarios(req, res) {
    try {
        const usuarios = await userModel.verUsuarios();
        res.status(200).json(usuarios);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los usuarios', details: err.message });
    }
}

//función para registrar una sala
// controllers/authController.js (modificar la función registrarSala)

async function registrarSala(req, res) {
    try {
        let { nombre, capacidad_filas, capacidad_columnas } = req.body;

        if (!nombre || !capacidad_filas || !capacidad_columnas) {
            return res.status(400).json({ error: 'Faltan datos requeridos' });
        }

        // Convertir a enteros
        capacidad_filas = parseInt(capacidad_filas, 10);
        capacidad_columnas = parseInt(capacidad_columnas, 10);

        // Validar que sí son números válidos
        if (isNaN(capacidad_filas) || isNaN(capacidad_columnas)) {
            return res.status(400).json({ error: 'Capacidades deben ser números válidos' });
        }

        // Validar que no sean números negativos
        if (capacidad_filas <= 0 || capacidad_columnas <= 0) {
            return res.status(400).json({ error: 'Las capacidades deben ser mayores a cero' });
        }

        const id = await userModel.crearSala({ nombre, capacidad_filas, capacidad_columnas });

        res.status(201).json({ 
            message: 'Sala creada con asientos generados automáticamente', 
            id,
            total_asientos: capacidad_filas * capacidad_columnas
        });
    } catch (err) {
        res.status(500).json({ 
            error: 'Error al crear la sala y generar asientos', 
            details: err.message 
        });
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
        const { id_sala } = req.params;
        let salas;

        if (id_sala) {
            salas = await userModel.verSalaPorId(id_sala);

            if (!salas || salas.length === 0) {
                return res.status(404).json({ error: 'Sala no encontrada' });
            }
        } else {
            salas = await userModel.verTodasLasSalas();
        }

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

//funcion para ver reservaciones
async function verReservaciones(req, res) {
    try {
        const { id_reservacion } = req.params;
        let reservacion;

        if (id_reservacion) {
            reservacion = await userModel.verReservacionPorId(id_reservacion);

            if (!reservacion || reservacion.length === 0) {
                return res.status(404).json({ error: 'No se encontraron reservaciones para la sala indicada' });
            }
        } else {
            reservacion = await userModel.verTodasLasReservaciones();
        }

        res.status(200).json(reservacion);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener las reservaciones', details: err.message });
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

//funcion para ver peliculas
async function verPeliculas(req, res) {
    try {
        const peliculas = await userModel.verPeliculas();
        res.status(200).json(peliculas);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener las peliculas', details: err.message });
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

//funcion para ver funciones
async function verFunciones(req, res) {
    try {
        const { id_funcion } = req.params;
        let funciones;

        if (id_funcion) {
            funciones = await userModel.verFuncionPorId(id_funcion);

            if (!funciones || funciones.length === 0) {
                return res.status(404).json({ error: 'Función no encontrada' });
            }
        } else {
            funciones = await userModel.verTodasLasFunciones();
        }

        res.status(200).json(funciones);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener las funciones', details: err.message });
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

//funcion para ver asientos
async function verAsientos(req, res) {
    try {
        const { id_sala } = req.params;
        let asientos;

        if (id_sala) {
            asientos = await userModel.verAsientosPorSala(id_sala);

            if (!asientos || asientos.length === 0) {
                return res.status(404).json({ error: 'No se encontraron asientos para la sala indicada' });
            }
        } else {
            asientos = await userModel.verTodosLosAsientos();
        }

        res.status(200).json(asientos);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los asientos', details: err.message });
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

//funcion para ver asientos reservados
async function verAsientosReservados(req, res) {
    try {
        const { id_reservacion } = req.params;
        let asientos;

        if (id_reservacion) {
            asientos = await userModel.verAsientosReservadosPorId(id_reservacion);

            if (!asientos || asientos.length === 0) {
                return res.status(404).json({ error: 'No se encontraron asientos reservados para la sala indicada' });
            }
        } else {
            asientos = await userModel.verAsientosReservados();
        }

        res.status(200).json(asientos);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los asientos reservados', details: err.message });
    }
}

// Verificar disponibilidad de un asiento específico
async function verificarDisponibilidadAsiento(req, res) {
    try {
        const { id_asiento, id_funcion } = req.params;
        
        if (!id_asiento || !id_funcion) {
            return res.status(400).json({ error: 'Se requieren id_asiento e id_funcion' });
        }
        
        const disponible = await userModel.verificarDisponibilidadAsiento(id_asiento, id_funcion);
        
        res.status(200).json({ 
            id_asiento,
            id_funcion,
            disponible 
        });
    } catch (err) {
        res.status(500).json({ 
            error: 'Error al verificar disponibilidad del asiento', 
            details: err.message 
        });
    }
}

//funcion para obtener funciones de una sala especifica
async function verFuncionesPorSala(req, res) {
    try {
        const { id_sala } = req.params;
        const funciones = await userModel.obtenerFuncionesPorSala(id_sala);

        if (!funciones || funciones.length === 0) {
            return res.status(404).json({ error: 'No se encontraron funciones para la sala indicada' });
        }

        res.status(200).json(funciones);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener las funciones', details: err.message });
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
    verUsuarios,
    loginUsuario,
    registrarSala,
    modificarSala,
    verSalas,
    reservarSala,
    verReservaciones,
    ingresarPelicula,
    verPeliculas,
    ingresarFuncion,
    verFunciones,
    ingresarAsiento,
    verAsientos,
    ingresarAsientoReservado,
    verAsientosReservados,
    verificarDisponibilidadAsiento,
    verFuncionesPorSala
};
