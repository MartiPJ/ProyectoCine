import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const apiUrl = process.env.REACT_APP_API_URL;

const CreateRoom = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        capacidad_filas: '',
        capacidad_columnas: ''
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

        // Fetch available movies
        const fetchPeliculas = async () => {
            try {
                const response = await axios.get(`${apiUrl}/peliculas`);
                setPeliculas(response.data);
            } catch (err) {
                console.error('Error fetching movies:', err);
            }
        };

        fetchPeliculas();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.nombre || !formData.capacidad_filas || !formData.capacidad_columnas) {
            setError('Todos los campos son obligatorios');
            return;
        }

        try {
            const roomData = {
                nombre: formData.nombre,
                capacidad_filas: parseInt(formData.capacidad_filas, 10),
                capacidad_columnas: parseInt(formData.capacidad_columnas, 10),
            };

            await axios.post(`${apiUrl}/sala`, roomData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });



            setSuccess('Sala creada exitosamente');
            setFormData({
                nombre: '',
                capacidad_filas: '',
                capacidad_columnas: ''
            });

            setTimeout(() => navigate('/admin/salas'), 2000);

        } catch (err) {
            console.error('Error creating room:', err);
            setError(err.response?.data?.message || 'Error al crear la sala');
        }
    };


    return (
        <div className="create-room-container">
            <h2>Crear Nueva Sala</h2>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

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

                

                <button type="submit" className="btn-primary">Crear Sala</button>
            </form>
        </div>
    );
};

export default CreateRoom;
