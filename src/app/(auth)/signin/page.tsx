"use client";

import { Input } from "@/components/input";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { useState } from "react";
import { Button } from "@/components/button";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Erro ao fazer login.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userType", data.userType);

      const decoded: any = jwtDecode(data.token);
      const cnpj = decoded?.cnpj;
      const userEmail = decoded?.email;

      if (cnpj) localStorage.setItem("cnpj", cnpj);
      if (userEmail) localStorage.setItem("email", userEmail);

      toast.success("Login realizado com sucesso!");

      if (data.userType === "donee") {
        router.push("/dashboard");
      } else if (data.userType === "donator") {
        router.push("/doador/donation");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      toast.error("Erro na comunicação com o servidor.");
    }
  }

  return (
    <div className="h-screen w-full flex">
      <div className="hidden lg:flex w-1/2 bg-zinc-100 dark:bg-zinc-800 justify-center items-center">
        <Image src={logo} alt="Logo" width={500} height={500} className="object-contain p-8" />
      </div>

      <div className="hidden lg:block w-[1px] h-screen bg-zinc-200 dark:bg-zinc-700" />

      <div className="w-full lg:w-1/2 flex justify-center items-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div className="flex flex-col justify-center items-center">
            <div className="lg:hidden mb-6">
              <Image src={logo} alt="Logo" width={108.5} height={30} />
            </div>
            <ThemeToggle />
          </div>

          <h1 className="text-4xl font-medium text-zinc-800 dark:text-zinc-100 text-center">Login</h1>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <Input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <div className="flex justify-center mt-8">
              <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded w-full">
                Entrar
              </Button>
            </div>

            <div className="text-center mt-4 text-sm text-zinc-600 dark:text-zinc-400 space-y-2">
              <a href="/signupDoador" className="block text-blue-500 hover:underline">Cadastre-se como Doador</a>
              <a href="/signupRecebedor" className="block text-blue-500 hover:underline">Cadastre-se como ONG / Donatário</a>
              <a href="/" className="hover:underline block">Cancelar</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
