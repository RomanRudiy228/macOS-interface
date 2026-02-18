"use client";

import { useState } from "react";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/supabase/client";
import {
  getRememberedAuthUser,
  setRememberedAuthUser,
} from "@/utils/storage/auth-user-storage";
import { type LoginValues } from "@/schemas";

export const useLoginSubmit = () => {
  const router = useRouter();
  const supabase = createClient();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const clearSubmitError = useCallback(() => {
    setSubmitError(null);
  }, []);

  const onSubmit = async (values: LoginValues) => {
    setSubmitError(null);

    const rememberedUser = getRememberedAuthUser();
    if (!rememberedUser) {
      setSubmitError("No remembered user found. Please register first.");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: rememberedUser.email,
      password: values.password,
    });

    if (error) {
      setSubmitError("Invalid password.");
      return;
    }

    const userId = data.user?.id;
    if (userId) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("email, username, avatar_url")
        .eq("id", userId)
        .maybeSingle();

      if (profile?.email && profile?.username) {
        setRememberedAuthUser({
          email: profile.email,
          username: profile.username,
          avatarUrl: profile.avatar_url,
        });
      } else {
        setRememberedAuthUser(rememberedUser);
      }
    } else {
      setRememberedAuthUser(rememberedUser);
    }

    router.replace("/");
    router.refresh();
  };

  return { onSubmit, submitError, clearSubmitError };
};
