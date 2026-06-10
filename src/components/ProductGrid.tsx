import React, { useState, useMemo } from "react";
import { SlidersHorizontal, Search, RefreshCw, Star } from "lucide-react";
import { Product } from "../types";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  currency: "INR" | "BDT";
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, size: number) => void;
}

export default function ProductGrid({
  products,
  currency,
  onSelectProduct,
  onAddToCart,
}: ProductGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSize, setSelectedSize] = useState<number | "All">("All");
  const [maxPrice, setMaxPrice] = useState<number>(20000); // base price in INR
  const [sortBy, setSortBy] = useState<"default" | "lowHigh" | "highLow">("default");

  const brands = useMemo(() => {
    const b = new Set(products.map((p) => p.brand));
    return ["All", ...Array.from(b)];
  }, [products]);

  const categories = useMemo(() => {
    const c = new Set(products.map((p) => p.category));
    return ["All", ...Array.from(c)];
  }, [products]);

  const allSizes = [6, 7, 8, 9, 10, 11, 12];

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesBrand = selectedBrand === "All" || product.brand === selectedBrand;
        const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
        const matchesSize = selectedSize === "All" || product.sizes.includes(Number(selectedSize));
        const matchesPrice = product.price <= maxPrice;

        return matchesSearch && matchesBrand && matchesCategory && matchesSize && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === "lowHigh") return a.price - b.price;
        if (sortBy === "highLow") return b.price - a.price;
        return 0; // default order
      });
  }, [products, searchQuery, selectedBrand, selectedCategory, selectedSize, maxPrice, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedBrand("All");
    setSelectedCategory("All");
    setSelectedSize("All");
    setMaxPrice(20000);
    setSortBy("default");
  };

  const getPriceLabel = (val: number) => {
    if (currency === "INR") {
      return `₹${val.toLocaleString()}`;
    } else {
      return `৳${Math.round(val * 1.15).toLocaleString()}`;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2 mb-8">
        <span className="text-xs font-mono font-bold text-rose-500 uppercase tracking-widest">
          Premium Footwear
        </span>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-950">
          The Athletic & Casual Collection
        </h1>
        <p className="text-slate-500 text-sm sm:text-base max-w-2xl">
          Engineered for performance, crafted for style. Explore sneakers, runners, and formal selections built with elite cushioning and ultra-durable support structures.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Filters Panel */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-100 flex flex-col gap-6 h-fit shrink-0">
          <div className="flex items-center justify-between border-b border-slate-50 pb-4">
            <h2 className="font-heading font-bold text-lg text-slate-800 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-rose-500" /> Filters
            </h2>
            <button
              onClick={handleResetFilters}
              className="text-xs text-rose-500 hover:text-rose-600 hover:underline flex items-center gap-1 font-semibold"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Search Box */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-600">Search Products</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Air Zoom, Adidas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-500 focus:bg-white transition"
              />
              <Search className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Category Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-600">Category</label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    selectedCategory === cat
                      ? "bg-black text-white"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Brand Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-600">Brand</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-rose-500"
            >
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Size Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-600">UK/US Size</label>
            <div className="grid grid-cols-4 gap-1.5">
              <button
                onClick={() => setSelectedSize("All")}
                className={`py-2 rounded-xl text-xs font-semibold transition ${
                  selectedSize === "All"
                    ? "bg-black text-white col-span-2"
                    : "bg-slate-50 text-gray-600 hover:bg-slate-100 col-span-2"
                }`}
              >
                All Sizes
              </button>
              {allSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-2 rounded-xl text-xs font-semibold transition ${
                    selectedSize === size
                      ? "bg-black text-white"
                      : "bg-slate-50 text-gray-500 hover:bg-slate-100"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>Max Price</span>
              <span className="text-rose-600 font-bold">{getPriceLabel(maxPrice)}</span>
            </div>
            <input
              type="range"
              min="3000"
              max="20000"
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full xl:cursor-pointer accent-rose-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold antialiased">
              <span>{getPriceLabel(3000)}</span>
              <span>{getPriceLabel(20000)}</span>
            </div>
          </div>
        </div>

        {/* Right Product Grid */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Sorting / Statistics bar */}
          <div className="flex items-center justify-between border border-slate-50 bg-white px-5 py-3 rounded-2xl">
            <span className="text-xs font-semibold text-slate-500">
              Showing <span className="text-black font-bold">{filteredProducts.length}</span>{" "}
              {filteredProducts.length === 1 ? "sneaker" : "sneakers"} matching search
            </span>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
                Sort By
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-slate-100 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
              >
                <option value="default">Release Default</option>
                <option value="lowHigh">Price: Low to High</option>
                <option value="highLow">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Products List Rendering */}
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
              <div className="bg-rose-50 p-4 rounded-full text-rose-500 mb-4">
                <SlidersHorizontal className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-extrabold text-xl text-slate-800 mb-1">
                No shoes found
              </h3>
              <p className="text-slate-500 text-sm max-w-sm mb-6">
                We couldn't locate any footwear matching your exact filters. Try adjusting your brand, size, or budget range!
              </p>
              <button
                onClick={handleResetFilters}
                className="bg-black text-white hover:bg-slate-900 px-6 py-2.5 rounded-2xl text-xs font-bold transition shadow-md duration-200"
              >
                Clear All Constraints
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  currency={currency}
                  onSelectProduct={onSelectProduct}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
