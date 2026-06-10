import api from "./api"

export const revendedoraApi = {
    listarRevendedoras: async () => {
        const response = await api.get("/revendedoras")
        return response.data
    }
}