"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Download, FileText, Inbox } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Form {
  id: string
  title: string
  createdAt: string
  responses: number
}

interface FormResponse {
  id: string
  formId: string
  data: Record<string, any>
  createdAt: string
  ipAddress?: string
  userAgent?: string
}

export default function ResponsesPage() {
  const { toast } = useToast()
  const [forms, setForms] = useState<Form[]>([])
  const [selectedForm, setSelectedForm] = useState<string | null>(null)
  const [responses, setResponses] = useState<FormResponse[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch forms
    const fetchForms = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch("/api/forms")
        // const data = await response.json()

        // Mock data for demonstration
        const mockForms: Form[] = [
          {
            id: "1",
            title: "Contact Form",
            createdAt: "2023-05-15",
            responses: 24,
          },
          {
            id: "2",
            title: "Event Registration",
            createdAt: "2023-06-10",
            responses: 156,
          },
          {
            id: "3",
            title: "Customer Feedback",
            createdAt: "2023-07-05",
            responses: 78,
          },
        ]

        setForms(mockForms)

        // Select the first form by default if available
        if (mockForms.length > 0 && !selectedForm) {
          setSelectedForm(mockForms[0].id)
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load forms",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchForms()
  }, [toast, selectedForm])

  useEffect(() => {
    // Fetch responses for the selected form
    const fetchResponses = async () => {
      if (!selectedForm) return

      setIsLoading(true)

      try {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/forms/${selectedForm}/responses`)
        // const data = await response.json()

        // Mock data for demonstration
        const mockResponses: FormResponse[] = [
          {
            id: "resp1",
            formId: selectedForm,
            data: {
              name: "John Doe",
              email: "john@example.com",
              message: "This is a test message",
            },
            createdAt: "2023-07-20T14:30:00Z",
            ipAddress: "192.168.1.1",
          },
          {
            id: "resp2",
            formId: selectedForm,
            data: {
              name: "Jane Smith",
              email: "jane@example.com",
              message: "Another test message",
            },
            createdAt: "2023-07-21T10:15:00Z",
            ipAddress: "192.168.1.2",
          },
          {
            id: "resp3",
            formId: selectedForm,
            data: {
              name: "Bob Johnson",
              email: "bob@example.com",
              message: "Hello there!",
            },
            createdAt: "2023-07-22T09:45:00Z",
            ipAddress: "192.168.1.3",
          },
        ]

        setResponses(mockResponses)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load responses",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchResponses()
  }, [selectedForm, toast])

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

    // Get the selected form title
    const formTitle = forms.find((form) => form.id === selectedForm)?.title || "form-responses"

    // Convert responses to CSV
    const headers = Object.keys(responses[0].data)
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

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold">Form Responses</h1>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={selectedForm || ""} onValueChange={setSelectedForm}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select a form" />
              </SelectTrigger>
              <SelectContent>
                {forms.map((form) => (
                  <SelectItem key={form.id} value={form.id}>
                    {form.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={exportResponses} disabled={responses.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        <div className="flex w-full max-w-sm items-center space-x-2">
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

        {isLoading ? (
          <Card>
            <CardHeader>
              <CardTitle>Loading responses...</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-muted"></div>
                <div className="mt-4 h-4 w-36 rounded-md bg-muted"></div>
              </div>
            </CardContent>
          </Card>
        ) : selectedForm ? (
          filteredResponses.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>
                  {forms.find((form) => form.id === selectedForm)?.title} - {filteredResponses.length} Responses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        {Object.keys(filteredResponses[0].data).map((key) => (
                          <TableHead key={key}>{key}</TableHead>
                        ))}
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
                  <Button variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    View Form
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-muted p-3 mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No form selected</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                Select a form from the dropdown to view its responses.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}

