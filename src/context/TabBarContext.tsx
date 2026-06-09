import React, { createContext, useContext, useRef, useCallback } from 'react';
import { Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { layout } from '../theme';

interface TabBarContextValue {
  tabBarTranslate: Animated.Value;
  onTabBarScroll: (event: { nativeEvent: { contentOffset: { y: number } } }) => void;
  onTabBarScrollEnd: (event: { nativeEvent: { contentOffset: { y: number } } }) => void;
  totalTabBarHeight: number;
}

const TabBarContext = createContext<TabBarContextValue>({} as TabBarContextValue);

export function TabBarProvider({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const totalTabBarHeight = layout.tabBarHeight + insets.bottom;
  const tabBarTranslate = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const isHidden = useRef(false);

  const snapTo = useCallback(
    (hidden: boolean) => {
      isHidden.current = hidden;
      Animated.timing(tabBarTranslate, {
        toValue: hidden ? totalTabBarHeight : 0,
        duration: 180,
        useNativeDriver: true,
      }).start();
    },
    [tabBarTranslate, totalTabBarHeight],
  );

  const onTabBarScroll = useCallback(
    (event: { nativeEvent: { contentOffset: { y: number } } }) => {
      const y = event.nativeEvent.contentOffset.y;
      const diff = y - lastScrollY.current;
      if (diff > 5 && y > layout.tabBarHeight) snapTo(true);
      else if (diff < -5) snapTo(false);
      lastScrollY.current = y;
    },
    [snapTo],
  );

  const onTabBarScrollEnd = useCallback(
    (event: { nativeEvent: { contentOffset: { y: number } } }) => {
      const y = event.nativeEvent.contentOffset.y;
      if (y <= layout.tabBarHeight) snapTo(false);
      else snapTo(isHidden.current);
    },
    [snapTo],
  );

  return (
    <TabBarContext.Provider value={{ tabBarTranslate, onTabBarScroll, onTabBarScrollEnd, totalTabBarHeight }}>
      {children}
    </TabBarContext.Provider>
  );
}

export function useTabBar() {
  return useContext(TabBarContext);
}
