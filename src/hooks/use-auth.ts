"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/fetch";
import { useAppStore } from "@/store/app";
import type { SessionUser } from "@/types";

type MeResponse = { user: SessionUser | null };

export function useAuth() {
  const qc = useQueryClient();
  const setUser = useAppStore((s) => s.setUser);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => api<MeResponse>("/api/auth/me"),
    staleTime: 5 * 60 * 1000,
  });

  const serverUser = data?.user ?? null;

  // Keep the navigation store in sync with the server session — but only
  // when the signed-in user actually changes, so refetches don't reset the
  // current view mid-navigation. Done in an effect so we never call
  // setState during render.
  useEffect(() => {
    const currentId = useAppStore.getState().user?.id ?? null;
    const nextId = serverUser?.id ?? null;
    if (currentId !== nextId) setUser(serverUser);
  }, [serverUser, setUser]);

  const logoutMutation = useMutation({
    mutationFn: () => api<{ ok: boolean }>("/api/auth/logout", { method: "POST" }),
    onSettled: () => {
      qc.clear();
      setUser(null);
    },
  });

  return {
    user: serverUser,
    isLoading,
    isError,
    logout: () => logoutMutation.mutate(),
    isLoggingOut: logoutMutation.isPending,
    refresh: () => qc.invalidateQueries({ queryKey: ["auth", "me"] }),
  };
}
