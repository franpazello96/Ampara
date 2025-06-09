'use client';

import { Button } from "@/components/button";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";
import logo from "@/assets/logo.png";
import Sidebar from "@/components/Sidebar/page";

export default function EditProfile() {
  const [profilePic, setProfilePic] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/donator/profile", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error("Erro ao buscar perfil.");

        const data = await response.json();
        setName(data.name);
        setEmail(data.email);
        setPhoneNumber(data.phoneNumber);
        if (data.profilePic) {
          setProfilePic(data.profilePic);
        } else {
          fetchGitHubProfile();
        }
      } catch (error) {
        console.error(error);
        alert("Erro ao carregar perfil.");
      }
    }

    fetchProfile();
  }, []);

  async function fetchGitHubProfile() {
    try {
      const response = await fetch("https://api.github.com/users/octocat");
      const data = await response.json();
      setProfilePic(data.avatar_url);
    } catch (error) {
      console.error(error);
      alert("Erro ao buscar dados do GitHub.");
    }
  }

  async function handleUpdateProfile() {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/donator/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          phoneNumber,
          password,
          email
        })
      });
      console.log("Dados enviados:", { name, phoneNumber, password, email });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Erro ao atualizar perfil.");
      }

      alert("Perfil atualizado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao atualizar perfil:", error);
      alert(error.message || "Erro na requisição.");
    }
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 max-w-xl mx-auto mt-10 p-6 border rounded-xl shadow-lg">
        <div className="flex flex-col justify-center items-center">
          <ThemeToggle />
        </div>

        <h1 className="text-2xl font-bold mb-4">Editar Perfil</h1>

        <div className="mb-6">
          <img src={profilePic} alt="Foto de perfil" className="w-24 h-24 rounded-full mx-auto" />
        </div>

        <label className="block mb-2">Nome</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          placeholder="Digite seu nome"
        />

        <label className="block mb-2">E-mail</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          placeholder="Digite seu e-mail"
        />

        <label className="block mb-2">Senha</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          placeholder="Confirme sua senha atual"
        />

        <label className="block mb-2">Telefone</label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          placeholder="Digite seu telefone"
        />

        <Button type="button" onClick={handleUpdateProfile}>Salvar</Button>
      </div>
    </div>
  );
}
