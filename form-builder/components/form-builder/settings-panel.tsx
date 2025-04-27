"use client"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function SettingsPanel({ settings, onSettingsChange }) {
  const updateSetting = (key, value) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    })
  }

  return (
    <div className="space-y-6 p-4">
      <h3 className="text-lg font-medium mb-4">Form Settings</h3>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="submitButtonText">Submit Button Text</Label>
          <Input
            id="submitButtonText"
            value={settings.submitButtonText}
            onChange={(e) => updateSetting("submitButtonText", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="successMessage">Success Message</Label>
          <Textarea
            id="successMessage"
            value={settings.successMessage}
            onChange={(e) => updateSetting("successMessage", e.target.value)}
            placeholder="Thank you for your submission!"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="redirectUrl">Redirect URL (Optional)</Label>
          <Input
            id="redirectUrl"
            value={settings.redirectUrl || ""}
            onChange={(e) => updateSetting("redirectUrl", e.target.value)}
            placeholder="https://example.com/thank-you"
          />
          <p className="text-xs text-gray-500">
            If provided, users will be redirected to this URL after form submission
          </p>
        </div>
      </div>
    </div>
  )
}
