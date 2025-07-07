import axios from 'axios';

// export const apiInstance = axios.create({
//   baseURL: 'https://capi.shop',  // Ajusta según tu configuración
//   timeout: 300000,  // Aumentado para archivos grandes
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': '*/*',
//   },
// });


export const apiInstance = axios.create({
  baseURL: 'http://localhost:8080',  // Ajusta según tu configuración
  timeout: 30000,  // Aumentado para archivos grandes
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*',
  },
});

// Interceptor para añadir el token de autorización
apiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // O donde sea que almacenes tu token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Añade el token al encabezado Authorization
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores globalmente
apiInstance.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);