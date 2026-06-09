import { renderHook, act } from '@testing-library/react-native';
import useDebounce from '../src/hooks/useDebounce';

jest.useFakeTimers();

describe('useDebounce', () => {
  afterEach(() => jest.clearAllTimers());

  it('returns the initial value without delay', async () => {
    const { result } = await renderHook(() => useDebounce('hello', 300));
    expect(result.current).toBe('hello');
  });

  it('does not update before the delay has passed', async () => {
    const { result, rerender } = await renderHook(
      ({ value }: { value: string }) => useDebounce(value, 300),
      { initialProps: { value: 'first' } },
    );

    await rerender({ value: 'second' });
    await act(async () => { jest.advanceTimersByTime(200); });
    expect(result.current).toBe('first');
  });

  it('updates after the full delay has passed', async () => {
    const { result, rerender } = await renderHook(
      ({ value }: { value: string }) => useDebounce(value, 300),
      { initialProps: { value: 'first' } },
    );

    await rerender({ value: 'second' });
    await act(async () => { jest.advanceTimersByTime(300); });
    expect(result.current).toBe('second');
  });

  it('resets the timer when value changes rapidly', async () => {
    const { result, rerender } = await renderHook(
      ({ value }: { value: string }) => useDebounce(value, 300),
      { initialProps: { value: 'first' } },
    );

    await rerender({ value: 'second' });
    await act(async () => { jest.advanceTimersByTime(150); });

    await rerender({ value: 'third' });
    await act(async () => { jest.advanceTimersByTime(150); });
    expect(result.current).toBe('first');

    await act(async () => { jest.advanceTimersByTime(150); });
    expect(result.current).toBe('third');
  });
});
