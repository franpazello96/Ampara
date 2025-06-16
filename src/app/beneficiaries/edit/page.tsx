'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar/page';
import { ThemeToggle } from '@/components/ThemeToggle';
import { toast } from 'react-toastify';

export default function EditBeneficiary() {
  const searchParams = useSearchParams();
  const document = searchParams.get("document");
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    cnpj: ''
  });

  useEffect(() => {
    if (!document) return;

    const fetchBeneficiary = async () => {
      try {
        const res = await fetch(`https://localhost:5001/api/benefitiary/bydocument?document=${encodeURIComponent(document)}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setFormData({
          id: data.id,
          nome: data.name,
          email: data.email,
          telefone: data.phoneNumber,
          cpf: data.cpf ?? '',
          cnpj: data.cnpj ?? ''
        });
      } catch {
        toast.error("Erro ao carregar beneficiário.");
      } finally {
        setLoading(false);
      }
    };

    fetchBeneficiary();
  }, [document]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    toast.info(({ closeToast }) => (
      <div>
        <p className="font-medium">Deseja realmente salvar as alterações?</p>
        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={() => {
              closeToast?.();
              salvarAlteracoes();
            }}
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            Confirmar
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700"
          >
            Cancelar
          </button>
        </div>
      </div>
    ), { autoClose: false });
  };

    const salvarAlteracoes = async () => {
    setSaving(true);
    try {
      const payload = {
        name: formData.nome,
        email: formData.email,
        phoneNumber: formData.telefone
      };

      const isCpf = !!formData.cpf;
      const docValue = isCpf ? formData.cpf : formData.cnpj;
      const url = isCpf
        ? `https://localhost:5001/api/benefitiary/cpf/${encodeURIComponent(docValue)}`
        : `https://localhost:5001/api/benefitiary/cnpj?cnpj=${encodeURIComponent(docValue)}`;

      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error();
      toast.success("Beneficiário atualizado com sucesso!");
      router.push("/beneficiaries");
    } catch {
      toast.error("Erro ao salvar alterações.");
    } finally {
      setSaving(false);
    }
  };


  const inputBase =
    'w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100';

  return (
    <div className="min-h-screen flex bg-white dark:bg-zinc-900">
      <aside className="w-64">
        <Sidebar />
      </aside>

      <main className="flex-1 flex justify-center items-center p-8">
        <div className="w-full max-w-xl rounded-xl shadow-lg bg-white dark:bg-zinc-800 p-8">
          <div className="flex flex-col items-center mb-6">
            <ThemeToggle />
          </div>

          <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-8 text-center">
            Editar Beneficiário
          </h1>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-purple-600"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {['nome', 'email', 'telefone'].map((campo) => (
                <div className="space-y-2" key={campo}>
                  <label htmlFor={campo} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {campo.charAt(0).toUpperCase() + campo.slice(1)}
                  </label>
                  <input
                    id={campo}
                    type={campo === 'email' ? 'email' : 'text'}
                    required
                    className={`${inputBase} border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500`}
                    value={(formData as any)[campo]}
                    onChange={(e) => setFormData({ ...formData, [campo]: e.target.value })}
                  />
                </div>
              ))}

              <div className="space-y-2">
                <label htmlFor="documento" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Documento
                </label>
                <input
                  id="documento"
                  type="text"
                  disabled
                  value={formData.cpf || formData.cnpj}
                  className={`${inputBase} bg-gray-100 dark:bg-zinc-700 cursor-not-allowed`}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => router.refresh()}
                  className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
                >
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
