/**
 * Utility functions for locale detection and currency mapping
 */

// Function to get local currency based on browser locale or default to KES for Kenya
export function getLocalCurrency(): string {
  try {
    // Try to detect from browser locale if available
    if (typeof navigator !== 'undefined') {
      // const locale = navigator.language || 'en-KE';
      const locale = 'en-KE';

      // Kenya-specific locales
      if (locale.includes('KE') || locale.includes('ke')) {
        return 'KES';
      }
      
      // Other common locales
      if (locale.startsWith('en-US')) return 'USD';
      if (locale.startsWith('en-GB')) return 'GBP';
      if (locale.startsWith('en-CA')) return 'CAD';
      if (locale.startsWith('en-AU')) return 'AUD';
      if (locale.startsWith('fr')) return 'EUR';
      if (locale.startsWith('de')) return 'EUR';
      if (locale.startsWith('es')) return 'EUR';
      if (locale.startsWith('it')) return 'EUR';
      if (locale.startsWith('ja')) return 'JPY';
      if (locale.startsWith('zh')) return 'CNY';
      if (locale.startsWith('hi')) return 'INR';
      if (locale.startsWith('sw')) return 'KES'; // Swahili - likely Kenya/Tanzania
      if (locale.includes('TZ')) return 'TZS';
      if (locale.includes('UG')) return 'UGX';
      if (locale.includes('NG')) return 'NGN';
      if (locale.includes('GH')) return 'GHS';
      if (locale.includes('ZA')) return 'ZAR';
    }
    
    // Default to KES for Kenya-based app
    return 'KES';
  } catch {
    return 'KES';
  }
}

// Function to get locale information
export function getLocaleInfo() {
  try {
    if (typeof navigator !== 'undefined') {
      return {
        language: navigator.language,
        languages: navigator.languages,
        currency: getLocalCurrency(),
      };
    }
    return {
      language: 'en-KE',
      languages: ['en-KE'],
      currency: 'KES',
    };
  } catch {
    return {
      language: 'en-KE',
      languages: ['en-KE'],
      currency: 'KES',
    };
  }
}
