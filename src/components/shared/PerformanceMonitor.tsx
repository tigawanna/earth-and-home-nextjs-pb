"use client";

import { usePerformanceMonitoring } from "@/hooks/use-performance";
import { useEffect } from "react";

export function PerformanceMonitor() {
  usePerformanceMonitoring();

  useEffect(() => {
    // Report page load time
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Page Load Time:', loadTime, 'ms');
        }
        
        // Report slow page loads
        if (loadTime > 3000 && window.gtag) {
          window.gtag('event', 'slow_page_load', {
            load_time: loadTime,
            page_path: window.location.pathname,
          });
        }
      });
    }
  }, []);

  return null; // This component doesn't render anything
}
