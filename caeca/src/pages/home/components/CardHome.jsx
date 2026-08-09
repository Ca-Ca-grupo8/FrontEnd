import styles from "./CardHome.module.css";
import { Button } from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";

export function CardHome({ img, titulo, subtitulo, path }) {
  const navigate = useNavigate()
  return (
    <div className={styles.card}>
      <div className={styles.iconContainer}>
        <div className={styles.icon}>{img}</div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.textGroup}>
          <h3 className={styles.title}>{titulo}</h3>
          <p className={styles.subtitle}>{subtitulo}</p>
        </div>
        
        <Button colorido onClick={() => navigate(path)}>
          Acessar
        </Button>
      </div>
    </div>
  );
}