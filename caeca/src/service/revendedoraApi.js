import api from "./api"
import { fetchAllPages } from "../utils/fetchAllPages"

export const revendedoraApi = {
    listarRevendedoras: async () => {
        return fetchAllPages((page) =>
            api.get("/revendedoras", { params: { page } }).then(r => r.data)
        );
    }
}