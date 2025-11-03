import * as React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  const contentRef = React.useRef<HTMLUListElement>(null);

  const handleKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLUListElement>) => {
    const focusableLinks = Array.from(
      contentRef.current?.querySelectorAll('[data-slot="pagination-link"]') || []
    ) as HTMLAnchorElement[];
    const activeElement = document.activeElement as HTMLAnchorElement;
    const currentIndex = focusableLinks.indexOf(activeElement);

    if (event.key === "ArrowRight") {
      event.preventDefault();
      if (currentIndex < focusableLinks.length - 1) {
        focusableLinks[currentIndex + 1].focus();
      } else {
        focusableLinks[0].focus(); // Loop to the first item
      }
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      if (currentIndex > 0) {
        focusableLinks[currentIndex - 1].focus();
      } else {
        focusableLinks[focusableLinks.length - 1].focus(); // Loop to the last item
      }
    } else if (event.key === "Home") {
      event.preventDefault();
      focusableLinks[0].focus();
    } else if (event.key === "End") {
      event.preventDefault();
      focusableLinks[focusableLinks.length - 1].focus();
    }
  }, []);

  return (
    <ul
      ref={contentRef}
      onKeyDown={handleKeyDown}
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      tabIndex={isActive ? -1 : 0}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className
      )}
      {...props}
    />
  )
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon />
    </PaginationLink>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}
