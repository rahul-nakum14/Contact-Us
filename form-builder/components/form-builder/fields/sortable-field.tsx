"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { GripVertical, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function SortableField({ field, isSelected, onClick, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const getFieldTypeLabel = (type) => {
    const typeLabels = {
      text: "Text",
      email: "Email",
      textarea: "Text Area",
      select: "Dropdown",
      checkbox: "Checkbox Group",
      radio: "Radio Group",
      number: "Number",
      date: "Date",
      phone: "Phone",
      file: "File Upload",
    }

    return typeLabels[type] || type
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center border rounded-md p-3 bg-white",
        isSelected ? "border-purple-500 ring-2 ring-purple-200" : "border-gray-200",
      )}
      onClick={onClick}
    >
      <div {...attributes} {...listeners} className="cursor-grab p-1 mr-2 text-gray-400 hover:text-gray-600">
        <GripVertical className="h-5 w-5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center">
          <span className="font-medium truncate">{field.label}</span>
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </div>
        <div className="text-xs text-gray-500 flex items-center mt-1">
          <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">{getFieldTypeLabel(field.type)}</span>
          {field.placeholder && <span className="ml-2 truncate">Placeholder: {field.placeholder}</span>}
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
        className="ml-2 text-gray-400 hover:text-red-500"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
