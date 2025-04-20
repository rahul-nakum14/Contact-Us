"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Save, Eye, Share2, Download } from "lucide-react"
import { Input } from "@/components/ui/input"
import { createForm } from "@/lib/api"
import toast from "react-hot-toast"
import Link from "next/link"
import FullScreenFormBuilder from "@/components/form-builder/full-screen-builder"
import FormPreviewMode from "@/components/form-builder/form-preview-mode"
import ShareFormDialog from "@/components/form-builder/share-form-dialog"
import ExportFormDialog from "@/components/form-builder/export-form-dialog"

export default function NewFormPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "Untitled Form",
    description: "",
    fields: [],
    styles: {
      formStyle: {
        backgroundColor: "#ffffff",
        borderRadius: "0.5rem",
        padding: "2rem",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        maxWidth: "800px",
        margin: "0 auto",
      },
      pageStyle: {
        backgroundColor: "#f3f4f6",
        backgroundImage: "",
      },
      buttonStyle: {
        backgroundColor: "#7c3aed",
        textColor: "#ffffff",
        borderRadius: "0.375rem",
        style: "solid",
        size: "default",
        animation: "none",
      },
    },
    settings: {
      submitButtonText: "Submit",
      successMessage: "Thank you for your submission!",
      collectEmailAddresses: false,
      limitOneResponsePerUser: false,
      isPublic: true,
      expirationDate: null,
      redirectUrl: "",
      embedCode: "",
    },
  })

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

    setIsSubmitting(true)
    try {
      const newForm = await createForm(formData)
      toast.success("Form created successfully!")
      // Fix: Ensure we're redirecting to the correct path with the form ID
      router.push(`/forms/${newForm._id}/edit`)
    } catch (error) {
      console.error("Error creating form:", error)
      toast.error("Failed to create form. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
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
            {isSubmitting ? "Saving..." : "Save form"}
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
      <ShareFormDialog open={shareDialogOpen} onOpenChange={setShareDialogOpen} formData={formData} isNewForm={true} />

      {/* Export Dialog */}
      <ExportFormDialog open={exportDialogOpen} onOpenChange={setExportDialogOpen} formData={formData} />
    </div>
  )
}
