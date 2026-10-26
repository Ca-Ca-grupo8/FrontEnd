import { Plus } from 'lucide-react';
import { Button } from './Button';
import styles from '../../styles/ListPage.module.css';

// Ação de criar nas listagens: texto no desktop, só o "+" no celular.
export function BotaoAdicionar({ rotulo, onClick }) {
    return (
        <Button onClick={onClick} aria-label={rotulo} className={styles.botaoAdicionar}>
            <Plus size={16} aria-hidden="true" className={styles.iconeAdicionar} />
            <span className={styles.textoAdicionar}>{rotulo}</span>
        </Button>
    );
}
