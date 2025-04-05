"use client"

import { useState } from "react"
import { useDrag, useDrop } from "react-dnd"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FormControl, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { type FieldType, useFormBuilderStore } from "@/lib/store"
import {
  Trash2,
  GripVertical,
  Type,
  Mail,
  Phone,
  AlignLeft,
  List,
  CheckSquare,
  CircleDot,
  Plus,
  Settings,
} from "lucide-react"
import { FieldSettings } from "@/components/field-settings"
import type { FormField as FormFieldType } from "@/lib/store"

interface DragItem {
  index: number
  id: string
  type: string
}

export function FormDesigner() {
  const { fields, addField, removeField, reorderFields } = useFormBuilderStore()
  const [selectedField, setSelectedField] = useState<string | null>(null)
  const [showFieldSettings, setShowFieldSettings] = useState(false)

  const [, drop] = useDrop({
    accept: "FORM_FIELD",
    hover(item: DragItem, monitor) {
      if (!fields.length) return
    },
    drop(item: DragItem, monitor) {
      if (!monitor.didDrop()) {
        // Handle drop logic if needed
      }
    },
  })

  const handleAddField = (type: FieldType) => {
    const newField: Omit<FormFieldType, "id"> = {
      type,
      label: `New ${type} field`,
      placeholder: `Enter ${type}...`,
      required: false,
    }

    if (type === "select" || type === "checkbox" || type === "radio") {
      newField.options = ["Option 1", "Option 2", "Option 3"]
    }

    addField(newField)
  }

  const handleFieldSettings = (id: string) => {
    setSelectedField(id)
    setShowFieldSettings(true)
  }

  const closeFieldSettings = () => {
    setShowFieldSettings(false)
    setSelectedField(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => handleAddField("text")} className="flex items-center gap-2">
          <Type size={16} />
          Text
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleAddField("email")} className="flex items-center gap-2">
          <Mail size={16} />
          Email
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleAddField("phone")} className="flex items-center gap-2">
          <Phone size={16} />
          Phone
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAddField("textarea")}
          className="flex items-center gap-2"
        >
          <AlignLeft size={16} />
          Textarea
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAddField("select")}
          className="flex items-center gap-2"
        >
          <List size={16} />
          Dropdown
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAddField("checkbox")}
          className="flex items-center gap-2"
        >
          <CheckSquare size={16} />
          Checkbox
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleAddField("radio")} className="flex items-center gap-2">
          <CircleDot size={16} />
          Radio
        </Button>
      </div>

      <div ref={drop} className="space-y-3 min-h-[300px] p-4 border-2 border-dashed rounded-lg">
        {fields.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
            <Plus size={40} strokeWidth={1} />
            <p className="mt-2">Drag fields here or click the buttons above to add fields</p>
          </div>
        ) : (
          fields.map((field, index) => (
            <FieldComponent
              key={field.id}
              field={field}
              index={index}
              onRemove={() => removeField(field.id)}
              onSettings={() => handleFieldSettings(field.id)}
              reorderFields={reorderFields}
            />
          ))
        )}
      </div>

      {showFieldSettings && selectedField && <FieldSettings fieldId={selectedField} onClose={closeFieldSettings} />}
    </div>
  )
}

interface FieldComponentProps {
  field: FormFieldType
  index: number
  onRemove: () => void
  onSettings: () => void
  reorderFields: (startIndex: number, endIndex: number) => void
}

function FieldComponent({ field, index, onRemove, onSettings, reorderFields }: FieldComponentProps) {
  const ref = useState<HTMLDivElement | null>(null)[1]

  const [{ isDragging }, drag, preview] = useDrag({
    type: "FORM_FIELD",
    item: { type: "FORM_FIELD", id: field.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: "FORM_FIELD",
    hover(item: DragItem, monitor) {
      if (!ref) return
      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) return

      reorderFields(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })

  drag(drop(ref))

  return (
    <div ref={preview} style={{ opacity: isDragging ? 0.5 : 1 }} className="relative group">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <div ref={ref} className="cursor-move mt-1 text-muted-foreground">
              <GripVertical size={20} />
            </div>
            <div className="flex-1">
              <FormItem>
                <FormLabel>
                  {field.label}
                  {field.required && " *"}
                </FormLabel>
                <FormControl>
                  {field.type === "text" && <Input placeholder={field.placeholder} disabled />}
                  {field.type === "email" && <Input type="email" placeholder={field.placeholder} disabled />}
                  {field.type === "phone" && <Input type="tel" placeholder={field.placeholder} disabled />}
                  {field.type === "textarea" && <Textarea placeholder={field.placeholder} disabled />}
                  {field.type === "select" && (
                    <Select disabled>
                      <SelectTrigger>
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
                          <Checkbox id={`${field.id}-${i}`} disabled />
                          <label htmlFor={`${field.id}-${i}`}>{option}</label>
                        </div>
                      ))}
                    </div>
                  )}
                  {field.type === "radio" && (
                    <div className="space-y-2">
                      {field.options?.map((option, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <input type="radio" id={`${field.id}-${i}`} name={field.id} disabled className="h-4 w-4" />
                          <label htmlFor={`${field.id}-${i}`}>{option}</label>
                        </div>
                      ))}
                    </div>
                  )}
                </FormControl>
              </FormItem>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={onSettings}
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Settings size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onRemove}
                className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

