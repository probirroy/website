import React, { useState, useEffect } from "react";
import { 
  KeyRound, ShieldCheck, AreaChart, ShoppingBag, DollarSign, PlusCircle, 
  Trash2, Edit3, Settings, Database, Eye, X, ListOrdered 
} from "lucide-react";
import { Product, Order, DashboardStats } from "../types";

interface AdminPanelProps {
  products: Product[];
  onRefreshProducts: () => void;
  isAdminLoggedIn: boolean;
  adminToken: string;
  onAdminLogin: (token: string) => void;
}

export default function AdminPanel({
  products,
  onRefreshProducts,
  isAdminLoggedIn,
  adminToken,
  onAdminLogin,
}: AdminPanelProps) {
  // Authentication Forms State
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  // Active Tab/Sub-panel State
  const [adminTab, setAdminTab] = useState<"inventory" | "orders">("inventory");

  // CRUD Operations States
  const [metrics, setMetrics] = useState<DashboardStats | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProductToEdit, setSelectedProductToEdit] = useState<Product | null>(null);

  // Form Fields for Add/Edit
  const [prodName, setProdName] = useState("");
  const [prodBrand, setProdBrand] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [prodPrice, setProdPrice] = useState(0);
  const [prodCategory, setProdCategory] = useState<"Running" | "Sneakers" | "Casual" | "Formal">("Running");
  const [prodImage, setProdImage] = useState("");
  const [prodStock, setProdStock] = useState(10);
  const [prodSizesStr, setProdSizesStr] = useState("7, 8, 9, 10, 11"); // Comma-separated sizes

  // Fetch admin dashboard metrics
  const fetchMetrics = async () => {
    if (!isAdminLoggedIn || !adminToken) return;
    try {
      const res = await fetch("/api/admin/metrics", {
        headers: {
          "Authorization": `Bearer ${adminToken}`
        }
      });
      if (res.ok) {
        const stats: DashboardStats = await res.json();
        setMetrics(stats);
      }
    } catch (e) {
      console.error("Failed fetching admin metrics", e);
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchMetrics();
    }
  }, [isAdminLoggedIn, adminToken, products]);

  // Login handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsAuthorizing(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameInput, password: passwordInput })
      });

      if (res.ok) {
        const data = await res.json();
        onAdminLogin(data.token);
      } else {
        const err = await res.json();
        setAuthError(err.error || "Authentication failed.");
      }
    } catch (err) {
      setAuthError("Server unavailable. Ensure server is active.");
    } finally {
      setIsAuthorizing(false);
    }
  };

  // Create Product handler
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const sizesArr = prodSizesStr
      .split(",")
      .map(s => Number(s.trim()))
      .filter(s => !isNaN(s) && s > 0);

    const newProduct = {
      name: prodName,
      brand: prodBrand,
      description: prodDesc,
      price: Number(prodPrice),
      sizes: sizesArr,
      category: prodCategory,
      image: prodImage || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=650&q=80",
      stock: Number(prodStock)
    };

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`
        },
        body: JSON.stringify(newProduct)
      });

      if (res.ok) {
        setIsAddModalOpen(false);
        onRefreshProducts();
        // Reset form
        setProdName("");
        setProdBrand("");
        setProdDesc("");
        setProdPrice(0);
        setProdStock(10);
        setProdImage("");
      } else {
        const err = await res.json();
        alert(err.error || "Failed to create product");
      }
    } catch (e) {
      alert("Error adding product");
    }
  };

  // Edit Product Setup
  const openEditModal = (product: Product) => {
    setSelectedProductToEdit(product);
    setProdName(product.name);
    setProdBrand(product.brand);
    setProdDesc(product.description);
    setProdPrice(product.price);
    setProdCategory(product.category);
    setProdImage(product.image);
    setProdStock(product.stock);
    setProdSizesStr(product.sizes.join(", "));
    setIsEditModalOpen(true);
  };

  // Submit Product Updates
  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductToEdit) return;

    const sizesArr = prodSizesStr
      .split(",")
      .map(s => Number(s.trim()))
      .filter(s => !isNaN(s) && s > 0);

    const updatedProduct = {
      name: prodName,
      brand: prodBrand,
      description: prodDesc,
      price: Number(prodPrice),
      sizes: sizesArr,
      category: prodCategory,
      image: prodImage,
      stock: Number(prodStock)
    };

    try {
      const res = await fetch(`/api/products/${selectedProductToEdit.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`
        },
        body: JSON.stringify(updatedProduct)
      });

      if (res.ok) {
        setIsEditModalOpen(false);
        onRefreshProducts();
        setSelectedProductToEdit(null);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update product");
      }
    } catch (e) {
      alert("Error saving product changes");
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from store database?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${adminToken}`
        }
      });

      if (res.ok) {
        onRefreshProducts();
      } else {
        alert("Failed to delete shoe.");
      }
    } catch (e) {
      alert("Error issuing deletion request.");
    }
  };

  // Render Login state if not authenticated
  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl flex flex-col items-center">
          <div className="bg-rose-50 text-rose-500 p-4 rounded-2xl mb-4 border border-rose-100 flex items-center justify-center">
            <ShieldCheck className="w-8 h-8" />
          </div>
          
          <h1 className="font-heading font-extrabold text-2xl text-slate-900 text-center mb-1">
            SoleStride Administration
          </h1>
          <p className="text-xs text-slate-400 font-semibold mb-6 uppercase tracking-wider text-center">
            Enter administrative credentials
          </p>

          <form onSubmit={handleLoginSubmit} className="w-full space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Admin Username</label>
              <input
                type="text"
                required
                placeholder="e.g., RAHULADMIN"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-500 font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Admin Passkey</label>
              <input
                type="password"
                required
                placeholder="••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-500 font-mono tracking-widest text-center"
              />
            </div>

            {authError && (
              <p className="text-xs text-rose-500 font-bold bg-rose-50 p-2.5 rounded-lg text-center">
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={isAuthorizing}
              className="w-full bg-black hover:bg-slate-900 text-white font-heading font-extrabold text-xs py-3.5 px-4 rounded-xl transition duration-150 shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              {isAuthorizing ? "Authorizing Security..." : "GAIN SECURE CONNECTION"}
            </button>
          </form>

          {/* Quick Helper Credentials Display */}
          <div className="mt-8 pt-4 border-t border-slate-150 w-full text-center">
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-1">
              Development Admin Credentials
            </span>
            <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl font-mono text-[11px] text-slate-600 inline-block">
              <span className="font-bold">ID:</span> RAHULADMIN | <span className="font-bold">PW:</span> 123456
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-8">
      {/* Admin Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-mono font-bold text-rose-500 uppercase tracking-widest flex items-center gap-1">
            <Database className="w-3.5 h-3.5" /> SECURE ROOT PORTAL
          </span>
          <h1 className="font-heading font-extrabold text-3xl text-slate-950">
            Control Station Dashboard
          </h1>
          <p className="text-sm text-slate-400 font-semibold uppercase tracking-wider">
            Operational User ID: <span className="text-rose-500">RAHULADMIN</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAdminTab("inventory")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              adminTab === "inventory"
                ? "bg-black text-white shadow-md shadow-slate-200"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> Inventory Management
          </button>
          <button
            onClick={() => setAdminTab("orders")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              adminTab === "orders"
                ? "bg-black text-white shadow-md shadow-slate-200"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <ListOrdered className="w-4 h-4" /> Live Store Orders ({metrics?.orders.length || 0})
          </button>
        </div>
      </div>

      {/* OPERATIONAL METRICS DASHBOARD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Sales (INR)</span>
            <p className="font-heading font-extrabold text-xl text-slate-900 mt-1">
              ₹{(metrics?.totalRevenueINR || 0).toLocaleString("en-IN")}
            </p>
          </div>
          <div className="text-rose-500 bg-rose-50 p-2.5 rounded-xl border border-rose-100">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Sales (BDT)</span>
            <p className="font-heading font-extrabold text-xl text-emerald-600 mt-1">
              ৳{(metrics?.totalRevenueBDT || 0).toLocaleString("en-BD")}
            </p>
          </div>
          <div className="text-emerald-500 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Orders</span>
            <p className="font-heading font-extrabold text-xl text-slate-900 mt-1">
              {metrics?.totalOrders || 0}
            </p>
          </div>
          <div className="text-indigo-500 bg-slate-50 p-2.5 rounded-xl border border-slate-150">
            <ListOrdered className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Products</span>
            <p className="font-heading font-extrabold text-xl text-slate-900 mt-1">
              {metrics?.totalProducts || 0}
            </p>
          </div>
          <div className="text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-150">
            <Database className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* TAB SUB-PANEL 1: Inventory Table & CRUD operations */}
      {adminTab === "inventory" && (
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-100 mb-6 gap-3">
            <div>
              <h2 className="font-heading font-bold text-xl text-slate-900">Configure Footwear Inventory</h2>
              <p className="text-xs text-slate-400 font-medium">Create (Add), Update (Edit) or Remove (Delete) shoes inside live databases.</p>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold font-heading flex items-center gap-1.5 cursor-pointer shadow-md shadow-rose-100 transition active:scale-95"
            >
              <PlusCircle className="w-4 h-4" /> Add Shoe Release
            </button>
          </div>

          {/* Table container responsive wrapper */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-slate-400 font-mono font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4 rounded-l-xl">Shoe Specs</th>
                  <th className="py-3 px-4">Brand</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Unit Base Price</th>
                  <th className="py-3 px-4">Stock Units</th>
                  <th className="py-3 px-4 text-center rounded-r-xl">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400 font-medium font-heading">
                      Database is currently empty. Add a new footwear item to launch.
                    </td>
                  </tr>
                ) : (
                  products.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-4 px-4 flex items-center gap-3">
                        <div className="w-11 h-11 bg-slate-50 rounded-xl border border-slate-100 p-1 flex items-center justify-center shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="object-contain max-h-full max-w-full"
                          />
                        </div>
                        <div>
                          <p className="text-slate-800 font-bold font-heading">{item.name}</p>
                          <p className="text-[10px] font-mono text-slate-400 max-w-xs truncate">{item.id}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">{item.brand}</td>
                      <td className="py-4 px-4">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md uppercase font-bold text-[9px] tracking-wider">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-heading font-extrabold text-sm text-slate-900">
                        ₹{item.price.toLocaleString("en-IN")}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-0.5 rounded-md font-bold ${
                          item.stock === 0 
                            ? "bg-rose-50 text-rose-600" 
                            : item.stock <= 3 
                            ? "bg-amber-50 text-amber-600" 
                            : "bg-emerald-50 text-emerald-600"
                        }`}>
                          {item.stock} left
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-2 border border-slate-100 text-slate-600 bg-white hover:text-indigo-600 hover:border-indigo-150 rounded-lg transition"
                            title="Edit database record"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(item.id, item.name)}
                            className="p-2 border border-slate-100 text-slate-600 bg-white hover:text-rose-600 hover:border-rose-150 rounded-lg transition"
                            title="Delete shoes record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB SUB-PANEL 2: Orders Dashboard */}
      {adminTab === "orders" && (
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden p-6">
          <h2 className="font-heading font-bold text-xl text-slate-900 mb-1">
            Store Transaction Logs
          </h2>
          <p className="text-xs text-slate-400 font-medium mb-6">
            Review incoming full-stack payments, customer shipping details, and items specifications.
          </p>

          <div className="space-y-4">
            {!metrics || metrics.orders.length === 0 ? (
              <div className="text-center py-16 text-slate-400 font-medium font-heading border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                Any orders processed during active sessions will reside here. No transactions yet!
              </div>
            ) : (
              metrics.orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col md:flex-row justify-between gap-4 relative group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] font-mono font-bold bg-white border border-slate-200 px-2.5 py-0.5 rounded-lg text-slate-500">
                        {ord.id}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">
                        {new Date(ord.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="text-slate-700">
                      <p className="text-xs font-bold text-slate-900 leading-tight">
                        Client: {ord.customerName} ({ord.email})
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Shipping Route: <span className="font-bold text-slate-700">{ord.address}, {ord.city}, {ord.country}</span> | Ph: {ord.phone}
                      </p>
                    </div>

                    {/* Order items lists */}
                    <div className="flex flex-wrap gap-2.5 mt-2 pt-2 border-t border-slate-150">
                      {ord.items.map((it, i) => (
                        <div key={i} className="text-[10px] font-bold bg-white text-slate-600 px-2 py-1 rounded-md border border-slate-100">
                          {it.name} (UK {it.size}) × <span className="text-rose-500">{it.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end justify-between self-stretch gap-2 shrink-0 md:border-l md:border-slate-250 md:pl-6">
                    <div className="text-left md:text-right">
                      <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Settled Cost</p>
                      <p className={`font-heading font-extrabold text-base ${ord.currency === "INR" ? "text-slate-900" : "text-emerald-600"}`}>
                        {ord.currency === "INR" ? "₹" : "৳"}{ord.totalAmount.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] bg-slate-200 text-slate-700 font-bold uppercase rounded px-1.5 py-0.5 font-sans leading-none">
                        {ord.paymentMethod}
                      </span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold uppercase rounded px-1.5 py-0.5 font-sans leading-none">
                        SUCCESSFUL
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* INTERACTIVE FORM MODAL 1: ADD SHOE RELEASE */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />

          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative z-10 border border-slate-100 overflow-hidden">
            <div className="p-6 pb-4 border-b border-slate-50 flex items-center justify-between">
              <h2 className="font-heading font-extrabold text-lg text-slate-900">
                Publish New Footwear Record
              </h2>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl cursor-pointer">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3.5">
                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Air Force Dynamic Sneaker"
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4.5 py-2.5 text-xs focus:outline-none focus:border-rose-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Brand Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Nike"
                    value={prodBrand}
                    onChange={(e) => setProdBrand(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-rose-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-rose-500 font-semibold"
                  >
                    <option value="Running">Running</option>
                    <option value="Sneakers">Sneakers</option>
                    <option value="Casual">Casual</option>
                    <option value="Formal">Formal</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Base Price (INR ₹)</label>
                  <input
                    type="number"
                    required
                    min="1000"
                    placeholder="7999"
                    value={prodPrice || ""}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-rose-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Warehouse Stock Units</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="15"
                    value={prodStock || ""}
                    onChange={(e) => setProdStock(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-rose-500 font-semibold"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Shoe Sizes (Comma Separated)</label>
                  <input
                    type="text"
                    required
                    placeholder="7, 8, 9, 10, 11"
                    value={prodSizesStr}
                    onChange={(e) => setProdSizesStr(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-rose-500 font-semibold font-mono"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Unsplash / Copyright-free Image URL</label>
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/photo-..."
                    value={prodImage}
                    onChange={(e) => setProdImage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-rose-500 font-medium"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Design Specifications Description</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Aerodynamic speed-mesh layers giving stable traction..."
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white hover:bg-slate-900 font-heading font-bold text-xs py-3 rounded-xl transition cursor-pointer"
              >
                PUBLISH SHOE RELEASE
              </button>
            </form>
          </div>
        </div>
      )}

      {/* INTERACTIVE FORM MODAL 2: EDIT SYSTEM SHOE */}
      {isEditModalOpen && selectedProductToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />

          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative z-10 border border-slate-100 overflow-hidden">
            <div className="p-6 pb-4 border-b border-slate-50 flex items-center justify-between">
              <h2 className="font-heading font-extrabold text-lg text-slate-900">
                Refactor Shoeware Specifications
              </h2>
              <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl cursor-pointer">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleEditProduct} className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3.5">
                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4.5 py-2.5 text-xs focus:outline-none focus:border-rose-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Brand Name</label>
                  <input
                    type="text"
                    required
                    value={prodBrand}
                    onChange={(e) => setProdBrand(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-rose-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-rose-500 font-semibold"
                  >
                    <option value="Running">Running</option>
                    <option value="Sneakers">Sneakers</option>
                    <option value="Casual">Casual</option>
                    <option value="Formal">Formal</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Base Price (INR ₹)</label>
                  <input
                    type="number"
                    required
                    min="1000"
                    value={prodPrice || ""}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-rose-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Warehouse Stock Units</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={prodStock || ""}
                    onChange={(e) => setProdStock(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-rose-500 font-semibold"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Shoe Sizes (Comma Separated)</label>
                  <input
                    type="text"
                    required
                    value={prodSizesStr}
                    onChange={(e) => setProdSizesStr(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-rose-500 font-semibold font-mono"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Product Illustration Image URL</label>
                  <input
                    type="url"
                    required
                    value={prodImage}
                    onChange={(e) => setProdImage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-rose-500 font-medium"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Design Specifications Description</label>
                  <textarea
                    required
                    rows={3}
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-rose-500 shadow-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white hover:bg-slate-900 font-heading font-bold text-xs py-3 rounded-xl transition cursor-pointer"
              >
                SAVE DATABASE MODIFICATIONS
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
