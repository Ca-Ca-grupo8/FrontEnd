import styles from "./CardHome.module.css";
import { Button } from "../../../components/ui/Button";

export function CardHome({ img, titulo, subtitulo }) {
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
        
        <Button colorido>
          Acessar
        </Button>
      </div>
    </div>
  );
}