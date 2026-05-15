"use client";

import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

export default function HeroSection() {
  const handleScrollToMenu = () => {
    document.getElementById("menu-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-white px-6 md:px-12 pt-20">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
        
        {/* Text Content */}
        <div className="flex flex-col items-start justify-center space-y-8 order-2 lg:order-1 mt-12 lg:mt-0">
          <ScrollReveal delay={100}>
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] text-gray-900">
              SKY<br />
              <span className="text-maroon">HAUSSS</span>
            </h1>
          </ScrollReveal>
          
          <ScrollReveal delay={300}>
            <p className="text-lg md:text-xl text-gray-500 max-w-md font-light leading-relaxed">
              Experience calm in every cup. Elevating your daily ritual with rich blends and simple, seamless pick-ups.
            </p>
          </ScrollReveal>
          
          <ScrollReveal delay={500}>
            <button 
              onClick={handleScrollToMenu}
              className="premium-btn group flex items-center gap-4 px-10 py-5 bg-gray-900 text-white rounded-full text-sm uppercase tracking-widest font-semibold mt-4"
            >
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">Order Now</span>
              <svg className="w-5 h-5 relative z-10 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </button>
          </ScrollReveal>
        </div>

        {/* Image / Visual */}
        <div className="relative h-[50vh] lg:h-[80vh] flex items-center justify-center order-1 lg:order-2">
          <ScrollReveal delay={200} className="w-full h-full flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-[3/4] animate-float">
              {/* Note: The user should place the transparent coffee cup png as /coffee_cup_hero.png in public dir */}
              {/* Falling back to a styled div if image is missing, but rendering the image tag */}
              <div className="absolute inset-0 bg-maroon/5 rounded-full blur-3xl transform scale-75 -z-10 translate-y-10"></div>
              <Image 
                src="/coffee_cup_hero.png" 
                alt="Floating Iced Coffee"
                fill
                priority
                className="object-contain drop-shadow-2xl"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </ScrollReveal>
        </div>

      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-screen bg-off-white -z-10 skew-x-12 translate-x-1/2 opacity-50"></div>
    </section>
  );
}
