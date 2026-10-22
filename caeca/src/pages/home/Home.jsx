import { ArrowDownToLine, ArrowUpFromLine, ChartColumn, History, Package } from "lucide-react";
import { CardHome } from "./components/CardHome";
import { HeroHome } from "./components/HeroHome";
import { KpiCard } from "./components/KpiCard";
import { RankingPecas } from "./components/RankingPecas";
import { UltimasMovimentacoes } from "./components/UltimasMovimentacoes";
import { UltimosEnvios } from "./components/UltimosEnvios";
import { useHomeData } from "./useHomeData";
import styles from "./Home.module.css";

const ACESSOS = [
    {
        titulo: "Registrar entrada",
        subtitulo: "Entrada de peças com registro automático.",
        Icone: ArrowDownToLine,
        path: "/movimentacoes/entrada"
    },
    {
        titulo: "Registrar saída",
        subtitulo: "Saída de peças com registro automático.",
        Icone: ArrowUpFromLine,
        path: "/movimentacoes/saida"
    },
    {
        titulo: "Relatórios",
        subtitulo: "Giro de estoque e peças mais vendidas.",
        Icone: ChartColumn,
        path: "/dashboard"
    },
    {
        titulo: "Histórico",
        subtitulo: "Registro completo de todas as alterações no sistema.",
        Icone: History,
        path: "/joias/movimentacoes"
    },
    {
        titulo: "Inventário",
        subtitulo: "Consulta do catálogo e do estoque atual.",
        Icone: Package,
        path: "/joias"
    }
];

const RODAPE_KPI = "vs. semana anterior";

// Variação percentual contra a semana anterior. Sem base de comparação, não há variação.
const variacao = (atual, anterior) => {
    if (atual == null || anterior == null || anterior === 0) return null;
    return Math.round(((atual - anterior) / Math.abs(anterior)) * 100);
};

const formatarNumero = (valor) => new Intl.NumberFormat("pt-BR").format(valor ?? 0);

const ROTULO_STATUS = {
    EM_PREPARACAO: "Em preparação",
    EM_CONSIGNACAO: "Em consignação",
    EM_ACERTO: "Em acerto",
};

const formatarData = (valor) => {
    // Datas só com dia (AAAA-MM-DD) são lidas como horário local, sem deslocar o dia.
    const data = new Date(valor.length === 10 ? `${valor}T00:00:00` : valor);
    return data.toLocaleDateString("pt-BR");
};

export function Home() {
    const { carregando, dados, erros } = useHomeData();

    const kpis = dados.kpis ?? {};
    const maletas = dados.maletas ?? {};
    const vencimentos = (maletas.topProximoVencimentos ?? []).map((maleta) => ({
        ...maleta,
        nome: maleta.nomeMaleta,
    }));
    const porStatus = maletas.totalPorStatus ?? {};
    const dicaMaletas = Object.entries(ROTULO_STATUS)
        .map(([status, rotulo]) => `${rotulo}: ${formatarNumero(porStatus[status])}`)
        .join(" · ");

    const semKpis = carregando || erros.kpis;
    const valorKpi = (valor) => (semKpis ? "—" : formatarNumero(valor));

    return (
        <div className={styles.page}>
            <div className={styles.layout}>
                <div className={styles.principal}>
                    <HeroHome />

                    <section className={styles.secao}>
                        <h2 className={styles.tituloSecao}>Acesso rápido</h2>
                        <div className={styles.acessos}>
                            {ACESSOS.map((item) => (
                                <CardHome
                                    key={item.path}
                                    titulo={item.titulo}
                                    subtitulo={item.subtitulo}
                                    Icone={item.Icone}
                                    path={item.path}
                                />
                            ))}
                        </div>
                    </section>

                    <section className={styles.kpis}>
                        <KpiCard
                            label="Entradas na semana"
                            valor={valorKpi(kpis.totalEntradas)}
                            variacao={variacao(kpis.totalEntradas, kpis.entradasPassadas)}
                            rodape={RODAPE_KPI}
                        />
                        <KpiCard
                            label="Saídas na semana"
                            valor={valorKpi(kpis.totalSaidas)}
                            variacao={variacao(kpis.totalSaidas, kpis.saidasPassadas)}
                            rodape={RODAPE_KPI}
                        />
                        <KpiCard
                            label="Peças em estoque"
                            valor={valorKpi(kpis.totalEmEstoque)}
                            variacao={variacao(kpis.totalEmEstoque, kpis.estoquePassado)}
                            rodape={RODAPE_KPI}
                        />
                        <KpiCard
                            label="Maletas em andamento"
                            valor={carregando || erros.maletas ? "—" : formatarNumero(maletas.totalNaoFinalizado)}
                            dica={dicaMaletas}
                            rodape="Não finalizadas"
                        />
                    </section>

                    <section className={styles.grade}>
                        <RankingPecas
                            titulo="Peças para repor"
                            subtitulo="Abaixo da quantidade mínima"
                            itens={dados.repor ?? []}
                            campo="quantidade"
                            rotuloValor="un."
                            detalhe={(item) => `Mínimo: ${item.quantidadeMinima} un.`}
                            caminhoVerMais="/joias"
                            rotuloVerMais="Ver inventário"
                            caminhoItem={(item) => `/joias/${item.id}`}
                            carregando={carregando}
                            erro={erros.repor}
                        />
                        <RankingPecas
                            titulo="Peças mais vendidas"
                            subtitulo="Top 5 nesta semana"
                            itens={dados.topVendidos ?? []}
                            campo="quantidadeSaidas"
                            rotuloValor="saídas"
                            caminhoVerMais="/dashboard"
                            rotuloVerMais="Ver dashboard"
                            caminhoItem={(item) => (item.id ? `/joias/${item.id}` : null)}
                            carregando={carregando}
                            erro={erros.topVendidos}
                        />
                        <RankingPecas
                            titulo="Próximos vencimentos"
                            subtitulo="Top 5 maletas em andamento"
                            itens={vencimentos}
                            detalhe={(item) => ROTULO_STATUS[item.status] ?? item.status}
                            formatar={(item) => formatarData(item.dataVencimento)}
                            caminhoVerMais="/joias/maletas"
                            rotuloVerMais="Ver maletas"
                            caminhoItem={(item) => `/joias/maletas/${item.id}`}
                            carregando={carregando}
                            erro={erros.maletas}
                        />
                    </section>
                </div>

                <aside className={styles.lateral}>
                    <UltimasMovimentacoes
                        dados={dados.ultimas ?? []}
                        carregando={carregando}
                        erro={erros.ultimas}
                    />
                    <UltimosEnvios
                        dados={dados.envios ?? []}
                        carregando={carregando}
                        erro={erros.envios}
                    />
                </aside>
            </div>
        </div>
    );
}
