'use client';

import { useEffect, useState } from "react";
import { ArrowDownCircle, ArrowUpCircle, CircleDollarSignIcon } from "lucide-react";

interface BackendTransaction {
  type: string;
  category: string;
  amount: number | null;
  quantity: number | null;
  date: string;
  timeRecurrence?: string;
}

export function Summary() {
  const [entries, setEntries] = useState(0);
  const [exits, setExits] = useState(0);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const cnpj = localStorage.getItem("cnpj");
        if (!cnpj) return;

        const response = await fetch(`https://localhost:5001/api/transactions/getalltransactions?doneeCnpj=${encodeURIComponent(cnpj)}`);
        if (!response.ok) throw new Error("Erro ao buscar dados");

        const data: BackendTransaction[] = await response.json();

        let totalEntries = 0;
        let totalExits = 0;

        data.forEach((t) => {
          const amount = t.amount || 0;
          if (t.type === "Entrada") {
            totalEntries += amount;
          } else if (t.type === "Saída") {
            totalExits += amount;
          }
        });

        setEntries(totalEntries);
        setExits(totalExits);
      } catch (err) {
        console.error("Erro ao buscar resumo de transações:", err);
      }
    };

    fetchSummary();
  }, []);

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  return (
    <div className="mt-4 w-full ml-0 md:ml-64 px-4 flex flex-wrap gap-4">
      {/* Entradas */}
      <div className="bg-green-950 p-4 rounded-lg text-white w-full sm:w-[300px] md:w-[360px] lg:w-[400px]">
        <header className="flex justify-between items-center">
          <span className="text-sm">Entradas</span>
          <ArrowUpCircle className="text-green-500" size={28} />
        </header>
        <strong className="block mt-1 text-lg">{formatCurrency(entries)}</strong>
      </div>

      {/* Saídas */}
      <div className="bg-red-950 p-4 rounded-lg text-white w-full sm:w-[300px] md:w-[360px] lg:w-[400px]">
        <header className="flex justify-between items-center">
          <span className="text-sm">Saídas</span>
          <ArrowDownCircle className="text-red-500" size={28} />
        </header>
        <strong className="block mt-1 text-lg">{formatCurrency(exits)}</strong>
      </div>

      {/* Total */}
      <div className="bg-blue-950 p-4 rounded-lg text-white w-full sm:w-[300px] md:w-[360px] lg:w-[400px]">
        <header className="flex justify-between items-center">
          <span className="text-sm">Total</span>
          <CircleDollarSignIcon className="text-white" size={28} />
        </header>
        <strong className="block mt-1 text-lg">{formatCurrency(entries - exits)}</strong>
      </div>
    </div>
  );
}
