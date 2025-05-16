import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import Login from './components/Login';
import Register from './components/Register'; 
import Navbar from './components/Navbar';
import MovieList from './components/MovieList';
import CreateRoom from './components/admin/CreateRoom';
import ModifyRoom from './components/admin/ModifyRoom';
import SeatReservation from './components/SeatReservation';
import ManageUsers from './components/admin/ManageUsers';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);
  
  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuth(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogin = (userData) => {
    setIsAuth(true);
    setUser(userData);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setIsAuth(false);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <Router>
      {isAuth && <Navbar user={user} onLogout={handleLogout} />}
      <div className="container">
        <Routes>
          <Route path="/login" element={!isAuth ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
          <Route path="/register" element={!isAuth ? <Register /> : <Navigate to="/" />} />
          
          {/* Protected routes for all authenticated users */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute isAuth={isAuth}>
                <MovieList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reservaciones/:salaId/:funcionId"  
            element={
              <ProtectedRoute isAuth={isAuth}>
                <SeatReservation />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin only routes */}
          <Route 
            path="/admin/create-room" 
            element={
              <ProtectedRoute isAuth={isAuth && user?.rol === 'administrador'}>
                <CreateRoom />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/modify-room/:id" 
            element={
              <ProtectedRoute isAuth={isAuth && user?.rol === 'administrador'}>
                <ModifyRoom />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/manage-users" 
            element={
              <ProtectedRoute isAuth={isAuth && user?.rol === 'administrador'}>
                <ManageUsers />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
