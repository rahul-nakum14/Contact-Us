"use client"

import type React from "react"

import { useEffect } from "react"
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

  // Check if we're in the form builder
  const isFormBuilder = pathname.includes("/forms/new") || (pathname.includes("/forms/") && pathname.includes("/edit"))

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
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
        style={{ marginLeft: "var(--sidebar-width, 16rem)" }}
      >
        <Header />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>

      {/* Add script to adjust main content based on sidebar state */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              function adjustLayout() {
                const isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
                document.documentElement.style.setProperty('--sidebar-width', isCollapsed ? '4rem' : '16rem');
              }
              
              adjustLayout();
              
              // Listen for storage events to detect sidebar changes
              window.addEventListener('storage', function(e) {
                if (e.key === 'sidebar-collapsed') {
                  adjustLayout();
                }
              });

              // Also listen for custom event from sidebar toggle
              window.addEventListener('sidebarToggled', adjustLayout);
            })();
          `,
        }}
      />
    </div>
  )
}
