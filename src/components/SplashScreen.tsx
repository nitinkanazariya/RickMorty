import React, { useEffect, useRef } from 'react';
import { Animated, Image, Text, View } from 'react-native';
import { styles } from './SplashScreen.style';

const AnimatedImage = Animated.createAnimatedComponent(Image);

type Props = {
  onFinish: () => void;
};

export default function SplashScreen({ onFinish }: Props) {
  const screenOpacity = useRef(new Animated.Value(1)).current;
  const imageScale = useRef(new Animated.Value(1.1)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(imageScale, { toValue: 1, duration: 2400, useNativeDriver: true }),
      Animated.sequence([
        Animated.delay(500),
        Animated.parallel([
          Animated.timing(titleOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.timing(titleY, { toValue: 0, duration: 500, useNativeDriver: true }),
        ]),
      ]),
    ]).start();

    const timer = setTimeout(() => {
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(onFinish);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      <AnimatedImage
        source={require('../../assets/splash.jpg')}
        style={[styles.image, { transform: [{ scale: imageScale }] }]}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <Animated.View style={{ opacity: titleOpacity, transform: [{ translateY: titleY }] }}>
          <Text style={styles.title}>RICK & MORTY</Text>
          <Text style={styles.subtitle}>Universe of Characters</Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}
