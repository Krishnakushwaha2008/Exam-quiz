"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { AppShell } from "@/components/app/AppShell";
import { AuthScreen } from "@/components/app/AuthScreen";
import { LandingPage } from "@/components/app/LandingPage";
import { Logo } from "@/components/app/shared/Logo";

export default function Home() {
  const { user, isLoading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authCreds, setAuthCreds] = useState<{ email: string; password: string } | null>(null);

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

  // If authenticated, show full dashboard application
  if (user) {
    return <AppShell />;
  }

  // If visitor clicked Sign In / Get Started, show AuthScreen with back capability
  if (showAuth) {
    return (
      <AuthScreen
        initialTab={authMode}
        initialCredentials={authCreds}
        onBackToLanding={() => setShowAuth(false)}
      />
    );
  }

  // Default for visitors: Modern High-Converting Landing Page
  return (
    <LandingPage
      onOpenAuth={(mode = "login", creds = null) => {
        setAuthMode(mode);
        setAuthCreds(creds);
        setShowAuth(true);
      }}
    />
  );
}

