"use client";

import ScrollReveal from "./ScrollReveal";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-white pt-24 pb-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          
          <div className="flex flex-col space-y-6">
            <div className="text-3xl font-black tracking-tighter">
              SKY<span className="text-maroon">HAUSSS</span>
            </div>
            <p className="text-gray-400 font-light leading-relaxed max-w-xs">
              A premium café experience designed for those who seek tranquility and excellence in every cup.
            </p>
          </div>

          <div className="flex flex-col space-y-6">
            <h4 className="text-sm uppercase tracking-widest font-bold text-white">Explore</h4>
            <ul className="flex flex-col space-y-4 text-gray-400 font-light">
              <li className="hover:text-maroon transition-colors cursor-pointer">Menu</li>
              <li className="hover:text-maroon transition-colors cursor-pointer">Reservations</li>
              <li className="hover:text-maroon transition-colors cursor-pointer">Locations</li>
              <li className="hover:text-maroon transition-colors cursor-pointer">About Us</li>
            </ul>
          </div>

          <div className="flex flex-col space-y-6">
            <h4 className="text-sm uppercase tracking-widest font-bold text-white">Connect</h4>
            <ul className="flex flex-col space-y-4 text-gray-400 font-light">
              <li className="hover:text-maroon transition-colors cursor-pointer">Instagram</li>
              <li className="hover:text-maroon transition-colors cursor-pointer">Twitter</li>
              <li className="hover:text-maroon transition-colors cursor-pointer">TikTok</li>
              <li className="hover:text-maroon transition-colors cursor-pointer">LinkedIn</li>
            </ul>
          </div>

          <div className="flex flex-col space-y-6">
            <h4 className="text-sm uppercase tracking-widest font-bold text-white">Newsletter</h4>
            <p className="text-xs text-gray-400 font-light">Join our circle for exclusive updates and seasonal releases.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="email@example.com"
                className="w-full bg-white/5 border-b border-white/20 py-3 outline-none focus:border-maroon transition-colors text-sm"
              />
              <button className="absolute right-0 bottom-3 text-maroon hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </button>
            </div>
          </div>

        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-gray-500 font-light">
            © 2024 SKY HAUSSS. ALL RIGHTS RESERVED.
          </p>
          <div className="flex space-x-8 text-xs text-gray-500 font-light">
            <span className="hover:text-white transition-colors cursor-pointer">PRIVACY POLICY</span>
            <span className="hover:text-white transition-colors cursor-pointer">TERMS OF SERVICE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
