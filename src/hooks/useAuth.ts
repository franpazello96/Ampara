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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<TokenPayload | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const toastId = "auth-toast";

    if (!token) {
      if (!toast.isActive(toastId)) {
        toast.warn("Você precisa estar logado para acessar esta página.", { toastId });
      }
      router.push("/signin");
      return;
    }

    try {
      const decoded: TokenPayload = jwtDecode(token);
      const isExpired = decoded.exp * 1000 < Date.now();

      if (isExpired) {
        localStorage.clear();
        if (!toast.isActive(toastId)) {
          toast.warn("Sessão expirada. Faça login novamente.", { toastId });
        }
        router.push("/signin");
        return;
      }

      if (requiredRole && decoded.role !== requiredRole) {
        if (!toast.isActive(toastId)) {
          toast.warn("Permissão insuficiente.", { toastId });
        }
        router.push("/signin");
        return;
      }

      setUser(decoded);
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.clear();
      if (!toast.isActive(toastId)) {
        toast.error("Token inválido. Faça login novamente.", { toastId });
      }
      router.push("/signin");
    }
  }, [requiredRole, router]);

  return { isAuthenticated, user };
}
