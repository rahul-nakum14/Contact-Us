"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { DatePicker } from "@/components/ui/date-picker"

export default function SettingsPanel({ settings, onSettingsChange }) {
  const updateSetting = (key, value) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Settings</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
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

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Form Behavior</h3>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="collectEmailAddresses" className="cursor-pointer">
                Collect email addresses
              </Label>
              <p className="text-xs text-gray-500">Require users to enter their email address before submitting</p>
            </div>
            <Switch
              id="collectEmailAddresses"
              checked={settings.collectEmailAddresses}
              onCheckedChange={(checked) => updateSetting("collectEmailAddresses", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="limitOneResponsePerUser" className="cursor-pointer">
                Limit to one response per user
              </Label>
              <p className="text-xs text-gray-500">Prevent users from submitting the form multiple times</p>
            </div>
            <Switch
              id="limitOneResponsePerUser"
              checked={settings.limitOneResponsePerUser}
              onCheckedChange={(checked) => updateSetting("limitOneResponsePerUser", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="isPublic" className="cursor-pointer">
                Make form public
              </Label>
              <p className="text-xs text-gray-500">Allow anyone with the link to view and submit the form</p>
            </div>
            <Switch
              id="isPublic"
              checked={settings.isPublic}
              onCheckedChange={(checked) => updateSetting("isPublic", checked)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="expirationDate">Expiration Date (Optional)</Label>
          <DatePicker
            id="expirationDate"
            date={settings.expirationDate ? new Date(settings.expirationDate) : null}
            onSelect={(date) => updateSetting("expirationDate", date)}
          />
          <p className="text-xs text-gray-500">If set, the form will no longer accept submissions after this date</p>
        </div>
      </CardContent>
    </Card>
  )
}
