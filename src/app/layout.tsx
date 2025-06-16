import type { Metadata } from "next";
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';
import { Toaster } from "../components/Toaster";
import { ThemeToggle } from "../components/ThemeToggle";
import { ThemeProvider } from "../components/ThemeProvider";

export const metadata: Metadata = {
  title: "Ampara",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-200 min-h-screen w-full">
        <ThemeProvider>
          <ThemeToggle />
          <main className="w-full min-h-screen">
            {children}
            <Toaster />
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
