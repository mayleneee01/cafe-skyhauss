"use client";

import { useState } from "react";

interface PickupCheckoutProps {
  product: any;
  onClose: () => void;
  onConfirm: (checkoutData: any) => void;
}

export default function PickupCheckout({ product, onClose, onConfirm }: PickupCheckoutProps) {
  const [name, setName] = useState("");
  const [pickupTime, setPickupTime] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !pickupTime) return;
    onConfirm({ product, name, pickupTime });
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-float" style={{ animation: 'none', transform: 'translateY(0)', opacity: 1 }}>
        <div className="p-8 md:p-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 font-syne">Checkout</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-maroon transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-6 mb-8 p-4 bg-off-white rounded-2xl border border-gray-100">
            <div className="w-20 h-20 relative bg-white rounded-xl overflow-hidden p-2 flex-shrink-0">
              <img src={product.img} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">{product.name}</h3>
              <p className="text-maroon font-medium">{product.price}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-5 py-4 bg-off-white border-none rounded-xl focus:ring-2 focus:ring-maroon outline-none transition-all text-gray-900"
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Self Pick-up Time</label>
              <input 
                type="time" 
                required
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="w-full px-5 py-4 bg-off-white border-none rounded-xl focus:ring-2 focus:ring-maroon outline-none transition-all text-gray-900"
              />
              <p className="text-xs text-gray-400 mt-2">Skip the queue, pick up directly at the counter.</p>
            </div>

            <button 
              type="submit"
              className="w-full py-5 bg-maroon text-white rounded-xl font-bold uppercase tracking-wider hover:bg-red-900 transition-colors duration-300 mt-4 shadow-lg shadow-maroon/20"
            >
              Confirm Order
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
