import api from "./api"

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

    buscarMovimentacoes: async (filtros = {}) => {
        const params = Object.fromEntries(
            Object.entries(filtros).filter(([, valor]) => valor !== '' && valor !== null && valor !== undefined)
        );
        const response = await api.get("/movimentacoes", { params });
        return response.data;
    }
}