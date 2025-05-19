import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
    const isAdmin = user && user.rol === 'administrador';

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                Cine App {isAdmin ? '- Admin' : ''}
            </Link>

            <ul className="navbar-nav">
                {isAdmin && (
                    <>
                        <li className="nav-item">
                            <Link to="/admin/create-room" className="nav-link">
                                Crear Sala
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/admin/modify-room" className="nav-link">
                                Modificar Salas
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/admin/create-function" className="nav-link">
                                Crear Función
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/admin/create-movie" className="nav-link">
                                Crear Película
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/admin/manage-users" className="nav-link">
                                Administrar Usuarios
                            </Link>
                        </li>
                        
                    </>
                )}

                <li className="nav-item">
                    <button
                        onClick={onLogout}
                        className="btn btn-danger"
                        style={{ marginLeft: '10px' }}
                    >
                        Log-out
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;