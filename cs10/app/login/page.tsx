"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { apiFetch, type ApiResponse } from "../../lib/api";

type LoginPayload = {
  token: string;
  user: {
    id: number;
    name: string;
    username: string;
    email: string;
    phone: string | null;
    balance: number;
  };
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await apiFetch<ApiResponse<LoginPayload>>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("token", result.payload.token);
        localStorage.setItem("user", JSON.stringify(result.payload.user));
      }

      setSuccessMessage("Login successful. Redirecting to item listing...");
      router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,_#111827_0%,_#0f172a_45%,_#020617_78%,_#000000_100%)] px-4 py-10 text-slate-100 sm:px-8">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-amber-900 bg-slate-950/85 p-6 shadow-lg backdrop-blur sm:p-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-amber-300">The Corner Store</p>
        <h1 className="mb-6 text-3xl font-bold text-white">Login</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-200">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-200">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-amber-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-amber-500 px-4 py-2.5 font-semibold text-black transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Processing..." : "Log In"}
          </button>
        </form>

        {error && <p className="mt-4 rounded-lg border border-rose-900 bg-rose-950/60 p-3 text-sm text-rose-200">{error}</p>}
        {successMessage && (
          <p className="mt-4 rounded-lg border border-emerald-900 bg-emerald-950/60 p-3 text-sm text-emerald-200">{successMessage}</p>
        )}

        <div className="mt-6 flex items-center justify-between text-sm text-slate-300">
          <Link href="/register" className="font-medium text-slate-100 hover:underline">
            Don&apos;t have an account?
          </Link>
          <Link href="/" className="font-medium text-slate-100 hover:underline">
            View items
          </Link>
        </div>
      </div>
    </main>
  );
}