import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  unstyled?: boolean;
};

const baseClassName =
  "h-11 w-full rounded-full bg-white/32 px-4 text-sm font-medium text-white placeholder:text-white/70 outline-none backdrop-blur-xl transition focus:border-white/70 focus:ring-2 focus:ring-white/35";

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, unstyled = false, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(!unstyled && baseClassName, className)}
        {...props}
      />
    );
  }
);

TextInput.displayName = "TextInput";
