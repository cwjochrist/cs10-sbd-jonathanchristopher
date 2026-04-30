"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { apiFetch, type ApiResponse } from "../../lib/api";

type RegisterPayload = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string | null;
  balance: number;
};

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
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
      const result = await apiFetch<ApiResponse<RegisterPayload>>("/user/register", {
        method: "POST",
        body: JSON.stringify({
          name,
          username,
          email,
          phone: phone || null,
          password,
        }),
      });

      setSuccessMessage(`Registration successful for ${result.payload.username}. Please log in.`);
      setName("");
      setUsername("");
      setEmail("");
      setPhone("");
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(140deg,_#0f172a_0%,_#052e16_44%,_#020617_78%,_#000000_100%)] px-4 py-10 text-slate-100 sm:px-8">
      <div className="mx-auto w-full max-w-xl rounded-2xl border border-emerald-900 bg-slate-950/85 p-6 shadow-lg backdrop-blur sm:p-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-emerald-300">The Corner Store</p>
        <h1 className="mb-2 text-3xl font-bold text-white">Register</h1>
        <p className="mb-6 text-sm text-slate-300">
          Password must be at least 10 characters and include uppercase, lowercase, number, and symbol.
        </p>

        <form className="grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <div className="sm:col-span-2">
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-200">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label htmlFor="username" className="mb-1 block text-sm font-medium text-slate-200">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="mb-1 block text-sm font-medium text-slate-200">
              Phone Number
            </label>
            <input
              id="phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-emerald-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-200">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-emerald-500"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-200">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-emerald-500"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-500 px-4 py-2.5 font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Processing..." : "Sign Up"}
            </button>
          </div>
        </form>

        {error && <p className="mt-4 rounded-lg border border-rose-900 bg-rose-950/60 p-3 text-sm text-rose-200">{error}</p>}
        {successMessage && (
          <p className="mt-4 rounded-lg border border-emerald-900 bg-emerald-950/60 p-3 text-sm text-emerald-200">{successMessage}</p>
        )}

        <div className="mt-6 flex items-center justify-between text-sm text-slate-300">
          <Link href="/login" className="font-medium text-slate-100 hover:underline">
            Sign in
          </Link>
          <Link href="/" className="font-medium text-slate-100 hover:underline">
            View items
          </Link>
        </div>
      </div>
    </main>
  );
}