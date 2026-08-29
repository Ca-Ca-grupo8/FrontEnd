import api from "./api"

export const joiaApi = {
    listarJoias: async (filtros = {}) => {
        const params = Object.fromEntries(
            Object.entries(filtros).filter(([, valor]) => valor !== '' && valor !== null && valor !== undefined)
        );
        const response = await api.get("/joias", { params })
        return response.data
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