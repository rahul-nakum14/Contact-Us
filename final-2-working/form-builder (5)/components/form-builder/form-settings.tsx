"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useFormStore } from "@/lib/form-store"
import { cn } from "@/lib/utils"

export function FormSettings() {
  const { title, description, style, expiresAt, setTitle, setDescription, updateStyle, setExpirationDate } =
    useFormStore()

  const [enableExpiration, setEnableExpiration] = useState(!!expiresAt)
  const [expirationDateValue, setExpirationDateValue] = useState<Date | undefined>(
    expiresAt ? new Date(expiresAt) : undefined,
  )

  const handleExpirationChange = (checked: boolean) => {
    setEnableExpiration(checked)

    if (!checked) {
      setExpirationDateValue(undefined)
      setExpirationDate(null)
    }
  }

  const handleDateSelect = (date: Date | undefined) => {
    setExpirationDateValue(date)

    if (date) {
      setExpirationDate(date.toISOString())
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Form Information</h3>
        <div className="space-y-2">
          <Label htmlFor="title">Form Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter form title" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Form Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter form description"
            rows={3}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Form Styling</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="backgroundColor">Background Color</Label>
            <div className="flex gap-2">
              <Input
                id="backgroundColor"
                type="color"
                value={style.backgroundColor}
                onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
                className="w-12 h-10 p-1"
              />
              <Input
                value={style.backgroundColor}
                onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
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

          <div className="space-y-2">
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

          <div className="space-y-2">
            <Label htmlFor="textColor">Text Color</Label>
            <div className="flex gap-2">
              <Input
                id="textColor"
                type="color"
                value={style.textColor}
                onChange={(e) => updateStyle({ textColor: e.target.value })}
                className="w-12 h-10 p-1"
              />
              <Input
                value={style.textColor}
                onChange={(e) => updateStyle({ textColor: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="backgroundGradient"
              checked={style.backgroundGradient}
              onCheckedChange={(checked) => updateStyle({ backgroundGradient: checked as boolean })}
            />
            <Label htmlFor="backgroundGradient">Use gradient background</Label>
          </div>

          {style.backgroundGradient && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="gradientFrom">Gradient From</Label>
                <div className="flex gap-2">
                  <Input
                    id="gradientFrom"
                    type="color"
                    value={style.gradientFrom || "#ffffff"}
                    onChange={(e) => updateStyle({ gradientFrom: e.target.value })}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={style.gradientFrom || "#ffffff"}
                    onChange={(e) => updateStyle({ gradientFrom: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gradientTo">Gradient To</Label>
                <div className="flex gap-2">
                  <Input
                    id="gradientTo"
                    type="color"
                    value={style.gradientTo || "#f9fafb"}
                    onChange={(e) => updateStyle({ gradientTo: e.target.value })}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={style.gradientTo || "#f9fafb"}
                    onChange={(e) => updateStyle({ gradientTo: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Form Expiration</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="enableExpiration"
              checked={enableExpiration}
              onCheckedChange={(checked) => handleExpirationChange(checked as boolean)}
            />
            <Label htmlFor="enableExpiration">Set an expiration date for this form</Label>
          </div>

          {enableExpiration && (
            <div className="space-y-2">
              <Label htmlFor="expirationDate">Expiration Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="expirationDate"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !expirationDateValue && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expirationDateValue ? format(expirationDateValue, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={expirationDateValue}
                    onSelect={handleDateSelect}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
              <p className="text-sm text-muted-foreground">
                After this date, the form will no longer accept submissions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

