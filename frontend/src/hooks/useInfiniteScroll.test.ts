import { renderHook } from '@testing-library/react';
import { useInfiniteScroll } from './useInfiniteScroll';

describe('useInfiniteScroll', () => {
  let observeMock: jest.Mock;
  let unobserveMock: jest.Mock;
  let disconnectMock: jest.Mock;

  beforeEach(() => {
    observeMock = jest.fn();
    unobserveMock = jest.fn();
    disconnectMock = jest.fn();

    // Mock IntersectionObserver
    (global as any).IntersectionObserver = jest.fn((callback) => ({
      observe: observeMock,
      unobserve: unobserveMock,
      disconnect: disconnectMock,
      // Helper to trigger the callback in tests
      trigger: (isIntersecting: boolean) => {
        callback([{ isIntersecting }], {} as any);
      }
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('observes the sentinel element on mount', () => {
    const onLoadMore = jest.fn();
    const sentinel = document.createElement('div');
    
    // We need to set the ref BEFORE the hook runs the effect
    // But renderHook runs it immediately. 
    // In actual React, the ref is attached during the render phase 
    // and available in the effect.
    
    const { result } = renderHook(() => {
      const hook = useInfiniteScroll({
        onLoadMore,
        hasMore: true,
        loading: false
      });
      // In the same render where we return it, we set it.
      // This is slightly different from how React attaches it, but it 
      // ensures that when the effect runs (after the render completes)
      // the ref is set.
      if (!hook.sentinelRef.current) {
        hook.sentinelRef.current = sentinel;
      }
      return hook;
    });

    expect(observeMock).toHaveBeenCalledWith(sentinel);
  });

  it('calls onLoadMore when intersecting and hasMore is true', () => {
    const onLoadMore = jest.fn();
    let observerCallback: any;

    (global as any).IntersectionObserver = jest.fn((callback) => {
      observerCallback = callback;
      return {
        observe: observeMock,
        unobserve: unobserveMock,
        disconnect: disconnectMock
      };
    });

    const { result } = renderHook(() =>
      useInfiniteScroll({
        onLoadMore,
        hasMore: true,
        loading: false
      })
    );

    const sentinel = document.createElement('div');
    result.current.sentinelRef.current = sentinel;

    // Simulate intersection
    observerCallback([{ isIntersecting: true }], {});

    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it('does NOT call onLoadMore when intersecting but hasMore is false', () => {
    const onLoadMore = jest.fn();
    let observerCallback: any;

    (global as any).IntersectionObserver = jest.fn((callback) => {
      observerCallback = callback;
      return {
        observe: observeMock,
        unobserve: unobserveMock,
        disconnect: disconnectMock
      };
    });

    const { result } = renderHook(() =>
      useInfiniteScroll({
        onLoadMore,
        hasMore: false,
        loading: false
      })
    );

    const sentinel = document.createElement('div');
    result.current.sentinelRef.current = sentinel;

    // Simulate intersection
    observerCallback([{ isIntersecting: true }], {});

    expect(onLoadMore).not.toHaveBeenCalled();
  });

  it('does NOT call onLoadMore when intersecting but loading is true', () => {
    const onLoadMore = jest.fn();
    let observerCallback: any;

    (global as any).IntersectionObserver = jest.fn((callback) => {
      observerCallback = callback;
      return {
        observe: observeMock,
        unobserve: unobserveMock,
        disconnect: disconnectMock
      };
    });

    const { result } = renderHook(() =>
      useInfiniteScroll({
        onLoadMore,
        hasMore: true,
        loading: true
      })
    );

    const sentinel = document.createElement('div');
    result.current.sentinelRef.current = sentinel;

    // Simulate intersection
    observerCallback([{ isIntersecting: true }], {});

    expect(onLoadMore).not.toHaveBeenCalled();
  });

  it('disconnects observer on unmount', () => {
    const onLoadMore = jest.fn();
    const { unmount } = renderHook(() =>
      useInfiniteScroll({
        onLoadMore,
        hasMore: true,
        loading: false
      })
    );

    unmount();
    expect(disconnectMock).toHaveBeenCalled();
  });
});
