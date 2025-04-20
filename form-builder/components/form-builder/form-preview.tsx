"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Clock } from "lucide-react"

export default function FormPreview({ formData }) {
  const [previewStyles, setPreviewStyles] = useState({
    formStyle: {},
    pageStyle: {},
    buttonStyle: {},
    buttonClasses: "",
  })

  const [formValues, setFormValues] = useState({})
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  useEffect(() => {
    // Convert styles to CSS objects
    const buttonStyle = formData.styles.buttonStyle || {}
    const buttonAnimation = buttonStyle.animation || "none"

    let buttonAnimationClass = ""
    if (buttonAnimation === "pulse") {
      buttonAnimationClass = "animate-pulse"
    } else if (buttonAnimation === "bounce") {
      buttonAnimationClass = "animate-bounce"
    } else if (buttonAnimation === "scale") {
      buttonAnimationClass = "hover:scale-105 transition-transform"
    }

    const buttonFullWidth = buttonStyle.fullWidth ? "w-full" : ""

    setPreviewStyles({
      formStyle: {
        backgroundColor: formData.styles.formStyle.backgroundColor,
        borderRadius: formData.styles.formStyle.borderRadius,
        padding: formData.styles.formStyle.padding,
        boxShadow: formData.styles.formStyle.boxShadow,
      },
      pageStyle: {
        backgroundColor: formData.styles.pageStyle.backgroundColor,
        backgroundImage: formData.styles.pageStyle.backgroundImage
          ? `url(${formData.styles.pageStyle.backgroundImage})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        background: formData.styles.pageStyle.backgroundGradient || undefined,
      },
      buttonStyle:
        buttonStyle.style === "gradient"
          ? {
              background: buttonStyle.gradient || "linear-gradient(to right, #4f46e5, #7c3aed)",
              color: buttonStyle.textColor,
              borderRadius: buttonStyle.borderRadius,
              padding: `${buttonStyle.paddingY || "8px"} ${buttonStyle.paddingX || "16px"}`,
            }
          : {
              backgroundColor:
                buttonStyle.style === "outline" || buttonStyle.style === "ghost"
                  ? "transparent"
                  : buttonStyle.backgroundColor,
              color: buttonStyle.textColor,
              borderRadius: buttonStyle.borderRadius,
              border: buttonStyle.style === "outline" ? `1px solid ${buttonStyle.backgroundColor}` : "none",
              padding: `${buttonStyle.paddingY || "8px"} ${buttonStyle.paddingX || "16px"}`,
            },
      buttonClasses: cn(
        buttonAnimationClass,
        buttonFullWidth,
        buttonStyle.size === "sm" ? "text-sm" : "",
        buttonStyle.size === "lg" ? "text-lg" : "",
        buttonStyle.style === "ghost" ? "hover:bg-opacity-10" : "",
      ),
    })
  }, [formData.styles])

  const handleInputChange = (fieldId, value) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }))
  }

  const renderField = (field) => {
    // Skip hidden fields in preview mode
    if (isPreviewMode && field.data?.hidden) {
      return null
    }

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
              value={formValues[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              style={{ backgroundColor: field.data?.backgroundColor || "#ffffff" }}
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
              value={formValues[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              style={{ backgroundColor: field.data?.backgroundColor || "#ffffff" }}
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
              value={formValues[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              style={{ backgroundColor: field.data?.backgroundColor || "#ffffff" }}
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
            <Select value={formValues[field.id] || ""} onValueChange={(value) => handleInputChange(field.id, value)}>
              <SelectTrigger id={field.id} style={{ backgroundColor: field.data?.backgroundColor || "#ffffff" }}>
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
                  checked={(formValues[field.id] || []).includes(option)}
                  onCheckedChange={(checked) => {
                    const currentValues = formValues[field.id] || []
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
            <RadioGroup
              value={formValues[field.id] || ""}
              onValueChange={(value) => handleInputChange(field.id, value)}
            >
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
              value={formValues[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value ? Number(e.target.value) : "")}
              style={{ backgroundColor: field.data?.backgroundColor || "#ffffff" }}
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
              value={formValues[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              style={{ backgroundColor: field.data?.backgroundColor || "#ffffff" }}
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
              value={formValues[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              style={{ backgroundColor: field.data?.backgroundColor || "#ffffff" }}
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

      case "time":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="relative">
              <Input
                id={field.id}
                type="time"
                value={formValues[field.id] || ""}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                style={{ backgroundColor: field.data?.backgroundColor || "#ffffff" }}
              />
              <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            {field.data?.helpText && <p className="text-xs text-gray-500">{field.data.helpText}</p>}
          </div>
        )

      case "divider":
        return <hr key={field.id} className="border-gray-300 my-4" />

      case "heading1":
        return (
          <h1 key={field.id} className="text-2xl font-bold mt-6 mb-2">
            {field.data?.text || field.label}
          </h1>
        )

      case "heading2":
        return (
          <h2 key={field.id} className="text-xl font-bold mt-5 mb-2">
            {field.data?.text || field.label}
          </h2>
        )

      case "heading3":
        return (
          <h3 key={field.id} className="text-lg font-bold mt-4 mb-2">
            {field.data?.text || field.label}
          </h3>
        )

      case "paragraph":
        return (
          <p key={field.id} className="text-gray-700 mb-4">
            {field.data?.text || field.label}
          </p>
        )

      case "image":
        return (
          <div key={field.id} className="space-y-2">
            {field.label && (
              <Label>
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            )}
            <div className="border rounded-md overflow-hidden">
              {field.data?.url ? (
                <img
                  src={field.data.url || "/placeholder.svg"}
                  alt={field.data.alt || field.label || "Image"}
                  className="max-w-full h-auto"
                  style={{
                    width: field.data.width ? `${field.data.width}px` : "100%",
                    height: field.data.height ? `${field.data.height}px` : "auto",
                  }}
                />
              ) : (
                <div
                  className="bg-gray-100 flex items-center justify-center text-gray-400"
                  style={{
                    width: field.data?.width || "100%",
                    height: field.data?.height || "200px",
                  }}
                >
                  <span>Image placeholder</span>
                </div>
              )}
            </div>
            {field.data?.helpText && <p className="text-xs text-gray-500">{field.data.helpText}</p>}
          </div>
        )

      case "video":
        return (
          <div key={field.id} className="space-y-2">
            {field.label && (
              <Label>
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            )}
            <div className="border rounded-md overflow-hidden">
              {field.data?.url ? (
                <video
                  src={field.data.url}
                  controls
                  className="max-w-full"
                  style={{
                    width: field.data.width ? `${field.data.width}px` : "100%",
                    height: field.data.height ? `${field.data.height}px` : "auto",
                  }}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div
                  className="bg-gray-100 flex items-center justify-center text-gray-400"
                  style={{
                    width: field.data?.width || "100%",
                    height: field.data?.height || "315px",
                  }}
                >
                  <span>Video placeholder</span>
                </div>
              )}
            </div>
            {field.data?.helpText && <p className="text-xs text-gray-500">{field.data.helpText}</p>}
          </div>
        )

      case "audio":
        return (
          <div key={field.id} className="space-y-2">
            {field.label && (
              <Label>
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            )}
            <div className="border rounded-md p-4">
              {field.data?.url ? (
                <audio src={field.data.url} controls className="w-full">
                  Your browser does not support the audio tag.
                </audio>
              ) : (
                <div className="bg-gray-100 p-4 flex items-center justify-center text-gray-400 rounded">
                  <span>Audio placeholder</span>
                </div>
              )}
            </div>
            {field.data?.helpText && <p className="text-xs text-gray-500">{field.data.helpText}</p>}
          </div>
        )

      case "embed":
        return (
          <div key={field.id} className="space-y-2">
            {field.label && (
              <Label>
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            )}
            <div className="border rounded-md overflow-hidden">
              {field.data?.code ? (
                <div
                  dangerouslySetInnerHTML={{ __html: field.data.code }}
                  style={{
                    width: field.data.width || "100%",
                    height: field.data.height || "300px",
                  }}
                />
              ) : (
                <div
                  className="bg-gray-100 flex items-center justify-center text-gray-400"
                  style={{
                    width: field.data?.width || "100%",
                    height: field.data?.height || "300px",
                  }}
                >
                  <span>Embed placeholder</span>
                </div>
              )}
            </div>
            {field.data?.helpText && <p className="text-xs text-gray-500">{field.data.helpText}</p>}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div style={previewStyles.pageStyle} className="min-h-[500px] p-4 rounded-lg">
      <div style={previewStyles.formStyle} className="max-w-md mx-auto rounded-lg">
        {formData.title && <h2 className="text-xl font-bold mb-2">{formData.title}</h2>}
        {formData.description && <p className="text-gray-600 mb-6">{formData.description}</p>}

        <div className="space-y-6">
          {formData.fields.map(renderField)}

          {formData.fields.length > 0 && (
            <button
              style={previewStyles.buttonStyle}
              className={cn("mt-4 font-medium", previewStyles.buttonClasses)}
              onClick={(e) => e.preventDefault()}
            >
              {formData.settings.submitButtonText || "Submit"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
