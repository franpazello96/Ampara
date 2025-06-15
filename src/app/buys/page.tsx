"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "@/components/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";
import logo from "@/assets/logo.png";
import Sidebar from "@/components/Sidebar/page";
import { useEffect, useState } from "react";

const donationSchema = z.object({
  donationType: z.string().min(1),
  quantity: z.coerce.number().min(1),
  description: z.string().min(5),
  storeName: z.string().min(2),
  storeCnpj: z.string().regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/),
  price: z.coerce.number().min(0.01),
  beneficiaryId: z.union([z.string(), z.number()]).optional(),
});

type DonationFormData = z.infer<typeof donationSchema>;

export default function BuysPage() {
  const [doneeCnpj, setDoneeCnpj] = useState<string | null>(null);
  const [beneficiaries, setBeneficiaries] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const storedCnpj = localStorage.getItem("cnpj");
    if (storedCnpj) {
      setDoneeCnpj(storedCnpj);
    } else {
      toast.error("CNPJ da instituição não encontrado.");
    }
  }, []);

  useEffect(() => {
    const fetchBeneficiaries = async () => {
      if (!doneeCnpj) return;
      try {
        const res = await axios.get(`https://localhost:5001/api/benefitiary/bydonee?cnpj=${doneeCnpj}`);
        setBeneficiaries(res.data);
      } catch {
        toast.error("Erro ao carregar beneficiários.");
      }
    };

    fetchBeneficiaries();
  }, [doneeCnpj]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
  });

  const watchedDonationType = watch("donationType");

  async function onSubmit(data: DonationFormData) {
    if (!doneeCnpj) return toast.error("CNPJ da instituição não encontrado.");

    try {
      const cleanStoreCnpj = data.storeCnpj.replace(/\D/g, "");
      const payload = {
        date: new Date().toISOString(),
        type: data.donationType,
        storeName: data.storeName,
        cnpj: cleanStoreCnpj,
        price: data.price,
        description: data.description,
        quantity: data.quantity,
        doneeCnpj: doneeCnpj,
        benefitiaryId: data.beneficiaryId ? Number(data.beneficiaryId) : null,
      };

      const token = localStorage.getItem("token");

      const response = await axios.post("https://localhost:5001/api/buys/addbuy", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Compra registrada com sucesso!");
        reset();
      }
    } catch (error: any) {
      toast.error("Erro ao registrar a compra.");
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="ml-64 flex flex-col items-center justify-center flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-3xl p-8 border dark:border-gray-700 rounded-xl shadow-lg bg-white dark:bg-black">
          <div className="flex justify-between items-center mb-8">
            <Image src={logo} alt="Logo" width={108.5} height={30} className="hidden sm:block" />
            <div className="flex-1 flex justify-center sm:justify-end">
              <ThemeToggle />
            </div>
          </div>

          <h1 className="text-3xl font-medium text-center text-zinc-800 dark:text-zinc-100 mb-8">
            Cadastro de compras para doações
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <label htmlFor="donationType">Tipo de Doação</label>
              <select {...register("donationType")} className="w-full p-2 border rounded bg-transparent dark:border-gray-700">
                <option value="">Selecione</option>
                <option value="Alimentos">Alimentos</option>
                <option value="Vestuário">Vestuário</option>
                <option value="Móveis">Móveis</option>
                <option value="Outros">Outros</option>
              </select>
              {errors.donationType && <p className="text-red-500 text-sm">{errors.donationType.message}</p>}
            </div>

            {watchedDonationType && (
              <>
                <input {...register("quantity")} placeholder="Quantidade" className="p-2 border rounded" />
                <textarea {...register("description")} placeholder="Descrição" className="p-2 border rounded" />
                <input {...register("storeName")} placeholder="Nome da Loja" className="p-2 border rounded" />
                <input {...register("storeCnpj")} placeholder="CNPJ da Loja" className="p-2 border rounded" />
                <input {...register("price")} type="number" step="0.01" placeholder="Preço Total" className="p-2 border rounded" />

                {beneficiaries.length > 0 && (
                  <select {...register("beneficiaryId")} className="p-2 border rounded bg-transparent dark:border-gray-700">
                    <option value="">Selecione um beneficiário</option>
                    {beneficiaries.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                )}
              </>
            )}

            <div className="mt-4">
              <Button type="submit">Confirmar Doação</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
