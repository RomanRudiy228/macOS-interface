import { z } from "zod";

export const allowedAvatarTypes = ["image/jpeg", "image/png", "image/webp"];
export const maxAvatarSize = 5 * 1024 * 1024;

export const loginSchema = z.object({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(72, "Password must be at most 72 characters."),
});

export const registerSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters.")
      .max(24, "Username must be at most 24 characters.")
      .regex(
        /^[\w\s-]+$/,
        "Username can only include letters, numbers, spaces, underscores, and hyphens."
      ),
    email: z.email("Please enter a valid email address.").trim(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters.")
      .max(72, "Password must be at most 72 characters."),
    confirmPassword: z.string(),
    avatar: z.unknown().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.password !== value.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match.",
      });
    }

    if (!value.avatar) return;

    if (!(value.avatar instanceof File)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["avatar"],
        message: "Invalid file type.",
      });
      return;
    }

    if (!allowedAvatarTypes.includes(value.avatar.type)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["avatar"],
        message: "Supported formats: JPEG, PNG, WEBP.",
      });
    }

    if (value.avatar.size > maxAvatarSize) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["avatar"],
        message: "Maximum avatar size is 5MB.",
      });
    }
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
