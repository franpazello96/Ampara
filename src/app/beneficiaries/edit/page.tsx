'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar/page';
import { ThemeToggle } from '@/components/ThemeToggle';

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

export default function EditBeneficiary() {
  const searchParams = useSearchParams();
  const document = searchParams.get('document');
  const router = useRouter();
  const [beneficiary, setBeneficiary] = useState<Beneficiary | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!document) {
      setError('Documento não informado.');
      setLoading(false);
      return;
    }

    const fetchBeneficiary = async () => {
      try {
        const res = await fetch(`https://localhost:5001/api/benefitiary/bydocument?document=${encodeURIComponent(document)}`);
        if (!res.ok) throw new Error('Não encontrado');
        const data = await res.json();
        setBeneficiary(data);
      } catch (err) {
        setError('Erro ao carregar beneficiário');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBeneficiary();
  }, [document]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBeneficiary(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!beneficiary) return;

    setSaving(true);
    setError('');

    try {
      const dto = {
        name: beneficiary.name,
        email: beneficiary.email,
        phoneNumber: beneficiary.phoneNumber,
        cpf: beneficiary.cpf || null,
        cnpj: beneficiary.cnpj || null,
        doneeCnpj: beneficiary.doneeCnpj,
        createdAt: beneficiary.createdAt
      };

      const res = await fetch(`https://localhost:5001/api/benefitiary/${beneficiary.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });

      if (!res.ok) throw new Error();

      router.push('/beneficiaries');
    } catch (err) {
      setError('Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-gray-500">Carregando...</div>;
  }

  if (!beneficiary) {
    return <div className="p-10 text-red-500">Beneficiário não encontrado</div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      <ThemeToggle />
      <Sidebar />
      <main className="pl-64 p-8">
        <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-6">
          Editar Beneficiário
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-xl bg-white dark:bg-zinc-800 p-6 rounded-md shadow">
          <div>
            <label className="text-sm text-gray-700 dark:text-gray-200">Nome</label>
            <input name="name" value={beneficiary.name} onChange={handleChange} required
              className="w-full p-2 border dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-white" />
          </div>

          <div>
            <label className="text-sm text-gray-700 dark:text-gray-200">Email</label>
            <input name="email" type="email" value={beneficiary.email} onChange={handleChange} required
              className="w-full p-2 border dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-white" />
          </div>

          <div>
            <label className="text-sm text-gray-700 dark:text-gray-200">Telefone</label>
            <input name="phoneNumber" value={beneficiary.phoneNumber} onChange={handleChange} required
              className="w-full p-2 border dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-white" />
          </div>

          <div>
            <label className="text-sm text-gray-700 dark:text-gray-200">
              {beneficiary.cpf ? "CPF" : "CNPJ"}
            </label>
            <input
              name={beneficiary.cpf ? "cpf" : "cnpj"}
              value={beneficiary.cpf || beneficiary.cnpj || ""}
              onChange={handleChange}
              className="w-full p-2 border dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-white"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
            >
              {saving ? "Salvando..." : "Salvar"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/beneficiaries")}
              className="bg-gray-200 dark:bg-zinc-700 text-black dark:text-white py-2 px-4 rounded"
            >
              Cancelar
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
