"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useEffect, useState, useMemo } from "react"

const chartConfig = {
  views: {
    label: "Total Doado",
  },
  recivedDonation: {
    label: "Doações recebidas",
    color: "hsl(var(--chart-1))",
  },
  donationMade: {
    label: "Doações enviadas",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export default function Dashboard() {
  const [data, setData] = useState<DonationEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const[activeChart, setActiveChart] = 
  useState<keyof typeof chartConfig>("recivedDonation")
    type DonationEntry = {
        day: string
        totalAmount: number
    }
  useEffect(() => {
    const fetchData = async () => {
        try {
            const res = await fetch("https://localhost:5001/api/Donation/reciveddonation")
            if (!res.ok) throw new Error ("Erro ao buscar dados")
            const json = await res.json()
            setData(json)
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message:"Erro desconhecido"
            setError(message)
        } finally {
            setLoading(false)
        }
    }
    fetchData()   
  }, [])
  const total = useMemo(() => {
    return {
      recivedDonation: data.reduce((acc, curr) => acc + curr.totalAmount, 0),
      donationMade: data.reduce((acc, curr) => acc + curr.totalAmount, 0),
    }
  }, [data])

  if (loading) return <p>Carregando dados...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Dashboard de receitas</CardTitle>
          <CardDescription>
            Este gráfico mostra o total de receitas ganhas e enviadas
          </CardDescription>
        </div>
        <div className="flex">
          {["recivedDonation", "donationMade"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("pt-BR", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <Tooltip
            labelFormatter={(label) =>
                new Date(label).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                })
            }
            formatter={(value: number) => {
                return [`R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`]
              }}
            />


            <Bar dataKey="totalAmount" fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
