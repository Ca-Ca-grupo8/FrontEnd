import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterContextProvider, RouterProvider } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import { EntradaJoia } from './pages/EntradaJoia.jsx'
import { Login } from './pages/Login.jsx';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login/>,        
  },
  {
    path: '/joias/movimentacoes/entrada',
    element: <EntradaJoia />,
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
