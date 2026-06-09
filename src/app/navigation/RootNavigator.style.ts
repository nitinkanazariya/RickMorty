import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  iconWrap: {
    width: 48,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
  },
});
