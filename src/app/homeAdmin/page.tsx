'use client';

import Financial from "@/components/Financial/page";
import Sidebar from "@/components/Sidebar/page";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/input";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import Dashboard from "@/components/Dashboard/page";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Home() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 ml-64 p-6 space-y-6">
          <Dashboard />
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