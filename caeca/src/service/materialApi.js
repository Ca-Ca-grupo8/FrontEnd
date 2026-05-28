import { toResponse } from "../utils/materialMapper"
import api from "./api"

export const materialApi = {
    listarMateriais: async () => {
        const response = await api.get("/materiais")
        return response.data.map(m => toResponse(m))
    }
}