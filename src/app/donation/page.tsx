"use client";

import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";
import logo from "@/assets/logo.png";

export default function DonationPage() {
  const [donationType, setDonationType] = useState("");
  const [amount, setAmount] = useState("");
  const [quantityKg, setQuantityKg] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (donationType === "Alimentos") {
      console.log("Doação de Alimentos:", quantityKg, "kg");
    } else if (donationType === "Dinheiro") {
      console.log("Doação em Dinheiro: R$", amount);
    }
    alert("Doação registrada com sucesso!");
  };

  return (
    <div className="w-full flex justify-center items-center px-4">
      <div className="max-w-2xl w-full">
        <div className="flex flex-col justify-center items-center">
          <Image src={logo} alt="Logo" width={108.5} height={30} />
          <ThemeToggle />
        </div>

        <h1 className="text-4xl font-semibold mt-10 text-center text-zinc-800 dark:text-zinc-100">
          Fazer uma Doação
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-8">
          <div>
            <label
              htmlFor="donationType"
              className="block text-sm font-medium text-zinc-800 dark:text-zinc-100"
            >
              Tipo de Doação
            </label>
            <select
              id="donationType"
              value={donationType}
              onChange={(e) => {
                setDonationType(e.target.value);
                setQuantityKg("");
                setAmount("");
              }}
              className="w-full p-2 mt-1 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Selecione uma opção</option>
              <option value="Alimentos">Alimentos não perecíveis (kg)</option>
              <option value="Dinheiro">Dinheiro</option>
            </select>
          </div>

          {donationType === "Alimentos" && (
            <div>
              <label
                htmlFor="quantityKg"
                className="block text-sm font-medium text-zinc-800 dark:text-zinc-100"
              >
                Quantidade (kg)
              </label>
              <input
                id="quantityKg"
                type="number"
                min="1"
                value={quantityKg}
                onChange={(e) => setQuantityKg(e.target.value)}
                className="w-full p-2 mt-1 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: 5"
                required
              />
            </div>
          )}

          {donationType === "Dinheiro" && (
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-zinc-800 dark:text-zinc-100"
              >
                Valor da Doação (R$)
              </label>
              <input
                id="amount"
                type="number"
                min="1"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 mt-1 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: 25.50"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-200"
          >
            Confirmar Doação
          </button>
        </form>
      </div>
    </div>
  );
}
