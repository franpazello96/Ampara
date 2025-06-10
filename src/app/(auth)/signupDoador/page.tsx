"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.png";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation"; // 👈 Importa useRouter

const signupSchema = z.object({
  Name: z
    .string()
    .min(3, "O nome deve ter pelo menos 3 caracteres.")
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, "O nome deve conter apenas letras."),

  CPF: z
    .string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido. Use o formato 000.000.000-00."),

  Email: z.string().email("Insira um e-mail válido."),

  PhoneNumber: z
    .string()
    .regex(/^\d{11}$/, "O telefone deve ter 11 números e não pode conter espaços ou caracteres especiais."),

  Password: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres.")
    .regex(/[A-Z]/, "A senha deve ter pelo menos uma letra maiúscula.")
    .regex(/[0-9]/, "A senha deve ter pelo menos um número.")
    .regex(/[\W_]/, "A senha deve ter pelo menos um caractere especial."),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function Signup() {
  const router = useRouter(); // 👈 Inicializa router

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  async function onSubmit(data: SignupFormData) {
    try {
      const addForm = {
        CPF: data.CPF,
        Name: data.Name,
        Email: data.Email,
        PhoneNumber: data.PhoneNumber,
        Password: data.Password,
      };
      const response = await axios.post(
        "https://localhost:5001/api/donator/signupdonator",
        addForm,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Dados enviados:", data);

      if (response.status === 200 || response.status === 201) {
        toast.success("Cadastro realizado com sucesso!");
        reset();
        router.push("/signin"); // 👈 Redireciona para login
      }
    } catch (error: any) {
      let errorMessage = "Erro desconhecido";

      if (error.response?.data) {
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        } else if (
          typeof error.response.data === "object" &&
          error.response.data.message
        ) {
          errorMessage = error.response.data.message;
        } else {
          errorMessage = JSON.stringify(error.response.data);
        }
      }

      toast.error("Falha ao cadastrar o usuario: " + errorMessage);
      console.log("Erro ao cadastrar o usuario: ", errorMessage);
    }
  }

  return (
    <div className="h-screen w-full flex">
      <div className="hidden lg:flex w-1/2 bg-zinc-100 dark:bg-zinc-800 justify-center items-center">
        <Image
          src={logo}
          alt="Logo"
          width={500}
          height={500}
          className="object-contain p-8 transition-all duration-1000 ease-in-out hover:transform hover:-translate-y-2 animate-fade-in"
        />
      </div>

      <div className="hidden lg:block w-[1px] h-screen bg-zinc-200 dark:bg-zinc-700" />

      <div className="w-full lg:w-1/2 flex justify-center items-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div className="flex flex-col justify-center items-center">
            <div className="lg:hidden mb-6">
              <Image src={logo} alt="Logo" width={108.5} height={30} />
            </div>
            <ThemeToggle />
          </div>

          <h1 className="text-4xl font-medium text-zinc-800 dark:text-zinc-100 text-center">
            Cadastro de Doador
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Nome"
                  {...register("Name")}
                />
                {errors.Name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.Name.message}
                  </p>
                )}
              </div>

              <div>
                <Input
                  type="text"
                  placeholder="CPF (000.000.000-00)"
                  {...register("CPF")}
                />
                {errors.CPF && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.CPF.message}
                  </p>
                )}
              </div>

              <div>
                <Input
                  type="email"
                  placeholder="E-mail"
                  {...register("Email")}
                />
                {errors.Email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.Email.message}
                  </p>
                )}
              </div>

              <div>
                <Input
                  type="text"
                  placeholder="Telefone (Apenas números)"
                  {...register("PhoneNumber")}
                />
                {errors.PhoneNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.PhoneNumber.message}
                  </p>
                )}
              </div>

              <div>
                <Input
                  type="password"
                  placeholder="Senha"
                  {...register("Password")}
                />
                {errors.Password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.Password.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-center mt-8 space-x-4">
              <Button
                type="submit"
                className="px-12 h-12 text-base w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded transition-colors"
              >
                Cadastrar
              </Button>
            </div>

            <div className="text-center mt-4">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Já tem uma conta?{" "}
                <Link href="/signin" className="text-blue-500 hover:underline">
                  Faça login
                </Link>
              </p>
            </div>

            <div className="text-center mt-4">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Quero ser um{" "}
                <Link href="/signupRecebedor" className="text-blue-500 hover:underline">
                  Beneficiário
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
