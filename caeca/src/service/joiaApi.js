import api from "./api"
import { fetchAllPages } from "../utils/fetchAllPages"

export const joiaApi = {
    listarJoias: async (filtros = {}) => {
        const params = Object.fromEntries(
            Object.entries(filtros).filter(([, valor]) => valor !== '' && valor !== null && valor !== undefined)
        );
        const response = await api.get("/joias", { params })
        return response.data
    },

    listarTodasJoias: async (filtros = {}) => {
        const params = Object.fromEntries(
            Object.entries(filtros).filter(([, valor]) => valor !== '' && valor !== null && valor !== undefined)
        );
        return fetchAllPages((page) =>
            api.get("/joias", { params: { ...params, page } }).then(r => r.data)
        );
    },

    buscarPorId: async (id) => {
        const response = await api.get(`/joias/${id}`)
        return response.data
    },

    atualizarJoia: async (id, payload) => {
        const response = await api.patch(`/joias/${id}`, payload)
        return response.data
    }
}