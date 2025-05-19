import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const SeatReservation = () => {
    const { salaId, funcionId } = useParams();
    const navigate = useNavigate();
    const [sala, setSala] = useState(null);
    const [funcion, setFuncion] = useState(null);
    const [asientos, setAsientos] = useState([]);
    const [asientosReservados, setAsientosReservados] = useState([]);
    const [selectedAsientos, setSelectedAsientos] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                console.log("funcionId:", funcionId);
                console.log("Salaid:", salaId);
                // Fetch sala details
                const salaResponse = await axios.get(`http://localhost:4000/salas/${salaId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setSala(salaResponse.data);

                
                // Fetch function details
                const funcionResponse = await axios.get(`http://localhost:4000/funciones/${funcionId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setFuncion(funcionResponse.data);

                // Fetch seats for this room
                const asientosResponse = await axios.get(`http://localhost:4000/asientos/${salaId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setAsientos(asientosResponse.data);

                // Fetch reserved seats for this function
                const reservadosResponse = await axios.get(`http://localhost:4000/asientosReservados/${funcionId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setAsientosReservados(reservadosResponse.data);

                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Error cargando la información. Por favor intente de nuevo.');
                setLoading(false);
            }
        };

        fetchData();
    }, [salaId, funcionId, navigate]);

    // Check if a seat is reserved
    const isReserved = (asientoId) => {
        return asientosReservados.some(reservado => reservado.id_asiento === asientoId);
    };

    // Toggle seat selection
    const toggleSeatSelection = (asientoId) => {
        if (isReserved(asientoId)) {
            return; // Can't select reserved seats
        }

        setSelectedAsientos(prevSelected => {
            if (prevSelected.includes(asientoId)) {
                return prevSelected.filter(id => id !== asientoId);
            } else {
                return [...prevSelected, asientoId];
            }
        });
    };

    // Handle reservation submission
    const handleReservation = async () => {
        if (selectedAsientos.length === 0) {
            setError('Por favor seleccione al menos un asiento');
            return;
        }

        try {
            const userData = JSON.parse(localStorage.getItem('user'));
            const token = userData.token;

            // Decodificar el token para obtener el ID
            const payload = JSON.parse(atob(token.split('.')[1]));
            const userId = payload.id;

            const reservationData = {
                id_usuario: Number(userId),
                id_sala: Number(salaId),
                id_funcion: Number(funcionId),
                estado: 'confirmado',
                fecha: new Date().toISOString().replace('T', ' ').slice(0, 19)
            };

            console.log("Datos a enviar:", reservationData);

            const reservationResponse = await axios.post(
                'http://localhost:4000/reservarSala',
                reservationData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log("Respuesta de reservarSala:", reservationResponse.data);
            const reservationId = reservationResponse.data.id; // Cambia id_reservacion por id

            // Reserva cada asiento seleccionado (corregido: dentro del bucle)
            for (const asientoId of selectedAsientos) {
                await axios.post(
                    'http://localhost:4000/asientoReservado',
                    {
                        id_reservacion: Number(reservationId),  // Usa el nombre exacto que espera el backend
                        id_asiento: Number(asientoId)           // Asegúrate que sea número
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'  // Añade esto si no está
                        }
                    }
                );
            }

            setSuccess('¡Reserva realizada con éxito!');
            setSelectedAsientos([]);

            // Refresh reserved seats list
            const reservadosResponse = await axios.get(
                `http://localhost:4000/asientosReservados/${funcionId}`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setAsientosReservados(reservadosResponse.data);

            // setTimeout(() => {
            //     navigate('/reserva-confirmada');
            // }, 2000);

        } catch (err) {
            console.error('Error making reservation:', err);
            setError(err.response?.data?.message || 'Error al realizar la reserva');
        }
    };

    if (loading) {
        return <div className="loading">Cargando...</div>;
    }

    if (!sala || !funcion) {
        return <div className="error">No se encontró la información de la sala o función</div>;
    }

    // Crear una cuadrícula de asientos según las dimensiones de la sala
    const renderSeats = () => {
        const rows = [];

        for (let fila = 1; fila <= sala.capacidad_filas; fila++) {
            const rowSeats = [];

            for (let columna = 1; columna <= sala.capacidad_columnas; columna++) {
                // Encuentra el asiento en el  asientos array
                const asiento = asientos.find(a => a.fila === fila && a.columna === columna);

                if (asiento) {
                    const isReservedSeat = isReserved(asiento.id_asiento);
                    const isSelected = selectedAsientos.includes(asiento.id_asiento);

                    rowSeats.push(
                        <div
                            key={`${fila}-${columna}`}
                            className={`seat ${isReservedSeat ? 'reserved' : ''} ${isSelected ? 'selected' : ''}`}
                            onClick={() => toggleSeatSelection(asiento.id_asiento)}
                        />
                    );
                } else {
                    // Marcador de posición para asientos que no están en la base de datos
                    rowSeats.push(
                        <div key={`${fila}-${columna}`} className="seat seat-placeholder seat-available" />
                    );
                }
            }

            rows.push(
                <div key={`row-${fila}`} className="seats-row">
                    {rowSeats}
                </div>
            );
        }

        return rows;
    };

    return (
        <div className="seat-reservation-container">
            <div className="movie-details">
                <div className="movie-poster">
                    {sala.imagen_poster && (
                        <img
                            src={`http://localhost:4000/uploads/${sala.imagen_poster}`}
                            alt="Poster"
                        />
                    )}
                </div>
                <div className="movie-info">
                    <h2>{funcion.titulo_pelicula}</h2>
                    <p>Sala: {sala.nombre}</p>
                    <p>Fecha: {new Date(funcion.fecha).toLocaleDateString()}</p>
                    <p>Hora: {funcion.hora}</p>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="seat-selection-container">
                <div className="screen">PANTALLA</div>

                <div className="seats-container">
                    {renderSeats()}
                </div>

                <div className="seats-legend">
                    <div className="legend-item">
                        <div className="seat seat-available"></div>
                        <span>Disponible</span>
                    </div>
                    <div className="legend-item">
                        <div className="seat selected"></div>
                        <span>Seleccionado</span>
                    </div>
                    <div className="legend-item">
                        <div className="seat reserved"></div>
                        <span>Reservado</span>
                    </div>
                </div>

                <div className="selected-seats-summary">
                    <p>Asientos seleccionados: {selectedAsientos.length}</p>
                    <p>Total: ${(selectedAsientos.length * funcion.precio).toFixed(2)}</p>

                    <button
                        className="btn-primary"
                        onClick={handleReservation}
                        disabled={selectedAsientos.length === 0}
                    >
                        Confirmar Reserva
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SeatReservation;
