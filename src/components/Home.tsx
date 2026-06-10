import React from "react";
import { ArrowRight, Star, Disc, Sparkles, TrendingUp, ShieldCheck } from "lucide-react";
import { Product } from "../types";

interface HomeProps {
  featuredProducts: Product[];
  onExplore: (category?: string) => void;
  onSelectProduct: (product: Product) => void;
  currency: "INR" | "BDT";
}

export default function Home({
  featuredProducts,
  onExplore,
  onSelectProduct,
  currency,
}: HomeProps) {
  const categories = [
    {
      name: "Running",
      desc: "Aerodynamic engineering and premium springy comfort.",
      stats: "24 items",
      color: "bg-blue-500",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=350&q=80",
    },
    {
      name: "Sneakers",
      desc: "High-contrast block styling for streetwear culture.",
      stats: "18 items",
      color: "bg-pink-500",
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=350&q=80",
    },
    {
      name: "Casual",
      desc: "Premium lightweight walking and weekend Derby dress ups.",
      stats: "15 items",
      color: "bg-amber-500",
      image: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=350&q=80",
    },
    {
      name: "Formal",
      desc: "Authentic double-stitched calfskin for business elite.",
      stats: "8 items",
      color: "bg-purple-500",
      image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=350&q=80",
    },
  ];

  return (
    <div className="space-y-16 pb-12">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-rose-950 text-white min-h-[500px] sm:min-h-[600px] flex items-center px-4 sm:px-8 md:px-14 rounded-b-[40px] shadow-2xl">
        {/* Background visual geometric lights */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_20%,#f43f5e,transparent_45%)]" />
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-rose-500/10 rounded-full blur-[100px]" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 py-12 md:py-16">
          
          {/* Hero text */}
          <div className="space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-full text-xs font-bold uppercase tracking-widest leading-none">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Spring Collection 2026
            </span>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-none">
              STEP INTO THE <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-500 to-amber-400">
                ULTIMATE AGILITY.
              </span>
            </h1>
            <p className="text-slate-350 text-sm sm:text-base max-w-lg leading-relaxed font-medium">
              Discover professional running shoes, streetwear sneakers, and premium hand-crafted leather loafers engineered to optimize your daily strides.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => onExplore()}
                className="bg-white text-black hover:bg-slate-100 font-heading font-bold text-xs px-6 py-4 rounded-2xl transition duration-200 shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
              >
                EXPLORE COMPLETE RELEASES
                <ArrowRight className="w-4 h-4 text-rose-600" />
              </button>
              <button
                onClick={() => onExplore("Sneakers")}
                className="bg-transparent border border-slate-600 hover:border-white text-white font-heading font-bold text-xs px-6 py-4 rounded-2xl transition duration-200 flex items-center gap-2 cursor-pointer"
              >
                BROWSE SNEAKERS
              </button>
            </div>
          </div>

          {/* Hero visual promo product model showcase */}
          <div className="relative flex items-center justify-center p-6 lg:p-0">
            <div className="w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full bg-gradient-to-tr from-rose-500/10 to-transparent absolute border border-white/5 animate-spin" style={{ animationDuration: "25s" }} />
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=720&q=80"
              alt="Elite Promo Red Shoe"
              referrerPolicy="no-referrer"
              className="z-10 object-contain max-w-full drop-shadow-[0_35px_35px_rgba(244,63,94,0.35)] transform rotate-[-12deg] hover:rotate-0 transition-transform duration-500"
            />
          </div>

        </div>
      </section>

      {/* 2. CHOOSE BY SELECTION CATEGORY SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-mono font-bold text-rose-500 uppercase tracking-widest">
            Tailored Fit Selection
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
            Choose By Footwear Category
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            From tracks to formal boardrooms, explore specialized shoes constructed dynamically for your context.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => onExplore(cat.name)}
              className="group bg-white border border-slate-100 hover:border-slate-300 rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-72 cursor-pointer relative overflow-hidden"
            >
              {/* Image highlight background card */}
              <div className="absolute top-1/2 -right-8 -translate-y-1/2 w-44 h-44 opacity-20 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none p-2 flex items-center justify-center select-none bg-slate-50 rounded-full">
                <img
                  src={cat.image}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="object-contain max-h-full max-w-full transform rotate-[-20deg]"
                />
              </div>

              <div className="relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">
                  {cat.stats}
                </span>
                <h3 className="font-heading font-extrabold text-xl text-slate-900 mt-1">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 mt-2 max-w-[160px] leading-relaxed">
                  {cat.desc}
                </p>
              </div>

              <div className="relative z-10 flex items-center gap-1 text-xs font-bold text-slate-800 hover:text-rose-600 transition">
                Explore Releases <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-3 mb-10">
          <div>
            <span className="text-xs font-mono font-bold text-rose-500 uppercase tracking-widest">
              Hot Active Drops
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
              Featured Sole Releases
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-md">
              Selected sneakers and loafers that have topped our customer appreciation charts this week.
            </p>
          </div>

          <button
            onClick={() => onExplore()}
            className="text-xs sm:text-sm font-bold text-slate-900 hover:text-rose-600 transition flex items-center gap-1"
          >
            See all sneakers <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.slice(0, 3).map((shoe) => {
            const displayPrice = currency === "INR" 
              ? `₹${shoe.price.toLocaleString("en-IN")}` 
              : `৳${Math.round(shoe.price * 1.15).toLocaleString("en-BD")}`;

            return (
              <div
                key={shoe.id}
                onClick={() => onSelectProduct(shoe)}
                className="group bg-white rounded-3xl border border-slate-100 hover:border-slate-200 transition-all duration-300 p-5 shadow-sm hover:shadow-xl flex flex-col cursor-pointer"
              >
                <div className="aspect-[4/3] bg-slate-50 rounded-2xl flex items-center justify-center p-4 relative overflow-hidden mb-4 border border-slate-100/50">
                  <img
                    src={shoe.image}
                    alt={shoe.name}
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain filter drop-shadow-md transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-white px-2.5 py-0.5 rounded-full border border-slate-100 text-[9px] font-bold text-rose-500 uppercase">
                    HOT DROP
                  </span>
                </div>

                <div className="space-y-1 flex-grow flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                      {shoe.brand}
                    </span>
                    <h3 className="font-heading font-extrabold text-base text-slate-950 group-hover:text-rose-500 transition line-clamp-1">
                      {shoe.name}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-base font-heading font-extrabold text-slate-900">
                      {displayPrice}
                    </span>
                    <span className="text-[10px] font-bold bg-slate-950 text-white px-3 py-1.5 rounded-xl uppercase tracking-wider">
                      View Details
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. PREMIUM PLATFORM TRUST */}
      <section className="bg-slate-50 max-w-7xl mx-auto rounded-[32px] p-8 sm:p-12 border border-slate-100/80">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
          
          <div className="space-y-2">
            <span className="inline-flex p-3 bg-rose-50 text-rose-500 rounded-2xl border border-rose-100 mb-1">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h3 className="font-heading font-bold text-base text-slate-900">Protected Subcontinental Settle</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Supports secure transaction wallets across India and Bangladesh, featuring instant authentications with bKash, UPI QR codes, Razorpay gates and SSLCommerz direct channels.
            </p>
          </div>

          <div className="space-y-2">
            <span className="inline-flex p-3 bg-blue-50 text-blue-500 rounded-2xl border border-blue-100 mb-1">
              <TrendingUp className="w-5 h-5" />
            </span>
            <h3 className="font-heading font-bold text-base text-slate-900">Agile Product Performance</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              We focus on premium materials including calfskin leather soles, micro-weave composites, and memory cushioning layers to elevate physical daily mileage.
            </p>
          </div>

          <div className="space-y-2">
            <span className="inline-flex p-3 bg-purple-50 text-purple-500 rounded-2xl border border-purple-100 mb-1">
              <Disc className="w-5 h-5" />
            </span>
            <h3 className="font-heading font-bold text-base text-slate-900">Real-Time Inventory Integrity</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Integrated real-time database structures ensure stock levels are adjusted immediately on checkouts, preventing duplicate bookings or delays in delivery.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}
