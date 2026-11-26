import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('utils', () => {
  describe('cn function', () => {
    it('should combine classes correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
    });

    it('should handle conditional classes', () => {
      const isActive = true;
      const isDisabled = false;
      expect(cn('base', isActive && 'conditional', isDisabled && 'not-included')).toBe('base conditional');
    });

    it('should handle undefined and null values', () => {
      expect(cn('base', undefined, null, 'end')).toBe('base end');
    });

    it('should merge Tailwind classes correctly', () => {
      // tailwind-mergeによって重複するクラスがマージされることを確認
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
      expect(cn('p-4', 'px-2')).toBe('p-4 px-2');
    });

    it('should handle empty input', () => {
      expect(cn()).toBe('');
    });
  });
});
