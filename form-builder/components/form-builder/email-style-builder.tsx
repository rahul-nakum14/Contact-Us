"use client"

import { useState, useRef } from "react"
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor, closestCenter } from "@dnd-kit/core"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, ChevronRight, Palette, Settings, Layers, Plus, Trash2 } from "lucide-react"
import { generateId } from "@/lib/utils"
import { cn } from "@/lib/utils"
import ComponentCategory from "./component-category"
import FormCanvas from "./form-canvas"
import StylePanel from "./style-panel"
import SettingsPanel from "./settings-panel"
import PropertiesPanel from "./properties-panel"
import { basicFields, advancedFields, layoutComponents, mediaComponents } from "./field-definitions"

export default function EmailStyleFormBuilder({ formData, onFieldsChange, onStylesChange, onSettingsChange }) {
  const [activeTab, setActiveTab] = useState("components")
  const [selectedField, setSelectedField] = useState(null)
  const [activeId, setActiveId] = useState(null)
  const [draggedItem, setDraggedItem] = useState(null)
  const [dropIndicator, setDropIndicator] = useState({ show: false, index: -1 })
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const canvasRef = useRef(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
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
      <div className="flex h-full">
        {/* Left Sidebar */}
        <div
          className={cn(
            "bg-white border-r transition-all duration-300 flex flex-col",
            sidebarCollapsed ? "w-12" : "w-72",
          )}
        >
          <div className="border-b p-2 flex justify-between items-center">
            <h3 className={cn("font-medium text-sm", sidebarCollapsed && "hidden")}>Form Builder</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="h-8 w-8"
            >
              {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>

          {!sidebarCollapsed ? (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <div className="border-b">
                <TabsList className="w-full justify-start rounded-none px-2 h-12">
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
                    <ComponentCategory
                      title="Basic Fields"
                      components={basicFields}
                      color="bg-blue-100"
                      textColor="text-blue-600"
                      onAddComponent={(type) => addField(type)}
                    />

                    <Separator className="my-4" />

                    <ComponentCategory
                      title="Advanced Fields"
                      components={advancedFields}
                      color="bg-purple-100"
                      textColor="text-purple-600"
                      onAddComponent={(type) => addField(type)}
                    />

                    <Separator className="my-4" />

                    <ComponentCategory
                      title="Layout"
                      components={layoutComponents}
                      color="bg-green-100"
                      textColor="text-green-600"
                      onAddComponent={(type) => addField(type)}
                    />

                    <Separator className="my-4" />

                    <ComponentCategory
                      title="Media"
                      components={mediaComponents}
                      color="bg-amber-100"
                      textColor="text-amber-600"
                      onAddComponent={(type) => addField(type)}
                    />
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
          ) : (
            <div className="flex flex-col items-center py-4 space-y-4">
              <Button
                variant={activeTab === "components" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setActiveTab("components")}
                className="h-8 w-8"
              >
                <Layers className="h-4 w-4" />
              </Button>
              <Button
                variant={activeTab === "styles" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setActiveTab("styles")}
                className="h-8 w-8"
              >
                <Palette className="h-4 w-4" />
              </Button>
              <Button
                variant={activeTab === "settings" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setActiveTab("settings")}
                className="h-8 w-8"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Main Canvas */}
        <div className="flex-1 flex flex-col h-full">
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

          <div className="flex-1 overflow-auto">
            <FormCanvas
              ref={canvasRef}
              formData={formData}
              selectedField={selectedField}
              onSelectField={setSelectedField}
              onUpdateField={updateField}
              onRemoveField={removeField}
              onDuplicateField={duplicateField}
              dropIndicator={dropIndicator}
            />
          </div>
        </div>

        {/* Right Properties Panel */}
        {selectedField && (
          <div className="w-80 bg-white border-l h-full">
            <PropertiesPanel
              field={selectedField}
              onChange={(updates) => updateField(selectedField.id, updates)}
              onClose={() => setSelectedField(null)}
            />
          </div>
        )}
      </div>

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
