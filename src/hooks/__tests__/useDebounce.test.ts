import { renderHook, act } from '@testing-library/react-native';
import useDebounce from '../useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns the initial value immediately', async () => {
    const { result } = await renderHook(() => useDebounce('hello', 300));
    expect(result.current).toBe('hello');
  });

  it('does not update value before delay elapses', async () => {
    const { result, rerender } = await renderHook(
      ({ value, delay }: { value: string; delay: number }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } },
    );

    await rerender({ value: 'updated', delay: 300 });

    await act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(result.current).toBe('initial');
  });

  it('updates value after delay elapses', async () => {
    const { result, rerender } = await renderHook(
      ({ value, delay }: { value: string; delay: number }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } },
    );

    await rerender({ value: 'updated', delay: 300 });

    await act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe('updated');
  });

  it('resets the timer when value changes rapidly', async () => {
    const { result, rerender } = await renderHook(
      ({ value, delay }: { value: string; delay: number }) => useDebounce(value, delay),
      { initialProps: { value: 'a', delay: 300 } },
    );

    await rerender({ value: 'b', delay: 300 });
    await act(() => { jest.advanceTimersByTime(200); });

    await rerender({ value: 'c', delay: 300 });
    await act(() => { jest.advanceTimersByTime(200); });

    expect(result.current).toBe('a');

    await act(() => { jest.advanceTimersByTime(100); });
    expect(result.current).toBe('c');
  });
});
