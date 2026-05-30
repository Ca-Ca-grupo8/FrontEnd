import { toResponse } from "../utils/categoriaMapper"
import api from "./api"

export const categoriaApi = {
    listarCategorias: async () => {
        const response = await api.get("/categorias")
        return response.data.map(c => toResponse(c))
    },
    cadastrarCategoria: async (payload) => {
        const response = await api.post('/categorias', payload);
        return response.data.map(e => toResponse(e));
    }
}