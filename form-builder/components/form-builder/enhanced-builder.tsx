"use client"

import { useState, useRef } from "react"
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { generateId } from "@/lib/utils"
import SortableField from "./fields/sortable-field"
import FieldProperties from "./field-properties"
import ComponentPalette from "./component-palette"
import { basicFields, advancedFields, layoutComponents, mediaComponents } from "./field-definitions"

export default function EnhancedBuilder({ fields, onFieldsChange }) {
  const [selectedFieldIndex, setSelectedFieldIndex] = useState(null)
  const [activeId, setActiveId] = useState(null)
  const [activeTab, setActiveTab] = useState("basic")
  const [draggedItem, setDraggedItem] = useState(null)
  const dropAreaRef = useRef(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragStart = (event) => {
    const { active } = event
    setActiveId(active.id)

    // Check if this is a new component being dragged from palette
    if (typeof active.id === "string" && active.id.startsWith("palette-")) {
      const componentType = active.id.replace("palette-", "")
      const allComponents = [...basicFields, ...advancedFields, ...layoutComponents, ...mediaComponents]
      const component = allComponents.find((c) => c.id === componentType)
      if (component) {
        setDraggedItem(component)
      }
    } else {
      // It's an existing field being reordered
      const draggedFieldIndex = fields.findIndex((field) => field.id === active.id)
      if (draggedFieldIndex !== -1) {
        setDraggedItem(fields[draggedFieldIndex])
      }
    }
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    setActiveId(null)
    setDraggedItem(null)

    if (!over) return

    // If dragging from palette to form area
    if (typeof active.id === "string" && active.id.startsWith("palette-")) {
      const componentType = active.id.replace("palette-", "")
      addField(componentType)
      return
    }

    // If reordering existing fields
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
    // Find the component definition
    const allComponents = [...basicFields, ...advancedFields, ...layoutComponents, ...mediaComponents]
    const componentDef = allComponents.find((c) => c.id === type)

    if (!componentDef) return

    const newField = {
      id: generateId(),
      type,
      label: componentDef.label || `New ${componentDef.name}`,
      required: false,
      order: fields.length,
      data: {
        placeholder: componentDef.defaultPlaceholder || "",
        options: componentDef.defaultOptions || undefined,
        rows: componentDef.type === "textarea" ? 3 : undefined,
        columns: componentDef.type === "columns" ? 2 : undefined,
        ...componentDef.defaultData,
      },
    }

    const newFields = [...fields, newField]
    onFieldsChange(newFields)
    setSelectedFieldIndex(newFields.length - 1)
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

  const duplicateField = (index) => {
    const fieldToDuplicate = fields[index]
    const newField = {
      ...fieldToDuplicate,
      id: generateId(),
      label: `${fieldToDuplicate.label} (Copy)`,
      order: fields.length,
    }

    const newFields = [...fields.slice(0, index + 1), newField, ...fields.slice(index + 1)]

    // Update order property for each field
    const updatedFields = newFields.map((field, i) => ({
      ...field,
      order: i,
    }))

    onFieldsChange(updatedFields)
    setSelectedFieldIndex(index + 1)
  }

  return (
    <div className="grid grid-cols-12 gap-6 h-[calc(100vh-240px)] min-h-[500px]">
      {/* Component Palette */}
      <div className="col-span-3 bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="font-medium text-gray-800">Components</h3>
          <p className="text-xs text-gray-500">Drag components to the form area</p>
        </div>

        <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-2 pt-2">
            <TabsList className="grid grid-cols-4 h-9">
              <TabsTrigger value="basic" className="text-xs">
                Basic
              </TabsTrigger>
              <TabsTrigger value="advanced" className="text-xs">
                Advanced
              </TabsTrigger>
              <TabsTrigger value="layout" className="text-xs">
                Layout
              </TabsTrigger>
              <TabsTrigger value="media" className="text-xs">
                Media
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-[calc(100%-60px)]">
            <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
              <TabsContent value="basic" className="m-0 p-3">
                <ComponentPalette components={basicFields} />
              </TabsContent>

              <TabsContent value="advanced" className="m-0 p-3">
                <ComponentPalette components={advancedFields} />
              </TabsContent>

              <TabsContent value="layout" className="m-0 p-3">
                <ComponentPalette components={layoutComponents} />
              </TabsContent>

              <TabsContent value="media" className="m-0 p-3">
                <ComponentPalette components={mediaComponents} />
              </TabsContent>

              <DragOverlay>
                {draggedItem && (
                  <div className="bg-white border border-purple-300 rounded-md p-3 shadow-md w-64 opacity-80">
                    <div className="flex items-center gap-2">
                      {draggedItem.icon && <draggedItem.icon className="h-4 w-4 text-purple-600" />}
                      <span>{draggedItem.name || draggedItem.label}</span>
                    </div>
                  </div>
                )}
              </DragOverlay>
            </DndContext>
          </ScrollArea>
        </Tabs>
      </div>

      {/* Form Building Area */}
      <div className="col-span-6 flex flex-col">
        <Card className="flex-1 border-purple-100 overflow-hidden flex flex-col">
          <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-800">Form Builder</h3>
              <p className="text-xs text-gray-500">Drag, drop, and arrange your form fields</p>
            </div>
            {fields.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onFieldsChange([])}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              >
                Clear All
              </Button>
            )}
          </div>

          <ScrollArea className="flex-1 p-4" ref={dropAreaRef}>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              {fields.length === 0 ? (
                <div className="h-full min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                  <div className="h-16 w-16 bg-purple-50 rounded-full flex items-center justify-center mb-4">
                    <svg className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No fields added yet</h3>
                  <p className="text-gray-500 mb-4 max-w-md">
                    Drag components from the left panel to start building your form, or choose a template to get started
                    quickly.
                  </p>
                  <div className="flex gap-2">
                    <Button onClick={() => addField("text")} className="bg-purple-600 hover:bg-purple-700">
                      Add Text Field
                    </Button>
                    <Button variant="outline" onClick={() => setActiveTab("basic")}>
                      Browse Components
                    </Button>
                  </div>
                </div>
              ) : (
                <SortableContext items={fields.map((field) => field.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-3">
                    {fields.map((field, index) => (
                      <SortableField
                        key={field.id}
                        field={field}
                        isSelected={selectedFieldIndex === index}
                        onClick={() => setSelectedFieldIndex(index)}
                        onRemove={() => removeField(index)}
                        onDuplicate={() => duplicateField(index)}
                      />
                    ))}
                  </div>
                </SortableContext>
              )}

              <DragOverlay>
                {draggedItem && (
                  <div className="bg-white border border-purple-300 rounded-md p-3 shadow-md w-full opacity-80">
                    <div className="flex items-center gap-2">
                      {draggedItem.icon && <draggedItem.icon className="h-4 w-4 text-purple-600" />}
                      <span>{draggedItem.name || draggedItem.label}</span>
                    </div>
                  </div>
                )}
              </DragOverlay>
            </DndContext>
          </ScrollArea>
        </Card>
      </div>

      {/* Properties Panel */}
      <div className="col-span-3">
        {selectedFieldIndex !== null ? (
          <FieldProperties
            field={fields[selectedFieldIndex]}
            onChange={(updatedField) => updateField(selectedFieldIndex, updatedField)}
            onClose={() => setSelectedFieldIndex(null)}
          />
        ) : (
          <Card className="h-full border-gray-200">
            <CardContent className="p-6 flex flex-col items-center justify-center h-full text-center">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Field Selected</h3>
              <p className="text-gray-500 mb-4">
                Select a field from your form to edit its properties, or drag a new component from the left panel.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
