"use client";

import { useState } from "react";

interface QrisModalProps {
  checkoutData: any;
  onClose: () => void;
}

export default function QrisModal({ checkoutData, onClose }: QrisModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!checkoutData) return null;

  const handlePaymentConfirmed = async () => {
    setIsProcessing(true);
    try {
      const now = new Date();
      const timeParts = checkoutData.pickupTime.split(':');
      if (timeParts.length >= 2) {
        now.setHours(parseInt(timeParts[0], 10), parseInt(timeParts[1], 10), 0);
      }
      
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: checkoutData.name,
          pickupTime: now.toISOString(),
          items: [{
            name: checkoutData.product.name,
            price: checkoutData.product.priceNumber || 45000,
            quantity: 1
          }]
        })
      });

      if (response.ok) {
        alert('Pembayaran Berhasil Dikonfirmasi! Sampai jumpa pada jam ' + checkoutData.pickupTime);
        onClose();
      } else {
        alert('Terjadi kesalahan saat memproses pesanan.');
      }
    } catch (err) {
      console.error(err);
      alert('Gagal terhubung ke server.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-white/20 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>

      {/* Glassmorphism Modal */}
      <div className="relative glass w-full max-w-sm rounded-[2rem] p-10 flex flex-col items-center text-center animate-float" style={{ animationDuration: '8s' }}>
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-gray-500 hover:text-gray-900 transition-colors"
          disabled={isProcessing}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-gray-900 font-syne mb-2">Scan to Pay</h2>
        <p className="text-sm text-gray-500 mb-8">
          {checkoutData.product.name} • {checkoutData.product.price}
        </p>

        {/* QR Code Simulation */}
        <div className="w-56 h-56 bg-white rounded-2xl shadow-inner flex items-center justify-center p-4 mb-8">
          <div className="w-full h-full border-4 border-gray-900 border-dashed rounded-xl flex items-center justify-center bg-gray-50 relative">
            <div className="absolute inset-4 border-4 border-gray-900 rounded-lg"></div>
            <div className="w-12 h-12 bg-maroon rounded-lg shadow-lg z-10 flex items-center justify-center">
              <span className="text-white font-black text-xs">QRIS</span>
            </div>
            {/* Corner dots */}
            <div className="absolute top-6 left-6 w-4 h-4 bg-gray-900 rounded-sm"></div>
            <div className="absolute top-6 right-6 w-4 h-4 bg-gray-900 rounded-sm"></div>
            <div className="absolute bottom-6 left-6 w-4 h-4 bg-gray-900 rounded-sm"></div>
          </div>
        </div>

        <div className="w-full bg-off-white rounded-xl p-4 text-left border border-gray-100">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Pick-up Time</span>
            <span className="font-bold text-gray-900">{checkoutData.pickupTime}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Name</span>
            <span className="font-bold text-gray-900">{checkoutData.name}</span>
          </div>
        </div>

        <button 
          onClick={handlePaymentConfirmed}
          disabled={isProcessing}
          className="w-full mt-6 py-4 bg-gray-900 text-white rounded-xl font-bold uppercase tracking-wider hover:bg-black transition-colors cursor-pointer disabled:opacity-50"
        >
          {isProcessing ? "Memproses..." : "Saya Sudah Bayar"}
        </button>
      </div>
    </div>
  );
}

