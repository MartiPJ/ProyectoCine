import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ModifyRoom = () => {
    const [rooms, setRooms] = useState([]);
    const [selectedRoomId, setSelectedRoomId] = useState('');
    const [formData, setFormData] = useState({
        nombre: '',
        capacidad: '',
        descripcion: '',
        tipo: 'normal',
        estado: 'activo'
    });

    const [loading, setLoading] = useState(false);
    const [loadingRooms, setLoadingRooms] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Cargar la lista de salas al inicio
    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            setLoadingRooms(true);
            const response = await axios.get('http://localhost:4000/salas');
            setRooms(response.data.salas || []);
        } catch (err) {
            console.error('Error al cargar las salas:', err);
            setError('Error al cargar las salas. Por favor, recarga la página.');
        } finally {
            setLoadingRooms(false);
        }
    };

    // Cargar los datos de una sala específica
    const fetchRoomDetails = async (roomId) => {
        if (!roomId) return;

        try {
            setLoading(true);
            setError(null);

            // Buscamos la sala en la lista que ya tenemos
            const selectedRoom = rooms.find(room => room._id === roomId || room.id === roomId);

            if (selectedRoom) {
                setFormData({
                    nombre: selectedRoom.nombre || '',
                    capacidad: selectedRoom.capacidad || '',
                    descripcion: selectedRoom.descripcion || '',
                    tipo: selectedRoom.tipo || 'normal',
                    estado: selectedRoom.estado || 'activo'
                });
            } else {
                setError('No se encontró la sala seleccionada');
            }
        } catch (err) {
            console.error('Error al cargar los detalles de la sala:', err);
            setError('Error al cargar los detalles de la sala');
        } finally {
            setLoading(false);
        }
    };

    const handleRoomSelect = (e) => {
        const roomId = e.target.value;
        setSelectedRoomId(roomId);
        fetchRoomDetails(roomId);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validateForm = () => {
        if (!selectedRoomId) {
            setError('Debes seleccionar una sala para modificar');
            return false;
        }

        if (!formData.nombre.trim()) {
            setError('El nombre de la sala es obligatorio');
            return false;
        }

        if (!formData.capacidad || isNaN(formData.capacidad) || parseInt(formData.capacidad) <= 0) {
            setError('La capacidad debe ser un número mayor a 0');
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

            // Preparar los datos para enviar al servidor
            const roomData = {
                ...formData,
                capacidad: parseInt(formData.capacidad)
            };

            // Hacer la petición al endpoint
            const response = await axios.put(`http://localhost:4000/sala/${selectedRoomId}`, roomData);

            setSuccess(true);

            // Actualizar la lista de salas
            await fetchRooms();

            console.log('Sala modificada:', response.data);
        } catch (err) {
            console.error('Error al modificar la sala:', err);
            setError(err.response?.data?.mensaje || 'Error al modificar la sala. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h2 className="text-center mb-4">Modificar Sala</h2>

            {error && (
                <div className="alert alert-error">
                    <p>{error}</p>
                </div>
            )}

            {success && (
                <div className="alert alert-success">
                    <p>¡La sala ha sido modificada exitosamente!</p>
                </div>
            )}

            <div className="form-container mb-4">
                <div className="form-group">
                    <label htmlFor="roomSelect" className="form-label">Seleccionar Sala</label>
                    {loadingRooms ? (
                        <p>Cargando salas...</p>
                    ) : (
                        <select
                            id="roomSelect"
                            value={selectedRoomId}
                            onChange={handleRoomSelect}
                            className="form-select"
                            disabled={loading}
                        >
                            <option value="">-- Selecciona una sala --</option>
                            {rooms.map(room => (
                                <option key={room._id || room.id} value={room._id || room.id}>
                                    {room.nombre} ({room.estado})
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            {selectedRoomId && (
                <form onSubmit={handleSubmit} className="form-container">
                    <div className="form-group">
                        <label htmlFor="nombre" className="form-label">Nombre de la Sala</label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Ej: Sala 1"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="capacidad" className="form-label">Capacidad (número de asientos)</label>
                        <input
                            type="number"
                            id="capacidad"
                            name="capacidad"
                            value={formData.capacidad}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Ej: 100"
                            min="1"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="descripcion" className="form-label">Descripción</label>
                        <textarea
                            id="descripcion"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            className="form-textarea"
                            placeholder="Describe las características de la sala..."
                            rows="3"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="tipo" className="form-label">Tipo de Sala</label>
                        <select
                            id="tipo"
                            name="tipo"
                            value={formData.tipo}
                            onChange={handleChange}
                            className="form-select"
                            disabled={loading}
                        >
                            <option value="normal">Normal</option>
                            <option value="vip">VIP</option>
                            <option value="3d">3D</option>
                            <option value="imax">IMAX</option>
                            <option value="premium">Premium</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="estado" className="form-label">Estado</label>
                        <select
                            id="estado"
                            name="estado"
                            value={formData.estado}
                            onChange={handleChange}
                            className="form-select"
                            disabled={loading}
                        >
                            <option value="activo">Activo</option>
                            <option value="inactivo">Inactivo</option>
                            <option value="mantenimiento">En Mantenimiento</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ModifyRoom;