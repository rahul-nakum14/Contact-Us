"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

export default function FormPreview({ formData }) {
  const [previewStyles, setPreviewStyles] = useState({
    formStyle: {},
    pageStyle: {},
    buttonStyle: {},
    buttonClasses: "",
  })

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
        // Use EITHER the gradient (shorthand background) OR individual properties
        ...(formData.styles.pageStyle.backgroundGradient
          ? {
              background: formData.styles.pageStyle.backgroundGradient
            }
          : {
              backgroundColor: formData.styles.pageStyle.backgroundColor || '#f3f4f6',
              ...(formData.styles.pageStyle.backgroundImage && {
                backgroundImage: `url(${formData.styles.pageStyle.backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
              })
            }
        )
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

  const renderField = (field) => {
    switch (field.type) {
      case "text":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input id={field.id} placeholder={field.data?.placeholder || ""} />
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
            <Input id={field.id} type="email" placeholder={field.data?.placeholder || ""} />
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
            <Textarea id={field.id} placeholder={field.data?.placeholder || ""} rows={field.data?.rows || 3} />
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
            <Select>
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
                <Checkbox id={`${field.id}-${index}`} />
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
            <RadioGroup>
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
            <Input id={field.id} type="date" />
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
            <Input id={field.id} type="tel" placeholder={field.data?.placeholder || ""} />
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
            <Input id={field.id} type="file" accept={field.data?.accept} />
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
            <button style={previewStyles.buttonStyle} className={cn("mt-4 font-medium", previewStyles.buttonClasses)}>
              {formData.settings.submitButtonText || "Submit"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
