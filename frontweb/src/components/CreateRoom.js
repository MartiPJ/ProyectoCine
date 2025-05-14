import React, { useState } from 'react';
import axios from 'axios';

const CreateRoom = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        capacidad: '',
        descripcion: '',
        tipo: 'normal', // 'normal', 'vip', '3d', etc.
        estado: 'activo' // 'activo', 'inactivo', 'mantenimiento'
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validateForm = () => {
        if (!formData.nombre.trim()) {
            setError('El nombre de la sala es obligatorio');
            return false;
        }

        if (!formData.capacidad || isNaN(formData.capacidad) || parseInt(formData.capacidad) <= 0) {
            setError('La capacidad debe ser un número mayor a 0');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            // Preparar los datos para enviar al servidor
            const roomData = {
                ...formData,
                capacidad: parseInt(formData.capacidad)
            };

            // Hacer la petición al endpoint
            const response = await axios.post('http://localhost:4000/sala', roomData);

            setSuccess(true);
            setFormData({
                nombre: '',
                capacidad: '',
                descripcion: '',
                tipo: 'normal',
                estado: 'activo'
            });

            console.log('Sala creada:', response.data);
        } catch (err) {
            console.error('Error al crear la sala:', err);
            setError(err.response?.data?.mensaje || 'Error al crear la sala. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h2 className="text-center mb-4">Crear Nueva Sala</h2>

            {error && (
                <div className="alert alert-error">
                    <p>{error}</p>
                </div>
            )}

            {success && (
                <div className="alert alert-success">
                    <p>¡La sala ha sido creada exitosamente!</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-group">
                    <label htmlFor="nombre" className="form-label">Nombre de la Sala</label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Ej: Sala 1"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="capacidad" className="form-label">Capacidad (número de asientos)</label>
                    <input
                        type="number"
                        id="capacidad"
                        name="capacidad"
                        value={formData.capacidad}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Ej: 100"
                        min="1"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="descripcion" className="form-label">Descripción</label>
                    <textarea
                        id="descripcion"
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        className="form-textarea"
                        placeholder="Describe las características de la sala..."
                        rows="3"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="tipo" className="form-label">Tipo de Sala</label>
                    <select
                        id="tipo"
                        name="tipo"
                        value={formData.tipo}
                        onChange={handleChange}
                        className="form-select"
                    >
                        <option value="normal">Normal</option>
                        <option value="vip">VIP</option>
                        <option value="3d">3D</option>
                        <option value="imax">IMAX</option>
                        <option value="premium">Premium</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="estado" className="form-label">Estado</label>
                    <select
                        id="estado"
                        name="estado"
                        value={formData.estado}
                        onChange={handleChange}
                        className="form-select"
                    >
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                        <option value="mantenimiento">En Mantenimiento</option>
                    </select>
                </div>

                <div className="form-group">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Creando...' : 'Crear Sala'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateRoom;