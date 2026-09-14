import { ChecklistGlyph } from "@/components/ChecklistGlyph";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { CHECKLISTS, CHECKLIST_ORDER } from "@/lib/checklists";
import { POSTE_META, currentPoste, useNow } from "@/lib/poste";
import {
  Activity,
  BarChart3,
  ChevronDown,
  Gauge,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  MoonStar,
  Sun,
  Sunrise,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import type { ReactNode } from "react";

type View =
  | { kind: "home" }
  | { kind: "checklist"; id: string }
  | { kind: "history" }
  | { kind: "anomalies" };

export type { View };

function NavLinks({
  view,
  onNavigate,
}: {
  view: View;
  onNavigate?: () => void;
}) {
  const item = (active: boolean, icon: ReactNode, label: string) => (
    <span className="flex min-w-0 items-center gap-2.5">
      <span className="shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </span>
  );

  return (
    <>
      <Link
        to="/dashboard"
        onClick={onNavigate}
        className={`flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          view.kind === "home"
            ? "bg-primary text-primary-foreground"
            : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        }`}
      >
        {item(
          view.kind === "home",
          <LayoutDashboard className="size-4" />,
          "Tableau de bord",
        )}
      </Link>

      {Object.values(CHECKLISTS)
        .sort((a, b) => CHECKLIST_ORDER.indexOf(a.id as never) - CHECKLIST_ORDER.indexOf(b.id as never))
        .map((c) => {
          const active = view.kind === "checklist" && view.id === c.id;
          return (
            <Link
              key={c.id}
              to={`/dashboard/checklist/${c.id}`}
              onClick={onNavigate}
              className={`flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              {item(active, <ChecklistGlyph id={c.id} className="size-4" />, c.title)}
            </Link>
          );
        })}

      <div className="px-3 pb-1 pt-5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Administration
      </div>
      <Link
        to="/dashboard/history"
        onClick={onNavigate}
        className={`flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          view.kind === "history"
            ? "bg-primary text-primary-foreground"
            : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        }`}
      >
        {item(
          view.kind === "history",
          <BarChart3 className="size-4" />,
          "Historique",
        )}
      </Link>
      <Link
        to="/dashboard/anomalies"
        onClick={onNavigate}
        className={`flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          view.kind === "anomalies"
            ? "bg-primary text-primary-foreground"
            : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        }`}
      >
        {item(
          view.kind === "anomalies",
          <Activity className="size-4" />,
          "Anomalies",
        )}
      </Link>
    </>
  );
}

export function AppShell({
  view,
  children,
}: {
  view: View;
  children: ReactNode;
}) {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const now = useNow(1000);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const poste = useMemo(() => currentPoste(now), [now]);
  const meta = POSTE_META[poste];
  const PosteIcon = poste === "nuit" ? MoonStar : poste === "matin" ? Sunrise : Sun;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const displayName = user?.name ?? "Technicien";

  return (
    <div className="min-h-screen bg-background">
      {/* Topbar */}
      <header className="sticky top-0 z-40 border-b bg-sidebar/95 backdrop-blur supports-[backdrop-filter]:bg-sidebar/80">
        <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            {/* Mobile nav */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="size-5" />
                  <span className="sr-only">Ouvrir la navigation</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <SheetHeader className="border-b px-4 py-4">
                  <SheetTitle className="flex items-center gap-2 text-left font-display text-base">
                    <Gauge className="size-5 text-primary" />
                    Utilities Control
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 overflow-y-auto p-3">
                  <NavLinks view={view} onNavigate={() => setMobileOpen(false)} />
                </nav>
              </SheetContent>
            </Sheet>

            <Link to="/dashboard" className="flex min-w-0 items-center gap-2">
              <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Gauge className="size-5" />
              </span>
              <span className="truncate font-display text-lg font-bold tracking-tight">
                Utilities<span className="text-primary"> Control</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="hidden gap-1.5 rounded-full px-3 py-1 text-xs font-medium sm:inline-flex"
            >
              <PosteIcon className="size-3.5 text-primary" />
              <span className="text-muted-foreground">Poste</span>
              {meta.label}
            </Badge>
            <span className="hidden text-xs tabular-nums text-muted-foreground md:inline">
              {now.toLocaleDateString("fr-FR")}{" "}
              {now.toLocaleTimeString("fr-FR")}
            </span>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Changer le thème"
            >
              {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2">
                  <span className="grid size-7 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {displayName.slice(0, 1).toUpperCase()}
                  </span>
                  <span className="hidden max-w-32 truncate text-sm font-medium sm:inline">
                    {displayName}
                  </span>
                  <ChevronDown className="size-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="truncate">
                  {displayName}
                  {user?.email ? (
                    <span className="block truncate text-xs font-normal text-muted-foreground">
                      {user.email}
                    </span>
                  ) : null}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="size-4" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-6 sm:px-6">
        {/* Sidebar (desktop) */}
        <aside className="sticky top-24 hidden h-[calc(100vh-7rem)] w-64 shrink-0 flex-col overflow-y-auto rounded-xl border bg-sidebar py-3 lg:flex">
          <nav className="flex flex-1 flex-col gap-1 px-3">
            <NavLinks view={view} />
          </nav>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 pb-10">{children}</main>
      </div>
    </div>
  );
}

export function useCurrentView(): View {
  const { pathname } = useLocation();
  if (pathname === "/dashboard" || pathname === "/dashboard/") return { kind: "home" };
  if (pathname === "/dashboard/history") return { kind: "history" };
  if (pathname === "/dashboard/anomalies") return { kind: "anomalies" };
  const m = pathname.match(/^\/dashboard\/checklist\/([\w-]+)$/);
  if (m) return { kind: "checklist", id: m[1] };
  return { kind: "home" };
}
