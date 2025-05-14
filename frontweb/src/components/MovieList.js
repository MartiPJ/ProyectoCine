import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MovieList = () => {
    const [salas, setSalas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSalas = async () => {
            try {
                const response = await axios.get('http://localhost:4000/salas', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setSalas(response.data);
            } catch (err) {
                setError('Error al cargar las salas de cine');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSalas();
    }, []);

    const handleSalaClick = (salaId) => {
        navigate(`/reservation/${salaId}`);
    };

    if (loading) {
        return <div className="text-center my-4">Cargando salas...</div>;
    }

    if (error) {
        return <div className="text-center my-4" style={{ color: 'red' }}>{error}</div>;
    }

    return (
        <div className="card">
            <h2 className="text-center">Salas de Cine</h2>

            {salas.length === 0 ? (
                <p className="text-center">No hay salas disponibles.</p>
            ) : (
                <div className="grid-container">
                    {salas.map((sala) => (
                        <div
                            className="movie-card"
                            key={sala.id_sala}
                            onClick={() => handleSalaClick(sala.id_sala)}
                        >
                            <div className="movie-card-img">
                                {sala.pelicula?.imagen_poster ? (
                                    <img
                                        src={sala.pelicula.imagen_poster}
                                        alt={sala.pelicula.titulo}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <span>🎬</span>
                                )}
                            </div>
                            <div className="movie-card-body">
                                <h3 className="movie-card-title">{sala.pelicula?.titulo || 'Sin película'}</h3>
                                <p>Sala: {sala.nombre}</p>
                                <p>Asientos disponibles: {sala.capacidad_filas * sala.capacidad_columnas}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MovieList;