import { Type, Mail, AlignLeft, List, CheckSquare, CircleDot, Hash, Calendar, Phone, Upload, Clock } from "lucide-react"

// Basic field types - simplified for MVP
export const basicFields = [
  {
    id: "text",
    name: "Text Field",
    icon: Type,
    description: "Short answer text",
    defaultPlaceholder: "Enter text here",
  },
  {
    id: "email",
    name: "Email",
    icon: Mail,
    description: "Email address",
    defaultPlaceholder: "Enter your email",
  },
  {
    id: "textarea",
    name: "Text Area",
    icon: AlignLeft,
    description: "Long answer text",
    defaultPlaceholder: "Enter your message here",
  },
  {
    id: "select",
    name: "Dropdown",
    icon: List,
    description: "Select from options",
    defaultPlaceholder: "Select an option",
    defaultOptions: ["Option 1", "Option 2", "Option 3"],
  },
  {
    id: "checkbox",
    name: "Checkbox Group",
    icon: CheckSquare,
    description: "Multiple choice",
    defaultOptions: ["Option 1", "Option 2", "Option 3"],
  },
  {
    id: "radio",
    name: "Radio Group",
    icon: CircleDot,
    description: "Single choice",
    defaultOptions: ["Option 1", "Option 2", "Option 3"],
  },
  {
    id: "number",
    name: "Number",
    icon: Hash,
    description: "Numeric input",
    defaultPlaceholder: "Enter a number",
  },
  {
    id: "date",
    name: "Date",
    icon: Calendar,
    description: "Date picker",
  },
  {
    id: "phone",
    name: "Phone",
    icon: Phone,
    description: "Phone number",
    defaultPlaceholder: "Enter your phone number",
  },
  {
    id: "file",
    name: "File Upload",
    icon: Upload,
    description: "File attachment",
  },
  {
    id: "time",
    name: "Time",
    icon: Clock,
    description: "Time picker",
  },
]

// Empty arrays for unused categories in MVP
export const layoutComponents = []
export const mediaComponents = []
export const advancedFields = []
