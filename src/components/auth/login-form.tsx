"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "@/components/input";
import { loginSchema, type LoginValues } from "@/schemas";
import { useLoginSubmit } from "@/hooks/use-login-submit";

export const LoginForm = () => {
  const { onSubmit, submitError, clearSubmitError } = useLoginSubmit();

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
        <TextInput
          {...passwordField}
          unstyled
          type="password"
          autoComplete="current-password"
          placeholder="Enter Password"
          className="h-8 w-full rounded-full bg-white/10 px-3 text-[14px] font-medium text-white outline-none placeholder:text-white/70 focus:ring-white/35"
          onChange={(event) => {
            passwordField.onChange(event);
            if (submitError) {
              clearSubmitError();
            }
          }}
        />
        {errors.password ? (
          <p className="whitespace-nowrap text-[11px]">
            {errors.password.message}
          </p>
        ) : null}
      </div>

      {submitError ? (
        <p className="whitespace-nowrap text-[11px]">{submitError}</p>
      ) : null}

      <button type="submit" className="hidden" disabled={isSubmitting} aria-hidden />
    </form>
  );
};
