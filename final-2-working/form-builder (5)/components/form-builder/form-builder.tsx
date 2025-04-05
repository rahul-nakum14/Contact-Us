"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Trash2, Settings, GripVertical } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useFormStore } from "@/lib/form-store"
import { FieldSettings } from "./field-settings"
import { FormPreview } from "./form-preview"
import { FormSettings } from "./form-settings"
import { FormShare } from "./form-share"
import type { FieldType } from "@/lib/types"

export function FormBuilder() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("fields")
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)
  const [showFieldSettings, setShowFieldSettings] = useState(false)

  const formConfig = useFormStore((state) => state)
  const addField = useFormStore((state) => state.addField)
  const removeField = useFormStore((state) => state.removeField)
  const reorderFields = useFormStore((state) => state.reorderFields)

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const sourceIndex = result.source.index
    const destinationIndex = result.destination.index

    if (sourceIndex === destinationIndex) return

    reorderFields(sourceIndex, destinationIndex)
  }

  const handleAddField = (type: FieldType) => {
    addField({
      type,
      label: `New ${type} field`,
      placeholder: `Enter ${type}...`,
      required: false,
      options: ["select", "checkbox", "radio"].includes(type) ? ["Option 1", "Option 2", "Option 3"] : undefined,
    })

    toast({
      title: "Field added",
      description: `Added a new ${type} field to your form`,
    })
  }

  const handleRemoveField = (id: string) => {
    removeField(id)
    toast({
      title: "Field removed",
      description: "The field has been removed from your form",
    })
  }

  const handleOpenFieldSettings = (id: string) => {
    setSelectedFieldId(id)
    setShowFieldSettings(true)
  }

  const handleCloseFieldSettings = () => {
    setSelectedFieldId(null)
    setShowFieldSettings(false)
  }

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{formConfig.title || "Untitled Form"}</CardTitle>
          <p className="text-muted-foreground">{formConfig.description}</p>
        </CardHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="px-6">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="fields">Fields</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="share">Share</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="fields">
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-6">
                <Button variant="outline" size="sm" onClick={() => handleAddField("text")}>
                  Text
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleAddField("email")}>
                  Email
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleAddField("phone")}>
                  Phone
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleAddField("textarea")}>
                  Textarea
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleAddField("select")}>
                  Dropdown
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleAddField("checkbox")}>
                  Checkbox
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleAddField("radio")}>
                  Radio
                </Button>
              </div>

              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="fields">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                      {formConfig.fields.length === 0 ? (
                        <div className="border-2 border-dashed rounded-md p-8 text-center">
                          <p className="text-muted-foreground">
                            Your form has no fields. Click the buttons above to add fields.
                          </p>
                        </div>
                      ) : (
                        formConfig.fields.map((field, index) => (
                          <Draggable key={field.id} draggableId={field.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`border rounded-md p-4 bg-card ${snapshot.isDragging ? "shadow-lg" : ""}`}
                              >
                                <div className="flex items-center gap-3">
                                  <div {...provided.dragHandleProps} className="cursor-move text-muted-foreground">
                                    <GripVertical size={20} />
                                  </div>

                                  <div className="flex-1">
                                    <p className="font-medium">{field.label}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {field.type} {field.required ? "(required)" : "(optional)"}
                                    </p>
                                  </div>

                                  <div className="flex gap-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleOpenFieldSettings(field.id)}
                                    >
                                      <Settings size={16} />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleRemoveField(field.id)}
                                      className="text-destructive"
                                    >
                                      <Trash2 size={16} />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </CardContent>
          </TabsContent>

          <TabsContent value="settings">
            <CardContent>
              <FormSettings />
            </CardContent>
          </TabsContent>

          <TabsContent value="preview">
            <CardContent>
              <FormPreview />
            </CardContent>
          </TabsContent>

          <TabsContent value="share">
            <CardContent>
              <FormShare />
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>

      {showFieldSettings && selectedFieldId && (
        <FieldSettings fieldId={selectedFieldId} onClose={handleCloseFieldSettings} />
      )}
    </div>
  )
}

