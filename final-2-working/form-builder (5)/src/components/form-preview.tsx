"use client"

import type React from "react"

import { useFormBuilderStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"

export function FormPreview() {
  const { formTitle, formDescription, fields, style } = useFormBuilderStore()
  const [formData, setFormData] = useState<Record<string, any>>({})

  const handleInputChange = (id: string, value: any) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // In a real app, you would send this data to your backend
    alert("Form submitted successfully!")
    setFormData({})
  }

  // Generate CSS for form background
  const formBackgroundStyle =
    style.formBackgroundGradient && style.formGradientFrom && style.formGradientTo
      ? {
          background: `linear-gradient(to bottom right, ${style.formGradientFrom}, ${style.formGradientTo})`,
        }
      : {
          backgroundColor: style.formBackgroundColor,
        }

  // Generate CSS for page background
  const pageBackgroundStyle = style.pageBackgroundImage
    ? {
        backgroundImage: `url(${style.pageBackgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: style.pageBackgroundColor,
      }
    : {
        backgroundColor: style.pageBackgroundColor,
      }

  // Generate CSS for button
  const buttonStyle = {
    backgroundColor: style.buttonColor,
    color: style.buttonTextColor,
    border: "none",
  }

  // Generate CSS for inputs
  const inputStyle = {
    backgroundColor: style.inputBackgroundColor,
    color: style.inputTextColor,
    borderColor: style.inputBorderColor,
  }

  // Generate CSS for labels
  const labelStyle = {
    color: style.labelColor,
  }

  return (
    <div className="min-h-[600px] rounded-lg overflow-hidden" style={pageBackgroundStyle}>
      <div className="max-w-xl mx-auto p-6 md:p-8">
        <div className="rounded-lg shadow-lg p-6 md:p-8" style={formBackgroundStyle}>
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2" style={labelStyle}>
              {formTitle}
            </h2>
            {formDescription && (
              <p className="text-muted-foreground" style={labelStyle}>
                {formDescription}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id} style={labelStyle}>
                  {field.label}
                  {field.required && " *"}
                </Label>

                {field.type === "text" && (
                  <Input
                    id={field.id}
                    placeholder={field.placeholder}
                    value={formData[field.id] || field.defaultValue || ""}
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
                    value={formData[field.id] || field.defaultValue || ""}
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
                    value={formData[field.id] || field.defaultValue || ""}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    required={field.required}
                    style={inputStyle}
                  />
                )}

                {field.type === "textarea" && (
                  <Textarea
                    id={field.id}
                    placeholder={field.placeholder}
                    value={formData[field.id] || field.defaultValue || ""}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    required={field.required}
                    style={inputStyle}
                  />
                )}

                {field.type === "select" && (
                  <Select
                    value={formData[field.id] || ""}
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
                          checked={formData[`${field.id}-${i}`] || false}
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
                          checked={formData[field.id] === option}
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

            {fields.length > 0 && (
              <Button type="submit" className="mt-6" style={buttonStyle}>
                Submit
              </Button>
            )}

            {fields.length === 0 && (
              <div className="py-8 text-center text-muted-foreground">
                <p>Add some fields to your form to see the preview</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

