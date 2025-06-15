import type { Metadata } from "next";
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';
import { Toaster } from "../components/Toaster";

export const metadata: Metadata = {
  title: "Ampara",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-200
        text-zinc-900 min-h-screen flex">
        <main className="w-full mx-auto px-5 py-8">
          {children}
          <Toaster />
        </main>
      </body>
    </html>
  );
}
