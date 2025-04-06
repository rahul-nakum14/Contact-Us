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
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Form, FormField } from "@/lib/types"

export default function EmbedFormPage() {
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

      // Notify the parent window that the form was submitted
      if (window.parent) {
        window.parent.postMessage({ type: "formSubmitted", formId: params.id }, "*")
      }
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
      default:
        return null
    }
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
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      {formSubmitted ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
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
              className="text-primary h-6 w-6"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Thank You!</h2>
          <p className="text-muted-foreground max-w-md mb-6">Your form has been submitted successfully.</p>
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
            <h2 className="text-xl font-bold" style={{ color: form.style.titleColor || "inherit" }}>
              {form.title}
            </h2>
            {form.style.description && <p className="text-sm text-muted-foreground">{form.style.description}</p>}
          </div>

          <div className="space-y-4">
            {form.fields.map((field) => (
              <div key={field.id}>{renderField(field)}</div>
            ))}

            <Button
              type="submit"
              className="w-full"
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
  )
}

