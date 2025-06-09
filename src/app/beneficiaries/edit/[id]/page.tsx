'use client';

import { ThemeToggle } from "@/components/ThemeToggle";
import Sidebar from "@/components/Sidebar/page";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Beneficiary {
  id: number;
  name: string;
  email: string;
  phone: string;
  documentNumber: string;
  address: string;
  status: 'ativo' | 'inativo';
}

export default function EditBeneficiary({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [beneficiary, setBeneficiary] = useState<Beneficiary>({
    id: 0,
    name: '',
    email: '',
    phone: '',
    documentNumber: '',
    address: '',
    status: 'ativo'
  });

  useEffect(() => {
    // Simula busca do beneficiário por ID
    const fetchBeneficiary = async () => {
      try {
        /*const response = await fetch(`http://localhost:5264/api/Beneficiary/${id}`);
        const data = await response.json();*/
        
        // Mock de dados
        const mockBeneficiary = {
          id: id,
          name: "Casa do Caminho",
          email: "contato@casadocaminho.org",
          phone: "(41) 3333-1111",
          documentNumber: "12.345.678/0001-90",
          address: "Rua das Flores, 123 - Centro",
          status: 'ativo' as 'ativo' | 'inativo'
        };
        
        setBeneficiary(mockBeneficiary);
      } catch (error) {
        setError('Erro ao carregar dados do beneficiário');
        console.error('Erro:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBeneficiary();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      /*const response = await fetch(`http://localhost:5264/api/Beneficiary/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(beneficiary),
      });*/

      // Simula tempo de resposta da API
      await new Promise(resolve => setTimeout(resolve, 1000));

      router.push('/beneficiaries');
    } catch (error) {
      setError('Erro ao salvar alterações');
      console.error('Erro:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBeneficiary(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      <ThemeToggle />
      <Sidebar />
      
      <main className="pl-64 p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Editar Beneficiário</h1>
          
          {error && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Nome
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={beneficiary.name}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={beneficiary.email}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Telefone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={beneficiary.phone}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="documentNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                CNPJ
              </label>
              <input
                type="text"
                id="documentNumber"
                name="documentNumber"
                value={beneficiary.documentNumber}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Endereço
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={beneficiary.address}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={beneficiary.status}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/beneficiaries')}
                className="flex-1 bg-gray-200 dark:bg-zinc-700 text-gray-900 dark:text-white py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
