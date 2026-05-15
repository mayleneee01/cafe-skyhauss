"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 px-6 md:px-12 py-6 ${
        isScrolled ? "bg-white/80 backdrop-blur-md py-4 shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div 
          className="text-2xl font-black tracking-tighter cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          SKY<span className="text-maroon">HAUSSS</span>
        </div>

        <div className="hidden md:flex items-center space-x-12">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-xs uppercase tracking-widest font-bold text-gray-900 hover:text-maroon transition-colors"
          >
            Home
          </button>
          <button 
            onClick={() => scrollToSection("menu-section")}
            className="text-xs uppercase tracking-widest font-bold text-gray-900 hover:text-maroon transition-colors"
          >
            Menu
          </button>
          <button 
            onClick={() => scrollToSection("reservation-section")}
            className="text-xs uppercase tracking-widest font-bold text-gray-900 hover:text-maroon transition-colors"
          >
            Reservation
          </button>
          <button 
            className="px-6 py-3 bg-maroon text-white text-xs uppercase tracking-widest font-bold rounded-full hover:bg-maroon-dark transition-all transform hover:scale-105 active:scale-95"
            onClick={() => scrollToSection("menu-section")}
          >
            Order Pickup
          </button>
        </div>

        {/* Mobile Menu Icon (Simplified for now) */}
        <div className="md:hidden text-maroon">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </div>
      </div>
    </nav>
  );
}
