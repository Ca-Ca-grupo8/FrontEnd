import api from "./api"

export const funcionarioApi = {
    buscarPorId: async (id) => {
        const response = await api.get(`/usuarios/${id}`)
        return response.data
    },

    atualizar: async (id, payload) => {
        const response = await api.patch(`/usuarios/${id}`, payload)
        return response.data
    }
}