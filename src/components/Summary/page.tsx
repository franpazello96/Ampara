import { ArrowDownCircle, ArrowUpCircle, CircleDollarSignIcon } from "lucide-react";
import Sidebar from "@/components/Sidebar/page";

export function Summary() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 w-4xl h-28 justify-between items-center flex-1">
        <div className="bg-green-950 p-4 rounded-lg text-white flex-1">
          <header className="flex justify-between items-center">
            <span>Entradas</span>
            <ArrowUpCircle className="text-green-500" size={32} />
          </header>
          <strong className="block mt-2 text-xl">R$ 10.000,00</strong>
        </div>

        <div className="bg-red-950 p-4 rounded-lg text-white flex-1">
          <header className="flex justify-between items-center">
            <span>Saídas</span>
            <ArrowDownCircle className="text-red-500" size={32} />
          </header>
          <strong className="block mt-2 text-xl">R$ 4.000,00</strong>
        </div>

        <div className="bg-blue-950 p-4 rounded-lg text-white flex-1">
          <header className="flex justify-between items-center">
            <span>Total</span>
            <CircleDollarSignIcon className="text-white" size={32} />
          </header>
          <strong className="block mt-2 text-xl">R$ 6.000,00</strong>
        </div>
      </div>
    </div>
  );
}
