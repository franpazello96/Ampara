'use client';

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar/page";

interface DataItem {
  tipo: string;
  valor: string; 
  categoria: string;
  data: string; 
  recorrencia: string; 
}


interface BackendTransaction {
  type: string;                 
  category: string;             
  foodQuantity: number | null;  
  amount: number | null;        
  date: string | null;          
  timeRecurrence: string | null;
}

export default function Financial() {
  const [data, setData] = useState<DataItem[]>([]);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof DataItem; direction: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Updated API endpoint
        const response = await fetch('https://localhost:5001/api/Donation/getalltransactions');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const backendData: BackendTransaction[] = await response.json();

        const transformedData: DataItem[] = backendData.map(item => {
          let formattedDate = "Data Inválida"; 
          if (item.date) { 
            const dateObj = new Date(item.date); 
            if (!isNaN(dateObj.getTime())) { 
              formattedDate = `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${dateObj.getFullYear()}`;
            } else {
              formattedDate = "Data Inválida"; 
              console.warn('Tentativa de formatar uma data inválida:', item.date);
            }
          }

          let displayValor = "";
          if (item.category === "Alimentos") { 
            if (item.foodQuantity !== null) { 
              displayValor = `${item.foodQuantity} kg`;
            } else if (item.amount !== null) { 
              displayValor = `R$ ${item.amount.toFixed(2).replace('.', ',')}`;
            }
          } else if (item.category === "Dinheiro" && item.amount !== null) { 
            displayValor = `R$ ${item.amount.toFixed(2).replace('.', ',')}`;
          }

          return {
            tipo: item.type || "Tipo Desconhecido",         
            valor: displayValor,
            categoria: item.category || "Categoria Desconhecida", 
            data: formattedDate,
            recorrencia: item.timeRecurrence && item.timeRecurrence.trim() !== "" ? item.timeRecurrence : "Não",
          };
        });

        setData(transformedData);

      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("An unknown error occurred while fetching transactions.");
        }
        console.error("Failed to fetch transactions:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSort = (key: keyof DataItem) => {
    let direction = "ascending";
    if (sortConfig?.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    if (sortConfig?.key) {
      const key = sortConfig.key;
      let aValue: any = a[key];
      let bValue: any = b[key];

      if (key === 'data') {
        const parseDate = (dateStr: string) => {
            const parts = dateStr.split('/');
            return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        };
        aValue = parseDate(a.data).getTime();
        bValue = parseDate(b.data).getTime();
      }

      else if (key === 'valor') {
        const extractNumber = (valStr: string) => parseFloat(valStr.replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;
        aValue = extractNumber(a.valor);
        bValue = extractNumber(b.valor);
      } else {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
    }
    return 0;
  });

// In page.tsx
  const filteredData = sortedData.filter((item) => { 
    let itemDate: Date | null = null; 
    let itemDateIsValid = false;

    if (item.data && item.data !== "Data não disponível") {
      try {
        const parts = item.data.split('/');
        if (parts.length === 3) {
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1; 
          const year = parseInt(parts[2], 10);

          if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
            const tempDate = new Date(year, month, day);

            if (tempDate.getFullYear() === year && tempDate.getMonth() === month && tempDate.getDate() === day && !isNaN(tempDate.getTime())) {
              itemDate = tempDate;
              itemDateIsValid = true;
            }
          }
        }
        if (!itemDateIsValid) {
        }
      } catch (e) {
      }
    }

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const matchesSearch = (item.categoria || '').toLowerCase().includes(search.toLowerCase()) ||
                          (item.tipo || '').toLowerCase().includes(search.toLowerCase()) ||
                          (item.valor || '').toLowerCase().includes(search.toLowerCase()) ||
                          (item.recorrencia || '').toLowerCase().includes(search.toLowerCase());

    let matchesDate = true; 
    if (start || end) { 
      if (itemDateIsValid && itemDate) { 
        matchesDate = (!start || itemDate >= start) &&
                      (!end || itemDate <= new Date(new Date(end).setHours(23, 59, 59, 999)));
      } else { 
        matchesDate = false; 
      }
    }

    return matchesSearch && matchesDate;
  });


  if (loading) {
    return (
      <div className="mt-5 w-full flex">
        <Sidebar />
        <div className="flex-1 ml-64 p-4">Carregando transações...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-5 w-full flex">
        <Sidebar />
        <div className="flex-1 ml-64 p-4">Erro ao buscar dados: {error}</div>
      </div>
    );
  }

  return (
    <div className="mt-5 w-full overflow-x-auto flex">
      <Sidebar />
      <div className="flex-1 ml-64 p-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
          <label className="sr-only" htmlFor="search">Pesquisar</label>
          <input
            id="search"
            type="text"
            placeholder="Pesquisar em todas as colunas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border rounded w-full md:w-1/3"
          />
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-auto">
            <label className="sr-only" htmlFor="start-date">Data inicial</label>
            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 border rounded w-full sm:w-auto"
            />
            <span className="hidden sm:inline">até</span>
            <label className="sr-only" htmlFor="end-date">Data final</label>
            <input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 border rounded w-full sm:w-auto"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700 text-left">
                <th className="p-3 cursor-pointer" onClick={() => handleSort("tipo")}>Tipo</th>
                <th className="p-3 cursor-pointer" onClick={() => handleSort("valor")}>Valor</th>
                <th className="p-3 cursor-pointer" onClick={() => handleSort("categoria")}>Categoria</th>
                <th className="p-3 cursor-pointer" onClick={() => handleSort("data")}>Data</th>
                <th className="p-3 cursor-pointer" onClick={() => handleSort("recorrencia")}>Recorrência</th> {/* New Header */}
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr
                    key={index} 
                    className="border-b border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <td className="p-3">{item.tipo}</td>
                    <td className="p-3">{item.valor}</td>
                    <td className="p-3">{item.categoria}</td>
                    <td className="p-3">{item.data}</td>
                    <td className="p-3">{item.recorrencia}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-3 text-center">
                    Nenhum dado encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}