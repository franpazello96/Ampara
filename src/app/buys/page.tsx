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
    if (!doneeCnpj) return;
    axios
      .get(`https://localhost:5001/api/benefitiary/bydonee?cnpj=${doneeCnpj}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(res => setBeneficiaries(res.data))
      .catch(() => toast.error("Erro ao carregar beneficiários."));
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
      const payload = {
        date: new Date().toISOString(),
        type: data.donationType,
        storeName: data.storeName,
        cnpj: data.storeCnpj.replace(/\D/g, ""),
        price: data.price,
        description: data.description,
        quantity: data.quantity,
        doneeCnpj: doneeCnpj,
        benefitiaryId: data.beneficiaryId ? Number(data.beneficiaryId) : null,
      };

      const response = await axios.post("https://localhost:5001/api/buys/addbuy", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Compra registrada com sucesso!");
        reset();
      }
    } catch {
      toast.error("Erro ao registrar a compra.");
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 max-w-3xl mx-auto my-10 p-6 sm:p-8 border dark:border-gray-700 rounded-xl shadow-lg bg-white dark:bg-black">
        <div className="flex justify-between items-center mb-8">
          <Image src={logo} alt="Logo" width={108.5} height={30} className="hidden sm:block" />
          <div className="flex-1 flex justify-center sm:justify-end">
            <ThemeToggle />
          </div>
        </div>

        <h1 className="text-3xl font-medium md:text-4xl text-center text-zinc-800 dark:text-zinc-100 mb-8">
          Cadastro de Compra
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-100">Tipo de Doação</label>
            <select
              {...register("donationType")}
              className="w-full p-2 border rounded-md bg-transparent dark:border-gray-700"
            >
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
              <div>
                <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-100">Quantidade</label>
                <input
                  type="number"
                  {...register("quantity")}
                  className="w-full p-2 border rounded-md bg-transparent dark:border-gray-700"
                  placeholder="Quantidade"
                />
                {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-100">Descrição</label>
                <textarea
                  {...register("description")}
                  className="w-full p-2 border rounded-md bg-transparent dark:border-gray-700"
                  placeholder="Descrição da compra"
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-100">Nome da Loja</label>
                <input
                  {...register("storeName")}
                  className="w-full p-2 border rounded-md bg-transparent dark:border-gray-700"
                  placeholder="Nome da Loja"
                />
                {errors.storeName && <p className="text-red-500 text-sm">{errors.storeName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-100">CNPJ da Loja</label>
                <input
                  {...register("storeCnpj")}
                  className="w-full p-2 border rounded-md bg-transparent dark:border-gray-700"
                  placeholder="00.000.000/0000-00"
                />
                {errors.storeCnpj && <p className="text-red-500 text-sm">{errors.storeCnpj.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-100">Preço Total</label>
                <input
                  type="number"
                  step="0.01"
                  {...register("price")}
                  className="w-full p-2 border rounded-md bg-transparent dark:border-gray-700"
                  placeholder="Preço Total"
                />
                {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
              </div>

              {beneficiaries.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-100">Beneficiário</label>
                  <select
                    {...register("beneficiaryId")}
                    className="w-full p-2 border rounded-md bg-transparent dark:border-gray-700"
                  >
                    <option value="">Selecione um beneficiário</option>
                    {beneficiaries.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mt-6">
                <Button type="submit">Confirmar Compra</Button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
