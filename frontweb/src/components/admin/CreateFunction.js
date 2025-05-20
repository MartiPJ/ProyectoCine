import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const apiUrl = process.env.REACT_APP_API_URL;

const CreateFunction = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        id_sala: '',
        id_pelicula: '',
        fecha: '',
        hora: ''
    });
    const [salas, setSalas] = useState([]);
    const [peliculas, setPeliculas] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.rol !== 'administrador') {
            navigate('/login');
        }

        const fetchData = async () => {
            try {
                const [resSalas, resPeliculas] = await Promise.all([
                    axios.get(`${apiUrl}/salas`),
                    axios.get(`${apiUrl}/peliculas`)
                ]);

                setSalas(resSalas.data);
                setPeliculas(resPeliculas.data);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchData();
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

        if (!formData.id_sala || !formData.id_pelicula || !formData.fecha || !formData.hora) {
            setError('Todos los campos son obligatorios');
            return;
        }

        try {
            
            const fechaFormateada = new Date(formData.fecha).toISOString().split("T")[0];
            const funcionData = {
                id_sala: parseInt(formData.id_sala),
                id_pelicula: parseInt(formData.id_pelicula),
                fecha: fechaFormateada, // ← solo YYYY-MM-DD
                hora: formData.hora.length === 5 ? `${formData.hora}:00` : formData.hora, // asegura HH:MM:SS
                

            };

            console.log('Función Data:', funcionData);
            await axios.post(`${apiUrl}/funcion`, funcionData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            setSuccess('Función creada exitosamente');
            setFormData({ id_sala: '', id_pelicula: '', fecha: '', hora: '' });

            // setTimeout(() => navigate('/admin/funciones'), 2000);
        } catch (err) {
            console.error('Error creating function:', err);
            setError(err.response?.data?.message || 'Error al crear la función');
        }
    };

    return (
        <div className="create-room-container">
            <h2>Crear Nueva Función</h2>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="id_sala">Sala:</label>
                    <select name="id_sala" value={formData.id_sala} onChange={handleChange}>
                        <option value="">Seleccione una sala</option>
                        {salas.map(sala => (
                            <option key={sala.id_sala} value={sala.id_sala}>
                                {sala.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="id_pelicula">Película:</label>
                    <select name="id_pelicula" value={formData.id_pelicula} onChange={handleChange}>
                        <option value="">Seleccione una película</option>
                        {peliculas.map(pelicula => (
                            <option key={pelicula.id_pelicula} value={pelicula.id_pelicula}>
                                {pelicula.titulo}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="fecha">Fecha:</label>
                        <input
                            type="date"
                            id="fecha"
                            name="fecha"
                            value={formData.fecha}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="hora">Hora:</label>
                        <input
                            type="time"
                            id="hora"
                            name="hora"
                            value={formData.hora}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <button type="submit" className="btn-primary">Crear Función</button>
            </form>
        </div>
    );
};

export default CreateFunction;
