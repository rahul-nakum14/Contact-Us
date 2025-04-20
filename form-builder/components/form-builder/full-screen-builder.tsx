"use client"

import { useState, useRef, useEffect } from "react"
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
import { restrictToVerticalAxis, restrictToWindowEdges } from "@dnd-kit/modifiers"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

import ComponentCategory from "@/components/form-builder/component-category"
import FormCanvas from "@/components/form-builder/form-canvas"
import StylePanel from "@/components/form-builder/style-panel"
import SettingsPanel from "@/components/form-builder/settings-panel"
import PropertiesPanel from "@/components/form-builder/properties-panel"
import { basicFields, layoutComponents, mediaComponents } from "@/components/form-builder/field-definitions"

export default function FullScreenFormBuilder({ formData, onFieldsChange, onStylesChange, onSettingsChange }) {
  const [activeTab, setActiveTab] = useState("components")
  const [selectedField, setSelectedField] = useState(null)
  const [activeComponent, setActiveComponent] = useState(null)
  const [dropIndicator, setDropIndicator] = useState({ show: false, index: 0 })
  const canvasRef = useRef(null)

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

  // Clear selected field when fields change
  useEffect(() => {
    if (selectedField) {
      const fieldExists = formData.fields.find((field) => field.id === selectedField.id)
      if (!fieldExists) {
        setSelectedField(null)
      }
    }
  }, [formData.fields, selectedField])

  const handleDragStart = (event) => {
    const { active } = event
    const activeId = active.id

    if (activeId.startsWith("palette-")) {
      setActiveComponent(active.data.current.component)
    } else {
      const draggedField = formData.fields.find((field) => field.id === activeId)
      setActiveComponent(draggedField)
    }
  }

  const handleDragOver = (event) => {
    const { over } = event

    if (!over || !canvasRef.current) {
      setDropIndicator({ show: false, index: 0 })
      return
    }

    const canvasRect = canvasRef.current.getBoundingClientRect()
    const mouseY = event.activatorEvent.clientY - canvasRect.top
    const totalHeight = canvasRect.height

    // Calculate the index based on the mouse position
    const index = Math.max(
      0,
      Math.min(Math.floor((mouseY / totalHeight) * formData.fields.length), formData.fields.length),
    )

    setDropIndicator({ show: true, index })
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    setActiveComponent(null)
    setDropIndicator({ show: false, index: 0 })

    if (!over) return

    const activeId = active.id

    // If dragging from palette, add a new field
    if (activeId.startsWith("palette-")) {
      const componentType = activeId.replace("palette-", "")
      addField(componentType, dropIndicator.index)
      return
    }

    // If reordering existing fields
    const oldIndex = formData.fields.findIndex((field) => field.id === activeId)
    const newIndex = dropIndicator.index

    if (oldIndex !== newIndex) {
      const newFields = arrayMove(formData.fields, oldIndex, newIndex)
      onFieldsChange(newFields)
    }
  }

  const handleDragCancel = () => {
    setActiveComponent(null)
    setDropIndicator({ show: false, index: 0 })
  }

  const addField = (fieldType, index = formData.fields.length) => {
    // Find the field definition
    const allFieldTypes = [...basicFields, ...layoutComponents, ...mediaComponents]
    const fieldDef = allFieldTypes.find((field) => field.id === fieldType)

    if (!fieldDef) return

    // Create a new field
    const newField = {
      id: uuidv4(),
      type: fieldType,
      label: fieldDef.name,
      required: false,
      data: {
        ...(fieldDef.defaultData || {}),
        placeholder: fieldDef.defaultPlaceholder,
        options: fieldDef.defaultOptions,
      },
    }

    // Add the field to the form
    const newFields = [...formData.fields]
    newFields.splice(index, 0, newField)
    onFieldsChange(newFields)

    // Select the new field
    setSelectedField(newField)
    setActiveTab("properties")
  }

  const updateField = (fieldId, updates) => {
    const newFields = formData.fields.map((field) => {
      if (field.id === fieldId) {
        return { ...field, ...updates }
      }
      return field
    })
    onFieldsChange(newFields)

    // Update selected field if it's the one being updated
    if (selectedField && selectedField.id === fieldId) {
      setSelectedField({ ...selectedField, ...updates })
    }
  }

  const removeField = (fieldId) => {
    const newFields = formData.fields.filter((field) => field.id !== fieldId)
    onFieldsChange(newFields)

    // Deselect field if it's the one being removed
    if (selectedField && selectedField.id === fieldId) {
      setSelectedField(null)
    }
  }

  const duplicateField = (fieldId) => {
    const fieldToDuplicate = formData.fields.find((field) => field.id === fieldId)
    if (!fieldToDuplicate) return

    const newField = {
      ...fieldToDuplicate,
      id: uuidv4(),
      label: `${fieldToDuplicate.label} (Copy)`,
    }

    const fieldIndex = formData.fields.findIndex((field) => field.id === fieldId)
    const newFields = [...formData.fields]
    newFields.splice(fieldIndex + 1, 0, newField)
    onFieldsChange(newFields)
  }

  const handleFormTitleChange = (e) => {
    const newFormData = { ...formData, title: e.target.value }
    onSettingsChange({ ...formData.settings })
  }

  const handleFormDescriptionChange = (e) => {
    const newFormData = { ...formData, description: e.target.value }
    onSettingsChange({ ...formData.settings })
  }

  const clearCanvas = () => {
    if (confirm("Are you sure you want to clear all fields? This cannot be undone.")) {
      onFieldsChange([])
      setSelectedField(null)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
    >
      <div className="flex h-full">
        {/* Left Sidebar */}
        <div className="w-72 bg-white border-r flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="border-b">
              <TabsList className="w-full justify-start rounded-none px-4 h-12">
                <TabsTrigger value="components" className="data-[state=active]:bg-purple-50">
                  Components
                </TabsTrigger>
                <TabsTrigger value="styles" className="data-[state=active]:bg-purple-50">
                  Styles
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-purple-50">
                  Settings
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="components" className="flex-1 p-0 m-0">
              <div className="p-4 border-b">
                <Button onClick={() => addField("text")} className="w-full bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" /> Add Field
                </Button>
              </div>
              <ScrollArea className="h-[calc(100vh-8.5rem)]">
                <div className="p-4 space-y-6">
                  <ComponentCategory
                    title="Basic Fields"
                    components={basicFields}
                    color="bg-blue-50"
                    textColor="text-blue-600"
                    onAddComponent={addField}
                  />

                  <Separator />

                  <ComponentCategory
                    title="Layout"
                    components={layoutComponents}
                    color="bg-amber-50"
                    textColor="text-amber-600"
                    onAddComponent={addField}
                  />

                  <Separator />

                  <ComponentCategory
                    title="Media"
                    components={mediaComponents}
                    color="bg-emerald-50"
                    textColor="text-emerald-600"
                    onAddComponent={addField}
                  />
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="styles" className="flex-1 p-0 m-0">
              <ScrollArea className="h-[calc(100vh-4rem)]">
                <div className="p-4">
                  <StylePanel styles={formData.styles} onStylesChange={onStylesChange} />
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="settings" className="flex-1 p-0 m-0">
              <ScrollArea className="h-[calc(100vh-4rem)]">
                <div className="p-4">
                  <SettingsPanel settings={formData.settings} onSettingsChange={onSettingsChange} />
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="properties" className="flex-1 p-0 m-0">
              {selectedField ? (
                <PropertiesPanel
                  field={selectedField}
                  onChange={(updates) => updateField(selectedField.id, updates)}
                  onClose={() => {
                    setSelectedField(null)
                    setActiveTab("components")
                  }}
                />
              ) : (
                <div className="p-4 text-center text-gray-500">
                  <p>Select a field to edit its properties</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-full">
          <div className="p-3 border-b bg-white flex items-center justify-between">
            <div className="space-y-2 max-w-2xl w-full">
              <Input
                value={formData.title}
                onChange={handleFormTitleChange}
                placeholder="Form Title"
                className="text-lg font-medium border-transparent focus-visible:border-input bg-transparent px-0"
              />
              <Textarea
                value={formData.description}
                onChange={handleFormDescriptionChange}
                placeholder="Form Description (optional)"
                className="resize-none border-transparent focus-visible:border-input bg-transparent px-0"
                rows={1}
              />
            </div>

            <div className="flex items-center gap-2">
              {formData.fields.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearCanvas}
                  className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear All
                </Button>
              )}
            </div>
          </div>

          <ScrollArea className="flex-1">
            <SortableContext items={formData.fields.map((field) => field.id)} strategy={verticalListSortingStrategy}>
              <FormCanvas
                ref={canvasRef}
                formData={formData}
                selectedField={selectedField}
                onSelectField={(field) => {
                  setSelectedField(field)
                  setActiveTab("properties")
                }}
                onUpdateField={updateField}
                onRemoveField={removeField}
                onDuplicateField={duplicateField}
                dropIndicator={dropIndicator}
              />
            </SortableContext>
          </ScrollArea>
        </div>

        {/* Right Properties Panel */}
        {selectedField && (
          <div className="w-80 bg-white border-l h-full overflow-hidden">
            <PropertiesPanel
              field={selectedField}
              onChange={(updates) => updateField(selectedField.id, updates)}
              onClose={() => setSelectedField(null)}
            />
          </div>
        )}
      </div>

      <DragOverlay>
        {activeComponent && (
          <div className="bg-white border rounded-md p-4 shadow-md opacity-80 w-64">
            <div className="font-medium">{activeComponent.name || activeComponent.label}</div>
            <div className="text-xs text-gray-500">{activeComponent.description || activeComponent.type}</div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
