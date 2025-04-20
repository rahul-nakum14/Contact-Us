"use client"

import { forwardRef } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { GripVertical, Copy, Trash2, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const FormCanvas = forwardRef(
  ({ formData, selectedField, onSelectField, onUpdateField, onRemoveField, onDuplicateField, dropIndicator }, ref) => {
    return (
      <div className="min-h-full p-8 flex justify-center bg-gray-50">
        <div id="form-canvas" ref={ref} className="w-full max-w-[800px]">
          <div
            className={cn(
              "bg-white rounded-lg border border-dashed border-gray-300 p-6",
              formData.fields.length === 0 ? "flex flex-col items-center justify-center min-h-[400px]" : "",
            )}
          >
            {formData.fields.length === 0 ? (
              <div className="text-center">
                <div className="h-16 w-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Start Building Your Form</h3>
                <p className="text-gray-500 mb-4 max-w-md mx-auto">
                  Drag components from the left panel and drop them here, or click the Add Field button above.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.title && <h2 className="text-xl font-bold mb-2">{formData.title}</h2>}
                {formData.description && <p className="text-gray-600 mb-6">{formData.description}</p>}

                <div className="space-y-4 relative">
                  {formData.fields.map((field) => (
                    <CanvasField
                      key={field.id}
                      field={field}
                      isSelected={selectedField?.id === field.id}
                      onClick={() => onSelectField(field)}
                      onRemove={() => onRemoveField(field.id)}
                      onDuplicate={() => onDuplicateField(field.id)}
                    />
                  ))}

                  {/* Drop indicator */}
                  {dropIndicator.show && (
                    <div
                      className="absolute left-0 right-0 h-1 bg-purple-500 rounded-full transform -translate-y-1/2 z-10"
                      style={{
                        top:
                          dropIndicator.index === 0
                            ? 0
                            : dropIndicator.index === formData.fields.length
                              ? "100%"
                              : `${(dropIndicator.index / formData.fields.length) * 100}%`,
                      }}
                    />
                  )}
                </div>

                {/* Submit button preview */}
                <div className="mt-6">
                  <button
                    style={{
                      backgroundColor: formData.styles.buttonStyle.backgroundColor,
                      color: formData.styles.buttonStyle.textColor,
                      borderRadius: formData.styles.buttonStyle.borderRadius,
                    }}
                    className="px-4 py-2 font-medium"
                    onClick={(e) => e.preventDefault()}
                  >
                    {formData.settings.submitButtonText || "Submit"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  },
)

FormCanvas.displayName = "FormCanvas"

function CanvasField({ field, isSelected, onClick, onRemove, onDuplicate }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: field.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const getFieldTypeLabel = (type) => {
    const typeLabels = {
      text: "Text",
      email: "Email",
      textarea: "Text Area",
      select: "Dropdown",
      checkbox: "Checkbox Group",
      radio: "Radio Group",
      number: "Number",
      date: "Date",
      phone: "Phone",
      file: "File Upload",
      payment: "Payment",
      rating: "Rating",
      matrix: "Matrix",
      signature: "Signature",
      website: "Website",
      address: "Address",
      toggle: "Toggle",
      time: "Time",
      columns: "Columns",
      section: "Section",
      divider: "Divider",
      heading1: "Heading 1",
      heading2: "Heading 2",
      heading3: "Heading 3",
      paragraph: "Paragraph",
      table: "Table",
      image: "Image",
      video: "Video",
      audio: "Audio",
      embed: "Embed",
    }

    return typeLabels[type] || type
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-field-id={field.id}
      className={cn(
        "flex items-start border rounded-md p-4 bg-white transition-all",
        isSelected ? "border-purple-500 ring-2 ring-purple-200" : "border-gray-200",
        isDragging ? "opacity-50 z-10 shadow-md" : "opacity-100",
      )}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab p-1 mr-3 text-gray-400 hover:text-gray-600 touch-none mt-1"
      >
        <GripVertical className="h-5 w-5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-col">
          <div className="flex items-center mb-1">
            <span className="font-medium">{field.label}</span>
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </div>
          <div className="text-xs text-gray-500 flex items-center">
            <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">{getFieldTypeLabel(field.type)}</span>
            {field.data?.placeholder && <span className="ml-2 truncate">Placeholder: {field.data.placeholder}</span>}
          </div>

          {/* Field preview */}
          <div className="mt-3 border-t pt-3 text-sm">{renderFieldPreview(field)}</div>
        </div>
      </div>

      <div className="flex items-center gap-1 ml-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-gray-400 hover:text-gray-600"
          onClick={(e) => {
            e.stopPropagation()
            onClick()
          }}
        >
          <Settings className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-gray-400 hover:text-gray-600"
          onClick={(e) => {
            e.stopPropagation()
            onDuplicate()
          }}
        >
          <Copy className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-gray-400 hover:text-red-500"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Improved preview renderer for canvas fields
function renderFieldPreview(field) {
  switch (field.type) {
    case "text":
    case "email":
    case "website":
      return (
        <input
          type="text"
          placeholder={field.data?.placeholder || `Enter ${field.label}`}
          className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-gray-500 bg-gray-50"
          disabled
        />
      )
    case "number":
    case "phone":
      return (
        <input
          type={field.type === "number" ? "number" : "tel"}
          placeholder={field.data?.placeholder || `Enter ${field.label}`}
          className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-gray-500 bg-gray-50"
          disabled
        />
      )
    case "textarea":
      return (
        <textarea
          placeholder={field.data?.placeholder || `Enter ${field.label}`}
          className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-gray-500 bg-gray-50"
          rows={2}
          disabled
        />
      )
    case "select":
      return (
        <select className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-gray-500 bg-gray-50" disabled>
          <option>{field.data?.placeholder || "Select an option"}</option>
          {field.data?.options?.map((option, i) => (
            <option key={i}>{option}</option>
          ))}
        </select>
      )
    case "checkbox":
      return (
        <div className="space-y-1">
          {(field.data?.options || ["Option 1", "Option 2"]).slice(0, 2).map((option, i) => (
            <div key={i} className="flex items-center">
              <input type="checkbox" className="mr-2" disabled />
              <span className="text-gray-500">{option}</span>
            </div>
          ))}
          {(field.data?.options?.length || 0) > 2 && (
            <div className="text-xs text-gray-400">+ {(field.data?.options?.length || 0) - 2} more options</div>
          )}
        </div>
      )
    case "radio":
      return (
        <div className="space-y-1">
          {(field.data?.options || ["Option 1", "Option 2"]).slice(0, 2).map((option, i) => (
            <div key={i} className="flex items-center">
              <input type="radio" className="mr-2" disabled />
              <span className="text-gray-500">{option}</span>
            </div>
          ))}
          {(field.data?.options?.length || 0) > 2 && (
            <div className="text-xs text-gray-400">+ {(field.data?.options?.length || 0) - 2} more options</div>
          )}
        </div>
      )
    case "date":
      return (
        <input
          type="date"
          className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-gray-500 bg-gray-50"
          disabled
        />
      )
    case "file":
      return (
        <input
          type="file"
          className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-gray-500 bg-gray-50"
          disabled
        />
      )
    case "rating":
      return (
        <div className="flex">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <svg
                key={i}
                className={`h-5 w-5 ${i < 3 ? "text-yellow-400" : "text-gray-300"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
        </div>
      )
    case "signature":
      return (
        <div className="border rounded-md p-3 bg-gray-50 h-20 flex items-center justify-center">
          <div className="text-center">
            <svg className="h-6 w-6 text-gray-400 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            <p className="text-xs text-gray-500">Click to sign</p>
          </div>
        </div>
      )
    case "payment":
      return (
        <div className="border rounded-md p-3 bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            <span className="font-medium text-sm">Payment Information</span>
          </div>
          <div className="text-xs text-gray-500">Amount: ${field.data?.amount || "0.00"}</div>
        </div>
      )
    case "divider":
      return <hr className="border-gray-300 my-1" />
    case "heading1":
      return <div className="font-bold text-lg text-gray-700">{field.data?.text || "Heading 1"}</div>
    case "heading2":
      return <div className="font-bold text-base text-gray-700">{field.data?.text || "Heading 2"}</div>
    case "heading3":
      return <div className="font-bold text-sm text-gray-700">{field.data?.text || "Heading 3"}</div>
    case "paragraph":
      return <div className="text-sm text-gray-500">{field.data?.text || "Paragraph text"}</div>
    case "toggle":
      return (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Toggle option</span>
          <div className="h-5 w-10 bg-gray-200 rounded-full relative">
            <div className="h-4 w-4 bg-white rounded-full absolute top-0.5 left-0.5"></div>
          </div>
        </div>
      )
    default:
      return <div className="text-sm text-gray-500 italic">Preview not available</div>
  }
}

export default FormCanvas
