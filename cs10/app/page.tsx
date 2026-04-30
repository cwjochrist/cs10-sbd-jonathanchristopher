"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch, type ApiResponse } from "../lib/api";
import { addToCart, type CartItem } from "../lib/cart";
import imageStore from "../lib/imageStore";
import { resolveItemImage } from "../lib/itemImage";

type Item = {
  id: number;
  name: string;
  price: number;
  stock: number;
  image_url?: string | null;
  image?: string | null;
  created_at?: string;
};

type LoggedInUser = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string | null;
  balance: number;
};

export default function Home() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "warning">("success");
  const [user, setUser] = useState<LoggedInUser | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const userData = localStorage.getItem("user");

    if (!userData) {
      return null;
    }

    try {
      return JSON.parse(userData) as LoggedInUser;
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return null;
    }
  });

  useEffect(() => {
    const loadItems = async () => {
      try {
        const result = await apiFetch<ApiResponse<Item[]>>("/items");
        setItems(result.payload ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load items");
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    setUser(null);
    router.replace("/login");
  };

  const handleAdd = (item: Item) => {
    if (!user) {
      setToastType("warning");
      setToast("Please log in first before adding items to cart");
      setTimeout(() => setToast(null), 1800);
      return;
    }

    const cartItem: CartItem = { id: item.id, name: item.name, price: item.price, quantity: 1 };
    addToCart(cartItem);
    setToastType("success");
    setToast(`${item.name} added to cart`);
    setTimeout(() => setToast(null), 1800);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_12%_14%,_#1f2937_0%,_#0f172a_38%,_#020617_72%,_#000000_100%)] px-4 py-8 text-slate-100 sm:px-8 lg:px-14">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="The Corner Store" className="h-24 w-24" />
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-400">The Corner Store</p>
              <h1 className="text-3xl font-bold text-white sm:text-4xl">Items For Sale</h1>
            </div>
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/cart" className="text-sm text-slate-200 underline">My Cart</Link>
              <div className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-100 shadow-sm">
                {user.username}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl bg-rose-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-rose-600 hover:shadow"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link
                href="/login"
                className="rounded-xl border border-slate-600 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-100 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow"
              >
                Register
              </Link>
            </div>
          )}
        </header>

        {loading && (
          <div className="rounded-2xl border border-slate-700 bg-slate-950/80 p-6 text-slate-200 shadow-sm backdrop-blur">
            Loading items...
          </div>
        )}

        {error && !loading && (
          <div className="rounded-2xl border border-rose-900 bg-rose-950/70 p-6 text-rose-200 shadow-sm backdrop-blur">
            {error}
            <p className="mt-2 text-sm">
              Make sure the backend is running and set <strong>NEXT_PUBLIC_API_BASE_URL</strong> if your backend uses a non-default port.
            </p>
          </div>
        )}

        {!loading && !error && (
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-slate-700 bg-slate-900/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-900 hover:shadow-md"
                >
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                    Item #{item.id}
                  </div>
                  <div className="mb-3 flex items-center gap-4">
                    <img
                      src={resolveItemImage(item, imageStore.getImageMap()[item.id])}
                      alt={item.name}
                      className="h-20 w-20 rounded-md object-cover"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src.endsWith("/placeholder.png")) return;
                        target.src = "/placeholder.png";
                      }}
                    />
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-white">{item.name}</h2>
                      <p className="text-sm text-slate-300">Stock: {item.stock}</p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-300">Price</p>
                  <p className="mb-3 text-lg font-semibold text-emerald-300">
                    Rp {new Intl.NumberFormat("id-ID").format(item.price)}
                  </p>

                  <div className="mt-2 flex items-center gap-3">
                    <button onClick={() => handleAdd(item)} className="rounded-full bg-amber-500 px-4 py-2 font-semibold text-black">COP</button>
                  </div>
                </article>
              ))}

            

            {items.length === 0 && (
              <div className="rounded-2xl border border-slate-700 bg-slate-950/80 p-6 text-slate-200 shadow-sm backdrop-blur">
                No items available yet.
              </div>
            )}
          </section>
        )}
      </div>
      {toast && (
        <div
          className={`fixed right-6 bottom-6 rounded-lg px-4 py-3 shadow-lg ${
            toastType === "warning" ? "bg-amber-400 text-black" : "bg-emerald-600 text-black"
          }`}
        >
          {toast}
        </div>
      )}
    </main>
  );
}
