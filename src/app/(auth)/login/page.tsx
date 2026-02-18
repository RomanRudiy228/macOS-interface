"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { LockScreenClock } from "@/components/auth/lock-screen-clock";
import { LoginForm } from "@/components/auth/login-form";
import { getRememberedAuthUser } from "@/utils";

export default function LoginPage() {
  const [rememberedUsername, setRememberedUsername] = useState("User");

  useEffect(() => {
    const rememberedUser = getRememberedAuthUser();
    if (rememberedUser?.username) {
      setRememberedUsername(rememberedUser.username);
    }
  }, []);

  const userInitial = useMemo(
    () => rememberedUsername.charAt(0).toUpperCase() || "U",
    [rememberedUsername]
  );

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(70%_55%_at_30%_25%,#ffd761_0%,rgba(255,215,97,0)_60%),radial-gradient(65%_60%_at_75%_30%,#ff9545_0%,rgba(255,149,69,0)_62%),radial-gradient(95%_90%_at_50%_95%,#f25b3b_0%,rgba(242,91,59,0)_70%),linear-gradient(135deg,#4f9ce9_0%,#5eb5ff_22%,#f7b940_48%,#ff8a3d_70%,#e44f37_100%)]" />
      <div className="absolute inset-0 bg-black/10" />

      <LockScreenClock />

      <section className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/35 bg-white/20 text-lg font-semibold text-white">
          {userInitial}
        </div>
        <p className="mt-4 text-sm font-medium text-white/95">{rememberedUsername}</p>
        <LoginForm />
        <p className="mt-2 text-xs text-white/80">
          New here?{" "}
          <Link
            href="/register"
            className="text-white underline decoration-white/70 underline-offset-2"
          >
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}
