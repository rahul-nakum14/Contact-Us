import { Type, Mail, AlignLeft, CheckSquare, CircleDot, Hash, Calendar, Upload, Clock } from "lucide-react"
import { ListFilter } from "lucide-react"

// Basic field types - simplified for MVP
export const basicFields = [
  {
    id: "text",
    name: "Text",
    description: "Short text like a name",
    icon: Type,
    defaultPlaceholder: "Enter text",
  },
  {
    id: "email",
    name: "Email",
    description: "Email address input",
    icon: Mail,
    defaultPlaceholder: "Enter email",
  },
  {
    id: "textarea",
    name: "Paragraph",
    description: "Long form text",
    icon: AlignLeft,
    defaultPlaceholder: "Enter paragraph text",
  },
  {
    id: "number",
    name: "Number",
    description: "Numerical input",
    icon: Hash,
    defaultPlaceholder: "Enter number",
  },
  {
    id: "select",
    name: "Dropdown",
    description: "Choose from a list",
    icon: ListFilter,
    defaultPlaceholder: "Select an option",
    defaultOptions: ["Option 1", "Option 2", "Option 3"],
  },
  {
    id: "checkbox",
    name: "Checkboxes",
    description: "Multiple choice selection",
    icon: CheckSquare,
    defaultOptions: ["Option 1", "Option 2", "Option 3"],
  },
  {
    id: "radio",
    name: "Radio Buttons",
    description: "Single choice selection",
    icon: CircleDot,
    defaultOptions: ["Option 1", "Option 2", "Option 3"],
  },
  {
    id: "date",
    name: "Date",
    description: "Date picker",
    icon: Calendar,
    defaultPlaceholder: "Select date",
  },
  {
    id: "time",
    name: "Time",
    description: "Time picker",
    icon: Clock,
    defaultPlaceholder: "Select time",
  },
  {
    id: "file",
    name: "File Upload",
    description: "File attachment field",
    icon: Upload,
    defaultPlaceholder: "Upload file",
  },
]

// Empty arrays for unused categories in MVP
export const layoutComponents = []
export const mediaComponents = []
export const advancedFields = []
