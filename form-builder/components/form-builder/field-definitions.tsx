import {
  Type,
  Mail,
  AlignLeft,
  List,
  CheckSquare,
  CircleDot,
  Hash,
  Calendar,
  Phone,
  Upload,
  Clock,
  SeparatorHorizontal,
  ImageIcon,
  FileVideo,
  FileAudio,
  Code,
  Heading1,
  Heading2,
  Heading3,
  NotepadTextIcon as Paragraph,
} from "lucide-react"

// Basic field types - Added Time to basic fields as requested
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

// Layout components - Removed unnecessary fields as requested
export const layoutComponents = [
  {
    id: "heading1",
    name: "Heading 1",
    icon: Heading1,
    description: "Large heading",
    defaultData: {
      text: "Heading 1",
    },
  },
  {
    id: "heading2",
    name: "Heading 2",
    icon: Heading2,
    description: "Medium heading",
    defaultData: {
      text: "Heading 2",
    },
  },
  {
    id: "heading3",
    name: "Heading 3",
    icon: Heading3,
    description: "Small heading",
    defaultData: {
      text: "Heading 3",
    },
  },
  {
    id: "paragraph",
    name: "Paragraph",
    icon: Paragraph,
    description: "Text paragraph",
    defaultData: {
      text: "Enter your text here",
    },
  },
  {
    id: "divider",
    name: "Divider",
    icon: SeparatorHorizontal,
    description: "Horizontal separator",
  },
]

// Media components - Kept all media components as requested
export const mediaComponents = [
  {
    id: "image",
    name: "Image",
    icon: ImageIcon,
    description: "Display an image",
    defaultData: {
      url: "",
      alt: "Image description",
      width: 300,
      height: 200,
    },
  },
  {
    id: "video",
    name: "Video",
    icon: FileVideo,
    description: "Embed a video",
    defaultData: {
      url: "",
      width: 560,
      height: 315,
    },
  },
  {
    id: "audio",
    name: "Audio",
    icon: FileAudio,
    description: "Embed audio",
    defaultData: {
      url: "",
    },
  },
  {
    id: "embed",
    name: "Embed",
    icon: Code,
    description: "Embed external content",
    defaultData: {
      code: "",
      width: "100%",
      height: 300,
    },
  },
]

export const advancedFields = []
