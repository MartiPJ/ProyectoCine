import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MovieList = () => {
    const [salas, setSalas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedSala, setSelectedSala] = useState(null);
    const [funciones, setFunciones] = useState([]);
    const [showFuncionesModal, setShowFuncionesModal] = useState(false);
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

    const handleSalaClick = async (salaId) => {
        try {
            setLoading(true);
            // Obtener las funciones para esta sala usando el nuevo endpoint
            const response = await axios.get(`http://localhost:4000/funciones/sala/${salaId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            setFunciones(response.data);
            setSelectedSala(salaId);
            setShowFuncionesModal(true);
        } catch (error) {
            console.error("Error al obtener funciones:", error);
            setError("Error al cargar las funciones");
        } finally {
            setLoading(false);
        }
    };

    const handleFuncionSelect = (funcionId) => {
        setShowFuncionesModal(false);
        // Asegúrate de que esto coincida con la ruta definida en App.js
        navigate(`/reservaciones/${selectedSala}/${funcionId}`);
    };

    if (loading) {
        return <div className="text-center my-4">Cargando...</div>;
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
                            <div className="movie-card-body">
                                <h3 className="movie-card-title">Sala: {sala.nombre}</h3>
                                <p>Capacidad: {sala.capacidad_filas * sala.capacidad_columnas} asientos</p>
                                <button className="btn">Ver funciones</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal para seleccionar función */}
            {showFuncionesModal && (
                <div className="modal show">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowFuncionesModal(false)}>&times;</span>
                        <h2>Selecciona una función</h2>
                        
                        {funciones.length === 0 ? (
                            <p>No hay funciones disponibles para esta sala</p>
                        ) : (
                            <div className="funciones-list">
                                {funciones.map(funcion => (
                                    <div 
                                        key={funcion.id_funcion} 
                                        className="funcion-item"
                                        onClick={() => handleFuncionSelect(funcion.id_funcion)}
                                    >
                                        <h3>{funcion.titulo_pelicula}</h3>
                                        <p>Fecha: {new Date(funcion.fecha).toLocaleDateString()}</p>
                                        <p>Hora: {funcion.hora}</p>
                                        <p>Precio: ${funcion.precio}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieList;