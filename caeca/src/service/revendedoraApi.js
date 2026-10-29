import api from "./api"
import { fetchAllPages } from "../utils/fetchAllPages"

export const revendedoraApi = {
    criarRevendedora: async (payload) => {
        const response = await api.post("/revendedoras", payload);
        return response.data;
    },
    editarRevendedora: async (id, payload) => {
        const response = await api.patch(`/revendedoras/${id}`, payload);
        return response.data;
    },
    alterarStatusRevendedora: async (id, ativo) => {
        await api.patch(`/revendedoras/${id}`, { ativo });
    },
    listarRevendedoras: async () => {
        return fetchAllPages((page) =>
            api.get("/revendedoras", { params: { page } }).then(r => r.data)
        );
    },
    listarRevendedorasMaletaAberta: async () => {
        return fetchAllPages((page) =>
            api.get("/revendedoras/maleta-aberta", { params: { page } }).then(r => r.data)
        );
    }
}