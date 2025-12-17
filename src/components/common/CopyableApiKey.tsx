"use client";

import { useState, useCallback } from "react";
import { Copy, Eye, EyeOff } from "lucide-react";
import { cn, maskApiKey } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CopyableApiKeyProps {
  apiKey: string;
  className?: string;
}

export function CopyableApiKey({ apiKey, className }: CopyableApiKeyProps) {
  const [revealed, setRevealed] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      toast.success("API Key copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy API key:", err);
      toast.error("Failed to copy API Key.");
    }
  }, [apiKey]);

  const handleToggleReveal = useCallback(() => {
    setRevealed((prev) => !prev);
  }, []);

  const displayedKey = revealed ? apiKey : maskApiKey(apiKey);

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-md border border-input bg-background p-2 font-mono text-sm",
        className,
      )}
    >
      <span className="select-all break-all pr-2">{displayedKey}</span>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleReveal}
          aria-label={revealed ? "Hide API Key" : "Show API Key"}
          title={revealed ? "Hide API Key" : "Show API Key"}
        >
          {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          aria-label="Copy API Key"
          title="Copy API Key"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
