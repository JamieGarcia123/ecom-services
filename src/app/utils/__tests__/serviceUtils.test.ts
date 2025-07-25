import { describe, it, expect } from 'vitest';
import { formatPrice, formatDuration, validateService } from '../serviceUtils';

describe('serviceUtils', () => {
  describe('formatPrice', () => {
    it('formats whole numbers correctly', () => {
      expect(formatPrice(50)).toBe('$50.00');
    });

    it('formats decimal numbers correctly', () => {
      expect(formatPrice(49.99)).toBe('$49.99');
    });

    it('handles zero correctly', () => {
      expect(formatPrice(0)).toBe('$0.00');
    });

    it('rounds to two decimal places', () => {
      expect(formatPrice(99.999)).toBe('$100.00');
    });

    it('handles large numbers', () => {
      expect(formatPrice(1234.56)).toBe('$1,234.56');
    });
  });

  describe('formatDuration', () => {
    it('formats minutes under an hour', () => {
      expect(formatDuration(30)).toBe('30 minutes');
      expect(formatDuration(45)).toBe('45 minutes');
    });

    it('formats exactly one hour', () => {
      expect(formatDuration(60)).toBe('1 hour');
    });

    it('formats multiple hours', () => {
      expect(formatDuration(120)).toBe('2 hours');
      expect(formatDuration(180)).toBe('3 hours');
    });

    it('formats hours with minutes', () => {
      expect(formatDuration(90)).toBe('1h 30m');
      expect(formatDuration(150)).toBe('2h 30m');
    });

    it('handles edge cases', () => {
      expect(formatDuration(1)).toBe('1 minutes');
      expect(formatDuration(61)).toBe('1h 1m');
    });
  });

  describe('validateService', () => {
    const validService = {
      title: 'Test Service',
      description: 'A test service description',
      price: 50,
      duration: 60
    };

    it('validates a correct service', () => {
      const result = validateService(validService);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('requires a title', () => {
      const service = { ...validService, title: '' };
      const result = validateService(service);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Title is required');
    });

    it('requires a description', () => {
      const service = { ...validService, description: '' };
      const result = validateService(service);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Description is required');
    });

    it('requires a positive price', () => {
      const service = { ...validService, price: 0 };
      const result = validateService(service);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Price must be greater than 0');
    });

    it('requires a positive duration', () => {
      const service = { ...validService, duration: -1 };
      const result = validateService(service);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Duration must be greater than 0');
    });

    it('collects multiple errors', () => {
      const service = {
        title: '',
        description: '',
        price: 0,
        duration: 0
      };
      const result = validateService(service);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(4);
    });
  });
});
