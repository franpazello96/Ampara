'use client';

import Sidebar from "@/components/Sidebar/page";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import Dashboard from "@/components/Dashboard/page";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Home() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 ml-64 p-6 space-y-6">
          <Dashboard />
      </div>
    </div>
  );
}