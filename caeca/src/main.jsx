import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterContextProvider, RouterProvider } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import { EntradaJoia } from './pages/EntradaJoia.jsx'
import { Login } from './pages/Login.jsx';
import { SaidaJoia } from './pages/SaidaJoia.jsx';
import { Home } from './pages/home/Home.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login/>,        
  },
  {
    path: '/joias/movimentacoes/entrada',
    element: <EntradaJoia />,
  },
  {
    path: '/joias/movimentacoes/saida',
    element: <SaidaJoia />,
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
