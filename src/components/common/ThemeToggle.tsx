"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Monitor } from "lucide-react"; // Import Monitor icon for system theme

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [focusedTheme, setFocusedTheme] = React.useState<"light" | "dark" | "system" | undefined>(undefined);
  // Derived variable to ensure a non-undefined theme is always available for logic
  const effectiveTheme = focusedTheme ?? "system";

  const themes = [
    { name: "light", icon: Sun, label: "Light theme" },
    { name: "dark", icon: Moon, label: "Dark theme" },
    { name: "system", icon: Monitor, label: "System theme" },
  ];

  const buttonRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  // Update focusedTheme when the actual theme changes (e.g., from external source or initial load)
  React.useEffect(() => {
    setFocusedTheme(theme ?? 'system');
  }, [theme]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    let currentFocusIndex = themes.findIndex((t) => t.name === effectiveTheme);

    let newFocusIndex = currentFocusIndex;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      newFocusIndex = (currentFocusIndex + 1) % themes.length;
      event.preventDefault(); // Prevent page scrolling
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      newFocusIndex = (currentFocusIndex - 1 + themes.length) % themes.length;
      event.preventDefault(); // Prevent page scrolling
    }

    if (newFocusIndex !== currentFocusIndex) {
      const newFocusedThemeName = themes[newFocusIndex].name;
      setFocusedTheme(newFocusedThemeName);
      setTheme(newFocusedThemeName); // Immediately update the selected theme
      // Programmatically focus the newly focused button
      buttonRefs.current[newFocusIndex]?.focus();
    }
  };

  return (
    // The radiogroup container does not need a tabIndex; individual radios handle focus.
    <div
      role="radiogroup"
      aria-label="Theme selection"
      onKeyDown={handleKeyDown}
    >
      {themes.map((t, index) => {
        const Icon = t.icon;
        const isChecked = theme === t.name;
        // The button should be focusable if it's the effectiveTheme,
        // or if no theme is focused yet and it's the first button.
        const isFocusable = (focusedTheme === undefined && index === 0) || (effectiveTheme === t.name);

        return (
          <Button
            key={t.name}
            ref={(el) => (buttonRefs.current[index] = el)}
            variant="ghost"
            size="icon"
            role="radio"
            aria-checked={isChecked}
            aria-label={t.label}
            onClick={() => {
              setTheme(t.name);
              setFocusedTheme(t.name); // Ensure focusedTheme is also updated on click
              buttonRefs.current[index]?.focus(); // Keep focus on the clicked button
            }}
            tabIndex={isFocusable ? 0 : -1}
          >
            <Icon className="h-[1.5rem] w-[1.3rem]" />
            <span className="sr-only">{t.label}</span>
          </Button>
        );
      })}
    </div>
  );
}