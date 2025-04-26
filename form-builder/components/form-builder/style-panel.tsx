"use client"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { HexColorPicker } from "react-colorful"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function StylePanel({ styles, onStylesChange }) {
  const updateFormStyle = (key, value) => {
    onStylesChange({
      ...styles,
      formStyle: {
        ...styles.formStyle,
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
    <div className="space-y-6 p-4">
      <h3 className="text-lg font-medium mb-4">Form Style</h3>

      <div className="space-y-6">
        <div className="space-y-4">
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
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium">Button Style</h4>

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
        </div>
      </div>
    </div>
  )
}
