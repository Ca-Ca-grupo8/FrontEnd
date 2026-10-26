import api from "./api"
import { limparParams } from "../utils/limparParams"

export const vendaApi = {
    buscarMaletas: async (filtros = {}, { signal } = {}) => {
        const response = await api.get("/vendas", { params: limparParams(filtros), signal });
        return response.data;
    },

    buscarPorId: async (id) => {
        const response = await api.get(`/vendas/${id}`);
        return response.data;
    },

    atualizarStatus: async (id, idStatus) => {
        const response = await api.patch(`/vendas/${id}`, { idStatus });
        return response.data;
    },

    listarStatus: async () => {
        const response = await api.get("/status-maletas");
        return response.data ?? [];
    },

    buscarResumo: async () => {
        const response = await api.get("/vendas/resumo");
        return response.data;
    }
}
