// src/hooks/useScrollReveal.js
import { useEffect, useRef, useState } from "react";

/**
 * Fires `isVisible = true` once the element scrolls into view, then
 * disconnects. Use with a CSS transition (opacity/translate) driven by
 * the returned boolean — no animation library needed.
 */
export function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
}