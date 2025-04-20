"use client"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { DatePicker } from "@/components/ui/date-picker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPanel({ settings, onSettingsChange }) {
  const updateSetting = (key, value) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    })
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general">
        <TabsList className="w-full">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="embed">Embed</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 pt-4">
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

          <div className="space-y-2">
            <Label htmlFor="expirationDate">Expiration Date (Optional)</Label>
            <DatePicker
              id="expirationDate"
              date={settings.expirationDate ? new Date(settings.expirationDate) : null}
              onSelect={(date) => updateSetting("expirationDate", date)}
            />
            <p className="text-xs text-gray-500">If set, the form will no longer accept submissions after this date</p>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="emailNotifications" className="cursor-pointer">
                Email Notifications
              </Label>
              <p className="text-xs text-gray-500">Receive email notifications for new submissions</p>
            </div>
            <Switch
              id="emailNotifications"
              checked={settings.emailNotifications || false}
              onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
            />
          </div>

          {settings.emailNotifications && (
            <div className="space-y-2">
              <Label htmlFor="notificationEmail">Notification Email</Label>
              <Input
                id="notificationEmail"
                type="email"
                value={settings.notificationEmail || ""}
                onChange={(e) => updateSetting("notificationEmail", e.target.value)}
                placeholder="Enter email to receive notifications"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="autoResponder" className="cursor-pointer">
                Auto-Responder
              </Label>
              <p className="text-xs text-gray-500">Send an automatic response to form submitters</p>
            </div>
            <Switch
              id="autoResponder"
              checked={settings.autoResponder || false}
              onCheckedChange={(checked) => updateSetting("autoResponder", checked)}
            />
          </div>

          {settings.autoResponder && (
            <div className="space-y-2">
              <Label htmlFor="autoResponderMessage">Auto-Responder Message</Label>
              <Textarea
                id="autoResponderMessage"
                value={settings.autoResponderMessage || ""}
                onChange={(e) => updateSetting("autoResponderMessage", e.target.value)}
                placeholder="Thank you for your submission. We'll be in touch soon."
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="embed" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="embedCode">Embed Code</Label>
            <div className="bg-gray-50 p-3 rounded-md border text-xs font-mono overflow-auto">
              {`<iframe src="https://formcraft.com/f/${settings.formSlug || "your-form"}" width="100%" height="600" frameborder="0"></iframe>`}
            </div>
            <p className="text-xs text-gray-500">Copy this code to embed the form on your website</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="allowEmbedding">Allow Embedding</Label>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Allow this form to be embedded on other websites</p>
              <Switch
                id="allowEmbedding"
                checked={settings.allowEmbedding !== false}
                onCheckedChange={(checked) => updateSetting("allowEmbedding", checked)}
              />
            </div>
          </div>

          {settings.allowEmbedding !== false && (
            <div className="space-y-2">
              <Label htmlFor="allowedDomains">Allowed Domains (Optional)</Label>
              <Input
                id="allowedDomains"
                value={settings.allowedDomains || ""}
                onChange={(e) => updateSetting("allowedDomains", e.target.value)}
                placeholder="example.com, mysite.org"
              />
              <p className="text-xs text-gray-500">
                Comma-separated list of domains allowed to embed this form. Leave empty to allow all domains.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="security" className="space-y-4 pt-4">
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

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enableCaptcha" className="cursor-pointer">
                Enable CAPTCHA
              </Label>
              <p className="text-xs text-gray-500">Protect your form from spam and bots</p>
            </div>
            <Switch
              id="enableCaptcha"
              checked={settings.enableCaptcha || false}
              onCheckedChange={(checked) => updateSetting("enableCaptcha", checked)}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
