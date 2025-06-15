'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

import { ThemeToggle } from "@/components/ThemeToggle";
import logo from "@/assets/logo.png";
import Image from 'next/image';
import { Summary } from "@/components/Summary/page";
import Financial from "@/components/Financial/page";

export default function Report() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const toastId = "auth-check-toast";

    if (!token) {
      if (!toast.isActive(toastId)) {
        toast.warn("Você precisa estar logado para acessar esta página.", { toastId });
      }
      router.push("/signin");
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now();
      if (decoded.exp * 1000 < currentTime) {
        localStorage.removeItem("token");
        if (!toast.isActive(toastId)) {
          toast.warn("Sessão expirada. Faça login novamente.", { toastId });
        }
        router.push("/signin");
        return;
      }

      setAuthChecked(true);
    } catch {
      localStorage.removeItem("token");
      if (!toast.isActive(toastId)) {
        toast.error("Token inválido. Faça login novamente.", { toastId });
      }
      router.push("/signin");
    }
  }, [router]);

  if (!authChecked) return null;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Topbar com logo e toggle */}
      <div className="flex items-center justify-between p-4 border-b dark:border-zinc-700">
        <Image src={logo} alt="Logo" width={108.5} height={30} />
        <ThemeToggle />
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col lg:flex-row">
        <div className="w-full p-4 space-y-6">
          <Summary />
          <Financial />
        </div>
      </div>
    </div>
  );
}
