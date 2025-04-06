"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Link, Code, Calendar } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { useToast } from "@/hooks/use-toast"
import type { Form } from "@/lib/types"

export default function ShareFormPage() {
  const params = useParams<{ id: string }>()
  const { toast } = useToast()
  const [form, setForm] = useState<Form | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("link")
  const [expiryDate, setExpiryDate] = useState("")
  const [notifyOnSubmission, setNotifyOnSubmission] = useState(true)
  const [isPublished, setIsPublished] = useState(false)

  useEffect(() => {
    const fetchForm = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/forms/${params.id}`)
        // const data = await response.json()

        // Mock data for demonstration
        const mockForm: Form = {
          id: params.id,
          userId: "user123",
          title: "Contact Form",
          fields: [],
          style: {
            backgroundColor: "#ffffff",
            backgroundType: "solid",
            backgroundGradient: "",
            borderRadius: 8,
            padding: 24,
            fontFamily: "Inter, sans-serif",
            buttonColor: "#8a2be2",
            buttonTextColor: "#ffffff",
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          isPublished: true,
          shareUrl: `https://formcraft.vercel.app/forms/${params.id}`,
          embedCode: `<iframe src="https://formcraft.vercel.app/embed/${params.id}" width="100%" height="500" frameborder="0"></iframe>`,
        }

        setForm(mockForm)
        setIsPublished(mockForm.isPublished)

        if (mockForm.expiresAt) {
          const date = new Date(mockForm.expiresAt)
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
    setIsPublished(!isPublished)

    // In a real app, this would be an API call
    // await fetch(`/api/forms/${params.id}`, {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     isPublished: !isPublished,
    //   }),
    // })

    toast({
      title: isPublished ? "Form Unpublished" : "Form Published",
      description: isPublished
        ? "Your form is now private and cannot be accessed by others."
        : "Your form is now public and can be accessed by others.",
    })
  }

  const handleExpiryDateChange = async (date: string) => {
    setExpiryDate(date)

    // In a real app, this would be an API call
    // await fetch(`/api/forms/${params.id}`, {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     expiresAt: date ? new Date(date).toISOString() : null,
    //   }),
    // })

    toast({
      title: "Expiry Date Updated",
      description: date
        ? `Your form will expire on ${new Date(date).toLocaleDateString()}`
        : "Your form will not expire",
    })
  }

  const handleNotificationToggle = async () => {
    setNotifyOnSubmission(!notifyOnSubmission)

    // In a real app, this would be an API call
    // await fetch(`/api/forms/${params.id}/notifications`, {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     notifyOnSubmission: !notifyOnSubmission,
    //   }),
    // })

    toast({
      title: "Notification Settings Updated",
      description: !notifyOnSubmission
        ? "You will receive email notifications when someone submits this form."
        : "You will not receive email notifications for this form.",
    })
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Share Form</h1>
          </div>
          <Card>
            <CardHeader>
              <div className="h-6 w-1/3 rounded-md bg-muted animate-pulse"></div>
              <div className="h-4 w-1/2 rounded-md bg-muted animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-10 w-full rounded-md bg-muted animate-pulse"></div>
                <div className="h-10 w-full rounded-md bg-muted animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  if (!form) {
    return (
      <DashboardLayout>
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Share Form</h1>
          </div>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-muted p-3 mb-4">
                <Link className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">Form Not Found</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                The form you're looking for doesn't exist or you don't have permission to access it.
              </p>
              <Button variant="outline" onClick={() => window.history.back()}>
                Go Back
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
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Share Form</h1>
          <div className="flex items-center space-x-2">
            <Label htmlFor="publish-toggle" className="text-sm font-medium">
              {isPublished ? "Published" : "Draft"}
            </Label>
            <Switch id="publish-toggle" checked={isPublished} onCheckedChange={handlePublishToggle} />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{form.title}</CardTitle>
            <CardDescription>Share your form with others or embed it on your website</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="link">
                  <Link className="mr-2 h-4 w-4" />
                  Share Link
                </TabsTrigger>
                <TabsTrigger value="embed">
                  <Code className="mr-2 h-4 w-4" />
                  Embed
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <Calendar className="mr-2 h-4 w-4" />
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="link" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="share-link">Share Link</Label>
                  <div className="flex space-x-2">
                    <Input id="share-link" value={form.shareUrl} readOnly className="flex-1" />
                    <Button
                      variant="outline"
                      onClick={() => handleCopy(form.shareUrl || "", "Link copied to clipboard")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Share this link with others to allow them to fill out your form
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qr-code">QR Code</Label>
                  <div className="flex justify-center p-4 border rounded-md">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                        form.shareUrl || "",
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
              </TabsContent>

              <TabsContent value="embed" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="embed-code">Embed Code</Label>
                  <Textarea id="embed-code" value={form.embedCode} readOnly rows={4} />
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      onClick={() => handleCopy(form.embedCode || "", "Embed code copied to clipboard")}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Code
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Copy and paste this code into your website to embed the form
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Preview</Label>
                  <div className="border rounded-md p-4 bg-muted/30">
                    <div className="aspect-video flex items-center justify-center bg-muted rounded-md">
                      <p className="text-muted-foreground">Form Preview</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry-date">Form Expiry Date (Optional)</Label>
                  <Input
                    id="expiry-date"
                    type="date"
                    value={expiryDate}
                    onChange={(e) => handleExpiryDateChange(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                  <p className="text-sm text-muted-foreground">
                    Set a date when this form will no longer accept submissions
                  </p>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="notify-toggle">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive an email when someone submits this form</p>
                  </div>
                  <Switch id="notify-toggle" checked={notifyOnSubmission} onCheckedChange={handleNotificationToggle} />
                </div>

                <div className="space-y-2 pt-2">
                  <Label htmlFor="custom-redirect">Custom Redirect URL (Optional)</Label>
                  <Input id="custom-redirect" type="url" placeholder="https://example.com/thank-you" />
                  <p className="text-sm text-muted-foreground">Redirect users to a custom URL after form submission</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => window.history.back()}>
              Back to Form
            </Button>
            <Button onClick={() => (window.location.href = `/dashboard/forms/${params.id}/edit`)}>Edit Form</Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
}

