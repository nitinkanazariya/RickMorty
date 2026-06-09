import { StyleSheet } from 'react-native';
import { typography, spacing, radii } from '../theme';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radii.full,
    borderWidth: 1,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  text: {
    fontSize: typography.base,
    fontWeight: '600',
  },
});
