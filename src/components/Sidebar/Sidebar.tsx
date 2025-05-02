import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css'; 

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <h2>Dashboard</h2>
      <nav>
        <ul>
            <li><NavLink to="">Editar Perfil</NavLink></li>
          <li><NavLink to="/auth/report">Reports</NavLink></li>
          <li><NavLink to="/auth/signin">Cadastro de beneficiário</NavLink></li> 
          <li><NavLink to="/auth/signupDoador">Lista de doadores</NavLink></li>
          <li><NavLink to="/auth/signupRecebedor">Lista de beneficiários</NavLink></li>
          <li><NavLink to="/homepage">Homepage</NavLink></li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;