"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";
import logo from "@/assets/logo.png";
import Sidebar from "@/components/Sidebar/page";

export default function DonationPage() {
  const [donationType, setDonationType] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrence, setRecurrence] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState({
    quantity: "",
    description: "",
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Tipo de Doação:", donationType);
    console.log("Doação Recorrente:", isRecurring);
    console.log("Frequência da Doação:", recurrence);
    console.log("Informações Adicionais:", additionalInfo);
    alert("Doação registrada com sucesso!");
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 max-w-3xl mx-auto my-10 p-6 sm:p-8 border dark:border-gray-700 rounded-xl shadow-lg bg-white dark:bg-black">
        <div className="flex justify-between items-center mb-8">
          <Image
            src={logo}
            alt="Logo"
            width={108.5}
            height={30}
            className="hidden sm:block"
          />
          <div className="flex-1 flex justify-center sm:justify-end">
             <ThemeToggle />
          </div>
        </div>

        <h1 className="text-3xl leading-none font-medium md:text-4xl text-zinc-800 dark:text-zinc-100 text-center mb-8">
          Cadastro de doações
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="donationType" className="block text-sm font-medium text-zinc-800 dark:text-zinc-100">
              Tipo de Doação
            </label>
            <select
              id="donationType"
              value={donationType}
              onChange={(e) => setDonationType(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
            >
              <option value="">Selecione uma opção</option>
              <option value="Alimentos">Alimentos</option>
              <option value="Vestuário">Vestuário</option>
              <option value="Móveis">Móveis</option>
              <option value="Outros">Outros</option>
            </select>
          </div>

          {donationType && (
            <>
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-zinc-800 dark:text-zinc-100 mt-4">
                  Quantidade
                </label>
                <input
                  id="quantity"
                  type="number"
                  value={additionalInfo.quantity}
                  onChange={(e) =>
                    setAdditionalInfo({ ...additionalInfo, quantity: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
                  placeholder="Digite a quantidade"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-zinc-800 dark:text-zinc-100 mt-4">
                  Descrição
                </label>
                <textarea
                  id="description"
                  value={additionalInfo.description}
                  onChange={(e) =>
                    setAdditionalInfo({ ...additionalInfo, description: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
                  placeholder="Descreva os itens da doação"
                />
              </div>
            </>
          )}

          <div className="mt-4">
            <label className="flex items-center text-zinc-800 dark:text-zinc-100">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Doação Recorrente
            </label>

            {isRecurring && (
              <div className="mt-4">
                <label htmlFor="recurrence" className="block text-sm font-medium text-zinc-800 dark:text-zinc-100">
                  Frequência da Doação
                </label>
                <select
                  id="recurrence"
                  value={recurrence}
                  onChange={(e) => setRecurrence(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
                >
                  <option value="">Selecione uma frequência</option>
                  <option value="Semanal">Semanal</option>
                  <option value="Mensal">Mensal</option>
                  <option value="Bimestral">Bimestral</option>
                  <option value="Trimestral">Trimestral</option>
                  <option value="Semestral">Semestral</option>
                  <option value="Anual">Anual</option>
                </select>
              </div>
            )}
          </div>
          <div className="mt-6">
            <Button type="submit">Confirmar Doação</Button>
          </div>
        </form>
      </div>
    </div>
  );
}