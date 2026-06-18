"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AuthUser,
  authApi,
  clearToken,
  setToken,
  userApi,
} from "@/lib/api";

function syncUserProfile(user: AuthUser) {
  localStorage.setItem(
    "user_profile",
    JSON.stringify({
      name: user.name,
      avatar: user.avatar,
      banner: user.banner,
      email: user.email,
      hotline: user.hotline,
      support: user.support,
      address: user.address,
    }),
  );
  window.dispatchEvent(new Event("user_profile_updated"));
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadUser = useCallback(async () => {
    try {
      const me = await userApi.me();
      setUser(me);
      syncUserProfile(me);
    } catch {
      setUser(null);
      clearToken();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    setToken(res.access_token);
    setUser(res.user);
    syncUserProfile(res.user);
    router.push("/dashboard");
  };

  const register = async (email: string, password: string, name: string) => {
    const res = await authApi.register(email, password, name);
    setToken(res.access_token);
    setUser(res.user);
    syncUserProfile(res.user);
    router.push("/dashboard");
  };

  const completeOAuth = async (provider: "google" | "facebook", code: string) => {
    const res =
      provider === "google"
        ? await authApi.oauthGoogle(code)
        : await authApi.oauthFacebook(code);
    setToken(res.access_token);
    setUser(res.user);
    syncUserProfile(res.user);
    router.push("/dashboard");
  };

  const logout = () => {
    clearToken();
    setUser(null);
    router.push("/login");
  };

  const updateProfile = async (data: Partial<AuthUser>) => {
    const updated = await userApi.update(data);
    setUser(updated);
    syncUserProfile(updated);
    return updated;
  };

  return {
    user,
    loading,
    login,
    register,
    completeOAuth,
    logout,
    updateProfile,
    refreshUser: loadUser,
  };
}
