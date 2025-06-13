'use client';

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";

interface Donation {
  id: number;
  amount: number | null;
  quantity: number | null;
  donationType: string;
  description?: string;
  date: string;
  recurrence: boolean;
  timeRecurrence?: string;
  doneeName?: string;
  doneeCnpj?: string;
}

const ITEMS_PER_PAGE = 10;

export default function FinancialDonator() {
  const { user } = useAuth("donator");
  const [donations, setDonations] = useState<Donation[]>([]);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(0);

  useEffect(() => {
    async function fetchDonations() {
      try {
        const response = await fetch(`https://localhost:5001/api/donation/bydonator/${user?.cpf}`);
        if (!response.ok) throw new Error("Erro ao buscar doações.");
        const data = await response.json();
        setDonations(data);
      } catch (error) {
        toast.error("Erro ao carregar suas doações.");
        console.error(error);
      }
    }

    if (user?.cpf) fetchDonations();
  }, [user?.cpf]);

  const paginar = (array: Donation[], page: number) =>
    array.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  const formatCurrency = (amount: number | null) =>
    amount != null ? `R$ ${amount.toFixed(2).replace(".", ",")}` : "";

  const formatQuantity = (quantity: number | null, type: string) =>
    quantity != null ? `${quantity} ${type === "Alimentos" ? "kg" : "unid"}` : "";

  const formatDate = (isoDate: string) => {
    const d = new Date(isoDate);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  };

  const filteredDonations = donations.filter(d => {
    const date = new Date(d.date);
    const afterStart = startDate ? date >= new Date(startDate) : true;
    const beforeEnd = endDate ? date <= new Date(endDate) : true;
    return afterStart && beforeEnd;
  });

  const normalDonations = filteredDonations.filter(d => !d.recurrence);
  const recurringDonations = filteredDonations.filter(d => d.recurrence);
  const paginated = paginar(normalDonations, page);
  const totalPages = Math.ceil(normalDonations.length / ITEMS_PER_PAGE);

  const buildUpdatePayload = (original: Donation, update: Partial<Donation>) => ({
    id: original.id,
    donationType: original.donationType,
    amount: update.amount ?? original.amount,
    quantity: update.quantity ?? original.quantity,
    description: original.description ?? "",
    recurrence: update.recurrence ?? original.recurrence,
    timeRecurrence: update.timeRecurrence ?? original.timeRecurrence ?? "",
    date: original.date,
    donatorCpf: user?.cpf ?? "",
    doneeCnpj: original.doneeCnpj ?? ""
  });

  const handleEditRecurrence = (id: number, updated: Partial<Donation>) => {
    const original = donations.find(d => d.id === id);
    if (!original) return;

    const isCancel = updated.recurrence === false;
    const toastId = `edit-${id}`;

    toast.info(
      ({ closeToast }) => (
        <div className="space-y-2">
          <p className="font-semibold">
            {isCancel
              ? "Deseja cancelar a doação recorrente?"
              : "Deseja alterar sua doação recorrente?"}
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={async () => {
                toast.dismiss(toastId);

                const payload = buildUpdatePayload(original, updated);

                try {
                  const response = await fetch(
                    `https://localhost:5001/api/donation/update/${id}`,
                    {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(payload),
                    }
                  );

                  if (!response.ok) throw new Error();

                  toast.success("Doação atualizada com sucesso!");

                  setDonations(prev =>
                    prev.map(d => (d.id === id ? { ...d, ...updated } : d))
                  );
                } catch {
                  toast.error("Erro ao atualizar doação.");
                }
              }}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
            >
              Confirmar
            </button>
            <button
              onClick={() => {
                toast.dismiss(toastId);
                window.location.reload();
              }}
              className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      ),
      {
        toastId,
        autoClose: false,
        closeButton: false,
      }
    );
  };

return (
  <div className="w-full max-w-6xl mx-auto space-y-6">
    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
      <h1 className="text-2xl font-bold">Minhas Doações</h1>
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border rounded p-2"
        />
        <span className="self-center">até</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border rounded p-2"
        />
      </div>
    </div>

    {/* DOAÇÕES NÃO RECORRENTES */}
    <section className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow space-y-4">
      <h2 className="text-lg font-semibold border-b pb-2">Histórico de Doações</h2>
      <input
        type="text"
        placeholder="Pesquisar por instituição, descrição, categoria..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 border rounded w-full"
      />

      <table className="w-full table-auto border-collapse rounded-md overflow-hidden">
        <thead className="bg-blue-200 dark:bg-blue-800">
          <tr>
            <th className="p-2 text-center">Valor</th>
            <th className="p-2 text-center">Quantidade</th>
            <th className="p-2 text-center">Categoria</th>
            <th className="p-2 text-center">Data</th>
            <th className="p-2 text-center">Descrição</th>
            <th className="p-2 text-center">Instituição</th>
          </tr>
        </thead>
        <tbody>
          {paginated
            .filter(d => [d.donationType ?? "", d.description ?? "", d.doneeName ?? ""]
            .some(f => f.toLowerCase().includes(search.toLowerCase())))
            .map((d, i) => (
              <tr key={i} className="border-t">
                <td className="p-2 text-center">{formatCurrency(d.amount)}</td>
                <td className="p-2 text-center">{formatQuantity(d.quantity, d.donationType)}</td>
                <td className="p-2 text-center">{d.donationType}</td>
                <td className="p-2 text-center">{formatDate(d.date)}</td>
                <td className="p-2 text-center">{d.description ?? "-"}</td>
                <td className="p-2 text-center">{d.doneeName ?? "-"}</td>
              </tr>
            ))}
        </tbody>
      </table>

      {normalDonations.length > ITEMS_PER_PAGE && (
        <div className="flex justify-center items-center gap-3 mt-3">
          <button onClick={() => setPage(p => Math.max(p - 1, 0))} disabled={page === 0}>
            <ChevronLeft />
          </button>
          <span>Página {page + 1} de {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(p + 1, totalPages - 1))} disabled={page + 1 >= totalPages}>
            <ChevronRight />
          </button>
        </div>
      )}
    </section>

    {/* DOAÇÕES RECORRENTES */}
    <section className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow space-y-4">
      <h2 className="text-lg font-semibold border-b pb-2">Doações Recorrentes</h2>
      {recurringDonations.length === 0 ? (
        <p>Você não possui doações recorrentes.</p>
      ) : (
        <table className="w-full table-auto border-collapse rounded-md overflow-hidden">
          <thead className="bg-green-200 dark:bg-green-800">
            <tr>
              <th className="p-2 text-center">Valor</th>
              <th className="p-2 text-center">Frequência</th>
              <th className="p-2 text-center">Descrição</th>
              <th className="p-2 text-center">Instituição</th>
              <th className="p-2 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {recurringDonations.map((d, i) => (
              <tr key={i} className="border-t text-center">
                <td className="p-2">
                  <div className="flex items-center justify-center">
                    {d.donationType === "Dinheiro" && <span className="mr-1 text-sm">R$</span>}
                    <input
                      type="number"
                      className="border p-2 rounded w-full text-sm"
                      defaultValue={d.amount ?? d.quantity ?? 0}
                      onBlur={(e) =>
                        handleEditRecurrence(d.id, {
                          amount: d.donationType === "Dinheiro" ? +e.target.value : null,
                          quantity: d.donationType === "Dinheiro" ? null : +e.target.value,
                        })
                      }
                    />
                    {d.donationType === "Alimento" && <span className="ml-1 text-sm">Kg</span>}
                  </div>
                </td>
                <td className="p-2">
                  <select
                    className="border p-2 rounded w-full text-sm"
                    defaultValue={d.timeRecurrence}
                    onChange={(e) =>
                      handleEditRecurrence(d.id, { timeRecurrence: e.target.value })
                    }
                  >
                    <option value="Semanal">Semanal</option>
                    <option value="Mensal">Mensal</option>
                    <option value="Bimestral">Bimestral</option>
                    <option value="Trimestral">Trimestral</option>
                    <option value="Semestral">Semestral</option>
                    <option value="Anual">Anual</option>
                  </select>
                </td>
                <td className="p-2">{d.description ?? "-"}</td>
                <td className="p-2">{d.doneeName ?? "-"}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleEditRecurrence(d.id, { recurrence: false })}
                    className="text-red-600 underline"
                  >
                    Cancelar recorrência
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  </div>
);
}
