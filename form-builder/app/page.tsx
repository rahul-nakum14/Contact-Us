import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, Layers, Palette } from "lucide-react"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Layers className="h-6 w-6 text-purple-600" />
            <span className="text-xl font-bold">FormCraft</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-sm font-medium hover:text-purple-600">
              Log in
            </Link>
            <Link href="/signup">
              <Button>Sign up free</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-white to-purple-50 py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2 space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  Create beautiful forms in minutes, not hours
                </h1>
                <p className="text-lg text-gray-600 max-w-lg">
                  FormCraft helps you build stunning, customizable forms with an intuitive drag-and-drop interface.
                  Collect responses, analyze data, and share your forms with the world.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link href="/signup">
                    <Button size="lg" className="w-full sm:w-auto">
                      Get started for free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Log in
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="lg:w-1/2 relative">
                <div className="bg-white rounded-lg shadow-xl p-4 border border-gray-200">
                  <div className="aspect-video relative overflow-hidden rounded-md">
                    <Image
                      src="/placeholder.svg?height=720&width=1280"
                      alt="Form Builder Interface"
                      width={640}
                      height={360}
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Everything you need to create perfect forms</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                FormCraft combines powerful features with an intuitive interface to help you build forms that convert.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Layers className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Drag & Drop Builder</h3>
                <p className="text-gray-600">
                  Easily add, reorder, and customize form fields with our intuitive drag-and-drop interface. No coding
                  required.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Palette className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Beautiful Styling</h3>
                <p className="text-gray-600">
                  Customize colors, backgrounds, and styles to match your brand. Create forms that look professional and
                  engaging.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Response Analytics</h3>
                <p className="text-gray-600">
                  Collect and analyze form submissions with powerful analytics. Export data in CSV or JSON format.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-purple-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to create your first form?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of users who are building beautiful forms with FormCraft.
            </p>
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                Get started for free
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Layers className="h-5 w-5 text-purple-600" />
              <span className="text-lg font-bold">FormCraft</span>
            </div>
            <div className="text-sm text-gray-500">© {new Date().getFullYear()} FormCraft. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
