"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search, Settings, Trash2 } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { useToast } from "@/hooks/use-toast"

interface Form {
  id: string
  title: string
  createdAt: string
  responses: number
  lastUpdated: string
}

export default function DashboardPage() {
  const { toast } = useToast()
  const [forms, setForms] = useState<Form[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch forms
    const fetchForms = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/forms")

        if (!response.ok) {
          throw new Error("Failed to fetch forms")
        }

        const data = await response.json()
        setForms(data)
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
  }, [toast])

  const filteredForms = forms.filter((form) => form.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleDeleteForm = async (id: string) => {
    try {
      const response = await fetch(`/api/forms/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete form")
      }

      setForms((prevForms) => prevForms.filter((form) => form.id !== id))
      toast({
        title: "Form deleted",
        description: "The form has been deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete form",
        variant: "destructive",
      })
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold">My Forms</h1>
          <Link href="/dashboard/forms/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Form
            </Button>
          </Link>
        </div>

        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            placeholder="Search forms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
          <Button type="submit" size="icon" variant="ghost">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="space-y-2">
                  <div className="h-6 w-3/4 rounded-md bg-muted"></div>
                  <div className="h-4 w-1/2 rounded-md bg-muted"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 w-full rounded-md bg-muted"></div>
                </CardContent>
                <CardFooter>
                  <div className="h-9 w-full rounded-md bg-muted"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : filteredForms.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredForms.map((form) => (
              <Card key={form.id}>
                <CardHeader>
                  <CardTitle>{form.title}</CardTitle>
                  <CardDescription>Created on {form.createdAt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{form.responses} responses</span>
                    <span>Last updated: {form.lastUpdated}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Link href={`/dashboard/forms/${form.id}`}>
                    <Button variant="outline">View</Button>
                  </Link>
                  <div className="flex space-x-2">
                    <Link href={`/dashboard/forms/${form.id}/edit`}>
                      <Button size="icon" variant="outline">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      size="icon"
                      variant="outline"
                      className="text-destructive"
                      onClick={() => handleDeleteForm(form.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Search className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="mt-6 text-xl font-semibold">No forms found</h2>
            <p className="mb-8 mt-2 text-center text-muted-foreground">
              {searchQuery ? `No forms matching "${searchQuery}"` : "You haven't created any forms yet"}
            </p>
            <Link href="/dashboard/forms/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create your first form
              </Button>
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

