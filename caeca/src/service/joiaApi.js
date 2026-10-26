import api from "./api"
import { fetchAllPages } from "../utils/fetchAllPages"
import { limparParams } from "../utils/limparParams"

export const joiaApi = {
    listarJoias: async (filtros = {}, { signal } = {}) => {
        const response = await api.get("/joias", { params: limparParams(filtros), signal })
        return response.data
    },

    listarTodasJoias: async (filtros = {}) => {
        const params = limparParams(filtros);
        return fetchAllPages((page) =>
            api.get("/joias", { params: { ...params, page } }).then(r => r.data)
        );
    },

    // Rota a ser criada no backend: jóias com quantidade abaixo da quantidadeMinima.
    listarAbaixoDoMinimo: async (limite = 5) => {
        const response = await api.get("/joias/abaixo-do-minimo", { params: { limite } })
        return response.data
    },

    buscarPorId: async (id) => {
        const response = await api.get(`/joias/${id}`)
        return response.data
    },

    listarPorFornecedor: async (fornecedorId, { page = 0, size = 10 } = {}) => {
        const response = await api.get(`/joias/fornecedor/${fornecedorId}`, { params: { page, size } })
        return response.data
    },

    atualizarJoia: async (id, payload) => {
        const response = await api.patch(`/joias/${id}`, payload)
        return response.data
    }
}