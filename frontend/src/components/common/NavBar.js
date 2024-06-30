// src/components/common/NavBar.js
import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import '../../styles/navbarStyle.css'; // Importar la hoja de estilos para la barra de navegación

const NavBar = ({ handleLogout }) => (
  <Navbar bg="light" expand="lg" className="navbar-custom">
    <Navbar.Brand href="/">Sistema de Inventario</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="m-auto">
        <LinkContainer to="/categoria">
          <Nav.Link>Categorías</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/inventario">
          <Nav.Link>Inventario</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/movimiento-inventario">
          <Nav.Link>Movimiento de Inventario</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/producto">
          <Nav.Link>Productos</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/proveedor">
          <Nav.Link>Proveedores</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/usuario">
          <Nav.Link>Usuarios</Nav.Link>
        </LinkContainer>
      </Nav>
      <Nav className="ml-auto">
        <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

export default NavBar;
