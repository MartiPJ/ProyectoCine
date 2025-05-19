import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ModifyFunction = () => {
    const navigate = useNavigate();
    const [funciones, setFunciones] = useState([]);
    const [selectedFuncion, setSelectedFuncion] = useState(null);
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
        // Check if user is admin
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.rol !== 'administrador') {
            navigate('/login');
        }

        // Fetch all necessary data
        const fetchData = async () => {
            try {
                const [funcionesRes, salasRes, peliculasRes] = await Promise.all([
                    axios.get('http://localhost:4000/funciones', {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }),
                    axios.get('http://localhost:4000/salas', {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }),
                    axios.get('http://localhost:4000/peliculas', {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    })
                ]);

                setFunciones(funcionesRes.data);
                setSalas(salasRes.data);
                setPeliculas(peliculasRes.data);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Error al cargar los datos necesarios');
            }
        };

        fetchData();
    }, [navigate]);

    const handleFuncionSelect = (funcionId) => {
        const funcion = funciones.find(f => f.id_funcion === parseInt(funcionId));
        if (funcion) {
            setSelectedFuncion(funcion);
            // Formatear fecha para el input date (YYYY-MM-DD)
            const fechaFormateada = funcion.fecha.split('T')[0];
            
            setFormData({
                id_sala: funcion.id_sala.toString(),
                id_pelicula: funcion.id_pelicula.toString(),
                fecha: fechaFormateada,
                hora: funcion.hora
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!selectedFuncion) {
            setError('Por favor seleccione una función para modificar');
            return;
        }

        if (!formData.id_sala || !formData.id_pelicula || !formData.fecha || !formData.hora) {
            setError('Todos los campos son obligatorios');
            return;
        }

        try {
            const fechaFormateada = new Date(formData.fecha).toISOString().split("T")[0];
            const funcionData = {
                id_funcion: selectedFuncion.id_funcion,
                id_sala: parseInt(formData.id_sala),
                id_pelicula: parseInt(formData.id_pelicula),
                fecha: fechaFormateada,
                hora: formData.hora.length === 5 ? `${formData.hora}:00` : formData.hora
            };

            await axios.put(`http://localhost:4000/funcion/${selectedFuncion.id_funcion}`, funcionData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            setSuccess('Función modificada exitosamente');

            // Refresh functions list
            const response = await axios.get('http://localhost:4000/funciones', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setFunciones(response.data);

            // Reset form after 2 seconds
            setTimeout(() => {
                setSelectedFuncion(null);
                setFormData({
                    id_sala: '',
                    id_pelicula: '',
                    fecha: '',
                    hora: ''
                });
                setSuccess('');
            }, 2000);

        } catch (err) {
            console.error('Error updating function:', err);
            setError(err.response?.data?.message || 'Error al modificar la función');
        }
    };

    return (
        <div className="modify-function-container">
            <h2>Modificar Función</h2>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="select-function-section">
                <label htmlFor="functionSelect">Seleccione una función para modificar:</label>
                <select
                    id="functionSelect"
                    value={selectedFuncion ? selectedFuncion.id_funcion : ''}
                    onChange={(e) => handleFuncionSelect(e.target.value)}
                    style={{
                        display: 'block',
                        width: '100%',
                        padding: '0.375rem 0.75rem',
                        fontSize: '1rem',
                        lineHeight: '1.5',
                        color: '#495057',
                        backgroundColor: '#fff',
                        border: '1px solid #ced4da',
                        borderRadius: '0.25rem'
                    }}
                >
                    <option value="" disabled>-- Seleccionar Función --</option>
                    {funciones.map(funcion => (
                        <option
                            key={funcion.id_funcion}
                            value={funcion.id_funcion}
                            style={{ color: '#333' }}
                        >
                            {`Función ${funcion.id_funcion} - ${funcion.fecha} ${funcion.hora}`}
                        </option>
                    ))}
                </select>
            </div>

            {selectedFuncion && (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="id_sala">Sala:</label>
                        <select 
                            name="id_sala" 
                            value={formData.id_sala} 
                            onChange={handleChange}
                        >
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
                        <select 
                            name="id_pelicula" 
                            value={formData.id_pelicula} 
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

                    <button type="submit" className="btn-primary">Guardar Cambios</button>
                </form>
            )}
        </div>
    );
};

export default ModifyFunction;