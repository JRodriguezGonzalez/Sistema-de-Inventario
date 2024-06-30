import React from 'react';
import category from '../../assets/images/category.webp';
import inventory from '../../assets/images/inventory.webp';
import inventoryMoves from '../../assets/images/inventoryMoves.webp';
import products from '../../assets/images/products.webp';
import suppliers from '../../assets/images/suppliers.webp';
import users from '../../assets/images/users.webp';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import '../../styles/homeStyle.css';

const Home = () => (
  <div>
    <Container className="mt-4">
      <h1>Bienvenido al Sistema de Inventario</h1>
      <Row className="mt-4">
        <Col md={4}>
          <Card>
            <Card.Img variant="top" src={category} />
            <Card.Body>
              <Card.Title>Gestión de Categorías</Card.Title>
              <Card.Text>
                Administra las categorías de productos de forma eficiente.
              </Card.Text>
              <Button variant="primary" href="/categoria">Ir a Categorías</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Img variant="top" src={inventory} />
            <Card.Body>
              <Card.Title>Gestión de Inventario</Card.Title>
              <Card.Text>
                Accede a la gestión completa de inventario y movimientos.
              </Card.Text>
              <Button variant="primary" href="/inventario">Ir a Inventario</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Img variant="top" src={inventoryMoves} />
            <Card.Body>
              <Card.Title>Gestión de Movimiento de Inventario</Card.Title>
              <Card.Text>
                Controla y revisa los movimientos de tu inventario.
              </Card.Text>
              <Button variant="primary" href="/movimiento-inventario">Ir a Movimiento de Inventario</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col md={4}>
          <Card>
            <Card.Img variant="top" src={products} />
            <Card.Body>
              <Card.Title>Gestión de Productos</Card.Title>
              <Card.Text>
                Administra tus productos de manera eficaz.
              </Card.Text>
              <Button variant="primary" href="/producto">Ir a Productos</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Img variant="top" src={suppliers} />
            <Card.Body>
              <Card.Title>Gestión de Proveedores</Card.Title>
              <Card.Text>
                Mantén tus proveedores organizados y actualizados.
              </Card.Text>
              <Button variant="primary" href="/proveedor">Ir a Proveedores</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Img variant="top" src={users} />
            <Card.Body>
              <Card.Title>Gestión de Usuarios</Card.Title>
              <Card.Text>
                Administra los usuarios del sistema.
              </Card.Text>
              <Button variant="primary" href="/usuario">Ir a Usuarios</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  </div>
);

export default Home;
