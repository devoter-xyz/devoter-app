import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";
import { ControllerRenderProps } from "react-hook-form";

interface FormInputProps {
  field: ControllerRenderProps<any, any>;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  prefixIcon?: React.ReactNode;
}

export function FormInput({ field, label, placeholder, disabled, className, prefixIcon }: FormInputProps) {
  return (
    <FormItem>
      <FormLabel className="text-sm font-medium text-gray-700">{label}</FormLabel>
      <FormControl>
        <div className="relative">
          {prefixIcon && (
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2">{prefixIcon}</span>
          )}
          <Input
            {...field}
            placeholder={placeholder}
            disabled={disabled}
            className={prefixIcon ? `pl-10 ${className || ''}` : className}
          />
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
