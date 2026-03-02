import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type FileInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  labelClassName?: string;
};

export const FileInput = ({
  id,
  label,
  labelClassName,
  className,
  onChange,
  ...props
}: FileInputProps) => {
  return (
    <>
      <label
        htmlFor={id}
        className={cn(
          "flex h-11 cursor-pointer items-center rounded-full border border-white/35 bg-white/32 px-4 text-sm font-medium text-white/90 backdrop-blur-xl",
          labelClassName
        )}
      >
        {label}
      </label>
      <input
        id={id}
        type="file"
        className={cn("hidden", className)}
        onChange={onChange}
        {...props}
      />
    </>
  );
};
