"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";
import logo from "@/assets/logo.png";

const signupSchema = z.object({
  Nome_instituicao: z.string()
    .min(3, "O nome da instituição deve ter pelo menos 3 caracteres.")
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, "O nome da instituição deve conter apenas letras."),
  
  CNPJ: z.string()
    .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, "CNPJ inválido. Use o formato 00.000.000/0000-00."),
  
  Email: z.string()
    .email("Insira um e-mail válido."),
  
  Telefone: z.string()
    .regex(/^\d{11}$/, "O telefone deve ter 11 números e não pode conter espaços ou caracteres especiais."),
  
  Nome_representante: z.string()
    .min(3, "O nome do representante deve ter pelo menos 3 caracteres.")
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, "O nome do representante deve conter apenas letras."),
  
  CPF: z.string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido. Use o formato 000.000.000-00."),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupRecebedor() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  function onSubmit(data: SignupFormData) {
    console.log("Dados enviados:", data);
  }

  return (
    <div className="min-h-screen">
      <div className="flex flex-col justify-center items-center">
        <Image src={logo} alt="Logo" width={108.5} height={30} />
        <ThemeToggle />
      </div>

      <h1 className="flex text-4xl leading-none font-medium md:text-4xl mt-10 
        text-zinc-800 dark:text-zinc-100 justify-center items-center">
        Cadastro de Recebedor
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-md mx-auto mt-6">
        <div>
          <Input type="text" placeholder="Nome da Instituição" {...register("Nome_instituicao")} />
          {errors.Nome_instituicao && <p className="text-red-500 text-sm">{errors.Nome_instituicao.message}</p>}
        </div>

        <div>
          <Input type="text" placeholder="CNPJ (00.000.000/0000-00)" {...register("CNPJ")} />
          {errors.CNPJ && <p className="text-red-500 text-sm">{errors.CNPJ.message}</p>}
        </div>

        <div>
          <Input type="email" placeholder="E-mail" {...register("Email")} />
          {errors.Email && <p className="text-red-500 text-sm">{errors.Email.message}</p>}
        </div>

        <div>
          <Input type="text" placeholder="Telefone (Apenas números, ex: 11999998888)" {...register("Telefone")} />
          {errors.Telefone && <p className="text-red-500 text-sm">{errors.Telefone.message}</p>}
        </div>

        <div>
          <Input type="text" placeholder="Nome do Representante" {...register("Nome_representante")} />
          {errors.Nome_representante && <p className="text-red-500 text-sm">{errors.Nome_representante.message}</p>}
        </div>

        <div>
          <Input type="text" placeholder="CPF do Representante (000.000.000-00)" {...register("CPF")} />
          {errors.CPF && <p className="text-red-500 text-sm">{errors.CPF.message}</p>}
        </div>

        <Button type="submit">Cadastrar</Button>
      </form>
    </div>
  );
}