import { StyleSheet } from 'react-native';
import type { Colors, Shadows } from '../../../theme/ThemeContext';
import { typography, spacing, radii } from '../../../theme';

export function makeStyles(c: Colors, s: Shadows) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: c.background },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: c.background },
    statusBarBg: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 11, backgroundColor: c.surfaceElevated },
    header: {
      position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
      backgroundColor: c.surfaceElevated, flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: spacing.lg, borderBottomWidth: 1.5, borderBottomColor: c.accent + '55',
    },
    headerTitle: { color: c.textPrimary, fontSize: typography.xxl, fontWeight: '800', flex: 1 },
    themeBtn: {
      width: 36, height: 36, borderRadius: radii.full, backgroundColor: c.surface,
      justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: c.border,
    },
    row: { gap: spacing.md, marginBottom: spacing.md },
    card: {
      flex: 1, backgroundColor: c.surface, borderRadius: radii.lg,
      padding: spacing.md, borderWidth: 1.5, borderColor: c.border, ...s.card,
    },
    cardHeader: { marginBottom: spacing.sm },
    name: { color: c.textPrimary, fontWeight: '800', fontSize: typography.base },
    typePill: {
      alignSelf: 'flex-start', backgroundColor: c.accentDim, borderRadius: radii.full,
      paddingHorizontal: spacing.sm, paddingVertical: 2, marginBottom: spacing.sm, borderWidth: 1, borderColor: c.accent,
    },
    type: { color: c.accent, fontSize: typography.xs, fontWeight: '700' },
    dimension: { color: c.textMuted, fontSize: typography.xs, marginBottom: spacing.xs },
    residents: { color: c.textDisabled, fontSize: typography.xs },
    errorText: { color: c.error, fontSize: typography.lg, marginBottom: spacing.md },
    retryBtn: {
      backgroundColor: c.accentDim, paddingHorizontal: spacing.xxl, paddingVertical: 10,
      borderRadius: radii.full, borderWidth: 1.5, borderColor: c.accent,
    },
    retryText: { color: c.accent, fontWeight: '700' },
  });
}
