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
});

type DonationFormData = z.infer<typeof donationSchema>;

export default function DonationPage() {
  const [doneeCnpj, setDoneeCnpj] = useState<string | null>(null);

  useEffect(() => {
    const storedCnpj = localStorage.getItem("cnpj");
    if (storedCnpj) {
      setDoneeCnpj(storedCnpj);
    } else {
      toast.error("CNPJ da instituição não encontrado.");
    }
  }, []);

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
    if (!doneeCnpj) {
      toast.error("CNPJ da instituição não encontrado.");
      return;
    }

    try {
      const cleanStoreCnpj = data.storeCnpj.replace(/\D/g, "");

      const buyPayload = {
        date: new Date().toISOString(),
        type: data.donationType,
        storeName: data.storeName,
        cnpj: cleanStoreCnpj,
        price: data.price,
        description: data.description,
        quantity: data.quantity,
        doneeCnpj: doneeCnpj,
      };

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "https://localhost:5001/api/buys/addbuy",
        buyPayload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Compra registrada com sucesso!");
        reset();
      }
    } catch (error: any) {
      let errorMessage = "Erro desconhecido";
      if (error.response?.data) {
        if (typeof error.response.data === "object" && error.response.data.errors) {
          const validationErrors = error.response.data.errors;
          const errorMessages = Object.values(validationErrors).flat();
          errorMessage = errorMessages.join(" ");
        } else if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        errorMessage = "Não foi possível conectar à API.";
      } else {
        errorMessage = error.message;
      }

      toast.error("Falha ao registrar a compra: " + errorMessage);
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
              <label htmlFor="donationType" className="block text-sm font-medium text-zinc-800 dark:text-zinc-100">
                Tipo de Doação
              </label>
              <select
                id="donationType"
                {...register("donationType")}
                className="w-full p-2 border rounded-md mt-1 bg-transparent dark:border-gray-700"
              >
                <option value="">Selecione uma opção</option>
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
                  <label htmlFor="quantity" className="block text-sm font-medium text-zinc-800 dark:text-zinc-100">
                    Quantidade
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    {...register("quantity")}
                    className="w-full p-2 border rounded-md mt-1 bg-transparent dark:border-gray-700"
                  />
                  {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message}</p>}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-zinc-800 dark:text-zinc-100">
                    Descrição
                  </label>
                  <textarea
                    id="description"
                    {...register("description")}
                    className="w-full p-2 border rounded-md mt-1 bg-transparent dark:border-gray-700"
                  />
                  {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                </div>

                <div>
                  <label htmlFor="storeName" className="block text-sm font-medium text-zinc-800 dark:text-zinc-100">
                    Nome da Loja
                  </label>
                  <input
                    id="storeName"
                    type="text"
                    {...register("storeName")}
                    className="w-full p-2 border rounded-md mt-1 bg-transparent dark:border-gray-700"
                  />
                  {errors.storeName && <p className="text-red-500 text-sm">{errors.storeName.message}</p>}
                </div>

                <div>
                  <label htmlFor="storeCnpj" className="block text-sm font-medium text-zinc-800 dark:text-zinc-100">
                    CNPJ da Loja
                  </label>
                  <input
                    id="storeCnpj"
                    type="text"
                    {...register("storeCnpj")}
                    className="w-full p-2 border rounded-md mt-1 bg-transparent dark:border-gray-700"
                  />
                  {errors.storeCnpj && <p className="text-red-500 text-sm">{errors.storeCnpj.message}</p>}
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-zinc-800 dark:text-zinc-100">
                    Preço Total
                  </label>
                  <input
                    id="price"
                    type="number"
                    step="0.01"
                    {...register("price")}
                    className="w-full p-2 border rounded-md mt-1 bg-transparent dark:border-gray-700"
                  />
                  {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
                </div>
              </>
            )}

            <div className="mt-6">
              <Button type="submit">Confirmar Doação</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
