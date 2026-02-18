"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { TextInput } from "@/components/input";
import { registerSchema, type RegisterValues } from "@/schemas";
import { useRegisterSubmit } from "@/hooks/use-register-submit";

export const RegisterForm = () => {
  const { onSubmit, submitError, submitInfo } = useRegisterSubmit();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      avatar: undefined,
    },
  });

  const selectedAvatar = watch("avatar");
  const avatarPreviewUrl = useMemo(
    () => (selectedAvatar instanceof File ? URL.createObjectURL(selectedAvatar) : null),
    [selectedAvatar]
  );

  useEffect(
    () => () => {
      if (avatarPreviewUrl) {
        URL.revokeObjectURL(avatarPreviewUrl);
      }
    },
    [avatarPreviewUrl]
  );

  return (
    <form
      className="mt-3 flex w-[220px] flex-col gap-2"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="flex justify-center mb-4">
        <label
          htmlFor="register-avatar"
          className="relative grid h-16 w-16 cursor-pointer place-items-center overflow-hidden rounded-full border border-white/35 bg-white/20 text-3xl font-light leading-none text-white/90 transition hover:bg-white/30"
        >
          {avatarPreviewUrl ? (
            <Image
              src={avatarPreviewUrl}
              alt="Avatar preview"
              fill
              sizes="64px"
              className="object-cover"
            />
          ) : (
            <span className="-mt-[4px]">+</span>
          )}
        </label>
        <input
          id="register-avatar"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            setValue("avatar", file, { shouldValidate: true, shouldDirty: true });
          }}
        />
      </div>
      {errors.avatar ? (
        <p className="text-center text-[11px] text-white/90">
          {errors.avatar.message as string}
        </p>
      ) : null}

      <div className="space-y-1.5">
        <TextInput
          {...register("username")}
          unstyled
          type="text"
          autoComplete="username"
          placeholder="Enter Username"
          className="auth-input h-8 w-full rounded-full bg-white/10 px-3 text-[13px] font-medium text-white outline-none placeholder:text-white/70 focus:ring-white/35"
        />
        {errors.username ? (
          <p className="pl-2 text-[11px] text-white/90">{errors.username.message}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <TextInput
          {...register("email")}
          unstyled
          type="email"
          autoComplete="email"
          placeholder="Enter Email"
          className="auth-input h-8 w-full rounded-full bg-white/10 px-3 text-[13px] font-medium text-white outline-none placeholder:text-white/70 focus:ring-white/35"
        />
        {errors.email ? (
          <p className="pl-2 text-[11px] text-white/90">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <div className="relative">
          <TextInput
            {...register("password")}
            unstyled
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Enter Password"
            className="auth-input h-8 w-full rounded-full bg-white/10 px-3 pr-9 text-[13px] font-medium text-white outline-none placeholder:text-white/70 focus:ring-white/35"
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
          <p className="pl-2 text-[11px] text-white/90">{errors.password.message}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <div className="relative">
          <TextInput
            {...register("confirmPassword")}
            unstyled
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Confirm Password"
            className="auth-input h-8 w-full rounded-full bg-white/10 px-3 pr-9 text-[13px] font-medium text-white outline-none placeholder:text-white/70 focus:ring-white/35"
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white/80 transition hover:text-white"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        {errors.confirmPassword ? (
          <p className="pl-2 text-[11px] text-white/90">{errors.confirmPassword.message}</p>
        ) : null}
      </div>

      {submitError ? <p className="pl-2 text-[11px] text-white/90">{submitError}</p> : null}
      {submitInfo ? <p className="pl-2 text-xs text-amber-100">{submitInfo}</p> : null}

      <button type="submit" className="hidden" disabled={isSubmitting} aria-hidden />
    </form>
  );
};
