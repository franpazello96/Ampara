"use client";

import Image from "next/image";
import logo from "@/assets/logo.png";
import { Button } from "@/components/button";
import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle"; 

export default function HomePage() {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="min-h-screen w-full bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
      <header className="flex justify-between items-center px-30 py-6 shadow-md bg-white dark:bg-zinc-800">
        <div className="flex items-center space-x-4">
          <Image src={logo} alt="Logo" width={140} height={45} />
        </div>

        <nav className="flex items-center space-x-20 text-xl">
          <Link href="#quem-somos" className="hover:underline">Quem Somos</Link>
          <Link href="#objetivo" className="hover:underline">Nosso Objetivo</Link>
          <Link href="#ongs" className="hover:underline">ONG’s Parceiras</Link>

          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)} 
              className="hover:underline focus:outline-none"
            >
              Cadastro
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded shadow-lg z-10">
                <Link href="/signupDoador" className="block px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700">Sou Doador</Link>
                <Link href="/signupRecebedor" className="block px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700">Sou Recebedor</Link>
              </div>
            )}
          </div>

          <Link href="/signin">
            <Button>Login</Button>
          </Link>
        </nav>
        <ThemeToggle />
      </header>

      <main className="flex flex-col items-center justify-center w-full px-4 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Bem-vindo ao Nosso Projeto
        </h1>
        <p className="text-lg md:text-xl w-full mb-10">
          Conectamos doadores com instituições e pessoas que precisam. Junte-se a nós nessa corrente do bem!
        </p>
        <Link href="/signupDoador">
          <Button className="px-8 py-3 text-lg bg-violet-600 hover:bg-violet-700 text-white rounded-lg">
            Quero Ajudar
          </Button>
        </Link>
      </main>

      <section id="quem-somos" className="w-full px-4 py-16 bg-zinc-100 dark:bg-zinc-800">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Quem Somos</h2>
        <p className="text-base md:text-lg w-full">
          Somos uma iniciativa que visa facilitar o encontro entre quem quer ajudar e quem precisa de ajuda.
        </p>
      </section>

      <section id="objetivo" className="w-full px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Nosso Objetivo</h2>
        <p className="text-base md:text-lg w-full">
          Promover solidariedade e facilitar o processo de doação com segurança, agilidade e transparência.
        </p>
      </section>

      <section id="ongs" className="w-full px-4 py-16 bg-zinc-100 dark:bg-zinc-800">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">ONG's Parceiras</h2>
        <p className="text-base md:text-lg w-full">
          Conheça algumas das instituições com as quais trabalhamos lado a lado para fazer a diferença.
        </p>
      </section>

      <footer className="text-center py-6 text-sm text-zinc-500 dark:text-zinc-400">
        © {new Date().getFullYear()} - Ampara - Todos os direitos reservados.
      </footer>
    </div>
  );
}
