import { toResponse } from "../utils/fornecedorMapper"
import api from "./api"
import { fetchAllPages } from "../utils/fetchAllPages"

export const fornecedorApi = {
    buscarPorId: async (id) => {
        const response = await api.get(`/fornecedores/${id}`)
        return toResponse(response.data)
    },

    listarFornecedores: async () => {
        const allFornecedores = await fetchAllPages((page) =>
            api.get("/fornecedores", { params: { page } }).then(r => r.data)
        );
        return allFornecedores.map(f => toResponse(f));
    },

    criarFornecedor: async (payload) => {
        const response = await api.post("/fornecedores", payload)
        return toResponse(response.data)
    },

    editarFornecedor: async (id, payload) => {
        const response = await api.put(`/fornecedores/${id}`, payload)
        return toResponse(response.data)
    },

    alterarStatus: async (id, isAtivo) => {
        await api.patch(`/fornecedores/${id}/status`, { isAtivo })
    },
}