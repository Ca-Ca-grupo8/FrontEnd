import { toResponse } from "../utils/banhoMapper";
import api from "./api"

export const banhoApi = {
    listarBanhos: async () => {
        const response = await api.get('/banhos');
        return response.data.map(e => toResponse(e));
    }
}