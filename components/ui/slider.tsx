import * as React from "react"
import { cn } from "cn"

interface SliderProps extends Omit<React.ComponentProps<"input">, "onChange" | "value"> {
  value: number
  min?: number
  max?: number
  step?: number
  onValueChange?: (val: number) => void
}

function Slider({
  className,
  value,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  ...props
}: SliderProps) {
  const percentage = Math.min(Math.max(0, ((value - min) / (max - min)) * 100), 100)

  return (
    <div className={cn("relative flex w-full touch-none select-none items-center", className)}>
      <div className="relative h-2 w-full grow overflow-hidden rounded-full bg-[#f1f4f7] border border-[#dee3e9]">
        <div
          className="absolute h-full bg-[#0064e0]"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onValueChange?.(Number(e.target.value))}
        className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
        {...props}
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-4 rounded-full border-2 border-[#0064e0] bg-white shadow-sm pointer-events-none transition-transform active:scale-110"
        style={{ left: `${percentage}%` }}
      />
    </div>
  )
}

export { Slider }
