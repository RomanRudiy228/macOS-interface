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

    const { error } = await supabase.auth.signInWithPassword({
      email: rememberedUser.email,
      password: values.password,
    });

    if (error) {
      setSubmitError("Invalid password.");
      return;
    }

    setRememberedAuthUser(rememberedUser);

    router.replace("/");
    router.refresh();
  };

  return { onSubmit, submitError, clearSubmitError };
};
