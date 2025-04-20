"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { GripVertical, Trash2, Copy, Eye, EyeOff, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"

export default function SortableField({ field, isSelected, onClick, onRemove, onDuplicate }) {
  const [isHidden, setIsHidden] = useState(false)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: field.id })

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
      payment: "Payment",
      rating: "Rating",
      matrix: "Matrix",
      signature: "Signature",
      website: "Website",
      address: "Address",
      toggle: "Toggle",
      time: "Time",
      columns: "Columns",
      section: "Section",
      divider: "Divider",
      heading1: "Heading 1",
      heading2: "Heading 2",
      heading3: "Heading 3",
      paragraph: "Paragraph",
      table: "Table",
      image: "Image",
      video: "Video",
      audio: "Audio",
      embed: "Embed",
    }

    return typeLabels[type] || type
  }

  const getFieldIcon = () => {
    // This would be better with a mapping from field type to icon component
    // For simplicity, we'll just return a generic icon based on field type
    return null
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center border rounded-md p-3 bg-white transition-all",
        isSelected ? "border-purple-500 ring-2 ring-purple-200" : "border-gray-200",
        isDragging ? "opacity-50 z-10 shadow-md" : "opacity-100",
        isHidden ? "opacity-60" : "opacity-100",
      )}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
    >
      <div {...attributes} {...listeners} className="cursor-grab p-1 mr-2 text-gray-400 hover:text-gray-600 touch-none">
        <GripVertical className="h-5 w-5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center">
          {getFieldIcon()}
          <span className="font-medium truncate">{field.label}</span>
          {field.required && <span className="text-red-500 ml-1">*</span>}
          {isHidden && <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded">Hidden</span>}
        </div>
        <div className="text-xs text-gray-500 flex items-center mt-1">
          <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">{getFieldTypeLabel(field.type)}</span>
          {field.data?.placeholder && <span className="ml-2 truncate">Placeholder: {field.data.placeholder}</span>}
        </div>
      </div>

      <div className="flex items-center gap-1 ml-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-gray-400 hover:text-gray-600"
          onClick={(e) => {
            e.stopPropagation()
            setIsHidden(!isHidden)
          }}
        >
          {isHidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-gray-400 hover:text-gray-600"
              onClick={(e) => e.stopPropagation()}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                onClick()
              }}
            >
              Edit Properties
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                onDuplicate()
              }}
            >
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                onRemove()
              }}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
