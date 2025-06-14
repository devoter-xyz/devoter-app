import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import React from "react";

interface FormSubmitProps {
  isLoading?: boolean;
  disabled?: boolean;
  loadingText?: string;
  disabledText?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSubmit({ 
  isLoading = false, 
  disabled = false, 
  loadingText = "Submitting...",
  disabledText = "Disabled",
  children,
}: FormSubmitProps) {
  return (
    <div className="pt-4">
      <Button 
        type="submit" 
        disabled={isLoading || disabled}
        className={"w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {loadingText}
          </>
        ) : disabled ? (
          disabledText
        ) : (
          children
        )}
      </Button>
    </div>
  );
} 