"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { FormField, FormStyle } from "@/lib/store"
import { ArrowLeft } from "lucide-react"

interface FormData {
  formId: string
  formTitle: string
  formDescription: string
  fields: FormField[]
  style: FormStyle
}

export default function FormPage() {
  const params = useParams()
  const router = useRouter()
  const formId = params.formId as string

  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<FormData | null>(null)
  const [formValues, setFormValues] = useState<Record<string, any>>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // In a real app, this would fetch from your API
    const loadForm = () => {
      try {
        setLoading(true)
        setError(null)

        // Simulate API delay
        setTimeout(() => {
          try {
            const storedData = localStorage.getItem("form-builder-storage")
            if (storedData) {
              const parsedData = JSON.parse(storedData)
              const state = parsedData.state

              if (state && state.formId === formId) {
                setFormData({
                  formId: state.formId,
                  formTitle: state.formTitle,
                  formDescription: state.formDescription,
                  fields: state.fields,
                  style: state.style,
                })
              } else {
                // Form not found
                setError("Form not found. It may have been deleted or the link is incorrect.")
              }
            } else {
              setError("No forms found. The form may have been deleted.")
            }
          } catch (err) {
            console.error("Error parsing form data:", err)
            setError("Error loading form. Please try again later.")
          } finally {
            setLoading(false)
          }
        }, 800)
      } catch (err) {
        console.error("Error loading form:", err)
        setError("Error loading form. Please try again later.")
        setLoading(false)
      }
    }

    loadForm()
  }, [formId])

  const handleInputChange = (id: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // In a real app, you would send this data to your backend
      console.log("Form submitted:", formValues)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSubmitted(true)
    } catch (err) {
      console.error("Error submitting form:", err)
      setError("Error submitting form. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleBackToBuilder = () => {
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
          <p className="mb-6 text-gray-600">{error}</p>
          <Button onClick={handleBackToBuilder}>Back to Form Builder</Button>
        </div>
      </div>
    )
  }

  if (!formData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Form Not Found</h1>
          <p className="text-muted-foreground mb-6">The form you are looking for does not exist or has been removed.</p>
          <Button onClick={handleBackToBuilder}>Back to Form Builder</Button>
        </div>
      </div>
    )
  }

  // Generate CSS for form background
  const formBackgroundStyle =
    formData.style.formBackgroundGradient && formData.style.formGradientFrom && formData.style.formGradientTo
      ? {
          background: `linear-gradient(to bottom right, ${formData.style.formGradientFrom}, ${formData.style.formGradientTo})`,
        }
      : {
          backgroundColor: formData.style.formBackgroundColor,
        }

  // Generate CSS for page background
  const pageBackgroundStyle = formData.style.pageBackgroundImage
    ? {
        backgroundImage: `url(${formData.style.pageBackgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: formData.style.pageBackgroundColor,
      }
    : {
        backgroundColor: formData.style.pageBackgroundColor,
      }

  // Generate CSS for button
  const buttonStyle = {
    backgroundColor: formData.style.buttonColor,
    color: formData.style.buttonTextColor,
    border: "none",
  }

  // Generate CSS for inputs
  const inputStyle = {
    backgroundColor: formData.style.inputBackgroundColor,
    color: formData.style.inputTextColor,
    borderColor: formData.style.inputBorderColor,
  }

  // Generate CSS for labels
  const labelStyle = {
    color: formData.style.labelColor,
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={pageBackgroundStyle}>
        <div className="max-w-md w-full rounded-lg shadow-lg p-8" style={formBackgroundStyle}>
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2" style={labelStyle}>
              Thank You!
            </h1>
            <p className="text-muted-foreground mb-6" style={labelStyle}>
              Your form has been submitted successfully.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button onClick={() => setSubmitted(false)} style={buttonStyle}>
                Submit Another Response
              </Button>
              <Button variant="outline" onClick={handleBackToBuilder}>
                Back to Form Builder
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={pageBackgroundStyle}>
      <div className="max-w-md w-full rounded-lg shadow-lg p-6 md:p-8" style={formBackgroundStyle}>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="sm" onClick={handleBackToBuilder} className="flex items-center gap-1 -ml-2">
              <ArrowLeft size={16} />
              Back
            </Button>
          </div>
          <h1 className="text-2xl font-bold mb-2" style={labelStyle}>
            {formData.formTitle}
          </h1>
          {formData.formDescription && (
            <p className="text-muted-foreground" style={labelStyle}>
              {formData.formDescription}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {formData.fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id} style={labelStyle}>
                {field.label}
                {field.required && " *"}
              </Label>

              {field.type === "text" && (
                <Input
                  id={field.id}
                  placeholder={field.placeholder}
                  value={formValues[field.id] || field.defaultValue || ""}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  required={field.required}
                  style={inputStyle}
                />
              )}

              {field.type === "email" && (
                <Input
                  id={field.id}
                  type="email"
                  placeholder={field.placeholder}
                  value={formValues[field.id] || field.defaultValue || ""}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  required={field.required}
                  style={inputStyle}
                />
              )}

              {field.type === "phone" && (
                <Input
                  id={field.id}
                  type="tel"
                  placeholder={field.placeholder}
                  value={formValues[field.id] || field.defaultValue || ""}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  required={field.required}
                  style={inputStyle}
                />
              )}

              {field.type === "textarea" && (
                <Textarea
                  id={field.id}
                  placeholder={field.placeholder}
                  value={formValues[field.id] || field.defaultValue || ""}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  required={field.required}
                  style={inputStyle}
                />
              )}

              {field.type === "select" && (
                <Select
                  value={formValues[field.id] || ""}
                  onValueChange={(value) => handleInputChange(field.id, value)}
                  required={field.required}
                >
                  <SelectTrigger style={inputStyle}>
                    <SelectValue placeholder={field.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option, i) => (
                      <SelectItem key={i} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {field.type === "checkbox" && (
                <div className="space-y-2">
                  {field.options?.map((option, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${field.id}-${i}`}
                        checked={formValues[`${field.id}-${i}`] || false}
                        onCheckedChange={(checked) => handleInputChange(`${field.id}-${i}`, checked)}
                      />
                      <label htmlFor={`${field.id}-${i}`} style={labelStyle}>
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              )}

              {field.type === "radio" && (
                <div className="space-y-2">
                  {field.options?.map((option, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={`${field.id}-${i}`}
                        name={field.id}
                        value={option}
                        checked={formValues[field.id] === option}
                        onChange={() => handleInputChange(field.id, option)}
                        required={field.required && i === 0}
                        className="h-4 w-4"
                      />
                      <label htmlFor={`${field.id}-${i}`} style={labelStyle}>
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {formData.fields.length > 0 && (
            <Button type="submit" className="mt-6 w-full" style={buttonStyle} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          )}

          {formData.fields.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              <p>This form has no fields. Please go back to the form builder to add fields.</p>
              <Button onClick={handleBackToBuilder} className="mt-4">
                Back to Form Builder
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

