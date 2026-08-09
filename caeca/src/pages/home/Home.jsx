import { Breadcrumbs } from "../../components/ui/Breadcrumbs";
import { Header } from "../../components/layout/Header";
import { PageHeader } from "../../components/ui/PageHeader";
import { CardHome } from "./components/CardHome";
import styles from "./Home.module.css";
import { Footer } from "../../components/layout/Footer";

export function Home() {
    const ITENS_CARDS = [
        {
            "titulo": "Realizar movimentação",
            "subtitulo": "Entradas e saídas de peças com registro automático.",
            "img": (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 15 15">
                <path d="M0 0h15v15H0z" fill="none" />
                <path fill="#91194a" d="M12 8.5a4.5 4.5 0 1 1-9 0a4.5 4.5 0 0 1 2.71-4.125l.176.137l.774.601A3.5 3.5 0 0 0 4 8.5C4 10.43 5.57 12 7.5 12S11 10.43 11 8.5a3.5 3.5 0 0 0-2.66-3.387l.95-.738A4.5 4.5 0 0 1 12 8.5m-4.5-4L10 2.555L9 1H6L5 2.555l1.5 1.167z" />
            </svg>),
            "path": "/movimentacoes"
        },
        {
            "titulo": "Cadastro de contribuintes",
            "subtitulo": "Gestão de fornecedoras e equipe interna.",
            "img": (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                <path d="M0 0h24v24H0z" fill="none" />
                <path fill="#91194a" d="M9.175 10.825Q8 9.65 8 8t1.175-2.825T12 4t2.825 1.175T16 8t-1.175 2.825T12 12t-2.825-1.175M4 20v-2.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2V20zm2-2h12v-.8q0-.275-.137-.5t-.363-.35q-1.35-.675-2.725-1.012T12 15t-2.775.338T6.5 16.35q-.225.125-.363.35T6 17.2zm7.413-8.587Q14 8.825 14 8t-.587-1.412T12 6t-1.412.588T10 8t.588 1.413T12 10t1.413-.587M12 18" />
            </svg>
            )

        },
        {
            "titulo": "Relatórios",
            "subtitulo": "Análise de giro de estoque e peças mais vendidas.",
            "img": (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                <path d="M0 0h24v24H0z" fill="none" />
                <path fill="#91194a" d="M17.576 10.48a.75.75 0 0 0-1.152-.96l-1.797 2.156c-.37.445-.599.716-.786.885a.8.8 0 0 1-.163.122l-.011.005l-.011-.005a.8.8 0 0 1-.164-.122c-.187-.17-.415-.44-.786-.885l-.292-.35c-.328-.395-.625-.75-.901-1c-.301-.272-.68-.514-1.18-.514s-.878.242-1.18.514c-.276.25-.572.605-.9 1l-1.83 2.194a.75.75 0 1 0 1.153.96l1.797-2.156c.37-.445.599-.716.786-.885a.8.8 0 0 1 .163-.122l.011-.005l.011.005a.8.8 0 0 1 .164.122c.187.17.415.44.786.885l.292.35c.329.395.625.75.901 1c.301.272.68.514 1.18.514s.878-.242 1.18-.514c.276-.25.572-.605.9-1z" />
                <path fill="#91194a" fill-rule="evenodd" d="M11.943 1.25c-2.309 0-4.118 0-5.53.19c-1.444.194-2.584.6-3.479 1.494c-.895.895-1.3 2.035-1.494 3.48c-.19 1.411-.19 3.22-.19 5.529v.114c0 2.309 0 4.118.19 5.53c.194 1.444.6 2.584 1.494 3.479c.895.895 2.035 1.3 3.48 1.494c1.411.19 3.22.19 5.529.19h.114c2.309 0 4.118 0 5.53-.19c1.444-.194 2.584-.6 3.479-1.494c.895-.895 1.3-2.035 1.494-3.48c.19-1.411.19-3.22.19-5.529v-.114c0-2.309 0-4.118-.19-5.53c-.194-1.444-.6-2.584-1.494-3.479c-.895-.895-2.035-1.3-3.48-1.494c-1.411-.19-3.22-.19-5.529-.19zM3.995 3.995c.57-.57 1.34-.897 2.619-1.069c1.3-.174 3.008-.176 5.386-.176s4.086.002 5.386.176c1.279.172 2.05.5 2.62 1.069c.569.57.896 1.34 1.068 2.619c.174 1.3.176 3.008.176 5.386s-.002 4.086-.176 5.386c-.172 1.279-.5 2.05-1.069 2.62c-.57.569-1.34.896-2.619 1.068c-1.3.174-3.008.176-5.386.176s-4.086-.002-5.386-.176c-1.279-.172-2.05-.5-2.62-1.069c-.569-.57-.896-1.34-1.068-2.619c-.174-1.3-.176-3.008-.176-5.386s.002-4.086.176-5.386c.172-1.279.5-2.05 1.069-2.62" clip-rule="evenodd" />
            </svg>

            )
        },
        {
            "titulo": "Histórico",
            "subtitulo": "Registro completo de todas as alterações no sistema.",
            "img": (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                <path d="M0 0h24v24H0z" fill="none" />
                <path fill="#91194a" d="M12 21q-3.45 0-6.012-2.287T3.05 13H5.1q.35 2.6 2.313 4.3T12 19q2.925 0 4.963-2.037T19 12t-2.037-4.962T12 5q-1.725 0-3.225.8T6.25 8H9v2H3V4h2v2.35q1.275-1.6 3.113-2.475T12 3q1.875 0 3.513.713t2.85 1.924t1.925 2.85T21 12t-.712 3.513t-1.925 2.85t-2.85 1.925T12 21m2.8-4.8L11 12.4V7h2v4.6l3.2 3.2z" />
            </svg>
            )
        }
    ]
    return (
        <>
            <Breadcrumbs />
            <PageHeader
                titulo={"Controle de estoque"}
                subtitulo={"Gerencie suas semijoias com elegância e precisão."}
            />
            <div className={styles.containerHome}>
                {ITENS_CARDS.map((item) => (
                    <CardHome
                        titulo={item.titulo}
                        subtitulo={item.subtitulo}
                        img={item.img}
                        path={item.path} />
                ))}
            </div>
        </>
    )
}