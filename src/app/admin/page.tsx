'use client';

import { useState, useEffect } from 'react';
import { formatRupiah } from '@/lib/utils';
import { Coffee, CheckCircle, Clock, Lock, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [loginError, setLoginError] = useState(false);

  useEffect(() => {
    // Cek apakah sudah login dari session storage
    const authStatus = sessionStorage.getItem('adminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      fetchOrders();
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(fetchOrders, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '123456') { // PIN Statis sederhana
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
      setLoginError(false);
      setIsLoading(true);
      fetchOrders();
    } else {
      setLoginError(true);
      setPin('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReadyToPickup = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: 'READY_TO_PICKUP' })
      });
      
      if (response.ok) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, orderStatus: 'READY_TO_PICKUP' } : order
        ));
      }
    } catch (error) {
      console.error(error);
      alert('Gagal mengupdate status pesanan');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[100dvh] bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm max-w-sm w-full border border-gray-100">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
              <Lock className="text-maroon h-8 w-8" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Admin Panel</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-1">Masukkan PIN Keamanan</label>
              <input 
                type="password" 
                id="pin"
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••••"
                className="w-full text-center text-2xl tracking-[0.5em] px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-maroon focus:border-maroon outline-none transition-all"
                autoComplete="off"
              />
              {loginError && <p className="text-sm text-red-500 mt-2 text-center">PIN salah! Coba lagi.</p>}
            </div>
            <button 
              type="submit"
              className="w-full bg-maroon hover:bg-maroon-dark text-white font-bold py-3 px-4 rounded-xl transition-colors"
            >
              Masuk
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-gray-500 hover:text-maroon">Kembali ke Beranda</Link>
          </div>
        </div>
      </div>
    );
  }

  const totalRevenue = orders
    .filter(order => order.paymentStatus === 'SUCCESS')
    .reduce((total, order) => total + order.totalAmount, 0);

  const pendingOrdersCount = orders.filter(order => order.orderStatus === 'PREPARING').length;

  return (
    <div className="min-h-[100dvh] bg-gray-50 pb-24">
      <header className="bg-maroon text-white shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coffee className="text-white h-8 w-8" />
            <h1 className="text-2xl font-black tracking-tighter">SKY HAUSSS ADMIN</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors hidden sm:block">
              Lihat Web
            </Link>
            <button onClick={handleLogout} className="text-sm bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
              <LogOut size={16} /> <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Statistik Ringkasan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-maroon">
            <h3 className="text-gray-500 text-sm font-medium mb-1">Total Pendapatan</h3>
            <p className="text-3xl font-bold text-gray-900">{formatRupiah(totalRevenue)}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-yellow-500">
            <h3 className="text-gray-500 text-sm font-medium mb-1">Pesanan Disiapkan</h3>
            <p className="text-3xl font-bold text-gray-900">{pendingOrdersCount}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-green-500">
            <h3 className="text-gray-500 text-sm font-medium mb-1">Total Transaksi</h3>
            <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
          </div>
        </div>

        {/* Daftar Pesanan */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-lg font-bold text-gray-900">Daftar Pesanan Masuk</h2>
          </div>
          
          {isLoading ? (
            <div className="p-12 text-center text-gray-500">Memuat data pesanan...</div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center text-gray-500">Belum ada pesanan masuk hari ini.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                    <th className="px-6 py-3 font-medium">Pelanggan</th>
                    <th className="px-6 py-3 font-medium">Pesanan</th>
                    <th className="px-6 py-3 font-medium">Total Harga</th>
                    <th className="px-6 py-3 font-medium text-center">Jam Ambil</th>
                    <th className="px-6 py-3 font-medium text-center">Status</th>
                    <th className="px-6 py-3 font-medium text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-5 font-medium text-gray-900">{order.customerName}</td>
                      <td className="px-6 py-5">
                        <ul className="text-sm text-gray-600 list-disc list-inside">
                          {order.items.map((item: any) => (
                            <li key={item.id}>{item.quantity}x {item.name}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-6 py-5 font-medium text-maroon">{formatRupiah(order.totalAmount)}</td>
                      <td className="px-6 py-5 text-center">
                        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium">
                          <Clock size={14} />
                          {new Date(order.pickupTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        {order.orderStatus === 'PREPARING' ? (
                          <span className="inline-flex bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-full text-xs font-bold">
                            Menyiapkan
                          </span>
                        ) : order.orderStatus === 'READY_TO_PICKUP' ? (
                          <span className="inline-flex bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-xs font-bold">
                            Siap Diambil
                          </span>
                        ) : (
                          <span className="inline-flex bg-gray-100 text-gray-800 px-3 py-1.5 rounded-full text-xs font-bold">
                            Selesai
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-center">
                        {order.orderStatus === 'PREPARING' && (
                          <button
                            onClick={() => handleReadyToPickup(order.id)}
                            className="inline-flex items-center gap-2 bg-maroon hover:bg-maroon-dark text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm"
                          >
                            <CheckCircle size={16} />
                            Siap Diambil
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
