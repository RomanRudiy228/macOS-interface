"use client";

import Image from "next/image";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "@/components/input";
import { registerSchema, type RegisterValues } from "@/schemas";
import { useRegisterSubmit } from "@/hooks/use-register-submit";

export const RegisterForm = () => {
  const { onSubmit, submitError, submitInfo } = useRegisterSubmit();

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
        <p className="text-center text-[11px]">
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
          className="h-8 w-full rounded-full bg-white/10 px-3 text-[13px] font-medium text-white outline-none placeholder:text-white/70 focus:ring-white/35"
        />
        {errors.username ? (
          <p className="text-[11px]">{errors.username.message}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <TextInput
          {...register("email")}
          unstyled
          type="email"
          autoComplete="email"
          placeholder="Enter Email"
          className="h-8 w-full rounded-full bg-white/10 px-3 text-[13px] font-medium text-white outline-none placeholder:text-white/70 focus:ring-white/35"
        />
        {errors.email ? (
          <p className="text-[11px]">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <TextInput
          {...register("password")}
          unstyled
          type="password"
          autoComplete="new-password"
          placeholder="Enter Password"
          className="h-8 w-full rounded-full bg-white/10 px-3 text-[13px] font-medium text-white outline-none placeholder:text-white/70 focus:ring-white/35"
        />
        {errors.password ? (
          <p className="text-[11px]">{errors.password.message}</p>
        ) : null}
      </div>

      {submitError ? <p className="text-[11px]">{submitError}</p> : null}
      {submitInfo ? <p className="text-xs text-amber-100">{submitInfo}</p> : null}

      <button type="submit" className="hidden" disabled={isSubmitting} aria-hidden />
    </form>
  );
};
