import React from "react";
import { ShoppingBag, ShieldCheck, ShoppingCart, Landmark, Search, Globe } from "lucide-react";

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  currency: "INR" | "BDT";
  onChangeCurrency: (curr: "INR" | "BDT") => void;
  currentTab: "home" | "shop" | "admin";
  onChangeTab: (tab: "home" | "shop" | "admin") => void;
  isAdminLoggedIn: boolean;
  onLogoutAdmin: () => void;
}

export default function Navbar({
  cartCount,
  onOpenCart,
  currency,
  onChangeCurrency,
  currentTab,
  onChangeTab,
  isAdminLoggedIn,
  onLogoutAdmin,
}: NavbarProps) {
  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-3 sm:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => onChangeTab("home")} 
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <div className="bg-black text-white p-2 rounded-xl flex items-center justify-center shadow-md">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <span className="font-heading font-bold text-xl sm:text-2xl tracking-tight text-slate-900">
            STRIDE<span className="text-rose-500">.</span>
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="hidden md:flex items-center gap-8 font-medium">
          <button
            onClick={() => onChangeTab("home")}
            className={`transition-colors duration-200 py-1 border-b-2 ${
              currentTab === "home" 
                ? "text-black border-black font-semibold" 
                : "text-slate-500 border-transparent hover:text-black"
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onChangeTab("shop")}
            className={`transition-colors duration-200 py-1 border-b-2 ${
              currentTab === "shop" 
                ? "text-black border-black font-semibold" 
                : "text-slate-500 border-transparent hover:text-black"
            }`}
          >
            Explore Shoes
          </button>
          <button
            onClick={() => onChangeTab("admin")}
            className={`transition-colors duration-200 py-1 border-b-2 flex items-center gap-1.5 ${
              currentTab === "admin" 
                ? "text-rose-600 border-rose-600 font-semibold" 
                : "text-slate-500 border-transparent hover:text-rose-600"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            {isAdminLoggedIn ? "Admin Dashboard" : "Admin Panel"}
          </button>
        </div>

        {/* Utility Rails / Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Currency Switcher */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold text-slate-700">
            <button
              onClick={() => onChangeCurrency("INR")}
              className={`px-2 py-1 rounded-lg transition-all duration-200 ${
                currency === "INR" 
                  ? "bg-white text-rose-600 shadow-sm" 
                  : "hover:text-slate-900"
              }`}
            >
              INR (₹)
            </button>
            <button
              onClick={() => onChangeCurrency("BDT")}
              className={`px-2 py-1 rounded-lg transition-all duration-200 ${
                currency === "BDT" 
                  ? "bg-white text-emerald-600 shadow-sm" 
                  : "hover:text-slate-900"
              }`}
            >
              BDT (৳)
            </button>
          </div>

          {/* Quick Shop Tab for Mobile */}
          <button
            onClick={() => onChangeTab("shop")}
            className="md:hidden p-2 text-slate-600 hover:text-black hover:bg-slate-50 rounded-lg transition"
            title="Explore Shop"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Shopping Cart Icon & Badge */}
          <button
            onClick={onOpenCart}
            id="cart-trigger-btn"
            className="relative p-2.5 text-slate-700 hover:text-black hover:bg-slate-50 rounded-xl transition duration-200 border border-slate-100 flex items-center justify-center count-wrapper"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1.5 bg-rose-500 text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded-full border border-white animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Admin Link if Logged in or Quick admin path */}
          <button
            onClick={() => onChangeTab("admin")}
            className={`p-2 rounded-xl border flex md:hidden items-center justify-center ${
              isAdminLoggedIn 
                ? "bg-rose-50 text-rose-600 border-rose-200" 
                : "text-slate-500 border-slate-100 hover:text-black"
            }`}
            title="Admin Module"
          >
            <ShieldCheck className="w-5 h-5" />
          </button>

          {isAdminLoggedIn && (
            <button
              onClick={onLogoutAdmin}
              className="hidden lg:block bg-slate-900 text-white text-xs font-semibold px-3 py-2 rounded-xl hover:bg-slate-800 transition"
            >
              Logout Admin
            </button>
          )}

        </div>

      </div>
    </nav>
  );
}
