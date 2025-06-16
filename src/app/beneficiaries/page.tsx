'use client';

import { ThemeToggle } from "@/components/ThemeToggle";
import Sidebar from "@/components/Sidebar/page";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Beneficiary {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  cpf?: string;
  cnpj?: string;
  createdAt: string;
  doneeCnpj: string;
}

export default function Beneficiaries() {
  const { user } = useAuth("donee");
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [filtered, setFiltered] = useState<Beneficiary[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.cnpj) return;
      try {
        const encodedCnpj = encodeURIComponent(user.cnpj);
        const res = await fetch(`https://localhost:5001/api/benefitiary/bydonee?cnpj=${encodedCnpj}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        if (!res.ok) throw new Error("404");
        const data = await res.json();
        setBeneficiaries(data);
        setFiltered(data);
      } catch {
        toast.error("Erro ao buscar beneficiários.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.cnpj]);

  useEffect(() => {
    let result = [...beneficiaries];

    if (searchTerm) {
      result = result.filter(b =>
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.email?.toLowerCase().includes(searchTerm) ||
        b.phoneNumber?.includes(searchTerm) ||
        (b.cpf && b.cpf.includes(searchTerm)) ||
        (b.cnpj && b.cnpj.includes(searchTerm))
      );
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59);
      result = result.filter(b => {
        const created = new Date(b.createdAt);
        return created >= start && created <= end;
      });
    }

    setFiltered(result);
  }, [searchTerm, startDate, endDate, beneficiaries]);

  const formatPhone = (phone: string) =>
    phone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("pt-BR");

  const getDoc = (b: Beneficiary) => b.cpf || b.cnpj || "-";

  const handleEdit = (b: Beneficiary) => {
    const doc = b.cpf || b.cnpj;
    if (!doc) {
      toast.warn("Documento não encontrado.");
      return;
    }
    router.push(`/beneficiaries/edit?document=${encodeURIComponent(doc)}`);
  };

  const handleDelete = async (id: number) => {
    toast.info(({ closeToast }) => (
      <div className="space-y-2">
        <p>Deseja excluir este beneficiário?</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              try {
                const res = await fetch(`https://localhost:5001/api/benefitiary/${id}`, {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                  }
                });
                if (!res.ok) throw new Error();
                const updated = beneficiaries.filter(b => b.id !== id);
                setBeneficiaries(updated);
                setFiltered(updated);
                toast.success("Beneficiário excluído com sucesso!");
              } catch {
                toast.error("Erro ao deletar beneficiário.");
              } finally {
                closeToast?.();
              }
            }}
            className="px-3 py-1 bg-red-600 text-white rounded"
          >
            Confirmar
          </button>
          <button
            onClick={() => closeToast?.()}
            className="px-3 py-1 bg-gray-300 dark:bg-zinc-700 text-black dark:text-white rounded"
          >
            Cancelar
          </button>
        </div>
      </div>
    ), { autoClose: false });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      <Sidebar />
      <main className="flex flex-col p-4 sm:p-6 md:ml-64">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">
            Lista de Beneficiários
          </h1>
          <ThemeToggle />
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Buscar por nome, e-mail, telefone..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-lg w-full dark:bg-zinc-800 dark:text-white"
          />
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="px-4 py-2 border rounded-lg w-full md:w-auto dark:bg-zinc-800 dark:text-white"
          />
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="px-4 py-2 border rounded-lg w-full md:w-auto dark:bg-zinc-800 dark:text-white"
          />
        </div>

        <button
          onClick={() => router.push("/signupBenefitiary")}
          className="mb-6 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 w-full sm:w-auto"
        >
          Adicionar Beneficiário
        </button>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-lg bg-white dark:bg-zinc-800">
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-gray-100 dark:bg-zinc-700">
                <tr>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Nome</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Data de Cadastro</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Contato</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Documento</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-zinc-700">
                {filtered.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700">
                    <td className="px-4 py-3">{b.name}</td>
                    <td className="px-4 py-3">{formatDate(b.createdAt)}</td>
                    <td className="px-4 py-3">
                      {formatPhone(b.phoneNumber)}<br />{b.email}
                    </td>
                    <td className="px-4 py-3">{getDoc(b)}</td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-3">
                        <button onClick={() => handleEdit(b)}>
                          <FaEdit className="text-indigo-600 dark:text-indigo-300" />
                        </button>
                        <button onClick={() => handleDelete(b.id)}>
                          <FaTrash className="text-red-600 dark:text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-500 dark:text-gray-400">
                      Nenhum beneficiário encontrado.
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
