'use client';

import { ThemeToggle } from "@/components/ThemeToggle";
import Sidebar from "@/components/Sidebar/page";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface RecurringDonation {
  donatorName: string;
  donatorCpf: string;
  frequency: string;
  donationType: 'Dinheiro' | 'Alimentos';
  amount: number | null;
  quantityKg: number | null;
}

export default function RecurringDonations() {
  const { user } = useAuth("donee");
  const [donations, setDonations] = useState<RecurringDonation[]>([]);
  const [filtered, setFiltered] = useState<RecurringDonation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      if (!user?.cnpj) return;
      try {
        const encodedCnpj = encodeURIComponent(user.cnpj);
        const res = await fetch(`https://localhost:5001/api/donation/recurring/bydonee?cnpj=${encodedCnpj}`);
        if (!res.ok) throw new Error("Erro ao buscar doações.");
        const data = await res.json();
        setDonations(data);
        setFiltered(data);
      } catch (err) {
        toast.error("Erro ao buscar doações recorrentes.");
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, [user?.cnpj]);

  useEffect(() => {
    const result = donations.filter(d =>
      d.donatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.donatorCpf.includes(searchTerm)
    );
    setFiltered(result);
  }, [searchTerm, donations]);

  const formatCurrency = (value: number | null) =>
    value != null
      ? new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(value)
      : "-";

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      <Sidebar />
      <main className="flex flex-col md:ml-64 p-4 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">
            Doações Recorrentes da Sua ONG
          </h1>
          <ThemeToggle />
        </div>

        <input
          type="text"
          placeholder="Buscar por nome ou CPF..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg mb-6 dark:bg-zinc-800 dark:text-white"
        />

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="overflow-x-auto bg-white dark:bg-zinc-800 rounded-lg shadow-lg">
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-gray-100 dark:bg-zinc-700 text-left">
                <tr>
                  <th className="px-4 py-3 whitespace-nowrap">Nome</th>
                  <th className="px-4 py-3 whitespace-nowrap">CPF</th>
                  <th className="px-4 py-3 whitespace-nowrap">Frequência</th>
                  <th className="px-4 py-3 whitespace-nowrap">Tipo</th>
                  <th className="px-4 py-3 whitespace-nowrap">Valor / Quantidade</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-zinc-700">
                {filtered.map((d, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-zinc-700">
                    <td className="px-4 py-3">{d.donatorName}</td>
                    <td className="px-4 py-3">{d.donatorCpf}</td>
                    <td className="px-4 py-3">{d.frequency}</td>
                    <td className="px-4 py-3">{d.donationType}</td>
                    <td className="px-4 py-3">
                      {d.donationType === "Dinheiro"
                        ? formatCurrency(d.amount)
                        : `${d.quantityKg ?? 0} Kg`}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-500 dark:text-gray-400">
                      Nenhuma doação recorrente encontrada para este CNPJ.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
