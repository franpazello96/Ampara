'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './Sidebar.module.css';
import Financial from '../Financial/page';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>

      <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <nav>
          <ul>
            <li><Link href="/homeAdmin">Homepage</Link></li>
            <li><Link href="/profile">Editar Perfil</Link></li>
            <li><Link href="/report">Financeiro</Link></li>

            <li><Link href="">Lista de doadores</Link></li>
            <li><Link href="">Lista de beneficiários</Link></li>

          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
