import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ onLogin }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        contrasena: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:4000/login', formData);

            if (response.data && response.data.token) {
                onLogin(response.data);
                navigate('/');
            } else {
                setError('Error en la respuesta del servidor');
            }
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container card">
            <h2 className="text-center">Cine App</h2>

            {error && <div className="alert" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="nombre">nombre:</label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        className="form-control"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="contrasena">Contraseña:</label>
                    <input
                        type="password"
                        id="contrasena"
                        name="contrasena"
                        className="form-control"
                        value={formData.contrasena}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        disabled={loading}
                    >
                        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </button>
                </div>

                <div className="form-group">
                    <Link to="/register">
                        <button type="button" className="btn btn-success btn-block">
                            Crear Cuenta
                        </button>
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default Login;