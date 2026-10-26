import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { InputField } from "../../components/ui/InputField";
import { Button } from "../../components/ui/Button";
import logoCaeca from "../../assets/logo-caeca-rosa.png";
import imgDestaque from "../../assets/imagem-joia-login.png";
import imgMarmore from "../../assets/imagem-marmore.png";
import { usuarioApi } from "../../service/usuarioApi";
import { extrairMensagemErro } from "../../utils/apiError";
import { emitirToast } from "../../utils/toastBus";
import styles from "./PrimeiroAcesso.module.css";

const SENHA_MIN = 6;
const SENHA_MAX = 20;

export function PrimeiroAcesso() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [estado, setEstado] = useState(() => (token ? "validando" : "erro"));
  const [mensagemConvite, setMensagemConvite] = useState(() =>
    token ? "" : "Link inválido ou incompleto. Verifique o e-mail recebido."
  );
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  const [conviteExpirado, setConviteExpirado] = useState(false);
  const [isReenviando, setIsReenviando] = useState(false);
  const [reenviado, setReenviado] = useState(false);
  const [erroReenvio, setErroReenvio] = useState("");

  const [formValues, setFormValues] = useState({
    novaSenha: "",
    confirmarSenha: "",
  });
  const [erroForm, setErroForm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      return;
    }

    let ativo = true;

    async function validar() {
      try {
        const dados = await usuarioApi.validarConvite(token);
        if (!ativo) return;
        setNome(dados?.nome || "");
        setEmail(dados?.email || "");
        setEstado("pronto");
      } catch (error) {
        if (!ativo) return;
        const mensagem = extrairMensagemErro(
          error,
          "Não foi possível validar o convite."
        );
        const expirado =
          error?.response?.status === 400 &&
          /expirad/i.test(error?.response?.data?.mensagem || mensagem);
        setConviteExpirado(expirado);
        setMensagemConvite(mensagem);
        setEstado("erro");
      }
    }

    validar();
    return () => {
      ativo = false;
    };
  }, [token]);

  const handleChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErroForm("");

    const { novaSenha, confirmarSenha } = formValues;

    if (novaSenha.length < SENHA_MIN || novaSenha.length > SENHA_MAX) {
      setErroForm(`A senha deve ter entre ${SENHA_MIN} e ${SENHA_MAX} caracteres.`);
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErroForm("As senhas não conferem.");
      return;
    }

    setIsSubmitting(true);
    try {
      await usuarioApi.definirSenha(token, { novaSenha, confirmarSenha });
      emitirToast({ message: "Senha definida com sucesso! Faça login.", type: "success" });
      navigate("/login");
    } catch (error) {
      setErroForm(extrairMensagemErro(error, "Não foi possível definir a senha."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReenviar = async () => {
    setErroReenvio("");
    setIsReenviando(true);
    try {
      await usuarioApi.reenviarConviteExpirado(token);
      setReenviado(true);
      emitirToast({ message: "Novo link enviado para o e-mail.", type: "success" });
    } catch (error) {
      setErroReenvio(
        extrairMensagemErro(error, "Não foi possível reenviar o convite.")
      );
    } finally {
      setIsReenviando(false);
    }
  };

  const renderConteudo = () => {
    if (estado === "validando") {
      return <p className={styles.aviso}>Validando convite...</p>;
    }

    if (estado === "erro") {
      return (
        <div className={styles.erroBox}>
          <h2 className={styles.erroTitulo}>Convite indisponível</h2>
          <p className={styles.erroTexto}>{mensagemConvite}</p>

          {conviteExpirado && !reenviado && (
            <>
              <p className={styles.erroAjuda}>
                Seu link expirou. Podemos enviar um novo para o seu e-mail.
              </p>
              {erroReenvio && <p className={styles.erroForm}>{erroReenvio}</p>}
              <div className={styles.acoes}>
                <Button
                  colorido={true}
                  disabled={isReenviando}
                  onClick={handleReenviar}
                >
                  {isReenviando ? "Enviando..." : "Reenviar link"}
                </Button>
              </div>
            </>
          )}

          {conviteExpirado && reenviado && (
            <p className={styles.sucesso}>
              Novo link enviado para o e-mail. Verifique sua caixa de entrada.
            </p>
          )}

          {!conviteExpirado && (
            <p className={styles.erroAjuda}>
              Solicite um novo convite ao administrador do sistema.
            </p>
          )}

          <div className={styles.acoes}>
            <Button colorido={false} onClick={() => navigate("/login")}>
              Ir para o login
            </Button>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className={styles.cabecalho}>
          <h1 className={styles.titulo}>Primeiro acesso</h1>
          <p className={styles.subtitulo}>
            {nome ? `Olá, ${nome}. ` : ""}
            Defina sua senha para ativar o acesso.
          </p>
          {email && <p className={styles.email}>{email}</p>}
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <InputField
            label={"Nova senha"}
            type={"password"}
            placeholder={`De ${SENHA_MIN} a ${SENHA_MAX} caracteres`}
            required={true}
            value={formValues.novaSenha}
            onChange={(e) => handleChange("novaSenha", e.target.value)}
          />

          <InputField
            label={"Confirmar senha"}
            type={"password"}
            placeholder={"Repita a senha"}
            required={true}
            value={formValues.confirmarSenha}
            onChange={(e) => handleChange("confirmarSenha", e.target.value)}
          />

          {erroForm && <p className={styles.erroForm}>{erroForm}</p>}

          <div className={styles.submit}>
            <Button type={"submit"} colorido={true} disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Definir senha"}
            </Button>
          </div>
        </form>
      </>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.left} style={{ backgroundImage: `url(${imgMarmore})` }}>
        <div className={styles.formWrapper}>
          <div className={styles.logo}>
            <img src={logoCaeca} alt="CaeCa Joalheria" />
          </div>
          {renderConteudo()}
        </div>
      </div>

      <div className={styles.right}>
        <img
          src={imgDestaque}
          alt="Coleção de joias CaeCa"
          className={styles.destaqueImg}
        />
      </div>
    </div>
  );
}
