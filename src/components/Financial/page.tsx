export default function Financial() {
  return (
    <div className="mt-5 w-full overflow-x-auto ">
      <table className="w-full border-collapse rounded-lg shadow-md">
        <tbody>
          {[
            { tipo: "Entrada", valor: "R$ 1.000,00", categoria: "Alimentos", data: "13/02/2025" },
            { tipo: "Saída", valor: "R$ 1.000,00", categoria: "Alimentos", data: "13/02/2025" },
            { tipo: "Entrada", valor: "R$ 1.000,00", categoria: "Alimentos", data: "13/02/2025" },
            { tipo: "Entrada", valor: "R$ 1.000,00", categoria: "Alimentos", data: "13/02/2025" },
          ].map((item, index) => (
            <tr key={index} className="border-b border-gray-300 hover:bg-gray-800 dark:hover:bg-gray-100 dark:hover:text-black hover:text-white">
              <td className="p-3">{item.tipo}</td>
              <td className="p-3">{item.valor}</td>
              <td className="p-3">{item.categoria}</td>
              <td className="p-3">{item.data}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
