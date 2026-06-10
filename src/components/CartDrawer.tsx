import React, { useMemo } from "react";
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { CartItem } from "../types";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currency: "INR" | "BDT";
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartDrawerProps) {
  const isCartEmpty = cartItems.length === 0;

  const currencySymbol = currency === "INR" ? "₹" : "৳";

  // Calculate prices dynamically
  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const price = currency === "INR" ? item.product.price : Math.round(item.product.price * 1.15);
      return acc + price * item.quantity;
    }, 0);
  }, [cartItems, currency]);

  const deliveryFee = useMemo(() => {
    if (isCartEmpty) return 0;
    return currency === "INR" ? 150 : 200; // Mock delivery fees
  }, [isCartEmpty, currency]);

  const totalAmount = cartSubtotal + deliveryFee;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer content */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full transform transition-transform duration-300">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-rose-500" /> Shopping Cart
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-black hover:bg-slate-50 rounded-xl transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart items list */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {isCartEmpty ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="bg-slate-50 p-5 rounded-full text-slate-400 mb-4 border border-dashed border-slate-200">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-bold text-base text-slate-800 mb-1">Your cart is empty</h3>
                <p className="text-xs text-slate-400 max-w-xs mb-6">
                  Items you add to your shopping bag will appear right here, waiting for checkout!
                </p>
                <button
                  onClick={onClose}
                  className="bg-black text-white hover:bg-slate-900 text-xs font-bold px-5 py-2.5 rounded-xl transition"
                >
                  Start Exploring Shoes
                </button>
              </div>
            ) : (
              cartItems.map((item) => {
                const itemPrice = currency === "INR" 
                  ? item.product.price 
                  : Math.round(item.product.price * 1.15);

                return (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 relative group transition hover:border-slate-200"
                  >
                    {/* Shoe Thumbnail */}
                    <div className="w-20 h-20 bg-white rounded-xl border border-slate-100 flex items-center justify-center p-2 shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="object-contain max-h-full max-w-full"
                      />
                    </div>

                    {/* Detailed info */}
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs font-bold font-heading text-slate-800 line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition duration-150 absolute top-2 right-2 p-1 bg-white border border-slate-100 rounded-lg shadow-sm"
                            title="Remove unit"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                          Brand: {item.product.brand} | Size: <span className="text-rose-500 font-bold">{item.selectedSize}</span>
                        </p>
                      </div>

                      {/* Quantity operations */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2.5 bg-white p-1 rounded-lg border border-slate-100 text-xs font-bold">
                          <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="p-1 hover:bg-slate-100 rounded text-slate-500 transition"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-4 text-center text-slate-800">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="p-1 hover:bg-slate-100 rounded text-slate-500 transition"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-sm font-bold font-heading text-slate-950">
                          {currencySymbol}{(itemPrice * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pricing summary Footer */}
          {!isCartEmpty && (
            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Cart Subtotal</span>
                  <span className="text-slate-800">{currencySymbol}{cartSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Est. Delivery Duty Fee</span>
                  <span className="text-slate-800">{currencySymbol}{deliveryFee.toLocaleString()}</span>
                </div>
                <div className="border-t border-slate-100 my-2 pt-2 flex items-center justify-between text-sm font-heading font-extrabold text-slate-900">
                  <span>Total Amount</span>
                  <span className="text-rose-600 font-extrabold text-base">
                    {currencySymbol}{totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={onCheckout}
                className="w-full bg-black hover:bg-slate-900 text-white py-4 px-6 text-xs font-heading font-bold rounded-2xl transition duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl shadow-slate-150 active:scale-[0.98]"
              >
                PROCEED TO CHECKOUT
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
