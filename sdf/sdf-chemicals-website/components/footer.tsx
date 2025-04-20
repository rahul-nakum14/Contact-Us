import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-6">
              <div className="relative w-12 h-12 mr-3 bg-white rounded-full p-2">
                <Image src="/logo.svg" alt="SDF Chemicals India Logo" fill className="object-contain" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-teal-400">SDF CHEMICALS</h3>
                <p className="text-xs text-gray-400">INDIA</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6">
              Leading manufacturer of high-quality chemicals serving industries across India and beyond.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://facebook.com"
                aria-label="Facebook"
                className="bg-gray-800 p-2 rounded-full hover:bg-teal-600 transition-colors duration-300"
              >
                <Image src="/facebook.svg" alt="Facebook" width={20} height={20} />
              </Link>
              <Link
                href="https://linkedin.com"
                aria-label="LinkedIn"
                className="bg-gray-800 p-2 rounded-full hover:bg-teal-600 transition-colors duration-300"
              >
                <Image src="/linkedin.svg" alt="LinkedIn" width={20} height={20} />
              </Link>
              <Link
                href="https://twitter.com"
                aria-label="Twitter"
                className="bg-gray-800 p-2 rounded-full hover:bg-teal-600 transition-colors duration-300"
              >
                <Image src="/twitter.svg" alt="Twitter" width={20} height={20} />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 border-b border-gray-700 pb-2">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-teal-400 transition-colors flex items-center">
                  <ArrowRight size={14} className="mr-2" />
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about-us"
                  className="text-gray-400 hover:text-teal-400 transition-colors flex items-center"
                >
                  <ArrowRight size={14} className="mr-2" />
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-gray-400 hover:text-teal-400 transition-colors flex items-center"
                >
                  <ArrowRight size={14} className="mr-2" />
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/infrastructure"
                  className="text-gray-400 hover:text-teal-400 transition-colors flex items-center"
                >
                  <ArrowRight size={14} className="mr-2" />
                  Infrastructure
                </Link>
              </li>
              <li>
                <Link href="/quality" className="text-gray-400 hover:text-teal-400 transition-colors flex items-center">
                  <ArrowRight size={14} className="mr-2" />
                  Quality
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-teal-400 transition-colors flex items-center">
                  <ArrowRight size={14} className="mr-2" />
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 border-b border-gray-700 pb-2">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex">
                <MapPin className="h-5 w-5 text-teal-400 mr-3 flex-shrink-0 mt-1" />
                <span className="text-gray-400">
                  Plot No.19 SR No. 223, Jawahar Nagar, Gandhidham, Gujarat 370201, India
                </span>
              </li>
              <li className="flex">
                <Phone className="h-5 w-5 text-teal-400 mr-3 flex-shrink-0" />
                <span className="text-gray-400">02836-232353</span>
              </li>
              <li className="flex">
                <Mail className="h-5 w-5 text-teal-400 mr-3 flex-shrink-0" />
                <span className="text-gray-400">info@sdfchemicalsindia.com</span>
              </li>
              <li className="flex">
                <Clock className="h-5 w-5 text-teal-400 mr-3 flex-shrink-0" />
                <span className="text-gray-400">
                  Monday - Friday: 9:00 AM - 6:00 PM
                  <br />
                  Saturday: 9:00 AM - 2:00 PM
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 border-b border-gray-700 pb-2">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter to receive updates on new products, offers, and more.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-gray-800 text-gray-300 px-4 py-2 rounded-l-md focus:outline-none focus:ring-1 focus:ring-teal-500 w-full"
              />
              <Button className="bg-teal-500 hover:bg-teal-600 rounded-l-none">Subscribe</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-950 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} SDF Chemicals India. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-4 text-sm text-gray-500">
                <li>
                  <Link href="/privacy-policy" className="hover:text-teal-400 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="hover:text-teal-400 transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/sitemap" className="hover:text-teal-400 transition-colors">
                    Sitemap
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
