import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    zIndex: 999,
    backgroundColor: '#000000',
  },
  image: {
    width,
    height,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 80,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  title: {
    color: '#97CE4C',
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 5,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.85)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 13,
    letterSpacing: 3,
    textAlign: 'center',
    marginTop: 8,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});
