"use client";

import { useEffect } from 'react';

interface PerformanceMetrics {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

declare global {
  interface Window {
    gtag?: (command: string, ...args: any[]) => void;
  }
}

export function usePerformanceMonitoring() {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    // Web Vitals monitoring
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          const value = entry.startTime;
          const rating = value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
          
          // Log to console in development
          if (process.env.NODE_ENV === 'development') {
            console.log('LCP:', { value, rating });
          }
          
          // Send to analytics if available
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'web_vitals', {
              custom_parameter_name: 'LCP',
              value: Math.round(value),
              metric_rating: rating,
            });
          }
        }
        
        if (entry.entryType === 'first-input') {
          const value = (entry as any).processingStart - entry.startTime;
          const rating = value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor';
          
          if (process.env.NODE_ENV === 'development') {
            console.log('FID:', { value, rating });
          }
          
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'web_vitals', {
              custom_parameter_name: 'FID',
              value: Math.round(value),
              metric_rating: rating,
            });
          }
        }
      }
    });

    // Observe Web Vitals
    try {
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
    } catch (error) {
      console.warn('Performance Observer not supported');
    }

    // CLS monitoring
    let clsValue = 0;
    let clsEntries: any[] = [];

    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          const firstSessionEntry = clsEntries[0];
          const lastSessionEntry = clsEntries[clsEntries.length - 1];

          if (!clsEntries.length || 
              entry.startTime - lastSessionEntry.startTime < 1000 ||
              entry.startTime - firstSessionEntry.startTime < 5000) {
            clsEntries.push(entry);
            clsValue += (entry as any).value;
          } else {
            clsEntries = [entry];
            clsValue = (entry as any).value;
          }
        }
      }

      const rating = clsValue <= 0.1 ? 'good' : clsValue <= 0.25 ? 'needs-improvement' : 'poor';
      
      if (process.env.NODE_ENV === 'development') {
        console.log('CLS:', { value: clsValue, rating });
      }
      
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'web_vitals', {
          custom_parameter_name: 'CLS',
          value: Math.round(clsValue * 1000) / 1000,
          metric_rating: rating,
        });
      }
    });

    try {
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      console.warn('Layout Shift Observer not supported');
    }

    return () => {
      observer.disconnect();
      clsObserver.disconnect();
    };
  }, []);
}

// Hook for component-level performance monitoring
export function useComponentPerformance(componentName: string) {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`${componentName} render time:`, renderTime.toFixed(2), 'ms');
      }
      
      // Send to analytics if render time is slow
      if (renderTime > 100 && typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'slow_component_render', {
          component_name: componentName,
          render_time: Math.round(renderTime),
        });
      }
    };
  });
}
