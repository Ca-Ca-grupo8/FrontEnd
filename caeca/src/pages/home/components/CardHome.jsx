import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./CardHome.module.css";

export function CardHome({ Icone, titulo, subtitulo, path }) {
  const navigate = useNavigate();
  return (
    <button type="button" className={styles.card} onClick={() => navigate(path)}>
      <span className={styles.icone}>
        <Icone size={22} />
      </span>
      <span className={styles.texto}>
        <span className={styles.titulo}>{titulo}</span>
        <span className={styles.subtitulo}>{subtitulo}</span>
      </span>
      <ArrowRight className={styles.seta} size={18} />
    </button>
  );
}
