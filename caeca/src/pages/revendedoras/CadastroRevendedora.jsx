import { PageHeader } from "../../components/ui/PageHeader";
import { FormRevendedora } from "./FormRevendedora";
import styles from "./CadastroRevendedora.module.css";

export function CadastroRevendedora() {
    return (
        <div className={styles.page}>
            <PageHeader titulo="Cadastro de revendedora" />

            <FormRevendedora />
        </div>
    );
}
