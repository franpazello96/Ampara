"use client";

import { Input } from "@/components/input";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { useState } from "react";
import { Button } from "@/components/button";
import {jwtDecode} from "jwt-decode";
import { useRouter } from "next/navigation";

type TokenPayload = {
  sub: string;
  cpf?: string;
  cnpj?: string;
  role: string;
}


export default function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      const response = await fetch("https://localhost:5001/api/Auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok){
        console.log(JSON.stringify({ email, password }));
        throw new Error ("Credencias inválidas")
      }

      const data = await response.json(); 
      const token = data.token;
      localStorage.setItem("token", token);

      const decoded = jwtDecode<TokenPayload>(token);

      if (decoded.cpf) {
        router.push("/");
      } else if (decoded.cnpj){
        router.push("/homeAdmin");
      } else {
        throw new Error("Token inválido: sem cpf/cnpj");
      }
    } catch (error) {
        if (error instanceof Error) {
          console.error("Erro ao fazer login:", error.message);
        } else {
          console.error("Erro desconhecido:", error);
        }
    }
}

  return (
    <div className="w-full flex justify-center items-center">
      <div className="max-w-3xl w-full">
        <div className="flex flex-col justify-center items-center">
          <Image src={logo} alt="Logo" width={108.5} height={30} />
          <ThemeToggle />
        </div>

        <h1 className="flex text-4xl leading-none font-medium md:text-4xl mt-10 text-zinc-800 dark:text-zinc-100 justify-center items-center">
          Login
        </h1>

        <form onSubmit={handleSubmit}>
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

          <Button type="submit"> Entrar </Button>
        </form>
      </div>
    </div>
  );
}