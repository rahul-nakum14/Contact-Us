"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, FileText } from "lucide-react"
import { fetchForms, deleteForm, cloneForm } from "@/lib/api"
import FormCard from "@/components/dashboard/form-card"
import toast from "react-hot-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function FormsPage() {
  const [forms, setForms] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [formToDelete, setFormToDelete] = useState(null)

  const loadForms = async () => {
    setIsLoading(true)
    try {
      const data = await fetchForms()
      setForms(data)
    } catch (error) {
      console.error("Error loading forms:", error)
      toast.error("Failed to load forms")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadForms()
  }, [])

  const handleDeleteForm = async () => {
    if (!formToDelete) return

    try {
      await deleteForm(formToDelete)
      toast.success("Form deleted successfully")
      setForms(forms.filter((form) => form._id !== formToDelete))
    } catch (error) {
      console.error("Error deleting form:", error)
      toast.error("Failed to delete form")
    } finally {
      setFormToDelete(null)
    }
  }

  const handleCloneForm = async (formId) => {
    try {
      const newForm = await cloneForm(formId)
      toast.success("Form cloned successfully")
      setForms([newForm, ...forms])
    } catch (error) {
      console.error("Error cloning form:", error)
      toast.error("Failed to clone form")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Forms</h1>
        <Link href="/forms/new">
          <Button className="mt-4 sm:mt-0">
            <Plus className="mr-2 h-4 w-4" />
            Create new form
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
        </div>
      ) : forms.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => (
            <FormCard key={form._id} form={form} onDelete={() => setFormToDelete(form._id)} onClone={handleCloneForm} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-300 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-1">No forms yet</p>
            <p className="text-gray-500 mb-6 text-center">Create your first form to start collecting responses</p>
            <Link href="/forms/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create new form
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={!!formToDelete} onOpenChange={(open) => !open && setFormToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the form and all its responses.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteForm} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
