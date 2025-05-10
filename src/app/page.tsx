"use client";

import Image from "next/image";
import logo from "@/assets/logo.png";
import donationsImg from "@/assets/Donations.png";
import charityImg from "@/assets/Charity.png";
import { Button } from "@/components/button";
import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function HomePage() {
  const [showDropdown, setShowDropdown] = useState(false);

export default function Home() {
    const [showDropdown, setShowDropdown] = useState(false);
    const carouselRef = useRef<Carousel | null>(null);

    const handleCarouselChange = (index: number) => {
      if (carouselRef.current) {
        carouselRef.current.moveTo(index);
      }
    };
  return (
    <div className="min-h-screen w-full bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
      <header className="flex justify-between items-center px-8 py-6 shadow-md bg-white dark:bg-zinc-800">
        <div className="flex items-center space-x-4">
          <Image src={logo} alt="Logo" width={140} height={45} />
        </div>

        <nav className="flex items-center space-x-8 text-base font-medium">
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

      <main className="flex flex-col items-center justify-center px-6 md:px-20 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Bem-vindo ao Nosso Projeto
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mb-10">
          Conectamos doadores com instituições e pessoas que precisam. Junte-se a nós nessa corrente do bem!
        </p>
        <Link href="/signupDoador">
          <Button className="px-8 py-3 text-lg bg-violet-600 hover:bg-violet-700 text-white rounded-lg">
            Quero Ajudar
          </Button>
        </Link>
      </main>

      <section id="quem-somos" className="w-full px-6 md:px-20 py-16 bg-zinc-100 dark:bg-zinc-800 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-4">Quem Somos</h2>
        <p className="text-base md:text-lg max-w-4xl mx-auto">
          Somos uma iniciativa que conecta pessoas dispostas a ajudar com ONGs e instituições que realmente precisam. 
          Buscamos criar pontes entre a solidariedade e a necessidade. Nosso compromisso é transformar boas intenções 
          em impacto real e positivo.
        </p>
        <div className="flex justify-center mt-10">
          <Image 
            src={charityImg} 
            alt="Imagem de caridade"
            width={250  }
            height={350}
          />
        </div>
      </section>

      <section id="objetivo" className="w-full px-6 md:px-20 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-4">Nosso Objetivo</h2>
        <p className="text-base md:text-lg max-w-4xl mx-auto mb-10">
          Nosso objetivo é promover a solidariedade por meio da tecnologia, aproximando doadores de causas que impactam vidas. 
          Queremos tornar o processo de doação acessível, transparente e confiável. Trabalhamos para ampliar o alcance das ONGs 
          e fortalecer redes de apoio em todo o país.
        </p>
        <div className="flex justify-center">
          <Image 
            src={donationsImg} 
            alt="Imagem de doação"
          />
        </div>
      </section>

      <section id="ongs" className="w-full px-6 md:px-20 py-16 bg-zinc-100 dark:bg-zinc-800 text-left">
        <h2 className="text-3xl md:text-4xl font-semibold mb-4">ONG's Parceiras</h2>
        <p className="text-base md:text-lg max-w-4xl">
          Conheça algumas das instituições com as quais trabalhamos lado a lado para fazer a diferença.
        </p>
      </section>

      <footer className="text-center py-6 text-sm text-zinc-500 dark:text-zinc-400">
        © {new Date().getFullYear()} - Ampara - Todos os direitos reservados.
      </footer>
    </div>
  );
}
