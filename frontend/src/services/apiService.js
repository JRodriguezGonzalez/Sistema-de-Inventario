import axios from 'axios';

const API_BASE_URL = 'https://paginas-web-cr.com/ucr/multimedios0124/EquipoJRFY/Api';

// Función genérica para obtener datos
export const getData = (endpoint, id = '') => {
  return axios.get(`${API_BASE_URL}/${endpoint}/${id}`);
};

// Función genérica para crear datos
export const createData = (endpoint, data) => {
  return axios.post(`${API_BASE_URL}/${endpoint}`, data);
};

// Función genérica para actualizar datos
export const updateData = (endpoint, id, data) => {
  return axios.put(`${API_BASE_URL}/${endpoint}/${id}`, data);
};

// Función genérica para inactivar datos
export const deleteData = (endpoint, id) => {
  return axios({
    method: 'delete',
    url: `${API_BASE_URL}/${endpoint}/${id}`,
    data: { id: id }
  });
};

// Función genérica para activar datos (usando PATCH)
export const patchData = (endpoint, id) => {
  return axios({
    method: 'patch',
    url: `${API_BASE_URL}/${endpoint}/${id}`,
    data: { id: id }
  });
};
