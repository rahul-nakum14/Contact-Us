"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  AlignLeft,
  CheckSquare,
  ChevronDown,
  ListChecks,
  Mail,
  Phone,
  Type,
  User,
  Calendar,
  LinkIcon,
  FileText,
  Upload,
  Hash,
  CreditCard,
  GripVertical,
} from "lucide-react"
import type { FormField, FieldType } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

interface FormBuilderProps {
  fields: FormField[]
  setFields: (fields: FormField[]) => void
}

export default function FormBuilder({ fields, setFields }: FormBuilderProps) {
  const { toast } = useToast()
  const [activeCategory, setActiveCategory] = useState<"basic" | "advanced">("basic")

  const basicFieldTypes: { type: FieldType; label: string; icon: React.ElementType }[] = [
    { type: "text", label: "Text", icon: Type },
    { type: "email", label: "Email", icon: Mail },
    { type: "phone", label: "Phone", icon: Phone },
    { type: "textarea", label: "Textarea", icon: AlignLeft },
    { type: "select", label: "Dropdown", icon: ChevronDown },
    { type: "checkbox", label: "Checkbox", icon: CheckSquare },
    { type: "radio", label: "Radio", icon: ListChecks },
    { type: "name", label: "Name", icon: User },
  ]

  const advancedFieldTypes: { type: FieldType; label: string; icon: React.ElementType }[] = [
    { type: "date", label: "Date", icon: Calendar },
    { type: "url", label: "URL", icon: LinkIcon },
    { type: "file", label: "File Upload", icon: Upload },
    { type: "number", label: "Number", icon: Hash },
    { type: "paragraph", label: "Paragraph", icon: FileText },
    { type: "payment", label: "Payment", icon: CreditCard },
  ]

  const addField = (type: FieldType) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type,
      label: `New ${type} field`,
      placeholder: `Enter ${type}...`,
      required: false,
      options: type === "select" || type === "radio" || type === "checkbox" ? ["Option 1", "Option 2", "Option 3"] : [],
    }

    setFields([...fields, newField])

    toast({
      title: "Field added",
      description: `Added a new ${type} field to your form`,
    })
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(fields)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setFields(items)
  }

  return (
    <div className="space-y-4">
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeCategory === "basic"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveCategory("basic")}
        >
          Basic Fields
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeCategory === "advanced"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveCategory("advanced")}
        >
          Advanced Fields
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {(activeCategory === "basic" ? basicFieldTypes : advancedFieldTypes).map((fieldType) => (
          <Card
            key={fieldType.type}
            className="flex flex-col items-center p-3 cursor-pointer hover:bg-muted transition-colors draggable-item"
            onClick={() => addField(fieldType.type)}
          >
            <fieldType.icon className="h-5 w-5 mb-1" />
            <span className="text-sm">{fieldType.label}</span>
          </Card>
        ))}
      </div>

      <div className="border-t pt-4">
        <h4 className="text-sm font-medium mb-2">Field Order</h4>
        {fields.length > 0 ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="fields">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  {fields.map((field, index) => (
                    <Draggable key={field.id} draggableId={field.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="flex items-center justify-between p-2 bg-muted rounded-md"
                        >
                          <div className="flex items-center">
                            <div {...provided.dragHandleProps} className="mr-2 cursor-grab">
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <span className="w-6 text-center text-muted-foreground">{index + 1}</span>
                            <span className="font-medium">{field.label}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newFields = [...fields]
                              newFields.splice(index, 1)
                              setFields(newFields)
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <div className="text-center p-4 border border-dashed rounded-md">
            <p className="text-sm text-muted-foreground">
              No fields added yet. Click on a field type above to add it to your form.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

