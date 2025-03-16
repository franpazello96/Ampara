import { ThemeToggle } from "../components/ThemeToggle";
import logo from "../assets/logo.png";
import Image from 'next/image'
import { Input } from "@/components/input";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="flex flex-col justify-center items-center">
      <Image src={logo} alt="Logo" width={108.5} height={30} />
      <ThemeToggle />
      </div>
      <h1 className="flex text-4xl leading-none font-medium md:text-4xl mt-10
      text-zinc-800 dark:text-zinc-100 justify-center items-center">
      Login </h1>

     
      <Input type="email" placeholder="E-mail" />
      <Input type="password" placeholder="Senha" />

      <button className="bg-zinc-500 dark:bg-zinc-700 text-zinc-100 dark:text-zinc-100
      rounded-lg p-2 w-full mt-4">Entrar</button>

    </div>
  );
}
