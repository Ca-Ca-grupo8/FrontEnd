import { useState } from "react";
import { InputField } from "../components/ui/InputField";
import { Button } from "../components/ui/Button";
import logoCaeca from "../assets/logo-caeca-rosa.png";
import imgDestaque from "../assets/imagem-joia-login.png";
import imgMarmore from "../assets/imagem-marmore.png";
import '../styles/Login.css';

export function Login() {
  const [formValues, setFormValues] = useState({
    email: "",
    senha: "",
  });

  const handleChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados do formulário:", formValues);
  };

  return (
    <div className="login-container">
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
