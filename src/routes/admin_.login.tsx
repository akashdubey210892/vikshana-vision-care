import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { authReady, getCurrentUser, signInStaff } from "../lib/auth";

export const Route = createFileRoute("/admin_/login")({
  head: () => ({
    meta: [{ title: "Staff Login | Vikshana Eye Hospital" }],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Client-side only, same reasoning as admin.tsx: the server never sees the
  // browser's persisted Firebase session, so this can't be a `beforeLoad`.
  useEffect(() => {
    let cancelled = false;
    authReady.then(() => {
      if (!cancelled && getCurrentUser()) navigate({ to: "/admin" });
    });
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!username.trim() || !password) {
      setError("Please enter both username and password.");
      return;
    }
    setSubmitting(true);
    try {
      await signInStaff(username, password);
      navigate({ to: "/admin" });
    } catch {
      setError("Incorrect username or password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-muted px-4">
      <div className="w-full max-w-sm rounded-lg border border-border bg-background p-8 shadow-lg">
        <div className="flex items-center gap-2 rounded-md bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
          <ShieldAlert className="size-5 shrink-0" />
          For Vikshana Eye Hospital internal staff only. Unauthorized access is prohibited.
        </div>
        <h1 className="mt-6 text-2xl font-bold text-brand-deep">Staff Login</h1>
        <form className="mt-6 grid gap-4" onSubmit={submit} noValidate>
          <label className="grid gap-2 text-sm font-semibold">
            Username
            <Input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" autoFocus />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Password
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </label>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" size="lg" disabled={submitting} className="mt-2">{submitting ? "Signing in…" : "Sign In"}</Button>
        </form>
      </div>
    </div>
  );
}
