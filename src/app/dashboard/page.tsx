'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar/page";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import Dashboard from "@/components/Dashboard/page";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Home() {
  const router = useRouter();

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
      }
    } catch {
      localStorage.removeItem("token");
      if (!toast.isActive(toastId)) {
        toast.error("Token inválido. Faça login novamente.", { toastId });
      }
      router.push("/signin");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex">
      <Sidebar />
        <div className="flex-1 p-4 space-y-6 md:ml-64">
        <Dashboard />
      </div>
    </div>
  );
}
