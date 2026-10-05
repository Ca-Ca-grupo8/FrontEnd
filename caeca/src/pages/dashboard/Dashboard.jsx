import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';

import { PageHeader } from '../../components/ui/PageHeader';
import { Toast } from '../../components/ui/Toast';
import { dashboardApi } from '../../service/dashboardApi';
import { categoriaApi } from '../../service/categoriaApi';
import style from './Dashboard.module.css';

const CORES = {
    entradas: '#7FB9CC',
    saidas: '#3B4FD8',
    estoque: '#E91E63',
    motivo: '#96205C',
};

// Períodos do botão rápido e a duração esperada pelo backend.
const PERIODO_PADRAO = 'mesAtual';

const formatarMoeda = (valor) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
        .format(valor ?? 0);

const formatarNumero = (valor) =>
    new Intl.NumberFormat('pt-BR').format(valor ?? 0);

// O FiltroDashboardDto pede data com fuso (yyyy-MM-dd'T'HH:mm:ss.SSSX),
// enquanto os endpoints de gráfico pedem LocalDateTime (sem fuso).
const comFuso = (data) => data.toISOString();
const semFuso = (data) => {
    const pad = (n) => String(n).padStart(2, '0');
    return `${data.getFullYear()}-${pad(data.getMonth() + 1)}-${pad(data.getDate())}` +
        `T${pad(data.getHours())}:${pad(data.getMinutes())}:${pad(data.getSeconds())}`;
};

// Input de data espera o fuso local; toISOString() viraria UTC e
// deslocaria um dia perto da meia-noite.
const paraInput = (data) => {
    const pad = (n) => String(n).padStart(2, '0');
    return `${data.getFullYear()}-${pad(data.getMonth() + 1)}-${pad(data.getDate())}`;
};

// new Date("2025-03-12") interpreta como UTC e, no Brasil, cai um dia
// antes. Se aponta a Date local pra alimentar todo o resto.
const deInput = (valor) => {
    const [ano, mes, dia] = valor.split('-').map(Number);
    return new Date(ano, mes - 1, dia);
};

function datasDoPeriodo(tipo) {
    const agora = new Date();
    const inicio = new Date(agora.getFullYear(), agora.getMonth(), 1);
    const fim = new Date(agora.getFullYear(), agora.getMonth() + 1, 0);

    const porAnoPassado = () => ({
        inicio: new Date(agora.getFullYear() - 1, 0, 1),
        fim: new Date(agora.getFullYear() - 1, 11, 31),
    });

    switch (tipo) {
        case 'mesAnterior':
            return {
                inicio: new Date(agora.getFullYear(), agora.getMonth() - 1, 1),
                fim: new Date(agora.getFullYear(), agora.getMonth(), 0),
            };
        case 'anoAtual':
            return {
                inicio: new Date(agora.getFullYear(), 0, 1),
                fim: new Date(agora.getFullYear(), agora.getMonth() + 1, 0),
            };
        case 'anoPassado':
            return porAnoPassado();
        default:
            return { inicio, fim };
    }
}

const QUADRO_ENTRADAS_SAIDAS = [
    // TODO: ligar em /dashboard/entradas-saidas quando o
    // EntradaXSaidaController (hoje comentado) for reativado.
    { mes: 'Jan', entradas: 1550, saidas: 780, estoque: 820 },
    { mes: 'Fev', entradas: 1980, saidas: 1150, estoque: 1340 },
    { mes: 'Mar', entradas: 4820, saidas: 4100, estoque: 5320 },
    { mes: 'Abr', entradas: 2720, saidas: 3950, estoque: 5330 },
    { mes: 'Mai', entradas: 1600, saidas: 760, estoque: 790 },
    { mes: 'Jun', entradas: 3500, saidas: 4600, estoque: 6200 },
    { mes: 'Jul', entradas: 3550, saidas: 2650, estoque: 3560 },
    { mes: 'Ago', entradas: 5900, saidas: 5000, estoque: 6450 },
    { mes: 'Set', entradas: 5250, saidas: 4400, estoque: 6020 },
];

const RESUMO_ENTRADAS_SAIDAS = [
    { label: 'Total de Entradas', valor: 43230, variacao: 7 },
    { label: 'Total de Saídas', valor: 32903, variacao: -4 },
    { label: 'Produtos em estoque', valor: 18583, variacao: 3 },
];

function Trend({ valor }) {
    const sobe = valor >= 0;
    const seta = sobe ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />;
    return (
        <span className={`${style.trend} ${sobe ? style.trendUp : style.trendDown}`}>
            {seta} {Math.abs(valor)}%
        </span>
    );
}

function ResumoItem({ label, valor, variacao }) {
    return (
        <div className={style.summaryItem}>
            <div className={style.summaryHead}>
                <span className={style.summaryLabel}>{label}</span>
                <Trend valor={variacao} />
            </div>
            <div className={style.summaryValue}>{formatarNumero(valor)}</div>
        </div>
    );
}

function GraficoMotivos({ titulo, dados }) {
    return (
        <section className={style.card}>
            <h3 className={style.cardTitle}>{titulo}</h3>
            {dados.length === 0 ? (
                <p className={style.empty}>Sem dados para o período</p>
            ) : (
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={dados} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEEEEE" />
                            <XAxis
                                dataKey="motivo"
                                angle={-90}
                                textAnchor="end"
                                interval={0}
                                height={110}
                                tick={{ fontSize: 12, fill: '#666' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                allowDecimals={false}
                                tick={{ fontSize: 12, fill: '#888' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip cursor={{ fill: 'rgba(150,32,92,0.05)' }} />
                            <Bar dataKey="quantidade" barSize={56} radius={[4, 4, 0, 0]}>
                                {dados.map((_, i) => (
                                    <Cell key={i} fill={CORES.motivo} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </section>
    );
}

function RankingVendidas({ dados, onAcessar }) {
    return (
        <section className={style.card}>
            <h3 className={style.cardTitle}>Top 5 Categorias Mais Vendidas</h3>
            <table className={style.rankingTable}>
                <thead>
                    <tr>
                        <th>Posição</th>
                        <th>Produto</th>
                        <th>Saídas</th>
                        <th>Informações</th>
                    </tr>
                </thead>
                <tbody>
                    {dados.map((item, i) => (
                        <tr key={`${item.nome}-${i}`}>
                            <td className={style.position}>{i + 1}</td>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                    <div className={style.thumb}>[Foto]</div>
                                    <div>
                                        <div className={style.productName}>{item.nome}</div>
                                        {i === 0 && (
                                            <div className={style.productNote}>Produto mais vendido</div>
                                        )}
                                    </div>
                                </div>
                            </td>
                            <td>{item.quantidadeSaidas}</td>
                            <td>
                                <button className={style.accessBtn} onClick={onAcessar}>Acessar</button>
                            </td>
                        </tr>
                    ))}
                    {dados.length === 0 && (
                        <tr><td colSpan={4}><div className={style.empty}>Sem dados para o período</div></td></tr>
                    )}
                </tbody>
            </table>
        </section>
    );
}

function RankingFrias({ dados, onAcessar }) {
    return (
        <section className={style.card}>
            <h3 className={style.cardTitle}>Top 5 Categorias Mais Frias (Sem Giros)</h3>
            <table className={style.rankingTable}>
                <thead>
                    <tr>
                        <th>Posição</th>
                        <th>Produto</th>
                        <th>Última saída</th>
                        <th>QTD</th>
                        <th>Informações</th>
                    </tr>
                </thead>
                <tbody>
                    {dados.map((item, i) => (
                        <tr key={`${item.nome}-${i}`}>
                            <td className={style.position}>{i + 1}</td>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                    <div className={style.thumb}>[Foto]</div>
                                    <span className={style.productName}>{item.nome}</span>
                                </div>
                            </td>
                            <td>
                                {item.ultimaMovimentacao
                                    ? new Date(item.ultimaMovimentacao).toLocaleDateString('pt-BR')
                                    : '-'}
                            </td>
                            <td>{item.quantidade}</td>
                            <td>
                                <button className={style.accessBtn} onClick={onAcessar}>Acessar</button>
                            </td>
                        </tr>
                    ))}
                    {dados.length === 0 && (
                        <tr><td colSpan={5}><div className={style.empty}>Sem dados para o período</div></td></tr>
                    )}
                </tbody>
            </table>
        </section>
    );
}

export function Dashboard() {
    const navigate = useNavigate();

    const inicial = datasDoPeriodo(PERIODO_PADRAO);
    const [inicio, setInicio] = useState(inicial.inicio);
    const [termino, setTermino] = useState(inicial.fim);
    const [categoriaId, setCategoriaId] = useState('');
    const [periodoAtivo, setPeriodoAtivo] = useState(PERIODO_PADRAO);
    const [categorias, setCategorias] = useState([]);

    const [valorSaida, setValorSaida] = useState(null);
    const [giro, setGiro] = useState(null);
    const [indiceFrias, setIndiceFrias] = useState(null);
    const [motivosSaida, setMotivosSaida] = useState([]);
    const [motivosReentrada, setMotivosReentrada] = useState([]);
    const [topVendidos, setTopVendidos] = useState([]);
    const [topFrios, setTopFrios] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [toast, setToast] = useState(null);

    const fecharToast = useCallback(() => setToast(null), []);

    const carregar = useCallback(async (filtros) => {
        setCarregando(true);
        const comFiltro = {
            dataInicio: comFuso(filtros.inicio),
            dataTermino: comFuso(filtros.fim),
            categoriaId: filtros.categoriaId || null,
        };
        const semFiltro = {
            inicio: semFuso(filtros.inicio),
            fim: semFuso(filtros.fim),
            categoriaId: filtros.categoriaId || undefined,
        };

        try {
            const [saida, giroEstoque, frias, reentrada, saidas, vendidos, frios] =
                await Promise.all([
                    dashboardApi.buscarValorSaida(comFiltro),
                    dashboardApi.buscarGiroEstoque(comFiltro),
                    dashboardApi.buscarIndicePecasFrias(comFiltro),
                    dashboardApi.buscarMotivosReentrada(semFiltro),
                    dashboardApi.buscarMotivosSaida(semFiltro),
                    dashboardApi.buscarTopCinco(comFiltro),
                    dashboardApi.buscarTopCincoMaisFrios(comFiltro),
                ]);

            setValorSaida(saida);
            setGiro(giroEstoque);
            setIndiceFrias(frias);
            setMotivosReentrada(reentrada ?? []);
            setMotivosSaida(saidas ?? []);
            setTopVendidos(vendidos ?? []);
            setTopFrios(frios ?? []);
        } catch {
            setToast({ message: 'Não foi possível carregar a dashboard.' });
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        const primeiraCarga = async () => {
            await carregar({ inicio, fim: termino, categoriaId });
        };
        primeiraCarga();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // Filtro opcional: se falhar, o select fica só com "Todas".
        categoriaApi.listarCategorias()
            .then((lista) => setCategorias(lista ?? []))
            .catch(() => setCategorias([]));
    }, []);

    const aplicar = () => {
        if (inicio > termino) {
            setToast({ message: 'A data de início não pode ser maior que a data de término.' });
            return;
        }
        carregar({ inicio, fim: termino, categoriaId });
    };

    const aplicarPeriodo = (tipo) => {
        const { inicio: novoInicio, fim: novoFim } = datasDoPeriodo(tipo);
        setPeriodoAtivo(tipo);
        setInicio(novoInicio);
        setTermino(novoFim);
        carregar({ inicio: novoInicio, fim: novoFim, categoriaId });
    };

    const periodoAnterior = (atual, anterior) => {
        if (atual == null || anterior == null || anterior === 0) return null;
        return Math.round(((atual - anterior) / Math.abs(anterior)) * 100);
    };

    const kpis = [
        {
            label: 'Valor de Saída',
            valor: formatarMoeda(valorSaida?.valorAtual),
            anterior: formatarMoeda(valorSaida?.valorAntigo),
            variacao: periodoAnterior(valorSaida?.valorAtual, valorSaida?.valorAntigo),
        },
        {
            label: 'Giro de estoque',
            valor: giro?.valorAtual != null ? `${giro.valorAtual.toFixed(1)}x` : '-',
            anterior: giro?.valorAntigo != null ? `${giro.valorAntigo.toFixed(2)}x` : '-',
            variacao: periodoAnterior(giro?.valorAtual, giro?.valorAntigo),
        },
        {
            label: 'Índice de peças frias',
            valor: indiceFrias?.indiceAtual != null ? `${indiceFrias.indiceAtual}%` : '-',
            anterior: indiceFrias?.indiceMesAnterior != null ? `${indiceFrias.indiceMesAnterior}%` : '-',
            variacao: periodoAnterior(indiceFrias?.indiceAtual, indiceFrias?.indiceMesAnterior),
        },
    ];

    return (
        <>
            {toast && <Toast message={toast.message} onClose={fecharToast} />}
            <PageHeader titulo="Dashboard" />

            <div className={style.page}>
                {/* Filtros */}
                <section className={style.card}>
                    <div className={style.filters}>
                        <h2 className={style.filtersTitle}>Filtros</h2>

                        <div className={style.filtersRow}>
                            <div className={style.fieldGroup}>
                                <div className={style.field}>
                                    <span className={style.fieldLabel}>Período</span>
                                    <div className={style.fieldGroup}>
                                        <div>
                                            <span className={style.fieldSubLabel}>Início</span>
                                            <div className={style.inputWrap}>
                                                <Calendar size={16} />
                                                <input
                                                    type="date"
                                                    value={paraInput(inicio)}
                                                    onChange={(e) => setInicio(deInput(e.target.value))}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <span className={style.fieldSubLabel}>Término</span>
                                            <div className={style.inputWrap}>
                                                <Calendar size={16} />
                                                <input
                                                    type="date"
                                                    value={paraInput(termino)}
                                                    onChange={(e) => setTermino(deInput(e.target.value))}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={style.field}>
                                <span className={style.fieldLabel}>Categoria</span>
                                <div className={`${style.inputWrap} ${style.select}`}>
                                    <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}>
                                        <option value="">Todas</option>
                                        {categorias.map((c) => (
                                            <option key={c.id} value={c.id}>{c.nome}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <button
                                className={style.applyBtn}
                                onClick={aplicar}
                                disabled={carregando}
                            >
                                {carregando ? 'Carregando…' : 'Aplicar Filtros'}
                            </button>
                        </div>

                        <hr className={style.filtersDivider} />

                        <div className={style.quickFilters}>
                            {[
                                ['mesAtual', 'Mês Atual'],
                                ['mesAnterior', 'Mês Passado'],
                                ['anoAtual', 'Ano atual'],
                                ['anoPassado', 'Ano Passado'],
                            ].map(([tipo, rotulo]) => (
                                <button
                                    key={tipo}
                                    className={`${style.quickBtn} ${periodoAtivo === tipo ? style.quickBtnActive : ''}`}
                                    onClick={() => aplicarPeriodo(tipo)}
                                >
                                    {rotulo}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* KPIs */}
                <div className={style.kpiGrid}>
                    {kpis.map((kpi) => (
                        <section key={kpi.label} className={style.card}>
                            <div className={style.kpiHead}>
                                <span className={style.kpiLabel}>{kpi.label}</span>
                                {kpi.variacao !== null && <Trend valor={kpi.variacao} />}
                            </div>
                            <div className={style.kpiValue}>{kpi.valor}</div>
                            <div className={style.kpiPrevious}>
                                Período anterior: <strong>{kpi.anterior}</strong>
                            </div>
                        </section>
                    ))}
                </div>

                {/* Entradas X Saídas */}
                <section className={style.card}>
                    <h3 className={style.cardTitle}>Entradas X Saídas</h3>
                    <div className={style.exsGrid}>
                        <div>
                            <div className={style.legend}>
                                <span className={style.legendItem}>
                                    <span className={style.legendDot} style={{ background: CORES.entradas }} />Entradas
                                </span>
                                <span className={style.legendItem}>
                                    <span className={style.legendDot} style={{ background: CORES.saidas }} />Saídas
                                </span>
                                <span className={style.legendItem}>
                                    <span className={style.legendDot} style={{ background: CORES.estoque }} />Peças em estoque
                                </span>
                            </div>
                            <div className={style.summaryList}>
                                {RESUMO_ENTRADAS_SAIDAS.map((r) => (
                                    <ResumoItem key={r.label} {...r} />
                                ))}
                            </div>
                        </div>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <BarChart data={QUADRO_ENTRADAS_SAIDAS} barGap={2}
                                    margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEEEEE" />
                                    <XAxis dataKey="mes" tick={{ fontSize: 13, fill: '#666' }}
                                        axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 13, fill: '#888' }}
                                        axisLine={false} tickLine={false} />
                                    <Tooltip />
                                    <Bar dataKey="entradas" fill={CORES.entradas} barSize={14} />
                                    <Bar dataKey="saidas" fill={CORES.saidas} barSize={14} />
                                    <Bar dataKey="estoque" fill={CORES.estoque} barSize={14} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </section>

                {/* Motivos */}
                <div className={style.motivosGrid}>
                    <GraficoMotivos titulo="Motivos Reentrada" dados={motivosReentrada} />
                    <GraficoMotivos titulo="Motivos Saída" dados={motivosSaida} />
                </div>

                {/* Rankings */}
                <div className={style.rankingGrid}>
                    <RankingVendidas dados={topVendidos} onAcessar={() => navigate('/joias')} />
                    <RankingFrias dados={topFrios} onAcessar={() => navigate('/joias')} />
                </div>
            </div>
        </>
    );
}
