"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { FormField, FormStyle } from "@/lib/types"
import { Edit, Trash2, Calendar, Upload } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"

interface FormPreviewProps {
  title: string
  fields: FormField[]
  style: FormStyle
  onFieldsChange: (fields: FormField[]) => void
  isEditing: boolean
}

export default function FormPreview({ title, fields, style, onFieldsChange, isEditing }: FormPreviewProps) {
  const [editingField, setEditingField] = useState<FormField | null>(null)
  const [formValues, setFormValues] = useState<Record<string, any>>({})
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleEditField = (field: FormField) => {
    setEditingField({ ...field })
  }

  const handleSaveField = () => {
    if (!editingField) return

    const updatedFields = fields.map((field) => (field.id === editingField.id ? editingField : field))

    onFieldsChange(updatedFields)
    setEditingField(null)
  }

  const handleDeleteField = (fieldId: string) => {
    const updatedFields = fields.filter((field) => field.id !== fieldId)
    onFieldsChange(updatedFields)
  }

  const handleInputChange = (fieldId: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
    // In a real app, this would submit the form data to an API
    console.log("Form submitted:", formValues)
  }

  const getBackgroundStyle = () => {
    if (style.backgroundType === "gradient") {
      return { background: style.backgroundGradient }
    } else if (style.backgroundType === "image" && style.backgroundImage) {
      return {
        backgroundImage: `url(${style.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    }
    return { backgroundColor: style.backgroundColor }
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

  return (
    <div className="w-full">
      {formSubmitted && !isEditing ? (
        <div
          className="rounded-lg overflow-hidden"
          style={{
            borderRadius: `${style.borderRadius}px`,
            fontFamily: style.fontFamily,
            ...getBackgroundStyle(),
          }}
        >
          <div
            className="bg-white rounded-lg shadow-sm"
            style={{
              padding: `${style.padding}px`,
            }}
          >
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
                  backgroundColor: style.buttonColor,
                  color: style.buttonTextColor,
                }}
              >
                Submit Another Response
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="rounded-lg overflow-hidden"
          style={{
            borderRadius: `${style.borderRadius}px`,
            fontFamily: style.fontFamily,
            ...getBackgroundStyle(),
          }}
        >
          <div
            className="bg-white rounded-lg shadow-sm"
            style={{
              padding: `${style.padding}px`,
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold" style={{ color: style.titleColor || "inherit" }}>
                  {title}
                </h2>
                {style.description && <p className="text-muted-foreground">{style.description}</p>}
              </div>

              {fields.length > 0 ? (
                <div className="space-y-4">
                  {fields.map((field) => (
                    <div key={field.id} className={`form-field-preview ${isEditing ? "relative group" : ""}`}>
                      {isEditing && (
                        <div className="absolute right-0 top-0 hidden group-hover:flex space-x-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => handleEditField(field)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleDeleteField(field.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      {renderField(field)}
                    </div>
                  ))}

                  <Button
                    type="submit"
                    className="mt-4"
                    style={{
                      backgroundColor: style.buttonColor,
                      color: style.buttonTextColor,
                    }}
                  >
                    {style.buttonText || "Submit"}
                  </Button>
                </div>
              ) : (
                <div className="text-center p-8 border border-dashed rounded-md">
                  <p className="text-muted-foreground">No fields added yet. Add fields from the Form Fields panel.</p>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Field Edit Dialog */}
      {editingField && (
        <Dialog open={!!editingField} onOpenChange={(open) => !open && setEditingField(null)}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Field</DialogTitle>
              <DialogDescription>Customize the properties of this form field.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="field-label">Label</Label>
                <Input
                  id="field-label"
                  value={editingField.label}
                  onChange={(e) => setEditingField({ ...editingField, label: e.target.value })}
                />
              </div>

              {editingField.type !== "paragraph" && (
                <div className="space-y-2">
                  <Label htmlFor="field-placeholder">Placeholder</Label>
                  <Input
                    id="field-placeholder"
                    value={editingField.placeholder}
                    onChange={(e) => setEditingField({ ...editingField, placeholder: e.target.value })}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="field-description">Description (Optional)</Label>
                <Input
                  id="field-description"
                  value={editingField.description || ""}
                  onChange={(e) => setEditingField({ ...editingField, description: e.target.value })}
                  placeholder="Add a description for this field"
                />
              </div>

              {editingField.type === "paragraph" && (
                <div className="space-y-2">
                  <Label htmlFor="field-content">Content</Label>
                  <Textarea
                    id="field-content"
                    value={editingField.content || ""}
                    onChange={(e) => setEditingField({ ...editingField, content: e.target.value })}
                    rows={5}
                  />
                  <p className="text-xs text-muted-foreground">
                    You can use HTML tags for formatting (e.g., &lt;b&gt;, &lt;i&gt;, &lt;a&gt;)
                  </p>
                </div>
              )}

              {editingField.type === "file" && (
                <div className="space-y-2">
                  <Label htmlFor="field-file-types">Accepted File Types</Label>
                  <Input
                    id="field-file-types"
                    value={editingField.fileTypes || ""}
                    onChange={(e) => setEditingField({ ...editingField, fileTypes: e.target.value })}
                    placeholder="e.g., SVG, PNG, JPG or GIF"
                  />
                </div>
              )}

              {editingField.type !== "paragraph" && (
                <div className="flex items-center space-x-2">
                  <Switch
                    id="field-required"
                    checked={editingField.required}
                    onCheckedChange={(checked) => setEditingField({ ...editingField, required: checked })}
                  />
                  <Label htmlFor="field-required">Required field</Label>
                </div>
              )}

              {(editingField.type === "select" ||
                editingField.type === "checkbox" ||
                editingField.type === "radio") && (
                <div className="space-y-2">
                  <Label>Options</Label>
                  <div className="space-y-2">
                    {editingField.options?.map((option, index) => (
                      <div key={index} className="flex space-x-2">
                        <Input
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...(editingField.options || [])]
                            newOptions[index] = e.target.value
                            setEditingField({ ...editingField, options: newOptions })
                          }}
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => {
                            const newOptions = [...(editingField.options || [])]
                            newOptions.splice(index, 1)
                            setEditingField({ ...editingField, options: newOptions })
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        const newOptions = [
                          ...(editingField.options || []),
                          `Option ${(editingField.options?.length || 0) + 1}`,
                        ]
                        setEditingField({ ...editingField, options: newOptions })
                      }}
                    >
                      Add Option
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingField(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveField}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

