import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateMovie = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        titulo: '',
        imagen_poster: false,
        descripcion: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.rol !== 'administrador') {
            navigate('/login');
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.titulo || !formData.descripcion) {
            setError('El título y la descripción son obligatorios');
            return;
        }

        try {
            const movieData = {
                titulo: formData.titulo,
                imagen_poster: formData.imagen_poster ? 1 : 0,
                descripcion: formData.descripcion
            };

            console.log('Movie Data:', movieData);
            await axios.post('http://localhost:4000/pelicula', movieData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            setSuccess('Película creada exitosamente');
            setFormData({ titulo: '', imagen_poster: false, descripcion: '' });
            
            // setTimeout(() => navigate('/admin/movies'), 2000);
        } catch (err) {
            console.error('Error creating movie:', err);
            setError(err.response?.data?.message || 'Error al crear la película');
        }
    };

    return (
        <div className="create-movie-container">
            <h2>Crear Nueva Película</h2>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="titulo">Título:</label>
                    <input
                        type="text"
                        id="titulo"
                        name="titulo"
                        value={formData.titulo}
                        onChange={handleChange}
                        placeholder="Ingrese el título de la película"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="descripcion">Descripción:</label>
                    <textarea
                        id="descripcion"
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        placeholder="Ingrese la descripción de la película"
                        rows={4}
                    />
                </div>

                <div className="form-group checkbox-group">
                    <input
                        type="checkbox"
                        id="imagen_poster"
                        name="imagen_poster"
                        checked={formData.imagen_poster}
                        onChange={handleChange}
                    />
                    <label htmlFor="imagen_poster">¿Tiene imagen de póster?</label>
                </div>

                <button type="submit" className="btn-primary">Crear Película</button>
            </form>
        </div>
    );
};

export default CreateMovie;