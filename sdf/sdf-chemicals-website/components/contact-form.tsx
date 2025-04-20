"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2 } from "lucide-react"

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 1500)
  }

  if (isSubmitted) {
    return (
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-teal-100 p-3 rounded-full">
            <CheckCircle2 className="h-8 w-8 text-teal-600" />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gray-800">Message Sent Successfully!</h3>
        <p className="text-gray-600 mb-6">Thank you for contacting us. Our team will get back to you shortly.</p>
        <Button
          onClick={() => setIsSubmitted(false)}
          className="bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-teal-600"
        >
          Send Another Message
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">
            Full Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="name"
            placeholder="John Doe"
            required
            className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email Address <span className="text-red-500">*</span>
          </label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            required
            className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <Input
            id="phone"
            placeholder="+91 98765 43210"
            className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="subject" className="text-sm font-medium text-gray-700">
            Subject <span className="text-red-500">*</span>
          </label>
          <Select required>
            <SelectTrigger className="border-gray-300 focus:border-teal-500 focus:ring-teal-500">
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General Inquiry</SelectItem>
              <SelectItem value="product">Product Information</SelectItem>
              <SelectItem value="quote">Request a Quote</SelectItem>
              <SelectItem value="support">Technical Support</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium text-gray-700">
          Message <span className="text-red-500">*</span>
        </label>
        <Textarea
          id="message"
          placeholder="Please describe your inquiry in detail..."
          required
          className="min-h-[150px] border-gray-300 focus:border-teal-500 focus:ring-teal-500"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-teal-600"
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  )
}
