import { useRef, useCallback } from 'react';
import { Animated } from 'react-native';

const HEADER_HEIGHT = 60;

function useScrollHeader() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const headerTranslate = useRef(new Animated.Value(0)).current;

  const onScroll = useCallback(
    (event: { nativeEvent: { contentOffset: { y: number } } }) => {
      const currentY = event.nativeEvent.contentOffset.y;
      const diff = currentY - lastScrollY.current;

      if (diff > 5 && currentY > HEADER_HEIGHT) {
        Animated.timing(headerTranslate, {
          toValue: -HEADER_HEIGHT,
          duration: 200,
          useNativeDriver: true,
        }).start();
      } else if (diff < -5) {
        Animated.timing(headerTranslate, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }

      lastScrollY.current = currentY;
    },
    [headerTranslate],
  );

  return { scrollY, headerTranslate, onScroll, HEADER_HEIGHT };
}

export default useScrollHeader;
