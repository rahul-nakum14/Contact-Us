"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function ResponsesTable({ responses, fields }) {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter responses based on search term
  const filteredResponses = responses.filter((response) => {
    if (!searchTerm) return true

    // Search in all response data
    return Object.values(response.data).some(
      (value) => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
    )
  })

  // Get field IDs to display as columns
  const fieldIds = fields.map((field) => field.id)

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search responses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="rounded-md border overflow-hidden">
          <div className="max-h-[600px] overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-white">
                <TableRow>
                  <TableHead className="w-[100px]">Date</TableHead>
                  {fields.map((field) => (
                    <TableHead key={field.id}>{field.label}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResponses.length > 0 ? (
                  filteredResponses.map((response) => (
                    <TableRow key={response._id}>
                      <TableCell className="font-medium">{formatDate(response.createdAt)}</TableCell>
                      {fieldIds.map((fieldId) => (
                        <TableCell key={fieldId}>{renderResponseValue(response.data[fieldId])}</TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={fieldIds.length + 1} className="h-24 text-center">
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function renderResponseValue(value) {
  if (value === undefined || value === null) {
    return "-"
  }

  if (Array.isArray(value)) {
    return value.join(", ")
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No"
  }

  return value.toString()
}
