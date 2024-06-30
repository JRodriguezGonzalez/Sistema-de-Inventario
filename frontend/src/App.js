// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/pages/Home';
import Categoria from './components/pages/Categoria';
import Inventario from './components/pages/Inventario';
import MovimientoInventario from './components/pages/MovimientoInventario';
import Producto from './components/pages/Producto';
import Proveedor from './components/pages/Proveedor';
import Usuario from './components/pages/Usuario';
import Login from './components/pages/Login';
import NavBar from './components/common/NavBar'; // Importar el NavBar

const App = () => {
  const [isAuthenticated, setAuthenticated] = useState(false);

  const handleLogout = () => {
    setAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  useEffect(() => {
    const savedAuthStatus = localStorage.getItem('isAuthenticated');
    if (savedAuthStatus) {
      setAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('isAuthenticated', 'true');
    } else {
      localStorage.removeItem('isAuthenticated');
    }
  }, [isAuthenticated]);

  return (
    <Router>
      {!isAuthenticated ? (
        <Routes>
          <Route path="*" element={<Login setAuthenticated={setAuthenticated} />} />
        </Routes>
      ) : (
        <div>
          <NavBar handleLogout={handleLogout} /> {/* Incluir el NavBar aquí */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categoria" element={<Categoria />} />
            <Route path="/inventario" element={<Inventario />} />
            <Route path="/movimiento-inventario" element={<MovimientoInventario />} />
            <Route path="/producto" element={<Producto />} />
            <Route path="/proveedor" element={<Proveedor />} />
            <Route path="/usuario" element={<Usuario />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      )}
    </Router>
  );
};

export default App;
