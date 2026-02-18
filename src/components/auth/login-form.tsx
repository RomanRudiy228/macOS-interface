"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { TextInput } from "@/components/input";
import { loginSchema, type LoginValues } from "@/schemas";
import { useLoginSubmit } from "@/hooks/use-login-submit";

export const LoginForm = () => {
  const { onSubmit, submitError, clearSubmitError } = useLoginSubmit();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      password: "",
    },
  });

  const passwordField = register("password");

  return (
    <form
      className="mt-3 flex w-[170px] flex-col gap-2"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="space-y-1.5 items-center">
        <div className="relative">
          <TextInput
            {...passwordField}
            unstyled
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter Password"
            className="h-8 w-full rounded-full bg-white/10 px-3 pr-9 text-[14px] font-medium text-white outline-none placeholder:text-white/70 focus:ring-white/35"
            onChange={(event) => {
              passwordField.onChange(event);
              if (submitError) {
                clearSubmitError();
              }
            }}
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white/80 transition hover:text-white"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        {errors.password ? (
          <p className="whitespace-nowrap pl-2 text-[11px] text-white/90">
            {errors.password.message}
          </p>
        ) : null}
      </div>

      {submitError ? (
        <p className="whitespace-nowrap pl-2 text-[11px] text-white/90">{submitError}</p>
      ) : null}

      <button type="submit" className="hidden" disabled={isSubmitting} aria-hidden />
    </form>
  );
};
