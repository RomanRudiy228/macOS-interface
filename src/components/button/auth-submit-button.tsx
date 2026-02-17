import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type AuthSubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading: boolean;
  idleText: string;
  loadingText: string;
};

export const AuthSubmitButton = ({
  isLoading,
  idleText,
  loadingText,
  className,
  type = "submit",
  disabled,
  ...props
}: AuthSubmitButtonProps) => {
  return (
    <button
      type={type}
      className={cn(
        "mt-1 h-11 w-full rounded-full border border-white/55 bg-white/30 text-sm font-semibold text-white transition hover:bg-white/40 disabled:cursor-not-allowed disabled:opacity-70",
        className
      )}
      disabled={disabled ?? isLoading}
      {...props}
    >
      {isLoading ? loadingText : idleText}
    </button>
  );
};
