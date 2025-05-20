import React, { useState, useEffect } from 'react';
import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
    nombre: '',    
    contrasena: '',
    correo: '',
    telefono: '',
    rol: 'usuario'    
});


    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            // Este endpoint es hipotético, ajústalo según tu API
            const response = await axios.get(`${apiUrl}/usuarios`);
            setUsers(response.data || []);

        } catch (err) {
            console.error('Error al cargar usuarios:', err);
            setError('Error al cargar la lista de usuarios');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const resetForm = () => {
        setFormData({
            nombre: '',
            contrasena: '',
            correo: '',
            telefono: '',
            rol: 'usuario'
        });
        setSelectedUser(null);
        setIsEditing(false);
    };

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setFormData({
            nombre: user.nombre || '',
            contrasena: '', // No mostramos la contraseña actual por seguridad
            correo: user.correo || '',
            telefono: user.telefono || '',
            rol: user.rol || 'usuario'
        });
        setIsEditing(true);
    };

    const validateForm = () => {
        // Usa los mismos nombres que en tu estado (formData)
        if (!formData.nombre || !formData.nombre.toString().trim()) {
            setError('El nombre es obligatorio');
            return false;
        }

        if (!formData.correo.trim()) {  // Cambiado de correo a correo
            setError('El correo es obligatorio');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.correo)) {  // Cambiado de correo a correo
            setError('El formato del correo no es válido');
            return false;
        }

        if (!formData.telefono || !/^\d+$/.test(formData.telefono)) {
            setError("El teléfono debe contener solo números");
            return false;
        }

        if (!isEditing && !formData.contrasena) {  // Cambiado de contrasena a contrasena
            setError('La contraseña es obligatoria para nuevos usuarios');
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

            if (isEditing) {
                // Actualizar usuario existente
                const updateData = {
                    nombre: formData.nombre,
                    correo: formData.correo,
                    telefono: formData.telefono,
                    rol: formData.rol
                };

                // Solo incluir la contraseña si se proporcionó
                if (formData.contrasena) {
                    updateData.contrasena = formData.contrasena;
                }

                await axios.put(`${apiUrl}/usuarios/${selectedUser.id_usuario}`, updateData);
                setSuccessMessage('Usuario actualizado correctamente');
            } else {
                // Crear nuevo usuario
                const newUser = {
                    nombre: formData.nombre,
                    correo: formData.correo,
                    telefono: formData.telefono,
                    rol: formData.rol,
                    contrasena: formData.contrasena
                };
                await axios.post(`${apiUrl}/usuarios`, newUser);
                setSuccessMessage('Usuario creado correctamente');
            }

            setSuccess(true);
            resetForm();
            fetchUsers();

        } catch (err) {
            console.error('Error al guardar usuario:', err);
            setError(err.response?.data?.message || 'Error al procesar la solicitud');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            return;
        }

        try {
            setLoading(true);
            // Este endpoint es hipotético, ajústalo según tu API
            await axios.delete(`${apiUrl}/usuarios/${userId}`);

            setSuccessMessage('Usuario eliminado correctamente');
            setSuccess(true);
            resetForm();
            fetchUsers(); // Actualizar la lista de usuarios

        } catch (err) {
            console.error('Error al eliminar usuario:', err);
            setError(err.response?.data?.mensaje || 'Error al eliminar el usuario');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h2 className="text-center mb-4">Gestión de Usuarios</h2>

            {error && (
                <div className="alert alert-error">
                    <p>{error}</p>
                </div>
            )}

            {success && (
                <div className="alert alert-success">
                    <p>{successMessage}</p>
                </div>
            )}

            <div className="flex mb-4">
                <button
                    className="btn btn-primary"
                    onClick={resetForm}
                >
                    {isEditing ? 'Crear Nuevo Usuario' : 'Limpiar Formulario'}
                </button>
            </div>

            <div className="flex" style={{ gap: '20px' }}>
                {/* Formulario */}
                <div className="form-container" style={{ flex: '1' }}>
                    <h3>{isEditing ? 'Editar Usuario' : 'Crear Usuario'}</h3>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="nombre" className="form-label">Nombre</label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleInputChange}
                                className="form-input"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="contrasena" className="form-label">
                                {isEditing ? 'Contraseña (dejar en blanco para mantener la actual)' : 'Contraseña'}
                            </label>
                            <input
                                type="contrasena"
                                id="contrasena"
                                name="contrasena"
                                value={formData.contrasena}
                                onChange={handleInputChange}
                                className="form-input"
                                required={!isEditing}
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="correo" className="form-label">Correo</label>
                            <input
                                type="correo"
                                id="correo"
                                name="correo"
                                value={formData.correo}
                                onChange={handleInputChange}
                                className="form-input"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="telefono" className="form-label">Telefono</label>
                            <input
                                type="telefono"
                                id="telefono"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleInputChange}
                                className="form-input"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="rol" className="form-label">Rol</label>
                            <select
                                id="rol"
                                name="rol"
                                value={formData.rol}
                                onChange={handleInputChange}
                                className="form-select"
                                disabled={loading}
                            >
                                <option value="usuario">Usuario</option>
                                <option value="administrador">Administrador</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Guardando...' : isEditing ? 'Actualizar Usuario' : 'Crear Usuario'}
                            </button>

                            {isEditing && (
                                <button
                                    type="button"
                                    className="btn btn-error ml-2"
                                    onClick={() => handleDeleteUser(selectedUser._id)}
                                    disabled={loading}
                                >
                                    Eliminar Usuario
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Lista de Usuarios */}
                <div className="form-container" style={{ flex: '1' }}>
                    <h3>Usuarios Registrados</h3>

                    {loading && users.length === 0 ? (
                        <p>Cargando usuarios...</p>
                    ) : users.length === 0 ? (
                        <p>No hay usuarios registrados</p>
                    ) : (
                        <div className="user-list" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>correo</th>
                                        <th>Telefono</th>
                                        <th>Rol</th>
                                        
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user._id} className={selectedUser?._id === user._id ? 'selected' : ''}>
                                            <td>{user.nombre}</td>
                                            <td>{user.correo}</td> 
                                            <td>{user.telefono}</td>                                           
                                            <td>{user.rol === 'administrador' ? 'Administrador' : 'Usuario'}</td>
                                            
                                            <td>
                                                <button
                                                    className="btn btn-outline btn-sm"
                                                    onClick={() => handleUserSelect(user)}
                                                >
                                                    Editar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageUsers;