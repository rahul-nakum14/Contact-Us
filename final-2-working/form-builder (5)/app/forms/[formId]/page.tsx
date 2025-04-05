"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft } from "lucide-react"
import type { FormField, FormStyle } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

interface FormData {
  id: string
  title: string
  description: string
  fields: FormField[]
  style: FormStyle
  expiresAt?: string
}

export default function FormPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData | null>(null)
  const [formValues, setFormValues] = useState<Record<string, any>>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    const formId = params?.formId as string

    const fetchForm = async () => {
      try {
        setLoading(true)
        setError(null)

        // In a real app, fetch from API
        const storedData = localStorage.getItem("form-data")
        if (storedData) {
          const forms = JSON.parse(storedData)
          const form = forms.find((f: FormData) => f.id === formId)

          if (form) {
            // Check if form is expired
            if (form.expiresAt && new Date(form.expiresAt) < new Date()) {
              setExpired(true)
            } else {
              setFormData(form)
            }
          } else {
            setError("Form not found")
          }
        } else {
          setError("No forms found")
        }
      } catch (err) {
        console.error("Error fetching form:", err)
        setError("Failed to load form")
      } finally {
        setLoading(false)
      }
    }

    if (formId) {
      fetchForm()
    }
  }, [params])

  const handleInputChange = (fieldId: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData) return

    setSubmitting(true)

    try {
      // In a real app, submit to API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Store submission
      const submissions = JSON.parse(localStorage.getItem("form-submissions") || "[]")
      submissions.push({
        formId: formData.id,
        data: formValues,
        submittedAt: new Date().toISOString(),
      })
      localStorage.setItem("form-submissions", JSON.stringify(submissions))

      setSubmitted(true)
      toast({
        title: "Form submitted",
        description: "Thank you for your submission!",
      })
    } catch (err) {
      console.error("Error submitting form:", err)
      toast({
        title: "Submission failed",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleBackToBuilder = () => {
    router.push("/builder")
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
        <div className="max-w-md w-full bg-card rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold mb-4 text-destructive">Error</h1>
          <p className="mb-6 text-muted-foreground">{error}</p>
          <Button onClick={handleBackToBuilder}>Back to Form Builder</Button>
        </div>
      </div>
    )
  }

  if (expired) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Form Expired</h1>
          <p className="mb-6 text-muted-foreground">This form is no longer accepting responses.</p>
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

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold mb-2">Thank You!</h1>
          <p className="text-muted-foreground mb-6">Your form has been submitted successfully.</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button onClick={() => setSubmitted(false)}>Submit Another Response</Button>
            <Button variant="outline" onClick={handleBackToBuilder}>
              Back to Form Builder
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-xl mx-auto">
        <Button variant="ghost" size="sm" onClick={handleBackToBuilder} className="mb-4 flex items-center gap-1">
          <ArrowLeft size={16} />
          Back to Builder
        </Button>

        <div className="bg-card rounded-lg shadow-lg p-6 md:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">{formData.title}</h1>
            {formData.description && <p className="text-muted-foreground">{formData.description}</p>}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {formData.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <label className="font-medium">
                  {field.label}
                  {field.required && " *"}
                </label>

                {field.type === "text" && (
                  <Input
                    placeholder={field.placeholder}
                    value={formValues[field.id] || ""}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    required={field.required}
                  />
                )}

                {field.type === "email" && (
                  <Input
                    type="email"
                    placeholder={field.placeholder}
                    value={formValues[field.id] || ""}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    required={field.required}
                  />
                )}

                {field.type === "phone" && (
                  <Input
                    type="tel"
                    placeholder={field.placeholder}
                    value={formValues[field.id] || ""}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    required={field.required}
                  />
                )}

                {field.type === "textarea" && (
                  <Textarea
                    placeholder={field.placeholder}
                    value={formValues[field.id] || ""}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    required={field.required}
                  />
                )}

                {field.type === "select" && field.options && (
                  <Select
                    value={formValues[field.id] || ""}
                    onValueChange={(value) => handleInputChange(field.id, value)}
                    required={field.required}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={field.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options.map((option, i) => (
                        <SelectItem key={i} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {field.type === "checkbox" && field.options && (
                  <div className="space-y-2">
                    {field.options.map((option, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${field.id}-${i}`}
                          checked={formValues[`${field.id}-${i}`] || false}
                          onCheckedChange={(checked) => handleInputChange(`${field.id}-${i}`, checked)}
                        />
                        <label htmlFor={`${field.id}-${i}`}>{option}</label>
                      </div>
                    ))}
                  </div>
                )}

                {field.type === "radio" && field.options && (
                  <div className="space-y-2">
                    {field.options.map((option, i) => (
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
                        <label htmlFor={`${field.id}-${i}`}>{option}</label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {formData.fields.length > 0 ? (
              <Button type="submit" className="w-full mt-6" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit"}
              </Button>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <p>This form has no fields.</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

