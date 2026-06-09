import api from "./api"

export const tiposApi = {
    listarTipos: async () => {
        const response = await api.get("/tipos-movimentacao")
        return response.data
    }
}