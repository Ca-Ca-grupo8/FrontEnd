import api from "./api"

export const joiaApi = {
    listarJoias: async () => {
        const response = await api.get("/joias")
        return response.data
    }
}