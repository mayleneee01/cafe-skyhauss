"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MenuGrid from "@/components/MenuGrid";
import ReservationSection from "@/components/ReservationSection";
import Footer from "@/components/Footer";
import PickupCheckout from "@/components/PickupCheckout";
import QrisModal from "@/components/QrisModal";
import CartDrawer from "@/components/CartDrawer";

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [checkoutData, setCheckoutData] = useState<any>(null);

  const handleSelectProduct = (product: any) => {
    setSelectedProduct(product);
  };

  const handleConfirmCheckout = (data: any) => {
    setSelectedProduct(null);
    setCheckoutData(data);
  };

  const handleCloseQris = () => {
    setCheckoutData(null);
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <MenuGrid onSelectProduct={handleSelectProduct} />
      <ReservationSection />
      <Footer />
      <CartDrawer />
      
      {selectedProduct && (
        <PickupCheckout 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onConfirm={handleConfirmCheckout} 
        />
      )}

      {checkoutData && (
        <QrisModal 
          checkoutData={checkoutData} 
          onClose={handleCloseQris} 
        />
      )}
    </main>
  );
}

