"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { HexColorPicker } from "react-colorful"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Check, Copy, Palette, Wand2 } from "lucide-react"

export default function StyleEditor({ styles, onStylesChange }) {
  const [activeTab, setActiveTab] = useState("form")
  const [copiedColor, setCopiedColor] = useState(null)

  // Predefined color palettes
  const colorPalettes = [
    {
      name: "Purple Dream",
      primary: "#7c3aed",
      secondary: "#a78bfa",
      background: "#f5f3ff",
      text: "#1f2937",
    },
    {
      name: "Ocean Blue",
      primary: "#2563eb",
      secondary: "#60a5fa",
      background: "#eff6ff",
      text: "#1f2937",
    },
    {
      name: "Forest Green",
      primary: "#059669",
      secondary: "#34d399",
      background: "#ecfdf5",
      text: "#1f2937",
    },
    {
      name: "Sunset Orange",
      primary: "#dc2626",
      secondary: "#f87171",
      background: "#fef2f2",
      text: "#1f2937",
    },
    {
      name: "Dark Mode",
      primary: "#8b5cf6",
      secondary: "#c4b5fd",
      background: "#1f2937",
      text: "#f9fafb",
    },
  ]

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

  const applyColorPalette = (palette) => {
    onStylesChange({
      ...styles,
      formStyle: {
        ...styles.formStyle,
        backgroundColor: "#ffffff",
      },
      pageStyle: {
        ...styles.pageStyle,
        backgroundColor: palette.background,
      },
      buttonStyle: {
        ...styles.buttonStyle,
        backgroundColor: palette.primary,
        textColor: "#ffffff",
      },
    })
  }

  const copyColorToClipboard = (color) => {
    navigator.clipboard.writeText(color)
    setCopiedColor(color)
    setTimeout(() => setCopiedColor(null), 2000)
  }

  const ColorPicker = ({ color, onChange, label }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <button
          type="button"
          className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
          onClick={() => copyColorToClipboard(color)}
        >
          {copiedColor === color ? (
            <>
              <Check className="h-3 w-3 mr-1" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </>
          )}
        </button>
      </div>
      <div className="flex items-center space-x-2">
        <Popover>
          <PopoverTrigger asChild>
            <button className="h-10 w-10 rounded-md border border-gray-300" style={{ backgroundColor: color }} />
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
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Style Editor</CardTitle>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Palette className="h-4 w-4" />
                <span>Color Palettes</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Apply Color Palette</h4>
                <div className="grid grid-cols-2 gap-2">
                  {colorPalettes.map((palette) => (
                    <button
                      key={palette.name}
                      className="p-2 border rounded-md hover:bg-gray-50 text-left"
                      onClick={() => applyColorPalette(palette)}
                    >
                      <div className="text-sm font-medium mb-1">{palette.name}</div>
                      <div className="flex space-x-1">
                        <div className="h-4 w-4 rounded-full" style={{ backgroundColor: palette.primary }}></div>
                        <div className="h-4 w-4 rounded-full" style={{ backgroundColor: palette.secondary }}></div>
                        <div className="h-4 w-4 rounded-full" style={{ backgroundColor: palette.background }}></div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="pt-2 border-t">
                  <Button variant="ghost" size="sm" className="w-full flex items-center gap-1">
                    <Wand2 className="h-4 w-4" />
                    <span>Generate Custom Palette</span>
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="form">Form</TabsTrigger>
            <TabsTrigger value="page">Page</TabsTrigger>
            <TabsTrigger value="button">Button</TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="space-y-4 pt-4">
            <ColorPicker
              color={styles.formStyle.backgroundColor}
              onChange={(color) => updateFormStyle("backgroundColor", color)}
              label="Background Color"
            />

            <div className="space-y-2">
              <Label>Border Radius</Label>
              <div className="space-y-4">
                <Slider
                  min={0}
                  max={30}
                  step={1}
                  value={[Number.parseInt(styles.formStyle.borderRadius) || 8]}
                  onValueChange={(value) => updateFormStyle("borderRadius", `${value[0]}px`)}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0px</span>
                  <span>15px</span>
                  <span>30px</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    value={styles.formStyle.borderRadius}
                    onChange={(e) => updateFormStyle("borderRadius", e.target.value)}
                  />
                  <Select value="px" onValueChange={() => {}}>
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="px">px</SelectItem>
                      <SelectItem value="rem">rem</SelectItem>
                      <SelectItem value="%">%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Padding</Label>
              <div className="space-y-4">
                <Slider
                  min={0}
                  max={60}
                  step={4}
                  value={[Number.parseInt(styles.formStyle.padding) || 32]}
                  onValueChange={(value) => updateFormStyle("padding", `${value[0]}px`)}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0px</span>
                  <span>30px</span>
                  <span>60px</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    value={styles.formStyle.padding}
                    onChange={(e) => updateFormStyle("padding", e.target.value)}
                  />
                  <Select value="px" onValueChange={() => {}}>
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="px">px</SelectItem>
                      <SelectItem value="rem">rem</SelectItem>
                      <SelectItem value="%">%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Box Shadow</Label>
              <Select
                value={styles.formStyle.boxShadow || "0 4px 6px rgba(0, 0, 0, 0.1)"}
                onValueChange={(value) => updateFormStyle("boxShadow", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select shadow style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="0 1px 3px rgba(0, 0, 0, 0.1)">Light</SelectItem>
                  <SelectItem value="0 4px 6px rgba(0, 0, 0, 0.1)">Medium</SelectItem>
                  <SelectItem value="0 10px 15px rgba(0, 0, 0, 0.1)">Strong</SelectItem>
                  <SelectItem value="0 20px 25px rgba(0, 0, 0, 0.1)">Extra Strong</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="page" className="space-y-4 pt-4">
            <ColorPicker
              color={styles.pageStyle.backgroundColor}
              onChange={(color) => updatePageStyle("backgroundColor", color)}
              label="Background Color"
            />

            <div className="space-y-2">
              <Label htmlFor="backgroundImage">Background Image URL</Label>
              <Input
                id="backgroundImage"
                value={styles.pageStyle.backgroundImage || ""}
                onChange={(e) => updatePageStyle("backgroundImage", e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label>Background Type</Label>
              <Select
                value={styles.pageStyle.backgroundType || "color"}
                onValueChange={(value) => updatePageStyle("backgroundType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select background type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="color">Solid Color</SelectItem>
                  <SelectItem value="gradient">Gradient</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {styles.pageStyle.backgroundType === "gradient" && (
              <div className="space-y-2">
                <Label htmlFor="backgroundGradient">Background Gradient</Label>
                <Select
                  value={styles.pageStyle.backgroundGradient || "linear-gradient(to right, #4f46e5, #7c3aed)"}
                  onValueChange={(value) => updatePageStyle("backgroundGradient", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gradient" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linear-gradient(to right, #4f46e5, #7c3aed)">Purple</SelectItem>
                    <SelectItem value="linear-gradient(to right, #2563eb, #60a5fa)">Blue</SelectItem>
                    <SelectItem value="linear-gradient(to right, #059669, #34d399)">Green</SelectItem>
                    <SelectItem value="linear-gradient(to right, #dc2626, #f87171)">Red</SelectItem>
                    <SelectItem value="linear-gradient(to right, #f59e0b, #fbbf24)">Yellow</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  CSS gradient value, e.g. linear-gradient(to right, #4f46e5, #7c3aed)
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="button" className="space-y-4 pt-4">
            <ColorPicker
              color={styles.buttonStyle.backgroundColor}
              onChange={(color) => updateButtonStyle("backgroundColor", color)}
              label="Background Color"
            />

            <ColorPicker
              color={styles.buttonStyle.textColor}
              onChange={(color) => updateButtonStyle("textColor", color)}
              label="Text Color"
            />

            <div className="space-y-2">
              <Label>Border Radius</Label>
              <div className="space-y-4">
                <Slider
                  min={0}
                  max={30}
                  step={1}
                  value={[Number.parseInt(styles.buttonStyle.borderRadius) || 6]}
                  onValueChange={(value) => updateButtonStyle("borderRadius", `${value[0]}px`)}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0px</span>
                  <span>15px</span>
                  <span>30px</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    value={styles.buttonStyle.borderRadius}
                    onChange={(e) => updateButtonStyle("borderRadius", e.target.value)}
                  />
                  <Select value="px" onValueChange={() => {}}>
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="px">px</SelectItem>
                      <SelectItem value="rem">rem</SelectItem>
                      <SelectItem value="%">%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Button Style</Label>
              <Select
                value={styles.buttonStyle.style || "solid"}
                onValueChange={(value) => updateButtonStyle("style", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select button style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid">Solid</SelectItem>
                  <SelectItem value="outline">Outline</SelectItem>
                  <SelectItem value="ghost">Ghost</SelectItem>
                  <SelectItem value="gradient">Gradient</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {styles.buttonStyle.style === "gradient" && (
              <div className="space-y-2">
                <Label>Gradient</Label>
                <Select
                  value={styles.buttonStyle.gradient || "linear-gradient(to right, #4f46e5, #7c3aed)"}
                  onValueChange={(value) => updateButtonStyle("gradient", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gradient" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linear-gradient(to right, #4f46e5, #7c3aed)">Purple</SelectItem>
                    <SelectItem value="linear-gradient(to right, #2563eb, #60a5fa)">Blue</SelectItem>
                    <SelectItem value="linear-gradient(to right, #059669, #34d399)">Green</SelectItem>
                    <SelectItem value="linear-gradient(to right, #dc2626, #f87171)">Red</SelectItem>
                    <SelectItem value="linear-gradient(to right, #f59e0b, #fbbf24)">Yellow</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

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
              <div className="flex items-center justify-between">
                <Label htmlFor="buttonFullWidth">Full Width Button</Label>
                <Switch
                  id="buttonFullWidth"
                  checked={styles.buttonStyle.fullWidth || false}
                  onCheckedChange={(checked) => updateButtonStyle("fullWidth", checked)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Button Animation</Label>
              <Select
                value={styles.buttonStyle.animation || "none"}
                onValueChange={(value) => updateButtonStyle("animation", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select animation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="pulse">Pulse</SelectItem>
                  <SelectItem value="bounce">Bounce</SelectItem>
                  <SelectItem value="scale">Scale</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
