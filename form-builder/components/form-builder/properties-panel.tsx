"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus, Trash2, Settings, Palette } from "lucide-react"
import { HexColorPicker } from "react-colorful"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function PropertiesPanel({ field, onChange, onClose }) {
  const [activeTab, setActiveTab] = useState("general")
  const [options, setOptions] = useState(field.data?.options || [])

  const handleOptionChange = (index, value) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)

    // Update field data with new options
    const updatedData = { ...field.data, options: newOptions }
    onChange({ data: updatedData })
  }

  const addOption = () => {
    const newOptions = [...options, `Option ${options.length + 1}`]
    setOptions(newOptions)

    // Update field data with new options
    const updatedData = { ...field.data, options: newOptions }
    onChange({ data: updatedData })
  }

  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index)
    setOptions(newOptions)

    // Update field data with new options
    const updatedData = { ...field.data, options: newOptions }
    onChange({ data: updatedData })
  }

  const updateFieldData = (key, value) => {
    const updatedData = { ...field.data, [key]: value }
    onChange({ data: updatedData })
  }

  // Render media-specific settings
  const renderMediaSettings = () => {
    switch (field.type) {
      case "image":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={field.data?.url || ""}
                onChange={(e) => updateFieldData("url", e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageAlt">Alt Text</Label>
              <Input
                id="imageAlt"
                value={field.data?.alt || ""}
                onChange={(e) => updateFieldData("alt", e.target.value)}
                placeholder="Image description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="imageWidth">Width (px)</Label>
                <Input
                  id="imageWidth"
                  type="number"
                  value={field.data?.width || ""}
                  onChange={(e) => updateFieldData("width", e.target.value ? Number(e.target.value) : "")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageHeight">Height (px)</Label>
                <Input
                  id="imageHeight"
                  type="number"
                  value={field.data?.height || ""}
                  onChange={(e) => updateFieldData("height", e.target.value ? Number(e.target.value) : "")}
                />
              </div>
            </div>
          </div>
        )
      case "video":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="videoUrl">Video URL</Label>
              <Input
                id="videoUrl"
                value={field.data?.url || ""}
                onChange={(e) => updateFieldData("url", e.target.value)}
                placeholder="https://example.com/video.mp4"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="videoWidth">Width (px)</Label>
                <Input
                  id="videoWidth"
                  type="number"
                  value={field.data?.width || ""}
                  onChange={(e) => updateFieldData("width", e.target.value ? Number(e.target.value) : "")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="videoHeight">Height (px)</Label>
                <Input
                  id="videoHeight"
                  type="number"
                  value={field.data?.height || ""}
                  onChange={(e) => updateFieldData("height", e.target.value ? Number(e.target.value) : "")}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="videoControls" className="cursor-pointer">
                Show controls
              </Label>
              <Switch
                id="videoControls"
                checked={field.data?.controls !== false}
                onCheckedChange={(checked) => updateFieldData("controls", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="videoAutoplay" className="cursor-pointer">
                Autoplay
              </Label>
              <Switch
                id="videoAutoplay"
                checked={field.data?.autoplay || false}
                onCheckedChange={(checked) => updateFieldData("autoplay", checked)}
              />
            </div>
          </div>
        )
      case "audio":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="audioUrl">Audio URL</Label>
              <Input
                id="audioUrl"
                value={field.data?.url || ""}
                onChange={(e) => updateFieldData("url", e.target.value)}
                placeholder="https://example.com/audio.mp3"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="audioControls" className="cursor-pointer">
                Show controls
              </Label>
              <Switch
                id="audioControls"
                checked={field.data?.controls !== false}
                onCheckedChange={(checked) => updateFieldData("controls", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="audioAutoplay" className="cursor-pointer">
                Autoplay
              </Label>
              <Switch
                id="audioAutoplay"
                checked={field.data?.autoplay || false}
                onCheckedChange={(checked) => updateFieldData("autoplay", checked)}
              />
            </div>
          </div>
        )
      case "embed":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="embedCode">Embed Code</Label>
              <Textarea
                id="embedCode"
                value={field.data?.code || ""}
                onChange={(e) => updateFieldData("code", e.target.value)}
                placeholder="<iframe src='https://example.com' />"
                rows={5}
              />
              <p className="text-xs text-gray-500">Paste HTML embed code from YouTube, Vimeo, or other services.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="embedWidth">Width</Label>
                <Input
                  id="embedWidth"
                  value={field.data?.width || "100%"}
                  onChange={(e) => updateFieldData("width", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="embedHeight">Height (px)</Label>
                <Input
                  id="embedHeight"
                  type="number"
                  value={field.data?.height || ""}
                  onChange={(e) => updateFieldData("height", e.target.value ? Number(e.target.value) : "")}
                />
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-medium">Field Properties</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b">
          <TabsList className="w-full justify-start rounded-none px-4 h-12">
            <TabsTrigger
              value="general"
              className="data-[state=active]:bg-purple-50 rounded-none border-b-2 data-[state=active]:border-purple-600 data-[state=inactive]:border-transparent"
            >
              <Settings className="h-4 w-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger
              value="appearance"
              className="data-[state=active]:bg-purple-50 rounded-none border-b-2 data-[state=active]:border-purple-600 data-[state=inactive]:border-transparent"
            >
              <Palette className="h-4 w-4 mr-2" />
              Appearance
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1 p-4">
          <TabsContent value="general" className="m-0 space-y-4">
            <Accordion type="multiple" defaultValue={["basic", "options", "media"]}>
              <AccordionItem value="basic">
                <AccordionTrigger>Basic Settings</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="label">Label</Label>
                      <Input id="label" value={field.label} onChange={(e) => onChange({ label: e.target.value })} />
                    </div>

                    {field.type !== "checkbox" && field.type !== "radio" && field.type !== "file" && (
                      <div className="space-y-2">
                        <Label htmlFor="placeholder">Placeholder</Label>
                        <Input
                          id="placeholder"
                          value={field.data?.placeholder || ""}
                          onChange={(e) => updateFieldData("placeholder", e.target.value)}
                          placeholder="Enter placeholder text"
                        />
                        <p className="text-xs text-gray-500">
                          Text that appears in the field before the user enters a value
                        </p>
                      </div>
                    )}

                    {field.type === "textarea" && (
                      <div className="space-y-2">
                        <Label htmlFor="rows">Rows</Label>
                        <Input
                          id="rows"
                          type="number"
                          min="2"
                          max="10"
                          value={field.data?.rows || 3}
                          onChange={(e) => updateFieldData("rows", Number.parseInt(e.target.value))}
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <Label htmlFor="required" className="cursor-pointer">
                        Required field
                      </Label>
                      <Switch
                        id="required"
                        checked={field.required}
                        onCheckedChange={(checked) => onChange({ required: checked })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="helpText">Help Text (Optional)</Label>
                      <Textarea
                        id="helpText"
                        value={field.data?.helpText || ""}
                        placeholder="Additional information about this field"
                        onChange={(e) => updateFieldData("helpText", e.target.value)}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {(field.type === "select" || field.type === "radio" || field.type === "checkbox") && (
                <AccordionItem value="options">
                  <AccordionTrigger>Options</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-2">
                      <Label>Options</Label>
                      {options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input value={option} onChange={(e) => handleOptionChange(index, e.target.value)} />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeOption(index)}
                            disabled={options.length <= 1}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={addOption} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Option
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {(field.type === "image" ||
                field.type === "video" ||
                field.type === "audio" ||
                field.type === "embed") && (
                <AccordionItem value="media">
                  <AccordionTrigger>Media Settings</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">{renderMediaSettings()}</div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {field.type === "number" && (
                <AccordionItem value="validation">
                  <AccordionTrigger>Validation</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="min">Minimum Value</Label>
                        <Input
                          id="min"
                          type="number"
                          value={field.data?.min || ""}
                          onChange={(e) =>
                            updateFieldData("min", e.target.value ? Number.parseInt(e.target.value) : undefined)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="max">Maximum Value</Label>
                        <Input
                          id="max"
                          type="number"
                          value={field.data?.max || ""}
                          onChange={(e) =>
                            updateFieldData("max", e.target.value ? Number.parseInt(e.target.value) : undefined)
                          }
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {field.type === "file" && (
                <AccordionItem value="fileSettings">
                  <AccordionTrigger>File Settings</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-2">
                      <Label htmlFor="accept">Accepted File Types</Label>
                      <Input
                        id="accept"
                        value={field.data?.accept || ""}
                        placeholder="e.g. .pdf,.jpg,.png"
                        onChange={(e) => updateFieldData("accept", e.target.value)}
                      />
                      <p className="text-xs text-gray-500">Comma-separated list of file extensions or MIME types</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {(field.type === "heading1" ||
                field.type === "heading2" ||
                field.type === "heading3" ||
                field.type === "paragraph") && (
                <AccordionItem value="content">
                  <AccordionTrigger>Text Content</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-2">
                      <Label htmlFor="text">Text Content</Label>
                      <Textarea
                        id="text"
                        value={field.data?.text || ""}
                        placeholder="Enter text content"
                        onChange={(e) => updateFieldData("text", e.target.value)}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </TabsContent>

          <TabsContent value="appearance" className="m-0 space-y-4">
            <Accordion type="multiple" defaultValue={["width", "colors", "visibility"]}>
              <AccordionItem value="width">
                <AccordionTrigger>Field Width & Size</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="fieldWidth">Field Width</Label>
                      <Select
                        id="fieldWidth"
                        value={field.data?.width || "full"}
                        onValueChange={(value) => updateFieldData("width", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select width" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full">Full Width</SelectItem>
                          <SelectItem value="medium">Medium (75%)</SelectItem>
                          <SelectItem value="small">Small (50%)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fieldSize">Field Size</Label>
                      <Select
                        id="fieldSize"
                        value={field.data?.size || "default"}
                        onValueChange={(value) => updateFieldData("size", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="colors">
                <AccordionTrigger>Colors</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    {field.type !== "divider" &&
                      field.type !== "heading1" &&
                      field.type !== "heading2" &&
                      field.type !== "heading3" &&
                      field.type !== "paragraph" && (
                        <div className="space-y-2">
                          <Label>Field Background Color</Label>
                          <div className="flex items-center space-x-2">
                            <Popover>
                              <PopoverTrigger asChild>
                                <button
                                  className="h-8 w-8 rounded-md border border-gray-300"
                                  style={{ backgroundColor: field.data?.backgroundColor || "#ffffff" }}
                                />
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <HexColorPicker
                                  color={field.data?.backgroundColor || "#ffffff"}
                                  onChange={(color) => updateFieldData("backgroundColor", color)}
                                />
                              </PopoverContent>
                            </Popover>
                            <Input
                              value={field.data?.backgroundColor || "#ffffff"}
                              onChange={(e) => updateFieldData("backgroundColor", e.target.value)}
                              className="font-mono"
                            />
                          </div>
                        </div>
                      )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="visibility">
                <AccordionTrigger>Visibility</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="hidden" className="cursor-pointer">
                        Hide field
                      </Label>
                      <Switch
                        id="hidden"
                        checked={field.data?.hidden || false}
                        onCheckedChange={(checked) => updateFieldData("hidden", checked)}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )
}
