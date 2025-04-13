"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, FileText, BarChart2, Users } from "lucide-react"
import { useAuth } from "@/lib/auth-provider"
import { fetchForms, fetchFormStats } from "@/lib/api"
import FormCard from "@/components/dashboard/form-card"
import StatsCard from "@/components/dashboard/stats-card"

export default function DashboardPage() {
  const { user } = useAuth()
  const [forms, setForms] = useState([])
  const [stats, setStats] = useState({
    totalForms: 0,
    totalResponses: 0,
    recentResponses: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const formsData = await fetchForms()
        setForms(formsData.slice(0, 3)) // Show only 3 most recent forms
  
        // Calculate stats
        const totalForms = formsData.length
        let totalResponses = 0
        let recentResponses = 0
  
        // Get response counts for each form
        for (const form of formsData) {
          const formStats = await fetchFormStats(form._id)
          totalResponses += formStats.totalResponses
  
          // Count responses from the last 7 days
          const lastWeek = new Date()
          lastWeek.setDate(lastWeek.getDate() - 7)
  
          // Use timeline instead of responsesPerDay
          formStats.timeline?.forEach((day) => {
            const dayDate = new Date(day.date) // Note: using day.date instead of day._id
            if (dayDate >= lastWeek) {
              recentResponses += day.count
            }
          })
        }
  
        setStats({
          totalForms,
          totalResponses,
          recentResponses,
        })
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }
  
    loadData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <Link href="/forms/new">
          <Button className="mt-4 sm:mt-0">
            <Plus className="mr-2 h-4 w-4" />
            Create new form
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Total Forms"
          value={stats.totalForms}
          description="Forms created"
          icon={<FileText className="h-5 w-5 text-purple-600" />}
        />
        <StatsCard
          title="Total Responses"
          value={stats.totalResponses}
          description="All time"
          icon={<BarChart2 className="h-5 w-5 text-purple-600" />}
        />
        <StatsCard
          title="Recent Responses"
          value={stats.recentResponses}
          description="Last 7 days"
          icon={<Users className="h-5 w-5 text-purple-600" />}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Forms</h2>
          <Link href="/forms" className="text-sm text-purple-600 hover:underline">
            View all forms
          </Link>
        </div>

        {forms.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {forms.map((form) => (
              <FormCard key={form._id} form={form} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-1">No forms yet</p>
              <p className="text-gray-500 mb-6 text-center">Create your first form to start collecting responses</p>
              <Link href="/forms/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create new form
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
