import React, { useState, useEffect } from "react";
import { ArrowLeft, Landmark, CreditCard, ShieldCheck, ShoppingCart, ShoppingBag, Send } from "lucide-react";
import { CartItem } from "../types";

interface CheckoutFormProps {
  cartItems: CartItem[];
  currency: "INR" | "BDT";
  onChangeCurrency: (curr: "INR" | "BDT") => void;
  onBack: () => void;
  onSubmitCheckout: (orderDetails: {
    customerName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: "India" | "Bangladesh";
    paymentMethod: "UPI" | "Razorpay" | "bKash" | "Nagad" | "SSLCommerz";
    totalAmount: number;
    currency: "INR" | "BDT";
  }) => void;
}

export default function CheckoutForm({
  cartItems,
  currency,
  onChangeCurrency,
  onBack,
  onSubmitCheckout,
}: CheckoutFormProps) {
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState<"India" | "Bangladesh">("India");
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "Razorpay" | "bKash" | "Nagad" | "SSLCommerz">("UPI");

  // Adjust currency and payment methods automatically when country changes
  useEffect(() => {
    if (country === "India") {
      onChangeCurrency("INR");
      setPaymentMethod("UPI");
    } else {
      onChangeCurrency("BDT");
      setPaymentMethod("bKash");
    }
  }, [country]);

  const currencySymbol = currency === "INR" ? "₹" : "৳";

  // Calculations
  const cartSubtotal = React.useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const price = currency === "INR" ? item.product.price : Math.round(item.product.price * 1.15);
      return acc + price * item.quantity;
    }, 0);
  }, [cartItems, currency]);

  const deliveryFee = React.useMemo(() => {
    return currency === "INR" ? 150 : 200;
  }, [currency]);

  const totalAmount = cartSubtotal + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert("Your cart is currently empty!");
      return;
    }
    
    onSubmitCheckout({
      customerName,
      email,
      phone,
      address,
      city,
      country,
      paymentMethod,
      totalAmount,
      currency,
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-8">
      {/* Return Navigation */}
      <button
        onClick={onBack}
        className="group mb-8 flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-black transition"
      >
        <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
        Return to shopping drawer
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Checkout Form (Address & payment specifications) */}
        <div className="flex-grow lg:w-3/5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h1 className="font-heading font-extrabold text-2xl text-slate-900 mb-6 flex items-center gap-2">
            Delivery & Payment Details
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Country Selector (Switches UI Context) */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-600 block">Select Target Destination Country</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCountry("India")}
                  className={`py-2.5 rounded-xl text-xs font-bold font-heading border transition ${
                    country === "India"
                      ? "bg-black text-white border-black"
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-800"
                  }`}
                >
                  🇮🇳 India (INR)
                </button>
                <button
                  type="button"
                  onClick={() => setCountry("Bangladesh")}
                  className={`py-2.5 rounded-xl text-xs font-bold font-heading border transition ${
                    country === "Bangladesh"
                      ? "bg-black text-white border-black"
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-800"
                  }`}
                >
                  🇧🇩 Bangladesh (BDT)
                </button>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Selected currency defaults to {currency} with optimal conversion metrics.</p>
            </div>

            {/* Inputs Group */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-gray-700 block mb-1">Customer Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Rahul Khan"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-500 hover:bg-slate-50/50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="rahul@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-500 hover:bg-slate-50/50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder={country === "India" ? "+91..." : "+880..."}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-500 hover:bg-slate-50/50"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-gray-700 block mb-1">Shipping Road/Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="12, MG Road, Sector 4, Shanti Nagar"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-500 hover:bg-slate-50/50"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-gray-700 block mb-1">City / Region Destination</label>
                <input
                  type="text"
                  required
                  placeholder={country === "India" ? "Mumbai / Bangalore" : "Dhaka / Chittagong / Sylhet"}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-500 hover:bg-slate-50/50"
                />
              </div>
            </div>

            {/* Sub-continental Dynamic Payment Gateways */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-700 block">Pick Payment Gateway</label>
              
              {country === "India" ? (
                /* Indian Gateways */
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setPaymentMethod("UPI")}
                    className={`p-4 border rounded-2xl cursor-pointer flex flex-col gap-1 transition ${
                      paymentMethod === "UPI"
                        ? "bg-cyan-50/50 border-cyan-500 text-cyan-900"
                        : "bg-white border-slate-100 hover:border-slate-300"
                    }`}
                  >
                    <span className="font-extrabold text-sm flex items-center gap-1.5 font-heading text-cyan-600">
                      <Send className="w-4 h-4" /> BHIM UPI
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">Immediate mobile scanning QR code</span>
                  </div>

                  <div
                    onClick={() => setPaymentMethod("Razorpay")}
                    className={`p-4 border rounded-2xl cursor-pointer flex flex-col gap-1 transition ${
                      paymentMethod === "Razorpay"
                        ? "bg-indigo-50/50 border-indigo-500 text-indigo-900"
                        : "bg-white border-slate-100 hover:border-slate-300"
                    }`}
                  >
                    <span className="font-extrabold text-sm flex items-center gap-1.5 font-heading text-indigo-600">
                      <CreditCard className="w-4 h-4" /> Razorpay
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">Supports Cards, Netbanking & Wallets</span>
                  </div>
                </div>
              ) : (
                /* Bangladeshi Gateways */
                <div className="grid grid-cols-3 gap-2.5">
                  <div
                    onClick={() => setPaymentMethod("bKash")}
                    className={`p-3 border rounded-2xl cursor-pointer flex flex-col items-center gap-1 text-center transition ${
                      paymentMethod === "bKash"
                        ? "bg-pink-50/50 border-pink-500 text-pink-900"
                        : "bg-white border-slate-100 hover:border-slate-300"
                    }`}
                  >
                    <span className="font-extrabold text-xs font-heading text-pink-600">bKash</span>
                    <span className="text-[9px] text-slate-400 font-medium">Auto-verification</span>
                  </div>

                  <div
                    onClick={() => setPaymentMethod("Nagad")}
                    className={`p-3 border rounded-2xl cursor-pointer flex flex-col items-center gap-1 text-center transition ${
                      paymentMethod === "Nagad"
                        ? "bg-orange-50/50 border-orange-500 text-orange-900"
                        : "bg-white border-slate-100 hover:border-slate-300"
                    }`}
                  >
                    <span className="font-extrabold text-xs font-heading text-orange-600">Nagad</span>
                    <span className="text-[9px] text-slate-400 font-medium">Immediate Pin Pay</span>
                  </div>

                  <div
                    onClick={() => setPaymentMethod("SSLCommerz")}
                    className={`p-3 border rounded-2xl cursor-pointer flex flex-col items-center gap-1 text-center transition ${
                      paymentMethod === "SSLCommerz"
                        ? "bg-blue-50/50 border-blue-500 text-blue-900"
                        : "bg-white border-slate-100 hover:border-slate-300"
                    }`}
                  >
                    <span className="font-extrabold text-xs font-heading text-blue-600">SSLCommerz</span>
                    <span className="text-[9px] text-slate-400 font-medium">Smart Bank Gate</span>
                  </div>
                </div>
              )}
            </div>

            {/* Checkout Call To Action Button */}
            <button
              type="submit"
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-heading font-extrabold py-4 px-6 text-xs rounded-2xl transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-rose-100 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              FINALIZE ORDER & SECURE PAYMENT ({currencySymbol}{totalAmount.toLocaleString()})
            </button>
          </form>
        </div>

        {/* Right Side: Order Summary Panel */}
        <div className="lg:w-2/5 flex flex-col gap-5">
          <div className="bg-slate-50 border border-slate-100 p-6 rounded-3xl">
            <h2 className="font-heading font-bold text-lg text-slate-900 mb-4 pb-2 border-b border-slate-200">
              Bag Summary
            </h2>

            {/* Individual items inside cart */}
            <div className="space-y-3.5 max-h-[280px] overflow-y-auto pr-1">
              {cartItems.map((item) => {
                const itemPrice = currency === "INR" 
                  ? item.product.price 
                  : Math.round(item.product.price * 1.15);

                return (
                  <div key={item.id} className="flex gap-3 justify-between text-xs">
                    <div className="flex gap-2">
                      <div className="w-12 h-12 bg-white rounded-lg border border-slate-100 flex items-center justify-center p-1 font-semibold shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="object-contain max-h-full max-w-full"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 line-clamp-1">{item.product.name}</p>
                        <p className="text-[10px] text-slate-400 font-semibold">
                          Size {item.selectedSize} × {item.quantity} units
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900 block pt-1 font-heading text-right">
                      {currencySymbol}{(itemPrice * item.quantity).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Details Pricing summary footer */}
            <div className="space-y-2 border-t border-slate-200 pt-4 mt-4">
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>Subtotal</span>
                <span className="text-slate-800">{currencySymbol}{cartSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>Est. Duty & Delivery Charge</span>
                <span className="text-slate-800">{currencySymbol}{deliveryFee.toLocaleString()}</span>
              </div>
              <div className="border-t border-dashed border-slate-200 my-2.5 pt-2.5 flex justify-between font-heading font-extrabold text-sm text-slate-900">
                <span>Final Billing Amount</span>
                <span className="text-rose-600 font-extrabold text-base">
                  {currencySymbol}{totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Secure details guarantees */}
          <div className="border border-slate-100 p-5 rounded-2xl flex items-start gap-3 bg-white">
            <span className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <p className="text-xs font-bold text-slate-800 mb-0.5">SSL Protected Connection</p>
              <p className="text-[10px] text-slate-400 leading-snug">
                Your payment metrics are verified client-side using industry-certified 256-bit AES algorithms. We never persist card secrets or PINs.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
