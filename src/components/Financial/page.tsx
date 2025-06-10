// ✅ Financial ajustado: valor em kg para alimentos nas entradas

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
}

interface BackendTransaction {
  type: string;
  category: string;
  amount: number | null;
  quantity: number | null;
  description?: string;
  date: string;
  timeRecurrence?: string;
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
        const response = await fetch("https://localhost:5001/api/transactions/getalltransactions");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

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
            recorrencia: item.timeRecurrence && item.timeRecurrence.trim() !== "" ? item.timeRecurrence : "Não",
            descricao: item.description || "",
          };
        });

        setData(transformedData);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erro desconhecido ao buscar transações.");
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

  if (loading) return <div className="mt-5 w-full flex"><Sidebar /><div className="flex-1 ml-64 p-4">Carregando transações...</div></div>;
  if (error) return <div className="mt-5 w-full flex"><Sidebar /><div className="flex-1 ml-64 p-4">Erro ao buscar dados: {error}</div></div>;

  const entradas = filterAndSort("Entrada");
  const saidas = filterAndSort("Saída");
  const entradasPaginadas = paginar(entradas, pageEntrada);
  const saidasPaginadas = paginar(saidas, pageSaida);
  const totalPagesEntrada = Math.ceil(entradas.length / ITEMS_PER_PAGE);
  const totalPagesSaida = Math.ceil(saidas.length / ITEMS_PER_PAGE);

  return (
    <div className="mt-5 w-full overflow-x-auto flex">
      <Sidebar />
      <div className="flex-1 ml-64 p-4 space-y-10">
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
                  </tr>
                ))
              ) : (
                <tr><td colSpan={4} className="p-3 text-center">Nenhuma entrada encontrada.</td></tr>
              )}
            </tbody>
          </table>
          {entradas.length > ITEMS_PER_PAGE && (
            <div className="flex justify-center mt-3 items-center gap-2">
              <button onClick={() => setPageEntrada(prev => Math.max(prev - 1, 0))} disabled={pageEntrada === 0} className="p-2 bg-green-700 text-white rounded disabled:opacity-50"><ChevronLeft /></button>
              <span>Página {pageEntrada + 1} de {totalPagesEntrada}</span>
              <button onClick={() => setPageEntrada(prev => Math.min(prev + 1, totalPagesEntrada - 1))} disabled={(pageEntrada + 1) >= totalPagesEntrada} className="p-2 bg-green-700 text-white rounded disabled:opacity-50"><ChevronRight /></button>
            </div>
          )}
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
          {saidas.length > ITEMS_PER_PAGE && (
            <div className="flex justify-center mt-3 items-center gap-2">
              <button onClick={() => setPageSaida(prev => Math.max(prev - 1, 0))} disabled={pageSaida === 0} className="p-2 bg-red-700 text-white rounded disabled:opacity-50"><ChevronLeft /></button>
              <span>Página {pageSaida + 1} de {totalPagesSaida}</span>
              <button onClick={() => setPageSaida(prev => Math.min(prev + 1, totalPagesSaida - 1))} disabled={(pageSaida + 1) >= totalPagesSaida} className="p-2 bg-red-700 text-white rounded disabled:opacity-50"><ChevronRight /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
