'use client';

import { ThemeToggle } from "@/components/ThemeToggle";
import Sidebar from "@/components/Sidebar/page";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

interface Donator {
  id: number;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  password: string;
  donationType: 'Mensal' | 'Bimestral' | 'Trimestral' | 'Semestral' | 'Anual';
  createdAt: string;
  monthlyDonation: number;
  status: 'ativo' | 'inativo';
}

export default function Donators() {
  const [donators, setDonators] = useState<Donator[]>([]);
  const [filteredDonators, setFilteredDonators] = useState<Donator[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
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
        return;
      }

      setAuthChecked(true);
    } catch {
      localStorage.removeItem("token");
      if (!toast.isActive(toastId)) {
        toast.error("Token inválido. Faça login novamente.", { toastId });
      }
      router.push("/signin");
    }
  }, [router]);

  useEffect(() => {
    if (!authChecked) return;

    const fetchDonators = async () => {
      try {
        const response = await fetch('https://localhost:5001/api/Donator');
        const data = await response.json();
        setDonators(data);
        setFilteredDonators(data);
      } catch (error) {
        console.error('Erro ao buscar doadores:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonators();
  }, [authChecked]);

  useEffect(() => {
    const filterDonators = () => {
      let filtered = [...donators];

      if (searchTerm) {
        filtered = filtered.filter(d =>
          d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.phone.includes(searchTerm)
        );
      }

      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59);
        filtered = filtered.filter(d => {
          const created = new Date(d.createdAt);
          return created >= start && created <= end;
        });
      }

      setFilteredDonators(filtered);
    };

    filterDonators();
  }, [searchTerm, startDate, endDate, donators]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleEdit = (id: number) => {
    router.push(`/donators/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este doador?')) {
      const updated = donators.filter(d => d.id !== id);
      setDonators(updated);
      setFilteredDonators(updated);
    }
  };

  if (!authChecked) return null; 

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      <Sidebar />
      <div className="flex flex-col ml-64">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              Lista de Doadores
            </h1>
            <ThemeToggle />
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Buscar
                </label>
                <input
                  type="text"
                  placeholder="Buscar por nome, email ou telefone..."
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Data Inicial
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Data Final
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => router.push('/signupDoador')}
            className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Adicionar Doador
          </button>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : filteredDonators.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              Nenhum doador encontrado.
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-zinc-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium">Nome</th>
                      <th className="px-6 py-3 text-left text-xs font-medium">CPF</th>
                      <th className="px-6 py-3 text-left text-xs font-medium hidden md:table-cell">Contato</th>
                      <th className="px-6 py-3 text-left text-xs font-medium">Tipo de Doação</th>
                      <th className="px-6 py-3 text-left text-xs font-medium">Valor Mensal</th>
                      <th className="px-6 py-3 text-left text-xs font-medium hidden lg:table-cell">Data de Início</th>
                      <th className="px-6 py-3 text-left text-xs font-medium">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredDonators.map((d) => (
                      <tr key={d.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700">
                        <td className="px-6 py-4 text-sm">{d.name}</td>
                        <td className="px-6 py-4 text-sm">{d.cpf}</td>
                        <td className="px-6 py-4 text-sm hidden md:table-cell">{d.phone}<br />{d.email}</td>
                        <td className="px-6 py-4 text-sm">{d.donationType}</td>
                        <td className="px-6 py-4 text-sm">{formatCurrency(d.monthlyDonation)}</td>
                        <td className="px-6 py-4 text-sm hidden lg:table-cell">{new Date(d.createdAt).toLocaleDateString('pt-BR')}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            d.status === 'ativo'
                              ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                              : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                          }`}>
                            {d.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex space-x-2">
                            <button onClick={() => handleEdit(d.id)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400">
                              <FaEdit className="w-5 h-5" />
                            </button>
                            <button onClick={() => handleDelete(d.id)} className="text-red-600 hover:text-red-900 dark:text-red-400">
                              <FaTrash className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
