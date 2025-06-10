'use client';

import { ThemeToggle } from "@/components/ThemeToggle";
import logo from "@/assets/logo.png";
import Image from "next/image";
import SidebarDoador from "@/components/SidebarDoador/page";
import FinancialDoador from "@/components/FinancialDoador/page";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import { useEffect } from "react";

export default function Report() {
  const { isAuthenticated, user } = useAuth("donator");

  useEffect(() => {
    if (!isAuthenticated) {
      toast.warn("Você precisa estar logado para acessar esta página.");
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen flex">
      <aside className="w-64">
        <SidebarDoador />
      </aside>

      <main className="flex-1 flex flex-col items-center justify-center p-10">
        <Image src={logo} alt="Logo" width={108.5} height={30} className="mb-4" />
        <ThemeToggle />
        <h1 className="text-2xl font-bold mt-4">Relatório de Doações</h1>
      </main>
    </div>
  );
}
