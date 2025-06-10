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

const donationSchema = z.object({
  donationType: z.string().min(1, "O tipo de doação é obrigatório."),
  quantity: z.coerce
    .number()
    .min(1, "A quantidade deve ser de no mínimo 1."),
  description: z
    .string()
    .min(5, "A descrição deve ter pelo menos 5 caracteres."),
  storeName: z
    .string()
    .min(2, "O nome da loja é obrigatório."),
  storeCnpj: z
    .string()
    .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, "CNPJ inválido. Use o formato XX.XXX.XXX/XXXX-XX."),
  price: z.coerce
    .number()
    .min(0.01, "O preço total deve ser maior que zero."),
});

type DonationFormData = z.infer<typeof donationSchema>;

export default function DonationPage() {
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
    try {
      const buyPayload = {
        Date: new Date(),
        Type: data.donationType, 
        StoreName: data.storeName,
        CNPJ: data.storeCnpj,
        Price: data.price,
        Description: data.description,
        Quantity: data.quantity,
      };

      const response = await axios.post(
        "https://localhost:5001/api/buys/addbuy",
        buyPayload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Dados enviados:", buyPayload);
      console.log("Resposta da API:", response.data);


      if (response.status === 200 || response.status === 201) {
        toast.success("Compra registrada com sucesso!");
        reset();
      }
    } catch (error: any) {
      let errorMessage = "Erro desconhecido";
      if (error.response?.data) {
        if (typeof error.response.data === 'object' && error.response.data.errors) {
            const validationErrors = error.response.data.errors;
            const errorMessages = Object.values(validationErrors).flat();
            errorMessage = errorMessages.join(' ');
        } else if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        } else if (
          typeof error.response.data === "object" &&
          error.response.data.message
        ) {
          errorMessage = error.response.data.message;
        } else {
          errorMessage = JSON.stringify(error.response.data);
        }
      } else if (error.request) {
        errorMessage = "Não foi possível conectar à API. Verifique se o backend está em execução.";
      } else {
        errorMessage = error.message;
      }

      toast.error("Falha ao registrar a compra: " + errorMessage);
      console.error("Erro ao registrar a compra: ", error);
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 max-w-3xl mx-auto my-10 p-6 sm:p-8 border dark:border-gray-700 rounded-xl shadow-lg bg-white dark:bg-black">
        <div className="flex justify-between items-center mb-8">
          <Image
            src={logo}
            alt="Logo"
            width={108.5}
            height={30}
            className="hidden sm:block"
          />
          <div className="flex-1 flex justify-center sm:justify-end">
            <ThemeToggle />
          </div>
        </div>

        <h1 className="text-3xl leading-none font-medium md:text-4xl text-zinc-800 dark:text-zinc-100 text-center mb-8">
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
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
            >
              <option value="">Selecione uma opção</option>
              <option value="Alimentos">Alimentos</option>
              <option value="Vestuário">Vestuário</option>
              <option value="Móveis">Móveis</option>
              <option value="Outros">Outros</option>
            </select>
            {errors.donationType && (
              <p className="text-red-500 text-sm mt-1">
                {errors.donationType.message}
              </p>
            )}
          </div>

          {/* Renderização condicional baseada no valor observado pelo react-hook-form */}
          {watchedDonationType && (
            <>
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-zinc-800 dark:text-zinc-100 mt-4">
                  Quantidade
                </label>
                <input
                  id="quantity"
                  type="number"
                  {...register("quantity")}
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
                  placeholder="Digite a quantidade"
                />
                {errors.quantity && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.quantity.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-zinc-800 dark:text-zinc-100 mt-4">
                  Descrição
                </label>
                <textarea
                  id="description"
                  {...register("description")}
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
                  placeholder="Descreva os itens da doação"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="storeName" className="block text-sm font-medium text-zinc-800 dark:text-zinc-100 mt-4">
                  Nome da Loja
                </label>
                <input
                  id="storeName"
                  type="text"
                  {...register("storeName")}
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
                  placeholder="Ex: Supermercado XYZ"
                />
                {errors.storeName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.storeName.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="storeCnpj" className="block text-sm font-medium text-zinc-800 dark:text-zinc-100 mt-4">
                  CNPJ da Loja
                </label>
                <input
                  id="storeCnpj"
                  type="text"
                  {...register("storeCnpj")}
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
                  placeholder="Ex: 12.345.678/0001-99"
                />
                {errors.storeCnpj && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.storeCnpj.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-zinc-800 dark:text-zinc-100 mt-4">
                  Preço Total
                </label>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register("price")}
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
                  placeholder="Ex: 123.45"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.price.message}
                  </p>
                )}
              </div>
            </>
          )}

          <div className="mt-6">
            <Button type="submit">Confirmar Doação</Button>
          </div>
        </form>
      </div>
    </div>
  );
}