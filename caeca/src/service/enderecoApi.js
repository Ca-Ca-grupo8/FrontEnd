import api from "./api";

export const enderecoApi = {
    criarEndereco: async (payload) => {
        const response = await api.post("/enderecos", payload);
        return response.data;
    }
};