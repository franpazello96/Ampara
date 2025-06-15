'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar/page";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { Button } from "@/components/button";
import { toast } from "react-toastify";

export default function Profile() {
  const [cnpj, setCnpj] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [institutionType, setInstitutionType] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [representativeName, setRepresentativeName] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const savedCnpj = localStorage.getItem("cnpj");
    if (!savedCnpj) {
      toast.error("CNPJ não encontrado. Faça login novamente.");
      router.push("/signin");
      return;
    }
    setCnpj(savedCnpj);

    fetch(`https://localhost:5001/api/donee/getbycnpj?cnpj=${encodeURIComponent(savedCnpj)}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setInstitutionName(data.institutionName);
        setInstitutionType(data.institutionType);
        setEmail(data.email);
        setPhoneNumber(data.phoneNumber);
        setRepresentativeName(data.representativeName);
      })
      .catch(() => toast.error("Erro ao carregar dados do perfil."));
  }, [router]);

  const handleUpdate = async () => {
    try {
      const bodyData: any = {
        institutionName,
        institutionType,
        email,
        phoneNumber,
        representativeName,
      };

      if (password.trim()) {
        bodyData.password = password;
      }

      const res = await fetch(`https://localhost:5001/api/donee/cnpj?cnpj=${encodeURIComponent(cnpj)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (!res.ok) throw new Error();

      toast.success("Perfil atualizado com sucesso!");
    } catch {
      toast.error("Erro ao atualizar perfil.");
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm("Tem certeza que deseja excluir sua conta?");
    if (!confirm) return;

    try {
      const res = await fetch(`https://localhost:5001/api/donee/cnpj?cnpj=${encodeURIComponent(cnpj)}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      localStorage.clear();
      toast.success("Conta excluída com sucesso!");
      setTimeout(() => {
        router.push("/signin");
      }, 1000);
    } catch {
      toast.error("Erro ao excluir conta.");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-xl space-y-6 bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center">
            <Image src={logo} alt="Logo" width={108.5} height={30} />
            <ThemeToggle />
          </div>

          <h1 className="text-2xl font-bold text-center text-purple-600 dark:text-purple-400">
            Editar Perfil da Instituição
          </h1>

          <div>
            <label className="block mb-1">Nome da Instituição</label>
            <input
              type="text"
              className="w-full p-2 border rounded dark:bg-zinc-700 dark:text-white"
              value={institutionName}
              onChange={(e) => setInstitutionName(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1">Tipo da Instituição</label>
            <input
              type="text"
              className="w-full p-2 border rounded dark:bg-zinc-700 dark:text-white"
              value={institutionType}
              onChange={(e) => setInstitutionType(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1">Nome do Representante</label>
            <input
              type="text"
              className="w-full p-2 border rounded dark:bg-zinc-700 dark:text-white"
              value={representativeName}
              onChange={(e) => setRepresentativeName(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded dark:bg-zinc-700 dark:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1">Telefone</label>
            <input
              type="text"
              className="w-full p-2 border rounded dark:bg-zinc-700 dark:text-white"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1">Nova Senha</label>
            <input
              type="password"
              className="w-full p-2 border rounded dark:bg-zinc-700 dark:text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Deixe em branco para não alterar"
            />
          </div>

          <Button onClick={handleUpdate}>Salvar Alterações</Button>

          <button
            onClick={handleDelete}
            className="w-full p-2 border border-red-500 text-red-600 rounded hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
          >
            Excluir Conta
          </button>
        </div>
      </div>
    </div>
  );
}
