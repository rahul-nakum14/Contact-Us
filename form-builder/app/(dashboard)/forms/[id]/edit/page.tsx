"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Save, Eye, Share2, Download } from "lucide-react"
import { Input } from "@/components/ui/input"
import { fetchForm, updateForm } from "@/lib/api"
import toast from "react-hot-toast"
import Link from "next/link"
import FullScreenFormBuilder from "@/components/form-builder/full-screen-builder"
import FormPreviewMode from "@/components/form-builder/form-preview-mode"
import ShareFormDialog from "@/components/form-builder/share-form-dialog"
import ExportFormDialog from "@/components/form-builder/export-form-dialog"

export default function EditFormPage() {
    const params = useParams()
    const id = params?.id as string
    const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [formData, setFormData] = useState(null)

  useEffect(() => {
    const loadForm = async () => {
      try {
        const data = await fetchForm(id)
        setFormData(data)
      } catch (error) {
        console.error("Error loading form:", error)
        toast.error("Failed to load form")
        router.push("/forms")
      } finally {
        setIsLoading(false)
      }
    }

    loadForm()
  }, [id, router])

  const handleFormChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleFieldsChange = (fields) => {
    setFormData((prev) => ({
      ...prev,
      fields,
    }))
  }

  const handleStylesChange = (styles) => {
    setFormData((prev) => ({
      ...prev,
      styles,
    }))
  }

  const handleSettingsChange = (settings) => {
    setFormData((prev) => ({
      ...prev,
      settings,
    }))
  }

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a form title")
      return
    }

    if (formData.fields.length === 0) {
      toast.error("Please add at least one field to your form")
      return
    }

    setIsSubmitting(true)
    try {
      await updateForm(id, formData)
      toast.success("Form updated successfully!")
    } catch (error) {
      console.error("Error updating form:", error)
      toast.error("Failed to update form. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
      </div>
    )
  }

  if (previewMode) {
    return <FormPreviewMode formData={formData} onExitPreview={() => setPreviewMode(false)} />
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-2">
          <Link href="/forms">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <Input
              value={formData.title}
              onChange={(e) => handleFormChange("title", e.target.value)}
              className="text-lg font-medium h-9 w-64 border-transparent focus-visible:border-input"
              placeholder="Untitled Form"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setPreviewMode(true)} className="gap-1.5">
            <Eye className="h-4 w-4" /> Preview
          </Button>

          <Button variant="outline" size="sm" onClick={() => setShareDialogOpen(true)} className="gap-1.5">
            <Share2 className="h-4 w-4" /> Share
          </Button>

          <Button variant="outline" size="sm" onClick={() => setExportDialogOpen(true)} className="gap-1.5">
            <Download className="h-4 w-4" /> Export
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            size="sm"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 gap-1.5"
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <FullScreenFormBuilder
          formData={formData}
          onFieldsChange={handleFieldsChange}
          onStylesChange={handleStylesChange}
          onSettingsChange={handleSettingsChange}
        />
      </div>

      {/* Share Dialog */}
      <ShareFormDialog open={shareDialogOpen} onOpenChange={setShareDialogOpen} formData={formData} isNewForm={false} />

      {/* Export Dialog */}
      <ExportFormDialog open={exportDialogOpen} onOpenChange={setExportDialogOpen} formData={formData} />
    </div>
  )
}
