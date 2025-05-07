'use client';

import React from 'react';
import Link from 'next/link';
import styles from './sidebar.module.css';

const Sidebar: React.FC = () => {
  return (
    <div className={styles.sidebar}>
      <h2>Dashboard</h2>
      <nav>
        <ul>
          <li><Link href="/profile">Editar Perfil</Link></li>
          <li><Link href="/auth/report">Reports</Link></li>
          <li><Link href="/auth/signin">Cadastro de beneficiário</Link></li>
          <li><Link href="/auth/signupDoador">Lista de doadores</Link></li>
          <li><Link href="/auth/signupRecebedor">Lista de beneficiários</Link></li>
          <li><Link href="/home">Homepage</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
