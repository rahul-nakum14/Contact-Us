"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Eye, Edit, BarChart2, Copy, Trash } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default function FormCard({ form, onDelete, onClone }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 line-clamp-1">{form.title}</h3>
              <p className="text-sm text-gray-500">
                Created {formatDistanceToNow(new Date(form.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 px-6 py-3">
        <div className="flex flex-wrap gap-2 w-full">
          <Link href={`/f/${form.slug}`} target="_blank" className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <Eye className="mr-1 h-3 w-3" />
              View
            </Button>
          </Link>
          <Link href={`/forms/${form._id}/edit`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <Edit className="mr-1 h-3 w-3" />
              Edit
            </Button>
          </Link>
          <Link href={`/forms/${form._id}/responses`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <BarChart2 className="mr-1 h-3 w-3" />
              Results
            </Button>
          </Link>
          {onClone && (
            <Button variant="outline" size="sm" className="flex-1" onClick={() => onClone(form._id)}>
              <Copy className="mr-1 h-3 w-3" />
              Clone
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => onDelete(form._id)}
            >
              <Trash className="mr-1 h-3 w-3" />
              Delete
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
