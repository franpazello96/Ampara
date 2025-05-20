'use client';

import { useState } from "react";
import SidebarDoador from "@/components/SidebarDoador/page";

interface DataItem {
  tipo: string;
  valor: string;
  categoria: string;
  data: string;
}

export default function Financial() {
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof DataItem; direction: string } | null>(null);

  const data: DataItem[] = [
    { tipo: "Entrada", valor: "R$ 1.000,00", categoria: "Alimentos", data: "13/02/2025" },
    { tipo: "Saída", valor: "R$ 500,00", categoria: "Educação", data: "15/03/2025" },
    { tipo: "Entrada", valor: "R$ 2.000,00", categoria: "Saúde", data: "20/04/2025" },
    { tipo: "Saída", valor: "R$ 1.200,00", categoria: "Transporte", data: "25/04/2025" },
    { tipo: "Entrada", valor: "R$ 3.000,00", categoria: "Habitação", data: "01/05/2025" },
    { tipo: "Saída", valor: "R$ 800,00", categoria: "Lazer", data: "05/05/2025" },
    { tipo: "Entrada", valor: "R$ 1.500,00", categoria: "Tecnologia", data: "10/05/2025" },
    { tipo: "Saída", valor: "R$ 600,00", categoria: "Roupas", data: "12/05/2025" },
    { tipo: "Entrada", valor: "R$ 2.500,00", categoria: "Investimentos", data: "15/05/2025" },
    { tipo: "Saída", valor: "R$ 1.000,00", categoria: "Viagem", data: "18/05/2025" },
    { tipo: "Entrada", valor: "R$ 4.000,00", categoria: "Projetos", data: "20/05/2025" },
    { tipo: "Saída", valor: "R$ 700,00", categoria: "Aluguel", data: "22/05/2025" },
    { tipo: "Entrada", valor: "R$ 3.200,00", categoria: "Freelance", data: "25/05/2025" },
    { tipo: "Saída", valor: "R$ 900,00", categoria: "Supermercado", data: "28/05/2025" },
    { tipo: "Entrada", valor: "R$ 5.000,00", categoria: "Consultoria", data: "30/05/2025" },
    { tipo: "Saída", valor: "R$ 1.300,00", categoria: "Manutenção", data: "02/06/2025" },
    { tipo: "Entrada", valor: "R$ 2.800,00", categoria: "Eventos", data: "05/06/2025" },
    { tipo: "Saída", valor: "R$ 1.100,00", categoria: "Saúde", data: "08/06/2025" },
    { tipo: "Entrada", valor: "R$ 3.500,00", categoria: "Doações", data: "10/06/2025" },
    { tipo: "Saída", valor: "R$ 1.400,00", categoria: "Educação", data: "12/06/2025" },
    { tipo: "Entrada", valor: "R$ 6.000,00", categoria: "Empreendimentos", data: "15/06/2025" },
    { tipo: "Saída", valor: "R$ 2.000,00", categoria: "Transporte", data: "18/06/2025" },
    { tipo: "Entrada", valor: "R$ 7.000,00", categoria: "Investimentos", data: "20/06/2025" },
    { tipo: "Saída", valor: "R$ 1.800,00", categoria: "Lazer", data: "22/06/2025" },
    { tipo: "Entrada", valor: "R$ 8.000,00", categoria: "Tecnologia", data: "25/06/2025" },
    { tipo: "Saída", valor: "R$ 2.500,00", categoria: "Viagem", data: "28/06/2025" },
    { tipo: "Entrada", valor: "R$ 9.000,00", categoria: "Projetos", data: "30/06/2025" },
    { tipo: "Saída", valor: "R$ 3.000,00", categoria: "Aluguel", data: "02/07/2025" },
    { tipo: "Entrada", valor: "R$ 10.000,00", categoria: "Freelance", data: "05/07/2025" },
    { tipo: "Saída", valor: "R$ 3.500,00", categoria: "Supermercado", data: "08/07/2025" },
    { tipo: "Entrada", valor: "R$ 11.000,00", categoria: "Consultoria", data: "10/07/2025" },
    { tipo: "Saída", valor: "R$ 4.000,00", categoria: "Manutenção", data: "12/07/2025" },
    { tipo: "Entrada", valor: "R$ 12.000,00", categoria: "Eventos", data: "15/07/2025" },
    { tipo: "Saída", valor: "R$ 4.500,00", categoria: "Saúde", data: "18/07/2025" },
    { tipo: "Entrada", valor: "R$ 13.000,00", categoria: "Doações", data: "20/07/2025" },
    { tipo: "Saída", valor: "R$ 5.000,00", categoria: "Educação", data: "22/07/2025" },
    { tipo: "Entrada", valor: "R$ 14.000,00", categoria: "Empreendimentos", data: "25/07/2025" },
    { tipo: "Saída", valor: "R$ 5.500,00", categoria: "Transporte", data: "28/07/2025" },
  ];

  const sortedData = [...data].sort((a, b) => {
    if (sortConfig?.key) {
      const aValue = a[sortConfig.key].toLowerCase();
      const bValue = b[sortConfig.key].toLowerCase();

      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
    }
    return 0;
  });

  const filteredData = sortedData.filter((item) => {
    const itemDate = new Date(item.data.split("/").reverse().join("-"));
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const matchesSearch = item.categoria.toLowerCase().includes(search.toLowerCase());
    const matchesDate =
      (!start || itemDate >= start) && (!end || itemDate <= end);

    return matchesSearch && matchesDate;
  });

  const handleSort = (key: keyof DataItem) => {
    let direction = "ascending";
    if (sortConfig?.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="mt-5 w-full overflow-x-auto flex">
      <SidebarDoador />
      <div className="flex-1 ml-64">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <label className="sr-only" htmlFor="search">Pesquisar por categoria</label>
          <input
            id="search"
            type="text"
            placeholder="Pesquisar por categoria"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border rounded mb-2 md:mb-0 md:mr-2"
          />
          <div className="flex items-center space-x-2">
            <label className="sr-only" htmlFor="start-date">Data inicial</label>
            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 border rounded"
            />
            <span>até</span>
            <label className="sr-only" htmlFor="end-date">Data final</label>
            <input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 border rounded"
            />
          </div>
        </div>
        <table className="w-full border-collapse rounded-lg shadow-md">
          <thead>
            <tr>
              <th className="p-3 cursor-pointer" onClick={() => handleSort("tipo")}>Tipo</th>
              <th className="p-3 cursor-pointer" onClick={() => handleSort("valor")}>Valor</th>
              <th className="p-3 cursor-pointer" onClick={() => handleSort("categoria")}>Categoria</th>
              <th className="p-3 cursor-pointer" onClick={() => handleSort("data")}>Data</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr
                key={index}
                className="border-b border-gray-300 hover:bg-gray-800 dark:hover:bg-gray-100 dark:hover:text-black hover:text-white"
              >
                <td className="p-3">{item.tipo}</td>
                <td className="p-3">{item.valor}</td>
                <td className="p-3">{item.categoria}</td>
                <td className="p-3">{item.data}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
