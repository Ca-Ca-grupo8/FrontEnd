import { toResponse } from "../utils/fornecedorMapper"
import api from "./api"

export const fornecedorApi = {
    listarFornecedores: async (params = {}) => {
        const response = await api.get("/fornecedores", { params })
        if (Array.isArray(response.data)) {
            return response.data.map(f => toResponse(f))
        }
        if (response.data?.content) {
            return {
                content: response.data.content.map(f => toResponse(f)),
                totalPages: response.data.totalPages,
            }
        }
        return response.data
    },

    criarFornecedor: async (payload) => {
        const response = await api.post("/fornecedores", payload)
        return toResponse(response.data)
    },

    editarFornecedor: async (id, payload) => {
        const response = await api.put(`/fornecedores/${id}`, payload)
        return toResponse(response.data)
    },

    excluirFornecedor: async (id) => {
        await api.delete(`/fornecedores/${id}`)
    },
}