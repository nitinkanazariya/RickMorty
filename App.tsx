import React, { useEffect, useMemo } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { initDatabase } from './src/utils/database';
import { loadFavourites } from './src/store/slices/favouritesSlice';
import RootNavigator from './src/app/navigation/RootNavigator';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2, staleTime: 1000 * 60 * 5 } },
});

function AppContent() {
  const { colors, isDark } = useTheme();

  const navTheme = useMemo(
    () => ({ ...DefaultTheme, colors: { ...DefaultTheme.colors, background: colors.background } }),
    [colors.background],
  );

  useEffect(() => {
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content', true);
    initDatabase().then(() => store.dispatch(loadFavourites()));
  }, [isDark]);

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.surfaceElevated}
        translucent={false}
      />
      <RootNavigator />
    </NavigationContainer>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <AppContent />
          </QueryClientProvider>
        </Provider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;
