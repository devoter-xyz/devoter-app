"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Monitor } from "lucide-react"; // Import Monitor icon for system theme

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  // Initialize focusedTheme state to undefined to prevent SSR hydration mismatches.
  // It will be properly set in a useEffect hook after mounting.
  const [focusedTheme, setFocusedTheme] = React.useState<"light" | "dark" | "system" | undefined>(undefined);

  const themes = [
    { name: "light", icon: Sun, label: "Light theme" },
    { name: "dark", icon: Moon, label: "Dark theme" },
    { name: "system", icon: Monitor, label: "System theme" },
  ];

  const buttonRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  // Update focusedTheme when the actual theme changes (e.g., from external source or initial load)
  React.useEffect(() => {
    setFocusedTheme(theme || 'system');
  }, [theme]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    let currentFocusIndex = themes.findIndex((t) => t.name === focusedTheme);
    if (currentFocusIndex === -1) { // Fallback if focusedTheme somehow isn't found
      currentFocusIndex = themes.findIndex((t) => t.name === (theme || 'system'));
    }

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
    } else if (event.key === " ") { // Only Space key for activation
      setTheme(focusedTheme as 'light' | 'dark' | 'system');
      event.preventDefault();
      return; // Exit early as focus doesn't need to change
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
        const isFocused = focusedTheme === t.name;

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
            // Only the element that *would* receive focus on tab should have tabIndex="0".
            // This is the focusedTheme. If nothing is focused yet, the first item should be 0.
            tabIndex={isFocused ? 0 : -1}
          >
            <Icon className="h-[1.5rem] w-[1.3rem]" />
            <span className="sr-only">{t.label}</span>
          </Button>
        );
      })}
    </div>
  );
}