import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../../services/apiServiceLogin-out';
import '../../styles/loginStyle.css';

const Login = ({ setAuthenticated }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await register(name, email, password);
        setIsRegister(false);
        setError('Registro exitoso. Ahora puedes iniciar sesión.');
      } else {
        const response = await login(email, password);
        console.log("Login response:", response.data); // Verifica la respuesta del login
        setAuthenticated(true);
        setError('');
        navigate('/'); // Redirigir al home después de iniciar sesión
      }
    } catch (error) {
      setError(error.response?.data?.mensaje || 'Error en la autenticación.');
    }
  };

  return (
    <Container className="login-container">
      <Row className="justify-content-md-center">
        <Col md="6">
          <h2>{isRegister ? 'Registrarse' : 'Iniciar Sesión'}</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            {isRegister && (
              <Form.Group controlId="formName">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese su nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
            )}
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingrese su email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {isRegister ? 'Registrarse' : 'Iniciar Sesión'}
            </Button>
            <Button
              variant="link"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
            >
              {isRegister ? '¿Ya tienes una cuenta? Inicia Sesión' : '¿No tienes una cuenta? Regístrate'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
