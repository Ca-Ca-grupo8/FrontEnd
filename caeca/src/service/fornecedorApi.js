import { toResponse } from "../utils/fornecedorMapper"
import api from "./api"
import { fetchAllPages } from "../utils/fetchAllPages"

export const fornecedorApi = {
    listarFornecedores: async () => {
        const allFornecedores = await fetchAllPages((page) =>
            api.get("/fornecedores", { params: { page } }).then(r => r.data)
        );
        return allFornecedores.map(f => toResponse(f));
    }
}