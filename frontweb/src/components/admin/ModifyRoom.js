import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ModifyRoom = () => {
    const navigate = useNavigate();
    const [salas, setSalas] = useState([]);
    const [selectedSala, setSelectedSala] = useState(null);
    const [formData, setFormData] = useState({
        nombreSala: '',
        capacidadFilas: '',
        capacidadColumnas: '',
        tituloPelicula: '',
        descripcion: '',
        imagenPoster: null
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
                nombreSala: sala.nombre_sala,
                capacidadFilas: sala.capacidad_filas,
                capacidadColumnas: sala.capacidad_columnas,
                tituloPelicula: sala.id_pelicula,
                descripcion: sala.descripcion || '',
                imagenPoster: null
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
        if (!formData.nombreSala || !formData.capacidadFilas || !formData.capacidadColumnas || !formData.tituloPelicula) {
            setError('Todos los campos son obligatorios');
            return;
        }

        try {
            const roomData = new FormData();
            roomData.append('nombreSala', formData.nombreSala);
            roomData.append('capacidadFilas', formData.capacidadFilas);
            roomData.append('capacidadColumnas', formData.capacidadColumnas);
            roomData.append('tituloPelicula', formData.tituloPelicula);
            roomData.append('descripcion', formData.descripcion);

            if (formData.imagenPoster) {
                roomData.append('imagenPoster', formData.imagenPoster);
            }

            await axios.put(`http://localhost:4000/sala/${selectedSala.id_sala}`, roomData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
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
                    nombreSala: '',
                    capacidadFilas: '',
                    capacidadColumnas: '',
                    tituloPelicula: '',
                    descripcion: '',
                    imagenPoster: null
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
                >
                    <option value="">-- Seleccionar Sala --</option>
                    {salas.map(sala => (
                        <option key={sala.id_sala} value={sala.id_sala}>
                            {sala.nombre_sala}
                        </option>
                    ))}
                </select>
            </div>

            {selectedSala && (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="nombreSala">Nombre de la Sala:</label>
                        <input
                            type="text"
                            id="nombreSala"
                            name="nombreSala"
                            value={formData.nombreSala}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="capacidadFilas">Capacidad (Filas):</label>
                            <input
                                type="number"
                                id="capacidadFilas"
                                name="capacidadFilas"
                                min="1"
                                max="20"
                                value={formData.capacidadFilas}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="capacidadColumnas">Capacidad (Columnas):</label>
                            <input
                                type="number"
                                id="capacidadColumnas"
                                name="capacidadColumnas"
                                min="1"
                                max="20"
                                value={formData.capacidadColumnas}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="tituloPelicula">Título de la Película:</label>
                        <select
                            id="tituloPelicula"
                            name="tituloPelicula"
                            value={formData.tituloPelicula}
                            onChange={handleChange}
                        >
                            <option value="">Seleccione una película</option>
                            {peliculas.map(pelicula => (
                                <option key={pelicula.id_pelicula} value={pelicula.id_pelicula}>
                                    {pelicula.titulo}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="imagenPoster">Imagen del Póster:</label>
                        <div className="file-upload-area">
                            <input
                                type="file"
                                id="imagenPoster"
                                name="imagenPoster"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            <p className="file-hint">Arrastrar imagen aquí o hacer clic</p>
                        </div>
                        {selectedSala.imagen_poster && (
                            <div className="current-poster">
                                <p>Póster actual:</p>
                                <img
                                    src={`http://localhost:4000/uploads/${selectedSala.imagen_poster}`}
                                    alt="Póster actual"
                                    style={{ maxWidth: '100px' }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="descripcion">Descripción:</label>
                        <textarea
                            id="descripcion"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="btn-primary">Guardar Cambios</button>
                </form>
            )}
        </div>
    );
};

export default ModifyRoom;
