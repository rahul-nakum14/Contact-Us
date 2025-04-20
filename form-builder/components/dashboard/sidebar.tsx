"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/lib/auth-provider"
import { ChevronLeft, ChevronRight, LayoutDashboard, FileText, Settings, LogOut, User } from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  // Initialize collapsed state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("sidebar-collapsed")
    if (savedState) {
      setCollapsed(savedState === "true")
    }
  }, [])

  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    const newState = !collapsed
    setCollapsed(newState)
    localStorage.setItem("sidebar-collapsed", String(newState))

    // Dispatch custom event for other components to react
    window.dispatchEvent(new Event("sidebarToggled"))
  }

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-20 h-full bg-white border-r transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-between border-b px-4">
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-purple-600">FormBuilder</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className={cn("h-8 w-8", collapsed && "mx-auto")}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-1 px-2">
            <NavItem
              href="/dashboard"
              icon={LayoutDashboard}
              label="Dashboard"
              active={pathname === "/dashboard"}
              collapsed={collapsed}
            />
            <NavItem
              href="/forms"
              icon={FileText}
              label="Forms"
              active={pathname === "/forms" || pathname.startsWith("/forms/")}
              collapsed={collapsed}
            />
            <NavItem
              href="/settings"
              icon={Settings}
              label="Settings"
              active={pathname === "/settings"}
              collapsed={collapsed}
            />
          </nav>
        </ScrollArea>

        <div className="border-t p-4">
          <div className={cn("flex items-center", collapsed ? "justify-center" : "justify-between")}>
            {!collapsed && (
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <User className="h-4 w-4 text-purple-600" />
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium">{user?.name || "User"}</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size={collapsed ? "icon" : "sm"}
              onClick={logout}
              className={cn(collapsed && "mx-auto")}
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && <span className="ml-2">Logout</span>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function NavItem({ href, icon: Icon, label, active, collapsed }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active ? "bg-purple-50 text-purple-600" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
        collapsed && "justify-center px-2",
      )}
    >
      <Icon className={cn("h-5 w-5", active ? "text-purple-600" : "text-gray-500")} />
      {!collapsed && <span className="ml-3">{label}</span>}
    </Link>
  )
}
