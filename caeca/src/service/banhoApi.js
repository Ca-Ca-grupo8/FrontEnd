import { toResponse } from "../utils/banhoMapper";
import api from "./api"

export const banhoApi = {
    listarBanhos: async () => {
        const response = await api.get('/banhos');
        return response.data.map(e => toResponse(e));
    },
    cadastrarBanho: async (payload) => {
        const response = await api.post('/banhos', payload);
        return response.data.map(e => toResponse(e));
    }
}