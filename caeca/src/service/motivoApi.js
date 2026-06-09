import api from "./api"

export const motivoApi = {
    listarMotivos: async () => {
        const response = await api.get("/motivos-movimentacao")
        return response.data
    },
    cadastrarMotivo: async (payload) => {
        const response = await api.post('/motivos-movimentacao', payload);
        return response.data
    }
}