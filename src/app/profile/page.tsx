'use client';

import { Button } from "@/components/button";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";
import logo from "@/assets/logo.png";
export default function EditProfile() {
  const [profilePic, setProfilePic] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    async function fetchGitHubProfile() {
      try {
        const response = await fetch("https://api.github.com/users/franpazello96");
        const data = await response.json();
        setProfilePic(data.avatar_url);
      } catch (error) {
        console.error(error);
        alert("Erro ao buscar dados do GitHub.");
      }
    }

    fetchGitHubProfile();
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded-xl shadow-lg">

<div className="flex flex-col justify-center items-center">
   
        <ThemeToggle />
      </div>
      
      <h1 className="text-2xl font-bold mb-4">Editar Perfil</h1>

      <div className="mb-6">
        {profilePic ? (
          <img
            src={profilePic}
            alt="Foto de perfil"
            className="w-24 h-24 rounded-full mx-auto"
          />
        ) : (
          <p>Carregando imagem...</p>
        )}
      </div>

      <label className="block mb-2">Nome</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        placeholder="Digite seu nome"
      />

      <label className="block mb-2">Senha</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        placeholder="Digite sua senha"
      />

      <label className="block mb-2">Telefone</label>
      <input
        type="text"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        placeholder="Digite seu telefone"
      />

    <Button type="submit">Editar</Button>


    </div>
  );
}
