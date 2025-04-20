"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Check, Link, Code, Mail } from "lucide-react"
import { toast } from "react-hot-toast"

export default function ShareFormDialog({ open, onOpenChange, formData, isNewForm = false }) {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("link")

  // Generate a sample form URL - in a real app, this would be the actual URL
  const formUrl = isNewForm
    ? "Your form will be available after saving"
    : `https://formcraft.com/f/${formData.slug || "your-form"}`

  // Generate embed code
  const embedCode = `<iframe src="${formUrl}" width="100%" height="600" frameborder="0"></iframe>`

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success("Copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share your form</DialogTitle>
          <DialogDescription>
            {isNewForm
              ? "Save your form first to get a shareable link"
              : "Share your form with others or embed it on your website"}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="link" value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="link" disabled={isNewForm}>
              <Link className="h-4 w-4 mr-2" />
              Link
            </TabsTrigger>
            <TabsTrigger value="embed" disabled={isNewForm}>
              <Code className="h-4 w-4 mr-2" />
              Embed
            </TabsTrigger>
            <TabsTrigger value="email" disabled={isNewForm}>
              <Mail className="h-4 w-4 mr-2" />
              Email
            </TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="mt-4">
            <div className="flex items-center space-x-2">
              <Input value={formUrl} readOnly disabled={isNewForm} className="flex-1" />
              <Button type="button" size="sm" disabled={isNewForm} onClick={() => copyToClipboard(formUrl)}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="embed" className="mt-4">
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-md border">
                <pre className="text-xs overflow-auto whitespace-pre-wrap">{embedCode}</pre>
              </div>
              <Button
                type="button"
                size="sm"
                className="w-full"
                disabled={isNewForm}
                onClick={() => copyToClipboard(embedCode)}
              >
                {copied ? "Copied!" : "Copy embed code"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="email" className="mt-4">
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Send your form directly to recipients via email</p>
              <Input placeholder="Enter email addresses" disabled={isNewForm} />
              <Button type="button" className="w-full" disabled={isNewForm}>
                Send form
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
