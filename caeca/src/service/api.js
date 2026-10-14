import axios from 'axios';
import { extrairMensagemErro } from '../utils/apiError';
import { emitirToast } from '../utils/toastBus';

const api = axios.create({
  // Em dev o proxy do Vite (/api -> localhost:8080) resolve.
  // Em produção o nginx dentro do container faz o mesmo repasse.
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const silent = error.config?.silent === true;

    if (error.response?.status === 401) {
      if (!silent) {
        localStorage.clear();
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    if (!silent) {
      emitirToast({ message: extrairMensagemErro(error), type: 'error' });
    }

    return Promise.reject(error);
  }
);

export default api;
