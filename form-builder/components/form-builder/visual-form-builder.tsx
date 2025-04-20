"use client"

import { useState, useRef, useEffect } from "react"
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
} from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Palette, Settings, Layers, Plus, Trash2 } from "lucide-react"
import { generateId } from "@/lib/utils"
import ComponentPalette from "./component-palette"
import FormCanvas from "./form-canvas"
import StylePanel from "./style-panel"
import SettingsPanel from "./settings-panel"
import PropertiesPanel from "./properties-panel"
import { basicFields, advancedFields, layoutComponents, mediaComponents } from "./field-definitions"

export default function VisualFormBuilder({
  formData,
  onFieldsChange,
  onStylesChange,
  onSettingsChange,
  previewMode,
  devicePreview,
}) {
  const [activeTab, setActiveTab] = useState("components")
  const [selectedField, setSelectedField] = useState(null)
  const [activeId, setActiveId] = useState(null)
  const [draggedItem, setDraggedItem] = useState(null)
  const [dropIndicator, setDropIndicator] = useState({ show: false, index: -1 })
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

  // Clear selected field when switching to preview mode
  useEffect(() => {
    if (previewMode) {
      setSelectedField(null)
    }
  }, [previewMode])

  const handleDragStart = (event) => {
    const { active } = event
    setActiveId(active.id)

    // Check if this is a new component being dragged from palette
    if (typeof active.id === "string" && active.id.startsWith("palette-")) {
      const componentType = active.id.replace("palette-", "")
      const allComponents = [...basicFields, ...advancedFields, ...layoutComponents, ...mediaComponents]
      const component = allComponents.find((c) => c.id === componentType)
      if (component) {
        setDraggedItem({
          ...component,
          id: `temp-${generateId()}`,
        })
      }
    } else {
      // It's an existing field being reordered
      const draggedFieldIndex = formData.fields.findIndex((field) => field.id === active.id)
      if (draggedFieldIndex !== -1) {
        setDraggedItem(formData.fields[draggedFieldIndex])
      }
    }
  }

  const handleDragOver = (event) => {
    const { active, over } = event

    if (!over || !canvasRef.current) return

    // Only show drop indicator when dragging over the canvas
    if (over.id === "form-canvas") {
      const canvasRect = canvasRef.current.getBoundingClientRect()
      const mouseY = event.activatorEvent.clientY - canvasRect.top

      // Calculate which index to insert at based on mouse position
      const fields = formData.fields
      let insertIndex = fields.length

      if (fields.length > 0) {
        // Find the field elements in the canvas
        const fieldElements = canvasRef.current.querySelectorAll("[data-field-id]")

        for (let i = 0; i < fieldElements.length; i++) {
          const fieldRect = fieldElements[i].getBoundingClientRect()
          const fieldMiddle = fieldRect.top + fieldRect.height / 2 - canvasRect.top

          if (mouseY < fieldMiddle) {
            insertIndex = i
            break
          }
        }
      }

      setDropIndicator({ show: true, index: insertIndex })
    } else {
      setDropIndicator({ show: false, index: -1 })
    }
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    setActiveId(null)
    setDraggedItem(null)
    setDropIndicator({ show: false, index: -1 })

    if (!over) return

    // If dropping on the canvas
    if (over.id === "form-canvas") {
      // If dragging from palette to form area
      if (typeof active.id === "string" && active.id.startsWith("palette-")) {
        const componentType = active.id.replace("palette-", "")
        addField(componentType, dropIndicator.index)
        return
      }

      // If reordering existing fields
      const oldIndex = formData.fields.findIndex((field) => field.id === active.id)
      if (oldIndex !== -1) {
        const newFields = [...formData.fields]
        const [movedField] = newFields.splice(oldIndex, 1)

        // Insert at the drop indicator position
        const newIndex = dropIndicator.index > oldIndex ? dropIndicator.index - 1 : dropIndicator.index
        newFields.splice(newIndex, 0, movedField)

        onFieldsChange(newFields)

        if (selectedField && selectedField.id === active.id) {
          setSelectedField(movedField)
        }
      }
    }
  }

  const addField = (type, index = formData.fields.length) => {
    // Find the component definition
    const allComponents = [...basicFields, ...advancedFields, ...layoutComponents, ...mediaComponents]
    const componentDef = allComponents.find((c) => c.id === type)

    if (!componentDef) return

    const newField = {
      id: generateId(),
      type,
      label: componentDef.label || `New ${componentDef.name}`,
      required: false,
      data: {
        placeholder: componentDef.defaultPlaceholder || "",
        options: componentDef.defaultOptions || undefined,
        rows: componentDef.type === "textarea" ? 3 : undefined,
        columns: componentDef.type === "columns" ? 2 : undefined,
        ...componentDef.defaultData,
      },
    }

    const newFields = [...formData.fields]
    newFields.splice(index, 0, newField)

    onFieldsChange(newFields)
    setSelectedField(newField)
  }

  const updateField = (fieldId, updates) => {
    const fieldIndex = formData.fields.findIndex((field) => field.id === fieldId)
    if (fieldIndex === -1) return

    const updatedFields = [...formData.fields]
    updatedFields[fieldIndex] = {
      ...updatedFields[fieldIndex],
      ...updates,
    }

    onFieldsChange(updatedFields)

    if (selectedField && selectedField.id === fieldId) {
      setSelectedField(updatedFields[fieldIndex])
    }
  }

  const removeField = (fieldId) => {
    const newFields = formData.fields.filter((field) => field.id !== fieldId)
    onFieldsChange(newFields)

    if (selectedField && selectedField.id === fieldId) {
      setSelectedField(null)
    }
  }

  const duplicateField = (fieldId) => {
    const fieldToDuplicate = formData.fields.find((field) => field.id === fieldId)
    if (!fieldToDuplicate) return

    const fieldIndex = formData.fields.findIndex((field) => field.id === fieldId)

    const newField = {
      ...fieldToDuplicate,
      id: generateId(),
      label: `${fieldToDuplicate.label} (Copy)`,
    }

    const newFields = [...formData.fields]
    newFields.splice(fieldIndex + 1, 0, newField)

    onFieldsChange(newFields)
    setSelectedField(newField)
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
    >
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* Left Sidebar - Component Palette */}
        {!previewMode && (
          <>
            <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="bg-white border-r">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                <div className="border-b">
                  <TabsList className="w-full justify-start rounded-none border-b px-2 h-12">
                    <TabsTrigger
                      value="components"
                      className="data-[state=active]:bg-purple-50 rounded-none border-b-2 data-[state=active]:border-purple-600 data-[state=inactive]:border-transparent"
                    >
                      <Layers className="h-4 w-4 mr-2" />
                      Components
                    </TabsTrigger>
                    <TabsTrigger
                      value="styles"
                      className="data-[state=active]:bg-purple-50 rounded-none border-b-2 data-[state=active]:border-purple-600 data-[state=inactive]:border-transparent"
                    >
                      <Palette className="h-4 w-4 mr-2" />
                      Styles
                    </TabsTrigger>
                    <TabsTrigger
                      value="settings"
                      className="data-[state=active]:bg-purple-50 rounded-none border-b-2 data-[state=active]:border-purple-600 data-[state=inactive]:border-transparent"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="components" className="flex-1 p-0 m-0 overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="p-4">
                      <div className="mb-4">
                        <h3 className="text-sm font-medium mb-2">Basic Fields</h3>
                        <ComponentPalette components={basicFields} />
                      </div>

                      <Separator className="my-4" />

                      <div className="mb-4">
                        <h3 className="text-sm font-medium mb-2">Advanced Fields</h3>
                        <ComponentPalette components={advancedFields} />
                      </div>

                      <Separator className="my-4" />

                      <div className="mb-4">
                        <h3 className="text-sm font-medium mb-2">Layout</h3>
                        <ComponentPalette components={layoutComponents} />
                      </div>

                      <Separator className="my-4" />

                      <div className="mb-4">
                        <h3 className="text-sm font-medium mb-2">Media</h3>
                        <ComponentPalette components={mediaComponents} />
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="styles" className="flex-1 p-0 m-0 overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="p-4">
                      <StylePanel styles={formData.styles} onStylesChange={onStylesChange} />
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="settings" className="flex-1 p-0 m-0 overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="p-4">
                      <SettingsPanel settings={formData.settings} onSettingsChange={onSettingsChange} />
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </ResizablePanel>

            <ResizableHandle withHandle />
          </>
        )}

        {/* Main Canvas */}
        <ResizablePanel defaultSize={previewMode ? 100 : 55} className="bg-gray-100 overflow-hidden">
          <div className="h-full flex flex-col">
            {!previewMode && (
              <div className="bg-white border-b p-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => addField("text")} className="gap-1">
                    <Plus className="h-3.5 w-3.5" />
                    Add Field
                  </Button>

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

                <div className="text-sm text-gray-500">
                  {formData.fields.length} {formData.fields.length === 1 ? "field" : "fields"}
                </div>
              </div>
            )}

            <div className="flex-1 overflow-auto">
              <FormCanvas
                ref={canvasRef}
                formData={formData}
                selectedField={selectedField}
                onSelectField={setSelectedField}
                onUpdateField={updateField}
                onRemoveField={removeField}
                onDuplicateField={duplicateField}
                previewMode={previewMode}
                devicePreview={devicePreview}
                dropIndicator={dropIndicator}
              />
            </div>
          </div>
        </ResizablePanel>

        {/* Right Sidebar - Properties Panel */}
        {!previewMode && selectedField && (
          <>
            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={25} minSize={20} maxSize={40} className="bg-white border-l">
              <PropertiesPanel
                field={selectedField}
                onChange={(updates) => updateField(selectedField.id, updates)}
                onClose={() => setSelectedField(null)}
              />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>

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
  )
}
