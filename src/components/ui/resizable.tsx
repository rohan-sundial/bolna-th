import { GripHorizontalIcon, GripVerticalIcon } from "lucide-react"
import * as ResizablePrimitive from "react-resizable-panels"

import { cn } from "@/lib/utils"

function ResizablePanelGroup({
  className,
  direction = "horizontal",
  ...props
}: ResizablePrimitive.GroupProps) {
  return (
    <ResizablePrimitive.Group
      data-slot="resizable-panel-group"
      direction={direction}
      className={cn(
        "flex h-full w-full",
        direction === "vertical" && "flex-col",
        className
      )}
      {...props}
    />
  )
}

function ResizablePanel({ className, ...props }: ResizablePrimitive.PanelProps) {
  return (
    <ResizablePrimitive.Panel
      data-slot="resizable-panel"
      className={cn("overflow-hidden", className)}
      {...props}
    />
  )
}

function ResizableHandle({
  withHandle,
  direction = "horizontal",
  className,
  ...props
}: ResizablePrimitive.SeparatorProps & {
  withHandle?: boolean
  direction?: "horizontal" | "vertical"
}) {
  const isVertical = direction === "vertical"
  
  return (
    <ResizablePrimitive.Separator
      data-slot="resizable-handle"
      className={cn(
        "relative flex items-center justify-center bg-border focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:outline-hidden",
        isVertical
          ? "h-px w-full after:absolute after:inset-x-0 after:h-1 after:-translate-y-1/2"
          : "w-px h-full after:absolute after:inset-y-0 after:w-1 after:-translate-x-1/2",
        className
      )}
      {...props}
    >
      {withHandle && (
        <div className={cn(
          "z-10 flex items-center justify-center rounded-xs border bg-border",
          isVertical ? "h-3 w-6" : "h-6 w-3"
        )}>
          {isVertical ? (
            <GripHorizontalIcon className="size-2.5" />
          ) : (
            <GripVerticalIcon className="size-2.5" />
          )}
        </div>
      )}
    </ResizablePrimitive.Separator>
  )
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup }
