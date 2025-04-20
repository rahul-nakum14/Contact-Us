"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Smartphone, Tablet, Monitor } from "lucide-react"
import { cn } from "@/lib/utils"

export default function FormPreviewMode({ formData, onExitPreview }) {
  const [devicePreview, setDevicePreview] = useState("desktop") // desktop, tablet, mobile

  // Get device preview width
  const getDeviceWidth = () => {
    switch (devicePreview) {
      case "mobile":
        return "max-w-[375px]"
      case "tablet":
        return "max-w-[768px]"
      default:
        return "max-w-[1200px]"
    }
  }

  // Safely handle styles to avoid the background/backgroundColor conflict
  const getPageStyles = () => {
    const { pageStyle } = formData.styles

    // Create a clean style object
    const styles = {}

    // Only set backgroundColor if backgroundType is not gradient
    if (pageStyle.backgroundType !== "gradient") {
      styles.backgroundColor = pageStyle.backgroundColor
    }

    // Handle background image
    if (pageStyle.backgroundType === "image" && pageStyle.backgroundImage) {
      styles.backgroundImage = `url(${pageStyle.backgroundImage})`
      styles.backgroundSize = "cover"
      styles.backgroundPosition = "center"
    }

    // Handle gradient
    if (pageStyle.backgroundType === "gradient" && pageStyle.backgroundGradient) {
      styles.background = pageStyle.backgroundGradient
    }

    return styles
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onExitPreview}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-medium">{formData.title} - Preview</h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-md overflow-hidden">
            <Button
              variant={devicePreview === "mobile" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-none h-8 px-2"
              onClick={() => setDevicePreview("mobile")}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
            <Button
              variant={devicePreview === "tablet" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-none h-8 px-2"
              onClick={() => setDevicePreview("tablet")}
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button
              variant={devicePreview === "desktop" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-none h-8 px-2"
              onClick={() => setDevicePreview("desktop")}
            >
              <Monitor className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto flex justify-center p-8" style={getPageStyles()}>
        <div className={cn("w-full transition-all duration-300", getDeviceWidth())}>
          <div
            className="bg-white rounded-lg shadow-md"
            style={{
              borderRadius: formData.styles.formStyle.borderRadius,
              padding: formData.styles.formStyle.padding,
              boxShadow: formData.styles.formStyle.boxShadow,
              backgroundColor: formData.styles.formStyle.backgroundColor,
            }}
          >
            {formData.title && <h2 className="text-xl font-bold mb-2">{formData.title}</h2>}
            {formData.description && <p className="text-gray-600 mb-6">{formData.description}</p>}

            <div className="space-y-6">
              {formData.fields.map((field) => renderField(field))}

              {formData.fields.length > 0 && (
                <div className="mt-6">
                  <button
                    style={{
                      backgroundColor: formData.styles.buttonStyle.backgroundColor,
                      color: formData.styles.buttonStyle.textColor,
                      borderRadius: formData.styles.buttonStyle.borderRadius,
                    }}
                    className="px-4 py-2 font-medium"
                    onClick={(e) => e.preventDefault()}
                  >
                    {formData.settings.submitButtonText || "Submit"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function renderField(field) {
  if (field.data?.hidden) return null

  switch (field.type) {
    case "text":
      return (
        <div key={field.id} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="text"
            placeholder={field.data?.placeholder || ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          {field.data?.helpText && <p className="text-xs text-gray-500">{field.data.helpText}</p>}
        </div>
      )

    case "email":
      return (
        <div key={field.id} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="email"
            placeholder={field.data?.placeholder || ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          {field.data?.helpText && <p className="text-xs text-gray-500">{field.data.helpText}</p>}
        </div>
      )

    case "textarea":
      return (
        <div key={field.id} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <textarea
            placeholder={field.data?.placeholder || ""}
            rows={field.data?.rows || 3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          {field.data?.helpText && <p className="text-xs text-gray-500">{field.data.helpText}</p>}
        </div>
      )

    case "select":
      return (
        <div key={field.id} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option value="">{field.data?.placeholder || "Select an option"}</option>
            {field.data?.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
          {field.data?.helpText && <p className="text-xs text-gray-500">{field.data.helpText}</p>}
        </div>
      )

    case "checkbox":
      return (
        <div key={field.id} className="space-y-3">
          <div>
            <span className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </span>
            {field.data?.helpText && <p className="text-xs text-gray-500">{field.data.helpText}</p>}
          </div>
          {field.data?.options?.map((option, index) => (
            <div key={index} className="flex items-center">
              <input type="checkbox" id={`${field.id}-${index}`} className="mr-2" />
              <label htmlFor={`${field.id}-${index}`} className="text-sm text-gray-700">
                {option}
              </label>
            </div>
          ))}
        </div>
      )

    case "radio":
      return (
        <div key={field.id} className="space-y-3">
          <div>
            <span className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </span>
            {field.data?.helpText && <p className="text-xs text-gray-500">{field.data.helpText}</p>}
          </div>
          {field.data?.options?.map((option, index) => (
            <div key={index} className="flex items-center">
              <input type="radio" id={`${field.id}-${index}`} name={field.id} className="mr-2" />
              <label htmlFor={`${field.id}-${index}`} className="text-sm text-gray-700">
                {option}
              </label>
            </div>
          ))}
        </div>
      )

    case "number":
      return (
        <div key={field.id} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="number"
            placeholder={field.data?.placeholder || ""}
            min={field.data?.min}
            max={field.data?.max}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          {field.data?.helpText && <p className="text-xs text-gray-500">{field.data.helpText}</p>}
        </div>
      )

    case "date":
      return (
        <div key={field.id} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          {field.data?.helpText && <p className="text-xs text-gray-500">{field.data.helpText}</p>}
        </div>
      )

    case "divider":
      return <hr key={field.id} className="border-gray-300 my-4" />

    case "heading1":
      return (
        <h1 key={field.id} className="text-2xl font-bold text-gray-900 my-4">
          {field.data?.text || "Heading 1"}
        </h1>
      )

    case "heading2":
      return (
        <h2 key={field.id} className="text-xl font-bold text-gray-900 my-3">
          {field.data?.text || "Heading 2"}
        </h2>
      )

    case "heading3":
      return (
        <h3 key={field.id} className="text-lg font-bold text-gray-900 my-2">
          {field.data?.text || "Heading 3"}
        </h3>
      )

    case "paragraph":
      return (
        <p key={field.id} className="text-gray-700 my-2">
          {field.data?.text || "Paragraph text"}
        </p>
      )

    default:
      return (
        <div key={field.id} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
            {field.type} field
          </div>
        </div>
      )
  }
}
