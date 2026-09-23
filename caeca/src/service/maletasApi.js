import api from "./api"

export const vendaApi = {
    buscarMaletas: async (filtros = {}) => {
        const params = Object.fromEntries(
            Object.entries(filtros).filter(([, valor]) => valor !== '' && valor !== null && valor !== undefined)
        );
        const response = await api.get("/vendas", { params });
        return response.data;
    },

    buscarPorId: async (id) => {
        const response = await api.get(`/vendas/${id}`);
        return response.data;
    },

    finalizar: async (id) => {
        const response = await api.patch(`/vendas/${id}`, { finalizada: true });
        return response.data;
    }
}
