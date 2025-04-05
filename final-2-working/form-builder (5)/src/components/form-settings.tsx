"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useFormBuilderStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function FormSettings() {
  const { formTitle, formDescription, style, setFormTitle, setFormDescription, updateStyle } = useFormBuilderStore()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Form Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="formTitle">Form Title</Label>
            <Input id="formTitle" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="formDescription">Form Description</Label>
            <Textarea
              id="formDescription"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Form Styling</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Form Background</h3>
            <div className="grid gap-2">
              <Label htmlFor="formBackgroundColor">Background Color</Label>
              <div className="flex gap-2">
                <Input
                  id="formBackgroundColor"
                  type="color"
                  value={style.formBackgroundColor}
                  onChange={(e) => updateStyle({ formBackgroundColor: e.target.value })}
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={style.formBackgroundColor}
                  onChange={(e) => updateStyle({ formBackgroundColor: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="formBackgroundGradient"
                checked={style.formBackgroundGradient}
                onCheckedChange={(checked) => updateStyle({ formBackgroundGradient: checked as boolean })}
              />
              <label htmlFor="formBackgroundGradient" className="text-sm font-medium leading-none">
                Use gradient background
              </label>
            </div>
            {style.formBackgroundGradient && (
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="formGradientFrom">Gradient From</Label>
                  <div className="flex gap-2">
                    <Input
                      id="formGradientFrom"
                      type="color"
                      value={style.formGradientFrom || "#ffffff"}
                      onChange={(e) => updateStyle({ formGradientFrom: e.target.value })}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={style.formGradientFrom || "#ffffff"}
                      onChange={(e) => updateStyle({ formGradientFrom: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="formGradientTo">Gradient To</Label>
                  <div className="flex gap-2">
                    <Input
                      id="formGradientTo"
                      type="color"
                      value={style.formGradientTo || "#f9fafb"}
                      onChange={(e) => updateStyle({ formGradientTo: e.target.value })}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={style.formGradientTo || "#f9fafb"}
                      onChange={(e) => updateStyle({ formGradientTo: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Page Background</h3>
            <div className="grid gap-2">
              <Label htmlFor="pageBackgroundColor">Background Color</Label>
              <div className="flex gap-2">
                <Input
                  id="pageBackgroundColor"
                  type="color"
                  value={style.pageBackgroundColor}
                  onChange={(e) => updateStyle({ pageBackgroundColor: e.target.value })}
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={style.pageBackgroundColor}
                  onChange={(e) => updateStyle({ pageBackgroundColor: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pageBackgroundImage">Background Image URL (optional)</Label>
              <Input
                id="pageBackgroundImage"
                value={style.pageBackgroundImage || ""}
                onChange={(e) => updateStyle({ pageBackgroundImage: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Button Styling</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="buttonColor">Button Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="buttonColor"
                    type="color"
                    value={style.buttonColor}
                    onChange={(e) => updateStyle({ buttonColor: e.target.value })}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={style.buttonColor}
                    onChange={(e) => updateStyle({ buttonColor: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="buttonTextColor">Button Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="buttonTextColor"
                    type="color"
                    value={style.buttonTextColor}
                    onChange={(e) => updateStyle({ buttonTextColor: e.target.value })}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={style.buttonTextColor}
                    onChange={(e) => updateStyle({ buttonTextColor: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Input Styling</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="labelColor">Label Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="labelColor"
                    type="color"
                    value={style.labelColor}
                    onChange={(e) => updateStyle({ labelColor: e.target.value })}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={style.labelColor}
                    onChange={(e) => updateStyle({ labelColor: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="inputBorderColor">Input Border Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="inputBorderColor"
                    type="color"
                    value={style.inputBorderColor}
                    onChange={(e) => updateStyle({ inputBorderColor: e.target.value })}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={style.inputBorderColor}
                    onChange={(e) => updateStyle({ inputBorderColor: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="inputBackgroundColor">Input Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="inputBackgroundColor"
                    type="color"
                    value={style.inputBackgroundColor}
                    onChange={(e) => updateStyle({ inputBackgroundColor: e.target.value })}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={style.inputBackgroundColor}
                    onChange={(e) => updateStyle({ inputBackgroundColor: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="inputTextColor">Input Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="inputTextColor"
                    type="color"
                    value={style.inputTextColor}
                    onChange={(e) => updateStyle({ inputTextColor: e.target.value })}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={style.inputTextColor}
                    onChange={(e) => updateStyle({ inputTextColor: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

