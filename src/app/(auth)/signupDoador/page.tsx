"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";
import logo from "@/assets/logo.png";
import axios from "axios";

    const signupSchema = z.object({
        Nome: z.string()
          .min(3, "O nome deve ter pelo menos 3 caracteres.")
          .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, "O nome deve conter apenas letras."),
        
        CPF: z.string()
          .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido. Use o formato 000.000.000-00."),
        
        Email: z.string()
          .email("Insira um e-mail válido."),
        
        PhoneNumber: z.string()
          .regex(/^\d{11}$/, "O telefone deve ter 11 números e não pode conter espaços ou caracteres especiais."),
        
        Password: z.string()
          .min(6, "A senha deve ter pelo menos 6 caracteres.")
          .regex(/[A-Z]/, "A senha deve ter pelo menos uma letra maiúscula.")
          .regex(/[0-9]/, "A senha deve ter pelo menos um número.")
          .regex(/[\W_]/, "A senha deve ter pelo menos um caractere especial."),
      });
      

type SignupFormData = z.infer<typeof signupSchema>;

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const { reset } = useForm();
  async function onSubmit(data: SignupFormData) {
    try{
      const addForm = {
        CPF: data.CPF,
        Name: data.Nome,
        Email: data.Email,
        PhoneNumber: data.PhoneNumber,
        Password: data.Password
      }
      const response = await axios.post("https://localhost:5001/api/donator/signupdonator", addForm, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      console.log("Dados enviados:", data);

      if (response){
        reset();
      }
    } catch (error: any){
      console.error("Erro ao cadastrar usuário:", error);
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
        Cadastro de Doador
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-md mx-auto mt-6">
        <div>
          <Input type="text" placeholder="Nome" {...register("Nome")} />
          {errors.Nome && <p className="text-red-500 text-sm">{errors.Nome.message}</p>}
        </div>

        <div>
          <Input type="text" placeholder="CPF (000.000.000-00)" {...register("CPF")} />
          {errors.CPF && <p className="text-red-500 text-sm">{errors.CPF.message}</p>}
        </div>

        <div>
          <Input type="email" placeholder="E-mail" {...register("Email")} />
          {errors.Email && <p className="text-red-500 text-sm">{errors.Email.message}</p>}
        </div>

        <div>
          <Input type="text" placeholder="Telefone (Apenas números, ex: 11999998888)" {...register("PhoneNumber")} />
          {errors.PhoneNumber && <p className="text-red-500 text-sm">{errors.PhoneNumber.message}</p>}
        </div>

        <div>
          <Input type="password" placeholder="Senha" {...register("Password")} />
          {errors.Password && <p className="text-red-500 text-sm">{errors.Password.message}</p>}
        </div>

        <Button type="submit">Cadastrar</Button>
      </form>
    </div>
  );
}