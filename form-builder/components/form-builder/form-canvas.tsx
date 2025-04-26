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
            style={{
              backgroundColor: formData.styles.formStyle.backgroundColor,
              borderRadius: formData.styles.formStyle.borderRadius,
              padding: formData.styles.formStyle.padding,
            }}
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
                  Drag components from the left panel and drop them here, or click on a component to add it.
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
      time: "Time",
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
    case "time":
      return (
        <input
          type="time"
          className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-gray-500 bg-gray-50"
          disabled
        />
      )
    default:
      return <div className="text-sm text-gray-500 italic">Preview not available</div>
  }
}

export default FormCanvas
