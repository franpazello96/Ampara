"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import SidebarDoador from "@/components/SidebarDoador/page";
import Image from "next/image";
import logo from "@/assets/logo.png";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";

interface Donee {
  institutionName: string;
  cnpj: string;
}

export default function DonationPage() {
  const { isAuthenticated, user } = useAuth("donator");

  const [donees, setDonees] = useState<Donee[]>([]);
  const [selectedCnpj, setSelectedCnpj] = useState("");
  const [donationType, setDonationType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [recurrence, setRecurrence] = useState(false);
  const [timeRecurrence, setTimeRecurrence] = useState("");

  useEffect(() => {
    async function fetchInstitutions() {
      try {
        const response = await axios.get("https://localhost:5001/api/donee");

        const data = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.$values)
          ? response.data.$values
          : [];

        setDonees(data);

        if (data.length === 0) {
          toast.warn("Nenhuma instituição disponível.", { toastId: "sem-instituicoes" });
        }
      } catch (error) {
        console.error("Erro ao buscar instituições:", error);
        toast.error("Erro ao buscar instituições.", { toastId: "erro-instituicoes" });
      }
    }

    fetchInstitutions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!donationType || !quantity || !description || !selectedCnpj) {
      toast.warn("Preencha todos os campos obrigatórios.");
      return;
    }

    const quantityValue = Number(quantity);
    if (isNaN(quantityValue) || quantityValue <= 0) {
      toast.warn("Informe um valor numérico válido e maior que zero.");
      return;
    }

    const isMoney = donationType === "Dinheiro";

    const donation = {
      donationType,
      quantity: isMoney ? null : quantityValue,
      amount: isMoney ? quantityValue : null,
      description,
      recurrence,
      timeRecurrence: recurrence ? timeRecurrence : null,
      date: new Date().toISOString(),
      donatorCpf: user?.cpf ?? "",
      doneeCnpj: selectedCnpj
    };

    const endpoint = isMoney
      ? "https://localhost:5001/api/donation/moneydonation"
      : "https://localhost:5001/api/donation/fooddonation";

    try {
      const response = await axios.post(endpoint, donation, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        }
      });

      if (response.status === 200) {
        toast.success("Doação registrada com sucesso!");
        setDonationType("");
        setQuantity("");
        setDescription("");
        setSelectedCnpj("");
        setRecurrence(false);
        setTimeRecurrence("");
      }
    } catch (error) {
      console.error("Erro ao registrar doação:", error);

      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data || "Erro ao registrar doação.");
      } else {
        toast.error("Erro desconhecido ao registrar doação.");
      }
    }
  };

  if (!isAuthenticated) return null;

  const recurrenceOptions = [
    "Semanal",
    "Mensal",
    "Bimestral",
    "Trimestral",
    "Semestral",
    "Anual"
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-zinc-100 dark:bg-zinc-900">
      <SidebarDoador />
      <main className="flex-1 p-6 md:p-10">
        <div className="flex flex-col items-center">
          <Image src={logo} alt="Logo" width={120} height={40} />
          <ThemeToggle />
          <h1 className="text-2xl md:text-3xl font-bold mt-4 mb-6 text-center">Fazer uma Doação</h1>

          <div className="w-full max-w-lg space-y-6">
            <div>
              <label className="block mb-1 font-medium">Tipo de Doação</label>
              <select
                className="w-full p-2 rounded border"
                value={donationType}
                onChange={(e) => setDonationType(e.target.value)}
              >
                <option value="">Selecione</option>
                <option value="Alimentos">Alimentos</option>
                <option value="Dinheiro">Dinheiro</option>
              </select>
            </div>

            {donationType && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium">Instituição</label>
                  <select
                    className="w-full p-2 rounded border"
                    value={selectedCnpj}
                    onChange={(e) => setSelectedCnpj(e.target.value)}
                  >
                    <option value="">Selecione a instituição</option>
                    {donees.map((d) => (
                      <option key={d.cnpj} value={d.cnpj}>
                        {d.institutionName} ({d.cnpj})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-medium">
                    {donationType === "Dinheiro" ? "Valor (R$)" : "Quantidade (kg)"}
                  </label>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Informe a quantidade"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">Descrição</label>
                  <textarea
                    className="w-full p-2 rounded border"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ex: arroz, feijão, doação pontual..."
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={recurrence}
                    onChange={(e) => setRecurrence(e.target.checked)}
                  />
                  <label className="font-medium">Doação Recorrente</label>
                </div>

                {recurrence && (
                  <div>
                    <label className="block mb-1 font-medium">Frequência</label>
                    <select
                      className="w-full p-2 rounded border"
                      value={timeRecurrence}
                      onChange={(e) => setTimeRecurrence(e.target.value)}
                    >
                      <option value="">Selecione a frequência</option>
                      {recurrenceOptions.map((freq) => (
                        <option key={freq} value={freq}>
                          {freq}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <Button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
                  Confirmar Doação
                </Button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
