"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";
import logo from "@/assets/logo.png";
import SidebarDoador from "@/components/SidebarDoador/page";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";

export default function DonationPage() {
  const { isAuthenticated, user } = useAuth("donator");

  const [donationType, setDonationType] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrence, setRecurrence] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState({
    quantity: "",
    description: "",
  });

  const [errors, setErrors] = useState({
    donationType: "",
    quantity: "",
    description: "",
    recurrence: "",
  });

  const validateForm = () => {
    const newErrors = {
      donationType: donationType ? "" : "Selecione o tipo de doação.",
      quantity:
        donationType && !additionalInfo.quantity ? "Informe a quantidade." : "",
      description:
        donationType && !additionalInfo.description ? "Adicione uma descrição." : "",
      recurrence:
        isRecurring && !recurrence ? "Selecione a frequência da doação." : "",
    };

    setErrors(newErrors);

    return Object.values(newErrors).every((err) => !err);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      toast.error("Por favor, corrija os erros no formulário.");
      return;
    }

    console.log("Tipo de Doação:", donationType);
    console.log("Doação Recorrente:", isRecurring);
    console.log("Frequência da Doação:", recurrence);
    console.log("Informações Adicionais:", additionalInfo);
    toast.success("Doação registrada com sucesso!");
  };

  const fadeSlideProps = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.4 },
  };

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-zinc-100 dark:bg-zinc-900">
      <div className="w-64 bg-white dark:bg-zinc-800 p-4">
        <SidebarDoador />
      </div>
      <div className="flex-1 flex justify-center items-start py-10 px-4">
        <div className="max-w-3xl w-full bg-white dark:bg-zinc-800 p-8 rounded-xl shadow-md">
          <div className="flex flex-col items-center mb-8">
            <Image src={logo} alt="Logo" width={108.5} height={30} />
            <ThemeToggle />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-center text-zinc-800 dark:text-zinc-100 mb-6">
            Fazer uma Doação
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* ... permanece igual ... */}
          </form>
        </div>
      </div>
    </div>
  );
}
