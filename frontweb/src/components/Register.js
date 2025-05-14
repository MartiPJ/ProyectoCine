import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        usuario: '',
        contrasena: '',
        correo: '',
        telefono: ''
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
            // By default, create users as regular clients
            await axios.post('http://localhost:4000/usuarios', {
                ...formData,
                rol: 'usuario'  // Default role is regular user
            });

            alert('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Error al crear la cuenta');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container card">
            <h2 className="text-center">Crear Nueva Cuenta</h2>

            {error && <div className="alert" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="nombre">Nombre:</label>
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
                    <label htmlFor="usuario">Usuario:</label>
                    <input
                        type="text"
                        id="usuario"
                        name="usuario"
                        className="form-control"
                        value={formData.usuario}
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
                    <label htmlFor="correo">Correo:</label>
                    <input
                        type="email"
                        id="correo"
                        name="correo"
                        className="form-control"
                        value={formData.correo}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="telefono">Teléfono:</label>
                    <input
                        type="tel"
                        id="telefono"
                        name="telefono"
                        className="form-control"
                        value={formData.telefono}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <button
                        type="submit"
                        className="btn btn-success btn-block"
                        disabled={loading}
                    >
                        {loading ? 'Creando cuenta...' : 'Registrarme'}
                    </button>
                </div>

                <div className="form-group text-center">
                    <Link to="/login">¿Ya tienes una cuenta? Inicia sesión</Link>
                </div>
            </form>
        </div>
    );
};

export default Register;