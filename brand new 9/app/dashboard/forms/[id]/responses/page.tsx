"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Download, FileText, Inbox, ArrowLeft, BarChart3, PieChart, Calendar } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import type { Form, FormResponse } from "@/lib/types"

export default function FormResponsesPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { toast } = useToast()
  const [form, setForm] = useState<Form | null>(null)
  const [responses, setResponses] = useState<FormResponse[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("responses")

  useEffect(() => {
    const fetchFormAndResponses = async () => {
      try {
        setIsLoading(true)

        // Fetch form details
        const formResponse = await fetch(`/api/forms/${params.id}`)
        if (!formResponse.ok) {
          throw new Error("Failed to fetch form")
        }
        const formData = await formResponse.json()
        setForm(formData)

        // Fetch responses
        const responsesResponse = await fetch(`/api/forms/${params.id}/responses`)
        if (!responsesResponse.ok) {
          throw new Error("Failed to fetch responses")
        }
        const responsesData = await responsesResponse.json()
        setResponses(responsesData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchFormAndResponses()
  }, [params.id, toast])

  const filteredResponses = responses.filter((response) => {
    const searchLower = searchQuery.toLowerCase()
    const responseData = JSON.stringify(response.data).toLowerCase()
    return responseData.includes(searchLower)
  })

  const exportResponses = () => {
    if (responses.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no responses to export",
        variant: "destructive",
      })
      return
    }

    // Get the form title
    const formTitle = form?.title || "form-responses"

    // Convert responses to CSV
    const headers = responses.length > 0 ? Object.keys(responses[0].data) : []
    const csvContent = [
      headers.join(","),
      ...responses.map((response) =>
        headers
          .map((header) => {
            const value = response.data[header]
            // Handle values that might contain commas
            return typeof value === "string" && value.includes(",") ? `"${value}"` : value
          })
          .join(","),
      ),
    ].join("\n")

    // Create a blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `${formTitle.replace(/\s+/g, "-").toLowerCase()}-responses.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Export successful",
      description: "Responses have been exported to CSV",
    })
  }

  // Calculate some analytics
  const totalResponses = responses.length
  const responsesByDate = responses.reduce((acc: Record<string, number>, response) => {
    const date = new Date(response.createdAt).toLocaleDateString()
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {})

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Form Responses</h1>
          </div>
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!form) {
    return (
      <DashboardLayout>
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Form Not Found</h1>
          </div>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground text-center mb-6">
                The form you're looking for doesn't exist or you don't have permission to access it.
              </p>
              <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.push(`/dashboard/forms/${params.id}`)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{form.title} - Responses</h1>
              <p className="text-muted-foreground">View and analyze form submissions</p>
            </div>
          </div>
          <Button onClick={exportResponses} disabled={responses.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="responses">
              <FileText className="mr-2 h-4 w-4" />
              Responses
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="responses" className="mt-6">
            <div className="flex w-full max-w-sm items-center space-x-2 mb-4">
              <Input
                placeholder="Search responses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
              <Button type="submit" size="icon" variant="ghost">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {filteredResponses.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {filteredResponses.length} {filteredResponses.length === 1 ? "Response" : "Responses"}
                  </CardTitle>
                  <CardDescription>
                    Showing {filteredResponses.length} of {responses.length} total responses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          {filteredResponses.length > 0 &&
                            Object.keys(filteredResponses[0].data).map((key) => <TableHead key={key}>{key}</TableHead>)}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredResponses.map((response) => (
                          <TableRow key={response.id}>
                            <TableCell>{new Date(response.createdAt).toLocaleDateString()}</TableCell>
                            {Object.keys(response.data).map((key) => (
                              <TableCell key={key}>
                                {typeof response.data[key] === "string" && response.data[key].length > 50
                                  ? `${response.data[key].substring(0, 50)}...`
                                  : response.data[key]}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="rounded-full bg-muted p-3 mb-4">
                    <Inbox className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No responses yet</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-6">
                    {searchQuery
                      ? `No responses matching "${searchQuery}"`
                      : "This form hasn't received any responses yet. Share your form to start collecting data."}
                  </p>
                  {!searchQuery && (
                    <Button variant="outline" onClick={() => router.push(`/dashboard/forms/${params.id}/share`)}>
                      <FileText className="mr-2 h-4 w-4" />
                      Share Form
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalResponses}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalResponses > 0 ? "100%" : "0%"}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Average Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">--</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Responses Over Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {totalResponses > 0 ? (
                    <div className="h-80">
                      <div className="flex flex-col space-y-2">
                        {Object.entries(responsesByDate).map(([date, count]) => (
                          <div key={date} className="flex items-center">
                            <div className="w-24 text-sm text-muted-foreground">{date}</div>
                            <div className="flex-1">
                              <div
                                className="bg-primary h-8 rounded-sm flex items-center px-2 text-primary-foreground font-medium"
                                style={{ width: `${Math.max((count / totalResponses) * 100, 10)}%` }}
                              >
                                {count}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-80">
                      <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No data available yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="mr-2 h-5 w-5" />
                    Response Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {totalResponses > 0 ? (
                    <div className="h-80">
                      {/* This would be a pie chart in a real implementation */}
                      <div className="flex items-center justify-center h-full">
                        <div className="w-40 h-40 rounded-full bg-primary/20 flex items-center justify-center">
                          <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                            100%
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-80">
                      <PieChart className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No data available yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

