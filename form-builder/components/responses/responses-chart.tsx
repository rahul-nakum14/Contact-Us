"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

export default function ResponsesChart({ responses, fields }) {
  const [selectedField, setSelectedField] = useState(fields[0]?.id || "")
  const [chartType, setChartType] = useState("bar")

  // Only show fields that can be visualized (select, radio, checkbox, etc.)
  const visualizableFields = fields.filter((field) => ["select", "radio", "checkbox", "number"].includes(field.type))

  const getChartData = () => {
    if (!selectedField || responses.length === 0) return []

    const field = fields.find((f) => f.id === selectedField)
    if (!field) return []

    if (field.type === "number") {
      // For number fields, create a histogram
      const values = responses
        .map((r) => r.data[selectedField])
        .filter((v) => v !== undefined && v !== null)
        .map((v) => Number(v))

      // Group by ranges
      const min = Math.min(...values)
      const max = Math.max(...values)
      const range = max - min
      const bucketSize = range / 5 // 5 buckets

      const buckets = Array(5)
        .fill(0)
        .map((_, i) => ({
          name: `${Math.round(min + i * bucketSize)} - ${Math.round(min + (i + 1) * bucketSize)}`,
          value: 0,
        }))

      values.forEach((v) => {
        const bucketIndex = Math.min(Math.floor((v - min) / bucketSize), 4)
        buckets[bucketIndex].value++
      })

      return buckets
    } else {
      // For select, radio, checkbox fields, count occurrences
      const counts = {}

      responses.forEach((response) => {
        const value = response.data[selectedField]

        if (value === undefined || value === null) return

        if (Array.isArray(value)) {
          // Handle checkbox groups
          value.forEach((v) => {
            counts[v] = (counts[v] || 0) + 1
          })
        } else {
          counts[value] = (counts[value] || 0) + 1
        }
      })

      return Object.entries(counts).map(([name, value]) => ({ name, value }))
    }
  }

  const chartData = getChartData()
  const COLORS = ["#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d", "#a4de6c", "#d0ed57", "#ffc658"]

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle>Response Analytics</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={selectedField} onValueChange={setSelectedField}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select field" />
              </SelectTrigger>
              <SelectContent>
                {visualizableFields.map((field) => (
                  <SelectItem key={field.id} value={field.id}>
                    {field.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Tabs value={chartType} onValueChange={setChartType} className="w-[160px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="bar">Bar</TabsTrigger>
                <TabsTrigger value="pie">Pie</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {visualizableFields.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-center text-gray-500">
            <p>
              No fields available for visualization.
              <br />
              Add select, radio, or checkbox fields to your form.
            </p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-center text-gray-500">
            <p>No data available for the selected field.</p>
          </div>
        ) : (
          <div className="h-[400px] w-full">
            {chartType === "bar" ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
