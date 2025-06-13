'use client';

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar/page";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DataItem {
  valor: string;
  quantidade: string;
  categoria: string;
  data: string;
  recorrencia?: string;
  descricao?: string;
  tipo: string;
  doador?: string;
  documento?: string;
}


interface BackendTransaction {
  type: string;
  category: string;
  amount: number | null;
  quantity: number | null;
  description?: string;
  date: string;
  timeRecurrence?: string;
  donatorName?: string;
  donatorCpf?: string;
}

const ITEMS_PER_PAGE = 10;

export default function Financial() {
  const [data, setData] = useState<DataItem[]>([]);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pageEntrada, setPageEntrada] = useState(0);
  const [pageSaida, setPageSaida] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const cnpj = localStorage.getItem("cnpj");
        if (!cnpj) throw new Error("CNPJ não encontrado no localStorage");

        const response = await fetch(`https://localhost:5001/api/transactions/getalltransactions?doneeCnpj=${cnpj}`);
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

        const backendData: BackendTransaction[] = await response.json();

        const transformedData: DataItem[] = backendData.map(item => {
          let formattedDate = "Data Inválida";
          if (item.date) {
            const dateObj = new Date(item.date);
            if (!isNaN(dateObj.getTime())) {
              formattedDate = `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${dateObj.getFullYear()}`;
            }
          }

          const isAlimento = item.category.toLowerCase().includes("alimento");

          const displayQuantidade = item.quantity !== null ? `${item.quantity} ${isAlimento ? 'kg' : 'unid'}` : "";

          let displayValor = "";
          if (isAlimento && item.quantity !== null && item.amount === null) {
            displayValor = `${item.quantity} kg`;
          } else if (item.amount !== null) {
            displayValor = `R$ ${item.amount.toFixed(2).replace('.', ',')}`;
          }

          return {
              tipo: item.type,
              valor: displayValor,
              quantidade: displayQuantidade,
              categoria: item.category,
              data: formattedDate,
              recorrencia: item.timeRecurrence?.trim() || "Não",
              descricao: item.description || "",
              doador: item.donatorName || "",
              documento: item.donatorCpf || ""
            };
        });

        setData(transformedData);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erro desconhecido.");
        console.error("Erro ao buscar transações:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filterAndSort = (tipo: string) => {
    return data
      .filter(item => item.tipo === tipo)
      .filter(item => {
        const fields = [item.categoria, item.valor, item.quantidade, item.recorrencia || '', item.descricao || ''];
        const matchesSearch = fields.some(field => field.toLowerCase().includes(search.toLowerCase()));

        const itemDateParts = item.data.split("/");
        const itemDate = itemDateParts.length === 3 ? new Date(+itemDateParts[2], +itemDateParts[1] - 1, +itemDateParts[0]) : null;
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate + "T23:59:59") : null;

        const matchesDate = itemDate && (!start || itemDate >= start) && (!end || itemDate <= end);

        return matchesSearch && matchesDate;
      })
      .sort((a, b) => {
        const parseDate = (d: string) => {
          const p = d.split("/");
          return new Date(+p[2], +p[1] - 1, +p[0]);
        };
        return parseDate(b.data).getTime() - parseDate(a.data).getTime();
      });
  };

  const paginar = (array: DataItem[], page: number) => array.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  const entradas = filterAndSort("Entrada");
  const saidas = filterAndSort("Saída");
  const entradasPaginadas = paginar(entradas, pageEntrada);
  const saidasPaginadas = paginar(saidas, pageSaida);
  const totalPagesEntrada = Math.ceil(entradas.length / ITEMS_PER_PAGE);
  const totalPagesSaida = Math.ceil(saidas.length / ITEMS_PER_PAGE);

  if (loading) return <div className="mt-5 w-full flex"><Sidebar /><div className="flex-1 ml-64 p-4">Carregando...</div></div>;
  if (error) return <div className="mt-5 w-full flex"><Sidebar /><div className="flex-1 ml-64 p-4">Erro: {error}</div></div>;

  return (
    <div className="mt-5 w-full overflow-x-auto flex">
      <Sidebar />
      <div className="flex-1 ml-64 p-4 space-y-10">
        {/* Filtros */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
          <input type="text" placeholder="Pesquisar..." value={search} onChange={(e) => setSearch(e.target.value)} className="p-2 border rounded w-full md:w-1/3" />
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-auto">
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="p-2 border rounded w-full sm:w-auto" />
            <span className="hidden sm:inline">até</span>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="p-2 border rounded w-full sm:w-auto" />
          </div>
        </div>

        {/* Entradas */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Entradas</h2>
          <table className="w-full border-collapse rounded-lg shadow-md">
            <thead>
              <tr className="bg-green-200 dark:bg-green-800 text-left">
                <th className="p-3">Valor</th>
                <th className="p-3">Categoria</th>
                <th className="p-3">Data</th>
                <th className="p-3">Recorrência</th>
                <th className="p-3">Doador</th>
              </tr>
            </thead>
            <tbody>
              {entradasPaginadas.length > 0 ? (
                entradasPaginadas.map((item, index) => (
                  <tr key={index} className="border-b border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <td className="p-3">{item.valor}</td>
                    <td className="p-3">{item.categoria}</td>
                    <td className="p-3">{item.data}</td>
                    <td className="p-3">{item.recorrencia}</td>
                    <td className="p-3">
                      <div className="flex flex-col">
                        <span className="font-medium">{item.doador || "-"}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{item.documento || "-"}</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="p-3 text-center">Nenhuma entrada encontrada.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Saídas */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Saídas</h2>
          <table className="w-full border-collapse rounded-lg shadow-md">
            <thead>
              <tr className="bg-red-200 dark:bg-red-800 text-left">
                <th className="p-3">Valor</th>
                <th className="p-3">Quantidade</th>
                <th className="p-3">Categoria</th>
                <th className="p-3">Data</th>
                <th className="p-3">Descrição</th>
              </tr>
            </thead>
            <tbody>
              {saidasPaginadas.length > 0 ? (
                saidasPaginadas.map((item, index) => (
                  <tr key={index} className="border-b border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <td className="p-3">{item.valor}</td>
                    <td className="p-3">{item.quantidade}</td>
                    <td className="p-3">{item.categoria}</td>
                    <td className="p-3">{item.data}</td>
                    <td className="p-3">{item.descricao}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="p-3 text-center">Nenhuma saída encontrada.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
