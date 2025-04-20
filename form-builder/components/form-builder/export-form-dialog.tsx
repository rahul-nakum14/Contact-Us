"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Copy, Download, Check } from "lucide-react"
import toast from "react-hot-toast"

export default function ExportFormDialog({ open, onOpenChange, formData }) {
  const [activeTab, setActiveTab] = useState("html")
  const [copied, setCopied] = useState(false)

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success("Copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = (content, filename) => {
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success(`Downloaded ${filename}`)
  }

  // Generate HTML for the form
  const generateHtml = () => {
    // Base64 encode the form data for security
    const encodedFormData = btoa(JSON.stringify(formData))

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${formData.title || "Form"}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: ${formData.styles.pageStyle.backgroundColor || "#f3f4f6"};
      margin: 0;
      padding: 20px;
    }
    .form-container {
      max-width: ${formData.styles.formStyle.maxWidth || "800px"};
      margin: ${formData.styles.formStyle.margin || "0 auto"};
      background-color: ${formData.styles.formStyle.backgroundColor || "#ffffff"};
      border-radius: ${formData.styles.formStyle.borderRadius || "0.5rem"};
      padding: ${formData.styles.formStyle.padding || "2rem"};
      box-shadow: ${formData.styles.formStyle.boxShadow || "0 4px 6px rgba(0, 0, 0, 0.1)"};
    }
    .form-title {
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }
    .form-description {
      color: #6b7280;
      margin-bottom: 1.5rem;
    }
    .form-field {
      margin-bottom: 1.5rem;
    }
    .field-label {
      display: block;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }
    .required {
      color: #ef4444;
      margin-left: 0.25rem;
    }
    .field-input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 1rem;
    }
    .field-textarea {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 1rem;
      min-height: 100px;
    }
    .field-select {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 1rem;
    }
    .field-checkbox, .field-radio {
      display: flex;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .field-checkbox input, .field-radio input {
      margin-right: 0.5rem;
    }
    .field-help {
      font-size: 0.875rem;
      color: #6b7280;
      margin-top: 0.25rem;
    }
    .submit-button {
      background-color: ${formData.styles.buttonStyle.backgroundColor || "#7c3aed"};
      color: ${formData.styles.buttonStyle.textColor || "#ffffff"};
      border: none;
      border-radius: ${formData.styles.buttonStyle.borderRadius || "0.375rem"};
      padding: 0.5rem 1rem;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
    }
    .submit-button:hover {
      opacity: 0.9;
    }
  </style>
</head>
<body>
  <div class="form-container">
    <h1 class="form-title">${formData.title || "Form"}</h1>
    ${formData.description ? `<p class="form-description">${formData.description}</p>` : ""}
    
    <form id="formcraft-form">
      <!-- Form fields will be rendered here by JavaScript -->
      <div id="form-fields"></div>
      
      <button type="submit" class="submit-button">${formData.settings.submitButtonText || "Submit"}</button>
    </form>
  </div>

  <script>
    // Decode the form data
    const encodedFormData = "${encodedFormData}";
    const formData = JSON.parse(atob(encodedFormData));
    
    // Render form fields
    document.addEventListener('DOMContentLoaded', function() {
      const formFields = document.getElementById('form-fields');
      
      formData.fields.forEach(field => {
        renderField(field, formFields);
      });
      
      // Form submission
      document.getElementById('formcraft-form').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Form submitted successfully!');
      });
    });
    
    function renderField(field, container) {
      const fieldDiv = document.createElement('div');
      fieldDiv.className = 'form-field';
      
      switch(field.type) {
        case 'text':
        case 'email':
        case 'number':
        case 'phone':
          renderInputField(field, fieldDiv);
          break;
        case 'textarea':
          renderTextareaField(field, fieldDiv);
          break;
        case 'select':
          renderSelectField(field, fieldDiv);
          break;
        case 'checkbox':
          renderCheckboxField(field, fieldDiv);
          break;
        case 'radio':
          renderRadioField(field, fieldDiv);
          break;
        case 'date':
          renderDateField(field, fieldDiv);
          break;
        case 'time':
          renderTimeField(field, fieldDiv);
          break;
        case 'heading1':
          renderHeading(field, fieldDiv, 'h1');
          break;
        case 'heading2':
          renderHeading(field, fieldDiv, 'h2');
          break;
        case 'heading3':
          renderHeading(field, fieldDiv, 'h3');
          break;
        case 'paragraph':
          renderParagraph(field, fieldDiv);
          break;
        case 'divider':
          renderDivider(field, fieldDiv);
          break;
        case 'image':
          renderImage(field, fieldDiv);
          break;
        case 'video':
          renderVideo(field, fieldDiv);
          break;
        case 'audio':
          renderAudio(field, fieldDiv);
          break;
        case 'embed':
          renderEmbed(field, fieldDiv);
          break;
      }
      
      container.appendChild(fieldDiv);
    }
    
    // Helper functions for rendering different field types
    function renderInputField(field, container) {
      const label = document.createElement('label');
      label.className = 'field-label';
      label.htmlFor = field.id;
      label.textContent = field.label;
      
      if (field.required) {
        const required = document.createElement('span');
        required.className = 'required';
        required.textContent = '*';
        label.appendChild(required);
      }
      
      const input = document.createElement('input');
      input.className = 'field-input';
      input.id = field.id;
      input.name = field.id;
      input.type = field.type === 'email' ? 'email' : 
                  field.type === 'number' ? 'number' : 
                  field.type === 'phone' ? 'tel' : 'text';
      input.placeholder = field.data?.placeholder || '';
      input.required = field.required;
      
      container.appendChild(label);
      container.appendChild(input);
      
      if (field.data?.helpText) {
        const help = document.createElement('div');
        help.className = 'field-help';
        help.textContent = field.data.helpText;
        container.appendChild(help);
      }
    }
    
    // Additional rendering functions would be implemented here
  </script>
</body>
</html>
    `.trim()
  }

  // Generate JSON for the form
  const generateJson = () => {
    return JSON.stringify(formData, null, 2)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Export Form</DialogTitle>
          <DialogDescription>Export your form as HTML or JSON to use it in other applications.</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="w-full justify-start mb-4">
            <TabsTrigger value="html">HTML</TabsTrigger>
            <TabsTrigger value="json">JSON</TabsTrigger>
          </TabsList>

          <TabsContent value="html" className="flex-1 overflow-hidden flex flex-col mt-0">
            <div className="bg-gray-50 p-4 rounded-md overflow-auto flex-1">
              <pre className="text-sm whitespace-pre-wrap">{generateHtml()}</pre>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => handleCopy(generateHtml())}>
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                Copy
              </Button>
              <Button onClick={() => handleDownload(generateHtml(), `${formData.title || "form"}.html`)}>
                <Download className="h-4 w-4 mr-2" />
                Download HTML
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="json" className="flex-1 overflow-hidden flex flex-col mt-0">
            <div className="bg-gray-50 p-4 rounded-md overflow-auto flex-1">
              <pre className="text-sm">{generateJson()}</pre>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => handleCopy(generateJson())}>
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                Copy
              </Button>
              <Button onClick={() => handleDownload(generateJson(), `${formData.title || "form"}.json`)}>
                <Download className="h-4 w-4 mr-2" />
                Download JSON
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
