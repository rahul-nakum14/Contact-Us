"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-provider"
import Sidebar from "@/components/dashboard/sidebar"
import Header from "@/components/dashboard/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Check if we're in the form builder
  const isFormBuilder = pathname.includes("/forms/new") || (pathname.includes("/forms/") && pathname.includes("/edit"))

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }

    // Check initial sidebar state
    const isCollapsed = localStorage.getItem("sidebar-collapsed") === "true"
    setSidebarCollapsed(isCollapsed)

    // Listen for sidebar toggle events
    const handleSidebarToggle = () => {
      const newState = localStorage.getItem("sidebar-collapsed") === "true"
      setSidebarCollapsed(newState)
    }

    window.addEventListener("sidebarToggled", handleSidebarToggle)
    window.addEventListener("storage", (e) => {
      if (e.key === "sidebar-collapsed") {
        handleSidebarToggle()
      }
    })

    return () => {
      window.removeEventListener("sidebarToggled", handleSidebarToggle)
      window.removeEventListener("storage", handleSidebarToggle)
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // For form builder pages, render without dashboard layout
  if (isFormBuilder) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div
        className="flex-1 flex flex-col transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? "3.5rem" : "15rem" }}
      >
        <Header />
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
