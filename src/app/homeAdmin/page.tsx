'use client';

import Financial from "@/components/Financial/page";
import Sidebar from "@/components/Sidebar/page";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/input";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const donationData = {
  labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio"],
  datasets: [
    {
      label: "Doações (R$)",
      data: [5000, 7000, 8000, 6000, 9000],
      backgroundColor: "#4CAF50",
    },
  ],
};

const expenseData = {
  labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio"],
  datasets: [
    {
      label: "Gastos (R$)",
      data: [3000, 4000, 5000, 3500, 4500],
      backgroundColor: "#F44336",
    },
  ],
};

export default function Home() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 ml-64 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-green-950 text-white">
            <CardHeader>
              <CardTitle>Total de Doações</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">R$ 50.000,00</p>
            </CardContent>
          </Card>
          <Card className="bg-red-950 text-white">
            <CardHeader >
              <CardTitle>Total de Gastos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">R$ 20.000,00</p>
            </CardContent>
          </Card>
          <Card className="bg-yellow-500 text-white">
            <CardHeader>
              <CardTitle>Doadores Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">120</p>
            </CardContent>
          </Card>
          <Card className=" bg-violet-600 text-white">
            <CardHeader>
              <CardTitle>Beneficiários Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">80</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Gráfico de Doações</CardTitle>
            </CardHeader>
            <CardContent>
              <Bar data={donationData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Gráfico de Gastos</CardTitle>
            </CardHeader>
            <CardContent>
              <Bar data={expenseData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Relatório de Doações</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>Janeiro</AccordionTrigger>
                  <AccordionContent>
                    <p>Relatório detalhado de doações de janeiro.</p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Fevereiro</AccordionTrigger>
                  <AccordionContent>
                    <p>Relatório detalhado de doações de fevereiro.</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
            <div className="flex justify-end p-4"></div>
              <Button variant="outline">Gerar Relatório</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}