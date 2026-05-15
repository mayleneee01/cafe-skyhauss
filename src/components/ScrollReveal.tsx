"use client";

import { useEffect, useRef, ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function ScrollReveal({ children, className = "", delay = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            if (ref.current) {
              ref.current.classList.add('visible');
            }
          }, delay);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [delay]);

  return (
    <div ref={ref} className={`fade-up ${className}`}>
      {children}
    </div>
  );
}
