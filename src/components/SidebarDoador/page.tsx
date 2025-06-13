'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './SidebarDoador.module.css';
import Image from 'next/image';
import logo from '@/assets/logo.png';
import { BiTransfer } from 'react-icons/bi';
import { IoLogOutOutline } from 'react-icons/io5';
import { MdOutlineVolunteerActivism } from 'react-icons/md';
import { HiOutlineUser } from 'react-icons/hi2';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuth("donator");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    toast.success("Logout realizado com sucesso!");
    router.push("/signin");
  };

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ''} bg-zinc-900 min-h-screen flex flex-col`}>
      <div className="flex justify-center py-6">
        <Image src={logo} alt="Logo" width={70} height={45} />
      </div>

      <nav className="flex-1">
        <ul className="space-y-2 px-2">
          <li>
            <Link
              href="/doador/donation"
              className="flex items-center px-4 py-2 rounded-lg text-white hover:bg-zinc-700 transition-colors"
            >
              <MdOutlineVolunteerActivism className="w-5 h-5 mr-3" />
              Fazer uma Doação
            </Link>
          </li>
          <li>
            <Link
              href="/doador/profile"
              className="flex items-center px-4 py-2 rounded-lg text-white hover:bg-zinc-700 transition-colors"
            >
              <HiOutlineUser className="w-5 h-5 mr-3" />
              Editar Perfil
            </Link>
          </li>
          <li>
            <Link
              href="/doador/report"
              className="flex items-center px-4 py-2 rounded-lg text-white hover:bg-zinc-700 transition-colors"
            >
              <BiTransfer className="w-5 h-5 mr-3" />
              Lista de Doações
            </Link>
          </li>
        </ul>
      </nav>

      <div className="mt-auto border-t border-zinc-700 px-4 py-5">
        <div className="text-center mb-3 space-y-1">
          <p className="text-xs text-zinc-200 mt-3 font-semibold">
            Olá doador!<br />Que tal fazer o bem hoje?
          </p>
          <p>a</p>
          <h3 className="text-sm font-medium text-zinc-200">Doador</h3>
          <p className="text-xs text-zinc-400">
            {user?.email ?? "Email não disponível"}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full px-4 py-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
        >
          <IoLogOutOutline className="w-5 h-5 mr-2" />
          Sair
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
