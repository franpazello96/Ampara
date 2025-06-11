import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

interface TokenPayload {
  sub: string;
  cpf?: string;
  cnpj?: string;
  role: string;
  exp: number;
}

export function useAuth(requiredRole?: string) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<TokenPayload | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const toastId = "auth-toast";

    if (!token) {
      setIsAuthenticated(false); // <- isso agora é importante
      if (!toast.isActive(toastId)) {
        toast.warn("Você precisa estar logado para acessar esta página.", { toastId });
      }
      router.push("/signin");
      return;
    }

    try {
      const decoded = jwtDecode<TokenPayload>(token);
      const currentTime = Date.now();

      if (decoded.exp * 1000 < currentTime) {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        if (!toast.isActive(toastId)) {
          toast.warn("Sessão expirada. Faça login novamente.", { toastId });
        }
        router.push("/signin");
        return;
      }

      if (requiredRole && decoded.role !== requiredRole) {
        setIsAuthenticated(false);
        if (!toast.isActive(toastId)) {
          toast.warn("Permissão insuficiente.", { toastId });
        }
        router.push("/signin");
        return;
      }

      setUser(decoded);
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      if (!toast.isActive(toastId)) {
        toast.error("Token inválido. Faça login novamente.", { toastId });
      }
      router.push("/signin");
    }
  }, [requiredRole, router]);

  return { isAuthenticated, user };
}
