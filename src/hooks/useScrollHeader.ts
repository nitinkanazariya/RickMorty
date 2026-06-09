import { useRef, useCallback } from 'react';
import { Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { layout } from '../theme';

function useScrollHeader() {
  const insets = useSafeAreaInsets();
  const HEADER_HEIGHT = layout.headerHeight + insets.top;

  const lastScrollY = useRef(0);
  const headerTranslate = useRef(new Animated.Value(0)).current;
  const isHidden = useRef(false);

  const snapTo = useCallback(
    (hidden: boolean, instant = false) => {
      isHidden.current = hidden;
      Animated.timing(headerTranslate, {
        toValue: hidden ? -HEADER_HEIGHT : 0,
        duration: instant ? 0 : 150,
        useNativeDriver: true,
      }).start();
    },
    [headerTranslate, HEADER_HEIGHT],
  );

  const onScroll = useCallback(
    (event: { nativeEvent: { contentOffset: { y: number } } }) => {
      const currentY = event.nativeEvent.contentOffset.y;
      const diff = currentY - lastScrollY.current;

      if (diff > 5 && currentY > HEADER_HEIGHT) {
        snapTo(true);
      } else if (diff < -5) {
        snapTo(false);
      }

      lastScrollY.current = currentY;
    },
    [snapTo, HEADER_HEIGHT],
  );

  const onScrollEnd = useCallback(
    (event: { nativeEvent: { contentOffset: { y: number } } }) => {
      const currentY = event.nativeEvent.contentOffset.y;
      if (currentY <= HEADER_HEIGHT) {
        snapTo(false, true);
      } else {
        snapTo(isHidden.current, true);
      }
    },
    [snapTo, HEADER_HEIGHT],
  );

  return { headerTranslate, onScroll, onScrollEnd, HEADER_HEIGHT, topInset: insets.top };
}

export default useScrollHeader;
