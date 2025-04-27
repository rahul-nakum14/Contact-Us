"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { X, Plus, Trash2 } from "lucide-react"

export default function PropertiesPanel({ field, onChange, onClose }) {
  const [options, setOptions] = useState(field.data?.options || [])

  const handleOptionChange = (index, value) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)

    // Update field data with new options
    const updatedData = { ...field.data, options: newOptions }
    onChange({ data: updatedData })
  }

  const addOption = () => {
    const newOptions = [...options, `Option ${options.length + 1}`]
    setOptions(newOptions)

    // Update field data with new options
    const updatedData = { ...field.data, options: newOptions }
    onChange({ data: updatedData })
  }

  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index)
    setOptions(newOptions)

    // Update field data with new options
    const updatedData = { ...field.data, options: newOptions }
    onChange({ data: updatedData })
  }

  const updateFieldData = (key, value) => {
    const updatedData = { ...field.data, [key]: value }
    onChange({ data: updatedData })
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-3 border-b">
        <h3 className="font-medium">Field Properties</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="label">Label</Label>
              <Input id="label" value={field.label} onChange={(e) => onChange({ label: e.target.value })} />
            </div>

            {field.type !== "checkbox" && field.type !== "radio" && (
              <div className="space-y-2">
                <Label htmlFor="placeholder">Placeholder</Label>
                <Input
                  id="placeholder"
                  value={field.data?.placeholder || ""}
                  onChange={(e) => updateFieldData("placeholder", e.target.value)}
                  placeholder="Enter placeholder text"
                />
              </div>
            )}

            {field.type === "textarea" && (
              <div className="space-y-2">
                <Label htmlFor="rows">Rows</Label>
                <Input
                  id="rows"
                  type="number"
                  min="2"
                  max="10"
                  value={field.data?.rows || 3}
                  onChange={(e) => updateFieldData("rows", Number.parseInt(e.target.value))}
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <Label htmlFor="required" className="cursor-pointer">
                Required field
              </Label>
              <Switch
                id="required"
                checked={field.required}
                onCheckedChange={(checked) => onChange({ required: checked })}
              />
            </div>
          </div>

          {(field.type === "select" || field.type === "radio" || field.type === "checkbox") && (
            <div>
              <Label className="mb-3 block">Options</Label>
              <div className="space-y-3">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input value={option} onChange={(e) => handleOptionChange(index, e.target.value)} />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(index)}
                      disabled={options.length <= 1}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addOption} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
