"use client"

import { useState, useEffect, } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download, BarChart2, FileText } from "lucide-react"
import { fetchForm, fetchFormResponses, exportFormResponses } from "@/lib/api"
import toast from "react-hot-toast"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ResponsesTable from "@/components/responses/responses-table"
import ResponsesChart from "@/components/responses/responses-chart"

interface FormResponsesPageProps {
  params: { id: string }
}

export default function FormResponsesPage() {
    const params = useParams()
    const id = params?.id as string
    const router = useRouter()
  const [form, setForm] = useState<any>(null)
  const [responses, setResponses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("responses")
  const [exportFormat, setExportFormat] = useState("json")
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [formData, responsesData] = await Promise.all([
          fetchForm(id),
          fetchFormResponses(id)
        ])
        setForm(formData)
        setResponses(responsesData)
      } catch (error) {
        console.error("Error loading data:", error)
        toast.error("Failed to load form responses")
        router.push("/forms")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [id, router])

  const handleExport = async () => {
    if (!form) return
    
    setIsExporting(true)
    try {
      const data = await exportFormResponses(id, exportFormat)
      const fileName = `${form.title.toLowerCase().replace(/\s+/g, "-")}-responses.${exportFormat}`
      const blob = new Blob(
        [exportFormat === "json" ? JSON.stringify(data, null, 2) : data],
        { type: exportFormat === "json" ? "application/json" : "text/csv" }
      )

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      a.remove()

      toast.success(`Responses exported as ${exportFormat.toUpperCase()}`)
    } catch (error) {
      console.error("Error exporting responses:", error)
      toast.error("Failed to export responses")
    } finally {
      setIsExporting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>Form not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link href="/forms">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{form.title}</h1>
            <p className="text-muted-foreground">Form Responses</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={exportFormat} onValueChange={setExportFormat}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="json">JSON</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={handleExport} 
            disabled={isExporting || responses.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? "Exporting..." : "Export"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Total Responses</p>
                <p className="text-3xl font-bold">{responses.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Response</p>
                <p className="font-medium">
                  {responses.length > 0 ? formatDate(responses[0].createdAt) : "No responses yet"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Form Created</p>
                <p className="font-medium">{formatDate(form.createdAt)}</p>
              </div>
              <div className="pt-2">
                <Link href={`/forms/${id}/edit`}>
                  <Button variant="outline" size="sm" className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Edit Form
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          {responses.length > 0 ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="responses">
                  <FileText className="h-4 w-4 mr-2" />
                  Responses
                </TabsTrigger>
                <TabsTrigger value="analytics">
                  <BarChart2 className="h-4 w-4 mr-2" />
                  Analytics
                </TabsTrigger>
              </TabsList>
              <TabsContent value="responses" className="mt-4">
                <ResponsesTable responses={responses} fields={form.fields} />
              </TabsContent>
              <TabsContent value="analytics" className="mt-4">
                <ResponsesChart responses={responses} fields={form.fields} />
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-1">No responses yet</p>
                <p className="text-gray-500 mb-6 text-center">Share your form to start collecting responses</p>
                <div className="flex gap-4">
                  <Link href={`/forms/${id}/edit`}>
                    <Button variant="outline">
                      <FileText className="mr-2 h-4 w-4" />
                      Edit Form
                    </Button>
                  </Link>
                  <Link href={`/f/${form.slug}`} target="_blank">
                    <Button>View Form</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}