import api from "./api"

export const notificacaoEnvioApi = {
    listarEnvios: async (filtros = {}) => {
        const params = Object.fromEntries(
            Object.entries(filtros).filter(([, valor]) => valor !== '' && valor !== null && valor !== undefined)
        );
        const response = await api.get("/notificacoes/envios", { params })
        return response.data
    }
}
