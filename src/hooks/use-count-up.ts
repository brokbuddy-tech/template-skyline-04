'use client';

import { useState, useEffect, useRef } from 'react';

export function useCountUp(end: number, duration: number, decimals: number) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const animationFrameId = useRef<number>();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let startTime: number;
          const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / (duration * 1000), 1);
            const currentCount = parseFloat((percentage * end).toFixed(decimals));
            setCount(currentCount);

            if (progress < duration * 1000) {
              animationFrameId.current = requestAnimationFrame(animate);
            }
          };
          animationFrameId.current = requestAnimationFrame(animate);
          
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      { threshold: 0.1 }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [end, duration, decimals, ref]);

  return { count: count.toLocaleString(), ref };
}
