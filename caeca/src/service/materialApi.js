import { toResponse } from "../utils/materialMapper"
import api from "./api"

export const materialApi = {
    listarMateriais: async () => {
        const response = await api.get("/materiais")
        return response.data.map(m => toResponse(m))
    },
    cadastrarMaterial: async (payload) => {
        const response = await api.post('/materiais', payload);
        return response.data.map(e => toResponse(e));
    }
}