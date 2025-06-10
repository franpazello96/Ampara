"use client";

import { useState } from "react";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";
import logo from "@/assets/logo.png";
import SidebarDoador from "@/components/SidebarDoador/page";
import { motion, AnimatePresence } from "framer-motion";

export default function DonationPage() {
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

    if (!validateForm()) return;

    console.log("Tipo de Doação:", donationType);
    console.log("Doação Recorrente:", isRecurring);
    console.log("Frequência da Doação:", recurrence);
    console.log("Informações Adicionais:", additionalInfo);
    alert("Doação registrada com sucesso!");
  };

  const fadeSlideProps = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.4 },
  };

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
            <div>
              <label
                htmlFor="donationType"
                className="block text-sm font-medium text-zinc-800 dark:text-zinc-100 mb-1"
              >
                Tipo de Doação
              </label>
              <select
                id="donationType"
                value={donationType}
                onChange={(e) => setDonationType(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
              >
                <option value="">Selecione uma opção</option>
                <option value="Alimentos">Alimentos (kg de não perecíveis)</option>
                <option value="Dinheiro">Dinheiro</option>
              </select>
            </div>

            <AnimatePresence>
              {donationType && (
                <motion.div {...fadeSlideProps} className="space-y-4">
                  <div>
                    <label
                      htmlFor="quantity"
                      className="block text-sm font-medium text-zinc-800 dark:text-zinc-100 mb-1"
                    >
                      Quantidade{" "}
                      {donationType === "Alimentos"
                        ? "(kg)"
                        : donationType === "Dinheiro"
                        ? "(R$)"
                        : ""}
                    </label>
                    <input
                      id="quantity"
                      type="number"
                      value={additionalInfo.quantity}
                      onChange={(e) =>
                        setAdditionalInfo({ ...additionalInfo, quantity: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
                      placeholder={`Digite a quantidade em ${
                        donationType === "Alimentos"
                          ? "kg"
                          : donationType === "Dinheiro"
                          ? "reais"
                          : ""
                      }`}
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-zinc-800 dark:text-zinc-100 mb-1"
                    >
                      Descrição
                    </label>
                    <textarea
                      id="description"
                      value={additionalInfo.description}
                      onChange={(e) =>
                        setAdditionalInfo({ ...additionalInfo, description: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
                      placeholder={
                        donationType === "Alimentos"
                          ? "Descreva os itens não perecíveis"
                          : "Ex: Doação financeira para alimentos"
                      }
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="flex items-center text-zinc-800 dark:text-zinc-100">
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="mr-2 accent-blue-600"
                />
                Doação Recorrente
              </label>

              <AnimatePresence>
                {isRecurring && (
                  <motion.div {...fadeSlideProps} className="mt-4">
                    <label
                      htmlFor="recurrence"
                      className="block text-sm font-medium text-zinc-800 dark:text-zinc-100 mb-1"
                    >
                      Frequência da Doação
                    </label>
                    <select
                      id="recurrence"
                      value={recurrence}
                      onChange={(e) => setRecurrence(e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
                    >
                      <option value="">Selecione uma frequência</option>
                      <option value="Semanal">Semanal</option>
                      <option value="Mensal">Mensal</option>
                      <option value="Bimestral">Bimestral</option>
                      <option value="Trimestral">Trimestral</option>
                      <option value="Semestral">Semestral</option>
                      <option value="Anual">Anual</option>
                    </select>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md shadow-md transition duration-200"
              >
                Confirmar Doação
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
