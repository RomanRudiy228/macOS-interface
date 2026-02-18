"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/supabase/client";
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

    const displayUsername = values.username.trim();

    const { error: signUpError } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          username: displayUsername,
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

    const userId = signInData.user.id;
    const { error: profileUpsertError } = await supabase.from("profiles").upsert(
      {
        id: userId,
        email: values.email,
        username: displayUsername,
      },
      { onConflict: "id" }
    );

    if (profileUpsertError) {
      setSubmitInfo("Account created, but profile sync failed.");
    }

    setRememberedAuthUser({
      email: values.email,
      username: displayUsername,
      avatarUrl: null,
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

        const { error: profileAvatarError } = await supabase
          .from("profiles")
          .update({
            avatar_path: avatarPath,
            avatar_url: publicUrlData.publicUrl,
          })
          .eq("id", userId);

        if (profileAvatarError) {
          setSubmitInfo("Account created, but avatar sync to profile failed.");
        } else {
          setRememberedAuthUser({
            email: values.email,
            username: displayUsername,
            avatarUrl: publicUrlData.publicUrl,
          });
        }
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
