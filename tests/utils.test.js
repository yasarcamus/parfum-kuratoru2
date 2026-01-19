import { describe, it, expect, vi } from 'vitest';
import { getColorForText, debounce } from '../src/utils';

describe('Utils', () => {
    describe('getColorForText', () => {
        it('should return a consistent color for the same text', () => {
            const color1 = getColorForText('test');
            const color2 = getColorForText('test');
            expect(color1).toBe(color2);
        });

        it('should return different colors for different text', () => {
            const color1 = getColorForText('test1');
            const color2 = getColorForText('test2');
            expect(color1).not.toBe(color2);
        });

        it('should return hsl format', () => {
            const color = getColorForText('test');
            expect(color).toMatch(/^hsl\(\d+, \d+%?, \d+%?\)$/);
        });
    });

    describe('debounce', () => {
        it('should debounce function calls', () => {
            vi.useFakeTimers();
            const func = vi.fn();
            const debouncedFunc = debounce(func, 100);

            debouncedFunc();
            debouncedFunc();
            debouncedFunc();

            expect(func).not.toHaveBeenCalled();

            vi.advanceTimersByTime(100);
            expect(func).toHaveBeenCalledTimes(1);
        });
    });
});
