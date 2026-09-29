import api from "./api"
import { fetchAllPages } from "../utils/fetchAllPages"

export const revendedoraApi = {
    criarRevendedora: async (payload) => {
        const response = await api.post("/revendedoras", payload);
        return response.data;
    },
    listarRevendedoras: async () => {
        return fetchAllPages((page) =>
            api.get("/revendedoras", { params: { page } }).then(r => r.data)
        );
    }
}