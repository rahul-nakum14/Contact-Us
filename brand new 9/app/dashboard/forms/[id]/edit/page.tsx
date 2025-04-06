"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import DashboardLayout from "@/components/dashboard-layout"
import FormBuilder from "@/components/form-builder"
import FormPreview from "@/components/form-preview"
import FormStyler from "@/components/form-styler"
import type { FormField, FormStyle } from "@/lib/types"
import { Loader2, Save } from "lucide-react"

export default function EditFormPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const { toast } = useToast()
  const [formTitle, setFormTitle] = useState("Loading...")
  const [activeTab, setActiveTab] = useState("build")
  const [fields, setFields] = useState<FormField[]>([])
  const [formStyle, setFormStyle] = useState<FormStyle>({
    backgroundColor: "#ffffff",
    backgroundType: "solid",
    backgroundGradient: "linear-gradient(to right, #8a2be2, #4169e1)",
    borderRadius: "8",
    padding: "24",
    fontFamily: "Inter, sans-serif",
    buttonColor: "#8a2be2",
    buttonTextColor: "#ffffff",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await fetch(`/api/forms/${params.id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch form")
        }

        const data = await response.json()
        setFormTitle(data.title)
        setFields(data.fields)
        setFormStyle(data.style)
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

  const handleSaveForm = async () => {
    if (fields.length === 0) {
      toast({
        title: "Form is empty",
        description: "Please add at least one field to your form",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch(`/api/forms/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formTitle,
          fields,
          style: formStyle,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save form")
      }

      toast({
        title: "Form saved",
        description: "Your form has been updated successfully",
      })

      router.push(`/dashboard/forms/${params.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save form",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Edit Form</h1>
          </div>
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="form-title">Form Title</Label>
            <Input
              id="form-title"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="text-lg font-medium w-[300px]"
            />
          </div>
          <div className="flex space-x-4">
            <Button variant="outline" onClick={() => router.push(`/dashboard/forms/${params.id}`)}>
              Cancel
            </Button>
            <Button onClick={handleSaveForm} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Form
                </>
              )}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="build">Build</TabsTrigger>
            <TabsTrigger value="style">Style</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="build" className="mt-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-1 p-4">
                <h3 className="text-lg font-medium mb-4">Form Fields</h3>
                <FormBuilder fields={fields} setFields={setFields} />
              </Card>
              <Card className="lg:col-span-2 p-4">
                <h3 className="text-lg font-medium mb-4">Form Layout</h3>
                <FormPreview
                  title={formTitle}
                  fields={fields}
                  style={formStyle}
                  onFieldsChange={setFields}
                  isEditing={true}
                />
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="style" className="mt-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-1 p-4">
                <h3 className="text-lg font-medium mb-4">Style Options</h3>
                <FormStyler style={formStyle} setStyle={setFormStyle} />
              </Card>
              <Card className="lg:col-span-2 p-4">
                <h3 className="text-lg font-medium mb-4">Style Preview</h3>
                <FormPreview
                  title={formTitle}
                  fields={fields}
                  style={formStyle}
                  onFieldsChange={setFields}
                  isEditing={false}
                />
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="preview" className="mt-6">
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Form Preview</h3>
              <div className="flex justify-center p-6 bg-gray-50 rounded-lg">
                <div className="w-full max-w-2xl">
                  <FormPreview
                    title={formTitle}
                    fields={fields}
                    style={formStyle}
                    onFieldsChange={setFields}
                    isEditing={false}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

