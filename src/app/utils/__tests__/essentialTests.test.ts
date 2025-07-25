import { describe, it, expect } from 'vitest';
import { formatPrice, formatDuration, validateService } from '../serviceUtils';

describe('Essential Service Utils Tests', () => {
  it('formats price correctly', () => {
    expect(formatPrice(49.99)).toBe('$49.99');
    expect(formatPrice(0)).toBe('$0.00');
  });

  it('formats duration correctly', () => {
    expect(formatDuration(30)).toBe('30 minutes');
    expect(formatDuration(90)).toBe('1h 30m');
  });

  it('validates service with all required fields', () => {
    const validService = {
      title: 'Test Service',
      description: 'Valid description',
      price: 50,
      duration: 60
    };
    const result = validateService(validService);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects service with missing title', () => {
    const invalidService = {
      title: '',
      description: 'Valid description',
      price: 50,
      duration: 60
    };
    const result = validateService(invalidService);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Title is required');
  });

  it('rejects service with invalid price', () => {
    const invalidService = {
      title: 'Test Service',
      description: 'Valid description',
      price: 0,
      duration: 60
    };
    const result = validateService(invalidService);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Price must be greater than 0');
  });
});
