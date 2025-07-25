// Format price as currency with optional currency support
export function formatPrice(price: number, currency: string = 'USD'): string {
  const localeMap: Record<string, string> = {
    'USD': 'en-US',
    'EUR': 'de-DE',
    'GBP': 'en-GB'
  };
  
  const locale = localeMap[currency] || 'en-US';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(price);
}

// Format duration in a readable way
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} minutes`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
}

// Validate service data
export function validateService(service: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!service.title || service.title.trim().length === 0) {
    errors.push('Title is required');
  }
  
  // NEW: Check title length
  if (service.title && service.title.length > 100) {
    errors.push('Title must be 100 characters or less');
  }
  
  if (!service.description || service.description.trim().length === 0) {
    errors.push('Description is required');
  }
  
  if (!service.price || service.price <= 0) {
    errors.push('Price must be greater than 0');
  }
  
  if (!service.duration || service.duration <= 0) {
    errors.push('Duration must be greater than 0');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
