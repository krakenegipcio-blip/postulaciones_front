import { useRef, useCallback } from 'react';

export function useLongPress(
  onLongPress: () => void,
  onPress?: () => void,
  { delay = 700 }: { delay?: number } = {}
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPress = useRef(false);
  const startPos = useRef<{ x: number; y: number } | null>(null);

  const start = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      isLongPress.current = false;
      // Track start position to cancel on scroll/drag
      if ('touches' in e) {
        startPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      timerRef.current = setTimeout(() => {
        isLongPress.current = true;
        onLongPress();
      }, delay);
    },
    [onLongPress, delay]
  );

  const move = useCallback((e: React.TouchEvent) => {
    if (!startPos.current || !timerRef.current) return;
    const touch = e.touches[0];
    const dx = Math.abs(touch.clientX - startPos.current.x);
    const dy = Math.abs(touch.clientY - startPos.current.y);
    // Cancel long press if user moves finger (scrolling)
    if (dx > 10 || dy > 10) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const end = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      // Only trigger tap if it was NOT a long press
      if (!isLongPress.current && onPress) {
        // Prevent ghost click on touch devices
        if ('touches' in e) {
          e.preventDefault();
        }
        onPress();
      }
      startPos.current = null;
    },
    [onPress]
  );

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    startPos.current = null;
  }, []);

  return {
    onTouchStart: start,
    onTouchMove: move,
    onTouchEnd: end,
    onTouchCancel: cancel,
    // For mouse (desktop) fallback – optional
    onMouseDown: start,
    onMouseUp: end,
    onMouseLeave: cancel,
  };
}
