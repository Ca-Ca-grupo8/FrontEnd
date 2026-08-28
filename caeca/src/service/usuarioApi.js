import api from "./api"

export const usuarioApi = {
    login: async (payload) => {
        const response = api.post("/usuarios/login", payload)
        return response
    },
    getMe: async () => {
        const response = await api.get("/usuarios/me")
        return response
    }
}