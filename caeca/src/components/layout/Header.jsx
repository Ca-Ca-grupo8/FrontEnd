import React, { useEffect, useState } from 'react';
import { Gem, Users, History, TrendingUp, Home, Menu, X, User, LogOut } from 'lucide-react';
import '../../styles/Header.css';
import { NavLink, useLocation } from 'react-router-dom';
import api from '../../service/api';
import { usuarioApi } from '../../service/usuarioApi';
import { HttpStatusCode } from 'axios';
import { usuarioEhAdmin } from '../../utils/perfil';
import { obterIniciais } from '../../utils/obterIniciais';
import logoBranca from '../../assets/logoBranca.png';

export function Header({ avatarImg }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { pathname } = useLocation();
  const estaNaHome = pathname === '/';

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setActiveDropdown(null);
  };

  const toggleDropdown = (menuName) => {
    setActiveDropdown(activeDropdown === menuName ? null : menuName);
  };

  const closeAll = () => {
    setIsOpen(false);
    setActiveDropdown(null);
  };

  const logout = async () => {
    try {
      await usuarioApi.logout();
    } catch(e) {
    } finally {
      localStorage.clear();
      closeAll();
      navigate('/login');
    }
  }

  const nomeUsuario = localStorage.getItem("nome_usuario") || "Visitante";
  const roleUsuario = localStorage.getItem("role_usuario");

  const roleUsuarioSplitado = roleUsuario?.split("_") ?? [];
  const roleUsuarioFormatted = roleUsuarioSplitado.includes("USER") ? "Funcionário" : "Administrador";

  return (
    <nav className="header-nav">
      
      <div className={`user-profile-wrapper ${activeDropdown === 'perfil' ? 'show-dropdown' : ''}`}>
        <div className="user-profile" onClick={() => toggleDropdown('perfil')} style={{ cursor: 'pointer' }}>
          {avatarImg ? (
            <img src={avatarImg} alt="Foto de perfil" className="user-avatar" />
          ) : (
            <span className="user-avatar user-avatar-iniciais" aria-label="Iniciais do usuário">{obterIniciais(nomeUsuario)}</span>
          )}
          <div className="user-info">
            {!estaNaHome && <span className="user-name">{nomeUsuario}</span>}
            {!estaNaHome && <span className="user-desc">{roleUsuarioFormatted}</span>}
          </div>
        </div>
        
        <div className="dropdown-menu profile-dropdown">
          <NavLink to="/perfil" onClick={closeAll}>
            <User size={16} style={{ marginRight: '8px' }} /> Meu Perfil
          </NavLink>
          <NavLink to="/login" onClick={logout} className="logout-link">
            <LogOut size={16} style={{ marginRight: '8px' }} /> Sair
          </NavLink>
        </div>
      </div>

      <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      <div className={`nav-menu ${isOpen ? 'open' : ''}`}>
        
        {/* Container da Logomarca no topo da Sidebar */}
        <div className="sidebar-logo-container">
          <img src={logoBranca} alt="Logomarca Caeca" className="sidebar-logo-img" />
        </div>

        <div className={`nav-item-wrapper ${activeDropdown === 'joias' ? 'show-dropdown' : ''}`}>
          <button className="nav-item has-dropdown" onClick={() => toggleDropdown('joias')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Gem size={24} />
              <span className="nav-label">Jóias</span>
            </div>
          </button>
          <div className="dropdown-menu">
            <NavLink to="/joias" onClick={closeAll}>Catálogo</NavLink>
            <NavLink to="/movimentacoes" onClick={closeAll}>Movimentações</NavLink>
          </div>
        </div>

        <div className={`nav-item-wrapper ${activeDropdown === 'contribuintes' ? 'show-dropdown' : ''}`}>
          <button className="nav-item has-dropdown" onClick={() => toggleDropdown('contribuintes')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Users size={24} />
              <span className="nav-label">Contribuintes</span>
            </div>
          </button>
          <div className="dropdown-menu">
            {usuarioEhAdmin() && (
              <NavLink to="/contribuintes" onClick={closeAll}>Contribuintes</NavLink>
            )}
            <NavLink to="/contribuintes/revendedoras" onClick={closeAll}>Revendedoras</NavLink>
            {usuarioEhAdmin() && (
              <NavLink to="/contribuintes/fornecedores" onClick={closeAll}>Fornecedores</NavLink>
            )}
            {usuarioEhAdmin() && (
              <NavLink to="/contribuintes/funcionarios" onClick={closeAll}>Funcionários</NavLink>
            )}
          </div>
        </div>

        <div className={`nav-item-wrapper ${activeDropdown === 'historico' ? 'show-dropdown' : ''}`}>
          <button className="nav-item has-dropdown" onClick={() => toggleDropdown('historico')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <History size={24} />
              <span className="nav-label">Histórico</span>
            </div>
          </button>
          <div className="dropdown-menu">
            <NavLink to="/joias/movimentacoes" onClick={closeAll}>Movimentações</NavLink>
            <NavLink to="/joias/maletas" onClick={closeAll}>Maletas</NavLink>
          </div>
        </div>

        {usuarioEhAdmin() && (
          <NavLink to="/dashboard" className="nav-item" onClick={closeAll}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <TrendingUp size={24} />
              <span className="nav-label">Métricas</span>
            </div>
          </NavLink>
        )}

        <NavLink to="/" className="nav-item" end onClick={closeAll}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Home size={24} />
            <span className="nav-label">Home</span>
          </div>
        </NavLink>
      </div>
    </nav>
  );
}