import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'

import { Layout } from './components/layout/Layout.jsx';
import { EntradaJoia } from './pages/EntradaJoia.jsx'
import { Login } from './pages/Login.jsx';
import { SaidaJoia } from './pages/SaidaJoia.jsx';
import { Home } from './pages/home/Home.jsx';
import { MovimentacaoEscolhas } from './pages/movimentacao/movimentacaoEscolhas.jsx';
import { CadastroContribuintes } from './pages/cadastroContribuintes/CadastroContribuintes.jsx';
import { MovimentacaoEstoque } from './pages/movimentacaoEstoque/movimentacaoEstoque.jsx';
import { EntradaJoiaExistente } from './pages/entradaJoiaExistente/EntradaJoiaExistente.jsx';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/contribuintes',
        element: <CadastroContribuintes />,
      },
      {
        path: '/movimentacoes',
        element: <MovimentacaoEscolhas />,
      },
      {
        path: '/movimentacoes/entrada',
        element: <EntradaJoia />,
      },
      {
        path: '/movimentacoes/entradaexistente',
        element: <EntradaJoiaExistente />,
      },
      {
        path: '/movimentacoes/saida',
        element: <SaidaJoia />,
      },
      {
        path: '/historico/movimentacoes',
        element: <MovimentacaoEstoque />,
      }
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)