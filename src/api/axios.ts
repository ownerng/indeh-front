import axios from 'axios';

export const apiInstance = axios.create({
  baseURL: 'https://capialti.shop',  // Ajusta según tu configuración
  timeout: 900000,  // 15 minutos - Para reportes con mucha información
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*',
  },
  withCredentials: false, // Explícitamente deshabilitado para evitar problemas de CORS
});


// export const apiInstance = axios.create({
//   baseURL: 'http://localhost:8080',  // Ajusta según tu configuración
//   timeout: 30000,  // Aumentado para archivos grandes
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': '*/*',
//   },
// });

// Interceptor para añadir el token de autorización
apiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // O donde sea que almacenes tu token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Añade el token al encabezado Authorization
    }
    
    // Para requests de archivos (blob), asegurar headers correctos
    if (config.responseType === 'blob') {
      config.headers.Accept = 'application/pdf, application/octet-stream, */*';
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
    
    // Log adicional para problemas de CORS
    if (error.message === 'Network Error' && !error.response) {
      console.error('Possible CORS or network issue:', {
        config: error.config,
        status: error.request?.status,
        readyState: error.request?.readyState
      });
    }
    
    return Promise.reject(error);
  }
);