'use client';

import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import SidebarDoador from "@/components/SidebarDoador/page";
import { useAuth } from "@/hooks/useAuth";

export default function EditProfile() {
  const { isAuthenticated, user } = useAuth("donator");

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    senha: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      async function fetchProfile() {
        await new Promise((r) => setTimeout(r, 1000));
        setFormData({
          nome: "João Silva",
          email: "joao@email.com",
          telefone: "(41) 99999-0000",
          senha: "",
        });
        setLoading(false);
      }

      fetchProfile();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    alert("Perfil atualizado com sucesso!");
    setLoading(false);
  };

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
              <div className="space-y-2">
                <label
                  htmlFor="nome"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Nome
                </label>
                <input
                  id="nome"
                  type="text"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="telefone"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Telefone
                </label>
                <input
                  id="telefone"
                  type="tel"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={formData.telefone}
                  onChange={(e) =>
                    setFormData({ ...formData, telefone: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="senha"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Senha
                </label>
                <input
                  id="senha"
                  type="password"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={formData.senha}
                  onChange={(e) =>
                    setFormData({ ...formData, senha: e.target.value })
                  }
                  placeholder="Deixe em branco para manter a senha atual"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => alert("Cancelou edição")}
                  className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
