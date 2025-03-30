import { FormBuilder } from "@/components/form-builder"

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Contact Form Builder</h1>
        <p className="text-muted-foreground mb-8">
          Create custom contact forms with drag and drop functionality, live preview, and sharing capabilities.
        </p>
        <FormBuilder />
      </div>
    </main>
  )
}

