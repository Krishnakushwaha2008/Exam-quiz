"use client";

import { useAuth } from "@/hooks/use-auth";
import { AppShell } from "@/components/app/AppShell";
import { AuthScreen } from "@/components/app/AuthScreen";
import { Logo } from "@/components/app/shared/Logo";

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background">
        <Logo size="lg" />
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
          <p className="text-sm text-muted-foreground">
            Preparing your examination suite…
          </p>
        </div>
      </div>
    );
  }

  if (!user) return <AuthScreen />;

  return <AppShell />;
}
