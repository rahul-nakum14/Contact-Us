"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Type, Mail, AlignLeft, List, CheckSquare, CircleDot, Hash, Calendar, Phone, Upload } from "lucide-react"

const fieldTypes = [
  { id: "text", name: "Text", icon: Type, description: "Short answer text", color: "bg-blue-100 text-blue-600" },
  { id: "email", name: "Email", icon: Mail, description: "Email address", color: "bg-green-100 text-green-600" },
  {
    id: "textarea",
    name: "Text Area",
    icon: AlignLeft,
    description: "Long answer text",
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    id: "select",
    name: "Dropdown",
    icon: List,
    description: "Select from options",
    color: "bg-purple-100 text-purple-600",
  },
  {
    id: "checkbox",
    name: "Checkbox Group",
    icon: CheckSquare,
    description: "Multiple choice",
    color: "bg-pink-100 text-pink-600",
  },
  { id: "radio", name: "Radio Group", icon: CircleDot, description: "Single choice", color: "bg-red-100 text-red-600" },
  { id: "number", name: "Number", icon: Hash, description: "Numeric input", color: "bg-yellow-100 text-yellow-600" },
  { id: "date", name: "Date", icon: Calendar, description: "Date picker", color: "bg-orange-100 text-orange-600" },
  { id: "phone", name: "Phone", icon: Phone, description: "Phone number", color: "bg-teal-100 text-teal-600" },
  { id: "file", name: "File Upload", icon: Upload, description: "File attachment", color: "bg-cyan-100 text-cyan-600" },
]

export default function FieldTypes({ onSelect, onClose }) {
  return (
    <Card className="border-purple-100 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100">
        <CardTitle className="text-lg text-purple-800">Add Field</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {fieldTypes.map((type) => (
            <button
              key={type.id}
              className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-all hover:shadow-md"
              onClick={() => onSelect(type.id)}
            >
              <div className={`h-12 w-12 rounded-full ${type.color} flex items-center justify-center mb-3`}>
                <type.icon className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium">{type.name}</span>
              <span className="text-xs text-gray-500 text-center mt-1">{type.description}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
