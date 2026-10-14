import api from "./api"

export const usuarioApi = {
    login: async (payload) => {
        const response = api.post("/usuarios/login", payload, { silent: true })
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
    },

    // --- Fluxo de convite (primeiro acesso) ---

    // Admin: cria o usuário PENDENTE e dispara o e-mail de convite.
    criarConvite: async (payload) => {
        const { data } = await api.post("/usuarios/convites", payload)
        return data
    },

    // Admin: invalida convites pendentes e envia um novo e-mail.
    reenviarConvite: async (usuarioId) => {
        await api.post(`/usuarios/convites/${usuarioId}/reenviar`)
    },

    // Público: valida o token do link e devolve { nome, email }.
    // Erros 400/404 são tratados na página, então silenciamos o toast global.
    validarConvite: async (token) => {
        const { data } = await api.get(`/usuarios/convites/${token}`, { silent: true })
        return data
    },

    // Público: pede um novo link quando o convite expirou (204).
    // Novamente silenciamos o toast global: os 400 têm significado de negócio
    // ("Convite ainda é válido", "Usuário já está ativo", ...).
    reenviarConviteExpirado: async (token) => {
        await api.post("/usuarios/convites/reenviar", { token }, { silent: true })
    },

    // Público: grava a senha, ativa o usuário e consome o convite (204).
    definirSenha: async (token, payload) => {
        await api.post(`/usuarios/convites/${token}/senha`, payload, { silent: true })
    }
}