"use client"
import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { HexColorPicker } from "react-colorful"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function StylePanel({ styles, onStylesChange }) {
  // Initialize pageStyle if it doesn't exist
  useEffect(() => {
    if (!styles.pageStyle) {
      onStylesChange({
        ...styles,
        pageStyle: {
          backgroundColor: "#f9fafb",
          backgroundImage: "",
        },
      })
    }
  }, [styles, onStylesChange])

  const [backgroundType, setBackgroundType] = useState(() => {
    return styles.pageStyle?.backgroundImage ? "image" : "color"
  })

  const updateFormStyle = (key, value) => {
    onStylesChange({
      ...styles,
      formStyle: {
        ...styles.formStyle,
        [key]: value,
      },
    })
  }

  const updatePageStyle = (key, value) => {
    onStylesChange({
      ...styles,
      pageStyle: {
        ...styles.pageStyle,
        [key]: value,
      },
    })
  }

  const updateButtonStyle = (key, value) => {
    onStylesChange({
      ...styles,
      buttonStyle: {
        ...styles.buttonStyle,
        [key]: value,
      },
    })
  }

  const ColorPicker = ({ color, onChange, label }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center space-x-2">
        <Popover>
          <PopoverTrigger asChild>
            <button className="h-8 w-8 rounded-md border border-gray-300" style={{ backgroundColor: color }} />
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <HexColorPicker color={color} onChange={onChange} />
          </PopoverContent>
        </Popover>
        <Input value={color} onChange={(e) => onChange(e.target.value)} className="font-mono" />
      </div>
    </div>
  )

  return (
    <div className="p-4">
      <div className="mb-4">
        <Tabs defaultValue="form" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="form">Form</TabsTrigger>
            <TabsTrigger value="page">Page</TabsTrigger>
            <TabsTrigger value="button">Button</TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="mt-4 space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <ColorPicker
                  color={styles.formStyle.backgroundColor}
                  onChange={(color) => updateFormStyle("backgroundColor", color)}
                  label="Form Background Color"
                />

                <div className="space-y-2">
                  <Label>Border Radius</Label>
                  <Select
                    value={styles.formStyle.borderRadius.replace("px", "")}
                    onValueChange={(value) => updateFormStyle("borderRadius", `${value}px`)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select border radius" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">None (0px)</SelectItem>
                      <SelectItem value="4">Small (4px)</SelectItem>
                      <SelectItem value="8">Medium (8px)</SelectItem>
                      <SelectItem value="12">Large (12px)</SelectItem>
                      <SelectItem value="16">Extra Large (16px)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Padding</Label>
                  <Select
                    value={styles.formStyle.padding.replace("px", "")}
                    onValueChange={(value) => updateFormStyle("padding", `${value}px`)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select padding" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="8">Small (8px)</SelectItem>
                      <SelectItem value="16">Medium (16px)</SelectItem>
                      <SelectItem value="24">Large (24px)</SelectItem>
                      <SelectItem value="32">Extra Large (32px)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="page" className="mt-4 space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="text-sm text-gray-500 mb-4">
                  These settings control the background of the entire page where your form will be displayed.
                </div>
                <div className="space-y-2">
                  <Label>Background Type</Label>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant={backgroundType === "color" ? "default" : "outline"}
                      onClick={() => setBackgroundType("color")}
                      className="flex-1"
                    >
                      Color
                    </Button>
                    <Button
                      type="button"
                      variant={backgroundType === "image" ? "default" : "outline"}
                      onClick={() => setBackgroundType("image")}
                      className="flex-1"
                    >
                      Image
                    </Button>
                  </div>
                </div>

                {backgroundType === "color" ? (
                  <ColorPicker
                    color={styles.pageStyle?.backgroundColor || "#f9fafb"}
                    onChange={(color) => {
                      updatePageStyle("backgroundColor", color)
                      updatePageStyle("backgroundImage", "")
                    }}
                    label="Page Background Color"
                  />
                ) : (
                  <div className="space-y-2">
                    <Label>Page Background Image URL</Label>
                    <Input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={styles.pageStyle?.backgroundImage?.replace(/url$$['"](.+)['"]$$/, "$1") || ""}
                      onChange={(e) => {
                        const url = e.target.value.trim()
                        updatePageStyle("backgroundImage", url ? `url('${url}')` : "")
                      }}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      Enter a valid image URL to set as the page background
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="button" className="mt-4 space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <ColorPicker
                  color={styles.buttonStyle.backgroundColor}
                  onChange={(color) => updateButtonStyle("backgroundColor", color)}
                  label="Button Color"
                />

                <ColorPicker
                  color={styles.buttonStyle.textColor}
                  onChange={(color) => updateButtonStyle("textColor", color)}
                  label="Button Text Color"
                />

                <div className="space-y-2">
                  <Label>Button Size</Label>
                  <Select
                    value={styles.buttonStyle.size || "default"}
                    onValueChange={(value) => updateButtonStyle("size", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select button size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sm">Small</SelectItem>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="lg">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Button Border Radius</Label>
                  <Select
                    value={styles.buttonStyle.borderRadius?.replace("px", "") || "4"}
                    onValueChange={(value) => updateButtonStyle("borderRadius", `${value}px`)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select border radius" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">None (0px)</SelectItem>
                      <SelectItem value="4">Small (4px)</SelectItem>
                      <SelectItem value="8">Medium (8px)</SelectItem>
                      <SelectItem value="12">Large (12px)</SelectItem>
                      <SelectItem value="16">Rounded (16px)</SelectItem>
                      <SelectItem value="9999">Pill</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Button Width</Label>
                  <Select
                    value={styles.buttonStyle.width || "auto"}
                    onValueChange={(value) => updateButtonStyle("width", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select button width" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto</SelectItem>
                      <SelectItem value="100%">Full Width</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
