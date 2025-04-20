import Image from "next/image"
import Link from "next/link"
import { MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import ContactForm from "@/components/contact-form"

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-cyan-600 to-teal-500 text-white py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/90 to-teal-500/90"></div>
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
            <p className="text-xl opacity-90 mb-8">
              We're here to help with all your chemical needs. Reach out to us for inquiries, quotes, or any information
              about our products and services.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-white text-teal-600 hover:bg-gray-100">Request a Quote</Button>
              <Button variant="outline" className="text-white border-white hover:bg-white/10">
                View Our Products
              </Button>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="container mx-auto px-4 mt-12 relative z-10">
          <div className="flex items-center text-sm">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <ArrowRight size={12} className="mx-2" />
            <span>Contact</span>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-20 relative z-20">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="h-2 bg-cyan-500"></div>
              <CardContent className="p-6">
                <div className="flex items-start">
                  <div className="bg-cyan-100 p-3 rounded-full mr-4">
                    <Phone className="h-6 w-6 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Call Us</h3>
                    <p className="text-gray-500 mb-4">We're available Monday to Saturday, 9am to 6pm</p>
                    <p className="text-gray-700 font-medium">02836-232353</p>
                    <p className="text-gray-700 font-medium">+91 98250 10264</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="h-2 bg-teal-500"></div>
              <CardContent className="p-6">
                <div className="flex items-start">
                  <div className="bg-teal-100 p-3 rounded-full mr-4">
                    <Mail className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Email Us</h3>
                    <p className="text-gray-500 mb-4">Send us an email and we'll get back to you</p>
                    <p className="text-gray-700 font-medium">info@sdfchemicalsindia.com</p>
                    <p className="text-gray-700 font-medium">sales@sdfchemicalsindia.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="h-2 bg-cyan-500"></div>
              <CardContent className="p-6">
                <div className="flex items-start">
                  <div className="bg-cyan-100 p-3 rounded-full mr-4">
                    <Clock className="h-6 w-6 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Business Hours</h3>
                    <p className="text-gray-500 mb-4">Our office working hours</p>
                    <p className="text-gray-700">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p className="text-gray-700">Saturday: 9:00 AM - 2:00 PM</p>
                    <p className="text-gray-700">Sunday: Closed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form and Offices */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-2 text-gray-800">Send Us a Message</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-teal-500 mb-6"></div>
              <p className="text-gray-600 mb-8">
                Have questions about our products or services? Fill out the form below and our team will get back to you
                as soon as possible.
              </p>

              <ContactForm />
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-2 text-gray-800">Our Offices</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-teal-500 mb-6"></div>

              <div className="space-y-8">
                <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-teal-600">Plant Address</h3>
                    <div className="flex">
                      <MapPin className="h-5 w-5 text-teal-500 mr-3 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-medium text-gray-800">SDF CHEMICALS INDIA</p>
                        <p className="text-gray-600">Plot No.19 SR No. 223</p>
                        <p className="text-gray-600">Jawahar Nagar, Chudiwa,</p>
                        <p className="text-gray-600">Gandhidham Gujarat 370201</p>
                        <p className="text-gray-600">INDIA</p>
                        <p className="text-gray-600 mt-2">
                          <span className="font-medium">Phone:</span> 02836-232353
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-cyan-600">Gandhidham Office</h3>
                    <div className="flex">
                      <MapPin className="h-5 w-5 text-cyan-500 mr-3 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-medium text-gray-800">SDF CHEMICALS INDIA</p>
                        <p className="text-gray-600">54, 2nd Floor Ratnakala Arcade,</p>
                        <p className="text-gray-600">Plot No. 231, Ward 12/B,</p>
                        <p className="text-gray-600">Gandhidham Kutch, Gujarat</p>
                        <p className="text-gray-600">370201, India.</p>
                        <p className="text-gray-600 mt-2">
                          <span className="font-medium">Phone:</span> 02836-232353
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-teal-600">Anjar Plant</h3>
                    <div className="flex">
                      <MapPin className="h-5 w-5 text-teal-500 mr-3 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-medium text-gray-800">SDF CHEMICALS INDIA</p>
                        <p className="text-gray-600">Plot No. 1 to 5, Survey No. 516,</p>
                        <p className="text-gray-600">Bhimasar, Anjar</p>
                        <p className="text-gray-600">Kutch Gujarat - 370240</p>
                        <p className="text-gray-600 mt-2">
                          <span className="font-medium">Phone:</span> 02836-232353
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2 text-gray-800">Find Us on the Map</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-teal-500 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Visit our facilities in Gandhidham and Anjar. We're conveniently located to serve all your chemical needs.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="aspect-w-16 aspect-h-9 relative h-[400px]">
              <Image src="/map-placeholder.jpg" alt="SDF Chemicals India Location Map" fill className="object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Button className="bg-white text-teal-600 hover:bg-gray-100">View on Google Maps</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
