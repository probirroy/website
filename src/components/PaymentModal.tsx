import React, { useState, useEffect } from "react";
import { X, CheckCircle, ShieldCheck, CreditCard, Landmark, Smartphone, RefreshCw, SmartphoneIcon } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  method: "UPI" | "Razorpay" | "bKash" | "Nagad" | "SSLCommerz";
  amount: number;
  currency: "INR" | "BDT";
  onPaymentSuccess: (details: { transactionId: string }) => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  method,
  amount,
  currency,
  onPaymentSuccess,
}: PaymentModalProps) {
  const [step, setStep] = useState<"input" | "processing" | "success">("input");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [pin, setPin] = useState("");
  const [upiId, setUpiId] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [errorField, setErrorField] = useState("");

  const currencySymbol = currency === "INR" ? "₹" : "৳";

  useEffect(() => {
    // Reset steps when opening
    if (isOpen) {
      setStep("input");
      setPhoneNumber("");
      setOtp("");
      setPin("");
      setUpiId("");
      setCardHolder("");
      setCardNumber("");
      setErrorField("");
    }
  }, [isOpen, method]);

  if (!isOpen) return null;

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorField("");

    // Minimal validation
    if (method === "UPI" && !upiId.includes("@")) {
      setErrorField("Please enter a valid UPI ID (e.g. user@paytm/ybl)");
      return;
    }
    if ((method === "bKash" || method === "Nagad") && phoneNumber.length < 11) {
      setErrorField("Please enter a valid 11-digit mobile wallet number.");
      return;
    }
    if (method === "Razorpay" && cardNumber.length < 16) {
      setErrorField("Enter a valid 16-digit Visa/Mastercard number");
      return;
    }

    // Trigger loading simulation
    setStep("processing");

    setTimeout(() => {
      setStep("success");
    }, 2500);
  };

  const handleFinalize = () => {
    const txId = "TXN-" + Math.floor(100000 + Math.random() * 900000);
    onPaymentSuccess({ transactionId: txId });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto">
      {/* Background layer */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      {/* Main Payment Card Dialog */}
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative z-10 border border-slate-100 overflow-hidden">
        {/* Brand Theme Bar */}
        <div className={`h-2.5 w-full ${
          method === "bKash" ? "bg-pink-600" :
          method === "Nagad" ? "bg-orange-500" :
          method === "UPI" ? "bg-cyan-600" :
          method === "SSLCommerz" ? "bg-blue-600" :
          "bg-indigo-600" // Razorpay
        }`} />

        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-slate-50 text-slate-800 rounded-xl font-heading text-xs uppercase font-extrabold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure Gate
            </span>
            <span className="text-xs font-mono font-bold text-slate-400">SSL 256-bit Encrypted</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-black hover:bg-slate-50 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Wrapper */}
        <div className="p-6">
          
          {/* STEP 1: Main Gateway Interface (Input specifications) */}
          {step === "input" && (
            <form onSubmit={handleProcessPayment} className="space-y-5">
              
              {/* Payment Summary Header */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between text-slate-800">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                    Paying SoleStride Store
                  </p>
                  <p className="font-heading font-extrabold text-lg text-slate-950">
                    {currencySymbol}{amount.toLocaleString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                    Gateway
                  </p>
                  <span className="inline-block text-xs font-extrabold uppercase bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg">
                    {method}
                  </span>
                </div>
              </div>

              {/* bKash Interface (Bangladesh) */}
              {method === "bKash" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-pink-50 p-3.5 rounded-2xl border border-pink-100">
                    <div className="bg-pink-600 text-white font-extrabold text-sm px-2.5 py-1.5 rounded-xl">
                      bKash
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">bKash Merchant Wallet</p>
                      <p className="text-[10px] text-pink-600 font-semibold">Enter your bKash mobile number</p>
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">bKash Account Number</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., 01712345678"
                        maxLength={11}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-500 font-medium tracking-wide"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-600 block mb-1">OTP (Code)</label>
                        <input
                          type="password"
                          required
                          placeholder="e.g., 5849"
                          maxLength={6}
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-500 font-mono text-center"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-600 block mb-1">PIN (Secret)</label>
                        <input
                          type="password"
                          required
                          placeholder="e.g., 12345"
                          maxLength={5}
                          value={pin}
                          onChange={(e) => setPin(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-500 font-mono text-center"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Nagad Interface (Bangladesh) */}
              {method === "Nagad" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-orange-50 p-3.5 rounded-2xl border border-orange-100">
                    <div className="bg-orange-500 text-white font-extrabold text-sm px-2.5 py-1.5 rounded-xl">
                      Nagad
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Nagad Mobile Payment</p>
                      <p className="text-[10px] text-orange-500 font-semibold">Enter Nagad registered mobile number</p>
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Nagad mobile number</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., 01898765432"
                        maxLength={11}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 font-medium tracking-wide"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-600 block mb-1">OTP Pin</label>
                        <input
                          type="password"
                          required
                          placeholder="OTP Code"
                          maxLength={6}
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 font-mono text-center"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-600 block mb-1">Wallet PIN</label>
                        <input
                          type="password"
                          required
                          placeholder="PIN"
                          maxLength={4}
                          value={pin}
                          onChange={(e) => setPin(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 font-mono text-center"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* UPI Interface (India) */}
              {method === "UPI" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-cyan-50 p-3.5 rounded-2xl border border-cyan-100">
                    <div className="bg-cyan-600 text-white font-extrabold text-sm px-2.5 py-1.5 rounded-xl">
                      BHIM UPI
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Unified Payments Interface</p>
                      <p className="text-[10px] text-cyan-600 font-semibold">Pay instantly via BHIM, GPay, Paytm, or PhonePe</p>
                    </div>
                  </div>

                  {/* QR Mockup for scan code */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center">
                    <div className="border border-slate-200 p-2.5 rounded-xl bg-white mb-2">
                      <div className="w-28 h-28 bg-slate-100 flex items-center justify-center relative font-mono text-[9px] text-slate-400 font-bold text-center border border-dashed border-slate-300">
                        {/* Fake visual QR */}
                        <div className="grid grid-cols-4 gap-1 p-2 w-full h-full">
                          {Array.from({ length: 16 }).map((_, i) => (
                            <div key={i} className={`rounded-sm ${(i * 3) % 2 === 0 ? "bg-slate-900" : "bg-transparent"}`} />
                          ))}
                        </div>
                        <span className="absolute bg-white/95 px-1 rounded border border-slate-200">Scan QR Code</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 font-semibold">Or enter your UPI App ID below</p>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Enter your UPI VPA ID</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., rahuladmin@okaxis"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500 font-medium"
                    />
                  </div>
                </div>
              )}

              {/* Razorpay Interface (India) */}
              {method === "Razorpay" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-indigo-50 p-3.5 rounded-2xl border border-indigo-100 animate-pulse">
                    <CreditCard className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">Razorpay Card Terminal</p>
                      <p className="text-[10px] text-indigo-600 font-semibold">Settle directly with Debit/Credit cards</p>
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        required
                        placeholder="RAHUL KHAN"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 font-medium uppercase"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Debit Card Number</label>
                      <input
                        type="text"
                        required
                        placeholder="4532 9845 1256 7845"
                        maxLength={16}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 font-mono tracking-wider"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3.5">
                      <div>
                        <label className="text-xs font-bold text-slate-600 block mb-1">Expiry Date</label>
                        <input
                          type="text"
                          required
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 font-mono text-center"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-600 block mb-1">CVV Code</label>
                        <input
                          type="password"
                          required
                          placeholder="CSV"
                          maxLength={3}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 font-mono text-center"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SSLCommerz Interface (Bangladesh) */}
              {method === "SSLCommerz" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-blue-50 p-3.5 rounded-2xl border border-blue-100">
                    <Landmark className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">SSLCommerz Digital Gateway</p>
                      <p className="text-[10px] text-blue-600 font-semibold">Supporting all major banks in Bangladesh</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50 space-y-3">
                    <p className="text-xs font-semibold text-slate-500">Pick preferred digital banking channel:</p>
                    <div className="grid grid-cols-2 gap-2.5">
                      {["City Bank AMEX", "DBBL Nexus", "Brac Bank Alt", "MTB Netp"].map((bank) => (
                        <div
                          key={bank}
                          className="p-3 bg-white border border-slate-100 hover:border-blue-500 rounded-xl cursor-pointer text-xs font-bold text-slate-700 hover:text-blue-600 text-center transition"
                        >
                          {bank}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Error Visual Block */}
              {errorField && <p className="text-xs text-rose-500 font-semibold">{errorField}</p>}

              {/* Action Buttons */}
              <button
                type="submit"
                className="w-full bg-black hover:bg-slate-900 text-white py-3.5 px-4 font-heading font-bold text-xs rounded-2xl transition duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                PAY SECURELY NOW with {method}
              </button>
            </form>
          )}

          {/* STEP 2: Processing Payment State */}
          {step === "processing" && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <RefreshCw className="w-12 h-12 text-rose-500 animate-spin mb-4" />
              <h3 className="font-heading font-extrabold text-lg text-slate-800 mb-1">
                Verifying Credentials...
              </h3>
              <p className="text-xs text-slate-400 max-w-xs">
                Exchanging transaction tokens securely with {method} banking terminals. Please do not close or reload this browser tab!
              </p>
            </div>
          )}

          {/* STEP 3: Complete Success confirmation screen */}
          {step === "success" && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-emerald-500 mb-4 bg-emerald-50 p-4 rounded-full border border-emerald-100">
                <CheckCircle className="w-12 h-12 fill-current" />
              </div>
              <h3 className="font-heading font-extrabold text-xl text-slate-950 mb-1">
                Transaction Successful!
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mb-6">
                Your payment was received, and the transaction token has been stored. You will receive an email invoice shortly.
              </p>
              <button
                onClick={handleFinalize}
                className="bg-black hover:bg-slate-900 text-white font-heading font-bold text-xs px-6 py-2.5 rounded-xl transition duration-200"
              >
                View Order Details
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
