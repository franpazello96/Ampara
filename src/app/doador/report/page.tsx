'use client';

import { ThemeToggle } from "@/components/ThemeToggle";
import logo from "@/assets/logo.png";
import Image from "next/image";
import SidebarDoador from "@/components/SidebarDoador/page";
import FinancialDonator from "@/components/FinancialDonator/page";
import { useAuth } from "@/hooks/useAuth";

export default function Report() {
  const { isAuthenticated, user } = useAuth("donator");

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-zinc-900">
      <aside className="w-64">
        <SidebarDoador />
      </aside>

      <div className="max-w-7xl mx-auto w-full space-y-12">
        <div className="flex flex-col items-center">
          <Image src={logo} alt="Logo" width={120} height={40} className="mb-4" />
          <ThemeToggle />
          <h1 className="text-3xl font-bold mt-4 text-center">Relatório de Doações</h1>
        </div>

        {/* Corpo do relatório */}
        <FinancialDonator />
      </div>
    </div>
  );
}
