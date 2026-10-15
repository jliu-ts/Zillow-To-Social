import * as React from "react"
import { cn } from "cn"
import { CaretDown, Check } from "@phosphor-icons/react"

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  icon?: React.ReactNode
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={cn(
            "w-full appearance-none rounded-md border border-[#e5e7eb] bg-white px-3 py-2 pr-8 text-xs font-medium text-[#0a1317] shadow-xs transition-colors focus:border-[#0a1317] focus:outline-none focus:ring-1 focus:ring-[#0a1317] disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <CaretDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#5d6c7b]" />
      </div>
    )
  }
)
Select.displayName = "Select"

export { Select }
