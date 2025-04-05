"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { FormField, FormStyle } from "@/lib/types"
import { Edit, Trash2 } from "lucide-react"
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

  const getBackgroundStyle = () => {
    if (style.backgroundType === "gradient") {
      return { background: style.backgroundGradient }
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
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type={field.type === "email" ? "email" : field.type === "phone" ? "tel" : "text"}
              placeholder={field.placeholder}
              value={formValues[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              {...isRequired}
            />
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
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="w-full">
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
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{title}</h2>
            </div>

            {fields.length > 0 ? (
              <div className="space-y-4">
                {fields.map((field) => (
                  <div key={field.id} className={`form-field-preview ${isEditing ? "relative group" : ""}`}>
                    {isEditing && (
                      <div className="absolute right-0 top-0 hidden group-hover:flex space-x-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleEditField(field)}>
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
                  Submit
                </Button>
              </div>
            ) : (
              <div className="text-center p-8 border border-dashed rounded-md">
                <p className="text-muted-foreground">No fields added yet. Add fields from the Form Fields panel.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Field Edit Dialog */}
      {editingField && (
        <Dialog open={!!editingField} onOpenChange={(open) => !open && setEditingField(null)}>
          <DialogContent>
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
              <div className="space-y-2">
                <Label htmlFor="field-placeholder">Placeholder</Label>
                <Input
                  id="field-placeholder"
                  value={editingField.placeholder}
                  onChange={(e) => setEditingField({ ...editingField, placeholder: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="field-required"
                  checked={editingField.required}
                  onCheckedChange={(checked) => setEditingField({ ...editingField, required: checked })}
                />
                <Label htmlFor="field-required">Required field</Label>
              </div>

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

