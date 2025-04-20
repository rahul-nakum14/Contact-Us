"use client"

import { useState } from "react"
import { useDraggable } from "@dnd-kit/core"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ComponentCategory({ title, components, color, textColor, onAddComponent }) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="space-y-2 mb-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center text-sm font-medium hover:text-gray-900 w-full text-left"
        >
          {isExpanded ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />}
          {title}
        </button>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-2 gap-2">
          {components.map((component) => (
            <ComponentItem
              key={component.id}
              component={component}
              color={color}
              textColor={textColor}
              onAddComponent={() => onAddComponent(component.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ComponentItem({ component, color, textColor, onAddComponent }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${component.id}`,
    data: {
      type: "palette-item",
      component,
    },
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "flex flex-col items-center p-2 rounded-md cursor-grab transition-all",
        color,
        isDragging ? "opacity-50 ring-2 ring-purple-300" : "hover:ring-2 hover:ring-purple-300",
      )}
    >
      <div className="flex items-center justify-between w-full mb-1">
        <div className="flex items-center">
          <component.icon className={cn("h-4 w-4 mr-2", textColor)} />
          <span className="text-xs font-medium">{component.name}</span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-5 w-5 rounded-full hover:bg-white/50"
          onClick={(e) => {
            e.stopPropagation()
            onAddComponent()
          }}
        >
          <Plus className="h-3 w-3" />
          <span className="sr-only">Add {component.name}</span>
        </Button>
      </div>
      <p className="text-xs text-gray-600 w-full truncate">{component.description}</p>
    </div>
  )
}
