import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SeatReservation = () => {
    const [salas, setSalas] = useState([]);
    const [funciones, setFunciones] = useState([]);
    const [asientos, setAsientos] = useState([]);
    const [selectedSala, setSelectedSala] = useState('');
    const [selectedFuncion, setSelectedFuncion] = useState('');
    const [selectedAsientos, setSelectedAsientos] = useState([]);
    const [reservedSeats, setReservedSeats] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Información del cliente para la reserva
    const [clientData, setClientData] = useState({
        nombre: '',
        email: '',
        telefono: ''
    });

    // Obtener las salas al cargar el componente
    useEffect(() => {
        fetchSalas();
    }, []);

    // Obtener funciones cuando se selecciona una sala
    useEffect(() => {
        if (selectedSala) {
            fetchFunciones();
        } else {
            setFunciones([]);
        }
    }, [selectedSala]);

    // Obtener asientos cuando se selecciona una función
    useEffect(() => {
        if (selectedFuncion) {
            fetchAsientos();
            fetchReservedSeats();
        } else {
            setAsientos([]);
            setReservedSeats([]);
        }
    }, [selectedFuncion]);

    const fetchSalas = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:4000/salas');
            setSalas(response.data.salas || []);
            setLoading(false);
        } catch (err) {
            console.error('Error al cargar las salas:', err);
            setError('Error al cargar las salas disponibles');
            setLoading(false);
        }
    };

    const fetchFunciones = async () => {
        try {
            setLoading(true);
            // Este endpoint es hipotético, ajústalo según tu API
            const response = await axios.get(`http://localhost:4000/funciones?salaId=${selectedSala}`);
            setFunciones(response.data.funciones || []);
            setLoading(false);
        } catch (err) {
            console.error('Error al cargar las funciones:', err);
            setError('Error al cargar las funciones disponibles');
            setLoading(false);
        }
    };

    const fetchAsientos = async () => {
        try {
            setLoading(true);
            // Este endpoint es hipotético, ajústalo según tu API
            const response = await axios.get(`http://localhost:4000/asientos?funcionId=${selectedFuncion}`);
            setAsientos(response.data.asientos || []);
            setLoading(false);
        } catch (err) {
            console.error('Error al cargar los asientos:', err);
            setError('Error al cargar los asientos disponibles');
            setLoading(false);
        }
    };

    const fetchReservedSeats = async () => {
        try {
            // Este endpoint es hipotético, ajústalo según tu API
            const response = await axios.get(`http://localhost:4000/asientosReservados?funcionId=${selectedFuncion}`);
            setReservedSeats(response.data.asientosReservados?.map(a => a.asientoId) || []);
        } catch (err) {
            console.error('Error al cargar los asientos reservados:', err);
        }
    };

    const handleSalaChange = (e) => {
        setSelectedSala(e.target.value);
        setSelectedFuncion('');
        setSelectedAsientos([]);
    };

    const handleFuncionChange = (e) => {
        setSelectedFuncion(e.target.value);
        setSelectedAsientos([]);
    };

    const handleAsientoClick = (asientoId) => {
        // Verificar si el asiento ya está reservado
        if (reservedSeats.includes(asientoId)) {
            return;
        }

        setSelectedAsientos(prev => {
            // Si ya está seleccionado, lo quitamos
            if (prev.includes(asientoId)) {
                return prev.filter(id => id !== asientoId);
            }
            // Si no, lo añadimos
            return [...prev, asientoId];
        });
    };

    const handleClientDataChange = (e) => {
        const { name, value } = e.target;
        setClientData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!selectedSala) {
            setError('Debes seleccionar una sala');
            return false;
        }

        if (!selectedFuncion) {
            setError('Debes seleccionar una función');
            return false;
        }

        if (selectedAsientos.length === 0) {
            setError('Debes seleccionar al menos un asiento');
            return false;
        }

        if (!clientData.nombre.trim()) {
            setError('El nombre es obligatorio');
            return false;
        }

        if (!clientData.email.trim()) {
            setError('El email es obligatorio');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(clientData.email)) {
            setError('El formato del email no es válido');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            // Preparar los datos para la reserva
            const reservaData = {
                funcionId: selectedFuncion,
                asientos: selectedAsientos,
                cliente: clientData
            };

            // Enviar la solicitud de reserva
            await axios.post('http://localhost:4000/reservarSala', reservaData);

            setSuccess(true);
            setSelectedAsientos([]);
            setClientData({
                nombre: '',
                email: '',
                telefono: ''
            });

            // Actualizar los asientos reservados
            fetchReservedSeats();

        } catch (err) {
            console.error('Error al realizar la reserva:', err);
            setError(err.response?.data?.mensaje || 'Error al realizar la reserva. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    // Renderizar la cuadrícula de asientos según la configuración de la sala
    const renderSeats = () => {
        if (!asientos.length) return null;

        // Determinar el número de filas y columnas para la sala
        const filas = Math.max(...asientos.map(a => a.fila)) || 0;
        const columnas = Math.max(...asientos.map(a => a.columna)) || 0;

        // Crear una matriz para la representación visual
        const seatMap = Array(filas).fill().map(() => Array(columnas).fill(null));

        // Llenar la matriz con los IDs de los asientos
        asientos.forEach(asiento => {
            if (asiento.fila > 0 && asiento.columna > 0) {
                seatMap[asiento.fila - 1][asiento.columna - 1] = asiento;
            }
        });

        return (
            <div className="seat-container" style={{ gridTemplateColumns: `repeat(${columnas}, 1fr)` }}>
                {seatMap.flat().map((asiento, index) => {
                    if (!asiento) return <div key={`empty-${index}`} style={{ width: '40px', height: '40px' }}></div>;

                    const isReserved = reservedSeats.includes(asiento._id);
                    const isSelected = selectedAsientos.includes(asiento._id);

                    let seatClass = 'seat ';
                    if (isReserved) seatClass += 'seat-reserved';
                    else if (isSelected) seatClass += 'seat-selected';
                    else seatClass += 'seat-available';

                    return (
                        <div
                            key={asiento._id}
                            className={seatClass}
                            onClick={() => handleAsientoClick(asiento._id)}
                            title={`Fila ${asiento.fila}, Columna ${asiento.columna}`}
                        >
                            {asiento.numero || `${asiento.fila}-${asiento.columna}`}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="container">
            <h2 className="text-center mb-4">Reserva de Asientos</h2>

            {error && (
                <div className="alert alert-error">
                    <p>{error}</p>
                </div>
            )}

            {success && (
                <div className="alert alert-success">
                    <p>¡Tu reserva ha sido realizada exitosamente!</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-group">
                    <label htmlFor="sala" className="form-label">Seleccionar Sala</label>
                    <select
                        id="sala"
                        value={selectedSala}
                        onChange={handleSalaChange}
                        className="form-select"
                        disabled={loading}
                    >
                        <option value="">-- Selecciona una sala --</option>
                        {salas.map(sala => (
                            <option key={sala._id} value={sala._id}>
                                {sala.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedSala && (
                    <div className="form-group">
                        <label htmlFor="funcion" className="form-label">Seleccionar Función</label>
                        <select
                            id="funcion"
                            value={selectedFuncion}
                            onChange={handleFuncionChange}
                            className="form-select"
                            disabled={loading || !funciones.length}
                        >
                            <option value="">-- Selecciona una función --</option>
                            {funciones.map(funcion => (
                                <option key={funcion._id} value={funcion._id}>
                                    {funcion.pelicula?.titulo || 'Película'} - {new Date(funcion.fecha).toLocaleDateString()} {funcion.hora}
                                </option>
                            ))}
                        </select>
                        {funciones.length === 0 && selectedSala && !loading && (
                            <p className="mt-2 text-gray-dark">No hay funciones disponibles para esta sala</p>
                        )}
                    </div>
                )}

                {selectedFuncion && (
                    <>
                        <div className="form-group">
                            <label className="form-label">Selecciona tus asientos:</label>
                            <p className="mb-2">
                                <span className="mr-3">
                                    <span className="seat seat-available" style={{ display: 'inline-block', width: '20px', height: '20px', marginRight: '5px' }}></span>
                                    Disponible
                                </span>
                                <span className="mr-3">
                                    <span className="seat seat-selected" style={{ display: 'inline-block', width: '20px', height: '20px', marginRight: '5px' }}></span>
                                    Seleccionado
                                </span>
                                <span>
                                    <span className="seat seat-reserved" style={{ display: 'inline-block', width: '20px', height: '20px', marginRight: '5px' }}></span>
                                    Reservado
                                </span>
                            </p>

                            <div className="mb-4">
                                <div className="text-center mb-3 p-2" style={{ backgroundColor: '#333', color: 'white', borderRadius: '4px' }}>
                                    PANTALLA
                                </div>
                                {renderSeats()}
                            </div>

                            {selectedAsientos.length > 0 && (
                                <p>Asientos seleccionados: {selectedAsientos.length}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <h4 className="mb-3">Información del Cliente</h4>
                            <div className="form-group">
                                <label htmlFor="nombre" className="form-label">Nombre completo</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    value={clientData.nombre}
                                    onChange={handleClientDataChange}
                                    className="form-input"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={clientData.email}
                                    onChange={handleClientDataChange}
                                    className="form-input"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="telefono" className="form-label">Teléfono (opcional)</label>
                                <input
                                    type="tel"
                                    id="telefono"
                                    name="telefono"
                                    value={clientData.telefono}
                                    onChange={handleClientDataChange}
                                    className="form-input"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading || selectedAsientos.length === 0}
                            >
                                {loading ? 'Procesando...' : 'Confirmar Reserva'}
                            </button>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
};

export default SeatReservation;