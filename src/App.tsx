import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import ProductGrid from "./components/ProductGrid";
import ProductDetails from "./components/ProductDetails";
import CartDrawer from "./components/CartDrawer";
import CheckoutForm from "./components/CheckoutForm";
import PaymentModal from "./components/PaymentModal";
import AdminPanel from "./components/AdminPanel";
import { Product, CartItem, Order } from "./types";
import { Sparkles, ArrowRight, ShieldCheck, ShoppingCart } from "lucide-react";

export default function App() {
  // Navigation Routing State
  const [currentTab, setCurrentTab] = useState<"home" | "shop" | "details" | "checkout" | "admin">("home");
  
  // App-wide Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [currency, setCurrency] = useState<"INR" | "BDT">("INR");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Admin Session State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminToken, setAdminToken] = useState("");

  // Payment State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "Razorpay" | "bKash" | "Nagad" | "SSLCommerz">("UPI");
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [pendingOrderDetails, setPendingOrderDetails] = useState<any | null>(null);

  // Load products list from backend
  const fetchProducts = async () => {
    try {
      setIsLoadingProducts(true);
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);

        // Update selected product if it is currently displayed
        if (selectedProduct) {
          const updated = data.find((p: Product) => p.id === selectedProduct.id);
          if (updated) {
            setSelectedProduct(updated);
          }
        }
      }
    } catch (e) {
      console.error("Error loading products:", e);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    
    // Check for existing admin session in localStorage
    const savedToken = localStorage.getItem("rahul_admin_token");
    if (savedToken === "RAHUL-ADMIN-TOKEN-OK") {
      setIsAdminLoggedIn(true);
      setAdminToken(savedToken);
    }
  }, []);

  // Admin login callback
  const handleAdminLogin = (token: string) => {
    setIsAdminLoggedIn(true);
    setAdminToken(token);
    localStorage.setItem("rahul_admin_token", token);
    setCurrentTab("admin");
  };

  // Admin logout
  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setAdminToken("");
    localStorage.removeItem("rahul_admin_token");
    setCurrentTab("home");
  };

  // Cart Operations
  const handleAddToCart = (product: Product, size: number) => {
    const itemUniqueId = `${product.id}-${size}`;

    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === itemUniqueId);
      if (existing) {
        if (existing.quantity >= product.stock) {
          alert(`Cannot choose more than ${product.stock} items. Out of warehouse stock limit.`);
          return prevItems;
        }
        return prevItems.map((item) =>
          item.id === itemUniqueId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { id: itemUniqueId, product, selectedSize: size, quantity: 1 }];
    });

    // Automatically trigger cart visual feedback on navbar
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setCartItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (item.id === itemId) {
            const nextQuantity = item.quantity + delta;
            if (nextQuantity <= 0) return null;
            if (nextQuantity > item.product.stock) {
              alert(`Cannot select more than ${item.product.stock} units. Restricting to available stock.`);
              return item;
            }
            return { ...item, quantity: nextQuantity };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const cartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  // Trigger Details routing
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentTab("details");
  };

  // Open Checkout form and route
  const handleCheckoutInitiation = () => {
    setIsCartOpen(false);
    setCurrentTab("checkout");
  };

  // Process checkout submitted details
  const handleSubmittingCheckout = (orderDetails: any) => {
    setPendingOrderDetails(orderDetails);
    setPaymentMethod(orderDetails.paymentMethod);
    setPaymentAmount(orderDetails.totalAmount);
    setIsPaymentModalOpen(true);
  };

  // Process visual mock payment gateway success
  const handlePaymentSuccess = async (txn: { transactionId: string }) => {
    if (!pendingOrderDetails) return;

    // Structure order payload representing SQLite schema specifications
    const formattedOrderItems = cartItems.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      price: currency === "INR" ? item.product.price : Math.round(item.product.price * 1.15),
      size: item.selectedSize,
      quantity: item.quantity,
    }));

    const finalOrderPayload = {
      ...pendingOrderDetails,
      items: formattedOrderItems,
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalOrderPayload),
      });

      if (res.ok) {
        alert(`Order processed successfully! Transaction Reference: ${txn.transactionId}. Deducting stock values.`);
        setCartItems([]); // clear shopping bag
        setIsPaymentModalOpen(false);
        setPendingOrderDetails(null);
        await fetchProducts(); // pull updated stock levels
        setCurrentTab("home");
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed registering order inside database.");
        setIsPaymentModalOpen(false);
      }
    } catch (e) {
      alert("Order recording failed due to server connection issues.");
      setIsPaymentModalOpen(false);
    }
  };

  // Direct category clicks
  const handleExploreCategory = (category?: string) => {
    setCurrentTab("shop");
    // Filters element are managed directly by React states in ProductGrid, but resetting the view is great.
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans select-none antialiased">
      {/* 1. TOP DYNAMIC NAVBAR */}
      <Navbar
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        currency={currency}
        onChangeCurrency={setCurrency}
        currentTab={currentTab === "details" || currentTab === "checkout" ? "shop" : currentTab}
        onChangeTab={setCurrentTab}
        isAdminLoggedIn={isAdminLoggedIn}
        onLogoutAdmin={handleAdminLogout}
      />

      {/* 2. CORE VIEW SWITCH CONTAINER */}
      <main className="flex-grow">
        {isLoadingProducts ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="h-10 w-10 border-4 border-slate-200 border-t-rose-500 rounded-full animate-spin mb-4" />
            <p className="text-sm font-semibold text-slate-400">Loading Stride warehouse databases...</p>
          </div>
        ) : (
          <>
            {currentTab === "home" && (
              <Home
                featuredProducts={products}
                onExplore={handleExploreCategory}
                onSelectProduct={handleSelectProduct}
                currency={currency}
              />
            )}

            {currentTab === "shop" && (
              <ProductGrid
                products={products}
                currency={currency}
                onSelectProduct={handleSelectProduct}
                onAddToCart={handleAddToCart}
              />
            )}

            {currentTab === "details" && selectedProduct && (
              <ProductDetails
                product={selectedProduct}
                currency={currency}
                onBack={() => setCurrentTab("shop")}
                onAddToCart={handleAddToCart}
              />
            )}

            {currentTab === "checkout" && (
              <CheckoutForm
                cartItems={cartItems}
                currency={currency}
                onChangeCurrency={setCurrency}
                onBack={() => setIsCartOpen(true)}
                onSubmitCheckout={handleSubmittingCheckout}
              />
            )}

            {currentTab === "admin" && (
              <AdminPanel
                products={products}
                onRefreshProducts={fetchProducts}
                isAdminLoggedIn={isAdminLoggedIn}
                adminToken={adminToken}
                onAdminLogin={handleAdminLogin}
              />
            )}
          </>
        )}
      </main>

      {/* 3. SIDE SHOPPING BAG CONTROLLERS */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        currency={currency}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckoutInitiation}
      />

      {/* 4. SUB-CONTINENTAL SECURE PAYMENT CONTEXTS */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        method={paymentMethod}
        amount={paymentAmount}
        currency={currency}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* 5. GORGEOUS STYLISH FOOTER */}
      <footer className="bg-slate-900 text-slate-400 pt-16 pb-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="space-y-4">
            <h3 className="font-heading font-extrabold text-2xl text-white tracking-widest">
              STRIDE<span className="text-rose-500">.</span>
            </h3>
            <p className="text-xs leading-relaxed text-slate-400 font-medium max-w-xs">
              Elite sub-continental e-commerce platform curated for prime footwear performance. Delivering physical mileage.
            </p>
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider font-mono">
              Operational base: Mumbai & Dhaka
            </div>
          </div>

          {/* Catalog Index Links */}
          <div className="space-y-3.5">
            <h4 className="font-heading font-bold text-sm text-white">Shoe Catalog</h4>
            <div className="flex flex-col gap-2.5 text-xs font-semibold">
              <span onClick={() => handleExploreCategory("Running")} className="hover:text-white cursor-pointer transition">Running Runners</span>
              <span onClick={() => handleExploreCategory("Sneakers")} className="hover:text-white cursor-pointer transition">Stealth Sneakers</span>
              <span onClick={() => handleExploreCategory("Casual")} className="hover:text-white cursor-pointer transition">Classic Suede Loafers</span>
              <span onClick={() => handleExploreCategory("Formal")} className="hover:text-white cursor-pointer transition">Royal Patent Derbys</span>
            </div>
          </div>

          {/* Secure channels certifications */}
          <div className="space-y-3.5">
            <h4 className="font-heading font-bold text-sm text-white">Direct Settle Partners</h4>
            <div className="flex flex-col gap-2 text-xs font-semibold">
              <span className="hover:text-white transition">🇮🇳 Bharat UPI & Razorpay API</span>
              <span className="hover:text-white transition">🇧🇩 bKash Merchant Wallet API</span>
              <span className="hover:text-white transition">🇧🇩 Nagad Payments Direct</span>
              <span className="hover:text-white transition">🇧🇩 SSLCommerz Digital Banking</span>
            </div>
          </div>

          {/* Admin panel portals */}
          <div className="space-y-3.5">
            <h4 className="font-heading font-bold text-sm text-white">Gateway Administrations</h4>
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Authorized operators can access CRUD catalog adjustments using strict root session profiles.
              </p>
              <button
                onClick={() => setCurrentTab("admin")}
                className="bg-rose-500 hover:bg-rose-600 text-white font-heading font-bold text-[11px] px-4 py-2.5 rounded-xl transition duration-150 flex items-center gap-1.5 shadow-md shadow-rose-900/30"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> ROOT BACKOFFICE
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-8 border-t border-slate-800 mt-12 pt-6 text-center text-[10px] font-mono uppercase tracking-widest text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 Stride Shoe Commerce Platform. All rights reserved.</p>
          <p>Designed with desktop precision and sub-continental payment support</p>
        </div>
      </footer>
    </div>
  );
}
