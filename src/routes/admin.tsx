import { createFileRoute, Link, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { authReady, getCurrentUser, signOutStaff } from "../lib/auth";
import { Button } from "../components/ui/button";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    await authReady;
    if (!getCurrentUser()) throw redirect({ to: "/admin/login" });
  },
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();

  async function handleLogout() {
    await signOutStaff();
    navigate({ to: "/admin/login" });
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
