"use client"

import { useState } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FormDesigner } from "@/components/form-designer"
import { FormPreview } from "@/components/form-preview"
import { FormSettings } from "@/components/form-settings"
import { FormShare } from "@/components/form-share"
import { useFormBuilderStore } from "@/lib/store"
import { Toaster } from "@/components/ui/toaster"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function FormBuilder() {
  const [activeTab, setActiveTab] = useState("design")
  const { formTitle, formDescription, resetForm } = useFormBuilderStore()
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const { toast } = useToast()

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  // Handle form reset
  const handleResetForm = () => {
    if (showResetConfirm) {
      resetForm()
      setShowResetConfirm(false)
      toast({
        title: "Form reset",
        description: "Your form has been reset to default settings",
      })
    } else {
      setShowResetConfirm(true)
      // Auto-hide the confirmation after 5 seconds
      setTimeout(() => {
        setShowResetConfirm(false)
      }, 5000)
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="bg-card rounded-lg border shadow-sm">
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold">{formTitle || "Untitled Form"}</h2>
            {formDescription && <p className="text-muted-foreground mt-1">{formDescription}</p>}
          </div>
          <div>
            {showResetConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Are you sure?</span>
                <Button variant="destructive" size="sm" onClick={handleResetForm}>
                  Yes, Reset
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowResetConfirm(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={handleResetForm} className="flex items-center gap-1">
                <Trash2 size={14} />
                Reset Form
              </Button>
            )}
          </div>
        </div>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="px-6 pt-4">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="share">Share</TabsTrigger>
            </TabsList>
          </div>
          <div className="p-6">
            <TabsContent value="design" className="mt-0">
              <FormDesigner />
            </TabsContent>
            <TabsContent value="settings" className="mt-0">
              <FormSettings />
            </TabsContent>
            <TabsContent value="preview" className="mt-0">
              <FormPreview />
            </TabsContent>
            <TabsContent value="share" className="mt-0">
              <FormShare />
            </TabsContent>
          </div>
        </Tabs>
      </div>
      <Toaster />
    </DndProvider>
  )
}

