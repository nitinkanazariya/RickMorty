import { StyleSheet } from 'react-native';
import type { Colors, Shadows } from '../../../theme/ThemeContext';
import { typography, spacing, radii } from '../../../theme';

export function makeStyles(c: Colors, s: Shadows) {
  return StyleSheet.create({
    card: {
      flexDirection: 'row',
      backgroundColor: c.surface,
      borderRadius: radii.lg,
      marginBottom: spacing.md,
      overflow: 'hidden',
      borderWidth: 1.5,
      borderColor: c.border,
      ...s.card,
    },
    statusStripe: { width: 4 },
    imageWrapper: { position: 'relative' },
    imagePlaceholder: { backgroundColor: c.surfaceDeep, position: 'absolute' },
    hidden: { opacity: 0, position: 'absolute' },
    badgeRow: {
      position: 'absolute',
      bottom: 0, left: 0, right: 0,
      alignItems: 'center',
      paddingVertical: 5,
    },
    badge: {
      flexDirection: 'row', alignItems: 'center', gap: 4,
      paddingHorizontal: 10, paddingVertical: 3, borderRadius: radii.full,
    },
    badgeText: { fontSize: 9, fontWeight: '900', letterSpacing: 1.4 },
    info: { flex: 1, padding: spacing.md, justifyContent: 'center' },
    name: { color: c.textPrimary, fontWeight: '800', fontSize: typography.md, marginBottom: 2 },
    species: { color: c.accentBlue, fontSize: typography.sm, fontWeight: '600', marginBottom: spacing.sm },
    divider: { height: 1, backgroundColor: c.border, marginBottom: spacing.sm },
    label: { color: c.textDisabled, fontSize: typography.xs, marginBottom: 2, letterSpacing: 0.5 },
    locationText: { color: c.textSecondary, fontSize: typography.sm },
  });
}
