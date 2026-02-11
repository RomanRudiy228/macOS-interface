import { SystemColor } from "@/types/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const applySystemTheme = (colorId: string, allColors: SystemColor[]) => {
  if (typeof window === "undefined") return;

  const body = document.body;

  if (allColors.length > 0) {
    allColors.forEach((c) => body.classList.remove(`theme-${c.id}`));
  } else {
    ["blue", "purple", "pink", "red", "orange", "green", "yellow"].forEach(
      (c) => body.classList.remove(`theme-${c}`)
    );
  }

  body.classList.add(`theme-${colorId}`);
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
