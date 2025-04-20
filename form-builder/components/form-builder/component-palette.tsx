"use client"

import { useDraggable } from "@dnd-kit/core"

export default function ComponentPalette({ components }) {
  return (
    <div className="grid grid-cols-1 gap-2">
      {components.map((component) => (
        <DraggableComponent key={component.id} component={component} />
      ))}
    </div>
  )
}

function DraggableComponent({ component }) {
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
      className={`flex items-center gap-2 p-3 border rounded-md cursor-grab bg-white hover:bg-purple-50 hover:border-purple-200 transition-colors ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      {component.icon && <component.icon className="h-4 w-4 text-purple-600 flex-shrink-0" />}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm">{component.name}</div>
        {component.description && <div className="text-xs text-gray-500 truncate">{component.description}</div>}
      </div>
    </div>
  )
}
