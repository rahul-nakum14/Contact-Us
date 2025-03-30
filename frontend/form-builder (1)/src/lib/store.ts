import { create } from "zustand"
import { nanoid } from "nanoid"
import { persist, createJSONStorage } from "zustand/middleware"

export type FieldType = "text" | "email" | "phone" | "textarea" | "select" | "checkbox" | "radio"

export interface FormField {
  id: string
  type: FieldType
  label: string
  placeholder?: string
  required: boolean
  options?: string[] // For select, checkbox, radio
  defaultValue?: string
}

export interface FormStyle {
  formBackgroundColor: string
  formBackgroundGradient: boolean
  formGradientFrom?: string
  formGradientTo?: string
  pageBackgroundColor: string
  pageBackgroundImage?: string
  buttonColor: string
  buttonTextColor: string
  labelColor: string
  inputBorderColor: string
  inputBackgroundColor: string
  inputTextColor: string
}

interface FormBuilderState {
  formId: string
  formTitle: string
  formDescription: string
  fields: FormField[]
  style: FormStyle
  setFormTitle: (title: string) => void
  setFormDescription: (description: string) => void
  addField: (field: Omit<FormField, "id">) => void
  updateField: (id: string, field: Partial<FormField>) => void
  removeField: (id: string) => void
  reorderFields: (startIndex: number, endIndex: number) => void
  updateStyle: (style: Partial<FormStyle>) => void
  resetForm: () => void
}

const defaultStyle: FormStyle = {
  formBackgroundColor: "#ffffff",
  formBackgroundGradient: false,
  pageBackgroundColor: "#f9fafb",
  buttonColor: "#2563eb",
  buttonTextColor: "#ffffff",
  labelColor: "#111827",
  inputBorderColor: "#d1d5db",
  inputBackgroundColor: "#ffffff",
  inputTextColor: "#111827",
}

export const useFormBuilderStore = create<FormBuilderState>()(
  persist(
    (set) => ({
      formId: nanoid(),
      formTitle: "Contact Us",
      formDescription: "We'd love to hear from you. Please fill out the form below.",
      fields: [],
      style: defaultStyle,
      setFormTitle: (title) => set({ formTitle: title }),
      setFormDescription: (description) => set({ formDescription: description }),
      addField: (field) =>
        set((state) => ({
          fields: [...state.fields, { ...field, id: nanoid() }],
        })),
      updateField: (id, field) =>
        set((state) => ({
          fields: state.fields.map((f) => (f.id === id ? { ...f, ...field } : f)),
        })),
      removeField: (id) =>
        set((state) => ({
          fields: state.fields.filter((f) => f.id !== id),
        })),
      reorderFields: (startIndex, endIndex) =>
        set((state) => {
          const newFields = [...state.fields]
          const [removed] = newFields.splice(startIndex, 1)
          newFields.splice(endIndex, 0, removed)
          return { fields: newFields }
        }),
      updateStyle: (style) =>
        set((state) => ({
          style: { ...state.style, ...style },
        })),
      resetForm: () =>
        set({
          formId: nanoid(),
          formTitle: "Contact Us",
          formDescription: "We'd love to hear from you. Please fill out the form below.",
          fields: [],
          style: defaultStyle,
        }),
    }),
    {
      name: "form-builder-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

