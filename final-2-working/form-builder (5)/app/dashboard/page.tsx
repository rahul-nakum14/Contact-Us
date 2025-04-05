"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Copy, ExternalLink, Clock } from "lucide-react"
import { format } from "date-fns"

interface FormData {
  id: string
  userId: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
  expiresAt: string | null
  submissionCount?: number
}

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const [forms, setForms] = useState<FormData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [loading, isAuthenticated, router])

  useEffect(() => {
    const fetchForms = () => {
      try {
        // In a real app, this would be an API call
        const storedForms = localStorage.getItem("form-data")
        if (!storedForms) {
          setForms([])
          return
        }

        const allForms = JSON.parse(storedForms)

        // Filter forms by user ID
        const userForms = allForms.filter((form: FormData) => form.userId === user?.id)

        // Get submission counts
        const submissions = JSON.parse(localStorage.getItem("form-submissions") || "[]")
        const formsWithCounts = userForms.map((form: FormData) => ({
          ...form,
          submissionCount: submissions.filter((s: any) => s.formId === form.id).length,
        }))

        setForms(formsWithCounts)
      } catch (error) {
        console.error("Error fetching forms:", error)
        toast({
          title: "Error",
          description: "Failed to load your forms",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchForms()
    }
  }, [user, toast])

  const handleCreateForm = () => {
    router.push("/builder")
  }

  const handleEditForm = (formId: string) => {
    router.push(`/builder/${formId}`)
  }

  const handleDeleteForm = (formId: string) => {
    try {
      // In a real app, this would be an API call
      const storedForms = localStorage.getItem("form-data")
      if (!storedForms) return

      const allForms = JSON.parse(storedForms)
      const updatedForms = allForms.filter((form: FormData) => form.id !== formId)

      localStorage.setItem("form-data", JSON.stringify(updatedForms))

      // Update state
      setForms(forms.filter((form) => form.id !== formId))

      toast({
        title: "Form deleted",
        description: "Your form has been deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting form:", error)
      toast({
        title: "Error",
        description: "Failed to delete form",
        variant: "destructive",
      })
    }
  }

  const handleCopyLink = (formId: string) => {
    const link = `${window.location.origin}/forms/${formId}`
    navigator.clipboard.writeText(link)

    toast({
      title: "Link copied",
      description: "Form link copied to clipboard",
    })
  }

  const handleViewForm = (formId: string) => {
    window.open(`/forms/${formId}`, "_blank")
  }

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Forms</h1>
          <p className="text-muted-foreground">Manage your contact forms</p>
        </div>
        <Button onClick={handleCreateForm} className="flex items-center gap-2">
          <Plus size={16} />
          Create New Form
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : forms.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground mb-4">You haven't created any forms yet</p>
            <Button onClick={handleCreateForm} className="flex items-center gap-2">
              <Plus size={16} />
              Create Your First Form
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => (
            <Card key={form.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="truncate">{form.title}</CardTitle>
                <CardDescription className="truncate">{form.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span>{format(new Date(form.createdAt), "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Submissions:</span>
                    <span>{form.submissionCount || 0}</span>
                  </div>
                  {form.expiresAt && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Clock size={14} />
                        Expires:
                      </span>
                      <span>{format(new Date(form.expiresAt), "MMM d, yyyy")}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditForm(form.id)}
                  className="flex items-center gap-1"
                >
                  <Edit size={14} />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyLink(form.id)}
                  className="flex items-center gap-1"
                >
                  <Copy size={14} />
                  Copy Link
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewForm(form.id)}
                  className="flex items-center gap-1"
                >
                  <ExternalLink size={14} />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteForm(form.id)}
                  className="flex items-center gap-1 text-destructive hover:text-destructive"
                >
                  <Trash2 size={14} />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

