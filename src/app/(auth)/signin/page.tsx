'use client';

import { Input } from "@/components/input";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { useState } from "react";
import { Button } from "@/components/button";
import { useRouter } from "next/navigation";

export default function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Erro ao fazer login.');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('userType', data.userType);

      if (data.userType === 'donator') {
        router.push('/doador/donation');
      } else if (data.userType === 'donee') {
        router.push('/dashboard');
      }

    } catch (error) {
      console.error('Erro no login:', error);
      alert('Erro na comunicação com o servidor.');
    }
  }

  return (
    <div className="h-screen w-full flex">
      {/* Coluna do Logo */}
      <div className="hidden lg:flex w-1/2 bg-zinc-100 dark:bg-zinc-800 justify-center items-center">
        <Image 
          src={logo} 
          alt="Logo" 
          width={500} 
          height={500} 
          className="object-contain p-8 transition-all duration-1000 ease-in-out hover:transform hover:-translate-y-2 animate-fade-in"
        />
      </div>

      {/* Linha divisória vertical */}
      <div className="hidden lg:block w-[1px] h-screen bg-zinc-200 dark:bg-zinc-700" />

      {/* Coluna do Formulário */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div className="flex flex-col justify-center items-center">
            <div className="lg:hidden mb-6">
              <Image src={logo} alt="Logo" width={108.5} height={30} />
            </div>
            <ThemeToggle />
          </div>

          <h1 className="text-4xl font-medium text-zinc-800 dark:text-zinc-100 text-center">
            Login
          </h1>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <Input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            <div className="flex justify-center mt-8">
              <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors w-full"> 
                Entrar 
              </Button>
            </div>

            <div className="text-center mt-4">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Não tem uma conta?{' '}
                <a href="/signupDoador" className="text-blue-500 hover:underline">
                  Cadastre-se
                </a>
              </p>
            </div>

            <div className="text-center mt-4">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                <a href="/" className="hover:underline">
                  Cancelar
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
