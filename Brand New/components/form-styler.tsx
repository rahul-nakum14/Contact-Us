"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import type { FormStyle } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FormStylerProps {
  style: FormStyle
  setStyle: (style: FormStyle) => void
}

export default function FormStyler({ style, setStyle }: FormStylerProps) {
  const [activeTab, setActiveTab] = useState("form")

  const handleStyleChange = (key: keyof FormStyle, value: string | number) => {
    setStyle({
      ...style,
      [key]: value,
    })
  }

  const fontFamilies = [
    { value: "Inter, sans-serif", label: "Inter" },
    { value: "Arial, sans-serif", label: "Arial" },
    { value: "Georgia, serif", label: "Georgia" },
    { value: "'Courier New', monospace", label: "Courier New" },
    { value: "'Times New Roman', serif", label: "Times New Roman" },
  ]

  const gradients = [
    { value: "linear-gradient(to right, #8a2be2, #4169e1)", label: "Purple to Blue" },
    { value: "linear-gradient(to right, #ff8c00, #ff0080)", label: "Orange to Pink" },
    { value: "linear-gradient(to right, #00c9ff, #92fe9d)", label: "Blue to Green" },
    { value: "linear-gradient(to right, #fc466b, #3f5efb)", label: "Pink to Purple" },
    { value: "linear-gradient(to right, #11998e, #38ef7d)", label: "Teal to Green" },
  ]

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="form">Form</TabsTrigger>
          <TabsTrigger value="button">Button</TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Background Type</Label>
            <RadioGroup
              value={style.backgroundType}
              onValueChange={(value) => handleStyleChange("backgroundType", value)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="solid" id="bg-solid" />
                <Label htmlFor="bg-solid">Solid Color</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="gradient" id="bg-gradient" />
                <Label htmlFor="bg-gradient">Gradient</Label>
              </div>
            </RadioGroup>
          </div>

          {style.backgroundType === "solid" ? (
            <div className="space-y-2">
              <Label htmlFor="bg-color">Background Color</Label>
              <div className="flex space-x-2">
                <Input
                  id="bg-color"
                  type="color"
                  value={style.backgroundColor}
                  onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={style.backgroundColor}
                  onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="bg-gradient">Gradient</Label>
              <Select
                value={style.backgroundGradient}
                onValueChange={(value) => handleStyleChange("backgroundGradient", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a gradient" />
                </SelectTrigger>
                <SelectContent>
                  {gradients.map((gradient) => (
                    <SelectItem key={gradient.value} value={gradient.value}>
                      {gradient.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="border-radius">Border Radius: {style.borderRadius}px</Label>
            <Slider
              id="border-radius"
              min={0}
              max={24}
              step={1}
              value={[Number.parseInt(style.borderRadius.toString())]}
              onValueChange={(value) => handleStyleChange("borderRadius", value[0])}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="padding">Padding: {style.padding}px</Label>
            <Slider
              id="padding"
              min={8}
              max={48}
              step={4}
              value={[Number.parseInt(style.padding.toString())]}
              onValueChange={(value) => handleStyleChange("padding", value[0])}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="font-family">Font Family</Label>
            <Select value={style.fontFamily} onValueChange={(value) => handleStyleChange("fontFamily", value)}>
              <SelectTrigger id="font-family">
                <SelectValue placeholder="Select a font" />
              </SelectTrigger>
              <SelectContent>
                {fontFamilies.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        <TabsContent value="button" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="button-color">Button Color</Label>
            <div className="flex space-x-2">
              <Input
                id="button-color"
                type="color"
                value={style.buttonColor}
                onChange={(e) => handleStyleChange("buttonColor", e.target.value)}
                className="w-12 h-10 p-1"
              />
              <Input
                value={style.buttonColor}
                onChange={(e) => handleStyleChange("buttonColor", e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="button-text-color">Button Text Color</Label>
            <div className="flex space-x-2">
              <Input
                id="button-text-color"
                type="color"
                value={style.buttonTextColor}
                onChange={(e) => handleStyleChange("buttonTextColor", e.target.value)}
                className="w-12 h-10 p-1"
              />
              <Input
                value={style.buttonTextColor}
                onChange={(e) => handleStyleChange("buttonTextColor", e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <div className="pt-4">
            <div
              className="flex justify-center p-4 rounded-md"
              style={{ backgroundColor: style.buttonColor, color: style.buttonTextColor }}
            >
              Button Preview
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

