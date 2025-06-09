"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import Sidebar from "@/components/Sidebar/page";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface Beneficiary {
  id: number;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  status: 'ativo' | 'inativo';
  documentNumber: string;
  address: string;
}

export default function Beneficiaries() {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [filteredBeneficiaries, setFilteredBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const mockBeneficiaries: Beneficiary[] = [
    {
      id: 1,
      name: "Casa do Caminho",
      email: "contato@casadocaminho.org",
      phone: "(41) 3333-1111",
      createdAt: "2025-03-15T10:30:00",
      status: 'ativo',
      documentNumber: "12.345.678/0001-90",
      address: "Rua das Flores, 123 - Centro"
    },
    {
      id: 2,
      name: "Lar dos Idosos Santa Clara",
      email: "lar.santaclara@email.com",
      phone: "(41) 3333-2222",
      createdAt: "2025-04-16T14:20:00",
      status: 'ativo',
      documentNumber: "23.456.789/0001-01",
      address: "Av. das Araucárias, 456 - Jardim Botânico"
    },
    {
      id: 3,
      name: "Instituto Criança Feliz",
      email: "instituto@criancafeliz.org",
      phone: "(41) 3333-3333",
      createdAt: "2025-02-17T09:15:00",
      status: 'inativo',
      documentNumber: "34.567.890/0001-12",
      address: "Rua XV de Novembro, 789 - Centro"
    },
    {
      id: 4,
      name: "Abrigo Amor e Esperança",
      email: "contato@amoresperanca.org",
      phone: "(41) 3333-4444",
      createdAt: "2025-05-18T16:45:00",
      status: 'ativo',
      documentNumber: "45.678.901/0001-23",
      address: "Rua Dom Pedro II, 321 - São Francisco"
    },
    {
      id: 5,
      name: "Centro de Apoio Sol Nascente",
      email: "centro@solnascente.org",
      phone: "(41) 3333-5555",
      createdAt: "2025-01-19T11:00:00",
      status: 'inativo',
      documentNumber: "56.789.012/0001-34",
      address: "Av. República Argentina, 654 - Portão"
    }
  ];

  useEffect(() => {
    // Comentado temporariamente para usar dados mockados
    /*const fetchBeneficiaries = async () => {
      try {
        const response = await fetch('http://localhost:5264/api/Beneficiary');
        const data = await response.json();
        setBeneficiaries(data);
      } catch (error) {
        console.error('Erro ao buscar beneficiários:', error);
      } finally {
        setLoading(false);
      }
    };*/

    const fetchMockData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay de rede
      setBeneficiaries(mockBeneficiaries);
      setFilteredBeneficiaries(mockBeneficiaries);
      setLoading(false);
    };

    fetchMockData();
  }, []);

  useEffect(() => {
    const filterBeneficiaries = () => {
      let filtered = [...beneficiaries];

      // Filtra por termo de busca
      if (searchTerm) {
        filtered = filtered.filter(beneficiary =>
          beneficiary.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          beneficiary.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          beneficiary.phone.includes(searchTerm) ||
          beneficiary.documentNumber.includes(searchTerm) ||
          beneficiary.address.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Filtra por data
      if (startDate && endDate) {
        filtered = filtered.filter(beneficiary => {
          const beneficiaryDate = new Date(beneficiary.createdAt);
          const start = new Date(startDate);
          const end = new Date(endDate);
          end.setHours(23, 59, 59); // Inclui todo o último dia
          return beneficiaryDate >= start && beneficiaryDate <= end;
        });
      }

      setFilteredBeneficiaries(filtered);
    };

    filterBeneficiaries();
  }, [searchTerm, startDate, endDate, beneficiaries]);

  const router = useRouter();

  const handleEdit = (id: number) => {
    router.push(`/beneficiaries/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este beneficiário?')) {
      // Implementar exclusão do beneficiário
      console.log('Excluir beneficiário:', id);
      
      // Mock da exclusão
      const updatedBeneficiaries = beneficiaries.filter(beneficiary => beneficiary.id !== id);
      setBeneficiaries(updatedBeneficiaries);
      setFilteredBeneficiaries(updatedBeneficiaries);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      <Sidebar />
      <div className="flex flex-col ml-64">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              Lista de Beneficiários
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
                  placeholder="Buscar por nome, email, telefone..."
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Campo de busca"
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
                  aria-label="Data inicial do filtro"
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
                  aria-label="Data final do filtro"
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => router.push('/beneficiaries/new')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors mb-6"
            aria-label="Adicionar novo beneficiário"
          >
            Adicionar Beneficiário
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
                        Data de Cadastro
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Contato
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                        CNPJ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                        Endereço
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-zinc-700">
                    {filteredBeneficiaries.map((beneficiary) => (
                      <tr key={beneficiary.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {beneficiary.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {new Date(beneficiary.createdAt).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            beneficiary.status === 'ativo' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                              : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                          }`}>
                            {beneficiary.status.charAt(0).toUpperCase() + beneficiary.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {beneficiary.phone}
                          <br />
                          {beneficiary.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 hidden md:table-cell">
                          {beneficiary.documentNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 hidden lg:table-cell">
                          {beneficiary.address}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleEdit(beneficiary.id)}
                              className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                              title="Editar beneficiário"
                              aria-label="Editar beneficiário"
                            >
                              <FaEdit className="w-5 h-5" aria-hidden="true" />
                            </button>
                            <button
                              onClick={() => handleDelete(beneficiary.id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                              title="Excluir beneficiário"
                              aria-label="Excluir beneficiário"
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