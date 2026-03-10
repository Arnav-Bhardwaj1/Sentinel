import React, { useState } from "react";

const ETH_TO_INR = 240000; // approximate, shown as informational

const BANKS = [
  "State Bank of India",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "Punjab National Bank",
  "Bank of Baroda",
  "Canara Bank",
  "Union Bank of India",
  "IndusInd Bank",
];

const formatINR = (amount) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

/* ── Sub-forms ───────────────────────────────────────────────── */

/* ── Dummy QR Code SVG ───────────────────────────────────────── */
const DummyQR = () => {
  // 25×25 grid — 1 = dark module, 0 = light
  const grid = [
    [1,1,1,1,1,1,1,0,1,0,1,1,0,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,0,0,1,0,1,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,0,1,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,1,0,1,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,0,0,1,0,0,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,1,1,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0],
    [1,1,0,1,0,1,1,0,1,0,1,0,0,1,1,1,0,1,1,0,1,0,1],
    [0,1,0,0,1,0,0,1,0,1,0,0,1,0,0,1,0,0,1,1,0,1,0],
    [1,0,1,1,0,1,1,0,1,0,1,1,0,0,1,0,1,1,0,0,1,0,1],
    [0,1,1,0,1,0,0,1,0,1,1,0,1,1,0,1,0,1,0,1,1,0,0],
    [1,0,0,1,0,1,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,1,1],
    [0,1,0,1,1,0,0,1,1,0,0,1,0,1,1,0,0,1,1,0,1,0,0],
    [1,0,1,0,0,1,1,0,1,1,0,0,1,0,0,1,1,0,0,1,0,1,1],
    [0,0,0,0,0,0,0,0,1,0,1,1,0,1,0,0,0,1,0,1,1,0,0],
    [1,1,1,1,1,1,1,0,0,1,0,0,1,0,1,0,0,0,1,0,0,1,0],
    [1,0,0,0,0,0,1,0,1,0,1,0,0,1,0,1,0,1,0,1,0,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,1,1,0,1,0,1,0,1,0,1,0,0],
    [1,0,1,1,1,0,1,0,1,0,0,1,0,1,0,0,0,1,0,1,0,1,1],
    [1,0,1,1,1,0,1,0,0,0,1,0,1,0,1,1,0,0,1,0,1,0,0],
    [1,0,0,0,0,0,1,0,1,1,0,1,0,0,0,0,1,1,0,0,0,1,0],
    [1,1,1,1,1,1,1,0,0,0,1,0,1,1,0,1,0,0,1,1,0,0,1],
  ];
  const SIZE = 23;
  const CELL = 8;
  const PAD = 12;
  const total = SIZE * CELL + PAD * 2;

  return (
    <svg
      width={total} height={total}
      viewBox={`0 0 ${total} ${total}`}
      xmlns="http://www.w3.org/2000/svg"
      className="rounded-xl"
    >
      {/* White background */}
      <rect width={total} height={total} rx="10" fill="white" />
      {/* Modules */}
      {grid.map((row, r) =>
        row.map((cell, c) =>
          cell ? (
            <rect
              key={`${r}-${c}`}
              x={PAD + c * CELL}
              y={PAD + r * CELL}
              width={CELL - 1}
              height={CELL - 1}
              rx="1"
              fill="#111"
            />
          ) : null
        )
      )}
      {/* Centre logo mark */}
      <rect x={total/2 - 14} y={total/2 - 14} width={28} height={28} rx="4" fill="white" />
      <rect x={total/2 - 11} y={total/2 - 11} width={22} height={22} rx="3" fill="#f97316" />
      <text x={total/2} y={total/2 + 5} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="sans-serif">S</text>
    </svg>
  );
};

const UPIForm = ({ onPay, loading }) => {
  const [mode, setMode] = useState("qr"); // "qr" | "id"
  const [upiId, setUpiId] = useState("");
  const [error, setError] = useState("");

  const validate = () => {
    if (!upiId.includes("@")) { setError("Enter a valid UPI ID (e.g. name@upi)"); return false; }
    setError("");
    return true;
  };

  return (
    <div className="flex flex-col gap-4">

      {/* QR / UPI ID toggle */}
      <div className="flex gap-1 p-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">
        {[["qr", "Scan QR"], ["id", "UPI ID"]].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setMode(val)}
            className={`flex-1 py-1.5 rounded-md font-epilogue text-xs font-semibold transition-all duration-200
              ${mode === val ? "bg-white/[0.1] text-white" : "text-white/35 hover:text-white/60"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "qr" ? (
        /* ── QR panel ── */
        <div className="flex flex-col items-center gap-3">
          <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white/[0.06] border border-white/[0.08] max-w-[240px] sm:max-w-none">
            <DummyQR />
          </div>
          <p className="font-epilogue text-xs text-white/30 text-center leading-relaxed">
            Open any UPI app · Tap <span className="text-white/55">Scan QR</span> · Point at code
          </p>
          {/* UPI app icons row */}
          <div className="flex gap-3 items-center">
            {[
              { name: "GPay",    color: "#4285F4", letter: "G" },
              { name: "PhonePe", color: "#5F259F", letter: "P" },
              { name: "Paytm",   color: "#00B9F1", letter: "P" },
              { name: "BHIM",    color: "#00A859", letter: "B" },
            ].map(({ name, color, letter }) => (
              <div key={name} className="flex flex-col items-center gap-1">
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg"
                  style={{ background: color }}
                >{letter}</span>
                <span className="font-epilogue text-[9px] text-white/30">{name}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => onPay({ method: "UPI", detail: "QR scan" })}
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-jakarta font-bold text-sm text-white
              bg-gradient-to-r from-[#f97316] to-[#ea580c]
              hover:shadow-[0_0_24px_rgba(249,115,22,0.5)] disabled:opacity-50
              transition-all duration-200"
          >
            {loading ? "Waiting for payment…" : "I've Scanned & Paid"}
          </button>
        </div>
      ) : (
        /* ── UPI ID panel ── */
        <div className="flex flex-col gap-4">
          <div>
            <label className="block font-epilogue text-xs text-white/50 mb-1.5">UPI ID</label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => { setUpiId(e.target.value); setError(""); }}
              placeholder="yourname@upi"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white font-epilogue text-sm placeholder:text-white/20 focus:outline-none focus:border-[#f97316]/60 transition-colors"
            />
            {error && <p className="text-red-400 text-xs mt-1.5 font-epilogue">{error}</p>}
          </div>

          <div className="flex gap-2 flex-wrap">
            {[
              { name: "GPay", color: "#4285F4", letter: "G" },
              { name: "PhonePe", color: "#5F259F", letter: "P" },
              { name: "Paytm", color: "#00B9F1", letter: "P" },
              { name: "BHIM", color: "#00A859", letter: "B" },
            ].map(({ name, color, letter }) => (
              <button
                key={name}
                type="button"
                onClick={() => { setUpiId(`${name.toLowerCase()}@upi`); setError(""); }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] hover:border-white/20 transition-all duration-150 group"
              >
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-[10px]" style={{ background: color }}>{letter}</span>
                <span className="font-epilogue text-xs text-white/60 group-hover:text-white/90">{name}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => validate() && onPay({ method: "UPI", detail: upiId })}
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-jakarta font-bold text-sm text-white
              bg-gradient-to-r from-[#f97316] to-[#ea580c]
              hover:shadow-[0_0_24px_rgba(249,115,22,0.5)] disabled:opacity-50
              transition-all duration-200"
          >
            {loading ? "Processing…" : "Verify & Pay"}
          </button>
        </div>
      )}
    </div>
  );
};

const CardForm = ({ onPay, loading }) => {
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [errors, setErrors] = useState({});

  const formatCard = (val) => val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };

  const validate = () => {
    const e = {};
    if (card.number.replace(/\s/g, "").length < 16) e.number = "Enter a valid 16-digit card number";
    if (card.expiry.length < 5) e.expiry = "Enter a valid expiry date";
    if (card.cvv.length < 3) e.cvv = "Enter 3-digit CVV";
    if (!card.name.trim()) e.name = "Enter cardholder name";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const Field = ({ label, value, onChange, placeholder, type = "text", error }) => (
    <div>
      <label className="block font-epilogue text-xs text-white/50 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl bg-white/[0.06] border font-epilogue text-sm text-white placeholder:text-white/20 focus:outline-none transition-colors
          ${error ? "border-red-500/60" : "border-white/[0.1] focus:border-[#f97316]/60"}`}
      />
      {error && <p className="text-red-400 text-xs mt-1 font-epilogue">{error}</p>}
    </div>
  );

  return (
    <div className="flex flex-col gap-3">
      {/* Card type indicators */}
      <div className="flex gap-2 mb-1">
        {["VISA", "MC", "AMEX", "RuPay"].map((brand) => (
          <span key={brand} className="px-2.5 py-1 rounded-md bg-white/[0.06] border border-white/[0.08] font-epilogue text-[10px] font-bold text-white/40">
            {brand}
          </span>
        ))}
      </div>

      <Field
        label="Card Number"
        value={card.number}
        onChange={(e) => setCard({ ...card, number: formatCard(e.target.value) })}
        placeholder="1234 5678 9012 3456"
        error={errors.number}
      />

      <div className="grid grid-cols-2 gap-3">
        <Field
          label="Expiry"
          value={card.expiry}
          onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
          placeholder="MM/YY"
          error={errors.expiry}
        />
        <Field
          label="CVV"
          value={card.cvv}
          onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
          placeholder="•••"
          type="password"
          error={errors.cvv}
        />
      </div>

      <Field
        label="Cardholder Name"
        value={card.name}
        onChange={(e) => setCard({ ...card, name: e.target.value })}
        placeholder="As on card"
        error={errors.name}
      />

      <button
        onClick={() => validate() && onPay({ method: "Card", detail: `•••• ${card.number.slice(-4)}` })}
        disabled={loading}
        className="w-full py-3.5 rounded-xl font-jakarta font-bold text-sm text-white
          bg-gradient-to-r from-[#f97316] to-[#ea580c]
          hover:shadow-[0_0_24px_rgba(249,115,22,0.5)] disabled:opacity-50
          transition-all duration-200 mt-1"
      >
        {loading ? "Processing…" : "Pay Securely"}
      </button>
    </div>
  );
};

const NetBankingForm = ({ onPay, loading }) => {
  const [bank, setBank] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block font-epilogue text-xs text-white/50 mb-1.5">Select Bank</label>
        <select
          value={bank}
          onChange={(e) => { setBank(e.target.value); setError(""); }}
          className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white font-epilogue text-sm focus:outline-none focus:border-[#f97316]/60 transition-colors appearance-none cursor-pointer"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23ffffff50' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", backgroundSize: "20px" }}
        >
          <option value="" style={{ background: "#1c1c2e" }}>Choose your bank…</option>
          {BANKS.map((b) => (
            <option key={b} value={b} style={{ background: "#1c1c2e" }}>{b}</option>
          ))}
        </select>
        {error && <p className="text-red-400 text-xs mt-1 font-epilogue">{error}</p>}
      </div>

      <p className="font-epilogue text-xs text-white/25 leading-relaxed">
        You will be redirected to your bank's secure portal to complete the payment.
      </p>

      <button
        onClick={() => {
          if (!bank) { setError("Please select a bank"); return; }
          onPay({ method: "Net Banking", detail: bank });
        }}
        disabled={loading}
        className="w-full py-3.5 rounded-xl font-jakarta font-bold text-sm text-white
          bg-gradient-to-r from-[#f97316] to-[#ea580c]
          hover:shadow-[0_0_24px_rgba(249,115,22,0.5)] disabled:opacity-50
          transition-all duration-200"
      >
        {loading ? "Redirecting…" : "Continue to Bank"}
      </button>
    </div>
  );
};

/* ── Success screen ───────────────────────────────────────────── */
const SuccessScreen = ({ amountINR, method, detail, onClose }) => (
  <div className="flex flex-col items-center text-center py-4 gap-4">
    <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center">
      <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <div>
      <p className="font-jakarta font-bold text-xl text-white">{amountINR} Paid!</p>
      <p className="font-epilogue text-sm text-white/40 mt-1">via {method} · {detail}</p>
    </div>
    <div className="w-full rounded-xl bg-white/[0.04] border border-white/[0.06] p-4 text-left">
      <p className="font-epilogue text-xs text-white/30 mb-2">Transaction details</p>
      <div className="flex justify-between font-epilogue text-xs">
        <span className="text-white/50">Transaction ID</span>
        <span className="text-white/80 font-semibold">TXN{Math.random().toString(36).slice(2, 10).toUpperCase()}</span>
      </div>
      <div className="flex justify-between font-epilogue text-xs mt-1.5">
        <span className="text-white/50">Status</span>
        <span className="text-green-400 font-semibold">Success</span>
      </div>
    </div>
    <button
      onClick={onClose}
      className="w-full py-3 rounded-xl font-jakarta font-bold text-sm text-white bg-white/[0.07] border border-white/[0.1] hover:bg-white/[0.12] transition-all duration-200"
    >
      Close
    </button>
  </div>
);

/* ── Main modal ───────────────────────────────────────────────── */
const TABS = ["UPI", "Card", "Net Banking"];

const PaymentModal = ({ isOpen, onClose, amountINR, campaignTitle }) => {
  const [activeTab, setActiveTab] = useState("UPI");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [customAmount, setCustomAmount] = useState("");

  if (!isOpen) return null;

  const needsAmountInput = !amountINR || amountINR === formatINR(0);
  const displayAmount = needsAmountInput
    ? formatINR(parseFloat(customAmount || 0))
    : amountINR;

  const handlePay = ({ method, detail }) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess({ method, detail });
    }, 2000);
  };

  const handleClose = () => {
    setSuccess(null);
    setActiveTab("UPI");
    setCustomAmount("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-2 sm:mx-0 glass rounded-2xl sm:rounded-3xl border border-white/[0.08] shadow-2xl overflow-hidden animate-fadeIn max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="relative p-4 sm:p-5 border-b border-white/[0.06]">
          <div className="absolute inset-0 bg-gradient-to-r from-[#f97316]/10 to-[#03dac5]/5" />

          <div className="relative flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                {/* Razorpay-style logo mark */}
                <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                  <path d="M6 3l12 9-4 1 2 8L6 3z" fill="#f97316" />
                </svg>
                <span className="font-jakarta font-bold text-white text-sm sm:text-base">Secure Checkout</span>
              </div>
              <p className="font-epilogue text-xs text-white/35 truncate">{campaignTitle}</p>
            </div>

            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-xl bg-white/[0.06] flex items-center justify-center hover:bg-white/[0.12] transition-colors flex-shrink-0"
            >
              <svg className="w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Amount — editable when no amount was pre-supplied */}
          {needsAmountInput ? (
            <div className="relative mt-4 flex items-center gap-2">
              <span className="font-epilogue text-sm text-white/40">₹</span>
              <input
                type="number"
                min="1"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-40 bg-transparent border-b border-white/20 focus:border-[#f97316]/60 text-white font-jakarta font-bold text-2xl outline-none pb-0.5 placeholder:text-white/20 placeholder:font-normal placeholder:text-base transition-colors"
              />
              <span className="font-epilogue text-xs text-white/30 self-end mb-1">INR</span>
            </div>
          ) : (
            <div className="relative mt-4 inline-flex items-baseline gap-1.5">
              <span className="font-epilogue text-xs text-white/40">Total</span>
              <span className="font-jakarta font-extrabold text-2xl text-white">{amountINR}</span>
              <span className="font-epilogue text-xs text-white/30">INR</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5">
          {success ? (
            <SuccessScreen
              amountINR={displayAmount}
              method={success.method}
              detail={success.detail}
              onClose={handleClose}
            />
          ) : (
            <>
              {/* Tabs */}
              <div className="flex gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06] mb-5">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2 rounded-lg font-epilogue font-semibold text-xs transition-all duration-200
                      ${activeTab === tab
                        ? "bg-[#f97316] text-white shadow-[0_0_12px_rgba(249,115,22,0.4)]"
                        : "text-white/40 hover:text-white/70"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeTab === "UPI"         && <UPIForm        onPay={handlePay} loading={loading} />}
              {activeTab === "Card"        && <CardForm       onPay={handlePay} loading={loading} />}
              {activeTab === "Net Banking" && <NetBankingForm onPay={handlePay} loading={loading} />}
            </>
          )}
        </div>

        {/* Footer */}
        {!success && (
          <div className="px-5 pb-4 flex items-center justify-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="font-epilogue text-[10px] text-white/20">256-bit SSL encrypted · Powered by Razorpay</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
export { ETH_TO_INR, formatINR };
