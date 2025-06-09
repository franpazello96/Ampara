"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import Sidebar from "@/components/Sidebar/page";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaEdit, FaTrash } from 'react-icons/fa';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const mockDonators: Donator[] = [
    {
      id: 1,
      name: "Maria Silva",
      email: "maria.silva@email.com",
      phone: "(41) 99999-1111",
      cpf: "123.456.789-00",
      password: "******",
      donationType: "Mensal",
      createdAt: "2025-03-15T10:30:00",
      monthlyDonation: 100.00,
      status: 'ativo'
    },
    {
      id: 2,
      name: "João Santos",
      email: "joao.santos@email.com",
      phone: "(41) 99999-2222",
      cpf: "987.654.321-00",
      password: "******",
      donationType: "Anual",
      createdAt: "2025-04-16T14:20:00",
      monthlyDonation: 50.00,
      status: 'ativo'
    },
    {
      id: 3,
      name: "Ana Oliveira",
      email: "ana.oliveira@email.com",
      phone: "(41) 99999-3333",
      cpf: "456.789.123-00",
      password: "******",
      donationType: "Semestral",
      createdAt: "2025-02-17T09:15:00",
      monthlyDonation: 200.00,
      status: 'inativo'
    },
    {
      id: 4,
      name: "Carlos Ferreira",
      email: "carlos.ferreira@email.com",
      phone: "(41) 99999-4444",
      cpf: "789.123.456-00",
      password: "******",
      donationType: "Bimestral",
      createdAt: "2025-05-18T16:45:00",
      monthlyDonation: 75.00,
      status: 'ativo'
    },
    {
      id: 5,
      name: "Paula Costa",
      email: "paula.costa@email.com",
      phone: "(41) 99999-5555",
      cpf: "321.654.987-00",
      password: "******",
      donationType: "Trimestral",
      createdAt: "2025-01-19T11:00:00",
      monthlyDonation: 150.00,
      status: 'inativo'
    }
  ];

  useEffect(() => {
    // Comentado temporariamente para usar dados mockados
    /*const fetchDonators = async () => {
      try {
        const response = await fetch('http://localhost:5264/api/Donator');
        const data = await response.json();
        setDonators(data);
      } catch (error) {
        console.error('Erro ao buscar doadores:', error);
      } finally {
        setLoading(false);
      }
    };*/

    const fetchMockData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay de rede
      setDonators(mockDonators);
      setFilteredDonators(mockDonators);
      setLoading(false);
    };

    fetchMockData();
  }, []);

  useEffect(() => {
    const filterDonators = () => {
      let filtered = [...donators];

      // Filtra por termo de busca
      if (searchTerm) {
        filtered = filtered.filter(donator =>
          donator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          donator.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          donator.phone.includes(searchTerm)
        );
      }

      // Filtra por data
      if (startDate && endDate) {
        filtered = filtered.filter(donator => {
          const donatorDate = new Date(donator.createdAt);
          const start = new Date(startDate);
          const end = new Date(endDate);
          end.setHours(23, 59, 59); // Inclui todo o último dia
          return donatorDate >= start && donatorDate <= end;
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

  const router = useRouter();

  const handleEdit = (id: number) => {
    router.push(`/donators/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este doador?')) {
      // Implementar exclusão do doador
      console.log('Excluir doador:', id);
      
      // Mock da exclusão
      const updatedDonators = donators.filter(donator => donator.id !== id);
      setDonators(updatedDonators);
      setFilteredDonators(updatedDonators);
    }
  };

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
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Buscar
                </label>
                <input
                  id="search"
                  type="text"
                  placeholder="Buscar por nome, email ou telefone..."
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Data Inicial
                </label>
                <input
                  id="start-date"
                  type="date"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Data Final
                </label>
                <input
                  id="end-date"
                  type="date"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => router.push('/signupDoador')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors mb-6"
            aria-label="Adicionar novo doador"
          >
            Adicionar Doador
          </button>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-zinc-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Nome
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        CPF
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                        Contato
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Tipo de Doação
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Valor Mensal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                        Data de Início
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredDonators.map((donator) => (
                      <tr key={donator.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {donator.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {donator.cpf}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 hidden md:table-cell">
                          {donator.phone}
                          <br />
                          {donator.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {donator.donationType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {formatCurrency(donator.monthlyDonation)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 hidden lg:table-cell">
                          {new Date(donator.createdAt).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            donator.status === 'ativo' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                              : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                          }`}>
                            {donator.status.charAt(0).toUpperCase() + donator.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleEdit(donator.id)}
                              className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                              title="Editar doador"
                              aria-label="Editar doador"
                            >
                              <FaEdit className="w-5 h-5" aria-hidden="true" />
                            </button>
                            <button
                              onClick={() => handleDelete(donator.id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                              title="Excluir doador"
                              aria-label="Excluir doador"
                            >
                              <FaTrash className="w-5 h-5" aria-hidden="true" />
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