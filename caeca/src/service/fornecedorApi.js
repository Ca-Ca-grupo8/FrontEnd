import { toResponse } from "../utils/fornecedorMapper"
import api from "./api"

export const fornecedorApi = {
    listarFornecedores: async () => {
        const response = await api.get("/fornecedores")
        return response.data.map(f => toResponse(f))
    }
}