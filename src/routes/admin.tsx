import { useEffect, useState } from "react";
import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { authReady, getCurrentUser, signOutStaff, subscribeToAuth } from "../lib/auth";
import { Button } from "../components/ui/button";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  // Auth state lives in the browser (IndexedDB/localStorage), which the server
  // can't see during SSR — so this check runs client-side only, after hydration,
  // instead of in `beforeLoad`. A `beforeLoad` check would always see "signed out"
  // on the server and force a redirect on every hard refresh, even when the
  // browser's real session is still valid.
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    authReady.then(() => {
      if (cancelled) return;
      if (!getCurrentUser()) {
        navigate({ to: "/admin/login" });
      } else {
        setAuthed(true);
      }
    });
    const unsubscribe = subscribeToAuth((user) => {
      if (!user) navigate({ to: "/admin/login" });
    });
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [navigate]);

  async function handleLogout() {
    await signOutStaff();
    navigate({ to: "/admin/login" });
  }

  if (!authed) {
    return <div className="grid min-h-screen place-items-center bg-muted text-sm text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-muted">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Vikshana Eye Hospital</p>
            <h1 className="text-xl font-bold text-brand-deep">Staff Admin</h1>
          </div>
          <nav className="flex flex-wrap items-center gap-2" aria-label="Admin navigation">
            <Link to="/admin" className="rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-accent hover:text-foreground" activeProps={{ className: "bg-accent text-foreground" }} activeOptions={{ exact: true }}>Appointments</Link>
            <Link to="/admin/doctors" className="rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-accent hover:text-foreground" activeProps={{ className: "bg-accent text-foreground" }}>Doctor Availability</Link>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
