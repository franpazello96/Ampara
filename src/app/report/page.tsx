import { ThemeToggle } from "@/components/ThemeToggle";
import logo from "@/assets/logo.png";
import Image from 'next/image';
import { Summary } from "@/components/Summary/page";
import Financial from "@/components/Financial/page";

export default function Report() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Topbar com logo e toggle */}
      <div className="flex items-center justify-between p-4 border-b dark:border-zinc-700">
        <Image src={logo} alt="Logo" width={108.5} height={30} />
        <ThemeToggle />
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col lg:flex-row">
        {/* Summary e Financial empilhados em mobile */}
        <div className="w-full p-4 space-y-6">
          <Summary />
          <Financial />
        </div>
      </div>
    </div>
  );
}
