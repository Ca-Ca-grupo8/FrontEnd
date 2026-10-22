// O perfil é gravado no login e na validação da sessão (ProtectedRoute)
export function usuarioEhAdmin() {
    return localStorage.getItem("role_usuario") === "ROLE_ADMIN";
}
