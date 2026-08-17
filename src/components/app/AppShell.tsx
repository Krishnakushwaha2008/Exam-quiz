"use client";

import {
  BookOpen,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  User as UserIcon,
  Users,
  Menu,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/app";
import { useAuth } from "@/hooks/use-auth";
import type { AppView, SessionUser } from "@/types";
import { Logo } from "@/components/app/shared/Logo";
import { ThemeToggle } from "@/components/app/ThemeToggle";
import { Footer } from "@/components/app/Footer";
import { DashboardView } from "@/components/app/views/DashboardView";
import { QuizListView } from "@/components/app/views/QuizListView";
import { QuizInstructionsView } from "@/components/app/views/QuizInstructionsView";
import { QuizAttemptView } from "@/components/app/views/QuizAttemptView";
import { QuizResultView } from "@/components/app/views/QuizResultView";
import { ProfileView } from "@/components/app/views/ProfileView";
import { AdminDashboardView } from "@/components/app/views/admin/AdminDashboardView";
import { AdminQuizzesView } from "@/components/app/views/admin/AdminQuizzesView";
import { AddQuizView } from "@/components/app/views/admin/AddQuizView";
import { AdminStudentsView } from "@/components/app/views/admin/AdminStudentsView";

type NavItem = {
  view: AppView;
  label: string;
  icon: React.ElementType;
};

const studentNav: NavItem[] = [
  { view: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { view: "quizzes", label: "Quizzes", icon: BookOpen },
  { view: "profile", label: "Profile", icon: UserIcon },
];

const adminNav: NavItem[] = [
  { view: "admin-dashboard", label: "Overview", icon: LayoutDashboard },
  { view: "admin-quizzes", label: "Quizzes", icon: BookOpen },
  { view: "admin-add-quiz", label: "New Quiz", icon: PlusCircle },
  { view: "admin-students", label: "Students", icon: Users },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function AppShell() {
  const { user, logout, isLoggingOut } = useAuth();
  const view = useAppStore((s) => s.view);
  const navigate = useAppStore((s) => s.navigate);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;

  // Focused, chrome-free exam experience.
  if (view === "quiz-attempt") {
    return <QuizAttemptView />;
  }

  const isAdmin = user.role === "ADMIN";
  const nav = isAdmin ? adminNav : studentNav;

  const handleLogout = () => logout();

  return (
    <div className="flex min-h-screen flex-col">
      {/* ============================ Navbar ============================ */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(isAdmin ? "admin-dashboard" : "dashboard")}
            className="flex items-center transition-opacity hover:opacity-80"
          >
            <Logo size="sm" />
          </button>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <NavButton
                key={item.view}
                active={view === item.view}
                onClick={() => navigate(item.view)}
                icon={item.icon}
                label={item.label}
              />
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <UserMenu user={user} onLogout={handleLogout} isLoggingOut={isLoggingOut} />

            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-4">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <Logo size="sm" className="mb-6" />
                <nav className="flex flex-col gap-1">
                  {nav.map((item) => (
                    <NavButton
                      key={item.view}
                      active={view === item.view}
                      onClick={() => {
                        navigate(item.view);
                        setMobileOpen(false);
                      }}
                      icon={item.icon}
                      label={item.label}
                      full
                    />
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* ============================ Main ============================ */}
      <main className="flex-1">
        {view === "dashboard" && <DashboardView />}
        {view === "quizzes" && <QuizListView />}
        {view === "quiz-instructions" && <QuizInstructionsView />}
        {view === "quiz-result" && <QuizResultView />}
        {view === "profile" && <ProfileView />}
        {view === "admin-dashboard" && <AdminDashboardView />}
        {view === "admin-quizzes" && <AdminQuizzesView />}
        {view === "admin-add-quiz" && <AddQuizView />}
        {view === "admin-students" && <AdminStudentsView />}
      </main>

      <Footer />

      {/* Mobile bottom nav */}
      <nav className="sticky bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-md items-stretch justify-around">
          {nav.slice(0, 4).map((item) => (
            <button
              key={item.view}
              onClick={() => navigate(item.view)}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                view === item.view
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

function NavButton({
  active,
  onClick,
  icon: Icon,
  label,
  full,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
  full?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        full && "w-full",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <Icon className="h-4.5 w-4.5" />
      {label}
    </button>
  );
}

function UserMenu({
  user,
  onLogout,
  isLoggingOut,
}: {
  user: SessionUser;
  onLogout: () => void;
  isLoggingOut: boolean;
}) {
  const navigate = useAppStore((s) => s.navigate);
  const isDark = user.role === "ADMIN";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-2.5 transition-colors hover:bg-muted">
          <Avatar className="h-7 w-7">
            <AvatarFallback
              className={cn(
                "text-xs font-semibold",
                isDark
                  ? "bg-gold/20 text-gold"
                  : "bg-primary/15 text-primary",
              )}
            >
              {initials(user.name)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium sm:inline">
            {user.name.split(" ")[0]}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span className="text-sm font-medium">{user.name}</span>
          <span className="text-xs font-normal text-muted-foreground">
            {user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => navigate(user.role === "ADMIN" ? "admin-dashboard" : "dashboard")}
        >
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Dashboard
        </DropdownMenuItem>
        {user.role === "ADMIN" ? (
          <DropdownMenuItem className="gap-2" onClick={() => navigate("admin-students")}>
            <Users className="h-4 w-4" />
            Students
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => navigate("profile")}>
            <UserIcon className="mr-2 h-4 w-4" />
            My Profile
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onLogout}
          disabled={isLoggingOut}
          className="text-rose-600 focus:text-rose-600 dark:text-rose-400"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isLoggingOut ? "Signing out…" : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { ShieldCheck };
