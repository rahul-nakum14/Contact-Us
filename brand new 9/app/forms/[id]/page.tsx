"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Calendar, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Form, FormField } from "@/lib/types"

export default function PublicFormPage() {
  const params = useParams<{ id: string }>()
  const { toast } = useToast()
  const [form, setForm] = useState<Form | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [formValues, setFormValues] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)

  useEffect(() => {
    const fetchForm = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/public/forms/${params.id}`)
        // const data = await response.json()

        // Mock data for demonstration
        const mockForm: Form = {
          id: params.id,
          userId: "user123",
          title: "Contact Form",
          fields: [
            {
              id: "field-1",
              type: "name",
              label: "Full Name",
              placeholder: "Enter your name",
              required: true,
            },
            {
              id: "field-2",
              type: "email",
              label: "Email Address",
              placeholder: "Enter your email",
              required: true,
            },
            {
              id: "field-3",
              type: "textarea",
              label: "Message",
              placeholder: "Enter your message",
              required: true,
            },
          ],
          style: {
            backgroundColor: "#ffffff",
            backgroundType: "solid",
            backgroundGradient: "",
            borderRadius: 8,
            padding: 24,
            fontFamily: "Inter, sans-serif",
            buttonColor: "#8a2be2",
            buttonTextColor: "#ffffff",
            buttonText: "Submit",
            description: "Please fill out this form to contact us.",
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          isPublished: true,
        }

        setForm(mockForm)
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

  const handleInputChange = (fieldId: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call
      // await fetch(`/api/forms/${params.id}/responses`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     data: formValues,
      //   }),
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setFormSubmitted(true)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit form",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderField = (field: FormField) => {
    const isRequired = field.required ? { required: true } : {}

    switch (field.type) {
      case "text":
      case "email":
      case "phone":
      case "name":
      case "url":
      case "number":
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type={
                field.type === "email"
                  ? "email"
                  : field.type === "phone"
                    ? "tel"
                    : field.type === "url"
                      ? "url"
                      : field.type === "number"
                        ? "number"
                        : "text"
              }
              placeholder={field.placeholder}
              value={formValues[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              {...isRequired}
            />
            {field.description && <p className="text-xs text-muted-foreground">{field.description}</p>}
          </div>
        )
      case "textarea":
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Textarea
              id={field.id}
              placeholder={field.placeholder}
              value={formValues[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              {...isRequired}
            />
            {field.description && <p className="text-xs text-muted-foreground">{field.description}</p>}
          </div>
        )
      case "select":
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Select value={formValues[field.id] || ""} onValueChange={(value) => handleInputChange(field.id, value)}>
              <SelectTrigger id={field.id}>
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option, index) => (
                  <SelectItem key={`${field.id}-option-${index}`} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {field.description && <p className="text-xs text-muted-foreground">{field.description}</p>}
          </div>
        )
      case "checkbox":
        return (
          <div className="space-y-2">
            <Label>{field.label}</Label>
            <div className="space-y-2">
              {field.options?.map((option, index) => (
                <div key={`${field.id}-option-${index}`} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${field.id}-${index}`}
                    checked={formValues[`${field.id}-${index}`] || false}
                    onCheckedChange={(checked) => handleInputChange(`${field.id}-${index}`, checked)}
                  />
                  <Label htmlFor={`${field.id}-${index}`} className="font-normal">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
            {field.description && <p className="text-xs text-muted-foreground">{field.description}</p>}
          </div>
        )
      case "radio":
        return (
          <div className="space-y-2">
            <Label>{field.label}</Label>
            <RadioGroup
              value={formValues[field.id] || ""}
              onValueChange={(value) => handleInputChange(field.id, value)}
            >
              {field.options?.map((option, index) => (
                <div key={`${field.id}-option-${index}`} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${field.id}-${index}`} />
                  <Label htmlFor={`${field.id}-${index}`} className="font-normal">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {field.description && <p className="text-xs text-muted-foreground">{field.description}</p>}
          </div>
        )
      case "date":
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <div className="relative">
              <Input
                id={field.id}
                type="date"
                placeholder={field.placeholder}
                value={formValues[field.id] || ""}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                {...isRequired}
              />
              <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
            {field.description && <p className="text-xs text-muted-foreground">{field.description}</p>}
          </div>
        )
      case "file":
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor={field.id}
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">{field.fileTypes || "SVG, PNG, JPG or GIF"}</p>
                </div>
                <input
                  id={field.id}
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleInputChange(field.id, e.target.files[0])
                    }
                  }}
                  {...isRequired}
                />
              </label>
            </div>
            {field.description && <p className="text-xs text-muted-foreground">{field.description}</p>}
          </div>
        )
      case "paragraph":
        return (
          <div className="space-y-2">
            <div className="prose prose-sm max-w-none">
              <h3>{field.label}</h3>
              <div dangerouslySetInnerHTML={{ __html: field.content || "" }} />
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const getBackgroundStyle = () => {
    if (!form) return {}

    if (form.style.backgroundType === "gradient") {
      return { background: form.style.backgroundGradient }
    } else if (form.style.backgroundType === "image" && form.style.backgroundImage) {
      return {
        backgroundImage: `url(${form.style.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    }
    return { backgroundColor: form.style.backgroundColor }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-muted-foreground">Loading form...</p>
        </div>
      </div>
    )
  }

  if (!form || !form.isPublished) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-2">Form Not Found</h2>
          <p className="text-muted-foreground mb-6">This form doesn't exist or is no longer available.</p>
          <Button onClick={() => (window.location.href = "/")}>Return to Home</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4" style={getBackgroundStyle()}>
      <div
        className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden"
        style={{
          borderRadius: `${form.style.borderRadius}px`,
          fontFamily: form.style.fontFamily,
        }}
      >
        <div
          className="p-6 md:p-8"
          style={{
            padding: `${form.style.padding}px`,
          }}
        >
          {formSubmitted ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary h-8 w-8"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
              <p className="text-muted-foreground max-w-md mb-6">
                Your form has been submitted successfully. We'll get back to you soon.
              </p>
              <Button
                onClick={() => setFormSubmitted(false)}
                style={{
                  backgroundColor: form.style.buttonColor,
                  color: form.style.buttonTextColor,
                }}
              >
                Submit Another Response
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold" style={{ color: form.style.titleColor || "inherit" }}>
                  {form.title}
                </h2>
                {form.style.description && <p className="text-muted-foreground">{form.style.description}</p>}
              </div>

              <div className="space-y-4">
                {form.fields.map((field) => (
                  <div key={field.id}>{renderField(field)}</div>
                ))}

                <Button
                  type="submit"
                  className="w-full md:w-auto"
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: form.style.buttonColor,
                    color: form.style.buttonTextColor,
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    form.style.buttonText || "Submit"
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
        <div className="bg-muted/30 p-3 text-center text-xs text-muted-foreground">
          Powered by{" "}
          <a href="/" className="font-medium underline">
            FormCraft
          </a>
        </div>
      </div>
    </div>
  )
}

