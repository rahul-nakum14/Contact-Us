"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import type { FormStyle } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Upload } from "lucide-react"

interface FormStylerProps {
  style: FormStyle
  setStyle: (style: FormStyle) => void
}

export default function FormStyler({ style, setStyle }: FormStylerProps) {
  const [activeTab, setActiveTab] = useState("form")
  const [uploadingImage, setUploadingImage] = useState(false)

  const handleStyleChange = (key: keyof FormStyle, value: string | number) => {
    setStyle({
      ...style,
      [key]: value,
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)

    // In a real app, this would upload the image to a storage service
    // For now, we'll use a local URL
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        handleStyleChange("backgroundImage", reader.result)
        handleStyleChange("backgroundType", "image")
        setUploadingImage(false)
      }
    }
    reader.readAsDataURL(file)
  }

  const fontFamilies = [
    { value: "Inter, sans-serif", label: "Inter" },
    { value: "Arial, sans-serif", label: "Arial" },
    { value: "Georgia, serif", label: "Georgia" },
    { value: "'Courier New', monospace", label: "Courier New" },
    { value: "'Times New Roman', serif", label: "Times New Roman" },
    { value: "'Roboto', sans-serif", label: "Roboto" },
    { value: "'Open Sans', sans-serif", label: "Open Sans" },
    { value: "'Montserrat', sans-serif", label: "Montserrat" },
  ]

  const gradients = [
    { value: "linear-gradient(to right, #8a2be2, #4169e1)", label: "Purple to Blue" },
    { value: "linear-gradient(to right, #ff8c00, #ff0080)", label: "Orange to Pink" },
    { value: "linear-gradient(to right, #00c9ff, #92fe9d)", label: "Blue to Green" },
    { value: "linear-gradient(to right, #fc466b, #3f5efb)", label: "Pink to Purple" },
    { value: "linear-gradient(to right, #11998e, #38ef7d)", label: "Teal to Green" },
    { value: "linear-gradient(135deg, #667eea, #764ba2)", label: "Indigo to Purple" },
    { value: "linear-gradient(135deg, #f093fb, #f5576c)", label: "Pink to Red" },
    { value: "linear-gradient(135deg, #43e97b, #38f9d7)", label: "Green to Teal" },
  ]

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="form">Form</TabsTrigger>
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="button">Button</TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Background Type</Label>
            <RadioGroup
              value={style.backgroundType}
              onValueChange={(value: "solid" | "gradient" | "image") => handleStyleChange("backgroundType", value)}
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
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="image" id="bg-image" />
                <Label htmlFor="bg-image">Image</Label>
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
          ) : style.backgroundType === "gradient" ? (
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
          ) : (
            <div className="space-y-2">
              <Label htmlFor="bg-image">Background Image</Label>
              <div className="flex flex-col space-y-2">
                {style.backgroundImage && (
                  <div className="relative w-full h-32 rounded-md overflow-hidden">
                    <img
                      src={style.backgroundImage || "/placeholder.svg"}
                      alt="Background"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        handleStyleChange("backgroundImage", "")
                        handleStyleChange("backgroundType", "solid")
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                )}
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG or GIF</p>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                  />
                </label>
                <p className="text-xs text-muted-foreground">
                  For best results, use images that are at least 1200x800 pixels. Larger images may be automatically
                  resized.
                </p>
              </div>
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
            <Label htmlFor="description">Form Description (Optional)</Label>
            <Textarea
              id="description"
              value={style.description || ""}
              onChange={(e) => handleStyleChange("description", e.target.value)}
              placeholder="Add a description for your form"
              rows={3}
            />
          </div>
        </TabsContent>

        <TabsContent value="text" className="space-y-4 pt-4">
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

          <div className="space-y-2">
            <Label htmlFor="title-color">Title Color</Label>
            <div className="flex space-x-2">
              <Input
                id="title-color"
                type="color"
                value={style.titleColor || "#000000"}
                onChange={(e) => handleStyleChange("titleColor", e.target.value)}
                className="w-12 h-10 p-1"
              />
              <Input
                value={style.titleColor || "#000000"}
                onChange={(e) => handleStyleChange("titleColor", e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="label-color">Label Color</Label>
            <div className="flex space-x-2">
              <Input
                id="label-color"
                type="color"
                value={style.labelColor || "#000000"}
                onChange={(e) => handleStyleChange("labelColor", e.target.value)}
                className="w-12 h-10 p-1"
              />
              <Input
                value={style.labelColor || "#000000"}
                onChange={(e) => handleStyleChange("labelColor", e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="button" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="button-text">Button Text</Label>
            <Input
              id="button-text"
              value={style.buttonText || "Submit"}
              onChange={(e) => handleStyleChange("buttonText", e.target.value)}
              placeholder="Submit"
            />
          </div>

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
              {style.buttonText || "Submit"}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

