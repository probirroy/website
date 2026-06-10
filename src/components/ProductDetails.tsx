import React, { useState, useMemo } from "react";
import { ArrowLeft, Star, ShoppingCart, MessageSquare, Truck, ShieldAlert, BadgeCheck } from "lucide-react";
import { Product } from "../types";

interface ProductDetailsProps {
  product: Product;
  currency: "INR" | "BDT";
  onBack: () => void;
  onAddToCart: (product: Product, size: number) => void;
}

export default function ProductDetails({
  product,
  currency,
  onBack,
  onAddToCart,
}: ProductDetailsProps) {
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [successAnimation, setSuccessAnimation] = useState(false);

  const formattedPrice = useMemo(() => {
    if (currency === "INR") {
      return `₹${product.price.toLocaleString("en-IN")}`;
    } else {
      const bdtPrice = Math.round(product.price * 1.15);
      return `৳${bdtPrice.toLocaleString("en-BD")}`;
    }
  }, [product.price, currency]);

  const rating = useMemo(() => {
    return (4.2 + (product.name.length % 9) * 0.1).toFixed(1);
  }, [product.name]);

  const reviewsCount = useMemo(() => {
    return (product.name.length * 7) + 12;
  }, [product.name]);

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select your shoe size first!");
      return;
    }
    onAddToCart(product, selectedSize);
    
    // Simple visual feedback
    setSuccessAnimation(true);
    setTimeout(() => setSuccessAnimation(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-8">
      {/* Return Navigation */}
      <button
        onClick={onBack}
        className="group mb-8 flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-black transition"
      >
        <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
        Back to shoe catalog
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-sm">
        
        {/* Left Side: Dynamic Showcase Image */}
        <div className="relative aspect-square sm:aspect-[4/3] md:aspect-square bg-slate-50 rounded-2xl flex items-center justify-center p-6 border border-slate-100 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="max-h-full max-w-full object-contain filter drop-shadow-2xl transform hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-black text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              {product.category}
            </span>
          </div>
        </div>

        {/* Right Side: Information Panel */}
        <div className="flex flex-col">
          {/* Brand/Product Headings */}
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
            {product.brand}
          </span>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 mb-3 leading-tight">
            {product.name}
          </h1>

          {/* Stars & Rating Summary */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center text-amber-500">
              {Array.from({ length: 5 }).map((_, index) => {
                const filledRating = Math.round(Number(rating));
                return (
                  <Star
                    key={index}
                    className={`w-4 h-4 ${
                      index < filledRating ? "fill-current" : "text-slate-200"
                    }`}
                  />
                );
              })}
            </div>
            <span className="text-xs font-extrabold text-slate-800">{rating} out of 5 stars</span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" /> {reviewsCount} community reviews
            </span>
          </div>

          {/* Pricing area */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50 mb-6 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-950">
              {formattedPrice}
            </span>
            <span className="text-xs text-slate-400 font-medium">Inclusive of all local GST, taxes, and duties</span>
          </div>

          {/* Product Description */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Description</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              {product.description} Ensure your dynamic stability during swift paces with modern mesh weave layouts that breathe with total ease. Built using fully-engineered composite uppers for durable daily mileage.
            </p>
          </div>

          {/* Interactive Size Selector */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Select Size (UK/US Size)</h3>
              <span className="text-xs text-rose-500 font-semibold hover:underline cursor-pointer">Size Guide</span>
            </div>
            
            <div className="flex flex-wrap gap-2.5">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[48px] h-12 rounded-xl text-center font-heading text-sm font-bold border transition duration-150 flex items-center justify-center cursor-pointer ${
                    selectedSize === size
                      ? "bg-black text-white border-black"
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-800"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart CTA */}
          <div className="flex flex-col gap-3.5 mt-auto">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-500">Inventory Status</span>
              {isOutOfStock ? (
                <span className="text-rose-500 font-bold flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" /> Out of stock
                </span>
              ) : (
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <BadgeCheck className="w-3.5 h-3.5" /> In Stock ({product.stock} units left)
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full py-4 text-sm font-heading font-extrabold rounded-2xl transition duration-300 flex items-center justify-center gap-2 shadow-lg ${
                isOutOfStock
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                  : successAnimation
                  ? "bg-emerald-600 text-white shadow-emerald-200"
                  : "bg-black text-white hover:bg-slate-900 active:scale-[0.98] shadow-slate-200"
              }`}
            >
              <ShoppingCart className="w-4 h-4 animate-bounce" />
              {successAnimation ? "ADDED SECURELY! ✔" : isOutOfStock ? "SOLD OUT" : "ADD TO SHOPPING CART"}
            </button>
          </div>

          {/* Features Badges */}
          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6 mt-8 text-xs text-slate-500">
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-slate-50 text-slate-700 rounded-xl">
                <Truck className="w-4 h-4" />
              </span>
              <div>
                <p className="font-bold text-slate-800">Express Shipping</p>
                <p className="text-[11px] text-slate-400">Free delivery within 2-3 days</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-slate-50 text-slate-700 rounded-xl">
                <BadgeCheck className="w-4 h-4" />
              </span>
              <div>
                <p className="font-bold text-slate-800">100% Authentic</p>
                <p className="text-[11px] text-slate-400">Guaranteed original items only</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
