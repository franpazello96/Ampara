"use client";

import { Input } from "@/components/input";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { useState } from "react";

export default function signin(){

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  function handleSubmit(event: React.FormEvent){
    event.preventDefault(); 
    console.log('E-mail', email); 
    console.log('Senha', password);

  }

  return(
    <div className="min-h-screen">
      <div className="flex flex-col justify-center items-center">
        <Image src={logo} alt="Logo" width={108.5} height={30} />
        <ThemeToggle />
      </div>
      <h1 className="flex text-4xl leading-none font-medium md:text-4xl mt-10
      text-zinc-800 dark:text-zinc-100 justify-center items-center">
      Login </h1>

      <form action="" onSubmit={handleSubmit}>
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

      <button type="submit" className="bg-zinc-500 dark:bg-zinc-700 text-zinc-100 dark:text-zinc-100
      rounded-lg p-2 w-full mt-4 hover:cursor-pointer hover:bg-zinc-400 dark:hover:bg-zinc-600">Entrar</button>
      </form>


    </div>
  )
}