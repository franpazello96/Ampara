'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './Sidebar.module.css';
import Financial from '../Financial/page';
import Image from "next/image";
import logo from "@/assets/logo.png";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className="flex justify-center items-center">
          <Image src={logo} alt="Logo" width={70} height={45} />
        </div>
        <nav>
          <ul>
            <li><Link href="/homeAdmin">Relatórios</Link></li>
            <li><Link href="/profile">Editar Perfil</Link></li>
            <li><Link href="/report">Lista de Entradas/Saídas</Link></li>

            <li><Link href="">Lista de doadores</Link></li>
            <li><Link href="">Lista de beneficiários</Link></li>

          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
