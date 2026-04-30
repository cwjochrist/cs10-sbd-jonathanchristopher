export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

const CART_KEY = 'cart_items_v1';

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToCart(item: CartItem) {
  const cart = getCart();
  const idx = cart.findIndex((c) => c.id === item.id);
  if (idx === -1) {
    cart.push({ ...item });
  } else {
    cart[idx].quantity += item.quantity;
  }
  saveCart(cart);
}

export function removeFromCart(id: number) {
  const cart = getCart().filter((c) => c.id !== id);
  saveCart(cart);
}

export function clearCart() {
  saveCart([]);
}

export function updateQuantity(id: number, quantity: number) {
  const cart = getCart();
  const idx = cart.findIndex((c) => c.id === id);
  if (idx !== -1) {
    cart[idx].quantity = quantity;
    if (cart[idx].quantity <= 0) cart.splice(idx, 1);
    saveCart(cart);
  }
}

export default { getCart, saveCart, addToCart, removeFromCart, clearCart, updateQuantity };
