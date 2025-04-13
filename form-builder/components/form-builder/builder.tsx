"use client"

import { useState } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Wand2, Sparkles, FileText } from "lucide-react"
import FieldTypes from "./field-types"
import FieldProperties from "./field-properties"
import SortableField from "./fields/sortable-field"
import { generateId } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function FormBuilder({ fields, onFieldsChange }) {
  const [selectedFieldIndex, setSelectedFieldIndex] = useState(null)
  const [showFieldTypes, setShowFieldTypes] = useState(false)
  const [activeTab, setActiveTab] = useState("fields")

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id)
      const newIndex = fields.findIndex((field) => field.id === over.id)

      const newFields = arrayMove(fields, oldIndex, newIndex)

      // Update order property for each field
      const updatedFields = newFields.map((field, index) => ({
        ...field,
        order: index,
      }))

      onFieldsChange(updatedFields)

      if (selectedFieldIndex !== null) {
        setSelectedFieldIndex(newIndex)
      }
    }
  }

  const addField = (type) => {
    const newField = {
      id: generateId(),
      type,
      label: getDefaultLabelForType(type),
      required: false,
      order: fields.length,
      data: {
        placeholder: getDefaultPlaceholderForType(type),
        options:
          type === "select" || type === "radio" || type === "checkbox"
            ? ["Option 1", "Option 2", "Option 3"]
            : undefined,
        rows: type === "textarea" ? 3 : undefined,
      },
    }

    const newFields = [...fields, newField]
    onFieldsChange(newFields)
    setSelectedFieldIndex(newFields.length - 1)
    setShowFieldTypes(false)
  }

  const updateField = (index, updatedField) => {
    const newFields = [...fields]
    newFields[index] = {
      ...newFields[index],
      ...updatedField,
    }
    onFieldsChange(newFields)
  }

  const removeField = (index) => {
    const newFields = fields.filter((_, i) => i !== index)

    // Update order property for each field
    const updatedFields = newFields.map((field, i) => ({
      ...field,
      order: i,
    }))

    onFieldsChange(updatedFields)
    setSelectedFieldIndex(null)
  }

  const getDefaultLabelForType = (type) => {
    const typeLabels = {
      text: "Text Field",
      email: "Email",
      textarea: "Text Area",
      select: "Dropdown",
      checkbox: "Checkbox Group",
      radio: "Radio Group",
      number: "Number",
      date: "Date",
      phone: "Phone Number",
      file: "File Upload",
    }

    return typeLabels[type] || "Field"
  }

  const getDefaultPlaceholderForType = (type) => {
    const placeholders = {
      text: "Enter text here",
      email: "Enter your email",
      textarea: "Enter your message here",
      select: "Select an option",
      number: "Enter a number",
      date: "",
      phone: "Enter your phone number",
      file: "",
    }

    return placeholders[type] || ""
  }

  const addTemplateFields = (template) => {
    let templateFields = []

    switch (template) {
      case "contact":
        templateFields = [
          {
            id: generateId(),
            type: "text",
            label: "Full Name",
            required: true,
            order: 0,
            data: { placeholder: "Enter your full name" },
          },
          {
            id: generateId(),
            type: "email",
            label: "Email Address",
            required: true,
            order: 1,
            data: { placeholder: "Enter your email address" },
          },
          {
            id: generateId(),
            type: "phone",
            label: "Phone Number",
            required: false,
            order: 2,
            data: { placeholder: "Enter your phone number" },
          },
          {
            id: generateId(),
            type: "textarea",
            label: "Message",
            required: true,
            order: 3,
            data: { placeholder: "Enter your message here", rows: 4 },
          },
        ]
        break
      case "feedback":
        templateFields = [
          {
            id: generateId(),
            type: "text",
            label: "Name",
            required: false,
            order: 0,
            data: { placeholder: "Enter your name" },
          },
          {
            id: generateId(),
            type: "radio",
            label: "How would you rate our service?",
            required: true,
            order: 1,
            data: { options: ["Excellent", "Good", "Average", "Poor", "Very Poor"] },
          },
          {
            id: generateId(),
            type: "textarea",
            label: "What did you like most about our service?",
            required: false,
            order: 2,
            data: { placeholder: "Tell us what you liked", rows: 3 },
          },
          {
            id: generateId(),
            type: "textarea",
            label: "How can we improve?",
            required: false,
            order: 3,
            data: { placeholder: "Share your suggestions", rows: 3 },
          },
        ]
        break
      case "event":
        templateFields = [
          {
            id: generateId(),
            type: "text",
            label: "Full Name",
            required: true,
            order: 0,
            data: { placeholder: "Enter your full name" },
          },
          {
            id: generateId(),
            type: "email",
            label: "Email Address",
            required: true,
            order: 1,
            data: { placeholder: "Enter your email address" },
          },
          {
            id: generateId(),
            type: "select",
            label: "Number of Attendees",
            required: true,
            order: 2,
            data: { options: ["1", "2", "3", "4", "5+"] },
          },
          {
            id: generateId(),
            type: "checkbox",
            label: "Dietary Restrictions",
            required: false,
            order: 3,
            data: { options: ["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "None"] },
          },
          {
            id: generateId(),
            type: "textarea",
            label: "Special Requests",
            required: false,
            order: 4,
            data: { placeholder: "Any special requests or accommodations", rows: 3 },
          },
        ]
        break
    }

    onFieldsChange(templateFields)
    setSelectedFieldIndex(null)
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="fields">
            <FileText className="h-4 w-4 mr-2" />
            Custom Fields
          </TabsTrigger>
          <TabsTrigger value="templates">
            <Sparkles className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
        </TabsList>
        <TabsContent value="fields" className="mt-4">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <Card className="border-purple-100">
                <CardContent className="p-6 space-y-4">
                  {fields.length === 0 ? (
                    <div className="text-center py-12 bg-purple-50 rounded-lg border border-purple-100">
                      <FileText className="h-12 w-12 text-purple-300 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">No fields added yet</p>
                      <Button onClick={() => setShowFieldTypes(true)} className="bg-purple-600 hover:bg-purple-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Add your first field
                      </Button>
                    </div>
                  ) : (
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext items={fields.map((field) => field.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-3">
                          {fields.map((field, index) => (
                            <SortableField
                              key={field.id}
                              field={field}
                              isSelected={selectedFieldIndex === index}
                              onClick={() => setSelectedFieldIndex(index)}
                              onRemove={() => removeField(index)}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  )}

                  {fields.length > 0 && (
                    <div className="pt-4">
                      <Button
                        onClick={() => setShowFieldTypes(true)}
                        variant="outline"
                        className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add field
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {selectedFieldIndex !== null && (
              <div className="w-full md:w-80">
                <FieldProperties
                  field={fields[selectedFieldIndex]}
                  onChange={(updatedField) => updateField(selectedFieldIndex, updatedField)}
                  onClose={() => setSelectedFieldIndex(null)}
                />
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="templates" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  className="border rounded-lg p-4 hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-colors"
                  onClick={() => addTemplateFields("contact")}
                >
                  <div className="flex items-center mb-2">
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                      <FileText className="h-4 w-4 text-purple-600" />
                    </div>
                    <h3 className="font-medium">Contact Form</h3>
                  </div>
                  <p className="text-sm text-gray-500">
                    Basic contact form with name, email, phone, and message fields.
                  </p>
                </div>

                <div
                  className="border rounded-lg p-4 hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-colors"
                  onClick={() => addTemplateFields("feedback")}
                >
                  <div className="flex items-center mb-2">
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                      <Wand2 className="h-4 w-4 text-purple-600" />
                    </div>
                    <h3 className="font-medium">Feedback Form</h3>
                  </div>
                  <p className="text-sm text-gray-500">Collect user feedback with rating and comment fields.</p>
                </div>

                <div
                  className="border rounded-lg p-4 hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-colors"
                  onClick={() => addTemplateFields("event")}
                >
                  <div className="flex items-center mb-2">
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                    </div>
                    <h3 className="font-medium">Event Registration</h3>
                  </div>
                  <p className="text-sm text-gray-500">Collect registrations for events with attendee information.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showFieldTypes && <FieldTypes onSelect={addField} onClose={() => setShowFieldTypes(false)} />}
    </div>
  )
}
