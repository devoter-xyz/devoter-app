import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-lg border border-transparent bg-brand-purple/10 px-3 py-1.5 text-sm font-medium text-brand-purple w-fit whitespace-nowrap shrink-0 [&>svg]:size-4 gap-1.5 [&>svg]:pointer-events-none transition-colors overflow-hidden ml-2",
  {
    variants: {
      variant: {
        default:
          "bg-brand-purple/10 text-brand-purple hover:bg-brand-purple/20",
        secondary:
          "bg-secondary/10 text-secondary-foreground hover:bg-secondary/20",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20",
        outline:
          "border-border bg-transparent hover:bg-accent hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
