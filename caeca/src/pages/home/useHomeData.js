import { useEffect, useState } from 'react';
import { dashboardApi } from '../../service/dashboardApi';
import { joiaApi } from '../../service/joiaApi';
import { movimentacaoApi } from '../../service/movimentacaoApi';
import { notificacaoEnvioApi } from '../../service/notificacaoEnvioApi';
import { vendaApi } from '../../service/maletasApi';

const TOP = 5;
const ULTIMAS_MOVIMENTACOES = 5;
const ULTIMOS_ENVIOS = 5;

// Semana corrente, de segunda a domingo. Os endpoints do dashboard comparam
// sozinhos com o período anterior de mesmo tamanho (semana passada).
const semanaAtual = () => {
    const hoje = new Date();
    const diaDaSemana = (hoje.getDay() + 6) % 7;
    const inicio = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - diaDaSemana);
    const fim = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate() + 6, 23, 59, 59);
    return { inicio, fim };
};

// Cada bloco é uma chamada independente: se um endpoint falhar, só aquele
// bloco mostra erro e o resto da Home continua preenchida.
export function useHomeData() {
    const [estado, setEstado] = useState({ carregando: true, dados: {}, erros: {} });

    useEffect(() => {
        let ativo = true;

        const semana = semanaAtual();
        const filtroSemana = {
            dataInicio: semana.inicio.toISOString(),
            dataTermino: semana.fim.toISOString(),
            categoriaId: null,
        };

        const blocos = {
            kpis: dashboardApi.buscarKpisEGrafico(filtroSemana).then((r) => r.kpis),
            topVendidos: dashboardApi.buscarTopCinco(filtroSemana),
            repor: joiaApi.listarAbaixoDoMinimo(TOP),
            maletas: vendaApi.buscarResumo(),
            ultimas: movimentacaoApi
                .buscarMovimentacoes({ page: 0, size: ULTIMAS_MOVIMENTACOES, sort: 'data,desc' })
                .then((pagina) => pagina.content ?? []),
            envios: notificacaoEnvioApi
                .listarEnvios({ size: ULTIMOS_ENVIOS })
                .then((pagina) => pagina.content ?? []),
        };

        const chaves = Object.keys(blocos);

        Promise.allSettled(Object.values(blocos)).then((resultados) => {
            if (!ativo) return;

            const dados = {};
            const erros = {};
            resultados.forEach((resultado, i) => {
                if (resultado.status === 'fulfilled') {
                    dados[chaves[i]] = resultado.value;
                } else {
                    erros[chaves[i]] = true;
                }
            });

            setEstado({ carregando: false, dados, erros });
        });

        return () => {
            ativo = false;
        };
    }, []);

    return estado;
}
