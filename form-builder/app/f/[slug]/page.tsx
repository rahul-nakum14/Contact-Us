"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchPublicForm, submitFormResponse } from "@/lib/api"
import toast from "react-hot-toast"
import { Layers } from "lucide-react"
import Link from "next/link"
import { use } from "react"

export default function PublicFormPage({ params }) {
    const unwrappedParams = use(params) // Unwrap the params Promise
    const { slug } = unwrappedParams
  const [form, setForm] = useState(null)
  const [formData, setFormData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const loadForm = async () => {
      try {
        const data = await fetchPublicForm(slug)
        setForm(data)

        // Initialize form data with default values
        const initialData = {}
        data.fields.forEach((field) => {
          if (field.data?.defaultValue !== undefined) {
            initialData[field.id] = field.data.defaultValue
          }
        })
        setFormData(initialData)
      } catch (error) {
        console.error("Error loading form:", error)
        toast.error("Failed to load form")
      } finally {
        setIsLoading(false)
      }
    }

    loadForm()
  }, [slug])

  const handleInputChange = (fieldId, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate required fields
    const missingFields = form.fields
      .filter((field) => field.required && !formData[field.id])
      .map((field) => field.label)

    if (missingFields.length > 0) {
      toast.error(`Please fill in the following required fields: ${missingFields.join(", ")}`)
      return
    }

    setIsSubmitting(true)
    try {
      await submitFormResponse(form._id, formData)
      setSubmitted(true)
      toast.success("Form submitted successfully!")

      // Handle redirect if configured
      if (form.settings.redirectUrl) {
        window.location.href = form.settings.redirectUrl
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("Failed to submit form. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderField = (field) => {
    switch (field.type) {
      case "text":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              placeholder={field.data?.placeholder || ""}
              value={formData[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
            />
            {field.data?.helpText && <p className="text-xs text-gray-500">{field.data.helpText}</p>}
          </div>
        )

      case "email":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type="email"
              placeholder={field.data?.placeholder || ""}
              value={formData[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
            />
            {field.data?.helpText && <p className="text-xs text-gray-500">{field.data.helpText}</p>}
          </div>
        )

      case "textarea":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={field.id}
              placeholder={field.data?.placeholder || ""}
              rows={field.data?.rows || 3}
              value={formData[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
            />
            {field.data?.helpText && <p className="text-xs text-gray-500">{field.data.helpText}</p>}
          </div>
        )

      case "select":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select value={formData[field.id] || ""} onValueChange={(value) => handleInputChange(field.id, value)}>
              <SelectTrigger id={field.id}>
                <SelectValue placeholder={field.data?.placeholder || "Select an option"} />
              </SelectTrigger>
              <SelectContent>
                {field.data?.options?.map((option, index) => (
                  <SelectItem key={index} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {field.data?.helpText && <p className="text-xs text-gray-500">{field.data.helpText}</p>}
          </div>
        )

      case "checkbox":
        return (
          <div key={field.id} className="space-y-3">
            <div>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
              {field.data?.helpText && <p className="text-xs text-gray-500">{field.data.helpText}</p>}
            </div>
            {field.data?.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.id}-${index}`}
                  checked={(formData[field.id] || []).includes(option)}
                  onCheckedChange={(checked) => {
                    const currentValues = formData[field.id] || []
                    const newValues = checked
                      ? [...currentValues, option]
                      : currentValues.filter((value) => value !== option)
                    handleInputChange(field.id, newValues)
                  }}
                />
                <Label htmlFor={`${field.id}-${index}`} className="text-sm font-normal">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        )

      case "radio":
        return (
          <div key={field.id} className="space-y-3">
            <div>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
              {field.data?.helpText && <p className="text-xs text-gray-500">{field.data.helpText}</p>}
            </div>
            <RadioGroup value={formData[field.id] || ""} onValueChange={(value) => handleInputChange(field.id, value)}>
              {field.data?.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${field.id}-${index}`} />
                  <Label htmlFor={`${field.id}-${index}`} className="text-sm font-normal">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )

      case "number":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type="number"
              placeholder={field.data?.placeholder || ""}
              min={field.data?.min}
              max={field.data?.max}
              value={formData[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value ? Number(e.target.value) : "")}
            />
            {field.data?.helpText && <p className="text-xs text-gray-500">{field.data.helpText}</p>}
          </div>
        )

      case "date":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type="date"
              value={formData[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
            />
            {field.data?.helpText && <p className="text-xs text-gray-500">{field.data.helpText}</p>}
          </div>
        )

      case "phone":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type="tel"
              placeholder={field.data?.placeholder || ""}
              value={formData[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
            />
            {field.data?.helpText && <p className="text-xs text-gray-500">{field.data.helpText}</p>}
          </div>
        )

      case "file":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type="file"
              accept={field.data?.accept}
              onChange={(e) => {
                // For file inputs, we'd typically handle this differently in a real app
                // This is a simplified version
                handleInputChange(field.id, e.target.files[0]?.name || "")
              }}
            />
            {field.data?.helpText && <p className="text-xs text-gray-500">{field.data.helpText}</p>}
          </div>
        )

      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Form Not Found</h1>
          <p className="text-gray-600 mb-4">The form you're looking for doesn't exist or has been removed.</p>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Check if form is expired
  const isExpired = form.settings.expirationDate && new Date() > new Date(form.settings.expirationDate)

  return (
    <div className="min-h-screen py-12 px-4" style={form.styles.pageStyle}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <Layers className="h-6 w-6 text-purple-600" />
            <span className="text-xl font-bold">FormCraft</span>
          </Link>
        </div>

        <div style={form.styles.formStyle} className="rounded-lg">
          {submitted ? (
            <div className="text-center py-12">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
              <p className="text-gray-600 mb-6">{form.settings.successMessage}</p>
              <Button onClick={() => setSubmitted(false)}>Submit Another Response</Button>
            </div>
          ) : isExpired ? (
            <div className="text-center py-12">
              <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">Form Expired</h2>
              <p className="text-gray-600">This form is no longer accepting responses.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <h1 className="text-2xl font-bold">{form.title}</h1>
                {form.description && <p className="text-gray-600 mt-2">{form.description}</p>}
              </div>

              <div className="space-y-6">
                {form.fields.map(renderField)}

                {form.settings.collectEmailAddresses && (
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Your Email Address
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email || ""}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                    <p className="text-xs text-gray-500">We'll use this to contact you about your submission.</p>
                  </div>
                )}

                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      backgroundColor: form.styles.buttonStyle.backgroundColor,
                      color: form.styles.buttonStyle.textColor,
                      borderRadius: form.styles.buttonStyle.borderRadius,
                    }}
                    className="w-full"
                  >
                    {isSubmitting ? "Submitting..." : form.settings.submitButtonText || "Submit"}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>

        <div className="text-center mt-8 text-sm text-gray-500">
          <p>
            Powered by{" "}
            <Link href="/" className="text-purple-600 hover:underline">
              FormCraft
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
