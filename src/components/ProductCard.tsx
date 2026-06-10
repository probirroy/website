import React from "react";
import { Star, ShoppingCart, Eye } from "lucide-react";
import { Product } from "../types";

interface ProductCardProps {
  key?: string;
  product: Product;
  currency: "INR" | "BDT";
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, size: number) => void;
}

export default function ProductCard({
  product,
  currency,
  onSelectProduct,
  onAddToCart,
}: ProductCardProps) {
  // Exchange rate config: 1 INR = 1.15 BDT
  const formattedPrice = React.useMemo(() => {
    if (currency === "INR") {
      return `₹${product.price.toLocaleString("en-IN")}`;
    } else {
      const bdtPrice = Math.round(product.price * 1.15);
      return `৳${bdtPrice.toLocaleString("en-BD")}`;
    }
  }, [product.price, currency]);

  // Mock stars for a beautiful display
  const rating = React.useMemo(() => {
    // Generate a consistent pseudo-random rating based on product name length
    return (4.2 + (product.name.length % 9) * 0.1).toFixed(1);
  }, [product.name]);

  const reviewsCount = React.useMemo(() => {
    return (product.name.length * 7) + 12;
  }, [product.name]);

  const isOutOfStock = product.stock <= 0;

  return (
    <div 
      className="group bg-white rounded-3xl border border-slate-100 hover:border-slate-200 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col overflow-hidden h-full relative"
      id={`product-card-${product.id}`}
    >
      {/* Category Tag & Stock State */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 items-start">
        <span className="bg-slate-900/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
          {product.category}
        </span>
        {product.stock <= 3 && product.stock > 0 && (
          <span className="bg-amber-500/95 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
            Only {product.stock} left
          </span>
        )}
        {isOutOfStock && (
          <span className="bg-rose-500 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Sold Out
          </span>
        )}
      </div>

      {/* Product Image Area */}
      <div className="aspect-[4/3] bg-slate-50 relative overflow-hidden flex items-center justify-center p-4">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="object-contain max-h-full max-w-full transform group-hover:scale-110 transition-transform duration-500 filter drop-shadow-md"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            onClick={() => onSelectProduct(product)}
            className="p-3 bg-white hover:bg-slate-100 text-black rounded-full shadow-lg transition active:scale-95 flex items-center gap-1.5 font-semibold text-xs"
            title="View Details"
          >
            <Eye className="w-4 h-4" /> View Details
          </button>
        </div>
      </div>

      {/* Card Content Description */}
      <div className="p-5 flex flex-col flex-grow">
        <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
          {product.brand}
        </span>
        <h3 
          onClick={() => onSelectProduct(product)}
          className="font-heading font-bold text-base text-slate-800 group-hover:text-rose-600 transition-colors duration-200 cursor-pointer line-clamp-1 mb-2"
        >
          {product.name}
        </h3>

        {/* Ratings and reviews */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center text-amber-500">
            <Star className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="text-xs font-bold text-slate-700">{rating}</span>
          <span className="text-[11px] text-slate-400">({reviewsCount} reviews)</span>
        </div>

        {/* Pricing & Add to Cart button */}
        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Price</span>
            <span className="text-lg font-heading font-bold text-slate-900">{formattedPrice}</span>
          </div>

          <button
            onClick={() => {
              // Standard auto select first available size for quick add-to-cart
              if (!isOutOfStock) {
                const defaultSize = product.sizes[0] || 8;
                onAddToCart(product, defaultSize);
              }
            }}
            disabled={isOutOfStock}
            className={`px-4 py-2 text-xs font-bold rounded-2xl transition duration-200 flex items-center gap-2 ${
              isOutOfStock
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 active:scale-95"
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Stock
          </button>
        </div>
      </div>
    </div>
  );
}
