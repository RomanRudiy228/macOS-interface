export type RememberedAuthUser = {
  email: string;
  username: string;
};

const rememberedAuthUserKey = "remembered-auth-user";

export const getRememberedAuthUser = (): RememberedAuthUser | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(rememberedAuthUserKey);
    if (!rawValue) {
      return null;
    }

    const parsedValue = JSON.parse(rawValue) as Partial<RememberedAuthUser>;
    if (!parsedValue.email || !parsedValue.username) {
      return null;
    }

    return {
      email: parsedValue.email,
      username: parsedValue.username,
    };
  } catch {
    return null;
  }
};

export const setRememberedAuthUser = (user: RememberedAuthUser) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(rememberedAuthUserKey, JSON.stringify(user));
};
