"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Share, BarChart, Settings, ArrowLeft } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { useToast } from "@/hooks/use-toast"
import FormPreview from "@/components/form-preview"
import type { Form } from "@/lib/types"
import Link from "next/link"

export default function FormDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { toast } = useToast()
  const [form, setForm] = useState<Form | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("preview")

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await fetch(`/api/forms/${params.id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch form")
        }

        const data = await response.json()
        setForm(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load form",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchForm()
  }, [params.id, toast])

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Form Details</h1>
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
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold">{form.title}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`/dashboard/forms/${params.id}/edit`}>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Edit Form
              </Button>
            </Link>
            <Link href={`/dashboard/forms/${params.id}/responses`}>
              <Button variant="outline">
                <BarChart className="mr-2 h-4 w-4" />
                Responses
              </Button>
            </Link>
            <Link href={`/dashboard/forms/${params.id}/share`}>
              <Button>
                <Share className="mr-2 h-4 w-4" />
                Share
              </Button>
            </Link>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Form Preview</CardTitle>
                <CardDescription>This is how your form appears to respondents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center p-6 bg-gray-50 rounded-lg">
                  <div className="w-full max-w-2xl">
                    <FormPreview
                      title={form.title}
                      fields={form.fields}
                      style={form.style}
                      onFieldsChange={() => {}}
                      isEditing={false}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Created: {new Date(form.createdAt).toLocaleDateString()}
                </div>
                <div className="text-sm text-muted-foreground">Status: {form.isPublished ? "Published" : "Draft"}</div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Form Analytics</CardTitle>
                <CardDescription>View statistics and insights about your form</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-1">Total Responses</h3>
                    <p className="text-3xl font-bold">0</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-1">Completion Rate</h3>
                    <p className="text-3xl font-bold">0%</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-1">Avg. Completion Time</h3>
                    <p className="text-3xl font-bold">--</p>
                  </div>
                </div>
                <div className="mt-8 h-64 flex items-center justify-center border rounded-lg">
                  <p className="text-muted-foreground">No data available yet</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

