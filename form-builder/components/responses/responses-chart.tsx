"use client"

import { useState } from "react"
import { Bar, Pie } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

export default function ResponsesChart({ responses, fields }) {
  const [selectedField, setSelectedField] = useState(
    fields.find((f) => f.type === "select" || f.type === "radio" || f.type === "checkbox")?.id || "",
  )
  const [chartType, setChartType] = useState("bar")

  // Get fields that can be visualized (select, radio, checkbox)
  const visualizableFields = fields.filter(
    (field) => field.type === "select" || field.type === "radio" || field.type === "checkbox",
  )

  // If no visualizable fields, show message
  if (visualizableFields.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-gray-50 p-6">
        <div className="text-center">
          <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No data to visualize</h3>
          <p className="text-gray-500 max-w-md">
            Add select, radio, or checkbox fields to your form to see response analytics.
          </p>
        </div>
      </div>
    )
  }

  // If no responses, show message
  if (responses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-gray-50 p-6">
        <div className="text-center">
          <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No responses yet</h3>
          <p className="text-gray-500 max-w-md">Share your form to collect responses and see analytics here.</p>
        </div>
      </div>
    )
  }

  // Get the selected field
  const field = fields.find((f) => f.id === selectedField)
  if (!field) return null

  // Process data for the chart
  const processData = () => {
    const options = field.data?.options || []
    const counts = {}

    // Initialize counts
    options.forEach((option) => {
      counts[option] = 0
    })

    // Count responses
    responses.forEach((response) => {
      const value = response.data[field.id]
      if (!value) return

      if (Array.isArray(value)) {
        // For checkbox fields
        value.forEach((v) => {
          if (counts[v] !== undefined) {
            counts[v]++
          }
        })
      } else {
        // For select and radio fields
        if (counts[value] !== undefined) {
          counts[value]++
        }
      }
    })

    return {
      labels: Object.keys(counts),
      datasets: [
        {
          label: field.label,
          data: Object.values(counts),
          backgroundColor: [
            "rgba(124, 58, 237, 0.7)",
            "rgba(37, 99, 235, 0.7)",
            "rgba(5, 150, 105, 0.7)",
            "rgba(220, 38, 38, 0.7)",
            "rgba(245, 158, 11, 0.7)",
            "rgba(139, 92, 246, 0.7)",
            "rgba(96, 165, 250, 0.7)",
            "rgba(52, 211, 153, 0.7)",
            "rgba(248, 113, 113, 0.7)",
            "rgba(251, 191, 36, 0.7)",
          ],
          borderColor: [
            "rgba(124, 58, 237, 1)",
            "rgba(37, 99, 235, 1)",
            "rgba(5, 150, 105, 1)",
            "rgba(220, 38, 38, 1)",
            "rgba(245, 158, 11, 1)",
            "rgba(139, 92, 246, 1)",
            "rgba(96, 165, 250, 1)",
            "rgba(52, 211, 153, 1)",
            "rgba(248, 113, 113, 1)",
            "rgba(251, 191, 36, 1)",
          ],
          borderWidth: 1,
        },
      ],
    }
  }

  const chartData = processData()

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        display: chartType === "pie",
      },
      title: {
        display: true,
        text: field.label,
        font: {
          size: 16,
        },
      },
    },
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Select value={selectedField} onValueChange={setSelectedField}>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Select a field" />
            </SelectTrigger>
            <SelectContent>
              {visualizableFields.map((field) => (
                <SelectItem key={field.id} value={field.id}>
                  {field.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setChartType("bar")}
            className={`px-3 py-1 rounded-md text-sm ${
              chartType === "bar" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"
            }`}
          >
            Bar
          </button>
          <button
            onClick={() => setChartType("pie")}
            className={`px-3 py-1 rounded-md text-sm ${
              chartType === "pie" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"
            }`}
          >
            Pie
          </button>
        </div>
      </div>

      <div className="h-[400px] border rounded-lg p-4">
        {chartType === "bar" ? (
          <Bar data={chartData} options={chartOptions} />
        ) : (
          <Pie data={chartData} options={chartOptions} />
        )}
      </div>
    </div>
  )
}
