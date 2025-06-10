'use client';

import { useEffect, useState } from "react";
import { ArrowDownCircle, ArrowUpCircle, CircleDollarSignIcon } from "lucide-react";
import Sidebar from "@/components/Sidebar/page";

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
        const res = await fetch("https://localhost:5001/api/transactions/getalltransactions");
        const data: BackendTransaction[] = await res.json();

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
    <div className="flex">
      <Sidebar />
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 w-4xl h-28 justify-between items-center flex-1">
        <div className="bg-green-950 p-4 rounded-lg text-white flex-1">
          <header className="flex justify-between items-center">
            <span>Entradas</span>
            <ArrowUpCircle className="text-green-500" size={32} />
          </header>
          <strong className="block mt-2 text-xl">{formatCurrency(entries)}</strong>
        </div>

        <div className="bg-red-950 p-4 rounded-lg text-white flex-1">
          <header className="flex justify-between items-center">
            <span>Saídas</span>
            <ArrowDownCircle className="text-red-500" size={32} />
          </header>
          <strong className="block mt-2 text-xl">{formatCurrency(exits)}</strong>
        </div>

        <div className="bg-blue-950 p-4 rounded-lg text-white flex-1">
          <header className="flex justify-between items-center">
            <span>Total</span>
            <CircleDollarSignIcon className="text-white" size={32} />
          </header>
          <strong className="block mt-2 text-xl">{formatCurrency(entries - exits)}</strong>
        </div>
      </div>
    </div>
  );
}
