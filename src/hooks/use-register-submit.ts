"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/supabase/client";
import { normalizeUsername } from "@/utils/auth";
import { setRememberedAuthUser } from "@/utils/storage/auth-user-storage";
import { type RegisterValues } from "@/schemas";

export const useRegisterSubmit = () => {
  const router = useRouter();
  const supabase = createClient();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitInfo, setSubmitInfo] = useState<string | null>(null);

  const onSubmit = async (values: RegisterValues) => {
    setSubmitError(null);
    setSubmitInfo(null);

    const normalizedUsername = normalizeUsername(values.username);

    const { error: signUpError } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          username: normalizedUsername,
        },
      },
    });

    if (signUpError) {
      setSubmitError(signUpError.message);
      return;
    }

    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

    if (signInError || !signInData.user) {
      setSubmitError("Registration succeeded, but automatic sign-in failed.");
      return;
    }

    setRememberedAuthUser({
      email: values.email,
      username: normalizedUsername,
    });

    const avatar = values.avatar instanceof File ? values.avatar : undefined;

    if (avatar) {
      const safeFileName = avatar.name.replace(/[^\w.-]/g, "_");
      const avatarPath = `${signInData.user.id}/${Date.now()}-${safeFileName}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(avatarPath, avatar, {
          cacheControl: "3600",
          upsert: true,
          contentType: avatar.type,
        });

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(avatarPath);

        await supabase.auth.updateUser({
          data: {
            username: normalizedUsername,
            avatar_url: publicUrlData.publicUrl,
          },
        });
      } else {
        setSubmitInfo(
          "Account created, but avatar upload failed. Check the avatars bucket."
        );
      }
    }

    router.replace("/");
    router.refresh();
  };

  return { onSubmit, submitError, submitInfo };
};
