'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Sidebar.module.css';
import Image from "next/image";
import logo from "@/assets/logo.png";
import { RiBarChartFill } from 'react-icons/ri';
import { BiTransfer } from 'react-icons/bi';
import { HiUsers, HiOutlineUserGroup, HiOutlineShoppingBag } from 'react-icons/hi';
import { IoAccessibilityOutline, IoLogOutOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("Email não disponível");
  const router = useRouter();

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem("userType");
    localStorage.removeItem("email");
    toast.success("Logout realizado com sucesso!");
    router.push('/');
  };

  return (
    <>
      <button onClick={toggleSidebar} className={styles['toggle-button']}>
        ☰
      </button>

      <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className="flex justify-center py-6">
          <Image src={logo} alt="Logo" width={70} height={45} />
        </div>

        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-2 px-2">
            <li>
              <Link href="/dashboard" className="flex items-center px-4 py-2 rounded-lg text-white hover:bg-zinc-700">
                <RiBarChartFill className="w-5 h-5 mr-3" /> Dashboard
              </Link>
            </li>
            <li>
              <Link href="/report" className="flex items-center px-4 py-2 rounded-lg text-white hover:bg-zinc-700">
                <BiTransfer className="w-5 h-5 mr-3" /> Lista de Entradas/Saídas
              </Link>
            </li>
            <li>
              <Link href="/donators" className="flex items-center px-4 py-2 rounded-lg text-white hover:bg-zinc-700">
                <HiUsers className="w-5 h-5 mr-3" /> Lista de Doadores
              </Link>
            </li>
            <li>
              <Link href="/beneficiaries" className="flex items-center px-4 py-2 rounded-lg text-white hover:bg-zinc-700">
                <HiOutlineUserGroup className="w-5 h-5 mr-3" /> Lista de Beneficiários
              </Link>
            </li>
            <li>
              <Link href="/buys" className="flex items-center px-4 py-2 rounded-lg text-white hover:bg-zinc-700">
                <HiOutlineShoppingBag className="w-5 h-5 mr-3" /> Cadastro de compras
              </Link>
            </li>
            <li>
              <Link href="/signupBenefitiary" className="flex items-center px-4 py-2 rounded-lg text-white hover:bg-zinc-700">
                <IoAccessibilityOutline className="w-5 h-5 mr-3" /> Cadastro de Beneficiários
              </Link>
            </li>
          </ul>
        </nav>

        <div className="mt-auto border-t border-zinc-700 px-4 py-5">
          <div className="text-center mb-3 space-y-1">
            <p className="text-xs text-zinc-200 mt-3 font-semibold">Bem-vindo, donatário!</p>
            <p className="text-xs text-zinc-400">{email}</p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-4 py-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
          >
            <IoLogOutOutline className="w-5 h-5 mr-2" /> Sair
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
