"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Copy, Link, Code, Calendar, ArrowLeft, Loader2, Globe, Eye } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { useToast } from "@/hooks/use-toast"
import type { Form } from "@/lib/types"
import FormPreview from "@/components/form-preview"

export default function ShareFormPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { toast } = useToast()
  const [form, setForm] = useState<Form | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("link")
  const [expiryDate, setExpiryDate] = useState("")
  const [notifyOnSubmission, setNotifyOnSubmission] = useState(true)
  const [isPublished, setIsPublished] = useState(false)
  const [customRedirect, setCustomRedirect] = useState("")
  const [embedType, setEmbedType] = useState<"inline" | "fullpage">("inline")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await fetch(`/api/forms/${params.id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch form")
        }

        const data = await response.json()
        setForm(data)
        setIsPublished(data.isPublished)
        setCustomRedirect(data.customRedirect || "")

        if (data.expiresAt) {
          const date = new Date(data.expiresAt)
          setExpiryDate(date.toISOString().split("T")[0])
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load form",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchForm()
  }, [params.id, toast])

  const handleCopy = (text: string, successMessage: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: successMessage,
    })
  }

  const handlePublishToggle = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/forms/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isPublished: !isPublished,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update form")
      }

      setIsPublished(!isPublished)
      toast({
        title: isPublished ? "Form Unpublished" : "Form Published",
        description: isPublished
          ? "Your form is now private and cannot be accessed by others."
          : "Your form is now public and can be accessed by others.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update form status",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleExpiryDateChange = async (date: string) => {
    setExpiryDate(date)
    setIsSaving(true)

    try {
      const response = await fetch(`/api/forms/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expiresAt: date ? new Date(date).toISOString() : null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update form")
      }

      toast({
        title: "Expiry Date Updated",
        description: date
          ? `Your form will expire on ${new Date(date).toLocaleDateString()}`
          : "Your form will not expire",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update expiry date",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleNotificationToggle = async () => {
    setNotifyOnSubmission(!notifyOnSubmission)
    setIsSaving(true)

    try {
      const response = await fetch(`/api/forms/${params.id}/notifications`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notifyOnSubmission: !notifyOnSubmission,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update notification settings")
      }

      toast({
        title: "Notification Settings Updated",
        description: !notifyOnSubmission
          ? "You will receive email notifications when someone submits this form."
          : "You will not receive email notifications for this form.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notification settings",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCustomRedirectChange = async () => {
    setIsSaving(true)

    try {
      const response = await fetch(`/api/forms/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customRedirect,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update form")
      }

      toast({
        title: "Custom Redirect Updated",
        description: customRedirect
          ? "Users will be redirected after form submission."
          : "Custom redirect has been removed.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update custom redirect",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const getShareUrl = () => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
    return `${baseUrl}/forms/${params.id}`
  }

  const getEmbedCode = () => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin

    if (embedType === "inline") {
      return `<iframe src="${baseUrl}/embed/${params.id}" width="100%" height="500" frameborder="0"></iframe>`
    } else {
      return `<a href="${baseUrl}/forms/${params.id}" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: ${form?.style.buttonColor || "#8a2be2"}; color: ${form?.style.buttonTextColor || "#ffffff"}; text-decoration: none; border-radius: 4px; font-family: Arial, sans-serif;">Open Form</a>`
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Share Form</h1>
          </div>
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!form) {
    return (
      <DashboardLayout>
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Form Not Found</h1>
          </div>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground text-center mb-6">
                The form you're looking for doesn't exist or you don't have permission to access it.
              </p>
              <Button variant="outline" onClick={() => router.push("/dashboard")}>
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.push(`/dashboard/forms/${params.id}`)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Share Form</h1>
              <p className="text-muted-foreground">Share your form with others or embed it on your website</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="publish-toggle" className="text-sm font-medium">
              {isPublished ? "Published" : "Draft"}
            </Label>
            <Switch
              id="publish-toggle"
              checked={isPublished}
              onCheckedChange={handlePublishToggle}
              disabled={isSaving}
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="link">
              <Link className="mr-2 h-4 w-4" />
              Share Link
            </TabsTrigger>
            <TabsTrigger value="embed">
              <Code className="mr-2 h-4 w-4" />
              Embed
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Calendar className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Share Link</CardTitle>
                <CardDescription>Share this link with others to allow them to fill out your form</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="share-link">Share Link</Label>
                  <div className="flex space-x-2">
                    <Input id="share-link" value={getShareUrl()} readOnly className="flex-1" />
                    <Button variant="outline" onClick={() => handleCopy(getShareUrl(), "Link copied to clipboard")}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qr-code">QR Code</Label>
                  <div className="flex justify-center p-4 border rounded-md">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                        getShareUrl(),
                      )}`}
                      alt="QR Code"
                      width={150}
                      height={150}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Scan this QR code to access the form on mobile devices
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Share on Social Media</Label>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() =>
                        window.open(
                          `https://twitter.com/intent/tweet?url=${encodeURIComponent(getShareUrl())}&text=${encodeURIComponent(`Check out my form: ${form.title}`)}`,
                          "_blank",
                        )
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                      </svg>
                      Twitter
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() =>
                        window.open(
                          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`,
                          "_blank",
                        )
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                      Facebook
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() =>
                        window.open(
                          `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(getShareUrl())}`,
                          "_blank",
                        )
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                        <rect x="2" y="9" width="4" height="12"></rect>
                        <circle cx="4" cy="4" r="2"></circle>
                      </svg>
                      LinkedIn
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="embed" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Embed Form</CardTitle>
                <CardDescription>Embed this form on your website</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Embed Type</Label>
                  <RadioGroup
                    value={embedType}
                    onValueChange={(value: "inline" | "fullpage") => setEmbedType(value)}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="inline" id="embed-inline" />
                      <Label htmlFor="embed-inline">Inline Form (iframe)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fullpage" id="embed-fullpage" />
                      <Label htmlFor="embed-fullpage">Button Link (opens in new tab)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="embed-code">Embed Code</Label>
                  <Textarea id="embed-code" value={getEmbedCode()} readOnly rows={4} />
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      onClick={() => handleCopy(getEmbedCode(), "Embed code copied to clipboard")}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Code
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Preview</Label>
                  <div className="border rounded-md p-4 bg-muted/30">
                    {embedType === "inline" ? (
                      <div className="aspect-video flex items-center justify-center bg-muted rounded-md">
                        <iframe src={`/embed/${params.id}`} className="w-full h-full rounded-md" title={form.title} />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center p-4">
                        <a
                          href={getShareUrl()}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 rounded-md"
                          style={{
                            backgroundColor: form.style.buttonColor,
                            color: form.style.buttonTextColor,
                          }}
                        >
                          Open Form
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Form Preview</CardTitle>
                <CardDescription>This is how your form will appear to respondents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center p-6 bg-gray-50 rounded-lg">
                  <div className="w-full max-w-2xl">
                    <FormPreview
                      title={form.title}
                      fields={form.fields}
                      style={form.style}
                      onFieldsChange={() => {}}
                      isEditing={false}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => window.open(getShareUrl(), "_blank")}>
                  <Globe className="mr-2 h-4 w-4" />
                  Open in New Tab
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Form Settings</CardTitle>
                <CardDescription>Configure additional settings for your form</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="expiry-date">Form Expiry Date (Optional)</Label>
                  <Input
                    id="expiry-date"
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                  <p className="text-sm text-muted-foreground">
                    Set a date when this form will no longer accept submissions
                  </p>
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExpiryDateChange(expiryDate)}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Expiry Date"
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="notify-toggle">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive an email when someone submits this form</p>
                  </div>
                  <Switch
                    id="notify-toggle"
                    checked={notifyOnSubmission}
                    onCheckedChange={handleNotificationToggle}
                    disabled={isSaving}
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <Label htmlFor="custom-redirect">Custom Redirect URL (Optional)</Label>
                  <Input
                    id="custom-redirect"
                    type="url"
                    placeholder="https://example.com/thank-you"
                    value={customRedirect}
                    onChange={(e) => setCustomRedirect(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">Redirect users to a custom URL after form submission</p>
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" onClick={handleCustomRedirectChange} disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Redirect URL"
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => router.push(`/dashboard/forms/${params.id}`)}>
                  Back to Form
                </Button>
                <Button onClick={() => router.push(`/dashboard/forms/${params.id}/edit`)}>Edit Form</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

