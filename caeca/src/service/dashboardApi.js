import api from './api';

export const dashboardApi = {
    buscarValorSaida: async (filtros) => {
        const { data } = await api.get('/dashboard', { params: filtros });
        return data;
    },
    buscarTopCinco: async (filtros) => {
        const { data } = await api.get('/dashboard/top-cinco', { params: filtros });
        return data;
    },
    buscarGiroEstoque: async (filtros) => {
        const { data } = await api.get('/dashboard/giro-estoque', { params: filtros });
        return data;
    },
    buscarMotivosSaida: async (params) => {
        const { data } = await api.get('/dashboard/graficos/motivos-saida', { params });
        return data;
    },
    buscarMotivosReentrada: async (params) => {
        const { data } = await api.get('/dashboard/graficos/motivos-reentrada', { params });
        return data;
    },
    buscarTopCincoMaisFrios: async (filtros) => {
        const { data } = await api.get('/dashboard/top-cinco-mais-frios', { params: filtros });
        return data;
    },
    buscarIndicePecasFrias: async (filtros) => {
        const { data } = await api.get('/dashboard/indice-pecas-frias', { params: filtros });
        return data;
    }
};
