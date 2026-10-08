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
    },

    // O controller devolve 204 quando não há ninguém cadastrado, então
    // response.data chega como string vazia — normalizamos para lista.
    listarUsuarios: async () => {
        const response = await api.get("/usuarios")
        return Array.isArray(response.data) ? response.data : []
    },

    criarUsuario: async (payload) => {
        // 201 sem corpo: não há o que mapear.
        await api.post("/usuarios", payload)
    }
}