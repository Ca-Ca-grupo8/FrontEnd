import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { usuarioApi } from '../service/usuarioApi';

export function ProtectedRoute({ children }) {
  const [status, setStatus] = useState("carregando");

  useEffect(() => {
    async function validar() {
      try {
        const resposta = await usuarioApi.getMe();
        const dados = resposta?.data || resposta;
        if (dados) {
          localStorage.setItem("nome_usuario", dados?.nome || "Usuário");
          localStorage.setItem("email_usuario", dados?.email || "usuário@email.com");
          localStorage.setItem("role_usuario", dados?.role || "ROLE_USER");
          localStorage.setItem("id_usuario", dados?.userId ?? null);
        }
        setStatus("ok");
      } catch (e) {
        localStorage.clear();
        setStatus("nao_autenticado");
      }
    }
    validar();
  }, []);

  if (status === "carregando") {
    return <div>Verificando sessão...</div>;
  }

  if (status === "nao_autenticado") {
    return <Navigate to="/login" replace />;
  }

  return children;
}
