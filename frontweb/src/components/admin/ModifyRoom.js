import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ModifyRoom = () => {
    const navigate = useNavigate();
    const [salas, setSalas] = useState([]);
    const [selectedSala, setSelectedSala] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        capacidad_filas: '',
        capacidad_columnas: '',
    });
    const [peliculas, setPeliculas] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // Check if user is admin
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.rol !== 'administrador') {
            navigate('/login');
        }

        // Fetch rooms
        const fetchSalas = async () => {
            try {
                const response = await axios.get('http://localhost:4000/salas', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setSalas(response.data);
            } catch (err) {
                console.error('Error fetching rooms:', err);
            }
        };

        // Fetch movies
        const fetchPeliculas = async () => {
            try {
                const response = await axios.get('http://localhost:4000/peliculas', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setPeliculas(response.data);
            } catch (err) {
                console.error('Error fetching movies:', err);
            }
        };

        fetchSalas();
        fetchPeliculas();
    }, [navigate]);

    const handleSalaSelect = (salaId) => {
        const sala = salas.find(s => s.id_sala === parseInt(salaId));
        if (sala) {
            setSelectedSala(sala);
            setFormData({
                nombre: sala.nombre_sala,
                capacidad_filas: sala.capacidad_filas,
                capacidad_columnas: sala.capacidad_columnas,
                
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            imagenPoster: e.target.files[0]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedSala) {
            setError('Por favor seleccione una sala para modificar');
            return;
        }

        // Form validation
        if (!formData.nombre || !formData.capacidad_filas || !formData.capacidad_columnas) {
            setError('Todos los campos son obligatorios');
            return;
        }

        try {
            await axios.put(`http://localhost:4000/sala/${selectedSala.id_sala}`, {
                nombre: formData.nombre,
                capacidad_filas: formData.capacidad_filas,
                capacidad_columnas: formData.capacidad_columnas
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });


            setSuccess('Sala modificada exitosamente');

            // Refresh rooms list
            const response = await axios.get('http://localhost:4000/salas', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setSalas(response.data);

            // Reset form after 2 seconds
            setTimeout(() => {
                setSelectedSala(null);
                setFormData({
                    nombre: '',
                    capacidad_filas: '',
                    capacidad_columnas: '',
                    
                });
                setSuccess('');
            }, 2000);

        } catch (err) {
            console.error('Error modifying room:', err);
            setError(err.response?.data?.message || 'Error al modificar la sala');
        }
    };

    return (
        <div className="modify-room-container">
            <h2>Modificar Sala</h2>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="select-room-section">
                <label htmlFor="roomSelect">Seleccione una sala para modificar:</label>
                <select
                    id="roomSelect"
                    value={selectedSala ? selectedSala.id_sala : ''}
                    onChange={(e) => handleSalaSelect(e.target.value)}
                    className="form-control" // Clase Bootstrap o similar
                    style={{
                        display: 'block',
                        width: '100%',
                        padding: '0.375rem 0.75rem',
                        fontSize: '1rem',
                        lineHeight: '1.5',
                        color: '#495057', // Color de texto oscuro
                        backgroundColor: '#fff', // Fondo blanco
                        border: '1px solid #ced4da',
                        borderRadius: '0.25rem'
                    }}
                >
                    <option value="" disabled>-- Seleccionar Sala --</option>
                    {salas.map(sala => (
                        <option
                            key={sala.id_sala}
                            value={sala.id_sala}
                            style={{ color: '#333' }} // Color de texto explícito
                        >
                            {sala.nombre || `Sala ${sala.id_sala}`} 
                        </option>
                    ))}
                </select>
            </div>

            {selectedSala && (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre de la Sala:</label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="capacidad_filas">Capacidad (Filas):</label>
                            <input
                                type="number"
                                id="capacidad_filas"
                                name="capacidad_filas"
                                min="1"
                                max="20"
                                value={formData.capacidad_filas}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="capacidad_columnas">Capacidad (Columnas):</label>
                            <input
                                type="number"
                                id="capacidad_columnas"
                                name="capacidad_columnas"
                                min="1"
                                max="20"
                                value={formData.capacidad_columnas}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary">Guardar Cambios</button>
                </form>
            )}
        </div>
    );
};

export default ModifyRoom;
