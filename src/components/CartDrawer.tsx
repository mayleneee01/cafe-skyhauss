'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/lib/store';
import { formatRupiah } from '@/lib/utils';
import { ShoppingBag, X, Plus, Minus } from 'lucide-react';
import Link from 'next/link';

export default function CartDrawer() {
  const [isMounted, setIsMounted] = useState(false);
  const { items, addItem, removeItem, totalItems, totalPrice, isCartOpen, openCart, closeCart } = useCartStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Mencegah Hydration mismatch
  }

  return (
    <>
      <button
        onClick={openCart}
        className="fixed bottom-safe-offset-6 right-6 bottom-6 bg-maroon text-white p-4 rounded-full shadow-[0_4px_20px_rgba(128,0,0,0.5)] hover:bg-maroon-dark transition-colors flex items-center justify-center z-[100] cursor-pointer"
        style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
      >
        <div className="relative">
          <ShoppingBag size={24} />
          {totalItems() > 0 && (
            <span className="absolute -top-3 -right-3 bg-red-500 border-2 border-white text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {totalItems()}
            </span>
          )}
        </div>
      </button>

      {/* Overlay */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[110] transition-opacity backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-[100dvh] w-full sm:w-96 bg-white z-[120] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-5 border-b border-gray-100 flex items-center justify-between mt-safe pt-safe">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="text-maroon" /> Keranjang Anda
          </h2>
          <button onClick={closeCart} className="text-gray-400 hover:text-gray-600 cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 pb-safe">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <ShoppingBag size={48} className="opacity-50" />
              <p>Keranjang belanja kosong</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center border-b border-gray-50 pb-4">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">{item.name}</h4>
                    <p className="text-maroon font-semibold">{formatRupiah(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="p-2 hover:bg-white rounded text-gray-600 transition-colors cursor-pointer"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => addItem({ id: item.id, name: item.name, price: item.price })}
                      className="p-2 hover:bg-white rounded text-gray-600 transition-colors cursor-pointer"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-5 border-t border-gray-100 bg-gray-50 pb-safe-offset-5">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Total Harga</span>
              <span className="text-xl font-bold text-maroon">{formatRupiah(totalPrice())}</span>
            </div>
            <Link 
              href="/checkout"
              onClick={closeCart}
              className="w-full bg-maroon hover:bg-maroon-dark text-white font-bold py-4 px-4 rounded-xl flex items-center justify-center transition-colors shadow-md text-lg"
            >
              Lanjut ke Pembayaran
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
