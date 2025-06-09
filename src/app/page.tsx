"use client";

import Image from "next/image";
import logo from "@/assets/logo.png";
import donationsImg from "@/assets/8.png";
import QuemSomosImg from "@/assets/1.png";
import QuemSomosImg2 from "@/assets/6.png";
import impactImg from "@/assets/impact.jpg";
import missionImg from "@/assets/mission.jpg";
import networkImg from "@/assets/network.jpg";
import CountUp from 'react-countup';
import { Button } from "@/components/button";
import Link from "next/link";
import { useState, useRef } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { useInView } from 'react-intersection-observer';
import Map from "@/components/Map";
import '@/styles/carousel.css';

export default function Home() {
  const [showDropdown, setShowDropdown] = useState(false);
  const carouselRef = useRef<Carousel | null>(null);
  const [hasStartedCounting, setHasStartedCounting] = useState(false);
  const { ref: statsRef, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true
  });

  if (inView && !hasStartedCounting) {
    setHasStartedCounting(true);
  }

  const handleCarouselChange = (index: number) => {
    if (carouselRef.current) {
      carouselRef.current.moveTo(index);
    }
  };
  return (
    <div className="font-sans bg-gradient-to-r from-indigo-500 to-purple-600 dark:bg-zinc-900">
      <header className="fixed top-0 left-0 right-0 w-full bg-white/90 backdrop-blur-sm dark:bg-zinc-800/90 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0">
              <Link href="/">
                <Image 
                  src={logo} 
                  alt="Logo Ampara" 
                  width={70} 
                  height={70} 
                  className="relative z-10 hover:opacity-90 transition-opacity"
                  priority
                />
              </Link>
            </div>
            
            <Button
              className="md:hidden focus:outline-none relative z-10"
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

            <nav className="hidden md:flex items-center gap-8 text-lg font-medium text-zinc-900 dark:text-zinc-100">
              <div className="flex items-center gap-6">
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
                  ONG's Parceiras
                </Link>
              </div>

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

          {/* Menu móvel */}
          {showDropdown && (
            <div className="md:hidden py-4 bg-white dark:bg-zinc-800 border-t border-zinc-200 dark:border-zinc-700">
              <div className="flex flex-col space-y-4 text-base font-medium">
                <Link
                  href="#quem-somos"
                  onClick={() => handleCarouselChange(0)}
                  className="px-4 py-2 hover:text-violet-600 transition-all"
                >
                  Quem Somos
                </Link>
                <Link
                  href="#objetivo"
                  onClick={() => handleCarouselChange(1)}
                  className="px-4 py-2 hover:text-violet-600 transition-all"
                >
                  Nosso Objetivo
                </Link>
                <Link
                  href="#ongs"
                  onClick={() => handleCarouselChange(2)}
                  className="px-4 py-2 hover:text-violet-600 transition-all"
                >
                  ONG's Parceiras
                </Link>
                <div className="px-4 py-2 space-y-3">
                  <Link href="/signupDoador" className="block">
                    <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2.5 rounded-lg shadow-lg transition-all font-semibold">
                      Cadastro Doador
                    </Button>
                  </Link>
                  <Link href="/signupRecebedor" className="block">
                    <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2.5 rounded-lg shadow-lg transition-all font-semibold">
                      Cadastro Recebedor
                    </Button>
                  </Link>
                  <Link href="/signin" className="block">
                    <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg shadow-md transition-all font-semibold">
                      Login
                    </Button>
                  </Link>
                </div>
                <div className="px-4 py-2">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Espaçador para compensar o header fixo */}
      <div className="h-20" />

      <section className="text-center py-20 px-6 md:px-20 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-lg shadow-lg">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
          Bem-vindo ao Nosso Projeto
        </h1>
        <p className="text-lg md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
          Conectamos doadores com instituições de forma fácil e moderna. Junte-se
          a nós nessa corrente do bem e ajude a transformar vidas!
        </p>
        <Link href="/signupDoador">
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 text-lg rounded-lg transition-all">
            Quero Ajudar
          </Button>
        </Link>
      </section>

      <section
        id="quem-somos"
        className="w-full bg-zinc-100 dark:bg-zinc-800 text-purple-800 dark:text-white"
      >
        <div className="text-center py-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Descubra Mais Sobre Nosso Impacto
          </h2>
          <p className="text-lg md:text-xl mt-4 mb-8 max-w-3xl mx-auto text-zinc-700 dark:text-zinc-300">
            Explore nossa história e descubra como estamos transformando vidas através da solidariedade digital
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
          className="w-full"
          renderArrowPrev={(clickHandler, hasPrev) => {
            return (
              <button
                onClick={clickHandler}
                className="carousel-arrow-prev"
                title="Slide anterior"
                aria-label="Ir para o slide anterior"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )
          }}
          renderArrowNext={(clickHandler, hasNext) => {
            return (
              <button
                onClick={clickHandler}
                className="carousel-arrow-next"
                title="Próximo slide"
                aria-label="Ir para o próximo slide"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )
          }}
        >
          <div className="flex flex-col">
            <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm py-12 px-6 md:px-12">
              <h3 className="text-4xl font-bold mb-8 text-purple-600 dark:text-purple-400 text-center">
                Quem Somos
              </h3>
              <p className="mx-auto max-w-3xl text-lg md:text-xl text-zinc-700 dark:text-zinc-300 leading-relaxed text-center">
                Somos uma plataforma inovadora que une tecnologia e solidariedade,
                criando pontes entre doadores e organizações não governamentais.
                Nossa missão é transformar o ato de doar em uma experiência
                transparente, segura e gratificante para todos os envolvidos.
              </p>
            </div>
            <div className="w-full h-[500px] relative">
              <Image
                src={QuemSomosImg}
                alt="Ampara - Quem Somos"
                fill
                className="object-cover object-center hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm py-12 px-6 md:px-12">
              <h3 className="text-4xl font-bold mb-8 text-purple-600 dark:text-purple-400 text-center">
                Nosso Objetivo
              </h3>
              <p className="mx-auto max-w-3xl text-lg md:text-xl text-zinc-700 dark:text-zinc-300 leading-relaxed text-center">
                Buscamos revolucionar a forma como as doações são feitas,
                proporcionando uma plataforma moderna e eficiente. Oferecemos
                ferramentas avançadas de acompanhamento, relatórios detalhados
                e total transparência em cada etapa do processo de doação.
              </p>
            </div>
            <div className="w-full h-[500px] relative">
              <Image
                src={donationsImg}
                alt="Ampara - Nosso Objetivo"
                fill
                className="object-cover object-center hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm py-12 px-6 md:px-12">
              <h3 className="text-4xl font-bold mb-8 text-purple-600 dark:text-purple-400 text-center">
                ONG's Parceiras
              </h3>
              <p className="mx-auto max-w-3xl text-lg md:text-xl text-zinc-700 dark:text-zinc-300 leading-relaxed text-center">
                Nossas parcerias com ONGs são cuidadosamente selecionadas para
                garantir o máximo impacto social. Cada organização parceira
                compartilha nossos valores de transparência, eficiência e
                compromisso com a transformação social.
              </p>
            </div>
            <div className="w-full h-[500px] relative">
              <Image
                src={QuemSomosImg2}
                alt="Ampara - ONG's Parceiras"
                fill
                className="object-cover object-center hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>
          </div>
        </Carousel>
      </section>

      <section ref={statsRef} className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-white text-center">
            <div className="p-6">
              <div className="text-4xl font-bold mb-2">
                {hasStartedCounting ? <CountUp end={100} duration={2} />: "0"}+
              </div>
              <div className="text-lg">Vidas Impactadas</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold mb-2">
                {hasStartedCounting ? <CountUp end={50} duration={2} />: "0"}+
              </div>
              <div className="text-lg">Doadores Ativos</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold mb-2">
                {hasStartedCounting ? <CountUp end={30} duration={2} />: "0"}+
              </div>
              <div className="text-lg">ONGs Parceiras</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold mb-2">R$ 
                {hasStartedCounting ? <CountUp end={100} duration={2} />: "0"}k+
              </div>
              <div className="text-lg">Em Doações</div>
            </div>
          </div>
        </div>
      </section>

      <section id="localizacao" className="w-full bg-white dark:bg-zinc-900 text-purple-800 dark:text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold">
              Nossa Localização
            </h2>
            <p className="text-lg md:text-xl">
              Encontre-nos no campus da PUCPR. Estamos sempre disponíveis para ajudar e conectar pessoas!
            </p>
          </div>
        </div>
        <div className="relative w-full h-[500px] z-10">
          <Map />
        </div>
      </section>
      <footer className="w-full px-6 md:px-20 py-12 bg-zinc-800 dark:bg-zinc-900 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Sobre o Ampara</h3>
            <p className="text-zinc-300">
              Uma plataforma dedicada a facilitar doações e conectar pessoas que querem ajudar com organizações que fazem a diferença.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#quem-somos" className="text-zinc-300 hover:text-white transition-colors">
                  Quem Somos
                </Link>
              </li>
              <li>
                <Link href="#objetivo" className="text-zinc-300 hover:text-white transition-colors">
                  Nosso Objetivo
                </Link>
              </li>
              <li>
                <Link href="#ongs" className="text-zinc-300 hover:text-white transition-colors">
                  ONG's Parceiras
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">Contato</h3>
            <p className="text-zinc-300">
              Email: contato@ampara.com.br<br />
              Telefone: (41) 3271-1555
            </p>
          </div>
        </div>
        <div className="mt-12 text-center text-zinc-400 border-t border-zinc-700 pt-8">
          <p>&copy; {new Date().getFullYear()} Ampara. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
