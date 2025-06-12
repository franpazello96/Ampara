"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { useEffect, useState, useMemo } from "react"
import { ThemeToggle } from "@/components/ThemeToggle"

const chartConfig = {
  recivedDonation: {
    label: "Doações recebidas",
    color: "#22c55e",
  },
  donationMade: {
    label: "Doações enviadas",
    color: "#ef4444",
  },
  balance: {
    label: "Em saldo",
    color: "#3b82f6",
  },
} satisfies ChartConfig

type Entry = {
  day: string
  receita?: number
  despesa?: number
  saldo?: number
}

export default function Dashboard() {
  const [data, setData] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doneeCnpj = localStorage.getItem("cnpj")
        if (!doneeCnpj) {
          setError("CNPJ não encontrado")
          return
        }

        const [resReceita, resDespesa] = await Promise.all([
          fetch(`https://localhost:5001/api/dashboard/reciveddonation?doneeCnpj=${encodeURIComponent(doneeCnpj)}`),
          fetch(`https://localhost:5001/api/dashboard/expenses?doneeCnpj=${encodeURIComponent(doneeCnpj)}`),
        ])

        if (!resReceita.ok || !resDespesa.ok) throw new Error("Erro ao buscar dados")

        const receitas = await resReceita.json()
        const despesas = await resDespesa.json()

        const mapa: Record<string, Entry> = {}

        receitas.forEach((item: any) => {
          const day = item.day.split("T")[0]
          if (!mapa[day]) mapa[day] = { day }
          mapa[day].receita = item.totalAmount
        })

        despesas.forEach((item: any) => {
          const day = item.day.split("T")[0]
          if (!mapa[day]) mapa[day] = { day }
          mapa[day].despesa = item.totalAmount
        })

        const combinados = Object.values(mapa).map((entry) => ({
          ...entry,
          saldo: (entry.receita || 0) - (entry.despesa || 0),
        }))

        setData(combinados)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredData = useMemo(() => {
    if (!startDate && !endDate) return data

    return data.filter((entry) => {
      const entryDate = new Date(entry.day)
      const from = startDate ? new Date(startDate) : null
      const to = endDate ? new Date(endDate) : null
      return (!from || entryDate >= from) && (!to || entryDate <= to)
    })
  }, [data, startDate, endDate])

  const total = useMemo(() => {
    return {
      recivedDonation: filteredData.reduce((acc, curr) => acc + (curr.receita || 0), 0),
      donationMade: filteredData.reduce((acc, curr) => acc + (curr.despesa || 0), 0),
      balance: filteredData.reduce((acc, curr) => acc + (curr.saldo || 0), 0),
    }
  }, [filteredData])

  if (loading) return <p>Carregando dados...</p>
  if (error) return <p>Erro: {error}</p>

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Dashboard de receitas</CardTitle>
          <CardDescription>Este gráfico mostra o total de entradas e saídas financeiras</CardDescription>
        </div>
        <div className="flex items-center gap-2 pr-4"><ThemeToggle /></div>
        <div className="flex gap-2 px-6 py-5">
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border rounded px-2 py-1" />
          <span className="text-muted-foreground">até</span>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border rounded px-2 py-1" />
        </div>
        <div className="flex">
          {["recivedDonation", "donationMade"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <div key={chart} className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
                <span className="text-xs text-muted-foreground">{chartConfig[chart].label}</span>
                <span className={`text-lg font-bold leading-none sm:text-3xl ${chart === 'recivedDonation' ? 'text-green-500' : 'text-red-500'}`}>
                  {total[chart].toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
            )
          })}
          <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
            <span className="text-xs text-muted-foreground">{chartConfig.balance.label}</span>
            <span className="text-lg font-bold leading-none sm:text-3xl text-blue-500">
              {total.balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full transition-all duration-300">
          <BarChart data={filteredData.filter(d => d.receita || d.despesa)} margin={{ left: 12, right: 12 }} barGap={8}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} tickFormatter={(value) => {
              const date = new Date(value)
              return date.toLocaleDateString("pt-BR", { month: "short", day: "numeric" })
            }} />
            <Tooltip labelFormatter={(label) => new Date(label).toLocaleDateString("pt-BR", {
              day: "2-digit", month: "long", year: "numeric"
            })} formatter={(value: number) => [`R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`]} />
            <Legend />
            <Bar dataKey="receita" name="Receita" fill={chartConfig.recivedDonation.color} isAnimationActive animationDuration={500} />
            <Bar dataKey="despesa" name="Despesa" fill={chartConfig.donationMade.color} isAnimationActive animationDuration={500} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
