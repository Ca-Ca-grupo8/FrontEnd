import api from "./api"

export const vendaApi = {
    listarJoiasSaidaRevendedora: async (idRevendedora) => {
        const response = await api.get("/vendas/revendedora/joias-saida", { params: { idRevendedora } });
        return response.data;
    }
}
