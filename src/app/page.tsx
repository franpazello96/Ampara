"use client";

import Image from "next/image";
import logo from "@/assets/logo.png";
import donationsImg from "@/assets/Donations.png";
import charityImg from "@/assets/Charity.png";
import { Button } from "@/components/button";
import Link from "next/link";
import { useState, useRef } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

export default function Home() {
    const [showDropdown, setShowDropdown] = useState(false);
    const carouselRef = useRef<Carousel | null>(null);

    const handleCarouselChange = (index: number) => {
      if (carouselRef.current) {
        carouselRef.current.moveTo(index);
      }
    };
  return (
    <div className="font-sans bg-gradient-to-r from-indigo-500 to-purple-600 dark:bg-zinc-900">
      <header className="w-full bg-white dark:bg-zinc-800 shadow-lg px-8 py-6">
        <div className="flex items-center justify-between">
          <Image src={logo} alt="Logo" width={140} height={45} />
          <Button
            className="md:hidden focus:outline-none"
            onClick={() => setShowDropdown(!showDropdown)}
            title="Toggle Menu"
          >
            <svg
              className="w-6 h-6 text-zinc-900 dark:text-zinc-100"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>

          <nav className="hidden md:flex items-center space-x-25 text-xl font-medium text-zinc-900 dark:text-zinc-100">
            <Link
              href="#quem-somos"
              onClick={() => handleCarouselChange(0)}
              className="hover:text-violet-600 transition-all"
            >
              Quem Somos
            </Link>
            <Link
              href="#objetivo"
              onClick={() => handleCarouselChange(1)}
              className="hover:text-violet-600 transition-all"
            >
              Nosso Objetivo
            </Link>
            <Link
              href="#ongs"
              onClick={() => handleCarouselChange(2)}
              className="hover:text-violet-600 transition-all"
            >
              ONG’s Parceiras
            </Link>

            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-lg shadow-lg focus:outline-none transition-all"
              >
                Cadastro
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg z-10">
                  <Link
                    href="/signupDoador"
                    className="block px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all"
                  >
                    Sou Doador
                  </Link>
                  <Link
                    href="/signupRecebedor"
                    className="block px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all"
                  >
                    Sou Recebedor
                  </Link>
                </div>
              )}
            </div>

            <Link href="/signin">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md transition-all">
                Login
              </Button>
            </Link>
            <ThemeToggle />
          </nav>
        </div>

        {showDropdown && (
          <div className="md:hidden mt-4 flex flex-col space-y-4 text-base font-medium">
            <Link
              href="#quem-somos"
              onClick={() => handleCarouselChange(0)}
              className="hover:text-violet-600 transition-all"
            >
              Quem Somos
            </Link>
            <Link
              href="#objetivo"
              onClick={() => handleCarouselChange(1)}
              className="hover:text-violet-600 transition-all"
            >
              Nosso Objetivo
            </Link>
            <Link
              href="#ongs"
              onClick={() => handleCarouselChange(2)}
              className="hover:text-violet-600 transition-all"
            >
              ONG’s Parceiras
            </Link>
            <Link href="/signupDoador">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-lg shadow-lg transition-all">
                Cadastro Doador
              </Button>
            </Link>
            <Link href="/signupRecebedor">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-lg shadow-lg transition-all">
                Cadastro Recebedor
              </Button>
            </Link>
            <Link href="/signin">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md transition-all">
                Login
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        )}
      </header>

      <section className="text-center py-20 px-6 md:px-20 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-lg shadow-lg">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
          Bem-vindo ao Nosso Projeto
        </h1>
        <p className="text-lg md:text-2xl mb-6 max-w-2xl mx-auto">
          Conectamos doadores com instituições de forma fácil e moderna. Junte-se
          a nós nessa corrente do bem e ajude a transformar vidas!
        </p>
        <Link href="/signupDoador">
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 text-lg rounded-lg transition-all">
            Quero Ajudar
          </Button>
        </Link>
      </section>

      <section className="w-full px-6 md:px-20 py-20 bg-zinc-100 dark:bg-zinc-800 text-purple-800 dark:text-white">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Descubra Mais Sobre Nosso Impacto
          </h2>
          <p className="text-lg md:text-xl mt-4">
            Explore as seções abaixo para entender melhor nossa missão e os
            projetos que estamos conduzindo com o apoio de todos!
          </p>
        </div>
        <Carousel
          ref={carouselRef}
          showArrows={true}
          infiniteLoop={true}
          showThumbs={false}
          showStatus={false}
          autoPlay={true}
          interval={5000}
          className="w-full max-w-screen-xl mx-auto mb-12"
        >
          <div className="flex flex-col items-center">
            <h3 className="text-3xl font-semibold mb-4">Quem Somos</h3>
            <p className="mb-4 text-center max-w-2xl text-lg">
              Somos uma plataforma dedicada a conectar doadores com organizações
              não governamentais, criando um canal de solidariedade moderno e
              transparente. Nossa missão é tornar a doação acessível, fácil e
              confiável para todos.
            </p>
            <div className="w-full max-w-md h-120 relative mb-6">
              <Image
                src={charityImg}
                alt="Quem Somos"
                fill
                className="object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>

          <div className="flex flex-col items-center">
            <h3 className="text-3xl font-semibold mb-4">Nosso Objetivo</h3>
            <p className="mb-4 text-center max-w-2xl text-lg">
              Nosso objetivo é promover a solidariedade através da tecnologia.
              Ajudamos a aproximar doadores de causas sociais, oferecendo
              ferramentas como relatórios transparentes e dashboards interativos
              para um acompanhamento eficaz.
            </p>
            <div className="w-full max-w-md h-120 relative mb-6">
              <Image
                src={donationsImg}
                alt="Nosso Objetivo"
                fill
                className="object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>

          <div className="flex flex-col items-center">
            <h3 className="text-3xl font-semibold mb-4">ONG's Parceiras</h3>
            <p className="mb-4 text-center max-w-2xl text-lg">
              Trabalhamos com várias organizações não governamentais que
              compartilham da nossa missão. Cada uma dessas parcerias representa
              uma oportunidade de fazer a diferença na vida de quem mais precisa.
            </p>
          </div>
        </Carousel>
      </section>
    </div>
  );
}
