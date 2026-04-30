"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCart, removeFromCart, updateQuantity, type CartItem } from "../../lib/cart";
import { apiFetch, type ApiResponse } from "../../lib/api";
import imageStore from "../../lib/imageStore";
import { resolveItemImage } from "../../lib/itemImage";

type Item = { id: number; name: string; price: number; stock: number; image_url?: string | null; image?: string | null };

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>(() => getCart());
  const [items, setItems] = useState<Record<number, Item>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiFetch<ApiResponse<Item[]>>("/items");
        const map: Record<number, Item> = {};
        res.payload.forEach((it) => (map[it.id] = it));
        setItems(map);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleRemove = (id: number) => {
    removeFromCart(id);
    setCart(getCart());
  };

  const handleQty = (id: number, qty: number) => {
    updateQuantity(id, qty);
    setCart(getCart());
  };

  const total = cart.reduce((s, c) => s + c.price * c.quantity, 0);

  return (
    <main className="min-h-screen bg-transparent px-4 py-8 sm:px-8 lg:px-14">
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-white">My Cart</h1>
        </header>

        {loading && <p className="text-slate-300">Loading...</p>}

        {!loading && cart.length === 0 && <p className="text-slate-300">Your cart is empty.</p>}

        <ul className="space-y-4">
          {cart.map((c) => (
            <li key={c.id} className="flex items-center gap-4 rounded-lg bg-slate-900/80 p-4">
              <img
                src={resolveItemImage({
                  id: c.id,
                  name: items[c.id]?.name ?? c.name,
                  image_url: items[c.id]?.image_url,
                  image: items[c.id]?.image,
                }, imageStore.getImageMap()[c.id])}
                alt={c.name}
                className="h-16 w-16 rounded-md object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src.endsWith('/placeholder.png')) return;
                  target.src = '/placeholder.png';
                }}
              />
              <div className="flex-1">
                <div className="font-semibold text-white">{c.name}</div>
                <div className="text-sm text-slate-300">Rp {new Intl.NumberFormat('id-ID').format(c.price)}</div>
              </div>
              <div className="flex items-center gap-2">
                <input type="number" min={1} value={c.quantity} onChange={(e) => handleQty(c.id, Number(e.target.value))} className="w-16 rounded-md bg-slate-800 p-2 text-center" />
                <button onClick={() => handleRemove(c.id)} className="rounded-md bg-rose-600 px-3 py-1 text-white">Remove</button>
              </div>
            </li>
          ))}
        </ul>

        {cart.length > 0 && (
          <div className="mt-6 rounded-lg bg-slate-900/80 p-4 text-slate-100">
            <div className="flex justify-between font-semibold">Subtotal</div>
            <div className="text-lg font-bold">Rp {new Intl.NumberFormat('id-ID').format(total)}</div>
          </div>
        )}

        <div className="mt-6">
          <Link href="/" className="rounded-md bg-amber-500 px-4 py-2 font-semibold text-black">Continue Shopping</Link>
        </div>
      </div>
    </main>
  );
}
