import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ControllerRenderProps } from "react-hook-form";

interface FormTextAreaProps {
  field: ControllerRenderProps;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  minHeight?: string;
}

export function FormTextArea({ field, label, placeholder, disabled, className, minHeight }: FormTextAreaProps) {
  return (
    <FormItem>
      <FormLabel className="text-sm font-medium text-gray-700">{label}</FormLabel>
      <FormControl>
        <Textarea
          {...field}
          placeholder={placeholder}
          disabled={disabled}
          className={className}
          style={minHeight ? { minHeight } : undefined}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
