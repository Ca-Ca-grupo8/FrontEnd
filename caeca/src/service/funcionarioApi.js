import { toResponse } from "../utils/funcionarioMapper"
import api from "./api"

export const funcionarioApi = {
    listarFuncionarios: async (params = {}) => {
        const response = await api.get("/funcionarios", { params })
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

    criarFuncionario: async (payload) => {
        const response = await api.post("/funcionarios", payload)
        return response.data ? toResponse(response.data) : response.data
    },

    editarFuncionario: async (id, payload) => {
        const response = await api.put(`/funcionarios/${id}`, payload)
        return response.data ? toResponse(response.data) : response.data
    },

    alterarStatus: async (id, isAtivo) => {
        await api.patch(`/funcionarios/${id}/status`, { isAtivo })
    },
}
