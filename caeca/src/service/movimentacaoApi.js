import api from "./api"
import { limparParams } from "../utils/limparParams"

export const movimentacaoApi = {
    realizarMovimentacao: async (payload, imagem) => {
        const formData = new FormData();
        
        const jsonBlob = new Blob([JSON.stringify(payload)], {type: "application/json"})
        formData.append("movimentacaoRequest", jsonBlob);

        if(imagem){
            formData.append("arquivo", imagem)
        }

        const response = await api.post("/movimentacoes", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })

        return response.data
    },

    listarTopJoiasSaida: async () => {
        const response = await api.get("/movimentacoes/top-joias-saida");
        return response.data.joias ?? [];
    },

    buscarMovimentacoes: async (filtros = {}, { signal } = {}) => {
        const response = await api.get("/movimentacoes", { params: limparParams(filtros), signal });
        return response.data;
    }
}