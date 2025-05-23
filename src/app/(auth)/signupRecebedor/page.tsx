"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";
import logo from "@/assets/logo.png";
import axios from "axios";
import { toast } from "react-toastify";

const signupSchema = z.object({
  Nome_instituicao: z.string()
    .min(3, "O nome da instituição deve ter pelo menos 3 caracteres.")
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, "O nome da instituição deve conter apenas letras."),

  Tipo_instituicao: z.string()
    .min(3, "O tipo de instituição deve ter pelo menos 3 caracteres.")
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, "O tipo de instituição deve conter apenas letras."),

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

  Senha: z.string()
    .min(6, "A senha deve ter pelo menos 6 caracteres.")
    .regex(/[A-Z]/, "A senha deve ter pelo menos uma letra maiúscula.")
    .regex(/[0-9]/, "A senha deve ter pelo menos um número.")
    .regex(/[\W_]/, "A senha deve ter pelo menos um caractere especial."),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupRecebedor() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  async function onSubmit(data: SignupFormData) {
    try {
      const addForm = {
        CNPJ: data.CNPJ,
        InstitutionName: data.Nome_instituicao,
        InstitutionType: data.Tipo_instituicao,
        Email: data.Email,
        PhoneNumber: data.Telefone,
        RepresentativeName: data.Nome_representante,
        Password: data.Senha
      };

      const response = await axios.post("https://localhost:5001/api/donee/signupdonee", addForm, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      console.log("Dados enviados:", data);

      if (response.status === 200 || response.status === 201) {
        toast.success("Cadastro realizado com sucesso!");
        reset();
      }
    } catch (error: any) {
      let errorMessage = "Erro desconhecido";

      if (error.response?.data) {
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        } else if (typeof error.response.data === "object" && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else {
          errorMessage = JSON.stringify(error.response.data);
        }
      }

      toast.error("Falha ao cadastrar o usuário: " + errorMessage);
      console.log("Erro ao cadastrar o usuário:", errorMessage);
    }
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
          <label htmlFor="dropdown" className="block text-sm font-medium text-zinc-800 dark:text-zinc-100">
            
          </label>
          <select id="dropdown" {...register("Tipo_instituicao")} className="w-full p-2 border rounded-md mt-1">
            <option value=""> Tipo de instituição: </option>
            <option value="ONG">ONG</option>
            <option value="Associação">Associação</option>
            <option value="Fundação">Fundação</option>
          </select>
        </div>

        <div className="text-zinc-800 dark:text-zinc-100">
          <Input type="text" placeholder="CNPJ (00.000.000/0000-00)" {...register("CNPJ")} />
          {errors.CNPJ && <p className="text-red-500 text-sm ">{errors.CNPJ.message}</p>}
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
          <Input type="password" placeholder="Senha" {...register("Senha")} />
          {errors.Senha && <p className="text-red-500 text-sm">{errors.Senha.message}</p>}
        </div>

        <Button type="submit">Cadastrar</Button>
      </form>
    </div>
  );
}
