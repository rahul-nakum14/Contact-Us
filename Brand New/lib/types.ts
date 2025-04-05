export type FieldType = "text" | "email" | "phone" | "textarea" | "select" | "checkbox" | "radio" | "name"

export interface FormField {
  id: string
  type: FieldType
  label: string
  placeholder: string
  required: boolean
  options?: string[]
}

export interface FormStyle {
  backgroundColor: string
  backgroundType: "solid" | "gradient"
  backgroundGradient: string
  borderRadius: string | number
  padding: string | number
  fontFamily: string
  buttonColor: string
  buttonTextColor: string
}

export interface Form {
  id: string
  userId: string
  title: string
  fields: FormField[]
  style: FormStyle
  createdAt: Date
  updatedAt: Date
  expiresAt?: Date
  isPublished: boolean
  shareUrl?: string
}

export interface FormResponse {
  id: string
  formId: string
  data: Record<string, any>
  createdAt: Date
  ipAddress?: string
  userAgent?: string
}

export interface User {
  id: string
  name: string
  email: string
  image?: string
  createdAt: Date
  updatedAt: Date
}

