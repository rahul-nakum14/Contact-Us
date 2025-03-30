"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useFormBuilderStore } from "@/lib/store"
import { Copy, Share2, Check, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function FormShare() {
  const { formId, formTitle, fields, style } = useFormBuilderStore()
  const [shareUrl, setShareUrl] = useState("")
  const [copied, setCopied] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setIsClient(true)
    if (typeof window !== "undefined") {
      // In a real app, this would be your deployed URL
      const baseUrl = window.location.origin
      setShareUrl(`${baseUrl}/forms/${formId}`)
    }
  }, [formId])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    toast({
      title: "Link copied",
      description: "The form link has been copied to your clipboard",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  // In a real app, this would save the form to a database
  const handlePublishForm = async () => {
    try {
      // Simulate API call
      toast({
        title: "Publishing form...",
        description: "Please wait while we publish your form",
      })

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Form published",
        description: "Your form has been published successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish form. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleExportForm = () => {
    try {
      const formData = {
        formId,
        formTitle,
        fields,
        style,
      }

      const dataStr = JSON.stringify(formData, null, 2)
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

      const exportFileDefaultName = `${formTitle.toLowerCase().replace(/\s+/g, "-")}-form.json`

      const linkElement = document.createElement("a")
      linkElement.setAttribute("href", dataUri)
      linkElement.setAttribute("download", exportFileDefaultName)
      linkElement.click()

      toast({
        title: "Form exported",
        description: "Your form has been exported as JSON",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export form. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!isClient) {
    return null
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Share Your Form</CardTitle>
          <CardDescription>Publish your form and share it with others</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Input value={shareUrl} readOnly className="flex-1" />
            <Button variant="outline" size="icon" onClick={handleCopyLink} className="flex-shrink-0">
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </Button>
          </div>
          <div className="pt-2 flex flex-wrap gap-2">
            <Button onClick={handlePublishForm} disabled={fields.length === 0} className="flex items-center gap-2">
              <Share2 size={16} />
              Publish Form
            </Button>
            <Button
              variant="outline"
              onClick={handleExportForm}
              disabled={fields.length === 0}
              className="flex items-center gap-2"
            >
              <Download size={16} />
              Export Form
            </Button>
            {fields.length === 0 && (
              <p className="text-sm text-muted-foreground mt-2 w-full">
                Add some fields to your form before publishing
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Embed Code</CardTitle>
          <CardDescription>Use this code to embed your form on your website</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-md overflow-x-auto">
            <pre className="text-sm">
              {`<iframe
  src="${shareUrl}"
  title="${formTitle}"
  width="100%"
  height="600"
  frameborder="0"
></iframe>`}
            </pre>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(
                `<iframe src="${shareUrl}" title="${formTitle}" width="100%" height="600" frameborder="0"></iframe>`,
              )
              toast({
                title: "Embed code copied",
                description: "The embed code has been copied to your clipboard",
              })
            }}
            className="mt-4"
          >
            Copy Embed Code
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

