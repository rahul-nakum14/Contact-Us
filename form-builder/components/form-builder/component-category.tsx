"use client"

import { useDraggable } from "@dnd-kit/core"
import { cn } from "@/lib/utils"

export default function ComponentCategory({ title, components, color, textColor }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="grid grid-cols-1 gap-2">
        {components.map((component) => (
          <DraggableComponent key={component.id} component={component} color={color} textColor={textColor} />
        ))}
      </div>
    </div>
  )
}

function DraggableComponent({ component, color, textColor }) {
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
      {...attributes}
      {...listeners}
      className={cn(
        "flex items-center gap-2 p-3 border rounded-md cursor-grab bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors",
        isDragging ? "opacity-50" : "",
      )}
    >
      <div className={cn("h-8 w-8 rounded-md flex items-center justify-center", color)}>
        {component.icon && <component.icon className={cn("h-4 w-4", textColor)} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm">{component.name}</div>
        <div className="text-xs text-gray-500 truncate">{component.description}</div>
      </div>
    </div>
  )
}
