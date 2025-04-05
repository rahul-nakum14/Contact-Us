"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlignLeft, CheckSquare, ChevronDown, ListChecks, Mail, Phone, Type, User } from "lucide-react"
import type { FormField, FieldType } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

interface FormBuilderProps {
  fields: FormField[]
  setFields: (fields: FormField[]) => void
}

export default function FormBuilder({ fields, setFields }: FormBuilderProps) {
  const { toast } = useToast()

  const fieldTypes: { type: FieldType; label: string; icon: React.ElementType }[] = [
    { type: "text", label: "Text", icon: Type },
    { type: "email", label: "Email", icon: Mail },
    { type: "phone", label: "Phone", icon: Phone },
    { type: "textarea", label: "Textarea", icon: AlignLeft },
    { type: "select", label: "Dropdown", icon: ChevronDown },
    { type: "checkbox", label: "Checkbox", icon: CheckSquare },
    { type: "radio", label: "Radio", icon: ListChecks },
    { type: "name", label: "Name", icon: User },
  ]

  const addField = (type: FieldType) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type,
      label: `New ${type} field`,
      placeholder: `Enter ${type}...`,
      required: false,
      options: type === "select" || type === "radio" ? ["Option 1", "Option 2", "Option 3"] : [],
    }

    setFields([...fields, newField])

    toast({
      title: "Field added",
      description: `Added a new ${type} field to your form`,
    })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {fieldTypes.map((fieldType) => (
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
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                <div className="flex items-center">
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
            ))}
          </div>
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

