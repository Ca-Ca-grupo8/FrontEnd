export const funcionarioMapper = {
    toView(response) {
        if (!response) return null;
        return {
            id: response.id,
            nome: response.nome,
            email: response.email,
            tipoPerfil: response.role
        };
    }
};