'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SidebarDoador from '@/components/SidebarDoador/page';
import { ThemeToggle } from '@/components/ThemeToggle';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth';

export default function EditProfile() {
  const { isAuthenticated, user } = useAuth("donator");
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    senhaAtual: '',
    novaSenha: '',
  });

  useEffect(() => {
    if (!user?.cpf) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`https://localhost:5001/api/donator/cpf/${user.cpf}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setFormData({
          ...formData,
          nome: data.name,
          email: data.email,
          telefone: data.phoneNumber
        });
      } catch (err) {
        toast.error("Erro ao carregar dados do perfil.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.cpf) return;

    setSaving(true);

    try {
      const payload = {
        name: formData.nome,
        email: formData.email,
        phoneNumber: formData.telefone,
        password: formData.senhaAtual,
        newPassword: formData.novaSenha || null
      };

      const response = await fetch(`https://localhost:5001/api/donator/cpf/${user.cpf}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg);
      }

      toast.success("Perfil atualizado com sucesso!");
    } catch (err: any) {
      toast.error(err.message || "Erro ao atualizar perfil.");
    } finally {
      setSaving(false);
    }
  };

  if (isAuthenticated === null || !user) {
    return <div className="p-10 text-gray-500">Carregando autenticação...</div>;
  }

  if (!isAuthenticated || !user?.cpf) {
    return <div className="p-10 text-red-500">Usuário não autenticado ou CPF não disponível</div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 flex">
      <SidebarDoador />
      <main className="pl-64 p-8 w-full">
        <ThemeToggle />
        <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-6">
          Editar Perfil
        </h1>

        {loading ? (
          <p>Carregando dados...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 max-w-xl bg-white dark:bg-zinc-800 p-6 rounded shadow">
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300">Nome</label>
              <input
                name="nome"
                value={formData.nome}
                onChange={e => setFormData({ ...formData, nome: e.target.value })}
                required
                className="w-full p-2 rounded border dark:border-zinc-600 bg-white dark:bg-zinc-900 text-black dark:text-white"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full p-2 rounded border dark:border-zinc-600 bg-white dark:bg-zinc-900 text-black dark:text-white"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300">Telefone</label>
              <input
                name="telefone"
                type="tel"
                value={formData.telefone}
                onChange={e => setFormData({ ...formData, telefone: e.target.value })}
                required
                className="w-full p-2 rounded border dark:border-zinc-600 bg-white dark:bg-zinc-900 text-black dark:text-white"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300">Senha atual</label>
              <input
                name="senhaAtual"
                type="password"
                value={formData.senhaAtual}
                onChange={e => setFormData({ ...formData, senhaAtual: e.target.value })}
                required
                className="w-full p-2 rounded border dark:border-zinc-600 bg-white dark:bg-zinc-900 text-black dark:text-white"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300">Nova senha (opcional)</label>
              <input
                name="novaSenha"
                type="password"
                value={formData.novaSenha}
                onChange={e => setFormData({ ...formData, novaSenha: e.target.value })}
                className="w-full p-2 rounded border dark:border-zinc-600 bg-white dark:bg-zinc-900 text-black dark:text-white"
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
                onClick={() => router.push("/profile")}
                className="bg-gray-200 dark:bg-zinc-700 text-black dark:text-white py-2 px-4 rounded"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
