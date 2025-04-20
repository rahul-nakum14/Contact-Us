"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about-us" },
  {
    name: "Products",
    path: "/products",
    submenu: [
      { name: "Product Category 1", path: "/products/category-1" },
      { name: "Product Category 2", path: "/products/category-2" },
      { name: "Product Category 3", path: "/products/category-3" },
    ],
  },
  { name: "Infrastructure", path: "/infrastructure" },
  { name: "Quality", path: "/quality" },
  { name: "Logistics", path: "/logistics" },
  { name: "Contact Us", path: "/contact", active: true },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleSubmenu = (name: string) => {
    setActiveSubmenu(activeSubmenu === name ? null : name)
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-transparent",
      )}
    >
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-cyan-600 to-teal-500 text-white py-2">
        <div className="container mx-auto px-4 flex flex-wrap justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Phone size={16} className="mr-2" />
              <span className="text-sm">02836-232353</span>
            </div>
            <div className="flex items-center">
              <Mail size={16} className="mr-2" />
              <span className="text-sm">info@sdfchemicalsindia.com</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="https://wa.me/919825010264" className="flex items-center hover:text-cyan-100 transition-colors">
              <Image src="/whatsapp.svg" alt="WhatsApp" width={16} height={16} className="mr-1" />
              <span className="text-sm">+91 98250 10264</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Link href="https://facebook.com" aria-label="Facebook" className="hover:opacity-80 transition-opacity">
                <Image src="/facebook.svg" alt="Facebook" width={16} height={16} />
              </Link>
              <Link href="https://linkedin.com" aria-label="LinkedIn" className="hover:opacity-80 transition-opacity">
                <Image src="/linkedin.svg" alt="LinkedIn" width={16} height={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className={cn("container mx-auto px-4 py-4 transition-all duration-300", isScrolled ? "py-2" : "py-4")}>
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <div className="relative w-12 h-12 mr-3">
              <Image src="/logo.svg" alt="SDF Chemicals India Logo" fill className="object-contain" priority />
            </div>
            <div>
              <h1 className="text-xl font-bold text-teal-600">SDF CHEMICALS</h1>
              <p className="text-xs text-gray-500">INDIA</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:block">
            <ul className="flex items-center space-x-1">
              {navItems.map((item) => (
                <li key={item.name} className="relative group">
                  {item.submenu ? (
                    <button
                      onClick={() => toggleSubmenu(item.name)}
                      className={cn(
                        "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        item.active ? "bg-teal-500 text-white" : "text-gray-700 hover:bg-teal-50 hover:text-teal-600",
                      )}
                    >
                      {item.name}
                      <ChevronDown size={16} className="ml-1" />
                    </button>
                  ) : (
                    <Link
                      href={item.path}
                      className={cn(
                        "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        item.active ? "bg-teal-500 text-white" : "text-gray-700 hover:bg-teal-50 hover:text-teal-600",
                      )}
                    >
                      {item.name}
                    </Link>
                  )}

                  {item.submenu && (
                    <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="py-1">
                        {item.submenu.map((subitem) => (
                          <Link
                            key={subitem.name}
                            href={subitem.path}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600"
                          >
                            {subitem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              ))}
              <li>
                <Button className="ml-2 bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-teal-600">
                  Get a Quote
                </Button>
              </li>
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-2">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  {item.submenu ? (
                    <div>
                      <button
                        onClick={() => toggleSubmenu(item.name)}
                        className={cn(
                          "flex items-center justify-between w-full px-3 py-2 rounded-md text-sm font-medium transition-colors",
                          item.active ? "bg-teal-500 text-white" : "text-gray-700 hover:bg-teal-50 hover:text-teal-600",
                        )}
                      >
                        {item.name}
                        <ChevronDown
                          size={16}
                          className={cn(
                            "transition-transform duration-200",
                            activeSubmenu === item.name ? "rotate-180" : "",
                          )}
                        />
                      </button>

                      {activeSubmenu === item.name && (
                        <div className="mt-1 ml-4 border-l-2 border-teal-200 pl-4">
                          {item.submenu.map((subitem) => (
                            <Link
                              key={subitem.name}
                              href={subitem.path}
                              className="block px-3 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600 rounded-md"
                            >
                              {subitem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.path}
                      className={cn(
                        "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        item.active ? "bg-teal-500 text-white" : "text-gray-700 hover:bg-teal-50 hover:text-teal-600",
                      )}
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
              <li className="pt-2">
                <Button className="w-full bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-teal-600">
                  Get a Quote
                </Button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  )
}
