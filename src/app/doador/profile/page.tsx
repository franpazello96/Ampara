'use client';

import { useState, useEffect } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import SidebarDoador from '@/components/SidebarDoador/page';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';

export default function EditProfile() {
  const { isAuthenticated, user } = useAuth('donator');

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });

  const [senhaValida, setSenhaValida] = useState(true);
  const [senhasCoincidem, setSenhasCoincidem] = useState(true);

  useEffect(() => {
    const cpf = user?.cpf;
    if (isAuthenticated && cpf) {
      async function fetchProfile() {
        try {
          const response = await fetch(`https://localhost:5001/api/donator/cpf/${cpf}`);
          if (!response.ok) throw new Error('Erro ao buscar perfil.');

          const data = await response.json();
          setFormData(prev => ({
            ...prev,
            nome: data.name,
            email: data.email,
            telefone: data.phoneNumber
          }));
        } catch (err) {
          toast.error('Erro ao carregar perfil.');
        } finally {
          setLoading(false);
        }
      }

      fetchProfile();
    }
  }, [isAuthenticated, user]);

  const validateSenha = (senha: string) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{5,}$/;
    return regex.test(senha);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cpf = user?.cpf;
    if (!cpf) {
      toast.error('CPF do usuário não encontrado.');
      return;
    }

    if (!formData.senhaAtual) {
      toast.warn('A senha atual é obrigatória.');
      return;
    }

    if (formData.novaSenha) {
      const valida = validateSenha(formData.novaSenha);
      setSenhaValida(valida);
      const coincidem = formData.novaSenha === formData.confirmarSenha;
      setSenhasCoincidem(coincidem);

      if (!valida || !coincidem) return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.nome,
        email: formData.email,
        phoneNumber: formData.telefone,
        currentPassword: formData.senhaAtual,
        newPassword: formData.novaSenha || null,
        confirmPassword: formData.confirmarSenha || null
      };

      const response = await fetch(`https://localhost:5001/api/donator/cpf/${cpf}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg);
      }

      toast.success('Perfil atualizado com sucesso!');
      setFormData({ ...formData, senhaAtual: '', novaSenha: '', confirmarSenha: '' });
    } catch (err: any) {
      toast.error(`Erro: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  const inputBase =
    'w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100';

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
              {['nome', 'email', 'telefone'].map(campo => (
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
                <label htmlFor="senhaAtual" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Senha atual <span className="text-red-500">*</span>
                </label>
                <input
                  id="senhaAtual"
                  type="password"
                  required
                  className={`${inputBase} border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500`}
                  value={formData.senhaAtual}
                  onChange={(e) => setFormData({ ...formData, senhaAtual: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="novaSenha" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nova senha
                </label>
                <input
                  id="novaSenha"
                  type="password"
                  className={`${inputBase} ${senhaValida ? 'border-gray-300 dark:border-gray-600' : 'border-red-500'}`}
                  value={formData.novaSenha}
                  onChange={(e) => setFormData({ ...formData, novaSenha: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirmar nova senha
                </label>
                <input
                  id="confirmarSenha"
                  type="password"
                  className={`${inputBase} ${senhasCoincidem ? 'border-gray-300 dark:border-gray-600' : 'border-red-500'}`}
                  value={formData.confirmarSenha}
                  onChange={(e) => setFormData({ ...formData, confirmarSenha: e.target.value })}
                />
                {!senhasCoincidem && (
                  <p className="text-sm text-red-500">As senhas não coincidem</p>
                )}
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
                  {loading ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
