import api from "./api"

export const joiaApi = {
    listarJoias: async () => {
        const response = await api.get("/joias")
        return response.data
    },

    buscarPorId: async (id) => {
        const response = await api.get(`/joias/${id}`)
        return response.data
    }
}