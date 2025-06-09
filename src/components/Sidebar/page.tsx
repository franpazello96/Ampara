'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Sidebar.module.css';
import Image from "next/image";
import logo from "@/assets/logo.png";
import { RiBarChartFill } from 'react-icons/ri';
import { BiTransfer } from 'react-icons/bi';
import { HiUsers, HiOutlineUserGroup } from 'react-icons/hi';
import { IoLogOutOutline } from 'react-icons/io5';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    // Implementar lógica de logout aqui
    localStorage.removeItem('token'); // Remove o token de autenticação
    router.push('/'); // Redireciona para a página inicial
  };

  return (
    <>
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className="flex justify-center py-6">
          <Image src={logo} alt="Logo" width={70} height={45} />
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <Link 
                href="/homeAdmin" 
                className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-zinc-700"
              >
                <RiBarChartFill className="w-5 h-5 mr-3" />
                Relatórios
              </Link>
            </li>
            <li>
              <Link 
                href="/report" 
                className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-zinc-700"
              >
                <BiTransfer className="w-5 h-5 mr-3" />
                Lista de Entradas/Saídas
              </Link>
            </li>
            <li>
              <Link 
                href="/donators" 
                className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-zinc-700"
              >
                <HiUsers className="w-5 h-5 mr-3" />
                Lista de Doadores
              </Link>
            </li>
            <li>
              <Link 
                href="/beneficiaries" 
                className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-zinc-700"
              >
                <HiOutlineUserGroup className="w-5 h-5 mr-3" />
                Lista de Beneficiários
              </Link>
            </li>
          </ul>
        </nav>

        {/* Perfil e Botão de Sair */}
        <div className="mt-auto border-t border-gray-200 dark:border-zinc-700">
          <div className="p-4">
            <div className="flex items-center space-x-3 mb-4">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-purple-500 hover:border-purple-600 transition-colors focus:outline-none"
              >
                <div className="w-full h-full bg-purple-200 dark:bg-purple-800 flex items-center justify-center">
                  <span className="text-sm font-semibold text-purple-700 dark:text-purple-200">
                    A
                  </span>
                </div>
              </button>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">Admin</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">admin@ampara.com</p>
              </div>
              
              {/* Dropdown do Perfil */}
              {isProfileOpen && (
                <div className="absolute bottom-20 left-4 w-48 bg-zinc-800 dark:bg-zinc-800 rounded-lg shadow-lg py-2 z-50">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-zinc-700"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Editar Perfil
                  </Link>
                </div>
              )}
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-zinc-700 rounded-lg transition-colors"
            >
              <IoLogOutOutline className="w-5 h-5 mr-3" />
              Sair
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
