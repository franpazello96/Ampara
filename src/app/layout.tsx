import type { Metadata } from "next";
import "./globals.css";

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
      <body className=" bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-200
        text-zinc-900 min-h-screen flex">
        <main className="max-w-[1240px] mx-auto px-5 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
