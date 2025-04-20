"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { name: "HOME", path: "/" },
    { name: "ABOUT US", path: "/about-us" },
    { name: "PRODUCTS", path: "/products" },
    { name: "INFRASTRUCTURE", path: "/infrastructure" },
    { name: "QUALITY", path: "/quality" },
    { name: "LOGISTICS", path: "/logistics" },
    { name: "CONTACT US", path: "/contact" },
  ]

  return (
    <nav className="bg-zinc-800 text-white">
      <div className="container mx-auto px-4">
        <ul className="flex flex-wrap justify-center md:justify-start">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.path}
                className={`block px-4 py-4 hover:bg-emerald-600 transition-colors ${
                  pathname === item.path ? "bg-emerald-600" : ""
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
