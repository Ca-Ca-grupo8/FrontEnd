import api from "./api"

export const usuarioApi = {
    login: async (payload) => {
        const response = api.post("/usuarios/login", payload)
        return response
    },
    getMe: async () => {
        const response = await api.get("/usuarios/me")
        return response
    },
    logout: async () => {
        const response = await api.post("/usuarios/logout")
        return response
    }
}