import { create } from "zustand"
import { persist } from "zustand/middleware"
import { nanoid } from "nanoid"
import type { FormField, FormStyle } from "./types"

interface FormState {
  id: string
  userId: string | null
  title: string
  description: string
  fields: FormField[]
  style: FormStyle
  createdAt: string
  updatedAt: string
  expiresAt: string | null

  // Actions
  setTitle: (title: string) => void
  setDescription: (description: string) => void
  addField: (field: Omit<FormField, "id">) => void
  updateField: (id: string, updates: Partial<FormField>) => void
  removeField: (id: string) => void
  reorderFields: (sourceIndex: number, destinationIndex: number) => void
  updateStyle: (updates: Partial<FormStyle>) => void
  setExpirationDate: (date: string | null) => void
  resetForm: () => void
  loadForm: (formId: string) => boolean
  saveForm: () => void
}

const defaultStyle: FormStyle = {
  backgroundColor: "#ffffff",
  backgroundGradient: false,
  gradientFrom: "#ffffff",
  gradientTo: "#f9fafb",
  buttonColor: "#2563eb",
  buttonTextColor: "#ffffff",
  textColor: "#111827",
  borderColor: "#e5e7eb",
}

export const useFormStore = create<FormState>()(
  persist(
    (set, get) => ({
      id: nanoid(),
      userId: null,
      title: "Untitled Form",
      description: "Form description",
      fields: [],
      style: defaultStyle,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      expiresAt: null,

      setTitle: (title) =>
        set({
          title,
          updatedAt: new Date().toISOString(),
        }),

      setDescription: (description) =>
        set({
          description,
          updatedAt: new Date().toISOString(),
        }),

      addField: (field) =>
        set((state) => ({
          fields: [...state.fields, { ...field, id: nanoid() }],
          updatedAt: new Date().toISOString(),
        })),

      updateField: (id, updates) =>
        set((state) => ({
          fields: state.fields.map((field) => (field.id === id ? { ...field, ...updates } : field)),
          updatedAt: new Date().toISOString(),
        })),

      removeField: (id) =>
        set((state) => ({
          fields: state.fields.filter((field) => field.id !== id),
          updatedAt: new Date().toISOString(),
        })),

      reorderFields: (sourceIndex, destinationIndex) =>
        set((state) => {
          const newFields = [...state.fields]
          const [removed] = newFields.splice(sourceIndex, 1)
          newFields.splice(destinationIndex, 0, removed)

          return {
            fields: newFields,
            updatedAt: new Date().toISOString(),
          }
        }),

      updateStyle: (updates) =>
        set((state) => ({
          style: { ...state.style, ...updates },
          updatedAt: new Date().toISOString(),
        })),

      setExpirationDate: (date) =>
        set({
          expiresAt: date,
          updatedAt: new Date().toISOString(),
        }),

      resetForm: () =>
        set({
          id: nanoid(),
          title: "Untitled Form",
          description: "Form description",
          fields: [],
          style: defaultStyle,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          expiresAt: null,
        }),

      loadForm: (formId) => {
        try {
          // In a real app, this would fetch from an API
          const storedForms = localStorage.getItem("form-data")
          if (!storedForms) return false

          const forms = JSON.parse(storedForms)
          const form = forms.find((f: any) => f.id === formId)

          if (!form) return false

          set({
            id: form.id,
            userId: form.userId,
            title: form.title,
            description: form.description,
            fields: form.fields,
            style: form.style,
            createdAt: form.createdAt,
            updatedAt: form.updatedAt,
            expiresAt: form.expiresAt,
          })

          return true
        } catch (error) {
          console.error("Error loading form:", error)
          return false
        }
      },

      saveForm: () => {
        try {
          const form = get()
          const storedForms = localStorage.getItem("form-data")
          const forms = storedForms ? JSON.parse(storedForms) : []

          // Check if form already exists
          const existingFormIndex = forms.findIndex((f: any) => f.id === form.id)

          if (existingFormIndex >= 0) {
            // Update existing form
            forms[existingFormIndex] = {
              ...form,
              updatedAt: new Date().toISOString(),
            }
          } else {
            // Add new form
            forms.push({
              ...form,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            })
          }

          localStorage.setItem("form-data", JSON.stringify(forms))
        } catch (error) {
          console.error("Error saving form:", error)
        }
      },
    }),
    {
      name: "form-builder-storage",
    },
  ),
)

