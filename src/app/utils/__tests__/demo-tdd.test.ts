import { describe, it, expect } from 'vitest';
import { formatPrice, formatDuration, validateService } from '../serviceUtils';

describe('Demo: Test-Driven Development', () => {
  // This test will PASS after we implement multi-currency support
  it('should format currency with different currency codes', () => {
    // Test that the function now accepts a second parameter
    expect(formatPrice(50, 'USD')).toBe('$50.00');
    expect(formatPrice(50, 'GBP')).toBe('£50.00');
    // Check that EUR formatting includes the Euro symbol
    expect(formatPrice(99.99, 'EUR')).toContain('€');
  });

  // This test will PASS - showing working functionality
  it('formats standard USD currency correctly', () => {
    expect(formatPrice(49.99)).toBe('$49.99');
    expect(formatPrice(100)).toBe('$100.00');
  });

  // This test will PASS after we add title length validation
  it('should reject services with titles longer than 100 characters', () => {
    const longTitle = 'A'.repeat(101); // 101 characters
    const service = {
      title: longTitle,
      description: 'Valid description',
      price: 50,
      duration: 60
    };
    
    const result = validateService(service);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Title must be 100 characters or less');
  });
});
