"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, Eye, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import FormBuilder from "@/components/form-builder/builder"
import StyleEditor from "@/components/form-builder/style-editor"
import SettingsPanel from "@/components/form-builder/settings-panel"
import FormPreview from "@/components/form-builder/form-preview"
import { createForm } from "@/lib/api"
import toast from "react-hot-toast"
import Link from "next/link"

export default function NewFormPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("builder")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showTips, setShowTips] = useState(true)
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
      },
      pageStyle: {
        backgroundColor: "#f3f4f6",
        backgroundImage: "",
        backgroundGradient: "",
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

    if (formData.fields.length === 0) {
      toast.error("Please add at least one field to your form")
      return
    }

    setIsSubmitting(true)
    try {
      const newForm = await createForm(formData)
      toast.success("Form created successfully!")
      router.push(`/forms/${newForm._id}`)
    } catch (error) {
      console.error("Error creating form:", error)
      toast.error("Failed to create form. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
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
            <h1 className="text-2xl font-bold tracking-tight">Create New Form</h1>
            <p className="text-muted-foreground">Design your form, customize styles, and configure settings</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setActiveTab("preview")} className="hidden md:flex">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save form"}
          </Button>
        </div>
      </div>

      {showTips && (
        <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-100">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="bg-purple-100 rounded-full p-2 mt-1">
                <Sparkles className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-purple-800 mb-1">Tips for creating great forms</h3>
                <ul className="text-sm text-purple-700 space-y-1 list-disc pl-4">
                  <li>Keep your form short and focused on a single goal</li>
                  <li>Use clear and concise labels for your fields</li>
                  <li>Group related fields together</li>
                  <li>Make required fields stand out</li>
                  <li>Test your form before sharing it</li>
                </ul>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowTips(false)} className="text-purple-600">
                Dismiss
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="overflow-hidden border-purple-100">
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

          <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-white rounded-lg shadow-sm border">
            <TabsList className="grid grid-cols-4 p-0 h-12">
              <TabsTrigger
                value="builder"
                className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 rounded-none border-b-2 data-[state=active]:border-purple-600 data-[state=inactive]:border-transparent"
              >
                Builder
              </TabsTrigger>
              <TabsTrigger
                value="style"
                className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 rounded-none border-b-2 data-[state=active]:border-purple-600 data-[state=inactive]:border-transparent"
              >
                Style
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 rounded-none border-b-2 data-[state=active]:border-purple-600 data-[state=inactive]:border-transparent"
              >
                Settings
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 rounded-none border-b-2 data-[state=active]:border-purple-600 data-[state=inactive]:border-transparent md:hidden"
              >
                Preview
              </TabsTrigger>
            </TabsList>
            <TabsContent value="builder" className="m-0 p-4">
              <FormBuilder fields={formData.fields} onFieldsChange={handleFieldsChange} />
            </TabsContent>
            <TabsContent value="style" className="m-0 p-4">
              <StyleEditor styles={formData.styles} onStylesChange={handleStylesChange} />
            </TabsContent>
            <TabsContent value="settings" className="m-0 p-4">
              <SettingsPanel settings={formData.settings} onSettingsChange={handleSettingsChange} />
            </TabsContent>
            <TabsContent value="preview" className="m-0 p-4 md:hidden">
              <Card>
                <CardContent className="p-0">
                  <FormPreview formData={formData} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="hidden md:block">
          <div className="sticky top-6">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <Eye className="h-4 w-4 mr-2 text-purple-600" />
              Live Preview
            </h2>
            <div className="rounded-lg overflow-hidden border border-purple-100 shadow-md">
              <FormPreview formData={formData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
