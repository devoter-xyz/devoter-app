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

interface PaginationContextType {
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  registerLink: (linkElement: HTMLAnchorElement) => number;
  unregisterLink: (index: number) => void;
  focusLink: (index: number) => void;
}

const PaginationContext = React.createContext<PaginationContextType | null>(null);

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  const contentRef = React.useRef<HTMLUListElement>(null);
  const [focusedIndex, setFocusedIndex] = React.useState<number>(0);
  const linksRef = React.useRef<HTMLAnchorElement[]>([]);

  const registerLink = React.useCallback((linkElement: HTMLAnchorElement) => {
    linksRef.current.push(linkElement);
    return linksRef.current.length - 1;
  }, []);

  const unregisterLink = React.useCallback((index: number) => {
    linksRef.current.splice(index, 1);
  }, []);

  const focusLink = React.useCallback((index: number) => {
    if (linksRef.current[index]) {
      linksRef.current[index].focus();
    }
  }, []);

  React.useLayoutEffect(() => {
    if (contentRef.current) {
      const focusableLinks = Array.from(
        contentRef.current.querySelectorAll('[data-slot="pagination-link"]:not([disabled])')
      ) as HTMLAnchorElement[];

      linksRef.current = focusableLinks;

      // Always set focusedIndex to 0 initially if there are focusable links
      if (focusableLinks.length > 0) {
        setFocusedIndex(0);
      }
    }
  }, [props.children]);

  const handleKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLUListElement>) => {
    const focusableLinks = Array.from(
      contentRef.current?.querySelectorAll('[data-slot="pagination-link"]:not([disabled])') || []
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
    focusLink(newFocusedIndex);
  }, [focusedIndex, focusLink]);

  return (
    <PaginationContext.Provider value={{ focusedIndex, setFocusedIndex, registerLink, unregisterLink, focusLink }}>
      <ul
        ref={contentRef}
        onKeyDown={handleKeyDown}
        data-slot="pagination-content"
        className={cn("flex flex-row items-center gap-1", className)}
        {...props}
      >
        {props.children}
      </ul>
    </PaginationContext.Provider>
  )
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean;
  disabled?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  Omit<React.ComponentProps<"a">, "ref">;

const PaginationLink = React.forwardRef<HTMLAnchorElement, PaginationLinkProps>(
  ({ className, isActive, size = "icon", disabled, ...props }, ref) => {
    const context = React.useContext(PaginationContext);
    const linkRef = React.useRef<HTMLAnchorElement>(null);
    const [linkIndex, setLinkIndex] = React.useState<number>(-1);

    React.useEffect(() => {
      if (context && linkRef.current) {
        const index = context.registerLink(linkRef.current);
        setLinkIndex(index);
        return () => {
          context.unregisterLink(index);
        };
      }
      return undefined;
    }, [context]);

    const tabIndex = context && linkIndex === context.focusedIndex && !disabled ? 0 : -1;

    return (
      <a
        ref={ref || linkRef}
        aria-current={isActive ? "page" : undefined}
        data-slot="pagination-link"
        className={cn(
          buttonVariants({
            variant: isActive ? "outline" : "ghost",
            size,
          }),
          className
        )}
        disabled={disabled}
        tabIndex={tabIndex}
        {...props}
      />
    );
  }
);
PaginationLink.displayName = "PaginationLink";

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
