'use client';

import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import SidebarDoador from "@/components/SidebarDoador/page";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";

export default function EditProfile() {
  const { isAuthenticated } = useAuth("donator");

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: ""
  });

  useEffect(() => {
    if (isAuthenticated) {
      const cpf = localStorage.getItem("cpf");

      async function fetchProfile() {
        try {
          const response = await fetch(`https://localhost:5001/api/donator/cpf/${cpf}`);
          if (!response.ok) throw new Error("Erro ao buscar perfil.");

          const data = await response.json();
          setFormData(prev => ({
            ...prev,
            nome: data.name,
            email: data.email,
            telefone: data.phoneNumber
          }));
        } catch (err) {
          toast.error("Erro ao carregar perfil.");
        } finally {
          setLoading(false);
        }
      }

      fetchProfile();
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.senhaAtual) {
      toast.warn("A senha atual é obrigatória.");
      return;
    }

    if (formData.novaSenha && formData.novaSenha !== formData.confirmarSenha) {
      toast.warn("A nova senha e a confirmação não coincidem.");
      return;
    }

    setLoading(true);
    try {
      const cpf = localStorage.getItem("cpf");

      const payload = {
        name: formData.nome,
        email: formData.email,
        phoneNumber: formData.telefone,
        currentPassword: formData.senhaAtual,
        newPassword: formData.novaSenha || null,
        confirmPassword: formData.confirmarSenha || null
      };

      const response = await fetch(`https://localhost:5001/api/donator/cpf/${cpf}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg);
      }

      toast.success("Perfil atualizado com sucesso!");
      setFormData({ ...formData, senhaAtual: "", novaSenha: "", confirmarSenha: "" });
    } catch (err: any) {
      toast.error(`Erro: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen flex bg-white dark:bg-zinc-900">
      <aside className="w-64">
        <SidebarDoador />
      </aside>

      <main className="flex-1 flex justify-center items-center p-8">
        <div className="w-full max-w-xl rounded-xl shadow-lg bg-white dark:bg-zinc-800 p-8">
          <div className="flex flex-col items-center mb-6">
            <ThemeToggle />
          </div>

          <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-8 text-center">
            Editar Perfil
          </h1>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-purple-600"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome */}
              <div className="space-y-2">
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nome
                </label>
                <input
                  id="nome"
                  type="text"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {/* Telefone */}
              <div className="space-y-2">
                <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Telefone
                </label>
                <input
                  id="telefone"
                  type="tel"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                />
              </div>

              {/* Senha atual */}
              <div className="space-y-2">
                <label htmlFor="senhaAtual" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Senha atual
                </label>
                <input
                  id="senhaAtual"
                  type="password"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-red-300 dark:border-red-500 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-400"
                  value={formData.senhaAtual}
                  onChange={(e) => setFormData({ ...formData, senhaAtual: e.target.value })}
                  placeholder="Digite sua senha atual para confirmar"
                />
              </div>

              {/* Nova senha */}
              <div className="space-y-2">
                <label htmlFor="novaSenha" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nova senha (opcional)
                </label>
                <input
                  id="novaSenha"
                  type="password"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100"
                  value={formData.novaSenha}
                  onChange={(e) => setFormData({ ...formData, novaSenha: e.target.value })}
                  placeholder="Digite a nova senha (opcional)"
                />
              </div>

              {/* Confirmar senha */}
              <div className="space-y-2">
                <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirmar nova senha
                </label>
                <input
                  id="confirmarSenha"
                  type="password"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100"
                  value={formData.confirmarSenha}
                  onChange={(e) => setFormData({ ...formData, confirmarSenha: e.target.value })}
                  placeholder="Confirme a nova senha"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => window.location.reload()}
                  className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
                >
                  {loading ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
