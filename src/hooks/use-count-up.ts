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
          
          // Use a dummy element to disconnect the observer once triggered
          const dummyEl = document.createElement('span');
          dummyEl.style.display = 'none';
          document.body.appendChild(dummyEl);
          observer.unobserve(dummyEl);
          document.body.removeChild(dummyEl);

        }
      },
      { threshold: 0.1 }
    );
    
    // Create a dummy element to observe, to be able to disconnect after firing once
    const dummyEl = document.createElement('span');
    dummyEl.style.display = 'none';
    document.body.appendChild(dummyEl);

    observer.observe(dummyEl);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      observer.disconnect();
      if(document.body.contains(dummyEl)) {
          document.body.removeChild(dummyEl);
      }
    };
  }, [end, duration, decimals]);

  return count.toLocaleString();
}
