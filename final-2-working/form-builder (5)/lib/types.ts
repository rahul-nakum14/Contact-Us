export type FieldType = "text" | "email" | "phone" | "textarea" | "select" | "checkbox" | "radio"

export interface FormField {
  id: string
  type: FieldType
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
  defaultValue?: string
}

export interface FormStyle {
  backgroundColor: string
  backgroundGradient: boolean
  gradientFrom?: string
  gradientTo?: string
  buttonColor: string
  buttonTextColor: string
  textColor: string
  borderColor: string
}

export interface FormSubmission {
  id: string
  formId: string
  data: Record<string, any>
  submittedAt: string
}

