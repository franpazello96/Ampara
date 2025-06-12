"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import Sidebar from "@/components/Sidebar/page";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface DonatorFormData {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  password: string;
  donationType: 'Mensal' | 'Bimestral' | 'Trimestral' | 'Semestral' | 'Anual';
  monthlyDonation: number;
  status: "ativo" | "inativo";
}

export default function EditDonator({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<DonatorFormData>({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    password: "",
    donationType: "Mensal",
    monthlyDonation: 0,
    status: "ativo",
  });

  useEffect(() => {
    // Mock do carregamento dos dados do doador
    const fetchDonator = async () => {
      try {
        // Simula delay de rede
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Mock dos dados - substituir pela chamada à API
        setFormData({
          name: "Maria Silva",
          email: "maria.silva@email.com",
          phone: "(41) 99999-1111",
          cpf: "123.456.789-00",
          password: "******",
          donationType: "Mensal",
          monthlyDonation: 100.00,
          status: "ativo",
        });
      } catch (error) {
        console.error("Erro ao carregar dados do doador:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonator();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Simula delay de rede
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock da atualização - substituir pela chamada à API
      console.log("Dados atualizados:", formData);
      
      router.push("/donators");
    } catch (error) {
      console.error("Erro ao atualizar doador:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      <Sidebar />
      <div className="flex flex-col ml-64">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              Editar Doador
            </h1>
            <ThemeToggle />
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nome
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Telefone
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      CPF
                    </label>
                    <input
                      id="cpf"
                      type="text"
                      required
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={formData.cpf}
                      onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Senha
                    </label>
                    <input
                      id="password"
                      type="password"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Deixe em branco para manter a senha atual"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="donationType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tipo de Doação
                    </label>
                    <select
                      id="donationType"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={formData.donationType}
                      onChange={(e) => setFormData({ ...formData, donationType: e.target.value as DonatorFormData['donationType'] })}
                    >
                      <option value="Mensal">Mensal</option>
                      <option value="Bimestral">Bimestral</option>
                      <option value="Trimestral">Trimestral</option>
                      <option value="Semestral">Semestral</option>
                      <option value="Anual">Anual</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="monthlyDonation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Valor da Doação
                    </label>
                    <input
                      id="monthlyDonation"
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={formData.monthlyDonation}
                      onChange={(e) => setFormData({ ...formData, monthlyDonation: parseFloat(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Status
                    </label>
                    <select
                      id="status"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as "ativo" | "inativo" })}
                    >
                      <option value="ativo">Ativo</option>
                      <option value="inativo">Inativo</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => router.push("/donators")}
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
        </div>
      </div>
    </div>
  );
}
