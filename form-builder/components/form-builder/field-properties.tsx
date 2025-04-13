"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { X, Plus, Trash2 } from "lucide-react"

export default function FieldProperties({ field, onChange, onClose }) {
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Field Properties</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={field.label} onChange={(e) => onChange({ label: e.target.value })} />
        </div>

        {field.type !== "checkbox" && field.type !== "radio" && field.type !== "file" && (
          <div className="space-y-2">
            <Label htmlFor="placeholder">Placeholder</Label>
            <Input
              id="placeholder"
              value={field.data?.placeholder || ""}
              onChange={(e) => updateFieldData("placeholder", e.target.value)}
              placeholder="Enter placeholder text"
            />
            <p className="text-xs text-gray-500">Text that appears in the field before the user enters a value</p>
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

        {(field.type === "select" || field.type === "radio" || field.type === "checkbox") && (
          <div className="space-y-3">
            <Label>Options</Label>
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input value={option} onChange={(e) => handleOptionChange(index, e.target.value)} />
                <Button variant="ghost" size="icon" onClick={() => removeOption(index)} disabled={options.length <= 1}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addOption} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Option
            </Button>
          </div>
        )}

        {field.type === "number" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="min">Minimum Value</Label>
              <Input
                id="min"
                type="number"
                value={field.data?.min || ""}
                onChange={(e) => updateFieldData("min", e.target.value ? Number.parseInt(e.target.value) : undefined)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max">Maximum Value</Label>
              <Input
                id="max"
                type="number"
                value={field.data?.max || ""}
                onChange={(e) => updateFieldData("max", e.target.value ? Number.parseInt(e.target.value) : undefined)}
              />
            </div>
          </>
        )}

        {field.type === "file" && (
          <div className="space-y-2">
            <Label htmlFor="accept">Accepted File Types</Label>
            <Input
              id="accept"
              value={field.data?.accept || ""}
              placeholder="e.g. .pdf,.jpg,.png"
              onChange={(e) => updateFieldData("accept", e.target.value)}
            />
            <p className="text-xs text-gray-500">Comma-separated list of file extensions or MIME types</p>
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

        {field.type === "text" && (
          <div className="space-y-2">
            <Label htmlFor="validation">Validation Pattern</Label>
            <select
              id="validation"
              className="w-full rounded-md border border-gray-300 p-2"
              value={field.data?.validation || ""}
              onChange={(e) => updateFieldData("validation", e.target.value || undefined)}
            >
              <option value="">None</option>
              <option value="email">Email</option>
              <option value="url">URL</option>
              <option value="phone">Phone Number</option>
              <option value="zipcode">Zip Code</option>
              <option value="custom">Custom Regex</option>
            </select>
            {field.data?.validation === "custom" && (
              <div className="mt-2">
                <Label htmlFor="regex">Custom Regex Pattern</Label>
                <Input
                  id="regex"
                  value={field.data?.regex || ""}
                  placeholder="e.g. ^[a-zA-Z0-9]+$"
                  onChange={(e) => updateFieldData("regex", e.target.value)}
                />
              </div>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="helpText">Help Text (Optional)</Label>
          <Textarea
            id="helpText"
            value={field.data?.helpText || ""}
            placeholder="Additional information about this field"
            onChange={(e) => updateFieldData("helpText", e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  )
}
