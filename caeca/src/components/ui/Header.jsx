import React from 'react';
import { Gem, Users, History, TrendingUp, Home } from 'lucide-react';
import '../../styles/Header.css';
import { NavLink } from 'react-router-dom';

export function Header({avatarImg, username = "nome", description = "description"}) {
  return (
    <div className="header-nav">
      <div className="user-profile">
        <img 
          src={avatarImg} 
          alt="Foto de perfil" 
          className="user-avatar" 
        />
        <div className="user-info">
          <span className="user-name">{username}</span>
          <span className="user-desc">{description}</span>
        </div>
      </div>
      <div className="nav-menu">
        <NavLink to="/joias" className="nav-item">
          <Gem size={24} />
          <span className="nav-label">Jóias</span>
        </NavLink>

        <NavLink to="/contribuintes" className="nav-item">
          <Users size={24} />
          <span className="nav-label">Contribuintes</span>
        </NavLink>

        <NavLink to="/historico" className="nav-item">
          <History size={24} />
          <span className="nav-label">Histórico</span>
        </NavLink>

        <NavLink to="/metricas" className="nav-item">
          <TrendingUp size={24} />
          <span className="nav-label">Métricas</span>
        </NavLink>

        <NavLink to="/" className="nav-item" end>
          <Home size={24} />
          <span className="nav-label">Home</span>
        </NavLink>
      </div>
    </div>
  );
}