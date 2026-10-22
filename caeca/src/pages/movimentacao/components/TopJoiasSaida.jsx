import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/Button";
import { movimentacaoApi } from "../../../service/movimentacaoApi";
import styles from "./TopJoiasSaida.module.css";

export function TopJoiasSaida({ onSelecionar }) {
    const [topJoias, setTopJoias] = useState([]);

    useEffect(() => {
        async function carregarTopJoias() {
            try {
                setTopJoias(await movimentacaoApi.listarTopJoiasSaida());
            } catch (error) {
                console.error("Erro ao carregar as joias mais saídas:", error);
            }
        }

        carregarTopJoias();
    }, []);

    if (topJoias.length === 0) return null;

    return (
        <div className={styles.container}>
            <h3 className={styles.titulo}>Joias com mais saídas no mês atual</h3>
            <div className={styles.lista}>
                {topJoias.map(joia => (
                    <Button
                        key={joia.idJoia}
                        type={"button"}
                        colorido={false}
                        title={`${joia.motivoMaisComum} · média de ${joia.quantidadeMedia} por saída`}
                        onClick={() => onSelecionar(joia)}>
                        {joia.nomeJoia}
                    </Button>
                ))}
            </div>
        </div>
    );
}
