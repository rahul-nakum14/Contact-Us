"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import FormBuilder from "@/components/form-builder/builder"
import StyleEditor from "@/components/form-builder/style-editor"
import SettingsPanel from "@/components/form-builder/settings-panel"
import FormPreview from "@/components/form-builder/form-preview"
import { fetchForm, updateForm } from "@/lib/api"
import toast from "react-hot-toast"
import Link from "next/link"

export default function EditFormPage() {
  const params = useParams()
    const id = params?.id as string
    const router = useRouter()
  const [activeTab, setActiveTab] = useState("builder")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
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
            <h1 className="text-2xl font-bold tracking-tight">Edit Form</h1>
            <p className="text-muted-foreground">Update your form design and settings</p>
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          <Save className="mr-2 h-4 w-4" />
          {isSubmitting ? "Saving..." : "Save changes"}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Form Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleFormChange("title", e.target.value)}
                    className="text-lg font-medium"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleFormChange("description", e.target.value)}
                    placeholder="Enter a description for your form"
                    className="resize-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="builder">Form Builder</TabsTrigger>
              <TabsTrigger value="style">Style</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="builder" className="mt-4">
              <FormBuilder fields={formData.fields} onFieldsChange={handleFieldsChange} />
            </TabsContent>
            <TabsContent value="style" className="mt-4">
              <StyleEditor styles={formData.styles} onStylesChange={handleStylesChange} />
            </TabsContent>
            <TabsContent value="settings" className="mt-4">
              <SettingsPanel settings={formData.settings} onSettingsChange={handleSettingsChange} />
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <div className="sticky top-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Preview</h2>
              <Link href={`/f/${formData.slug}`} target="_blank">
                <Button variant="outline" size="sm">
                  View live form
                </Button>
              </Link>
            </div>
            <div className="rounded-lg overflow-hidden border border-gray-200">
              <FormPreview formData={formData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
