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
  const [focusedIndex, setFocusedIndex] = React.useState<number>(0);

  React.useLayoutEffect(() => {
    if (contentRef.current) {
      const focusableLinks = Array.from(
        contentRef.current.querySelectorAll('[data-slot="pagination-link"]')
      ) as HTMLAnchorElement[];
      const activeLinkIndex = focusableLinks.findIndex(link => link.dataset.active === 'true');
      if (activeLinkIndex !== -1) {
        setFocusedIndex(activeLinkIndex);
      } else if (focusableLinks.length > 0) {
        setFocusedIndex(0);
      }
    }
  }, []);

    const handleKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLUListElement>) => {

      const focusableLinks = Array.from(

        contentRef.current?.querySelectorAll('[data-slot="pagination-link"]') || []

      ) as HTMLAnchorElement[];

  

      // Guard: do nothing if no focusable links exist

      if (focusableLinks.length === 0) return;

  

      let newFocusedIndex = focusedIndex;

  

      if (event.key === "ArrowRight") {

        event.preventDefault();

        newFocusedIndex = (focusedIndex + 1) % focusableLinks.length;

      } else if (event.key === "ArrowLeft") {

        event.preventDefault();

        newFocusedIndex = (focusedIndex - 1 + focusableLinks.length) % focusableLinks.length;

      } else if (event.key === "Home") {

        event.preventDefault();

        newFocusedIndex = 0;

      } else if (event.key === "End") {

        event.preventDefault();

        newFocusedIndex = focusableLinks.length - 1;

      } else {

        return; // Do not update focusedIndex or focus if not a navigation key

      }

  

      setFocusedIndex(newFocusedIndex);

      focusableLinks[newFocusedIndex].focus();

    }, [focusedIndex]);

  return (
    <ul
      ref={contentRef}
      onKeyDown={handleKeyDown}
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    >
      {React.Children.map(props.children, (child, index) => {
        if (React.isValidElement(child) && child.type === PaginationLink) {
          return React.cloneElement(child, {
            tabIndex: index === focusedIndex ? 0 : -1,
          });
        }
        return child;
      })}
    </ul>
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
