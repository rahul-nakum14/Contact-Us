"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { useFormBuilderStore } from "@/lib/store"
import { X, Plus } from "lucide-react"

interface FieldSettingsProps {
  fieldId: string
  onClose: () => void
}

export function FieldSettings({ fieldId, onClose }: FieldSettingsProps) {
  const { fields, updateField } = useFormBuilderStore()
  const field = fields.find((f) => f.id === fieldId)

  const [label, setLabel] = useState(field?.label || "")
  const [placeholder, setPlaceholder] = useState(field?.placeholder || "")
  const [required, setRequired] = useState(field?.required || false)
  const [options, setOptions] = useState<string[]>(field?.options || [])
  const [defaultValue, setDefaultValue] = useState(field?.defaultValue || "")

  useEffect(() => {
    if (field) {
      setLabel(field.label)
      setPlaceholder(field.placeholder || "")
      setRequired(field.required)
      setOptions(field.options || [])
      setDefaultValue(field.defaultValue || "")
    }
  }, [field])

  const handleSave = () => {
    if (!field) return

    updateField(fieldId, {
      label,
      placeholder,
      required,
      options: ["select", "checkbox", "radio"].includes(field.type) ? options : undefined,
      defaultValue: defaultValue || undefined,
    })

    onClose()
  }

  const addOption = () => {
    setOptions([...options, `Option ${options.length + 1}`])
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index))
  }

  if (!field) return null

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Field Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="label">Label</Label>
            <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="placeholder">Placeholder</Label>
            <Input id="placeholder" value={placeholder} onChange={(e) => setPlaceholder(e.target.value)} />
          </div>
          {["text", "email", "phone", "textarea"].includes(field.type) && (
            <div className="grid gap-2">
              <Label htmlFor="defaultValue">Default Value</Label>
              {field.type === "textarea" ? (
                <Textarea id="defaultValue" value={defaultValue} onChange={(e) => setDefaultValue(e.target.value)} />
              ) : (
                <Input id="defaultValue" value={defaultValue} onChange={(e) => setDefaultValue(e.target.value)} />
              )}
            </div>
          )}
          {["select", "checkbox", "radio"].includes(field.type) && (
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Options</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                  className="h-8 px-2 flex items-center gap-1"
                >
                  <Plus size={14} />
                  Add Option
                </Button>
              </div>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input value={option} onChange={(e) => updateOption(index, e.target.value)} />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(index)}
                      className="h-8 w-8"
                    >
                      <X size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Checkbox id="required" checked={required} onCheckedChange={(checked) => setRequired(checked as boolean)} />
            <label
              htmlFor="required"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Required field
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

