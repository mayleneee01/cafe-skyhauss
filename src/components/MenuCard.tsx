'use client';

import { useCartStore } from '@/lib/store';
import { formatRupiah } from '@/lib/utils';
import { ShoppingCart } from 'lucide-react';

interface MenuCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export default function MenuCard({ id, name, description, price, imageUrl }: MenuCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  const handleAddToCart = () => {
    addItem({ id, name, price });
    openCart();
  };

  return (
    <div 
      onClick={handleAddToCart}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group cursor-pointer menu-card"
    >
      <div className="h-48 bg-gray-200 overflow-hidden relative menu-card-img-wrapper">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 menu-card-img"
        />
      </div>
      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-900">{name}</h3>
        <p className="text-gray-500 text-sm mt-1 mb-4 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between mt-auto">
          <span className="font-bold text-maroon text-lg">{formatRupiah(price)}</span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            className="bg-maroon hover:bg-maroon-dark text-white p-2 rounded-full transition-colors flex items-center justify-center cursor-pointer"
            aria-label="Add to cart"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
