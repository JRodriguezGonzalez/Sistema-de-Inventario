import axios from 'axios';

const API_BASE_URL = 'https://paginas-web-cr.com/ucr/multimedios0124/EquipoJRFY/Api';

// Función para el login
export const login = (email, password) => {
  return axios.post(`${API_BASE_URL}/Login/login.php`, { email, password });
};

// Función para el registro
export const register = (name, email, password) => {
  return axios.post(`${API_BASE_URL}/Usuario/usuario.php`, { nombre: name, email, password });
};
