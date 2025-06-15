"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "@/components/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";
import logo from "@/assets/logo.png";
import Sidebar from "@/components/Sidebar/page";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

// Validação com Zod
const schema = z
  .object({
    personType: z.enum(["Física", "Jurídica"]),
    name: z.string().min(2, "O nome é obrigatório."),
    cpf: z
      .string()
      .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido. Use o formato XXX.XXX.XXX-XX.")
      .optional(),
    cnpj: z
      .string()
      .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, "CNPJ inválido. Use o formato XX.XXX.XXX/XXXX-XX.")
      .optional(),
    email: z.string().email("E-mail inválido.").optional(),
    phoneNumber: z.string().min(8, "Número de telefone é obrigatório."),
  })
  .superRefine((data, ctx) => {
    if (data.personType === "Física" && !data.cpf) {
      ctx.addIssue({
        path: ["cpf"],
        code: z.ZodIssueCode.custom,
        message: "O CPF é obrigatório para pessoa física.",
      });
    }
    if (data.personType === "Jurídica" && !data.cnpj) {
      ctx.addIssue({
        path: ["cnpj"],
        code: z.ZodIssueCode.custom,
        message: "O CNPJ é obrigatório para pessoa jurídica.",
      });
    }
  });

type FormData = z.infer<typeof schema>;

export default function SignUpBeneficiaryPage() {
  const { user } = useAuth("donee");
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const toastId = "auth-check-toast";

    const showToastOnce = (type: "warn" | "error", message: string) => {
      if (!toast.isActive(toastId)) {
        toast[type](message, { toastId });
      }
    };

    if (!token) {
      showToastOnce("warn", "Você precisa estar logado para acessar esta página.");
      router.replace("/signin"); // ✅ impede múltiplos push
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now();

      if (decoded.exp * 1000 < currentTime) {
        localStorage.removeItem("token");
        showToastOnce("warn", "Sessão expirada. Faça login novamente.");
        router.replace("/signin");
        return;
      }

      setAuthChecked(true);
    } catch {
      localStorage.removeItem("token");
      showToastOnce("error", "Token inválido. Faça login novamente.");
      router.replace("/signin");
    }
  }, [router]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const personType = watch("personType");

  const onSubmit = async (data: FormData) => {
    if (!user?.cnpj) {
      toast.error("CNPJ da instituição não encontrado.");
      return;
    }

    const payload = {
      Name: data.name,
      CPF: data.personType === "Física" ? data.cpf : null,
      CNPJ: data.personType === "Jurídica" ? data.cnpj : null,
      Email: data.email,
      PhoneNumber: data.phoneNumber,
      DoneeCnpj: user.cnpj,
    };

    try {
      await axios.post("https://localhost:5001/api/benefitiary/signupbenefitiary", payload);
      toast.success("Beneficiário cadastrado com sucesso!");
      reset();
    } catch (error: any) {
      console.error(error);
      toast.error("Erro ao cadastrar beneficiário.");
    }
  };

  if (!authChecked) return null; // 🔒 garante que nada aparece antes da verificação

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
          Cadastro de Beneficiário
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-100">Tipo de Pessoa</label>
            <select
              {...register("personType")}
              className="w-full p-2 border rounded-md bg-transparent dark:border-gray-700"
            >
              <option value="">Selecione</option>
              <option value="Física">Física</option>
              <option value="Jurídica">Jurídica</option>
            </select>
            {errors.personType && <p className="text-red-500 text-sm">{errors.personType.message}</p>}
          </div>

          {personType && (
            <>
              <div>
                <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-100">Nome</label>
                <input
                  type="text"
                  {...register("name")}
                  className="w-full p-2 border rounded-md bg-transparent dark:border-gray-700"
                  placeholder="Nome ou razão social"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>

              {personType === "Física" && (
                <div>
                  <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-100">CPF</label>
                  <input
                    type="text"
                    {...register("cpf")}
                    className="w-full p-2 border rounded-md bg-transparent dark:border-gray-700"
                    placeholder="123.456.789-00"
                  />
                  {errors.cpf && <p className="text-red-500 text-sm">{errors.cpf.message}</p>}
                </div>
              )}

              {personType === "Jurídica" && (
                <div>
                  <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-100">CNPJ</label>
                  <input
                    type="text"
                    {...register("cnpj")}
                    className="w-full p-2 border rounded-md bg-transparent dark:border-gray-700"
                    placeholder="12.345.678/0001-99"
                  />
                  {errors.cnpj && <p className="text-red-500 text-sm">{errors.cnpj.message}</p>}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-100">E-mail</label>
                <input
                  type="email"
                  {...register("email")}
                  className="w-full p-2 border rounded-md bg-transparent dark:border-gray-700"
                  placeholder="usuario@email.com"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-100">Telefone</label>
                <input
                  type="text"
                  {...register("phoneNumber")}
                  className="w-full p-2 border rounded-md bg-transparent dark:border-gray-700"
                  placeholder="(99) 99999-9999"
                />
                {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
              </div>

              <div className="mt-6">
                <Button type="submit">Cadastrar Beneficiário</Button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
