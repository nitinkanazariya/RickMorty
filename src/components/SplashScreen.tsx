import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Image, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

type Props = {
  onFinish: () => void;
};

export default function SplashScreen({ onFinish }: Props) {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(onFinish);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Image
        source={require('../../assets/splash.jpg')}
        style={styles.image}
        resizeMode="cover"
      />  
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    zIndex: 999,
    backgroundColor: '#000000',
  },
  image: {
    width,
    height,
  },
});
