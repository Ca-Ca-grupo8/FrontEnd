import { useState } from "react";
import { InputField } from "../components/ui/InputField";
import { Button } from "../components/ui/Button";
import logoCaeca from "../assets/logo-caeca-rosa.png";
import imgDestaque from "../assets/imagem-joia-login.png";
import imgMarmore from "../assets/imagem-marmore.png";
import '../styles/Login.css';
import { usuarioApi } from "../service/usuarioApi";
import { SucessoModal } from "../components/modals/SucessoModal";
import { useNavigate } from "react-router-dom";

export function Login() {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    email: "",
    senha: "",
  });

  const [IsSuccess, setIsSuccess] = useState(false)
  const [Error, setError] = useState(false)
  const [SuccessText, setSuccessText] = useState("Cadastro realizado com sucesso!");

  const handleChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();


    login(formValues)
  };

  async function login(payload) {
    try {
      const resposta = await usuarioApi.login(payload)

      const nomeUsuario = resposta?.nome || resposta?.data?.nome || "Usuário";
      const emailUsuario = resposta?.email || resposta?.data?.email || "usuário@email.com";
      const roleUsuario = resposta?.role || resposta?.data?.role || "ROLE_USER"
      const idUsuario = resposta?.userId || resposta?.data?.userId || null;

      localStorage.setItem("nome_usuario", nomeUsuario);
      localStorage.setItem("email_usuario", emailUsuario);
      localStorage.setItem("role_usuario", roleUsuario);
      localStorage.setItem("id_usuario", idUsuario);

      navigate("/joias/movimentacoes/entrada")
      return
    } catch (e) {
      setSuccessText("Erro inesperado ocorreu!")
      setError(true)
    }
  }

  return (
    
    <div className="login-container">
      <SucessoModal text={SuccessText} error={Error} onClose={() => {setError(false)}}/>
      {/* Painel esquerdo — mármore + formulário */}
      <div className="login-left" style={{ backgroundImage: `url(${imgMarmore})` }}>
        <div className="login-form-wrapper">
          <div className="login-logo">
            <img src={logoCaeca} alt="CaeCa Joalheria" />
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <InputField
              label={"Email"}
              type={"email"}
              placeholder={"seuemail@exemplo.com"}
              required={true}
              value={formValues.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />

            <InputField
              label={"Senha"}
              type={"password"}
              placeholder={"Sua senha segura"}
              required={true}
              value={formValues.senha}
              onChange={(e) => handleChange("senha", e.target.value)}
            />

            <div className="login-submit">
              <Button type={"submit"} colorido={true}>
                Entrar
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Painel direito — imagem destaque */}
      <div className="login-right">
        <img
          src={imgDestaque}
          alt="Coleção de joias CaeCa"
          className="login-destaque-img"
        />
      </div>
    </div>
  );
}
