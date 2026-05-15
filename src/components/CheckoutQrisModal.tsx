'use client';

import { X, CheckCircle2 } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import { useState } from 'react';

interface CheckoutQrisModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  onSuccess: () => void;
}

export default function CheckoutQrisModal({ isOpen, onClose, totalAmount, onSuccess }: CheckoutQrisModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    // Simulate network delay
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Tunggu sebentar untuk menunjukkan UI sukses, lalu panggil callback onSuccess
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-lg text-gray-900">Pembayaran QRIS</h2>
          {!isSuccess && (
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          )}
        </div>
        
        <div className="p-6 flex flex-col items-center">
          {isSuccess ? (
            <div className="flex flex-col items-center py-8">
              <CheckCircle2 size={64} className="text-green-500 mb-4 animate-in zoom-in duration-300" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pembayaran Berhasil!</h3>
              <p className="text-gray-500 text-center">Pesanan Anda sedang diproses dan siap diambil sesuai waktu yang ditentukan.</p>
            </div>
          ) : (
            <>
              <p className="text-gray-500 mb-4">Scan QR Code di bawah menggunakan M-Banking atau E-Wallet Anda.</p>
              
              <div className="bg-gray-100 p-4 rounded-xl mb-6">
                {/* Dummy QR Code Image */}
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" 
                  alt="QRIS" 
                  className="w-48 h-48 mx-auto mix-blend-multiply"
                />
              </div>
              
              <div className="w-full bg-red-50 p-4 rounded-lg mb-6 border border-red-100 text-center">
                <span className="block text-sm text-gray-600 mb-1">Total Pembayaran</span>
                <span className="block text-2xl font-bold text-maroon">{formatRupiah(totalAmount)}</span>
              </div>
              
              <button 
                onClick={handleSimulatePayment}
                disabled={isProcessing}
                className="w-full bg-maroon hover:bg-maroon-dark disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-xl transition-colors flex justify-center"
              >
                {isProcessing ? 'Memproses...' : 'Simulasikan Pembayaran Sukses'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
