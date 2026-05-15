'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/lib/store';
import { formatRupiah } from '@/lib/utils';
import { ArrowLeft, Clock, User, Coffee, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CheckoutQrisModal from '@/components/CheckoutQrisModal';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);
  
  const [name, setName] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [isQRISOpen, setIsQRISOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) return null;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !pickupTime || items.length === 0) return;
    setIsQRISOpen(true);
  };

  const handlePaymentSuccess = async () => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          pickupTime: new Date(`1970-01-01T${pickupTime}:00`).toISOString(),
          items: items.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity
          }))
        })
      });

      if (response.ok) {
        clearCart();
        setIsQRISOpen(false);
        setIsSuccess(true);
      } else {
        alert('Terjadi kesalahan saat menyimpan pesanan');
        setIsQRISOpen(false);
      }
    } catch (error) {
      console.error(error);
      alert('Gagal terhubung ke server');
      setIsQRISOpen(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[100dvh] bg-gray-50 flex flex-col items-center justify-center p-4 animate-in fade-in duration-500">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full">
          <CheckCircle2 size={64} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pesanan Berhasil!</h2>
          <p className="text-gray-500 mb-6">Terima kasih <strong>{name}</strong>! Silahkan ambil pesanan Anda di SKY HAUSSS pada jam <strong>{pickupTime}</strong>.</p>
          <Link href="/" className="inline-block w-full bg-maroon hover:bg-maroon-dark text-white font-bold py-4 px-6 rounded-xl transition-colors shadow-md">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[100dvh] bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full">
          <Coffee size={48} className="text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Keranjang Kosong</h2>
          <p className="text-gray-500 mb-6">Silahkan pilih menu terlebih dahulu sebelum melakukan checkout.</p>
          <Link href="/" className="inline-block w-full bg-maroon hover:bg-maroon-dark text-white font-bold py-3 px-6 rounded-xl transition-colors">
            Kembali ke Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-gray-50 pb-safe-offset-24">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30 pt-safe">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center">
          <Link href="/" className="text-gray-500 hover:text-maroon transition-colors mr-4 p-2 -ml-2 rounded-full hover:bg-gray-100">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        <form onSubmit={handleCheckout} className="space-y-6">
          
          {/* Detail Pengambil */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User size={20} className="text-maroon" /> Detail Pengambil
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nama Pemesan</label>
                <input 
                  type="text" 
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama Anda"
                  className="w-full text-base px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-maroon focus:border-maroon outline-none transition-all"
                />
              </div>
              <div>
                <label htmlFor="pickupTime" className="block text-sm font-medium text-gray-700 mb-1">Estimasi Jam Pengambilan</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="time" 
                    id="pickupTime"
                    required
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full text-base pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-maroon focus:border-maroon outline-none transition-all"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Kami akan mulai menyiapkan pesanan 15 menit sebelum jam pengambilan.</p>
              </div>
            </div>
          </div>

          {/* Ringkasan Pesanan */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Ringkasan Pesanan</h2>
            <div className="space-y-3 mb-4">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{item.quantity}x {item.name}</span>
                  <span className="font-medium">{formatRupiah(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
              <span className="font-bold text-gray-900">Total Pembayaran</span>
              <span className="font-bold text-xl text-maroon">{formatRupiah(totalPrice())}</span>
            </div>
          </div>

          {/* Tombol Bayar */}
          <button 
            type="submit"
            className="w-full bg-maroon hover:bg-maroon-dark text-white font-bold py-4 px-4 rounded-xl shadow-lg transition-colors flex justify-center items-center gap-2 text-lg mb-8"
          >
            Bayar dengan QRIS
          </button>
        </form>
      </main>

      <CheckoutQrisModal 
        isOpen={isQRISOpen} 
        onClose={() => setIsQRISOpen(false)} 
        totalAmount={totalPrice()}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
