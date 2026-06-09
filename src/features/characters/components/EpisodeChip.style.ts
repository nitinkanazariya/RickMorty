import { StyleSheet } from 'react-native';
import type { Colors } from '../../../theme/ThemeContext';
import { typography, spacing, radii } from '../../../theme';

export function makeStyles(c: Colors) {
  return StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.surface,
      borderRadius: radii.lg,
      padding: spacing.md,
      marginHorizontal: spacing.lg,
      marginBottom: spacing.sm,
      borderWidth: 1,
      borderColor: c.border,
      gap: spacing.md,
    },
    skeleton: {
      height: 56,
      backgroundColor: c.surface,
      borderRadius: radii.lg,
      marginHorizontal: spacing.lg,
      marginBottom: spacing.sm,
      borderWidth: 1,
      borderColor: c.border,
    },
    badge: {
      backgroundColor: c.accentDim,
      borderRadius: radii.sm,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      minWidth: 52,
      alignItems: 'center',
    },
    badgeText: {
      color: c.accent,
      fontSize: typography.sm,
      fontWeight: '800',
    },
    info: { flex: 1 },
    name: { color: c.textPrimary, fontSize: typography.base, fontWeight: '600', marginBottom: 2 },
    airDate: { color: c.textMuted, fontSize: typography.sm },
  });
}
